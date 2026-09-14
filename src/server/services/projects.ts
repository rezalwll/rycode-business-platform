import "server-only";

import { randomUUID } from "node:crypto";

import type { Actor } from "@/server/auth/permissions";
import { hasPermission, requirePermission, requireProjectAccess } from "@/server/auth/permissions";
import { writeAudit } from "@/server/repositories/audit";
import { inTransaction } from "@/server/repositories/database";
import { ServiceError } from "@/server/services/errors";

import {
  approveMilestoneSchema,
  createMilestoneSchema,
  createProjectSchema,
  updateMilestoneSchema,
  updateProjectSchema,
} from "@/features/business/schemas";
import {
  assertMilestoneTransition,
  assertProjectTransition,
  milestoneStatusForDecision,
} from "@/features/business/transitions";

function projectNumber(): string {
  return `RY-${new Date().getUTCFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`;
}

function dateValue(value: Date | null | undefined): string | null {
  return value ? value.toISOString() : null;
}

export async function createProject(actor: Actor, rawInput: unknown) {
  requirePermission(actor, "projects.manage");
  const input = createProjectSchema.parse(rawInput);

  return inTransaction(async (transaction) => {
    const client = await transaction.client.findFirst({
      where: { id: input.clientId, isActive: true, archivedAt: null },
      select: { id: true },
    });
    if (!client) throw new ServiceError("NOT_FOUND");

    const project = await transaction.project.create({
      data: {
        clientId: client.id,
        number: input.number ?? projectNumber(),
        name: input.name,
        status: input.status,
        progress: input.progress,
        ...(input.slug ? { slug: input.slug } : {}),
        ...(input.scope ? { scope: input.scope } : {}),
        ...(input.startDate ? { startDate: input.startDate } : {}),
        ...(input.expectedEndDate ? { expectedEndDate: input.expectedEndDate } : {}),
        ...(input.status === "COMPLETED" ? { completedAt: new Date(), progress: 100 } : {}),
        activities: {
          create: {
            actorId: actor.userId,
            type: "project_created",
            description: "Project created.",
            visibility: "CLIENT",
          },
        },
      },
      select: { id: true, clientId: true, number: true, status: true },
    });
    await writeAudit(transaction, {
      actorUserId: actor.userId,
      action: "project.created",
      entityType: "project",
      entityId: project.id,
      after: { clientId: project.clientId, number: project.number, status: project.status },
    });
    return project;
  });
}

export async function updateProject(actor: Actor, rawInput: unknown) {
  requirePermission(actor, "projects.manage");
  const input = updateProjectSchema.parse(rawInput);

  return inTransaction(async (transaction) => {
    const current = await transaction.project.findUnique({
      where: { id: input.projectId },
      select: {
        id: true,
        clientId: true,
        name: true,
        slug: true,
        scope: true,
        status: true,
        progress: true,
        startDate: true,
        expectedEndDate: true,
        latestUpdate: true,
        clientAction: true,
        internalNote: true,
      },
    });
    if (!current) throw new ServiceError("NOT_FOUND");
    if (input.status) assertProjectTransition(current.status, input.status);

    const startDate = input.startDate === undefined ? current.startDate : input.startDate;
    const expectedEndDate =
      input.expectedEndDate === undefined ? current.expectedEndDate : input.expectedEndDate;
    if (startDate && expectedEndDate && startDate > expectedEndDate) {
      throw new ServiceError("INVALID_INPUT", "تاریخ پایان پروژه نمی‌تواند قبل از شروع باشد.");
    }

    const status = input.status ?? current.status;
    const updated = await transaction.project.update({
      where: { id: current.id },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.slug !== undefined ? { slug: input.slug } : {}),
        ...(input.scope !== undefined ? { scope: input.scope } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
        ...(input.progress !== undefined ? { progress: input.progress } : {}),
        ...(input.startDate !== undefined ? { startDate: input.startDate } : {}),
        ...(input.expectedEndDate !== undefined ? { expectedEndDate: input.expectedEndDate } : {}),
        ...(input.latestUpdate !== undefined ? { latestUpdate: input.latestUpdate } : {}),
        ...(input.clientAction !== undefined ? { clientAction: input.clientAction } : {}),
        ...(input.internalNote !== undefined ? { internalNote: input.internalNote } : {}),
        ...(status === "COMPLETED"
          ? { completedAt: new Date(), progress: 100 }
          : current.status === "COMPLETED"
            ? { completedAt: null }
            : {}),
        activities: {
          create: {
            actorId: actor.userId,
            type:
              input.status && input.status !== current.status
                ? "status_changed"
                : "project_updated",
            description:
              input.status && input.status !== current.status
                ? `Project status changed from ${current.status} to ${input.status}.`
                : "Project details updated.",
            visibility: "CLIENT",
          },
        },
      },
      select: { id: true, status: true, progress: true, updatedAt: true },
    });
    await writeAudit(transaction, {
      actorUserId: actor.userId,
      action: "project.updated",
      entityType: "project",
      entityId: current.id,
      before: {
        name: current.name,
        slug: current.slug,
        status: current.status,
        progress: current.progress,
        startDate: dateValue(current.startDate),
        expectedEndDate: dateValue(current.expectedEndDate),
      },
      after: { status: updated.status, progress: updated.progress },
    });
    return updated;
  });
}

