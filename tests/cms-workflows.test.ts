import { describe, expect, it } from "vitest";

import {
  assertContentTransition,
  contentRoutePath,
  normalizeContentSlug,
  publicationIssues,
} from "@/features/cms/state";

describe("CMS slug and redirect invariants", () => {
  it("normalizes Latin and Persian slugs without destroying Unicode words", () => {
    expect(normalizeContentSlug("  Clean_API Design  ")).toBe("clean-api-design");
    expect(normalizeContentSlug(" طراحی  سامانهٔ سازمانی ")).toBe("طراحی-سامانهٔ-سازمانی");
    expect(() => normalizeContentSlug("___")).toThrow(/اسلاگ/);
  });

  it("creates locale-aware canonical content paths", () => {
    expect(contentRoutePath("SERVICE", "web-development", "fa")).toBe("/services/web-development");
    expect(contentRoutePath("SERVICE", "web-development", "en")).toBe(
      "/en/services/web-development",
    );
    expect(contentRoutePath("CASE_STUDY", "erp", "fa")).toBe("/projects/erp");
  });
});

describe("CMS publication policy", () => {
  const approved = (locale: "fa" | "en") => ({
    locale,
    title: locale === "fa" ? "عنوان" : "Title",
    summary: locale === "fa" ? "خلاصه" : "Summary",
    body: { type: "doc", content: [] },
    bodyText: "Body",
    state: "APPROVED" as const,
  });

  it("requires approved Persian and English translations", () => {
    expect(publicationIssues("SERVICE", [approved("fa"), approved("en")])).toEqual([]);
    expect(publicationIssues("SERVICE", [approved("fa")])).toContain("missing_en_translation");
    expect(
      publicationIssues("SERVICE", [approved("fa"), { ...approved("en"), state: "REVIEWED" }]),
    ).toContain("en_translation_not_approved");
  });

  it("requires an article body in every locale", () => {
    const issues = publicationIssues("ARTICLE", [
      approved("fa"),
      { ...approved("en"), body: { type: "doc", content: [] }, bodyText: "" },
    ]);
    expect(issues).toContain("en_article_body_missing");
  });

  it("enforces review before publish and prevents archived shortcuts", () => {
    expect(() => assertContentTransition("REVIEW", "PUBLISHED")).not.toThrow();
    expect(() => assertContentTransition("DRAFT", "PUBLISHED")).toThrow(/مجاز نیست/);
    expect(() => assertContentTransition("ARCHIVED", "PUBLISHED")).toThrow(/مجاز نیست/);
  });
});
