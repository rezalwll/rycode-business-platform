import "server-only";

import { cache } from "react";

import { db } from "@/db/client";
import { Prisma } from "@/generated/prisma/client";

import {
  allCatalogEntries,
  getCatalogEntries,
  getCatalogEntry,
  localize,
  type CatalogEntry,
  type CatalogKind,
} from "@/content/catalog";
import type { Locale } from "@/i18n/routing";
import { normalizeRedirectDestination, normalizeRedirectSource } from "@/features/redirects/policy";

export type PublicContentSection = {
  title: string;
  body?: string;
  items?: string[];
};

/** A deliberately small, serialization-safe view of a published CMS record. */
export type PublicContent = {
  kind: CatalogKind;
  slug: string;
  title: string;
  summary: string;
  eyebrow: string;
  sections: PublicContentSection[];
  noIndex: boolean;
  position: number;
  publishedAt: string;
  updatedAt: string;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  locales: Locale[];
};

export type PublicSitemapContent = {
  kind: CatalogKind;
  slug: string;
  noIndex: boolean;
  updatedAt: string;
  locales: Locale[];
};

export type PublicRedirect = {
  destination: string;
  permanent: boolean;
  preserveQuery: boolean;
};

export type PublicFaq = { id: string; question: string; answer: string };

const databaseKinds = {
  blog: "ARTICLE",
  services: "SERVICE",
  solutions: "SOLUTION",
  problems: "PROBLEM",
  industries: "INDUSTRY",
  integrations: "INTEGRATION",
  projects: "CASE_STUDY",
} as const;

const publicKinds: Record<string, CatalogKind | undefined> = {
  ARTICLE: "blog",
  SERVICE: "services",
  SOLUTION: "solutions",
  PROBLEM: "problems",
  INDUSTRY: "industries",
  INTEGRATION: "integrations",
  CASE_STUDY: "projects",
};

const eyebrowCopy: Record<CatalogKind, Record<Locale, string>> = {
  blog: { fa: "مجله رای‌کد", en: "RYCODE Journal" },
  services: { fa: "خدمات", en: "Services" },
  solutions: { fa: "راهکارها", en: "Solutions" },
  problems: { fa: "مشکلات رایج", en: "Problems" },
  industries: { fa: "صنایع", en: "Industries" },
  integrations: { fa: "یکپارچه‌سازی", en: "Integrations" },
  projects: { fa: "مطالعه موردی", en: "Case study" },
};

const fallbackSectionTitle: Record<Locale, string> = {
  fa: "جزئیات",
  en: "Details",
};

const MAX_SECTIONS = 32;
const MAX_ITEMS = 64;
const MAX_TEXT_LENGTH = 30_000;
async function withDatabase<T>(
  operation: (database: typeof db) => Promise<T>,
  fallback: T,
): Promise<T> {
  if (!process.env.DATABASE_URL) {
    if (
      process.env.NODE_ENV === "production" &&
      process.env.NEXT_PHASE !== "phase-production-build"
    ) {
      throw new Error("DATABASE_URL is required for public CMS content in production.");
    }
    return fallback;
  }
  // Keep the local preview usable when the optional development database is offline.
  // Production still fails loudly so CMS outages cannot silently publish stale content.
  try {
    return await operation(db);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "RYCODE local preview is using static content because the database is unavailable.",
        error,
      );
      return fallback;
    }
    throw error;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function publicText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.replace(/\r\n?/gu, "\n").trim();
  return normalized ? normalized.slice(0, MAX_TEXT_LENGTH) : null;
}

function nodeText(value: unknown, depth = 0): string {
  if (!isRecord(value) || depth > 24) return "";
  if (value["type"] === "text")
    return typeof value["text"] === "string" ? value["text"].slice(0, MAX_TEXT_LENGTH) : "";
  if (value["type"] === "hardBreak") return "\n";
  const content = value["content"];
  if (!Array.isArray(content)) return "";
  const separator = value["type"] === "doc" || value["type"] === "bulletList" ? "\n\n" : "";
  return content
    .slice(0, 256)
    .map((node) => nodeText(node, depth + 1))
    .join(separator)
    .slice(0, MAX_TEXT_LENGTH);
}

