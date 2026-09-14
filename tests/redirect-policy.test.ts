import { describe, expect, it } from "vitest";

import { normalizeRedirectDestination, normalizeRedirectSource } from "@/features/redirects/policy";
import { saveRedirectSchema } from "@/features/redirects/schemas";

describe("redirect policy", () => {
  it.each(["https://evil.invalid", "//evil.invalid", "/\\evil.invalid", "/bad\npath"])(
    "rejects unsafe destinations: %s",
    (value) => expect(normalizeRedirectDestination(value)).toBeNull(),
  );

  it("normalizes internal sources and destinations", () => {
    expect(normalizeRedirectSource("/old?ignored=1#top")).toBe("/old");
    expect(normalizeRedirectDestination("/new?kept=1#top")).toBe("/new?kept=1#top");
  });

  it("accepts only supported redirect status codes", () => {
    const base = {
      sourcePath: "/old",
      destination: "/new",
      preserveQuery: true,
      isActive: true,
    };
    expect(saveRedirectSchema.safeParse({ ...base, statusCode: 308 }).success).toBe(true);
    expect(saveRedirectSchema.safeParse({ ...base, statusCode: 200 }).success).toBe(false);
  });
});
