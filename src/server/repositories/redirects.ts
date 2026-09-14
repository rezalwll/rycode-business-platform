import "server-only";

import type { ContentKind } from "@/generated/prisma/client";

import { contentRoutePath } from "@/features/cms/state";
import type { Transaction } from "@/server/repositories/database";
import { ServiceError } from "@/server/services/errors";

export async function preserveContentSlugRedirects(
  transaction: Transaction,
  input: { kind: ContentKind; oldSlug: string; newSlug: string },
): Promise<void> {
  if (input.oldSlug === input.newSlug) return;

  for (const locale of ["fa", "en"] as const) {
    const oldPath = contentRoutePath(input.kind, input.oldSlug, locale);
    const newPath = contentRoutePath(input.kind, input.newSlug, locale);
    const destinationConflict = await transaction.redirect.findUnique({
      where: { sourcePath: newPath },
      select: { id: true, destination: true, isActive: true },
    });

    if (destinationConflict?.isActive && destinationConflict.destination !== oldPath) {
      throw new ServiceError("CONFLICT", "مسیر جدید با یک تغییرمسیر فعال تداخل دارد.");
    }
    if (destinationConflict?.isActive && destinationConflict.destination === oldPath) {
      await transaction.redirect.update({
        where: { id: destinationConflict.id },
        data: { isActive: false },
      });
    }

    await transaction.redirect.updateMany({
      where: { destination: oldPath, sourcePath: { not: newPath } },
      data: { destination: newPath },
    });
    await transaction.redirect.upsert({
      where: { sourcePath: oldPath },
      create: {
        sourcePath: oldPath,
        destination: newPath,
        statusCode: 308,
        preserveQuery: true,
      },
      update: {
        destination: newPath,
        statusCode: 308,
        preserveQuery: true,
        isActive: true,
      },
    });
  }
}
