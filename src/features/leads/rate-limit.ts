import "server-only";

import { FixedWindowRateLimiter } from "@/server/analytics/rate-limit";

const WINDOW_MS = 15 * 60 * 1_000;
const MAX_REQUESTS_PER_WINDOW = 5;
const limiter = new FixedWindowRateLimiter(MAX_REQUESTS_PER_WINDOW, WINDOW_MS, 10_000);

export function checkLeadRateLimit(
  fingerprint: string,
  now = Date.now(),
): { allowed: boolean; retryAfterSeconds: number } {
  const decision = limiter.consume(fingerprint, now);
  return { allowed: decision.allowed, retryAfterSeconds: decision.retryAfterSeconds };
}
