import "server-only";

import type { Actor } from "@/server/auth/permissions";
import { requirePermission } from "@/server/auth/permissions";
import { writeAudit } from "@/server/repositories/audit";
import { inTransaction } from "@/server/repositories/database";
import { lockLead } from "@/server/repositories/locks";
import { ServiceError } from "@/server/services/errors";

import {
  addLeadNoteSchema,
  assignLeadSchema,
  convertLeadSchema,
  updateLeadStatusSchema,
} from "@/features/business/schemas";
import { assertLeadTransition } from "@/features/business/transitions";

export async function updateLeadStatus(actor: Actor, rawInput: unknown) {
  requirePermission(actor, "leads.manage");
  const input = updateLeadStatusSchema.parse(rawInput);

  return inTransaction(async (transaction) => {
    const lead = await transaction.lead.findUnique({
      where: { id: input.leadId },
      select: { id: true, status: true },
    });
    if (!lead) throw new ServiceError("NOT_FOUND");

    assertLeadTransition(lead.status, input.status);
    if (lead.status === input.status) return { id: lead.id, status: lead.status, changed: false };

    const updated = await transaction.lead.update({
      where: { id: lead.id },
      data: {
        status: input.status,
        activities: {
          create: {
            actorId: actor.userId,
            type: "STATUS_CHANGED",
            fromStatus: lead.status,
            toStatus: input.status,
            ...(input.note ? { note: input.note } : {}),
          },
        },
      },
      select: { id: true, status: true },
    });

    await writeAudit(transaction, {
      actorUserId: actor.userId,
      action: "lead.status_changed",
      entityType: "lead",
      entityId: lead.id,
      before: { status: lead.status },
      after: { status: updated.status },
    });
    return { ...updated, changed: true };
  });
}

export async function addLeadNote(actor: Actor, rawInput: unknown) {
  requirePermission(actor, "leads.manage");
  const input = addLeadNoteSchema.parse(rawInput);

  return inTransaction(async (transaction) => {
    const lead = await transaction.lead.findUnique({
      where: { id: input.leadId },
      select: { id: true },
    });
    if (!lead) throw new ServiceError("NOT_FOUND");

    const activity = await transaction.leadActivity.create({
      data: { leadId: lead.id, actorId: actor.userId, type: "NOTE_ADDED", note: input.note },
      select: { id: true, createdAt: true },
    });
    await writeAudit(transaction, {
      actorUserId: actor.userId,
      action: "lead.note_added",
      entityType: "lead",
      entityId: lead.id,
      metadata: { activityId: activity.id },
    });
    return activity;
  });
}

export async function assignLead(actor: Actor, rawInput: unknown) {
  requirePermission(actor, "leads.manage");
  const input = assignLeadSchema.parse(rawInput);

  return inTransaction(async (transaction) => {
    const lead = await transaction.lead.findUnique({
      where: { id: input.leadId },
      select: { id: true, ownerId: true },
    });
    if (!lead) throw new ServiceError("NOT_FOUND");

    if (input.ownerId) {
      const staff = await transaction.user.findFirst({
        where: {
          id: input.ownerId,
          roles: { some: { role: { key: { not: "customer" } } } },
        },
        select: { id: true },
      });
      if (!staff)
        throw new ServiceError("INVALID_INPUT", "مالک لید باید یک کاربر داخلی فعال باشد.");
    }

    if (lead.ownerId === input.ownerId)
      return { id: lead.id, ownerId: lead.ownerId, changed: false };

    const updated = await transaction.lead.update({
      where: { id: lead.id },
      data: {
        ownerId: input.ownerId,
        activities: {
          create: {
            actorId: actor.userId,
            type: "ASSIGNED",
            metadata: { previousOwnerId: lead.ownerId, ownerId: input.ownerId },
          },
        },
      },
      select: { id: true, ownerId: true },
    });
    await writeAudit(transaction, {
      actorUserId: actor.userId,
      action: "lead.assigned",
      entityType: "lead",
      entityId: lead.id,
      before: { ownerId: lead.ownerId },
      after: { ownerId: updated.ownerId },
    });
    return { ...updated, changed: true };
  });
}

