import { ArrowUpLeft, ArrowUpRight } from "lucide-react";
import { BrandText } from "@/components/site/brand-text";
import Image from "next/image";
import Link from "next/link";

import { catalogContextVariant, ContextVisual } from "@/components/site/context-visual";
import { Container } from "@/components/site/primitives";
import {
  catalogPath,
  getCatalogEntries,
  getCatalogVisual,
  kindCopy,
  localize,
  type CatalogEntry,
  type CatalogKind,
} from "@/content/catalog";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { familyForService, serviceEnquiry } from "@/content/service-model";

import { ActionLink, FinalBand, JsonLd, localizedHref, PageHero } from "./shared";
import { BlogArticle } from "./blog";
import type { PublicCatalogEntry, PublicContent } from "@/server/queries/public-content";

const contentTones = [
  {
    card: "border-[#20bfb2]/18 bg-gradient-to-bl from-[#5fe1d5]/8 via-white/90 to-white/80 hover:border-[#20bfb2]/45",
    rail: "border-s-[#20bfb2]/75",
    label: "text-[#0b8f87]",
  },
  {
    card: "border-[#6c92f4]/18 bg-gradient-to-bl from-[#6c92f4]/8 via-white/90 to-white/80 hover:border-[#6c92f4]/45",
    rail: "border-s-[#6c92f4]/75",
    label: "text-[#5674c5]",
  },
  {
    card: "border-[#9b78d5]/18 bg-gradient-to-bl from-[#9b78d5]/8 via-white/90 to-white/80 hover:border-[#9b78d5]/45",
    rail: "border-s-[#9b78d5]/75",
    label: "text-[#7f5fba]",
  },
  {
    card: "border-[#d06f9a]/18 bg-gradient-to-bl from-[#d06f9a]/8 via-white/90 to-white/80 hover:border-[#d06f9a]/45",
    rail: "border-s-[#d06f9a]/75",
    label: "text-[#ae527d]",
  },
] as const;

function contentTone(index: number) {
  return contentTones[index % contentTones.length] ?? contentTones[0];
}

const labels: Record<
  CatalogKind,
  { fa: { item: string; back: string }; en: { item: string; back: string } }
> = {
  services: {
    fa: { item: "خدمت", back: "همه خدمات" },
    en: { item: "Service", back: "All services" },
  },
  solutions: {
    fa: { item: "راهکار", back: "بازگشت به سیستم‌های قابل ساخت" },
    en: { item: "Solution", back: "Back to systems we build" },
  },
  problems: {
    fa: { item: "مسئله", back: "همه مسائل" },
    en: { item: "Problem", back: "All problems" },
  },
  industries: {
    fa: { item: "صنعت", back: "بازگشت به خدمات کسب‌وکارها" },
    en: { item: "Industry", back: "Back to services for your business" },
  },
  integrations: {
    fa: { item: "اتصال", back: "همه اتصال‌ها" },
    en: { item: "Integration", back: "All integrations" },
  },
  projects: {
    fa: { item: "مطالعه", back: "همه مطالعات" },
    en: { item: "Study", back: "All studies" },
  },
  blog: { fa: { item: "مطلب", back: "همه مطالب" }, en: { item: "Article", back: "All articles" } },
};

