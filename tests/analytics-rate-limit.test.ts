import { describe, expect, it } from "vitest";

import { FixedWindowRateLimiter } from "../src/server/analytics/rate-limit";

describe("analytics fixed-window limiter", () => {
  it("blocks excess events and reports a retry interval", () => {
    const limiter = new FixedWindowRateLimiter(2, 1_000);
    expect(limiter.consume("session", 100).allowed).toBe(true);
    expect(limiter.consume("session", 200).allowed).toBe(true);
    const denied = limiter.consume("session", 300);
    expect(denied.allowed).toBe(false);
    expect(denied.remaining).toBe(0);
    expect(denied.retryAfterSeconds).toBe(1);
  });

  it("starts a clean window after expiry and isolates keys", () => {
    const limiter = new FixedWindowRateLimiter(1, 1_000);
    expect(limiter.consume("a", 0).allowed).toBe(true);
    expect(limiter.consume("a", 999).allowed).toBe(false);
    expect(limiter.consume("b", 999).allowed).toBe(true);
    expect(limiter.consume("a", 1_000).allowed).toBe(true);
  });
});
