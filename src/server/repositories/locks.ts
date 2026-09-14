import "server-only";

import { Prisma } from "@/generated/prisma/client";

import type { Transaction } from "./database";

/**
 * Serializes conversion attempts for a lead. The unique originLeadId constraint
 * is the final guard; this row lock also avoids leaving duplicate client records
 * behind when two operators convert the same lead concurrently.
 */
export async function lockLead(transaction: Transaction, leadId: string): Promise<void> {
  await transaction.$queryRaw(
    Prisma.sql`SELECT "id" FROM "leads" WHERE "id" = ${leadId}::uuid FOR UPDATE`,
  );
}

/** Serializes payment requests carrying the same caller-supplied idempotency key. */
export async function lockIdempotencyKey(
  transaction: Transaction,
  idempotencyKey: string,
): Promise<void> {
  await transaction.$queryRaw(
    Prisma.sql`SELECT 1 AS "locked" FROM pg_advisory_xact_lock(hashtextextended(${idempotencyKey}, 0))`,
  );
}
