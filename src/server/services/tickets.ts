import "server-only";

import { randomUUID } from "node:crypto";

import type { Actor } from "@/server/auth/permissions";
import { canAccessProject, canAccessTicket, hasPermission } from "@/server/auth/permissions";
import { writeAudit } from "@/server/repositories/audit";
import { inTransaction, type Transaction } from "@/server/repositories/database";
import { ServiceError } from "@/server/services/errors";

import {
  createTicketSchema,
  replyTicketSchema,
  resolveTicketSchema,
} from "@/features/business/schemas";
import { ticketStatusAfterReply } from "@/features/business/transitions";

type TicketScope = {
  clientId: string;
  projectId: string | null;
  openedById: string;
  client: { isActive: boolean; archivedAt: Date | null };
  project: { archivedAt: Date | null } | null;
};

function isStaffTicketManager(actor: Actor): boolean {
  return hasPermission(actor, "tickets.manage");
}

function requireTicketScope(actor: Actor, ticket: TicketScope): void {
  if (isStaffTicketManager(actor)) return;
  if (!ticket.client.isActive || ticket.client.archivedAt || ticket.project?.archivedAt) {
    throw new ServiceError("FORBIDDEN");
  }
  if (!hasPermission(actor, "tickets.manage_own") || !canAccessTicket(actor, ticket)) {
    throw new ServiceError("FORBIDDEN");
  }
}

function ticketNumber(): string {
  return `T-${new Date().getUTCFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`;
}

async function notifyTicketParticipant(
  transaction: Transaction,
  input: { userId: string | null; actorId: string; ticketId: string; title: string },
): Promise<void> {
  if (!input.userId || input.userId === input.actorId) return;
  await transaction.notification.create({
    data: {
      userId: input.userId,
      kind: "TICKET",
      title: input.title,
      link: `/dashboard/support/${encodeURIComponent(input.ticketId)}`,
    },
  });
}

export async function createTicket(actor: Actor, rawInput: unknown) {
  const input = createTicketSchema.parse(rawInput);
  const staff = isStaffTicketManager(actor);
  if (!staff && !hasPermission(actor, "tickets.manage_own")) {
    throw new ServiceError("FORBIDDEN");
  }
  if (!staff && !actor.clientIds.includes(input.clientId)) {
    throw new ServiceError("FORBIDDEN");
  }

  return inTransaction(async (transaction) => {
    const client = await transaction.client.findFirst({
      where: { id: input.clientId, isActive: true, archivedAt: null },
      select: { id: true },
    });
    if (!client) throw new ServiceError("NOT_FOUND");

    if (input.projectId) {
      const project = await transaction.project.findFirst({
        where: { id: input.projectId, clientId: client.id, archivedAt: null },
        select: { id: true },
      });
      if (!project || (!staff && !canAccessProject(actor, { ...project, clientId: client.id }))) {
        throw new ServiceError("NOT_FOUND");
      }
    }

    const now = new Date();
    const ticket = await transaction.ticket.create({
      data: {
        clientId: client.id,
        ...(input.projectId ? { projectId: input.projectId } : {}),
        openedById: actor.userId,
        number: ticketNumber(),
        subject: input.subject,
        category: input.category,
        priority: input.priority,
        status: staff ? "WAITING_ON_CLIENT" : "WAITING_ON_STAFF",
        lastReplyAt: now,
        messages: {
          create: {
            authorId: actor.userId,
            visibility: "PUBLIC",
            body: input.body,
          },
        },
      },
      select: { id: true, number: true, status: true, clientId: true },
    });
    await writeAudit(transaction, {
      actorUserId: actor.userId,
      action: "ticket.created",
      entityType: "ticket",
      entityId: ticket.id,
      after: {
        clientId: ticket.clientId,
        projectId: input.projectId ?? null,
        number: ticket.number,
        status: ticket.status,
      },
    });
    return ticket;
  });
}

