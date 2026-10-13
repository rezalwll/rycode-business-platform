import Link from "next/link";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { BrandText } from "@/components/site/brand-text";
import {
  catalogPath,
  getCatalogVisual,
  kindCopy,
  localize,
  type CatalogEntry,
} from "@/content/catalog";
import type { Locale } from "@/i18n/routing";
import type { PublicCatalogEntry, PublicContent } from "@/server/queries/public-content";
import { FinalBand, JsonLd, localizedHref, PageHero } from "./shared";
import {
  blogArchive,
  blogArchiveHref,
  blogCategory,
  blogReadingMinutes,
  relatedBlogEntries,
  type BlogQuery,
} from "./blog-model";
import "./blog.css";

const cleanTitle = (title: string) => title.trimEnd().replace(/[.。]+$/, "");
const blogImage = (entry: CatalogEntry) =>
  getCatalogVisual(entry) ?? {
    src: "/images/editorial/data-dashboard.png",
    alt: { fa: "", en: "" },
  };
const dateLabel = (date: string, locale: Locale) =>
  new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Tehran",
  }).format(new Date(date));

function BlogCard({
  locale,
  content,
  related = false,
}: {
  locale: Locale;
  content: PublicCatalogEntry;
  related?: boolean;
}) {
  const { entry, cms } = content;
  const image = blogImage(entry);
  const href = localizedHref(locale, catalogPath("blog", entry.slug));
  const title = cleanTitle(localize(entry.title, locale));
  const Arrow = locale === "fa" ? ArrowLeft : ArrowRight;
  const Heading = related ? "h3" : "h2";
  return (
    <BrandText>
      <article className="pn-card">
        <Link className="pn-card-media" href={href} aria-label={title}>
          <img
            src={image.src}
            alt={localize(image.alt, locale)}
            width={1024}
            height={683}
            loading="lazy"
          />
          <div className="pn-card-overlay" />
          <div className="pn-card-meta">
            <div className="pn-card-meta-right">
              <p className="pn-card-author">{locale === "fa" ? "تیم رایکد" : "RYCODE team"}</p>
              {cms && (
                <time className="pn-card-date" dateTime={cms.publishedAt}>
                  {dateLabel(cms.publishedAt, locale)}
                </time>
              )}
            </div>
            <span className="pn-chip">{blogCategory(entry, locale)}</span>
          </div>
        </Link>
        <div className="pn-card-body">
          <Heading className="pn-h2">
            <Link href={href}>{title}</Link>
          </Heading>
          <p className="pn-excerpt">{localize(entry.summary, locale)}</p>
          <Link
            className="pn-readmore"
            href={href}
            aria-label={`${locale === "fa" ? "مطالعهٔ" : "Read"} ${title}`}
          >
            {locale === "fa" ? "مطالعهٔ مطلب" : "Read article"}
            <Arrow size={17} aria-hidden />
          </Link>
        </div>
      </article>
    </BrandText>
  );
}

