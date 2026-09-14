import "server-only";

import type { Prisma } from "@/generated/prisma/client";

import { db } from "@/db/client";

export type Transaction = Prisma.TransactionClient;

export function inTransaction<T>(work: (transaction: Transaction) => Promise<T>): Promise<T> {
  return db.$transaction(work, {
    isolationLevel: "Serializable",
    maxWait: 5_000,
    timeout: 15_000,
  });
}

export { db };