export function CatalogHub({ locale, kind }: { locale: Locale; kind: CatalogKind }) {
  const copy = kindCopy[kind];
  const entries = getCatalogEntries(kind);
  const Arrow = locale === "fa" ? ArrowUpLeft : ArrowUpRight;

  return (
    <BrandText><>
      <PageHero
        locale={locale}
        eyebrow={localize(copy.eyebrow, locale)}
        title={localize(copy.title, locale)}
        lead={localize(copy.lead, locale)}
        visualVariant={catalogContextVariant(kind, "")}
        aside={
          <>
            <span className="meta-label block text-[#5fe1d5]">
              {String(entries.length).padStart(2, "0")} / {kind.toUpperCase()}
            </span>
            <span className="mt-3 block">
              {locale === "fa"
                ? "از چیزی که لازم دارید شروع کنید؛ اسم فنی‌اش مهم نیست."
                : "This collection is organised around problems and outcomes."}
            </span>
          </>
        }
      />
      <section className="relative overflow-hidden bg-surface-2 py-14 sm:py-20">
        <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_15%_12%,rgba(32,191,178,0.1),transparent_26%),radial-gradient(circle_at_86%_72%,rgba(99,146,255,0.08),transparent_28%)]" />
        <Container>
          <div className="relative grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {entries.map((entry, index) => {
              const visual = getCatalogVisual(entry);
              return (
                <Link
                  key={entry.slug}
                  href={localizedHref(locale, catalogPath(kind, entry.slug))}
                  className={cn(
                    "group relative overflow-hidden rounded-xl border p-3 shadow-[0_10px_32px_rgba(31,92,105,0.06)] backdrop-blur-sm transition-[box-shadow,border-color] duration-300 ",
                    contentTone(index).card,
                  )}
                >
                  <div className="relative aspect-[16/9] overflow-hidden rounded-[1rem] bg-ink">
                    {visual ? (
                      <Image
                        src={visual.src}
                        alt={localize(visual.alt, locale)}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <ContextVisual
                        variant={catalogContextVariant(entry.kind, entry.slug)}
                        title={localize(entry.title, locale)}
                        items={entry.sections.map((section) => localize(section.title, locale))}
                        className="absolute inset-0 min-h-0"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#00364a]/95 via-transparent to-transparent" />
                    <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-4">
                      <span className="meta-label text-white/70">
                        {String(index + 1).padStart(2, "0")} / {labels[kind][locale].item}
                      </span>
                      <span className="grid size-9 place-items-center rounded-full border border-white/25 bg-[#00364a]/35 text-white backdrop-blur-sm transition-colors group-hover:border-[#5fe1d5] group-hover:bg-[#5fe1d5] group-hover:text-[#00364a]">
                        <Arrow className="size-4" aria-hidden />
                      </span>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5">
                    <h2 className="display-3 text-foreground">{localize(entry.title, locale)}</h2>
                    <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
                      {localize(entry.summary, locale)}
                    </p>
                    {entry.conceptual && (
                      <span className="mt-5 inline-flex rounded-full border border-[#20bfb2]/35 bg-[#5fe1d5]/10 px-3 py-1 text-xs font-semibold text-[#0b766e]">
                        {locale === "fa" ? "یک نمونه فرضی" : "Concept study"}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>
      <FinalBand locale={locale} />
    </></BrandText>
  );
}

export function CatalogDetail({ locale, entry, cms = null, related = [] }: { locale: Locale; entry: CatalogEntry; cms?: PublicContent | null; related?: PublicCatalogEntry[] }) {
  if (entry.kind === "blog") return <BlogArticle locale={locale} entry={entry} cms={cms} related={related} />;
  const kindLabel = labels[entry.kind][locale];
  const visual = getCatalogVisual(entry);
  const family = entry.kind === "services" ? familyForService(entry.slug) : undefined;
  const enquiry = entry.kind === "services" ? serviceEnquiry(entry.slug) : { href: "/start-project", label: { fa: "شروع گفت‌وگو", en: "Start a conversation" } };
  return <BrandText><>
    <JsonLd value={{
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: localize(entry.title, locale),
      description: localize(entry.summary, locale),
      inLanguage: locale === "fa" ? "fa-IR" : "en",
      url: localizedHref(locale, catalogPath(entry.kind, entry.slug)),
    }} />
    <article id="top" className="article-page" aria-labelledby="article-title">
      <div className="page-container article-container">
        <div className="article-header">
          <Link className="article-back" href={localizedHref(locale, family ? `/services#${family.id}` : catalogPath(entry.kind))}>
            {locale === "fa" ? <ArrowUpRight size={20} strokeWidth={1.5} aria-hidden /> : <ArrowUpLeft size={20} strokeWidth={1.5} aria-hidden />}
            {kindLabel.back}
          </Link>
          <div className="article-heading">
            <h1 id="article-title">{localize(entry.title, locale).trimEnd().replace(/[.。]+$/, "")}</h1>
            <div className="article-metadata">
              <div className="article-byline"><img src="/coorda-template/rycode-black.svg" width={32} height={32} alt="" /><span>RYCODE</span></div>
              <div><span>{kindLabel.item}</span><span>{localize(entry.eyebrow, locale)}</span></div>
              {entry.conceptual && <div><span>{locale === "fa" ? "نوع نمونه" : "Study type"}</span><span>{locale === "fa" ? "مطالعهٔ مفهومی، نه پروژهٔ واقعی" : "Concept scenario, not client work"}</span></div>}
            </div>
          </div>
        </div>
        <div className="article-divider" />
        <img className="article-image" src={visual?.src ?? "/images/editorial/web-experience.png"} width={2048} height={1365} alt={visual ? localize(visual.alt, locale) : ""} fetchPriority="high" />
        <div className="article-body">
          <p>{localize(entry.summary, locale)}</p>
          {entry.sections.map((section, index) => <section key={`${entry.slug}-${index}`} className="reference-content-section">
            <h2>{localize(section.title, locale)}</h2>
            {section.body && <p>{localize(section.body, locale)}</p>}
            {section.items && <ul>{section.items.map(item => <li key={localize(item, locale)}>{localize(item, locale)}</li>)}</ul>}
          </section>)}
        </div>
      </div>
    </article>
    <section className="article-related section-space">
      <div className="page-container">
        <div className="article-related-heading">
          <h2 className="page-section-heading">{locale === "fa" ? "دربارهٔ این مسیر حرف بزنیم" : "Discuss this path"}</h2>
          <Link className="hero-cta" href={localizedHref(locale, enquiry.href)}>
            <span className="hero-cta-label">{enquiry.label[locale]}</span>
            <span className="hero-cta-label hero-cta-label-copy" aria-hidden>{enquiry.label[locale]}</span>
          </Link>
        </div>
      </div>
    </section>
    <FinalBand locale={locale} />
  </></BrandText>;
}
