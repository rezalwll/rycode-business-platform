import "server-only";

import type { Prisma } from "@/generated/prisma/client";

import type { Transaction } from "./database";

type AuditInput = {
  actorUserId: string;
  action: string;
  entityType: string;
  entityId?: string;
  before?: Prisma.InputJsonValue;
  after?: Prisma.InputJsonValue;
  metadata?: Prisma.InputJsonValue;
};

export async function writeAudit(transaction: Transaction, input: AuditInput): Promise<void> {
  await transaction.auditLog.create({
    data: {
      actorUserId: input.actorUserId,
      action: input.action,
      entityType: input.entityType,
      ...(input.entityId ? { entityId: input.entityId } : {}),
      ...(input.before !== undefined ? { before: input.before } : {}),
      ...(input.after !== undefined ? { after: input.after } : {}),
      ...(input.metadata !== undefined ? { metadata: input.metadata } : {}),
    },
  });
}
