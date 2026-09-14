"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireCurrentIdentity } from "@/server/services/identity";
import { rejectQuarantinedFile, scanQuarantinedFile } from "@/server/storage/service";

const reviewSchema = z.object({
  fileId: z.string().uuid(),
  decision: z.enum(["scan", "reject"]),
});

export async function reviewFileScanFormAction(formData: FormData): Promise<void> {
  const input = reviewSchema.parse({
    fileId: formData.get("fileId"),
    decision: formData.get("decision"),
  });
  const identity = await requireCurrentIdentity();
  if (input.decision === "scan") await scanQuarantinedFile(identity.actor, input.fileId);
  else await rejectQuarantinedFile(identity.actor, input.fileId);
  revalidatePath("/admin/files");
  revalidatePath("/en/admin/files");
  revalidatePath("/dashboard/files");
  revalidatePath("/en/dashboard/files");
}
