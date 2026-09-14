import { describe, expect, it } from "vitest";

import { hashAnalyticsIdentifier } from "../src/server/analytics/hash";
import {
  AnalyticsMetadataError,
  analyticsEventSchema,
  sanitizeAnalyticsMetadata,
  sanitizeReferrer,
} from "../src/server/analytics/validation";

const baseEvent = {
  anonymousId: "123e4567-e89b-42d3-a456-426614174000",
  sessionKey: "123e4567-e89b-42d3-a456-426614174001",
  consent: "granted",
  name: "page_view",
  path: "/fa/services",
} as const;

describe("analytics ingestion validation", () => {
  it("accepts only the explicit event taxonomy", () => {
    expect(analyticsEventSchema.parse(baseEvent).name).toBe("page_view");
    expect(() => analyticsEventSchema.parse({ ...baseEvent, name: "custom" })).toThrow();
    expect(() => analyticsEventSchema.parse({ ...baseEvent, admin: true })).toThrow();
  });

  it("bounds and sanitizes metadata without accepting executable values", () => {
    expect(
      sanitizeAnalyticsMetadata({ section: "hero", position: 2, flags: [true, false] }),
    ).toEqual({ section: "hero", position: 2, flags: [true, false] });
    expect(() => sanitizeAnalyticsMetadata({ callback: () => true })).toThrow(
      AnalyticsMetadataError,
    );
  });

  it("drops referrer queries and unsupported schemes", () => {
    expect(sanitizeReferrer("https://example.com/from?q=sensitive#fragment")).toBe(
      "https://example.com/from",
    );
    expect(sanitizeReferrer("javascript:alert(1)")).toBeUndefined();
  });

  it("uses secret-keyed, domain-separated identifiers", () => {
    const sessionHash = hashAnalyticsIdentifier(
      "a-secret-at-least-32-characters-long",
      "session",
      "same",
    );
    const anonymousHash = hashAnalyticsIdentifier(
      "a-secret-at-least-32-characters-long",
      "anonymous",
      "same",
    );
    expect(sessionHash).toMatch(/^[a-f0-9]{64}$/);
    expect(sessionHash).not.toBe(anonymousHash);
    expect(sessionHash).not.toContain("same");
  });
});
