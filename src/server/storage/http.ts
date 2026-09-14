import { z } from "zod";

import type { UploadAttachment } from "@/server/storage/service";

const id = z.string().uuid();
const label = z.string().trim().min(1).max(200).optional();
const visibility = z.enum(["INTERNAL", "PROJECT_MEMBERS", "CLIENT_MEMBERS"]);

const attachmentSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("general") }).strict(),
  z.object({ kind: z.literal("project"), projectId: id, visibility, label }).strict(),
  z.object({ kind: z.literal("lead"), leadId: id, visibility }).strict(),
  z.object({ kind: z.literal("ticketMessage"), messageId: id }).strict(),
  z.object({ kind: z.literal("invoice"), invoiceId: id, label }).strict(),
  z.object({ kind: z.literal("payment"), paymentId: id }).strict(),
  z
    .object({
      kind: z.literal("media"),
      mediaKey: z
        .string()
        .trim()
        .min(2)
        .max(180)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    })
    .strict(),
]);

function optionalFormString(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}

export function parseUploadAttachment(formData: FormData): UploadAttachment {
  const kind = optionalFormString(formData, "kind") ?? "general";
  return attachmentSchema.parse({
    kind,
    ...(kind === "project"
      ? {
          projectId: optionalFormString(formData, "projectId"),
          visibility: optionalFormString(formData, "visibility") ?? "PROJECT_MEMBERS",
          label: optionalFormString(formData, "label"),
        }
      : {}),
    ...(kind === "lead"
      ? {
          leadId: optionalFormString(formData, "leadId"),
          visibility: optionalFormString(formData, "visibility") ?? "CLIENT_MEMBERS",
        }
      : {}),
    ...(kind === "ticketMessage" ? { messageId: optionalFormString(formData, "messageId") } : {}),
    ...(kind === "invoice"
      ? {
          invoiceId: optionalFormString(formData, "invoiceId"),
          label: optionalFormString(formData, "label"),
        }
      : {}),
    ...(kind === "payment" ? { paymentId: optionalFormString(formData, "paymentId") } : {}),
    ...(kind === "media" ? { mediaKey: optionalFormString(formData, "mediaKey") } : {}),
  });
}

export function contentDisposition(originalName: string): string {
  const safeUnicodeName = originalName.replace(/[\r\n]/g, "_");
  const asciiFallback = safeUnicodeName
    .replace(/[^\x20-\x7e]/g, "_")
    .replace(/["\\]/g, "_")
    .slice(0, 180);
  return `attachment; filename="${asciiFallback || "download"}"; filename*=UTF-8''${encodeURIComponent(safeUnicodeName)}`;
}
