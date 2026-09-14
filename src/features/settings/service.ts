import "server-only";

import { Prisma } from "@/generated/prisma/client";
import type { Actor } from "@/server/auth/permissions";
import { requirePermission } from "@/server/auth/permissions";
import { writeAudit } from "@/server/repositories/audit";
import { inTransaction } from "@/server/repositories/database";
import { ServiceError } from "@/server/services/errors";

import { saveSiteSettingSchema } from "./schemas";

export async function saveSiteSetting(actor: Actor, rawInput: unknown) {
  requirePermission(actor, "settings.manage");
  const input = saveSiteSettingSchema.parse(rawInput);

  return inTransaction(async (transaction) => {
    const lookupKey = input.originalKey ?? input.key;
    const previous = await transaction.siteSetting.findUnique({
      where: { key: lookupKey },
      select: { key: true, value: true, visibility: true },
    });
    if (input.originalKey && !previous) throw new ServiceError("NOT_FOUND");
    if (previous?.visibility === "SECRET") {
      throw new ServiceError("FORBIDDEN", "تنظیمات محرمانه فقط از محیط استقرار مدیریت می‌شوند.");
    }
    if (input.originalKey && input.originalKey !== input.key) {
      const conflict = await transaction.siteSetting.findUnique({
        where: { key: input.key },
        select: { key: true },
      });
      if (conflict) throw new ServiceError("CONFLICT");
      await transaction.siteSetting.delete({ where: { key: input.originalKey } });
    }

    const value = input.value === null ? Prisma.JsonNull : input.value;
    const setting = await transaction.siteSetting.upsert({
      where: { key: input.key },
      create: {
        key: input.key,
        value,
        visibility: input.visibility,
        updatedById: actor.userId,
      },
      update: { value, visibility: input.visibility, updatedById: actor.userId },
      select: { key: true, visibility: true, updatedAt: true },
    });
    await writeAudit(transaction, {
      actorUserId: actor.userId,
      action: previous ? "site_setting.updated" : "site_setting.created",
      entityType: "site_setting",
      entityId: setting.key,
      before: previous
        ? { key: previous.key, visibility: previous.visibility, value: previous.value }
        : {},
      after: { key: setting.key, visibility: setting.visibility, value: input.value },
    });
    return setting;
  });
}
