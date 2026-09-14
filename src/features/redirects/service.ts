import "server-only";

import type { Actor } from "@/server/auth/permissions";
import { requirePermission } from "@/server/auth/permissions";
import { writeAudit } from "@/server/repositories/audit";
import { inTransaction, type Transaction } from "@/server/repositories/database";
import { ServiceError } from "@/server/services/errors";

import { normalizeRedirectDestination, normalizeRedirectSource } from "./policy";
import { saveRedirectSchema } from "./schemas";

async function assertNoRedirectCycle(
  transaction: Transaction,
  sourcePath: string,
  destination: string,
  currentId?: string,
): Promise<void> {
  let candidate = normalizeRedirectSource(destination);
  const visited = new Set([sourcePath]);
  for (let depth = 0; candidate && depth < 8; depth += 1) {
    if (visited.has(candidate)) {
      throw new ServiceError("INVALID_INPUT", "این قانون یک چرخهٔ تغییرمسیر ایجاد می‌کند.");
    }
    visited.add(candidate);
    const next = await transaction.redirect.findUnique({
      where: { sourcePath: candidate },
      select: { id: true, destination: true, isActive: true },
    });
    if (!next?.isActive || next.id === currentId) return;
    candidate = normalizeRedirectSource(next.destination);
  }
  if (candidate) throw new ServiceError("INVALID_INPUT", "زنجیرهٔ تغییرمسیر بیش از حد طولانی است.");
}

export async function saveRedirect(actor: Actor, rawInput: unknown) {
  requirePermission(actor, "cms.manage");
  const input = saveRedirectSchema.parse(rawInput);
  const sourcePath = normalizeRedirectSource(input.sourcePath);
  const destination = normalizeRedirectDestination(input.destination);
  if (!sourcePath || !destination) {
    throw new ServiceError("INVALID_INPUT", "مبدا و مقصد باید مسیر داخلی معتبر باشند.");
  }
  if (sourcePath === normalizeRedirectSource(destination)) {
    throw new ServiceError("INVALID_INPUT", "مبدا و مقصد تغییرمسیر نمی‌توانند یکسان باشند.");
  }

  return inTransaction(async (transaction) => {
    const previous = input.id
      ? await transaction.redirect.findUnique({
          where: { id: input.id },
          select: { sourcePath: true, destination: true, isActive: true },
        })
      : null;
    if (input.id && !previous) throw new ServiceError("NOT_FOUND");
    if (input.isActive) await assertNoRedirectCycle(transaction, sourcePath, destination, input.id);

    const data = {
      sourcePath,
      destination,
      statusCode: input.statusCode,
      preserveQuery: input.preserveQuery,
      isActive: input.isActive,
    };
    const redirect = input.id
      ? await transaction.redirect.update({
          where: { id: input.id },
          data,
          select: { id: true, sourcePath: true, destination: true, updatedAt: true },
        })
      : await transaction.redirect.create({
          data,
          select: { id: true, sourcePath: true, destination: true, updatedAt: true },
        });
    await writeAudit(transaction, {
      actorUserId: actor.userId,
      action: previous ? "redirect.updated" : "redirect.created",
      entityType: "redirect",
      entityId: redirect.id,
      before: previous ?? {},
      after: data,
    });
    return redirect;
  });
}
