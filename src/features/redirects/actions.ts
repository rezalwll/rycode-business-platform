"use server";

import { revalidatePath } from "next/cache";

import { asActionResult, type ActionResult } from "@/server/services/errors";
import { requireCurrentIdentity } from "@/server/services/identity";

import { saveRedirect } from "./service";

export async function saveRedirectAction(input: unknown): Promise<ActionResult<unknown>> {
  return asActionResult(async () => {
    const identity = await requireCurrentIdentity();
    const result = await saveRedirect(identity.actor, input);
    revalidatePath("/", "layout");
    revalidatePath("/en", "layout");
    return { ...result, updatedAt: result.updatedAt.toISOString() };
  });
}
