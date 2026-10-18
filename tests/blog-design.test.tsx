// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BlogIndex, BlogArticle } from "@/components/public/blog";
import {
  blogArchive,
  blogArchiveHref,
  blogReadingMinutes,
  relatedBlogEntries,
} from "@/components/public/blog-model";
import { getCatalogEntries, kindCopy, type CatalogEntry } from "@/content/catalog";
import { PublicCatalogHub } from "@/components/public/cms-catalog";
import { CatalogDetail } from "@/components/public/catalog-pages";
import type { PublicCatalogEntry, PublicContent } from "@/server/queries/public-content";

const entry = getCatalogEntries("blog")[0]!;
const published = (item: CatalogEntry): PublicCatalogEntry => ({
  source: "static",
  entry: item,
  cms: null,
});
const articles = Array.from({ length: 14 }, (_, index) =>
  published({
    ...entry,
    slug: `article-${index}`,
    title: { fa: `مقاله ${index} طراحی سایت`, en: `Article ${index} web design` },
    eyebrow: index % 2 ? { fa: "طراحی / راهنما", en: "Design / Guide" } : entry.eyebrow,
  }),
);
const cms: PublicContent = {
  kind: "blog",
  slug: entry.slug,
  title: entry.title.fa,
  summary: entry.summary.fa,
  eyebrow: entry.eyebrow.fa,
  sections: [],
  noIndex: false,
  position: 0,
  publishedAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-02T00:00:00Z",
  seoTitle: null,
  seoDescription: null,
  canonicalUrl: null,
  ogTitle: null,
  ogDescription: null,
  locales: ["fa"],
};
const documentFor = (markup: string) => new DOMParser().parseFromString(markup, "text/html");

