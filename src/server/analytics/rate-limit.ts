export type RateLimitDecision = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

type WindowState = { startedAt: number; count: number };

export class FixedWindowRateLimiter {
  private readonly windows = new Map<string, WindowState>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
    private readonly maxTrackedKeys = 10_000,
  ) {
    if (limit < 1 || windowMs < 1 || maxTrackedKeys < 1) {
      throw new Error("Rate limiter values must be positive integers.");
    }
  }

  consume(key: string, now = Date.now()): RateLimitDecision {
    let state = this.windows.get(key);
    if (!state || now - state.startedAt >= this.windowMs) {
      state = { startedAt: now, count: 0 };
      this.windows.set(key, state);
    }

    state.count += 1;
    const elapsed = Math.max(0, now - state.startedAt);
    const retryAfterSeconds = Math.max(1, Math.ceil((this.windowMs - elapsed) / 1000));
    const allowed = state.count <= this.limit;

    if (this.windows.size > this.maxTrackedKeys) this.prune(now);

    return {
      allowed,
      remaining: Math.max(0, this.limit - state.count),
      retryAfterSeconds: allowed ? 0 : retryAfterSeconds,
    };
  }

  private prune(now: number): void {
    for (const [key, state] of this.windows) {
      if (now - state.startedAt >= this.windowMs) this.windows.delete(key);
    }
    while (this.windows.size > this.maxTrackedKeys) {
      const oldestKey = this.windows.keys().next().value as string | undefined;
      if (!oldestKey) break;
      this.windows.delete(oldestKey);
    }
  }
}
