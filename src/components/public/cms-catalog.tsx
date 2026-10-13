import { ArrowUpLeft, ArrowUpRight } from "lucide-react";
import { BrandText } from "@/components/site/brand-text";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { catalogContextVariant } from "@/components/site/context-visual";
import { Container } from "@/components/site/primitives";
import {
  catalogPath,
  getCatalogVisual,
  kindCopy,
  localize,
  type CatalogKind,
} from "@/content/catalog";
import type { Locale } from "@/i18n/routing";
import type { PublicCatalogEntry } from "@/server/queries/public-content";

import { ActionLink, FinalBand, localizedHref, PageHero } from "./shared";
import { ServiceContext } from "./service-context";
import { ServiceShowcase } from "@/components/home/service-showcase";
import { serviceFamilies, serviceExampleEntries } from "@/content/service-model";
import { BlogIndex } from "./blog";
import type { BlogQuery } from "./blog-model";

export function PublicContentCards({ locale, entries }: { locale: Locale; entries: PublicCatalogEntry[] }) {
  if (!entries.length) return <BrandText><div className="archive-empty"><p>{locale === "fa" ? "محتوایی برای نمایش وجود ندارد" : "No content is available yet"}</p></div></BrandText>;
  return <BrandText><div className="insights-grid archive-grid">
    {entries.map(({ entry }) => {
      const visual = getCatalogVisual(entry);
      const id = `catalog-${entry.kind}-${entry.slug}`;
      return <article className="insight-article" key={id}>
        <Link className="insight-card" href={localizedHref(locale, catalogPath(entry.kind, entry.slug))} aria-labelledby={id}>
          <div className="insight-photo">
            <img src={visual?.src ?? "/images/editorial/web-experience.png"} width={1024} height={683} alt={visual ? localize(visual.alt, locale) : ""} loading="lazy" />
          </div>
          <div className="insight-content">
            <h3 id={id}>{localize(entry.title, locale)}</h3>
            <div className="insight-meta">
              <span className="insight-author"><img src="/coorda-template/rycode-black.svg" width={44} height={28} alt="" /><span>{localize(entry.eyebrow, locale)}</span></span>
              {entry.conceptual && <><span className="insight-divider" aria-hidden="true" /><span>{locale === "fa" ? "مطالعه مفهومی" : "Concept study"}</span></>}
            </div>
            <p className="reference-card-summary">{localize(entry.summary, locale)}</p>
          </div>
        </Link>
      </article>;
    })}
  </div></BrandText>;
}

