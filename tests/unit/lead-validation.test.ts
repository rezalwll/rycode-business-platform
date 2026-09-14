import { describe, expect, it } from "vitest";

import {
  leadInputFromFormData,
  MAXIMUM_FORM_AGE_MS,
  MINIMUM_FORM_FILL_MS,
  validateLeadSubmission,
} from "@/features/leads/schema";

const now = 2_000_000_000;

function validInput(overrides: Record<string, unknown> = {}) {
  return {
    kind: "project",
    locale: "fa",
    fullName: "کاربر آزمایشی",
    email: "test@example.com",
    phone: "",
    company: "",
    websiteUrl: "",
    projectType: "web platform",
    budget: "",
    timeline: "",
    message: "شرح کافی از مسئله و نتیجه مورد انتظار پروژه.",
    consent: true,
    sourcePath: "/start-project",
    startedAt: now - MINIMUM_FORM_FILL_MS - 1,
    website: "",
    ...overrides,
  };
}

describe("lead submission validation", () => {
  it("accepts a valid request and normalises optional blanks", () => {
    const result = validateLeadSubmission(validInput(), now);
    expect(result.status).toBe("valid");
    if (result.status === "valid") {
      expect(result.data.phone).toBeUndefined();
      expect(result.data.company).toBeUndefined();
    }
  });

  it("requires at least one contact method", () => {
    const result = validateLeadSubmission(validInput({ email: "", phone: "" }), now);
    expect(result.status).toBe("invalid");
    if (result.status === "invalid") {
      expect(result.fieldErrors.email).toBeDefined();
      expect(result.fieldErrors.phone).toBeDefined();
    }
  });

  it("requires a valid website for technical and SEO audits", () => {
    const missing = validateLeadSubmission(validInput({ kind: "seo_audit", websiteUrl: "" }), now);
    const malformed = validateLeadSubmission(
      validInput({ kind: "technical_review", websiteUrl: "not a URL" }),
      now,
    );
    expect(missing.status).toBe("invalid");
    expect(malformed.status).toBe("invalid");
  });

  it("silently identifies a filled honeypot as spam", () => {
    expect(validateLeadSubmission(validInput({ website: "spam.example" }), now)).toEqual({
      status: "spam",
    });
  });

  it("rejects impossibly fast and stale forms", () => {
    expect(
      validateLeadSubmission(validInput({ startedAt: now - MINIMUM_FORM_FILL_MS + 1 }), now).status,
    ).toBe("invalid");
    expect(
      validateLeadSubmission(validInput({ startedAt: now - MAXIMUM_FORM_AGE_MS - 1 }), now).status,
    ).toBe("invalid");
  });

  it("accepts attribution identifiers only as a valid pair", () => {
    const anonymousId = "11111111-1111-4111-8111-111111111111";
    const sessionKey = "22222222-2222-4222-8222-222222222222";
    expect(
      validateLeadSubmission(
        validInput({ analyticsAnonymousId: anonymousId, analyticsSessionKey: sessionKey }),
        now,
      ).status,
    ).toBe("valid");
    expect(
      validateLeadSubmission(validInput({ analyticsAnonymousId: anonymousId }), now).status,
    ).toBe("invalid");
  });

  it("reads only expected scalar FormData fields", () => {
    const form = new FormData();
    form.set("kind", "contact");
    form.set("locale", "en");
    form.set("fullName", "Test User");
    form.set("email", "test@example.com");
    form.set("message", "A sufficiently detailed test message.");
    form.set("consent", "on");
    form.set("sourcePath", "/contact");
    form.set("startedAt", String(now - 5_000));
    form.set("untrusted", "ignored");

    const input = leadInputFromFormData(form);
    expect(input).not.toHaveProperty("untrusted");
    expect(input.consent).toBe(true);
  });
});
