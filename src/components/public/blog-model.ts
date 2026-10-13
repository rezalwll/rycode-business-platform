import { localize, type CatalogEntry } from "@/content/catalog";
import type { Locale } from "@/i18n/routing";
import { localizedHref } from "@/i18n/public-href";
import type { PublicCatalogEntry } from "@/server/queries/public-content";

export type BlogQuery = { q?: string; category?: string; page?: string };
export const BLOG_PAGE_SIZE = 6;

export function blogCategory(entry: CatalogEntry, locale: Locale) {
  return (
    localize(entry.eyebrow, locale).split(/[\/|]/u)[0]?.trim() ||
    (locale === "fa" ? "یادداشت‌ها" : "Journal")
  );
}

function normalized(value: string) {
  return value
    .toLocaleLowerCase()
    .normalize("NFKC")
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[\u064b-\u065f\u0670]/g, "")
    .replace(/[\u200c\u200d]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function blogArchive(entries: PublicCatalogEntry[], locale: Locale, query: BlogQuery = {}) {
  const articles = entries.filter(({ entry }) => entry.kind === "blog");
  const categories = [...new Set(articles.map(({ entry }) => blogCategory(entry, locale)))];
  const q = (query.q ?? "").trim().slice(0, 200);
  const category = categories.includes(query.category ?? "") ? query.category! : "";
  const words = normalized(q).split(" ").filter(Boolean);
  const filtered = articles.filter(({ entry }) => {
    if (category && blogCategory(entry, locale) !== category) return false;
    const text = normalized(
      [
        localize(entry.title, locale),
        localize(entry.summary, locale),
        localize(entry.eyebrow, locale),
        ...entry.sections.flatMap((section) => [
          localize(section.title, locale),
          section.body ? localize(section.body, locale) : "",
          ...(section.items ?? []).map((item) => localize(item, locale)),
        ]),
      ].join(" "),
    );
    return words.every((word) => text.includes(word));
  });
  const pages = Math.max(1, Math.ceil(filtered.length / BLOG_PAGE_SIZE));
  const requested = Number(query.page);
  const page = Number.isSafeInteger(requested) && requested > 0 ? Math.min(requested, pages) : 1;
  return {
    q,
    category,
    categories,
    page,
    pages,
    total: filtered.length,
    entries: filtered.slice((page - 1) * BLOG_PAGE_SIZE, page * BLOG_PAGE_SIZE),
  };
}

export function blogArchiveHref(locale: Locale, query: BlogQuery = {}) {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.category) params.set("category", query.category);
  if (query.page && query.page !== "1") params.set("page", query.page);
  return localizedHref(locale, `/blog${params.size ? `?${params}` : ""}`);
}

export function blogReadingMinutes(entry: CatalogEntry, locale: Locale) {
  const words = [
    localize(entry.summary, locale),
    ...entry.sections.flatMap((section) => [
      localize(section.title, locale),
      section.body ? localize(section.body, locale) : "",
      ...(section.items ?? []).map((item) => localize(item, locale)),
    ]),
  ]
    .join(" ")
    .trim()
    .split(/\s+/u).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function relatedBlogEntries(
  entry: CatalogEntry,
  entries: PublicCatalogEntry[],
  locale: Locale,
) {
  const candidates = entries.filter(
    (candidate) => candidate.entry.kind === "blog" && candidate.entry.slug !== entry.slug,
  );
  return [
    ...candidates.filter(
      (candidate) => blogCategory(candidate.entry, locale) === blogCategory(entry, locale),
    ),
    ...candidates.filter(
      (candidate) => blogCategory(candidate.entry, locale) !== blogCategory(entry, locale),
    ),
  ].slice(0, 2);
}
