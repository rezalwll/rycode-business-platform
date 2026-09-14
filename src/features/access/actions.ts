"use server";

import { revalidatePath } from "next/cache";

import { asActionResult, type ActionResult } from "@/server/services/errors";
import { requireCurrentIdentity } from "@/server/services/identity";

import { setUserRoles } from "./service";

export async function setUserRolesAction(input: unknown): Promise<ActionResult<unknown>> {
  return asActionResult(async () => {
    const identity = await requireCurrentIdentity();
    const result = await setUserRoles(identity.actor, input);
    revalidatePath("/admin", "layout");
    revalidatePath("/en/admin", "layout");
    return result;
  });
}
