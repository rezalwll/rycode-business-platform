import { z } from "zod";

const uuid = z.string().uuid();
const optionalText = (maximum: number) =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().trim().max(maximum).optional(),
  );

export const contentKinds = [
  "ARTICLE",
  "SERVICE",
  "SOLUTION",
  "PROBLEM",
  "INDUSTRY",
  "INTEGRATION",
  "CASE_STUDY",
] as const;

export const contentLocales = ["fa", "en"] as const;

export const contentTranslationSchema = z
  .object({
    locale: z.enum(contentLocales),
    title: z.string().trim().min(1).max(240),
    summary: optionalText(2_000),
    body: z.json().optional(),
    bodyText: optionalText(500_000),
    state: z.enum(["DRAFT", "REVIEWED", "APPROVED"]).default("DRAFT"),
    seoTitle: optionalText(240),
    seoDescription: optionalText(1_000),
    canonicalUrl: z.url().max(2_000).optional(),
    ogTitle: optionalText(240),
    ogDescription: optionalText(1_000),
  })
  .superRefine((translation, context) => {
    if (translation.body !== undefined && JSON.stringify(translation.body).length > 2_000_000) {
      context.addIssue({ code: "custom", path: ["body"], message: "Content body is too large." });
    }
  });

export const createContentSchema = z
  .object({
    kind: z.enum(contentKinds),
    slug: z.string().trim().min(1).max(200),
    noIndex: z.boolean().default(false),
    position: z.number().int().min(-100_000).max(100_000).default(0),
    featuredMediaId: uuid.optional(),
    translations: z.array(contentTranslationSchema).min(1).max(contentLocales.length),
  })
  .superRefine((content, context) => {
    const locales = content.translations.map(({ locale }) => locale);
    if (new Set(locales).size !== locales.length) {
      context.addIssue({
        code: "custom",
        path: ["translations"],
        message: "Each locale may appear only once.",
      });
    }
  });

export const updateContentSchema = z
  .object({
    contentId: uuid,
    slug: z.string().trim().min(1).max(200).optional(),
    status: z.enum(["DRAFT", "REVIEW", "ARCHIVED"]).optional(),
    noIndex: z.boolean().optional(),
    position: z.number().int().min(-100_000).max(100_000).optional(),
    featuredMediaId: uuid.nullable().optional(),
    categoryIds: z.array(uuid).max(50).optional(),
    tagIds: z.array(uuid).max(50).optional(),
    authorIds: z.array(uuid).max(20).optional(),
    faqIds: z.array(uuid).max(50).optional(),
  })
  .superRefine((value, context) => {
    for (const field of ["categoryIds", "tagIds", "authorIds", "faqIds"] as const) {
      const ids = value[field];
      if (ids && new Set(ids).size !== ids.length) {
        context.addIssue({
          code: "custom",
          path: [field],
          message: "Duplicate IDs are not allowed.",
        });
      }
    }
  })
  .refine((value) => Object.keys(value).some((key) => key !== "contentId"), {
    message: "At least one content field must be changed.",
  });

export const saveTranslationSchema = contentTranslationSchema.extend({ contentId: uuid });

export const publishContentSchema = z.object({
  contentId: uuid,
  publishAt: z.coerce.date().optional(),
});

const taxonomyBase = {
  id: uuid.optional(),
  slug: z.string().trim().min(1).max(160),
};

export const saveCategorySchema = z.object({
  ...taxonomyBase,
  translations: z
    .array(
      z.object({
        locale: z.enum(contentLocales),
        name: z.string().trim().min(1).max(180),
        description: optionalText(2_000),
      }),
    )
    .length(2)
    .refine((items) => new Set(items.map(({ locale }) => locale)).size === 2, {
      message: "Persian and English translations are both required.",
    }),
});

export const saveTagSchema = z.object({
  ...taxonomyBase,
  translations: z
    .array(
      z.object({
        locale: z.enum(contentLocales),
        name: z.string().trim().min(1).max(180),
      }),
    )
    .length(2)
    .refine((items) => new Set(items.map(({ locale }) => locale)).size === 2, {
      message: "Persian and English translations are both required.",
    }),
});

export const saveAuthorSchema = z.object({
  ...taxonomyBase,
  avatarMediaId: uuid.nullable().optional(),
  translations: z
    .array(
      z.object({
        locale: z.enum(contentLocales),
        name: z.string().trim().min(1).max(180),
        bio: optionalText(10_000),
      }),
    )
    .length(2)
    .refine((items) => new Set(items.map(({ locale }) => locale)).size === 2, {
      message: "Persian and English translations are both required.",
    }),
});

export const saveFaqSchema = z.object({
  id: uuid.optional(),
  status: z.enum(["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"]),
  translations: z
    .array(
      z.object({
        locale: z.enum(contentLocales),
        question: z.string().trim().min(1).max(1_000),
        answer: z.object({ type: z.literal("doc"), content: z.array(z.json()).optional() }),
        answerText: z.string().trim().min(1).max(50_000),
      }),
    )
    .length(2)
    .refine((items) => new Set(items.map(({ locale }) => locale)).size === 2, {
      message: "Persian and English translations are both required.",
    }),
});

export const saveMediaMetadataSchema = z.object({
  mediaId: uuid,
  focalPointX: z.number().min(0).max(1).nullable(),
  focalPointY: z.number().min(0).max(1).nullable(),
  translations: z
    .array(
      z.object({
        locale: z.enum(contentLocales),
        altText: z.string().trim().min(1).max(1_000),
        caption: optionalText(2_000),
      }),
    )
    .length(2)
    .refine((items) => new Set(items.map(({ locale }) => locale)).size === 2, {
      message: "Persian and English translations are both required.",
    }),
});

export type ContentTranslationInput = z.infer<typeof contentTranslationSchema>;
export type CreateContentInput = z.infer<typeof createContentSchema>;
