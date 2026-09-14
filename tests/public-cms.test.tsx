import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const database = vi.hoisted(() => ({
  $queryRaw: vi.fn(),
  contentItem: { findUnique: vi.fn(), findMany: vi.fn() },
  faq: { findMany: vi.fn() },
  redirect: { findUnique: vi.fn() },
}));
vi.mock("server-only", () => ({}));
vi.mock("@/db/client", () => ({ db: database }));

import { CatalogDetail } from "@/components/public/catalog-pages";
import {
  findPublicCatalogEntry,
  findPublicRedirect,
  listPublicCatalog,
  listPublicFaqs,
  listPublicSitemapContent,
  normalizePublicSearch,
  redirectDestination,
  searchPublicCatalog,
} from "@/server/queries/public-content";

function translation(locale = "fa", state = "APPROVED") {
  return {
    locale,
    state,
    title: "عنوان تأییدشده",
    summary: "توضیح عمومی",
    body: null,
    bodyText: "متن عمومی",
    seoTitle: "عنوان سئو",
    seoDescription: "توضیح سئو",
    canonicalUrl: null,
    ogTitle: null,
    ogDescription: null,
  };
}

function content(overrides: Record<string, unknown> = {}) {
  return {
    id: "33333333-3333-4333-8333-333333333333",
    kind: "SERVICE",
    slug: "web-development",
    status: "PUBLISHED",
    archivedAt: null,
    noIndex: false,
    position: 0,
    publishedAt: new Date("2025-01-01T00:00:00Z"),
    scheduledAt: null,
    updatedAt: new Date("2025-01-02T00:00:00Z"),
    translations: [translation()],
    ...overrides,
  };
}

beforeEach(() => {
  vi.stubEnv("DATABASE_URL", "postgresql://test.invalid/test");
  database.contentItem.findUnique.mockReset().mockResolvedValue(null);
  database.contentItem.findMany.mockReset().mockResolvedValue([]);
  database.$queryRaw.mockReset().mockResolvedValue([]);
  database.faq.findMany.mockReset().mockResolvedValue([]);
  database.redirect.findUnique.mockReset().mockResolvedValue(null);
});
afterEach(() => vi.unstubAllEnvs());

describe("public CMS visibility", () => {
  it("uses the approved catalog only when no CMS record owns the route", async () => {
    expect((await findPublicCatalogEntry("services", "web-development", "fa"))?.source).toBe(
      "static",
    );
    expect(await findPublicCatalogEntry("services", "missing", "fa")).toBeNull();
  });

  it.each([
    { status: "DRAFT" },
    { status: "REVIEW" },
    { status: "SCHEDULED" },
    { status: "SCHEDULED", publishedAt: null, scheduledAt: new Date("2100-01-01") },
    { status: "ARCHIVED" },
    { archivedAt: new Date() },
    { publishedAt: null },
    { publishedAt: new Date("2100-01-01") },
    { translations: [translation("fa", "DRAFT")] },
    { translations: [translation("en")] },
  ])("does not republish a static fallback for a hidden CMS record: %j", async (overrides) => {
    database.contentItem.findUnique.mockResolvedValue(content(overrides));
    expect(await findPublicCatalogEntry("services", "web-development", "fa")).toBeNull();
  });

  it("returns only the requested approved translation and its eligible alternates", async () => {
    database.contentItem.findUnique.mockResolvedValue(
      content({
        translations: [translation(), { ...translation("en", "DRAFT"), title: "PRIVATE" }],
      }),
    );
    const resolved = await findPublicCatalogEntry("services", "web-development", "fa");
    expect(resolved?.cms?.locales).toEqual(["fa"]);
    expect(JSON.stringify(resolved)).not.toContain("PRIVATE");
    expect(resolved?.cms?.seoTitle).toBe("عنوان سئو");
    expect(database.contentItem.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        select: expect.objectContaining({
          translations: expect.objectContaining({
            where: expect.objectContaining({ state: "APPROVED" }),
          }),
        }),
      }),
    );
  });

  it("makes due scheduled content public without an external scheduler", async () => {
    const due = content({
      status: "SCHEDULED",
      publishedAt: null,
      scheduledAt: new Date("2025-02-01T10:00:00Z"),
    });
    database.contentItem.findUnique.mockResolvedValue(due);
    database.contentItem.findMany.mockImplementation(async ({ select }) =>
      "noIndex" in select ? [due] : [],
    );

    const detail = await findPublicCatalogEntry("services", "web-development", "fa");
    expect(detail?.source).toBe("cms");
    expect(detail?.cms?.publishedAt).toBe("2025-02-01T10:00:00.000Z");
    expect((await listPublicCatalog("services", "fa"))[0]?.source).toBe("cms");
    expect(
      (await listPublicSitemapContent()).some((entry) => entry.slug === "web-development"),
    ).toBe(true);
  });

  it("excludes withdrawn baseline routes from hubs and sitemap", async () => {
    database.contentItem.findMany.mockResolvedValue([content({ status: "DRAFT" })]);
    expect(
      (await listPublicCatalog("services", "fa")).some(
        ({ entry }) => entry.slug === "web-development",
      ),
    ).toBe(false);
    expect(
      (await listPublicSitemapContent()).some((entry) => entry.slug === "web-development"),
    ).toBe(false);
  });

  it("excludes noindex content from sitemap and search while preserving its direct public page", async () => {
    const row = content({ noIndex: true });
    database.contentItem.findUnique.mockResolvedValue(row);
    database.contentItem.findMany.mockResolvedValue([row]);
    expect((await findPublicCatalogEntry("services", "web-development", "fa"))?.cms?.noIndex).toBe(
      true,
    );
    expect((await listPublicSitemapContent()).some((entry) => entry.slug === row.slug)).toBe(false);
    expect(await searchPublicCatalog("عنوان تأییدشده", "fa")).toEqual([]);
  });

  it("propagates a configured database failure instead of exposing stale baseline content", async () => {
    const failure = new Error("Database connection failed");
    database.contentItem.findUnique.mockRejectedValue(failure);
    database.contentItem.findMany.mockRejectedValue(failure);
    await expect(findPublicCatalogEntry("services", "web-development", "fa")).rejects.toThrow(
      failure,
    );
    await expect(listPublicCatalog("services", "fa")).rejects.toThrow(failure);
    await expect(listPublicSitemapContent()).rejects.toThrow(failure);
  });

  it("allows an unconfigured development preview but rejects an unconfigured production runtime", async () => {
    vi.stubEnv("DATABASE_URL", "");
    vi.stubEnv("NODE_ENV", "development");
    expect((await findPublicCatalogEntry("services", "web-development", "fa"))?.source).toBe(
      "static",
    );
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PHASE", "");
    await expect(findPublicCatalogEntry("services", "web-development", "fa")).rejects.toThrow(
      "DATABASE_URL",
    );
  });

  it("renders CMS text as escaped text and ignores rich-text executable attributes", async () => {
    database.contentItem.findUnique.mockResolvedValue(
      content({
        translations: [
          {
            ...translation(),
            body: {
              type: "doc",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Hello ",
                      marks: [{ type: "link", attrs: { href: "javascript:alert(1)" } }],
                    },
                    { type: "text", text: "<img src=x onerror=alert(1)>" },
                  ],
                },
              ],
            },
          },
        ],
      }),
    );
    const result = await findPublicCatalogEntry("services", "web-development", "fa");
    expect(result?.cms?.sections[0]?.body).toBe("Hello <img src=x onerror=alert(1)>");
    const html = renderToStaticMarkup(<CatalogDetail locale="fa" entry={result!.entry} />);
    expect(html).toContain("&lt;img src=x onerror=alert(1)&gt;");
    expect(html).not.toContain("javascript:");
    expect(html).not.toContain("<img src=x");
  });

  it("returns only published localized FAQs as safe plain text", async () => {
    database.faq.findMany.mockResolvedValue([
      {
        id: "faq-1",
        translations: [
          {
            question: "پرسش مدیریت‌شده",
            answer: {
              type: "doc",
              content: [
                { type: "paragraph", content: [{ type: "text", text: "پاسخ اول" }] },
                { type: "paragraph", content: [{ type: "text", text: "پاسخ دوم" }] },
              ],
            },
          },
        ],
      },
    ]);
    expect(await listPublicFaqs("fa")).toEqual([
      { id: "faq-1", question: "پرسش مدیریت‌شده", answer: "پاسخ اول\n\nپاسخ دوم" },
    ]);
    expect(database.faq.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ status: "PUBLISHED" }) }),
    );
  });
});