export function BlogIndex({
  locale,
  entries,
  query = {},
}: {
  locale: Locale;
  entries: PublicCatalogEntry[];
  query?: BlogQuery;
}) {
  const archive = blogArchive(entries, locale, query);
  const fa = locale === "fa";
  const numbers = new Intl.NumberFormat(fa ? "fa-IR" : "en");
  const visiblePages = Array.from(
    new Set([1, archive.page - 1, archive.page, archive.page + 1, archive.pages]),
  )
    .filter((page) => page >= 1 && page <= archive.pages)
    .sort((a, b) => a - b);
  return (
    <BrandText>
      <div className="rycode-blog" dir={fa ? "rtl" : "ltr"}>
        <PageHero
          locale={locale}
          eyebrow={localize(kindCopy.blog.eyebrow, locale)}
          title={fa ? "بلاگ رایکد" : "RYCODE blog"}
          lead={localize(kindCopy.blog.lead, locale)}
          imageSrc="/images/editorial/data-dashboard.png"
        />
        <section className="pn-archive section-space" aria-labelledby="blog-archive-title">
          <div className="page-container pn-main">
            <section className="pn-hero" aria-labelledby="blog-archive-title">
              <div className="pn-hero-main">
                <div>
                  <h2 className="pn-archive-title" id="blog-archive-title">
                    {fa ? "آخرین یادداشت‌ها و راهنماها" : "Latest notes and guides"}
                  </h2>
                </div>
                <form
                  className="pn-search-form"
                  action={localizedHref(locale, "/blog")}
                  method="get"
                  role="search"
                  aria-label={fa ? "جست‌وجوی بلاگ" : "Search the blog"}
                >
                  <label className="sr-only" htmlFor="blog-search">
                    {fa ? "جست‌وجوی موضوع، کلیدواژه یا عنوان" : "Search topics, keywords or titles"}
                  </label>
                  <input
                    className="pn-search-input"
                    id="blog-search"
                    type="search"
                    name="q"
                    defaultValue={archive.q}
                    maxLength={200}
                    placeholder={
                      fa
                        ? "جست‌وجوی موضوع، کلیدواژه یا عنوان…"
                        : "Search topics, keywords or titles…"
                    }
                  />
                  {archive.category && (
                    <input type="hidden" name="category" value={archive.category} />
                  )}
                  <button className="pn-btn pn-btn-blue" type="submit">
                    <Search size={17} aria-hidden />
                    {fa ? "جست‌وجو" : "Search"}
                  </button>
                </form>
              </div>
            </section>
            <nav className="pn-tabs" aria-label={fa ? "دسته‌بندی‌های بلاگ" : "Blog categories"}>
              {["", ...archive.categories].map((category) => (
                <Link
                  key={category}
                  className={`pn-tab${archive.category === category ? " is-active" : ""}`}
                  aria-current={archive.category === category ? "page" : undefined}
                  href={blogArchiveHref(locale, { q: archive.q, category })}
                >
                  {category || (fa ? "همه" : "All")}
                </Link>
              ))}
            </nav>
            {(archive.q || archive.category) && (
              <div className="pn-results">
                <p>
                  {fa
                    ? `${numbers.format(archive.total)} مطلب${archive.q ? ` برای «${archive.q}»` : ""}`
                    : `${archive.total} article${archive.total === 1 ? "" : "s"}${archive.q ? ` for “${archive.q}”` : ""}`}
                </p>
                <Link href={localizedHref(locale, "/blog")}>
                  {fa ? "پاک‌کردن فیلترها" : "Clear filters"}
                </Link>
              </div>
            )}
            {archive.entries.length ? (
              <section className="pn-post-grid" aria-label={fa ? "فهرست مطالب" : "Articles"}>
                {archive.entries.map((content) => (
                  <BlogCard key={content.entry.slug} locale={locale} content={content} />
                ))}
              </section>
            ) : (
              <div className="pn-empty">
                <h2>{fa ? "مطلبی پیدا نشد" : "No articles found"}</h2>
                <p>
                  {fa
                    ? "یک عبارت دیگر را امتحان کن یا همهٔ مطالب را ببین"
                    : "Try another search or browse all articles"}
                </p>
                <Link className="pn-btn pn-btn-blue" href={localizedHref(locale, "/blog")}>
                  {fa ? "همهٔ مطالب" : "All articles"}
                </Link>
              </div>
            )}
            {archive.pages > 1 && (
              <nav
                className="pn-pagination"
                aria-label={fa ? "صفحه‌بندی مطالب" : "Article pagination"}
              >
                {archive.page > 1 && (
                  <Link
                    className="page-numbers"
                    rel="prev"
                    href={blogArchiveHref(locale, {
                      q: archive.q,
                      category: archive.category,
                      page: String(archive.page - 1),
                    })}
                  >
                    {fa ? "قبلی" : "Previous"}
                  </Link>
                )}
                {visiblePages.map((page, index) => (
                  <span className="pn-page-number" key={page}>
                    {index > 0 && page - visiblePages[index - 1]! > 1 && (
                      <span aria-hidden className="pn-page-gap">
                        …
                      </span>
                    )}
                    <Link
                      className={`page-numbers${page === archive.page ? " current" : ""}`}
                      aria-current={page === archive.page ? "page" : undefined}
                      href={blogArchiveHref(locale, {
                        q: archive.q,
                        category: archive.category,
                        page: String(page),
                      })}
                    >
                      {numbers.format(page)}
                    </Link>
                  </span>
                ))}
                {archive.page < archive.pages && (
                  <Link
                    className="page-numbers"
                    rel="next"
                    href={blogArchiveHref(locale, {
                      q: archive.q,
                      category: archive.category,
                      page: String(archive.page + 1),
                    })}
                  >
                    {fa ? "بعدی" : "Next"}
                  </Link>
                )}
              </nav>
            )}
          </div>
        </section>
        <FinalBand locale={locale} />
      </div>
    </BrandText>
  );
}

