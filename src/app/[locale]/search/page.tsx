import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicContentCards } from "@/components/public/cms-catalog";
import { SearchTracker } from "@/components/analytics/search-tracker";
import { localizedHref } from "@/components/public/shared";
import { InnerHero } from "@/components/public/inner-ui";
import { SiteShell } from "@/components/site/site-shell";
import { isLocale } from "@/i18n/routing";
import { normalizePublicSearch, searchPublicCatalog } from "@/server/queries/public-content";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string | string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return {
    title: locale === "fa" ? "جست‌وجوی سایت" : "Search the site",
    robots: { index: false, follow: true },
    alternates: { canonical: localizedHref(locale, "/search") },
  };
}

export default async function SearchPage({ params, searchParams }: Props) {
  const [{ locale }, search] = await Promise.all([params, searchParams]);
  if (!isLocale(locale)) notFound();
  const query = typeof search.q === "string" ? search.q.trim().slice(0, 120) : "";
  const ready = normalizePublicSearch(query).length >= 2;
  const entries = ready ? await searchPublicCatalog(query, locale) : [];
  return (
    <SiteShell locale={locale}>
      <div className="rycode-inner inner-search-page" dir={locale === "fa" ? "rtl" : "ltr"}>
        <InnerHero
          locale={locale}
          eyebrow="RYCODE / SEARCH"
          title={locale === "fa" ? "دنبال چه می‌گردید؟" : "What are you looking for?"}
          lead={
            locale === "fa"
              ? "در خدمات، راهکارها و مطالب رای‌کد جست‌وجو کنید."
              : "Find services, solutions and articles from RYCODE."
          }
          layout="center"
        >
          <form
            action={localizedHref(locale, "/search")}
            method="get"
            role="search"
            className="inner-search-form"
            data-analytics-form="site-search"
          >
            <label className="inner-search-label" htmlFor="site-search">
              {locale === "fa" ? "عبارت جست‌وجو" : "Search term"}
              <input
                id="site-search"
                name="q"
                type="search"
                minLength={2}
                maxLength={120}
                defaultValue={query}
                required
                className="inner-search-input"
              />
            </label>
            <button className="inner-button" type="submit">
              {locale === "fa" ? "جست‌وجو" : "Search"}
            </button>
          </form>
        </InnerHero>
        <section className="inner-section inner-container">
          {ready && <SearchTracker queryLength={query.length} resultCount={entries.length} />}
          {ready ? (
            <>
              <p role="status" className="mb-6 text-sm text-muted-foreground">
                {locale === "fa"
                  ? `${entries.length} نتیجه برای «${query}»`
                  : `${entries.length} results for “${query}”`}
              </p>
              <div className="relative">
                <PublicContentCards locale={locale} entries={entries} />
              </div>
            </>
          ) : (
            <p className="text-muted-foreground">
              {locale === "fa" ? "دست‌کم دو حرف وارد کنید." : "Enter at least two characters."}
            </p>
          )}
        </section>
      </div>
    </SiteShell>
  );
}