export const listPublicFaqs = cache(async (locale: Locale): Promise<PublicFaq[]> =>
  withDatabase(async (database) => {
    const rows = await database.faq.findMany({
      where: { status: "PUBLISHED", translations: { some: { locale } } },
      select: {
        id: true,
        translations: {
          where: { locale },
          select: { question: true, answer: true },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 100,
    });
    return rows.flatMap((row) => {
      const translation = row.translations[0];
      if (!translation) return [];
      const answer = nodeText(translation.answer).trim();
      return answer ? [{ id: row.id, question: translation.question, answer }] : [];
    });
  }, []),
);

function structuredSections(body: unknown): PublicContentSection[] {
  const candidates = Array.isArray(body)
    ? body
    : isRecord(body) && Array.isArray(body["sections"])
      ? body["sections"]
      : null;
  if (!candidates) return [];

  return candidates.slice(0, MAX_SECTIONS).flatMap((candidate) => {
    if (!isRecord(candidate)) return [];
    const title = publicText(candidate["title"] ?? candidate["heading"]);
    const sectionBody = publicText(candidate["body"] ?? candidate["text"]);
    const rawItems = candidate["items"];
    const items = Array.isArray(rawItems)
      ? rawItems
          .slice(0, MAX_ITEMS)
          .map(publicText)
          .filter((item): item is string => Boolean(item))
      : [];
    if (!title && !sectionBody && items.length === 0) return [];
    return [
      {
        title: title ?? "",
        ...(sectionBody ? { body: sectionBody } : {}),
        ...(items.length > 0 ? { items } : {}),
      },
    ];
  });
}

function tiptapSections(body: unknown): PublicContentSection[] {
  if (!isRecord(body) || !Array.isArray(body["content"])) return [];
  const sections: PublicContentSection[] = [];
  let current: { title: string; paragraphs: string[]; items: string[] } = {
    title: "",
    paragraphs: [],
    items: [],
  };

  function flush(): void {
    if (!current.title && current.paragraphs.length === 0 && current.items.length === 0) return;
    sections.push({
      title: current.title,
      ...(current.paragraphs.length > 0 ? { body: current.paragraphs.join("\n\n") } : {}),
      ...(current.items.length > 0 ? { items: current.items.slice(0, MAX_ITEMS) } : {}),
    });
    current = { title: "", paragraphs: [], items: [] };
  }

  for (const node of body["content"].slice(0, MAX_SECTIONS * 4)) {
    if (!isRecord(node)) continue;
    const type = node["type"];
    if (type === "heading") {
      flush();
      current.title = nodeText(node);
      continue;
    }
    if (type === "bulletList" || type === "orderedList") {
      const items = Array.isArray(node["content"])
        ? node["content"]
            .slice(0, MAX_ITEMS)
            .map((item) => nodeText(item))
            .filter(Boolean)
        : [];
      current.items.push(...items);
      continue;
    }
    const text = nodeText(node);
    if (text) current.paragraphs.push(text);
  }
  flush();
  return sections.slice(0, MAX_SECTIONS);
}

function contentSections(
  body: unknown,
  bodyText: string | null,
  locale: Locale,
): PublicContentSection[] {
  const structured = structuredSections(body);
  if (structured.length > 0) {
    return structured.map((section) => ({
      ...section,
      title: section.title || fallbackSectionTitle[locale],
    }));
  }

  const tiptap = tiptapSections(body);
  if (tiptap.length > 0) {
    return tiptap.map((section) => ({
      ...section,
      title: section.title || fallbackSectionTitle[locale],
    }));
  }

  const plainBody = publicText(body) ?? publicText(bodyText);
  return plainBody ? [{ title: fallbackSectionTitle[locale], body: plainBody }] : [];
}

function safeCanonicalUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function effectivePublicationDate(row: {
  status: string;
  publishedAt: Date | null;
  scheduledAt: Date | null;
}): Date | null {
  const candidate = row.status === "PUBLISHED" ? row.publishedAt : row.scheduledAt;
  if (!candidate || (row.status !== "PUBLISHED" && row.status !== "SCHEDULED")) return null;
  return candidate <= new Date() ? candidate : null;
}

function toPublicContent(
  row: {
    kind: string;
    slug: string;
    noIndex: boolean;
    position: number;
    publishedAt: Date | null;
    scheduledAt: Date | null;
    updatedAt: Date;
    status: string;
    archivedAt: Date | null;
    translations: Array<{
      locale: string;
      state: string;
      title: string;
      summary: string | null;
      body: unknown;
      bodyText: string | null;
      seoTitle: string | null;
      seoDescription: string | null;
      canonicalUrl: string | null;
      ogTitle: string | null;
      ogDescription: string | null;
    }>;
  },
  locale: Locale,
): PublicContent | null {
  const kind = publicKinds[row.kind];
  const translation = row.translations.find(
    (entry) => entry.locale === locale && entry.state === "APPROVED",
  );
  const title = publicText(translation?.title);
  const publicationDate = effectivePublicationDate(row);
  if (!kind || !translation || !title || !publicationDate || row.archivedAt) return null;

  return {
    kind,
    slug: row.slug,
    title,
    summary: publicText(translation.summary) ?? title,
    eyebrow: eyebrowCopy[kind][locale],
    sections: contentSections(translation.body, translation.bodyText, locale),
    noIndex: row.noIndex,
    position: row.position,
    publishedAt: publicationDate.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    seoTitle: publicText(translation.seoTitle),
    seoDescription: publicText(translation.seoDescription),
    canonicalUrl: safeCanonicalUrl(translation.canonicalUrl),
    ogTitle: publicText(translation.ogTitle),
    ogDescription: publicText(translation.ogDescription),
    locales: row.translations
      .filter((entry) => entry.state === "APPROVED" && publicText(entry.title))
      .map((entry) => entry.locale)
      .filter((value): value is Locale => value === "fa" || value === "en"),
  };
}

const publicSelect = {
  id: true,
  kind: true,
  slug: true,
  status: true,
  archivedAt: true,
  noIndex: true,
  position: true,
  publishedAt: true,
  scheduledAt: true,
  updatedAt: true,
  translations: {
    where: { locale: { in: ["fa", "en"] as string[] }, state: "APPROVED" as const },
    select: {
      locale: true,
      state: true,
      title: true,
      summary: true,
      body: true,
      bodyText: true,
      seoTitle: true,
      seoDescription: true,
      canonicalUrl: true,
      ogTitle: true,
      ogDescription: true,
    },
  },
} as const;

export type PublicCatalogEntry =
  | { source: "static"; entry: CatalogEntry; cms: null }
  | { source: "cms"; entry: CatalogEntry; cms: PublicContent };

/** Render through the approved catalog presentation. Text remains React-escaped. */
function cmsCatalogEntry(content: PublicContent): PublicCatalogEntry {
  const text = (value: string) => ({ fa: value, en: value });
  return {
    source: "cms",
    cms: content,
    entry: {
      kind: content.kind,
      slug: content.slug,
      title: text(content.title),
      summary: text(content.summary),
      eyebrow: text(content.eyebrow),
      sections: content.sections.map((section) => ({
        title: text(section.title),
        ...(section.body ? { body: text(section.body) } : {}),
        ...(section.items ? { items: section.items.map(text) } : {}),
      })),
    },
  };
}

export const findPublicCatalogEntry = cache(
  async (kind: CatalogKind, slug: string, locale: Locale): Promise<PublicCatalogEntry | null> => {
    const row = await withDatabase(
      (database) =>
        database.contentItem.findUnique({
          where: { kind_slug: { kind: databaseKinds[kind], slug } },
          select: publicSelect,
        }),
      null,
    );
    if (row) {
      const content = toPublicContent(row, locale);
      return content ? cmsCatalogEntry(content) : null;
    }
    const entry = getCatalogEntry(kind, slug);
    return entry ? { source: "static", entry, cms: null } : null;
  },
);

export const listPublicCatalog = cache(
  async (kind: CatalogKind, locale: Locale): Promise<PublicCatalogEntry[]> => {
    const rows = await withDatabase(
      (database) =>
        database.contentItem.findMany({
          where: { kind: databaseKinds[kind] },
          orderBy: [{ position: "asc" }, { publishedAt: "desc" }, { id: "asc" }],
          select: publicSelect,
        }),
      [],
    );
    // Every CMS record owns its slug, including drafts and withdrawn content.
    const ownedSlugs = new Set(rows.map((row) => row.slug));
    const published = rows.flatMap((row) => {
      const content = toPublicContent(row, locale);
      return content ? [cmsCatalogEntry(content)] : [];
    });
    return [
      ...published,
      ...getCatalogEntries(kind)
        .filter((entry) => !ownedSlugs.has(entry.slug))
        .map((entry): PublicCatalogEntry => ({ source: "static", entry, cms: null })),
    ];
  },
);

export const listPublicSitemapContent = cache(async (): Promise<PublicSitemapContent[]> => {
  const rows = await withDatabase(
    (database) =>
      database.contentItem.findMany({
        select: {
          kind: true,
          slug: true,
          status: true,
          archivedAt: true,
          publishedAt: true,
          scheduledAt: true,
          noIndex: true,
          updatedAt: true,
          translations: {
            where: { locale: { in: ["fa", "en"] }, state: "APPROVED" },
            select: { locale: true, title: true },
          },
        },
        orderBy: [{ position: "asc" }, { id: "asc" }],
      }),
    [],
  );
  const ownedPaths = new Set(rows.map((row) => `${publicKinds[row.kind]}/${row.slug}`));
  const staticEntries = allCatalogEntries()
    .filter((entry) => !ownedPaths.has(`${entry.kind}/${entry.slug}`))
    .map((entry): PublicSitemapContent => ({
      kind: entry.kind,
      slug: entry.slug,
      noIndex: false,
      updatedAt: "",
      locales: ["fa", "en"],
    }));
  const published = rows.flatMap((row): PublicSitemapContent[] => {
    const kind = publicKinds[row.kind];
    const publicationDate = effectivePublicationDate(row);
    if (!kind || row.archivedAt || !publicationDate || row.noIndex) return [];
    const locales = row.translations
      .filter((translation) => publicText(translation.title))
      .map(({ locale }) => locale)
      .filter((locale): locale is Locale => locale === "fa" || locale === "en");
    return locales.length
      ? [{ kind, slug: row.slug, noIndex: false, updatedAt: row.updatedAt.toISOString(), locales }]
      : [];
  });
  return [...published, ...staticEntries];
});

export function normalizePublicSearch(value: string): string {
  return value
    .normalize("NFKC")
    .replace(/[يى]/gu, "ی")
    .replace(/ك/gu, "ک")
    .replace(/[\u064B-\u065F\u0670\u200C\u200D]/gu, "")
    .toLocaleLowerCase()
    .trim();
}

export const searchPublicCatalog = cache(
  async (query: string, locale: Locale): Promise<PublicCatalogEntry[]> => {
    const term = normalizePublicSearch(query).slice(0, 120);
    if (term.length < 2) return [];
    const words = term.split(/\s+/u).filter(Boolean);
    const matches = (entry: CatalogEntry) => {
      const searchable = normalizePublicSearch(
        [
          localize(entry.title, locale),
          localize(entry.summary, locale),
          ...entry.sections.flatMap((section) => [
            localize(section.title, locale),
            section.body ? localize(section.body, locale) : "",
            ...(section.items ?? []).map((item) => localize(item, locale)),
          ]),
        ].join(" "),
      );
      return words.every((word) => searchable.includes(word));
    };
    const staticCandidates = allCatalogEntries().filter(matches).slice(0, 50);

    const cmsResults = await withDatabase(async (database) => {
      const hits = await database.$queryRaw<Array<{ id: string }>>(Prisma.sql`
        SELECT ci."id"
        FROM "content_items" ci
        INNER JOIN "content_translations" ct ON ct."content_id" = ci."id"
        WHERE ct."locale" = ${locale}
          AND ct."state" = 'approved'::"translation_state"
          AND ci."no_index" = false
          AND ci."archived_at" IS NULL
          AND (
            (ci."status" = 'published'::"content_status" AND ci."published_at" <= NOW())
            OR (ci."status" = 'scheduled'::"content_status" AND ci."scheduled_at" <= NOW())
          )
          AND (
            to_tsvector('simple', ct."title" || ' ' || COALESCE(ct."summary", '') || ' ' || COALESCE(ct."body_text", ''))
              @@ websearch_to_tsquery('simple', ${term})
            OR (ct."title" || ' ' || COALESCE(ct."summary", '') || ' ' || COALESCE(ct."body_text", '')) % ${term}
            OR (ct."title" || ' ' || COALESCE(ct."summary", '') || ' ' || COALESCE(ct."body_text", '')) ILIKE ${`%${term}%`}
          )
        ORDER BY
          ts_rank_cd(
            to_tsvector('simple', ct."title" || ' ' || COALESCE(ct."summary", '') || ' ' || COALESCE(ct."body_text", '')),
            websearch_to_tsquery('simple', ${term})
          ) DESC,
          similarity(ct."title" || ' ' || COALESCE(ct."summary", '') || ' ' || COALESCE(ct."body_text", ''), ${term}) DESC,
          ci."published_at" DESC NULLS LAST,
          ci."id" ASC
        LIMIT 50
      `);
      if (hits.length === 0) return [];
      const rows = await database.contentItem.findMany({
        where: { id: { in: hits.map(({ id }) => id) } },
        select: publicSelect,
      });
      const rank = new Map(hits.map(({ id }, index) => [id, index]));
      return rows
        .sort((left, right) => (rank.get(left.id) ?? 50) - (rank.get(right.id) ?? 50))
        .flatMap((row) => {
          const content = toPublicContent(row, locale);
          return content ? [cmsCatalogEntry(content)] : [];
        });
    }, []);

    const ownedStatic = await withDatabase(
      (database) =>
        staticCandidates.length
          ? database.contentItem.findMany({
              where: {
                OR: staticCandidates.map((entry) => ({
                  kind: databaseKinds[entry.kind],
                  slug: entry.slug,
                })),
              },
              select: { kind: true, slug: true },
            })
          : Promise.resolve([]),
      [],
    );
    const owned = new Set(ownedStatic.map((row) => `${publicKinds[row.kind]}/${row.slug}`));
    const staticResults = staticCandidates
      .filter((entry) => !owned.has(`${entry.kind}/${entry.slug}`))
      .map((entry): PublicCatalogEntry => ({ source: "static", entry, cms: null }));
    return [...cmsResults, ...staticResults].slice(0, 50);
  },
);

const findPublicRedirectCached = cache(
  async (requestedPath: string): Promise<PublicRedirect | null> => {
    const normalizedSource = normalizeRedirectSource(requestedPath);
    if (!normalizedSource) return null;

    return withDatabase(async (database) => {
      const visited = new Set([normalizedSource]);
      let candidatePath = normalizedSource;
      let firstRedirect: PublicRedirect | null = null;

      for (let depth = 0; depth < 8; depth += 1) {
        const row = await database.redirect.findUnique({
          where: { sourcePath: candidatePath },
          select: { destination: true, statusCode: true, preserveQuery: true, isActive: true },
        });
        if (!row?.isActive) return firstRedirect;
        if (![301, 302, 307, 308].includes(row.statusCode)) return null;

        const destination = normalizeRedirectDestination(row.destination);
        if (!destination) return null;
        const destinationPath = normalizeRedirectSource(destination);
        if (!destinationPath || visited.has(destinationPath)) return null;

        firstRedirect ??= {
          destination,
          permanent: row.statusCode === 301 || row.statusCode === 308,
          preserveQuery: row.preserveQuery,
        };
        visited.add(destinationPath);
        candidatePath = destinationPath;
      }

      // A chain this deep is operationally indistinguishable from a redirect loop.
      return null;
    }, null);
  },
);

export function findPublicRedirect(requestedPath: string): Promise<PublicRedirect | null> {
  return findPublicRedirectCached(requestedPath);
}

export function redirectDestination(
  redirect: PublicRedirect,
  query: Record<string, string | string[] | undefined>,
): string {
  if (!redirect.preserveQuery) return redirect.destination;
  const destination = new URL(redirect.destination, "https://rycode.invalid");
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || destination.searchParams.has(key)) continue;
    for (const item of Array.isArray(value) ? value : [value])
      destination.searchParams.append(key, item);
  }
  return `${destination.pathname}${destination.search}${destination.hash}`;
}
