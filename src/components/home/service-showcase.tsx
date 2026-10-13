import Link from "next/link";
import { BrandText } from "@/components/site/brand-text";
import { ArrowUpLeft, ArrowUpRight } from "lucide-react";
import { ProductScene, serviceSceneKind } from "@/components/site/product-scene";
import { localizedHref } from "@/components/public/shared";
import { catalogPath, getCatalogVisual, localize, type CatalogEntry } from "@/content/catalog";
import type { Locale } from "@/i18n/routing";
import { ServiceExamples, type ServiceExample } from "./service-examples";

export function ServiceShowcase({
  entries,
  locale,
  examples = {},
  layout = "bento",
}: {
  entries: CatalogEntry[];
  locale: Locale;
  examples?: Partial<Record<string, CatalogEntry[]>>;
  layout?: "bento" | "compact";
}) {
  const Arrow = locale === "fa" ? ArrowUpLeft : ArrowUpRight;
  return (
    <BrandText><div className={`service-bento ${layout === "compact" ? "service-bento-compact" : ""}`}>
      {entries.map((entry, index) => {
        const related: ServiceExample[] = (examples[entry.slug] ?? []).flatMap((project) => {
          const visual = getCatalogVisual(project);
          return visual
            ? [
                {
                  href: localizedHref(locale, catalogPath("projects", project.slug)),
                  title: localize(project.title, locale),
                  src: visual.src,
                  alt: localize(visual.alt, locale),
                  conceptual: Boolean(project.conceptual),
                },
              ]
            : [];
        });
        return (
          <article
            key={entry.slug}
            className={`service-bento-card service-bento-${index === entries.length - 1 ? 5 : index === 5 ? 6 : index}`}
          >
            <div className="service-bento-heading">
              <h3>
                <Link href={localizedHref(locale, catalogPath("services", entry.slug))}>
                  {localize(entry.title, locale)}
                </Link>
              </h3>
              <Link
                href={localizedHref(locale, catalogPath("services", entry.slug))}
                aria-label={
                  locale === "fa" ? `جزئیات ${entry.title.fa}` : `Explore ${entry.title.en}`
                }
                className="service-bento-arrow"
              >
                <Arrow className="size-4" aria-hidden />
              </Link>
            </div>
            {layout === "compact" && (
              <p className="service-bento-pitch">{localize(entry.summary, locale)}</p>
            )}
            {related.length > 0 ? (
              <ServiceExamples
                examples={related}
                locale={locale}
                serviceTitle={localize(entry.title, locale)}
              />
            ) : (
              <div className="service-bento-scene">
                <ProductScene kind={serviceSceneKind(entry.slug)} locale={locale} />
              </div>
            )}
            <details className="service-bento-details">
              <summary>
                {locale === "fa" ? "این خدمت به چه دردی می‌خورد؟" : "How can this help?"}
                <span aria-hidden>+</span>
              </summary>
              <p className="studio-body">
                {localize(
                  layout === "compact" ? (entry.sections[0]?.body ?? entry.summary) : entry.summary,
                  locale,
                )}
              </p>
              <Link
                href={localizedHref(locale, catalogPath("services", entry.slug))}
                className="studio-link"
              >
                {locale === "fa" ? "بیشتر دربارهٔ این خدمت" : "Explore this service"}
                <Arrow className="size-4" aria-hidden />
              </Link>
            </details>
          </article>
        );
      })}
    </div></BrandText>
  );
}
