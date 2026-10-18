import { ArrowUpLeft, ArrowUpRight } from "lucide-react";
import { BrandText } from "@/components/site/brand-text";
import Link from "next/link";
import Image from "next/image";
import {
  catalogPath,
  getCatalogVisual,
  kindCopy,
  localize,
  type CatalogKind,
} from "@/content/catalog";
import type { Locale } from "@/i18n/routing";
import type { PublicCatalogEntry } from "@/server/queries/public-content";
import { serviceFamilies, serviceExampleEntries } from "@/content/service-model";
import { BlogIndex } from "./blog";
import type { BlogQuery } from "./blog-model";
import { ServiceContext } from "./service-context";
import { localizedHref } from "./shared";
import { InnerHero, InnerLink, InnerEndnote, cleanInnerTitle, servicePageImage } from "./inner-ui";

export function PublicContentCards({
  locale,
  entries,
  layout = "grid",
}: {
  locale: Locale;
  entries: PublicCatalogEntry[];
  layout?: "grid" | "work" | "related";
}) {
  if (!entries.length)
    return (
      <p className="inner-help-empty">
        {locale === "fa" ? "محتوایی برای نمایش وجود ندارد" : "No content is available yet"}
      </p>
    );
  const Heading = layout === "related" ? "h3" : "h2";
  return (
    <BrandText>
      <div className={`inner-catalog-grid ${layout === "work" ? "inner-work-grid" : ""}`}>
        {entries.map(({ entry }) => {
          const visual = getCatalogVisual(entry);
          return (
            <article className="inner-catalog-card" key={`${entry.kind}-${entry.slug}`}>
              <Link href={localizedHref(locale, catalogPath(entry.kind, entry.slug))}>
                <Image
                  src={
                    visual?.src ??
                    servicePageImage(entry.kind === "services" ? entry.slug : "custom-software")
                  }
                  width={1024}
                  height={683}
                  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 400px"
                  alt={visual ? localize(visual.alt, locale) : ""}
                />
                <div className="inner-catalog-card-copy">
                  <p className="inner-eyebrow">{localize(entry.eyebrow, locale)}</p>
                  <Heading>{cleanInnerTitle(localize(entry.title, locale))}</Heading>
                  <p>{localize(entry.summary, locale)}</p>
                  {entry.conceptual && (
                    <span className="inner-disclosure">
                      {locale === "fa"
                        ? "مطالعهٔ مفهومی، نه پروژهٔ واقعی"
                        : "Concept scenario, not client work"}
                    </span>
                  )}
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </BrandText>
  );
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
  if (kind === "blog")
    return <BlogIndex locale={locale} entries={entries} query={blogQuery ?? {}} />;
  const fa = locale === "fa";
  const copy = kindCopy[kind];
  const services = kind === "services";
  const examples = serviceExampleEntries(projects.map(({ entry }) => entry));
  const Arrow = fa ? ArrowUpLeft : ArrowUpRight;
  return (
    <BrandText>
      <div className={`rycode-inner inner-hub inner-hub-${kind}`} dir={fa ? "rtl" : "ltr"}>
        <InnerHero
          locale={locale}
          eyebrow={localize(copy.eyebrow, locale)}
          title={localize(copy.title, locale)}
          lead={localize(copy.lead, locale)}
          layout={services ? "split" : "center"}
          {...(services ? { image: "/images/services/business-site.png" } : {})}
        >
          {services ? (
            <>
              <InnerLink locale={locale} href="/start-project">
                {fa ? "یک پروژهٔ تازه دارم" : "I have a new project"}
              </InnerLink>
              <InnerLink locale={locale} href="/technical-review" secondary>
                {fa ? "پروژه‌ام نیاز به بررسی دارد" : "My project needs a review"}
              </InnerLink>
              <InnerLink locale={locale} href="/seo-audit" secondary>
                {fa ? "می‌خواهم سایتم بهتر دیده شود" : "I want my site to get found"}
              </InnerLink>
            </>
          ) : (
            <InnerLink locale={locale} href="/services" secondary>
              {fa ? "خدمات مرتبط را ببین" : "Explore our services"}
            </InnerLink>
          )}
        </InnerHero>
        <section id={services ? "services" : undefined} className="inner-directory inner-container">
          {services ? (
            <>
              <nav
                className="inner-directory-nav"
                aria-label={fa ? "بخش‌های خدمات" : "Service sections"}
              >
                {[
                  ...serviceFamilies.map((family) => ({
                    id: family.id,
                    title: family.title[locale],
                    available: entries.some(({ entry }) =>
                      (family.slugs as readonly string[]).includes(entry.slug),
                    ),
                  })),
                  {
                    id: "solutions",
                    title: fa ? "سیستم‌های قابل ساخت" : "Systems we build",
                    available: solutions.length > 0,
                  },
                  {
                    id: "industries",
                    title: fa ? "برای کسب‌وکار شما" : "For your business",
                    available: industries.length > 0,
                  },
                ]
                  .filter((item) => item.available)
                  .map((item) => (
                    <a key={item.id} href={`#${item.id}`}>
                      {item.title}
                    </a>
                  ))}
              </nav>
              {serviceFamilies.map((family) => {
                const familyEntries = family.slugs.flatMap((slug) => {
                  const found = entries.find(({ entry }) => entry.slug === slug);
                  return found ? [found] : [];
                });
                if (!familyEntries.length) return null;
                const associated = projects.filter(({ entry }) =>
                  family.slugs.some((slug) =>
                    examples[slug]?.some((example) => example.slug === entry.slug),
                  ),
                );
                return (
                  <section
                    className="services-family-block"
                    id={family.id}
                    key={family.id}
                    aria-labelledby={`family-${family.id}-title`}
                  >
                    <div className="inner-family-layout">
                      <div className="inner-family-copy">
                        <p className="inner-eyebrow">{family.tagline[locale]}</p>
                        <h2 id={`family-${family.id}-title`}>{family.title[locale]}</h2>
                        <p>{family.description[locale]}</p>
                        <p className="inner-family-scope">{family.scope[locale]}</p>
                      </div>
                      <div>
                        <Image
                          className="inner-family-image"
                          src={servicePageImage(familyEntries[0]!.entry.slug)}
                          alt=""
                          width={1024}
                          height={576}
                          sizes="(max-width: 767px) 100vw, 600px"
                        />
                        <div className="inner-service-links">
                          {familyEntries.map(({ entry }) => (
                            <Link
                              href={localizedHref(locale, catalogPath("services", entry.slug))}
                              key={entry.slug}
                            >
                              <div>
                                <h3>{cleanInnerTitle(localize(entry.title, locale))}</h3>
                                <p>{localize(entry.summary, locale)}</p>
                              </div>
                              <Arrow size={20} aria-hidden />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                    {associated.length > 0 && (
                      <div className="inner-family-examples">
                        <h3>
                          {fa ? "این خدمت در یک سناریوی مفهومی" : "This service in a concept study"}
                        </h3>
                        <PublicContentCards locale={locale} entries={associated} layout="related" />
                      </div>
                    )}
                  </section>
                );
              })}
              {entries.some(
                ({ entry }) =>
                  !serviceFamilies.some((family) =>
                    (family.slugs as readonly string[]).includes(entry.slug),
                  ),
              ) && (
                <section className="services-family-block">
                  <h2>{fa ? "خدمات دیگر" : "More services"}</h2>
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
            <PublicContentCards
              locale={locale}
              entries={entries}
              layout={kind === "projects" ? "work" : "grid"}
            />
          )}
        </section>
        {services && (
          <ServiceContext locale={locale} solutions={solutions} industries={industries} />
        )}
        <InnerEndnote locale={locale} />
      </div>
    </BrandText>
  );
}
