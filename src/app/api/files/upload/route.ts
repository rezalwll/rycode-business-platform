import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { AuthorizationError } from "@/server/auth/permissions";
import { getCurrentIdentity } from "@/server/auth/session";
import { env } from "@/server/env";
import { parseUploadAttachment } from "@/server/storage/http";
import { uploadPrivateFile } from "@/server/storage/service";
import { DEFAULT_MAX_UPLOAD_BYTES, UploadValidationError } from "@/server/storage/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MULTIPART_REQUEST_BYTES = DEFAULT_MAX_UPLOAD_BYTES + 1024 * 1024;

function errorResponse(status: number, code: string, message: string): NextResponse {
  return NextResponse.json({ ok: false, error: { code, message } }, { status });
}

export async function POST(request: Request): Promise<NextResponse> {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(env.NEXT_PUBLIC_APP_URL).origin) {
    return errorResponse(403, "untrusted_origin", "The upload origin is not trusted.");
  }

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("multipart/form-data")) {
    return errorResponse(415, "unsupported_media_type", "A multipart form upload is required.");
  }

  const rawContentLength = request.headers.get("content-length");
  if (!rawContentLength) {
    return errorResponse(411, "content_length_required", "A bounded Content-Length is required.");
  }
  const contentLength = Number(rawContentLength);
  if (!Number.isSafeInteger(contentLength) || contentLength <= 0) {
    return errorResponse(400, "invalid_content_length", "The Content-Length is invalid.");
  }
  if (contentLength > MAX_MULTIPART_REQUEST_BYTES) {
    return errorResponse(413, "file_too_large", "The upload exceeds the maximum request size.");
  }

  const identity = await getCurrentIdentity();
  if (!identity) return errorResponse(401, "authentication_required", "Sign in to upload files.");

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return errorResponse(400, "file_required", "The multipart field named file is required.");
    }

    const attachment = parseUploadAttachment(formData);
    const uploaded = await uploadPrivateFile({
      actor: identity.actor,
      uploadedById: identity.id,
      file,
      attachment,
    });

    return NextResponse.json(
      {
        ok: true,
        file: uploaded,
        message: "Upload accepted and held in quarantine pending a malware scan.",
      },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return errorResponse(403, "forbidden", "You cannot attach a file to this record.");
    }
    if (error instanceof UploadValidationError) {
      const status = error.code === "file_too_large" ? 413 : 422;
      return errorResponse(status, error.code, error.message);
    }
    if (error instanceof ZodError) {
      return errorResponse(422, "invalid_attachment", "The attachment target is invalid.");
    }

    console.error("Private file upload failed", error);
    return errorResponse(500, "upload_failed", "The file could not be stored.");
  }
}