export async function convertLeadToProject(actor: Actor, rawInput: unknown) {
  requirePermission(actor, "leads.manage");
  requirePermission(actor, "clients.manage");
  requirePermission(actor, "projects.manage");
  const input = convertLeadSchema.parse(rawInput);

  return inTransaction(async (transaction) => {
    await lockLead(transaction, input.leadId);
    const lead = await transaction.lead.findUnique({
      where: { id: input.leadId },
      include: { convertedProject: { select: { id: true, clientId: true, number: true } } },
    });
    if (!lead) throw new ServiceError("NOT_FOUND");
    if (lead.convertedProject) return { ...lead.convertedProject, reused: true };
    if (["LOST", "SPAM", "ARCHIVED"].includes(lead.status)) {
      throw new ServiceError("INVALID_STATE", "این لید در وضعیت قابل تبدیل نیست.");
    }

    let clientId = input.clientId ?? lead.clientId;
    if (clientId) {
      const client = await transaction.client.findFirst({
        where: { id: clientId, isActive: true, archivedAt: null },
        select: { id: true },
      });
      if (!client) throw new ServiceError("NOT_FOUND");
    } else {
      const clientData = input.client;
      if (clientData?.memberUserId) {
        const member = await transaction.user.findUnique({
          where: { id: clientData.memberUserId },
          select: { id: true },
        });
        if (!member) throw new ServiceError("INVALID_INPUT", "عضو انتخاب‌شده معتبر نیست.");
      }
      const client = await transaction.client.create({
        data: {
          kind: lead.company || clientData?.legalName ? "ORGANIZATION" : "INDIVIDUAL",
          displayName: clientData?.displayName ?? lead.company ?? lead.name,
          ...(clientData?.legalName ? { legalName: clientData.legalName } : {}),
          ...((clientData?.email ?? lead.email) ? { email: clientData?.email ?? lead.email } : {}),
          ...((clientData?.phone ?? lead.phone) ? { phone: clientData?.phone ?? lead.phone } : {}),
          ...(clientData?.memberUserId
            ? {
                members: {
                  create: {
                    userId: clientData.memberUserId,
                    role: "OWNER",
                    isPrimary: true,
                  },
                },
              }
            : {}),
        },
        select: { id: true },
      });
      clientId = client.id;
    }

    const year = new Date().getUTCFullYear();
    const number =
      input.project.number ?? `RY-${year}-${lead.id.replaceAll("-", "").slice(0, 8).toUpperCase()}`;
    const project = await transaction.project.create({
      data: {
        clientId,
        originLeadId: lead.id,
        number,
        name: input.project.name,
        status: input.project.status,
        ...(input.project.slug ? { slug: input.project.slug } : {}),
        ...(input.project.scope ? { scope: input.project.scope } : {}),
        ...(input.project.startDate ? { startDate: input.project.startDate } : {}),
        ...(input.project.expectedEndDate
          ? { expectedEndDate: input.project.expectedEndDate }
          : {}),
        activities: {
          create: {
            actorId: actor.userId,
            type: "project_created_from_lead",
            description: "Project created by converting a qualified lead.",
            visibility: "INTERNAL",
            metadata: { leadId: lead.id },
          },
        },
      },
      select: { id: true, clientId: true, number: true },
    });

    await transaction.lead.update({
      where: { id: lead.id },
      data: {
        clientId,
        status: "WON",
        activities: {
          create: {
            actorId: actor.userId,
            type: "CONVERTED",
            fromStatus: lead.status,
            toStatus: "WON",
            metadata: { projectId: project.id, clientId },
          },
        },
      },
    });
    await writeAudit(transaction, {
      actorUserId: actor.userId,
      action: "lead.converted",
      entityType: "lead",
      entityId: lead.id,
      before: { status: lead.status, clientId: lead.clientId },
      after: { status: "WON", clientId, projectId: project.id },
    });
    await writeAudit(transaction, {
      actorUserId: actor.userId,
      action: "project.created",
      entityType: "project",
      entityId: project.id,
      after: { clientId, originLeadId: lead.id, number: project.number },
    });

    return { ...project, reused: false };
  });
}