export async function replyToTicket(actor: Actor, rawInput: unknown) {
  const input = replyTicketSchema.parse(rawInput);

  return inTransaction(async (transaction) => {
    const ticket = await transaction.ticket.findUnique({
      where: { id: input.ticketId },
      select: {
        id: true,
        clientId: true,
        projectId: true,
        openedById: true,
        assignedToId: true,
        status: true,
        client: { select: { isActive: true, archivedAt: true } },
        project: { select: { archivedAt: true } },
      },
    });
    if (!ticket) throw new ServiceError("NOT_FOUND");
    requireTicketScope(actor, ticket);

    const staff = isStaffTicketManager(actor);
    if (!staff && input.visibility === "INTERNAL") throw new ServiceError("FORBIDDEN");
    if (ticket.status === "CLOSED") {
      throw new ServiceError("INVALID_STATE", "تیکت بسته‌شده قابل پاسخ‌گویی نیست.");
    }

    const status = input.visibility === "INTERNAL" ? ticket.status : ticketStatusAfterReply(staff);
    const now = new Date();
    const message = await transaction.ticketMessage.create({
      data: {
        ticketId: ticket.id,
        authorId: actor.userId,
        visibility: input.visibility,
        body: input.body,
      },
      select: { id: true, createdAt: true },
    });
    await transaction.ticket.update({
      where: { id: ticket.id },
      data: { status, lastReplyAt: now, closedAt: null },
    });

    if (input.visibility === "PUBLIC") {
      await notifyTicketParticipant(transaction, {
        userId: staff ? ticket.openedById : ticket.assignedToId,
        actorId: actor.userId,
        ticketId: ticket.id,
        title: "پاسخ جدید در تیکت پشتیبانی",
      });
    }
    await writeAudit(transaction, {
      actorUserId: actor.userId,
      action: "ticket.replied",
      entityType: "ticket",
      entityId: ticket.id,
      before: { status: ticket.status },
      after: { status, messageId: message.id, visibility: input.visibility },
    });
    return { ticketId: ticket.id, messageId: message.id, status, createdAt: message.createdAt };
  });
}

export async function resolveTicket(actor: Actor, rawInput: unknown) {
  const input = resolveTicketSchema.parse(rawInput);

  return inTransaction(async (transaction) => {
    const ticket = await transaction.ticket.findUnique({
      where: { id: input.ticketId },
      select: {
        id: true,
        clientId: true,
        projectId: true,
        openedById: true,
        assignedToId: true,
        status: true,
        client: { select: { isActive: true, archivedAt: true } },
        project: { select: { archivedAt: true } },
      },
    });
    if (!ticket) throw new ServiceError("NOT_FOUND");
    requireTicketScope(actor, ticket);
    if (ticket.status === "CLOSED") {
      throw new ServiceError("INVALID_STATE", "تیکت بسته‌شده قابل تغییر نیست.");
    }
    if (ticket.status === "RESOLVED")
      return { id: ticket.id, status: ticket.status, changed: false };

    await transaction.ticket.update({ where: { id: ticket.id }, data: { status: "RESOLVED" } });
    if (input.note) {
      await transaction.ticketMessage.create({
        data: {
          ticketId: ticket.id,
          authorId: actor.userId,
          visibility: "PUBLIC",
          body: input.note,
          isSystem: true,
        },
      });
    }
    await notifyTicketParticipant(transaction, {
      userId: isStaffTicketManager(actor) ? ticket.openedById : ticket.assignedToId,
      actorId: actor.userId,
      ticketId: ticket.id,
      title: "تیکت پشتیبانی حل شد",
    });
    await writeAudit(transaction, {
      actorUserId: actor.userId,
      action: "ticket.resolved",
      entityType: "ticket",
      entityId: ticket.id,
      before: { status: ticket.status },
      after: { status: "RESOLVED" },
    });
    return { id: ticket.id, status: "RESOLVED" as const, changed: true };
  });
}
