import { describe, expect, it } from "vitest";

import {
  saveAuthorSchema,
  saveCategorySchema,
  saveFaqSchema,
  saveMediaMetadataSchema,
  saveTagSchema,
  updateContentSchema,
} from "@/features/cms/schemas";

const firstId = "11111111-1111-4111-8111-111111111111";
const secondId = "22222222-2222-4222-8222-222222222222";

describe("CMS taxonomy validation", () => {
  it("requires complete bilingual categories", () => {
    expect(
      saveCategorySchema.safeParse({
        slug: "engineering",
        translations: [
          { locale: "fa", name: "مهندسی" },
          { locale: "en", name: "Engineering" },
        ],
      }).success,
    ).toBe(true);
    expect(
      saveCategorySchema.safeParse({
        slug: "engineering",
        translations: [
          { locale: "fa", name: "مهندسی" },
          { locale: "fa", name: "تکراری" },
        ],
      }).success,
    ).toBe(false);
  });

  it("requires complete bilingual tags", () => {
    expect(
      saveTagSchema.safeParse({
        slug: "nextjs",
        translations: [
          { locale: "fa", name: "نکست" },
          { locale: "en", name: "Next.js" },
        ],
      }).success,
    ).toBe(true);
  });

  it("validates bilingual authors", () => {
    expect(
      saveAuthorSchema.safeParse({
        slug: "rycode-team",
        avatarMediaId: null,
        translations: [
          { locale: "fa", name: "تیم رای‌کد" },
          { locale: "en", name: "RYCODE team" },
        ],
      }).success,
    ).toBe(true);
  });

  it("requires non-empty structured FAQ answers in both languages", () => {
    const valid = {
      status: "REVIEW",
      translations: [
        { locale: "fa", question: "پرسش؟", answer: { type: "doc" }, answerText: "پاسخ" },
        { locale: "en", question: "Question?", answer: { type: "doc" }, answerText: "Answer" },
      ],
    };
    expect(saveFaqSchema.safeParse(valid).success).toBe(true);
    expect(
      saveFaqSchema.safeParse({
        ...valid,
        translations: [valid.translations[0], { ...valid.translations[1], answerText: "" }],
      }).success,
    ).toBe(false);
  });

  it("validates bilingual media metadata and bounded focal points", () => {
    const valid = {
      mediaId: firstId,
      focalPointX: 0.5,
      focalPointY: null,
      translations: [
        { locale: "fa", altText: "توضیح تصویر" },
        { locale: "en", altText: "Image description" },
      ],
    };
    expect(saveMediaMetadataSchema.safeParse(valid).success).toBe(true);
    expect(saveMediaMetadataSchema.safeParse({ ...valid, focalPointX: 1.1 }).success).toBe(false);
  });

  it("rejects duplicate content associations", () => {
    expect(
      updateContentSchema.safeParse({
        contentId: firstId,
        categoryIds: [secondId, secondId],
      }).success,
    ).toBe(false);
  });
});
