import { NextResponse } from "next/server";

import { getCurrentIdentity } from "@/server/auth/session";
import { contentDisposition } from "@/server/storage/http";
import { getAuthorizedDownload } from "@/server/storage/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

function jsonError(status: number, code: string, message: string): NextResponse {
  return NextResponse.json({ ok: false, error: { code, message } }, { status });
}

export async function GET(_request: Request, context: RouteContext): Promise<Response> {
  const identity = await getCurrentIdentity();
  if (!identity) return jsonError(401, "authentication_required", "Sign in to download files.");

  const { id } = await context.params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return jsonError(404, "not_found", "The file was not found.");
  }

  try {
    const download = await getAuthorizedDownload(identity.actor, id);
    if (!download) return jsonError(404, "not_found", "The file was not found.");

    return new Response(download.stream, {
      status: 200,
      headers: {
        "Content-Type": download.mimeType,
        "Content-Length": String(download.sizeBytes),
        "Content-Disposition": contentDisposition(download.originalName),
        "Cache-Control": "private, no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "sandbox; default-src 'none'",
      },
    });
  } catch (error) {
    console.error("Private file download failed", error);
    return jsonError(500, "download_failed", "The file could not be downloaded.");
  }
}