export function BlogArticle({
  locale,
  entry,
  cms = null,
  related = [],
}: {
  locale: Locale;
  entry: CatalogEntry;
  cms?: PublicContent | null;
  related?: PublicCatalogEntry[];
}) {
  const fa = locale === "fa";
  const image = blogImage(entry);
  const title = cleanTitle(localize(entry.title, locale));
  const category = blogCategory(entry, locale);
  const recommendations = relatedBlogEntries(entry, related, locale);
  const Arrow = fa ? ArrowRight : ArrowLeft;
  return (
    <BrandText>
      <div className="rycode-blog" dir={fa ? "rtl" : "ltr"}>
        <JsonLd
          value={{
            "@context": "https://schema.org",
            "@type": "Article",
            headline: title,
            description: localize(entry.summary, locale),
            inLanguage: fa ? "fa-IR" : "en",
            url: localizedHref(locale, catalogPath("blog", entry.slug)),
            author: { "@type": "Organization", name: "RYCODE" },
            ...(cms ? { datePublished: cms.publishedAt, dateModified: cms.updatedAt } : {}),
          }}
        />
        <div className="pn-single-main section-space">
          <div className="page-container pn-single-wrap">
            <Link className="pn-back" href={localizedHref(locale, "/blog")}>
              <Arrow size={17} aria-hidden />
              {fa ? "بازگشت به بلاگ" : "Back to the blog"}
            </Link>
            <article id="top" aria-labelledby="article-title">
              <figure className="pn-single-hero">
                <img
                  src={image.src}
                  alt={localize(image.alt, locale)}
                  width={2048}
                  height={1365}
                  fetchPriority="high"
                />
              </figure>
              <header className="pn-single-header">
                <h1 id="article-title" className="pn-single-title">
                  {title}
                </h1>
                <div className="pn-single-meta">
                  <span>{fa ? "تیم رایکد" : "RYCODE team"}</span>
                  {cms && (
                    <>
                      <span aria-hidden>•</span>
                      <time dateTime={cms.publishedAt}>{dateLabel(cms.publishedAt, locale)}</time>
                    </>
                  )}
                  <span aria-hidden>•</span>
                  <Link href={blogArchiveHref(locale, { category })}>{category}</Link>
                  <span aria-hidden>•</span>
                  <span>
                    {fa
                      ? `${new Intl.NumberFormat("fa-IR").format(blogReadingMinutes(entry, locale))} دقیقه مطالعه`
                      : `${blogReadingMinutes(entry, locale)} min read`}
                  </span>
                </div>
              </header>
              <div className="pn-single-content">
                <p className="pn-article-lead">{localize(entry.summary, locale)}</p>
                {entry.sections.map((section, index) => (
                  <section className="reference-content-section" key={`${entry.slug}-${index}`}>
                    <h2>{cleanTitle(localize(section.title, locale))}</h2>
                    {section.body &&
                      localize(section.body, locale)
                        .split(/\n\s*\n/u)
                        .map((paragraph, p) => <p key={p}>{paragraph}</p>)}
                    {section.items && (
                      <ul>
                        {section.items.map((item, i) => (
                          <li key={i}>{localize(item, locale)}</li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))}
              </div>
            </article>
            <section className="pn-download-banner" aria-labelledby="blog-cta-title">
              <div className="pn-download-banner-inner">
                <h2 className="pn-download-banner-title" id="blog-cta-title">
                  {fa ? "حالا نوبت پروژهٔ خودته" : "Put the next step into practice"}
                </h2>
                <p className="pn-download-banner-text">
                  {fa
                    ? "اگر این مطلب به مسئلهٔ تو نزدیکه، با هم دربارهٔ راه‌حلش حرف بزنیم؛ چه شروع یک پروژه باشه، چه جمع‌وجورکردن چیزی که نیمه‌کاره مونده"
                    : "If this sounds like your challenge, let’s talk about the next step—whether you’re starting something new or getting an existing project back on track"}
                </p>
                <div className="pn-download-banner-actions">
                  <Link
                    className="pn-btn pn-btn-orange"
                    href={localizedHref(locale, "/start-project")}
                  >
                    {fa ? "دربارهٔ پروژه‌ات بگو" : "Tell us about your project"}
                  </Link>
                  <Link className="pn-btn pn-btn-outline" href={localizedHref(locale, "/services")}>
                    {fa ? "خدمات رایکد" : "RYCODE services"}
                  </Link>
                </div>
              </div>
            </section>
            {recommendations.length > 0 && (
              <section className="pn-related-posts" aria-labelledby="related-title">
                <h2 className="pn-related-title" id="related-title">
                  {fa ? "شاید این‌ها هم به کارت بیاد" : "Keep reading"}
                </h2>
                <div className="pn-post-grid">
                  {recommendations.map((content) => (
                    <BlogCard locale={locale} content={content} related key={content.entry.slug} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </BrandText>
  );
}
