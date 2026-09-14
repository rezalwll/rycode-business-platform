import "server-only";

import { z } from "zod";

import { db } from "@/db/client";
import type { Prisma } from "@/generated/prisma/client";
import {
  hasAnyPermission,
  hasPermission,
  requireAnyPermission,
  type Actor,
} from "@/server/auth/permissions";

const uuid = z.string().uuid();

function projectMembershipScope(actor: Actor): Prisma.ProjectWhereInput {
  return {
    archivedAt: null,
    client: { isActive: true, archivedAt: null },
    ...(hasAnyPermission(actor, ["files.manage", "projects.read"])
      ? {}
      : {
          OR: [
            { members: { some: { userId: actor.userId } } },
            {
              client: {
                members: { some: { userId: actor.userId, role: { in: ["OWNER", "ADMIN"] } } },
              },
            },
          ],
        }),
  };
}

export async function customerTicketDetail(actor: Actor, ticketId: string) {
  requireAnyPermission(actor, ["tickets.manage_own", "tickets.read", "tickets.manage"]);
  if (!uuid.safeParse(ticketId).success) return null;
  const staff = hasAnyPermission(actor, ["tickets.read", "tickets.manage"]);
  return db.ticket.findFirst({
    where: {
      id: ticketId,
      client: { isActive: true, archivedAt: null },
      ...(staff
        ? {}
        : {
            OR: [
              { openedById: actor.userId, client: { members: { some: { userId: actor.userId } } } },
              {
                client: {
                  members: { some: { userId: actor.userId, role: { in: ["OWNER", "ADMIN"] } } },
                },
              },
              { project: { archivedAt: null, members: { some: { userId: actor.userId } } } },
            ],
          }),
    },
    select: {
      id: true,
      number: true,
      subject: true,
      category: true,
      priority: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      client: { select: { displayName: true } },
      project: { select: { id: true, name: true } },
      messages: {
        where: { visibility: "PUBLIC" },
        orderBy: { createdAt: "desc" },
        take: 100,
        select: {
          id: true,
          authorId: true,
          body: true,
          createdAt: true,
          isSystem: true,
          author: { select: { name: true } },
          attachments: {
            where: {
              file: {
                deletedAt: null,
                OR: [
                  { status: "READY" },
                  { uploadedById: actor.userId, status: { in: ["QUARANTINED", "REJECTED"] } },
                ],
              },
            },
            select: {
              file: { select: { id: true, originalName: true, status: true, scanStatus: true } },
            },
          },
        },
      },
      _count: { select: { messages: { where: { visibility: "PUBLIC" } } } },
    },
  });
}

export async function customerUploadProjects(actor: Actor) {
  requireAnyPermission(actor, ["files.read_own", "files.manage"]);
  return db.project.findMany({
    where: projectMembershipScope(actor),
    select: { id: true, name: true },
    orderBy: { name: "asc" },
    take: 100,
  });
}

export async function customerFileLibrary(actor: Actor, projectId?: string) {
  requireAnyPermission(actor, ["files.read_own", "files.read", "files.manage"]);
  if (projectId && !uuid.safeParse(projectId).success) return [];
  const staff = hasAnyPermission(actor, ["files.read", "files.manage"]);
  return db.projectFile.findMany({
    where: {
      ...(projectId ? { projectId } : {}),
      project: { archivedAt: null, client: { isActive: true, archivedAt: null } },
      visibility: { not: "INTERNAL" },
      ...(staff
        ? {}
        : {
            OR: [
              { project: projectMembershipScope(actor) },
              {
                visibility: "CLIENT_MEMBERS",
                project: { client: { members: { some: { userId: actor.userId } } } },
              },
            ],
          }),
      file: {
        deletedAt: null,
        OR: [
          { status: "READY" },
          { uploadedById: actor.userId, status: { in: ["QUARANTINED", "REJECTED"] } },
        ],
      },
    },
    select: {
      label: true,
      createdAt: true,
      project: { select: { id: true, name: true } },
      file: {
        select: {
          id: true,
          originalName: true,
          mimeType: true,
          sizeBytes: true,
          status: true,
          scanStatus: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export function canApproveCustomerMilestone(actor: Actor, projectId: string, clientId: string) {
  if (!hasPermission(actor, "milestones.approve")) return false;
  if (hasPermission(actor, "projects.manage")) return true;
  return (
    actor.clientIds.includes(clientId) &&
    actor.projectMemberships.some(
      (membership) => membership.projectId === projectId && membership.role === "CLIENT_APPROVER",
    )
  );
}
