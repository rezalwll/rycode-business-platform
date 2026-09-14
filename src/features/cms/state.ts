import type { ContentKind, ContentStatus, TranslationState } from "@/generated/prisma/client";

import { ServiceError } from "@/server/services/errors";

const routeSegments: Readonly<Record<ContentKind, string>> = {
  ARTICLE: "blog",
  SERVICE: "services",
  SOLUTION: "solutions",
  PROBLEM: "problems",
  INDUSTRY: "industries",
  INTEGRATION: "integrations",
  CASE_STUDY: "projects",
};

const contentTransitions: Readonly<Record<ContentStatus, ReadonlySet<ContentStatus>>> = {
  DRAFT: new Set(["REVIEW", "ARCHIVED"]),
  REVIEW: new Set(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]),
  SCHEDULED: new Set(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  PUBLISHED: new Set(["DRAFT", "ARCHIVED"]),
  ARCHIVED: new Set(["DRAFT"]),
};

export function normalizeContentSlug(rawSlug: string): string {
  const slug = rawSlug
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase("en-US")
    .replace(/[\s_]+/gu, "-")
    .replace(/[^\p{L}\p{M}\p{N}-]+/gu, "")
    .replace(/-{2,}/gu, "-")
    .replace(/^-|-$/gu, "");
  if (!slug || slug.length > 200) {
    throw new ServiceError("INVALID_INPUT", "اسلاگ محتوا معتبر نیست.");
  }
  return slug;
}

export function contentRoutePath(kind: ContentKind, slug: string, locale: "fa" | "en"): string {
  const prefix = locale === "en" ? "/en" : "";
  return `${prefix}/${routeSegments[kind]}/${slug}`;
}

export function assertContentTransition(from: ContentStatus, to: ContentStatus): void {
  if (from === to) return;
  if (!contentTransitions[from].has(to)) {
    throw new ServiceError("INVALID_STATE", `تغییر وضعیت محتوا از ${from} به ${to} مجاز نیست.`);
  }
}

export type PublishableTranslation = {
  locale: string;
  title: string;
  summary: string | null;
  body: unknown;
  bodyText: string | null;
  state: TranslationState;
};

export function publicationIssues(
  kind: ContentKind,
  translations: readonly PublishableTranslation[],
): string[] {
  const issues: string[] = [];
  for (const locale of ["fa", "en"] as const) {
    const translation = translations.find((candidate) => candidate.locale === locale);
    if (!translation) {
      issues.push(`missing_${locale}_translation`);
      continue;
    }
    if (translation.state !== "APPROVED") issues.push(`${locale}_translation_not_approved`);
    if (!translation.title.trim()) issues.push(`${locale}_title_missing`);
    if (!translation.summary?.trim()) issues.push(`${locale}_summary_missing`);
    if (kind === "ARTICLE" && !translation.bodyText?.trim()) {
      issues.push(`${locale}_article_body_missing`);
    }
  }
  return issues;
}
