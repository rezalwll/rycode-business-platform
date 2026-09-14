import "server-only";

import { createHash } from "node:crypto";

import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/db/client";
import {
  AuthorizationError,
  canAccessProject,
  canAccessTicket,
  hasPermission,
  isClientAdministrator,
  type Actor,
} from "@/server/auth/permissions";
import { env } from "@/server/env";
import { writeAudit } from "@/server/repositories/audit";
import { canReadFile, type FileAccessRecord } from "@/server/storage/authorization";
import { scanWithClamAv } from "@/server/storage/clamav";
import { generateObjectKey } from "@/server/storage/keys";
import { LocalPrivateStorage } from "@/server/storage/local";
import {
  DEFAULT_MAX_UPLOAD_BYTES,
  requireCmsMediaImage,
  UploadValidationError,
  validateUpload,
} from "@/server/storage/validation";

export type UploadAttachment =
  | { kind: "general" }
  | {
      kind: "project";
      projectId: string;
      visibility: "INTERNAL" | "PROJECT_MEMBERS" | "CLIENT_MEMBERS";
      label?: string | undefined;
    }
  | {
      kind: "lead";
      leadId: string;
      visibility: "INTERNAL" | "PROJECT_MEMBERS" | "CLIENT_MEMBERS";
    }
  | { kind: "ticketMessage"; messageId: string }
  | { kind: "invoice"; invoiceId: string; label?: string | undefined }
  | { kind: "payment"; paymentId: string }
  | { kind: "media"; mediaKey: string };

export type UploadPrivateFileInput = {
  actor: Actor;
  uploadedById: string;
  file: File;
  attachment: UploadAttachment;
};

export type PrivateDownload = {
  objectKey: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  checksumSha256: string | null;
  stream: ReadableStream<Uint8Array>;
};

const storage = new LocalPrivateStorage(env.PRIVATE_STORAGE_ROOT);

function isProjectScoped(actor: Actor, project: { id: string; clientId: string }): boolean {
  return canAccessProject(actor, project);
}

async function authorizeAttachment(actor: Actor, attachment: UploadAttachment): Promise<void> {
  if (attachment.kind === "general") {
    if (!hasPermission(actor, "files.manage")) throw new AuthorizationError();
    return;
  }

  if (attachment.kind === "project") {
    const project = await db.project.findFirst({
      where: {
        id: attachment.projectId,
        archivedAt: null,
        client: { isActive: true, archivedAt: null },
      },
      select: { id: true, clientId: true },
    });
    if (!project)
      throw new UploadValidationError("invalid_name", "The target project was not found.");
    if (
      !hasPermission(actor, "files.manage") &&
      !(hasPermission(actor, "files.read_own") && isProjectScoped(actor, project))
    ) {
      throw new AuthorizationError();
    }
    if (!hasPermission(actor, "files.manage") && attachment.visibility === "INTERNAL") {
      throw new AuthorizationError();
    }
    return;
  }

  if (attachment.kind === "lead") {
    const lead = await db.lead.findUnique({
      where: { id: attachment.leadId },
      select: { submittedById: true, clientId: true },
    });
    if (!lead) throw new UploadValidationError("invalid_name", "The target lead was not found.");
    const ownsLead =
      lead.submittedById === actor.userId ||
      (lead.clientId !== null && isClientAdministrator(actor, lead.clientId));
    if (
      !hasPermission(actor, "files.manage") &&
      !hasPermission(actor, "leads.manage") &&
      !(hasPermission(actor, "leads.read_own") && ownsLead)
    ) {
      throw new AuthorizationError();
    }
    if (!hasPermission(actor, "files.manage") && attachment.visibility === "INTERNAL") {
      throw new AuthorizationError();
    }
    return;
  }

  if (attachment.kind === "ticketMessage") {
    const message = await db.ticketMessage.findFirst({
      where: {
        id: attachment.messageId,
        ticket: {
          client: { isActive: true, archivedAt: null },
          OR: [{ projectId: null }, { project: { archivedAt: null } }],
        },
      },
      select: {
        visibility: true,
        ticket: { select: { openedById: true, clientId: true, projectId: true } },
      },
    });
    if (!message)
      throw new UploadValidationError("invalid_name", "The target message was not found.");
    const ownsTicket = canAccessTicket(actor, message.ticket);
    if (
      !hasPermission(actor, "files.manage") &&
      !hasPermission(actor, "tickets.manage") &&
      !(hasPermission(actor, "tickets.manage_own") && ownsTicket && message.visibility === "PUBLIC")
    ) {
      throw new AuthorizationError();
    }
    return;
  }

  if (attachment.kind === "invoice" || attachment.kind === "payment") {
    if (!hasPermission(actor, "files.manage") && !hasPermission(actor, "finance.manage")) {
      throw new AuthorizationError();
    }
    const exists =
      attachment.kind === "invoice"
        ? await db.invoice.count({ where: { id: attachment.invoiceId } })
        : await db.payment.count({ where: { id: attachment.paymentId } });
    if (exists === 0) {
      throw new UploadValidationError(
        "invalid_name",
        "The finance attachment target was not found.",
      );
    }
    return;
  }

  if (!hasPermission(actor, "files.manage") || !hasPermission(actor, "cms.manage")) {
    throw new AuthorizationError();
  }
  const duplicateMediaKey = await db.media.count({ where: { key: attachment.mediaKey } });
  if (duplicateMediaKey > 0) {
    throw new UploadValidationError("invalid_name", "The media key is already in use.");
  }
}