export function PublicCatalogHub({
  locale,
  kind,
  entries,
  solutions = [],
  industries = [],
  projects = [],
  blogQuery,
}: {
  locale: Locale;
  kind: CatalogKind;
  entries: PublicCatalogEntry[];
  solutions?: PublicCatalogEntry[];
  industries?: PublicCatalogEntry[];
  projects?: PublicCatalogEntry[];
  blogQuery?: BlogQuery;
}) {
  if (kind === "blog") return <BlogIndex locale={locale} entries={entries} query={blogQuery ?? {}} />;
  const copy = kindCopy[kind];
  const examples = serviceExampleEntries(projects.map(({ entry }) => entry));
  return (
    <BrandText><>
      <PageHero
        locale={locale}
        eyebrow={localize(copy.eyebrow, locale)}
        title={localize(copy.title, locale)}
        lead={localize(copy.lead, locale)}
        visualVariant={catalogContextVariant(kind, "")}
        aside={
          kind === "services" ? <div className="reference-service-start">
            <p>{locale === "fa" ? "هنوز نمی‌دانی کدام خدمت مناسب توست؟ از وضعیت فعلی‌ات شروع کن" : "Not sure which service fits? Start with where you are today."}</p>
            <div>
              <ActionLink locale={locale} href="/start-project" secondary>{locale === "fa" ? "یک پروژهٔ تازه دارم" : "I have a new project"}</ActionLink>
              <ActionLink locale={locale} href="/technical-review" secondary>{locale === "fa" ? "پروژه‌ام نیاز به بررسی دارد" : "My project needs a review"}</ActionLink>
              <ActionLink locale={locale} href="/seo-audit" secondary>{locale === "fa" ? "می‌خواهم سایتم بهتر دیده شود" : "I want my site to get found"}</ActionLink>
            </div>
          </div> : <>
            <span className="meta-label block text-foreground">
              {String(entries.length).padStart(2, "0")} / {kind.toUpperCase()}
            </span>
            <Link
              className="mt-4 inline-flex font-semibold text-white/80 transition-colors hover:text-foreground"
              href={localizedHref(locale, "/search")}
            >
              {locale === "fa" ? "جست‌وجوی سایت" : "Search the site"}
            </Link>
          </>
        }
      />
      <section
        id={kind === "services" ? "services" : undefined}
        className="insights-archive section-space"
      >
        <Container>
          <div className="relative">
            {kind === "services" && (
              <nav
                aria-label={locale === "fa" ? "بخش‌های خدمات" : "Service sections"}
                className="mb-8 flex flex-wrap gap-2"
              >
                {[
                  ...serviceFamilies.map((family) => ({
                    id: family.id,
                    label: family.title[locale],
                    available: entries.some(({ entry }) =>
                      (family.slugs as readonly string[]).includes(entry.slug),
                    ),
                  })),
                  {
                    id: "solutions",
                    label: locale === "fa" ? "سیستم‌های قابل ساخت" : "Systems we build",
                    available: solutions.length > 0,
                  },
                  {
                    id: "industries",
                    label: locale === "fa" ? "برای کسب‌وکار شما" : "For your business",
                    available: industries.length > 0,
                  },
                ]
                  .filter((item) => item.available)
                  .map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand hover:bg-brand-soft"
                    >
                      {item.label}
                    </a>
                  ))}
              </nav>
            )}
            {kind === "services" ? (
              <>
                {serviceFamilies.map((family) => {
                  const familyEntries = family.slugs.flatMap((slug) => {
                    const found = entries.find(({ entry }) => entry.slug === slug);
                    return found ? [found] : [];
                  });
                  return familyEntries.length > 0 ? (
                    <section
                      key={family.id}
                      id={family.id}
                      className="services-family-block"
                      style={{ "--family-accent": family.accent } as CSSProperties}
                      aria-labelledby={`family-${family.id}-title`}
                    >
                      <div className="services-family-heading">
                        <div>
                          <span className="studio-label">{family.tagline[locale]}</span>
                          <h2 id={`family-${family.id}-title`}>{family.title[locale]}</h2>
                        </div>
                        <div className="reference-family-copy">
                          <p className="studio-body">{family.description[locale]}</p>
                          <p className="reference-family-scope">{family.scope[locale]}</p>
                        </div>
                      </div>
                      <PublicContentCards locale={locale} entries={familyEntries} />
                      {family.slugs.some(slug => examples[slug]?.length) && (
                        <div className="reference-family-examples">
                          <h3>{locale === "fa" ? "این خدمت در یک سناریوی مفهومی" : "This service in a concept study"}</h3>
                          <PublicContentCards locale={locale} entries={projects.filter(({entry}) => family.slugs.some(slug => examples[slug]?.some(example => example.slug === entry.slug)))} />
                        </div>
                      )}
                    </section>
                  ) : null;
                })}
                {entries.some(
                  ({ entry }) =>
                    !serviceFamilies.some((family) =>
                      (family.slugs as readonly string[]).includes(entry.slug),
                    ),
                ) && (
                  <section className="services-family-block">
                    <h2 className="display-2 mb-6">
                      {locale === "fa" ? "خدمات دیگر" : "More services"}
                    </h2>
                    <PublicContentCards
                      locale={locale}
                      entries={entries.filter(
                        ({ entry }) =>
                          !serviceFamilies.some((family) =>
                            (family.slugs as readonly string[]).includes(entry.slug),
                          ),
                      )}
                    />
                  </section>
                )}
              </>
            ) : (
              <PublicContentCards locale={locale} entries={entries} />
            )}
          </div>
        </Container>
      </section>
      {kind === "services" && (
        <ServiceContext locale={locale} solutions={solutions} industries={industries} />
      )}
      <FinalBand locale={locale} />
    </></BrandText>
  );
}
