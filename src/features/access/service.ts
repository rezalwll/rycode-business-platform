import "server-only";

import type { Actor } from "@/server/auth/permissions";
import { requirePermission } from "@/server/auth/permissions";
import { writeAudit } from "@/server/repositories/audit";
import { inTransaction } from "@/server/repositories/database";
import { ServiceError } from "@/server/services/errors";

import { assertSuperAdminContinuity } from "./policy";
import { setUserRolesSchema } from "./schemas";

export async function setUserRoles(actor: Actor, rawInput: unknown) {
  requirePermission(actor, "roles.manage");
  const input = setUserRolesSchema.parse(rawInput);

  return inTransaction(async (transaction) => {
    const [target, requestedRoles] = await Promise.all([
      transaction.user.findUnique({
        where: { id: input.userId },
        select: { id: true, roles: { select: { roleId: true, role: { select: { key: true } } } } },
      }),
      transaction.role.findMany({
        where: { id: { in: input.roleIds } },
        select: { id: true, key: true },
      }),
    ]);
    if (!target) throw new ServiceError("NOT_FOUND");
    if (requestedRoles.length !== input.roleIds.length) {
      throw new ServiceError("INVALID_INPUT", "یک یا چند نقش انتخاب‌شده معتبر نیست.");
    }

    const targetIsSuperAdmin = target.roles.some(({ role }) => role.key === "super_admin");
    const targetWillBeSuperAdmin = requestedRoles.some(({ key }) => key === "super_admin");
    const otherSuperAdminCount = targetIsSuperAdmin
      ? await transaction.userRole.count({
          where: { userId: { not: target.id }, role: { key: "super_admin" } },
        })
      : 0;
    assertSuperAdminContinuity({
      targetIsSuperAdmin,
      targetWillBeSuperAdmin,
      otherSuperAdminCount,
    });

    await transaction.userRole.deleteMany({ where: { userId: target.id } });
    await transaction.userRole.createMany({
      data: input.roleIds.map((roleId) => ({
        userId: target.id,
        roleId,
        assignedById: actor.userId,
      })),
    });
    const before = target.roles.map(({ role }) => role.key).sort();
    const after = requestedRoles.map(({ key }) => key).sort();
    await writeAudit(transaction, {
      actorUserId: actor.userId,
      action: "user.roles_updated",
      entityType: "user",
      entityId: target.id,
      before: { roles: before },
      after: { roles: after },
    });
    return { userId: target.id, roles: after };
  });
}
