import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { hashAnalyticsIdentifier } from "@/server/analytics/hash";
import { FixedWindowRateLimiter } from "@/server/analytics/rate-limit";
import { recordAnalyticsEvent } from "@/server/analytics/service";
import { AnalyticsMetadataError, analyticsEventSchema } from "@/server/analytics/validation";
import { getCurrentIdentity } from "@/server/auth/session";
import { env } from "@/server/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_REQUEST_BYTES = 16 * 1024;
const sessionLimiter = new FixedWindowRateLimiter(60, 60_000);
const clientLimiter = new FixedWindowRateLimiter(240, 60_000);

function response(body: unknown, status: number, headers?: HeadersInit): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

async function readBoundedBody(request: Request): Promise<string | null> {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > MAX_REQUEST_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }

  const combined = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(combined);
  } catch {
    return "";
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(env.NEXT_PUBLIC_APP_URL).origin) {
    return response({ accepted: false, error: "untrusted_origin" }, 403);
  }
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return response({ accepted: false, error: "unsupported_media_type" }, 415);
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return response({ accepted: false, error: "payload_too_large" }, 413);
  }

  try {
    const rawBody = await readBoundedBody(request);
    if (rawBody === null) {
      return response({ accepted: false, error: "payload_too_large" }, 413);
    }
    const event = analyticsEventSchema.parse(JSON.parse(rawBody) as unknown);

    // Consent denial/absence is acknowledged without creating a session, hash or event.
    if (event.consent !== "granted") return response({ accepted: true, recorded: false }, 202);

    const sessionKey = hashAnalyticsIdentifier(env.BETTER_AUTH_SECRET, "session", event.sessionKey);
    const forwarded =
      request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() ?? "unknown";
    const clientKey = hashAnalyticsIdentifier(env.BETTER_AUTH_SECRET, "client", forwarded);
    const sessionDecision = sessionLimiter.consume(sessionKey);
    const clientDecision = clientLimiter.consume(clientKey);
    if (!sessionDecision.allowed || !clientDecision.allowed) {
      return response({ accepted: false, error: "rate_limited" }, 429, {
        "Retry-After": String(
          Math.max(sessionDecision.retryAfterSeconds, clientDecision.retryAfterSeconds),
        ),
      });
    }

    const identity = await getCurrentIdentity();
    const userAgent = request.headers.get("user-agent")?.slice(0, 1024);
    const result = await recordAnalyticsEvent(event, {
      ...(identity ? { userId: identity.id } : {}),
      ...(userAgent ? { userAgent } : {}),
    });
    return response({ accepted: true, recorded: result.recorded }, 202);
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof ZodError) {
      return response({ accepted: false, error: "invalid_event" }, 422);
    }
    if (error instanceof AnalyticsMetadataError) {
      return response({ accepted: false, error: "invalid_metadata" }, 422);
    }

    console.error("Analytics event ingestion failed", error);
    return response({ accepted: false, error: "analytics_unavailable" }, 503);
  }
}