function categoryForAttachment(
  attachment: UploadAttachment,
):
  | "GENERAL"
  | "LEAD_ATTACHMENT"
  | "PROJECT_ASSET"
  | "TICKET_ATTACHMENT"
  | "INVOICE_DOCUMENT"
  | "PAYMENT_RECEIPT"
  | "CMS_MEDIA" {
  switch (attachment.kind) {
    case "general":
      return "GENERAL";
    case "lead":
      return "LEAD_ATTACHMENT";
    case "project":
      return "PROJECT_ASSET";
    case "ticketMessage":
      return "TICKET_ATTACHMENT";
    case "invoice":
      return "INVOICE_DOCUMENT";
    case "payment":
      return "PAYMENT_RECEIPT";
    case "media":
      return "CMS_MEDIA";
  }
}

function attachmentRelations(attachment: UploadAttachment): Partial<Prisma.FileAssetCreateInput> {
  switch (attachment.kind) {
    case "general":
      return {};
    case "project":
      return {
        projectLinks: {
          create: {
            project: { connect: { id: attachment.projectId } },
            visibility: attachment.visibility,
            ...(attachment.label ? { label: attachment.label } : {}),
          },
        },
      };
    case "lead":
      return {
        leadLinks: {
          create: {
            lead: { connect: { id: attachment.leadId } },
            visibility: attachment.visibility,
          },
        },
      };
    case "ticketMessage":
      return {
        ticketMessageLinks: {
          create: { message: { connect: { id: attachment.messageId } } },
        },
      };
    case "invoice":
      return {
        invoiceLinks: {
          create: {
            invoice: { connect: { id: attachment.invoiceId } },
            ...(attachment.label ? { label: attachment.label } : {}),
          },
        },
      };
    case "payment":
      return {
        paymentReceiptLinks: {
          create: { payment: { connect: { id: attachment.paymentId } } },
        },
      };
    case "media":
      return { media: { create: { key: attachment.mediaKey } } };
  }
}

export async function uploadPrivateFile(input: UploadPrivateFileInput): Promise<{
  id: string;
  status: "QUARANTINED";
  scanStatus: "PENDING";
  originalName: string;
  sizeBytes: number;
}> {
  await authorizeAttachment(input.actor, input.attachment);

  if (input.file.size > DEFAULT_MAX_UPLOAD_BYTES) {
    throw new UploadValidationError(
      "file_too_large",
      `Files may not exceed ${DEFAULT_MAX_UPLOAD_BYTES} bytes.`,
    );
  }

  const bytes = new Uint8Array(await input.file.arrayBuffer());
  const validatedType = validateUpload({
    bytes,
    fileName: input.file.name,
    declaredMimeType: input.file.type,
  });
  if (input.attachment.kind === "media") requireCmsMediaImage(validatedType);
  const objectKey = generateObjectKey(validatedType.extension);
  const checksumSha256 = createHash("sha256").update(bytes).digest("hex");

  await storage.put(objectKey, bytes);
  try {
    const record = await db.fileAsset.create({
      data: {
        storageProvider: "LOCAL",
        bucket: "private",
        objectKey,
        originalName: input.file.name.trim(),
        mimeType: validatedType.mimeType,
        sizeBytes: BigInt(bytes.byteLength),
        checksumSha256,
        category: categoryForAttachment(input.attachment),
        status: "QUARANTINED",
        scanStatus: "PENDING",
        uploadedBy: { connect: { id: input.uploadedById } },
        ...attachmentRelations(input.attachment),
      },
      select: { id: true, status: true, scanStatus: true, originalName: true, sizeBytes: true },
    });

    return {
      id: record.id,
      status: "QUARANTINED",
      scanStatus: "PENDING",
      originalName: record.originalName,
      sizeBytes: Number(record.sizeBytes),
    };
  } catch (error) {
    await storage.remove(objectKey);
    throw error;
  }
}

