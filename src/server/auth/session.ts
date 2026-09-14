import "server-only";

import { headers } from "next/headers";

import { db } from "@/db/client";
import { auth } from "@/server/auth";
import type { Actor } from "@/server/auth/permissions";

export type AuthenticatedIdentity = {
  id: string;
  name: string;
  email: string;
  actor: Actor;
};

export async function getCurrentIdentity(): Promise<AuthenticatedIdentity | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user.id) return null;

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      roles: {
        select: {
          role: {
            select: {
              key: true,
              permissions: { select: { permission: { select: { key: true } } } },
            },
          },
        },
      },
      clientMemberships: {
        where: { client: { isActive: true, archivedAt: null } },
        select: { clientId: true, role: true },
      },
      projectMemberships: {
        where: {
          project: {
            archivedAt: null,
            client: { isActive: true, archivedAt: null },
          },
        },
        select: { projectId: true, role: true, canViewFinance: true },
      },
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    actor: {
      userId: user.id,
      roles: user.roles.map(({ role }) => role.key),
      permissions: Array.from(
        new Set(
          user.roles.flatMap(({ role }) =>
            role.permissions.map(({ permission }) => permission.key),
          ),
        ),
      ),
      clientIds: user.clientMemberships.map(({ clientId }) => clientId),
      projectIds: user.projectMemberships.map(({ projectId }) => projectId),
      clientMemberships: user.clientMemberships,
      projectMemberships: user.projectMemberships,
    },
  };
}