describe("public redirects and search", () => {
  it.each(["https://evil.invalid", "//evil.invalid", "/\\evil.invalid", "/foo\nbar"])(
    "rejects unsafe redirect destinations: %s",
    async (destination) => {
      database.redirect.findUnique.mockResolvedValue({
        isActive: true,
        statusCode: 308,
        preserveQuery: true,
        destination,
      });
      expect(await findPublicRedirect("/old")).toBeNull();
    },
  );

  it("rejects cycles rather than redirecting visitors forever", async () => {
    database.redirect.findUnique.mockImplementation(async ({ where }) => ({
      isActive: true,
      statusCode: 308,
      preserveQuery: true,
      destination: where.sourcePath === "/old" ? "/new" : "/old",
    }));
    expect(await findPublicRedirect("/old")).toBeNull();
  });

  it("honors active internal redirects and preserves query values without replacing configured destination values", async () => {
    database.redirect.findUnique.mockResolvedValueOnce({
      isActive: true,
      statusCode: 308,
      preserveQuery: true,
      destination: "/new?source=cms#details",
    });
    const rule = await findPublicRedirect("/old");
    expect(rule).toEqual({
      destination: "/new?source=cms#details",
      permanent: true,
      preserveQuery: true,
    });
    expect(redirectDestination(rule!, { source: "old", tag: ["one", "two"] })).toBe(
      "/new?source=cms&tag=one&tag=two#details",
    );
  });

  it("normalizes Persian variants and searches complete approved content beyond the first 120 characters", async () => {
    expect(normalizePublicSearch("كُد نويسي")).toBe("کد نویسی");
    database.$queryRaw.mockResolvedValue([{ id: "33333333-3333-4333-8333-333333333333" }]);
    database.contentItem.findMany.mockImplementation(async ({ where }) =>
      where.id
        ? [
            content({
              translations: [{ ...translation(), bodyText: `${"مقدمه ".repeat(80)}نشانه ویژه` }],
            }),
          ]
        : [],
    );
    expect((await searchPublicCatalog("نشانه ویژه", "fa")).map(({ entry }) => entry.slug)).toEqual([
      "web-development",
    ]);
    expect(database.$queryRaw).toHaveBeenCalledOnce();
  });
});
