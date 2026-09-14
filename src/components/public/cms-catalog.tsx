import { ArrowUpLeft, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/site/primitives";
import { kindCopy, localize, type CatalogKind } from "@/content/catalog";
import type { Locale } from "@/i18n/routing";
import type { PublicCatalogEntry } from "@/server/queries/public-content";

import { FinalBand, localizedHref, PageHero } from "./shared";

export function PublicContentCards({
  locale,
  entries,
}: {
  locale: Locale;
  entries: PublicCatalogEntry[];
}) {
  const Arrow = locale === "fa" ? ArrowUpLeft : ArrowUpRight;
  const cardImages = [
    "/images/rycode-product-system.png",
    "/images/rycode-hero-structure.png",
    "/images/rycode-connected-world.png",
    "/images/rycode-project-rescue.png",
  ];
  if (!entries.length) {
    return (
      <p className="border-y border-hairline py-12 text-muted-foreground">
        {locale === "fa" ? "محتوایی برای نمایش وجود ندارد." : "No content is available yet."}
      </p>
    );
  }
  return (
    <div className="grid border-t border-s border-hairline md:grid-cols-2 xl:grid-cols-3">
      {entries.map(({ entry }, index) => (
        <Link
          key={`${entry.kind}/${entry.slug}`}
          href={localizedHref(locale, `/${entry.kind}/${entry.slug}`)}
          className="group relative overflow-hidden border-e border-b border-hairline bg-background p-3 transition-[background-color,transform] duration-300 hover:-translate-y-1 hover:bg-surface sm:p-4"
        >
          <div className="relative aspect-[16/9] overflow-hidden rounded-[0.9rem] bg-ink">
            <Image
              src={cardImages[index % cardImages.length]!}
              alt=""
              fill
              sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
              aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-transparent" />
            <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-5">
              <span className="meta-label text-white/75">
                {String(index + 1).padStart(2, "0")} / {localize(entry.eyebrow, locale)}
              </span>
              <span className="grid size-10 place-items-center rounded-full border border-white/25 bg-ink/30 text-white backdrop-blur-sm transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-brand-foreground">
                <Arrow className="size-4" aria-hidden />
              </span>
            </div>
          </div>
          <div className="p-4 sm:p-5">
            <h2 className="display-3">{localize(entry.title, locale)}</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
              {localize(entry.summary, locale)}
            </p>
            {entry.conceptual && (
              <span className="mt-5 inline-flex rounded-full border border-brand/35 bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
                {locale === "fa" ? "مطالعه مفهومی" : "Concept study"}
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

export function PublicCatalogHub({
  locale,
  kind,
  entries,
}: {
  locale: Locale;
  kind: CatalogKind;
  entries: PublicCatalogEntry[];
}) {
  const copy = kindCopy[kind];
  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={localize(copy.eyebrow, locale)}
        title={localize(copy.title, locale)}
        lead={localize(copy.lead, locale)}
        aside={
          <>
            <span className="meta-label block text-foreground">
              {String(entries.length).padStart(2, "0")} / {kind.toUpperCase()}
            </span>
            <Link
              className="brand-underline mt-4 inline-flex font-semibold"
              href={localizedHref(locale, "/search")}
            >
              {locale === "fa" ? "جست‌وجوی سایت" : "Search the site"}
            </Link>
          </>
        }
      />
      <section className="py-12 sm:py-18">
        <Container>
          <PublicContentCards locale={locale} entries={entries} />
        </Container>
      </section>
      <FinalBand locale={locale} />
    </>
  );
}