export async function createMilestone(actor: Actor, rawInput: unknown) {
  requirePermission(actor, "projects.manage");
  const input = createMilestoneSchema.parse(rawInput);
  if (input.status === "APPROVED") {
    throw new ServiceError("INVALID_INPUT", "تأیید مایلستون فقط از مسیر تأیید مجاز است.");
  }
  if (input.status === "AWAITING_APPROVAL" && !input.approvalRequired) {
    throw new ServiceError(
      "INVALID_INPUT",
      "مایلستون بدون نیاز به تأیید نمی‌تواند منتظر تأیید باشد.",
    );
  }

  return inTransaction(async (transaction) => {
    const project = await transaction.project.findUnique({
      where: { id: input.projectId },
      select: { id: true, clientId: true, archivedAt: true },
    });
    if (!project || project.archivedAt) throw new ServiceError("NOT_FOUND");

    const milestone = await transaction.milestone.create({
      data: {
        projectId: project.id,
        kind: input.kind,
        title: input.title,
        status: input.status,
        position: input.position,
        progress: input.status === "COMPLETED" ? 100 : input.progress,
        approvalRequired: input.approvalRequired,
        ...(input.description ? { description: input.description } : {}),
        ...(input.startDate ? { startDate: input.startDate } : {}),
        ...(input.expectedEndDate ? { expectedEndDate: input.expectedEndDate } : {}),
        ...(input.status === "COMPLETED" ? { completedAt: new Date() } : {}),
      },
      select: { id: true, projectId: true, status: true, position: true },
    });
    await transaction.projectActivity.create({
      data: {
        projectId: project.id,
        actorId: actor.userId,
        type: "milestone_created",
        description: `Milestone “${input.title}” created.`,
        visibility: "CLIENT",
        metadata: { milestoneId: milestone.id },
      },
    });
    await writeAudit(transaction, {
      actorUserId: actor.userId,
      action: "milestone.created",
      entityType: "milestone",
      entityId: milestone.id,
      after: { projectId: project.id, status: milestone.status, position: milestone.position },
    });
    return milestone;
  });
}

export async function updateMilestone(actor: Actor, rawInput: unknown) {
  requirePermission(actor, "projects.manage");
  const input = updateMilestoneSchema.parse(rawInput);
  if (input.status === "APPROVED") {
    throw new ServiceError("INVALID_INPUT", "تأیید مایلستون فقط از مسیر تأیید مجاز است.");
  }

  return inTransaction(async (transaction) => {
    const current = await transaction.milestone.findUnique({
      where: { id: input.milestoneId },
      include: { project: { select: { id: true, clientId: true } } },
    });
    if (!current) throw new ServiceError("NOT_FOUND");
    if (input.status) assertMilestoneTransition(current.status, input.status);

    const approvalRequired = input.approvalRequired ?? current.approvalRequired;
    if (input.status === "AWAITING_APPROVAL" && !approvalRequired) {
      throw new ServiceError(
        "INVALID_INPUT",
        "مایلستون بدون نیاز به تأیید نمی‌تواند منتظر تأیید باشد.",
      );
    }

    const startDate = input.startDate === undefined ? current.startDate : input.startDate;
    const expectedEndDate =
      input.expectedEndDate === undefined ? current.expectedEndDate : input.expectedEndDate;
    if (startDate && expectedEndDate && startDate > expectedEndDate) {
      throw new ServiceError("INVALID_INPUT", "تاریخ پایان مایلستون نمی‌تواند قبل از شروع باشد.");
    }

    const status = input.status ?? current.status;
    const updated = await transaction.milestone.update({
      where: { id: current.id },
      data: {
        ...(input.kind !== undefined ? { kind: input.kind } : {}),
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
        ...(input.position !== undefined ? { position: input.position } : {}),
        ...(input.progress !== undefined ? { progress: input.progress } : {}),
        ...(input.startDate !== undefined ? { startDate: input.startDate } : {}),
        ...(input.expectedEndDate !== undefined ? { expectedEndDate: input.expectedEndDate } : {}),
        ...(input.approvalRequired !== undefined
          ? { approvalRequired: input.approvalRequired }
          : {}),
        ...(status === "COMPLETED"
          ? { completedAt: new Date(), progress: 100 }
          : current.status === "COMPLETED"
            ? { completedAt: null }
            : {}),
      },
      select: { id: true, projectId: true, status: true, progress: true },
    });
    await transaction.projectActivity.create({
      data: {
        projectId: current.projectId,
        actorId: actor.userId,
        type: "milestone_updated",
        description: `Milestone “${input.title ?? current.title}” updated.`,
        visibility: "CLIENT",
        metadata: { milestoneId: current.id },
      },
    });
    await writeAudit(transaction, {
      actorUserId: actor.userId,
      action: "milestone.updated",
      entityType: "milestone",
      entityId: current.id,
      before: { status: current.status, progress: current.progress, position: current.position },
      after: { status: updated.status, progress: updated.progress },
    });
    return updated;
  });
}

