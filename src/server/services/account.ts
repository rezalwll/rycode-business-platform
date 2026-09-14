import "server-only";

import type { Actor } from "@/server/auth/permissions";
import { requirePermission } from "@/server/auth/permissions";
import { writeAudit } from "@/server/repositories/audit";
import { inTransaction } from "@/server/repositories/database";
import { ServiceError } from "@/server/services/errors";

import { markNotificationReadSchema, updateProfileSchema } from "@/features/business/schemas";

export async function markNotificationRead(actor: Actor, rawInput: unknown) {
  requirePermission(actor, "notifications.read_own");
  const input = markNotificationReadSchema.parse(rawInput);

  return inTransaction(async (transaction) => {
    const notification = await transaction.notification.findFirst({
      where: { id: input.notificationId, userId: actor.userId },
      select: { id: true, readAt: true },
    });
    if (!notification) throw new ServiceError("NOT_FOUND");
    if (notification.readAt) {
      return { id: notification.id, readAt: notification.readAt, changed: false };
    }

    const updated = await transaction.notification.update({
      where: { id: notification.id },
      data: { readAt: new Date() },
      select: { id: true, readAt: true },
    });
    await writeAudit(transaction, {
      actorUserId: actor.userId,
      action: "notification.read",
      entityType: "notification",
      entityId: notification.id,
    });
    return { ...updated, changed: true };
  });
}

export async function markAllNotificationsRead(actor: Actor) {
  requirePermission(actor, "notifications.read_own");
  const now = new Date();
  const result = await inTransaction(async (transaction) => {
    const update = await transaction.notification.updateMany({
      where: { userId: actor.userId, readAt: null },
      data: { readAt: now },
    });
    if (update.count > 0) {
      await writeAudit(transaction, {
        actorUserId: actor.userId,
        action: "notifications.marked_read",
        entityType: "notification",
        metadata: { count: update.count },
      });
    }
    return update;
  });
  return { count: result.count, readAt: now };
}

export async function updateOwnProfile(actor: Actor, rawInput: unknown) {
  requirePermission(actor, "profile.manage_own");
  const input = updateProfileSchema.parse(rawInput);

  try {
    new Intl.DateTimeFormat("en", { timeZone: input.timezone }).format();
  } catch {
    throw new ServiceError("INVALID_INPUT", "منطقه زمانی واردشده معتبر نیست.");
  }

  return inTransaction(async (transaction) => {
    const current = await transaction.user.findUnique({
      where: { id: actor.userId },
      select: {
        id: true,
        name: true,
        profile: {
          select: {
            displayName: true,
            phone: true,
            company: true,
            locale: true,
            timezone: true,
            bio: true,
          },
        },
      },
    });
    if (!current) throw new ServiceError("NOT_FOUND");

    await transaction.user.update({
      where: { id: actor.userId },
      data: { name: input.displayName },
    });
    const profile = await transaction.profile.upsert({
      where: { userId: actor.userId },
      create: {
        userId: actor.userId,
        displayName: input.displayName,
        locale: input.locale,
        timezone: input.timezone,
        ...(input.phone ? { phone: input.phone } : {}),
        ...(input.company ? { company: input.company } : {}),
        ...(input.bio ? { bio: input.bio } : {}),
      },
      update: {
        displayName: input.displayName,
        phone: input.phone ?? null,
        company: input.company ?? null,
        locale: input.locale,
        timezone: input.timezone,
        bio: input.bio ?? null,
      },
      select: {
        displayName: true,
        phone: true,
        company: true,
        locale: true,
        timezone: true,
        bio: true,
        updatedAt: true,
      },
    });
    await writeAudit(transaction, {
      actorUserId: actor.userId,
      action: "profile.updated",
      entityType: "profile",
      entityId: actor.userId,
      before: {
        displayName: current.profile?.displayName ?? current.name,
        phone: current.profile?.phone ?? null,
        company: current.profile?.company ?? null,
        locale: current.profile?.locale ?? null,
        timezone: current.profile?.timezone ?? null,
      },
      after: {
        displayName: profile.displayName,
        phone: profile.phone,
        company: profile.company,
        locale: profile.locale,
        timezone: profile.timezone,
      },
    });
    return profile;
  });
}