export async function rejectQuarantinedFile(actor: Actor, fileId: string): Promise<void> {
  if (!hasPermission(actor, "files.manage")) throw new AuthorizationError();

  await db.$transaction(async (transaction) => {
    const current = await transaction.fileAsset.findUnique({
      where: { id: fileId },
      select: { id: true, status: true, scanStatus: true },
    });
    if (!current || current.status !== "QUARANTINED") {
      throw new UploadValidationError(
        "invalid_name",
        "Only a pending quarantined file can be reviewed.",
      );
    }

    await transaction.fileAsset.update({
      where: { id: fileId },
      data: { status: "REJECTED", readyAt: null },
    });
    await writeAudit(transaction, {
      actorUserId: actor.userId,
      action: "file.quarantine_rejected",
      entityType: "file_asset",
      entityId: fileId,
      before: { status: current.status, scanStatus: current.scanStatus },
      after: {
        status: "REJECTED",
        scanStatus: current.scanStatus,
        reviewMode: "manual_rejection",
      },
    });
  });
}

export async function scanQuarantinedFile(actor: Actor, fileId: string): Promise<void> {
  if (!hasPermission(actor, "files.manage")) throw new AuthorizationError();
  if (!env.CLAMAV_HOST) throw new Error("Malware scanning is not configured.");

  const current = await db.fileAsset.findFirst({
    where: { id: fileId, status: "QUARANTINED", scanStatus: { in: ["PENDING", "FAILED"] } },
    select: { id: true, objectKey: true, scanStatus: true },
  });
  if (!current) {
    throw new UploadValidationError("invalid_name", "Only a quarantined file can be scanned.");
  }

  const storedObject = await storage.open(current.objectKey);
  let result;
  try {
    result = await scanWithClamAv(storedObject.stream, {
      host: env.CLAMAV_HOST,
      port: env.CLAMAV_PORT,
    });
  } catch (error) {
    await db.fileAsset.updateMany({
      where: { id: current.id, status: "QUARANTINED" },
      data: { scanStatus: "FAILED" },
    });
    throw error;
  }

  await db.$transaction(async (transaction) => {
    const update = await transaction.fileAsset.updateMany({
      where: { id: current.id, status: "QUARANTINED" },
      data:
        result.verdict === "clean"
          ? { status: "READY", scanStatus: "CLEAN", readyAt: new Date() }
          : { status: "REJECTED", scanStatus: "INFECTED", readyAt: null },
    });
    if (update.count !== 1)
      throw new UploadValidationError("invalid_name", "File state changed during scanning.");
    await writeAudit(transaction, {
      actorUserId: actor.userId,
      action: result.verdict === "clean" ? "file.scan_clean" : "file.scan_infected",
      entityType: "file_asset",
      entityId: current.id,
      before: { status: "QUARANTINED", scanStatus: current.scanStatus },
      after: {
        status: result.verdict === "clean" ? "READY" : "REJECTED",
        scanStatus: result.verdict === "clean" ? "CLEAN" : "INFECTED",
        ...(result.verdict === "infected" ? { signature: result.signature } : {}),
        scanner: "clamav_instream",
      },
    });
  });
}

export async function getAuthorizedDownload(
  actor: Actor,
  fileId: string,
): Promise<PrivateDownload | null> {
  const file = await db.fileAsset.findUnique({
    where: { id: fileId },
    select: {
      objectKey: true,
      originalName: true,
      mimeType: true,
      sizeBytes: true,
      checksumSha256: true,
      status: true,
      uploadedById: true,
      projectLinks: {
        where: { project: { archivedAt: null, client: { isActive: true, archivedAt: null } } },
        select: { visibility: true, project: { select: { id: true, clientId: true } } },
      },
      leadLinks: {
        where: {
          lead: { OR: [{ clientId: null }, { client: { isActive: true, archivedAt: null } }] },
        },
        select: {
          visibility: true,
          lead: { select: { submittedById: true, ownerId: true, clientId: true } },
        },
      },
      ticketMessageLinks: {
        where: {
          message: {
            ticket: {
              client: { isActive: true, archivedAt: null },
              OR: [{ projectId: null }, { project: { archivedAt: null } }],
            },
          },
        },
        select: {
          message: {
            select: {
              visibility: true,
              ticket: { select: { openedById: true, clientId: true, projectId: true } },
            },
          },
        },
      },
      invoiceLinks: {
        where: { invoice: { client: { isActive: true, archivedAt: null } } },
        select: { invoice: { select: { clientId: true, projectId: true } } },
      },
      paymentReceiptLinks: {
        where: { payment: { client: { isActive: true, archivedAt: null } } },
        select: { payment: { select: { clientId: true } } },
      },
      media: { select: { id: true } },
    },
  });

  if (!file || !canReadFile(actor, file as FileAccessRecord)) return null;

  try {
    const storedObject = await storage.open(file.objectKey);
    if (BigInt(storedObject.sizeBytes) !== file.sizeBytes) {
      throw new Error("Private storage size does not match the persisted file metadata.");
    }
    return {
      objectKey: file.objectKey,
      originalName: file.originalName,
      mimeType: file.mimeType,
      sizeBytes: storedObject.sizeBytes,
      checksumSha256: file.checksumSha256,
      stream: storedObject.stream,
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}