export async function approveMilestone(actor: Actor, rawInput: unknown) {
  requirePermission(actor, "milestones.approve");
  const input = approveMilestoneSchema.parse(rawInput);

  return inTransaction(async (transaction) => {
    const milestone = await transaction.milestone.findUnique({
      where: { id: input.milestoneId },
      include: {
        project: {
          select: {
            id: true,
            clientId: true,
            archivedAt: true,
            client: { select: { isActive: true, archivedAt: true } },
          },
        },
        approvals: {
          where: { userId: actor.userId },
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { id: true, decision: true },
        },
      },
    });
    if (!milestone) throw new ServiceError("NOT_FOUND");
    if (
      milestone.project.archivedAt !== null ||
      !milestone.project.client.isActive ||
      milestone.project.client.archivedAt !== null
    ) {
      throw new ServiceError("NOT_FOUND");
    }
    requireProjectAccess(actor, milestone.project);

    const staffCanApprove = hasPermission(actor, "projects.manage");
    if (!staffCanApprove) {
      const membership = await transaction.projectMember.findUnique({
        where: { projectId_userId: { projectId: milestone.projectId, userId: actor.userId } },
        select: { role: true },
      });
      if (membership?.role !== "CLIENT_APPROVER") {
        throw new ServiceError("FORBIDDEN");
      }
      const activeClientMembership = await transaction.clientMember.findUnique({
        where: {
          clientId_userId: {
            clientId: milestone.project.clientId,
            userId: actor.userId,
          },
        },
        select: { userId: true },
      });
      if (!activeClientMembership) throw new ServiceError("FORBIDDEN");
    }

    const previousApproval = milestone.approvals[0];
    if (milestone.status !== "AWAITING_APPROVAL" && previousApproval?.decision === input.decision) {
      return {
        id: milestone.id,
        status: milestone.status,
        approvalId: previousApproval.id,
        reused: true,
      };
    }
    if (!milestone.approvalRequired || milestone.status !== "AWAITING_APPROVAL") {
      throw new ServiceError("INVALID_STATE", "این مایلستون اکنون منتظر تأیید نیست.");
    }

    const nextStatus = milestoneStatusForDecision(input.decision);
    assertMilestoneTransition(milestone.status, nextStatus);
    const approval = await transaction.milestoneApproval.create({
      data: {
        milestoneId: milestone.id,
        userId: actor.userId,
        decision: input.decision,
        ...(input.note ? { note: input.note } : {}),
      },
      select: { id: true },
    });
    await transaction.milestone.update({
      where: { id: milestone.id },
      data: { status: nextStatus, ...(nextStatus === "APPROVED" ? { progress: 100 } : {}) },
    });
    await transaction.projectActivity.create({
      data: {
        projectId: milestone.projectId,
        actorId: actor.userId,
        type: "milestone_approval",
        description: `Milestone approval decision: ${input.decision}.`,
        visibility: "CLIENT",
        metadata: { milestoneId: milestone.id, approvalId: approval.id },
      },
    });
    await writeAudit(transaction, {
      actorUserId: actor.userId,
      action: "milestone.approval_recorded",
      entityType: "milestone",
      entityId: milestone.id,
      before: { status: milestone.status },
      after: { status: nextStatus, decision: input.decision, approvalId: approval.id },
    });
    return { id: milestone.id, status: nextStatus, approvalId: approval.id, reused: false };
  });
}
