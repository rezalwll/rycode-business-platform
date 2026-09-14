import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { saveClientSchema, setClientMembersSchema } from "@/features/business/schemas";
import type { Actor } from "@/server/auth/permissions";
import { requirePermission } from "@/server/auth/permissions";
import { writeAudit } from "@/server/repositories/audit";
import { inTransaction } from "@/server/repositories/database";
import { ServiceError } from "@/server/services/errors";

export async function saveClient(actor: Actor, rawInput: unknown) {
  requirePermission(actor, "clients.manage");
  const input = saveClientSchema.parse(rawInput);

  return inTransaction(async (transaction) => {
    const previous = input.clientId
      ? await transaction.client.findUnique({
          where: { id: input.clientId },
          select: { displayName: true, isActive: true },
        })
      : null;
    if (input.clientId && !previous) throw new ServiceError("NOT_FOUND");
    const billingAddress = input.billingAddress === null ? Prisma.JsonNull : input.billingAddress;
    const data = {
      kind: input.kind,
      displayName: input.displayName,
      legalName: input.legalName ?? null,
      email: input.email ?? null,
      phone: input.phone ?? null,
      taxId: input.taxId ?? null,
      billingAddress,
      isActive: input.isActive,
      archivedAt: input.isActive ? null : new Date(),
    };
    const client = input.clientId
      ? await transaction.client.update({
          where: { id: input.clientId },
          data,
          select: { id: true, displayName: true, isActive: true, updatedAt: true },
        })
      : await transaction.client.create({
          data,
          select: { id: true, displayName: true, isActive: true, updatedAt: true },
        });
    await writeAudit(transaction, {
      actorUserId: actor.userId,
      action: previous ? "client.updated" : "client.created",
      entityType: "client",
      entityId: client.id,
      before: previous ?? {},
      after: { displayName: client.displayName, isActive: client.isActive },
    });
    return client;
  });
}

export async function setClientMembers(actor: Actor, rawInput: unknown) {
  requirePermission(actor, "clients.manage");
  const input = setClientMembersSchema.parse(rawInput);

  return inTransaction(async (transaction) => {
    const [client, users, previous] = await Promise.all([
      transaction.client.findUnique({ where: { id: input.clientId }, select: { id: true } }),
      transaction.user.findMany({
        where: { id: { in: input.members.map(({ userId: memberUserId }) => memberUserId) } },
        select: { id: true },
      }),
      transaction.clientMember.findMany({
        where: { clientId: input.clientId },
        select: { userId: true, role: true, isPrimary: true },
      }),
    ]);
    if (!client) throw new ServiceError("NOT_FOUND");
    if (users.length !== input.members.length) {
      throw new ServiceError("INVALID_INPUT", "یک یا چند کاربر انتخاب‌شده معتبر نیست.");
    }

    await transaction.clientMember.deleteMany({ where: { clientId: client.id } });
    if (input.members.length > 0) {
      await transaction.clientMember.createMany({
        data: input.members.map((member) => ({ clientId: client.id, ...member })),
      });
    }
    await writeAudit(transaction, {
      actorUserId: actor.userId,
      action: "client.members_updated",
      entityType: "client",
      entityId: client.id,
      before: { members: previous },
      after: { members: input.members },
    });
    return { clientId: client.id, memberCount: input.members.length };
  });
}
