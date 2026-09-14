"use server";

import { revalidatePath } from "next/cache";

import { asActionResult, type ActionResult } from "@/server/services/errors";
import { requireCurrentIdentity } from "@/server/services/identity";

import { saveSiteSetting } from "./service";

export async function saveSiteSettingAction(input: unknown): Promise<ActionResult<unknown>> {
  return asActionResult(async () => {
    const identity = await requireCurrentIdentity();
    const result = await saveSiteSetting(identity.actor, input);
    revalidatePath("/", "layout");
    revalidatePath("/en", "layout");
    revalidatePath("/admin", "layout");
    revalidatePath("/en/admin", "layout");
    return { ...result, updatedAt: result.updatedAt.toISOString() };
  });
}