describe("Paknevis blog structure adapted to RYCODE", () => {
  it("filters the real catalog with Persian/Arabic text normalization and body search", () => {
    expect(blogArchive(articles, "fa", { q: "طراحي سايت" }).total).toBe(14);
    expect(blogArchive([published(entry)], "fa", { q: "امنیت داده" }).total).toBe(1);
    expect(blogArchive(articles, "fa", { q: "missing" }).total).toBe(0);
    expect(blogArchive(articles, "en", { q: "web DESIGN", category: "Design" }).total).toBe(7);
    expect(blogArchive(articles, "fa", { category: "طراحی" }).total).toBe(7);
    expect(blogArchive(articles, "fa", { category: "not-a-category" }).category).toBe("");
  });
  it("paginates without duplicate articles and handles invalid/extreme page numbers", () => {
    expect(blogArchive(articles, "fa").entries).toHaveLength(6);
    const second = blogArchive(articles, "fa", { page: "2" });
    expect(second.entries[0]?.entry.slug).toBe("article-6");
    expect(second.pages).toBe(3);
    expect(blogArchive(articles, "fa", { page: "999" }).entries).toHaveLength(2);
    for (const page of ["-1", "0", "2.1", "NaN", "Infinity"])
      expect(blogArchive(articles, "fa", { page }).page).toBe(1);
    expect(blogArchive([], "fa", { page: "8" }).page).toBe(1);
  });
  it("keeps query/category and localized URLs in search, tabs and pagination", () => {
    const doc = documentFor(
      renderToStaticMarkup(
        <BlogIndex
          locale="en"
          entries={articles}
          query={{ q: "web", category: "Design", page: "2" }}
        />,
      ),
    );
    const form = doc.querySelector('form[role="search"]')!;
    expect(form.closest(".photo-hero-frame")).toBeTruthy();
    expect(form.getAttribute("action")).toBe("/en/blog");
    expect(form.getAttribute("method")).toBe("get");
    expect(form.querySelector('input[name="q"]')?.getAttribute("value")).toBe("web");
    expect(form.querySelector('input[name="category"]')?.getAttribute("value")).toBe("Design");
    const url = new URL(
      doc.querySelector('.pn-pagination a[rel="prev"]')!.getAttribute("href")!,
      "https://rycode.test",
    );
    expect(url.pathname).toBe("/en/blog");
    expect(url.searchParams.get("q")).toBe("web");
    expect(url.searchParams.get("category")).toBe("Design");
    expect(doc.querySelector('.pn-tab[aria-current="page"]')?.textContent).toBe("Design");
    expect(blogArchiveHref("fa", { q: "a&b", category: "<test>" })).toContain("q=a%26b");
  });
  it("overlays the title, lead and search on the retained hero image without changing the archive", () => {
    for (const locale of ["fa", "en"] as const) {
      const doc = documentFor(
        renderToStaticMarkup(<PublicCatalogHub locale={locale} kind="blog" entries={articles} />),
      );
      expect(doc.querySelector(".rycode-blog")?.getAttribute("dir")).toBe(
        locale === "fa" ? "rtl" : "ltr",
      );
      expect(doc.querySelectorAll("h1")).toHaveLength(1);
      const hero = doc.querySelector(".pn-blog-hero .photo-hero-frame")!;
      expect(hero.querySelector("h1")?.textContent).toBe(
        locale === "fa" ? "بلاگ رایکد" : "RYCODE blog",
      );
      expect(hero.querySelector(".pn-lead")?.textContent).toBe(kindCopy.blog.lead[locale]);
      expect(hero.querySelector('form[role="search"]')).toBeTruthy();
      expect(hero.querySelector(".photo-hero-image")?.getAttribute("src")).toBe(
        "/images/editorial/data-dashboard.png",
      );
      expect(doc.querySelectorAll('form[role="search"]')).toHaveLength(1);
      expect(doc.querySelector(".pn-archive form")).toBeNull();
      expect(doc.querySelector(".pn-tabs")).toBeTruthy();
      expect(doc.querySelectorAll(".pn-post-grid .pn-card")).toHaveLength(6);
      expect(doc.querySelector(".photo-hero")).toBeTruthy();
      expect(doc.querySelector(".reference-page-intro")).toBeNull();
      expect(doc.querySelector(".pn-archive.section-space > .page-container")).toBeTruthy();
      expect(doc.querySelector(".inner-endnote a")?.getAttribute("href")).toBe(
        locale === "fa" ? "/start-project" : "/en/start-project",
      );
      expect(doc.querySelector(".pn-archive h1")).toBeNull();
      expect(doc.body.textContent).not.toContain("پاک‌نویس");
    }
  });
  it("escapes search text and provides a useful empty state, without fabricated posts", () => {
    const doc = documentFor(
      renderToStaticMarkup(
        <BlogIndex
          locale="fa"
          entries={[published(entry)]}
          query={{ q: "<script>alert(1)</script>" }}
        />,
      ),
    );
    expect(doc.querySelector(".pn-empty")).toBeTruthy();
    expect(doc.querySelectorAll("script")).toHaveLength(0);
    expect(doc.querySelectorAll(".pn-card")).toHaveLength(0);
    expect(doc.querySelector(".pn-empty a")?.getAttribute("href")).toBe("/blog");
  });
  it("preserves complete article content, unclipped image, CTA and real CMS publication data", () => {
    const doc = documentFor(
      renderToStaticMarkup(
        <CatalogDetail locale="fa" entry={entry} cms={cms} related={articles} />,
      ),
    );
    const article = doc.querySelector("article#top")!;
    expect(article.querySelectorAll(".reference-content-section")).toHaveLength(
      entry.sections.length,
    );
    for (const section of entry.sections) {
      expect(article.textContent).toContain(section.title.fa);
      if (section.body) expect(article.textContent).toContain(section.body.fa);
      for (const item of section.items ?? []) expect(article.textContent).toContain(item.fa);
    }
    expect(article.querySelector("figure.pn-single-hero")).toBeTruthy();
    expect(article.querySelector(".inner-article-layout")).toBeTruthy();
    for (const link of article.querySelectorAll<HTMLAnchorElement>(".inner-toc a")) {
      expect(article.querySelector(link.getAttribute("href")!)).toBeTruthy();
    }
    expect(article.querySelectorAll(".inner-toc a")).toHaveLength(entry.sections.length);
    expect(article.querySelector("time")?.getAttribute("datetime")).toBe(cms.publishedAt);
    expect(doc.querySelectorAll(".pn-download-banner a")).toHaveLength(2);
    expect(doc.querySelectorAll(".pn-related-posts .pn-card")).toHaveLength(2);
    expect(doc.querySelector(".pn-download-banner .pn-btn-orange")?.getAttribute("href")).toBe(
      "/start-project",
    );
    const schema = JSON.parse(
      doc.querySelector('script[type="application/ld+json"]')!.textContent!,
    );
    expect(schema["@type"]).toBe("Article");
    expect(schema.datePublished).toBe(cms.publishedAt);
  });
  it("does not invent dates or duplicate the current article in recommendations", () => {
    const doc = documentFor(
      renderToStaticMarkup(<BlogArticle locale="en" entry={entry} related={[published(entry)]} />),
    );
    expect(doc.querySelector("time")).toBeNull();
    expect(doc.querySelector(".pn-related-posts")).toBeNull();
    expect(
      relatedBlogEntries(articles[1]!.entry, articles, "fa").every(
        (content) => content.entry.slug !== "article-1",
      ),
    ).toBe(true);
    expect(relatedBlogEntries(articles[1]!.entry, articles, "fa")[0]?.entry.slug).toBe("article-3");
    expect(blogReadingMinutes(entry, "fa")).toBeGreaterThan(0);
  });
  it("scopes reference geometry and RYCODE accents to blog pages only", () => {
    const css = readFileSync(resolve("src/components/public/blog.css"), "utf8");
    expect(css).toMatch(/grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
    expect(css).toContain("--pn-bg: #f2f2f2");
    expect(css).toContain("max-width: 700px");
    expect(css).toContain("max-height: 340px");
    expect(css).toContain("var(--accent-blue)");
    expect(css).toContain("var(--action)");
    expect(css).toContain("var(--detail-purple)");
    expect(css).not.toMatch(/(?:^|\n)(?:body|html|:root|\*)\s*\{/u);
    const internalCss = readFileSync(resolve("src/components/public/inner-pages.css"), "utf8");
    expect(internalCss).toContain(".coorda-reference .rycode-inner.rycode-blog");
    expect(internalCss).toContain("--pn-bg: var(--inner-surface)");
    expect(internalCss).toContain(".inner-article-layout");
  });
});
