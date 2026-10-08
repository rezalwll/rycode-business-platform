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
      <p className="rounded-2xl border border-[#0b5262]/12 bg-white/75 px-6 py-12 text-muted-foreground shadow-[0_12px_40px_rgba(31,92,105,0.06)]">
        {locale === "fa" ? "محتوایی برای نمایش وجود ندارد." : "No content is available yet."}
      </p>
    );
  }
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {entries.map(({ entry }, index) => (
        <Link
          key={`${entry.kind}/${entry.slug}`}
          href={localizedHref(locale, `/${entry.kind}/${entry.slug}`)}
          className="group relative overflow-hidden rounded-2xl border border-[#0b5262]/12 bg-white/75 p-3 shadow-[0_10px_32px_rgba(31,92,105,0.06)] backdrop-blur-sm transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-[#20bfb2]/45 hover:shadow-[0_20px_50px_rgba(31,92,105,0.12)] sm:p-4"
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
            <div className="absolute inset-0 bg-gradient-to-t from-[#00364a]/95 via-[#00364a]/15 to-transparent" />
            <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-5">
              <span className="meta-label text-white/75">
                {String(index + 1).padStart(2, "0")} / {localize(entry.eyebrow, locale)}
              </span>
              <span className="grid size-10 place-items-center rounded-full border border-white/25 bg-[#00364a]/35 text-white backdrop-blur-sm transition-colors group-hover:border-[#5fe1d5] group-hover:bg-[#5fe1d5] group-hover:text-[#00364a]">
                <Arrow className="size-4" aria-hidden />
              </span>
            </div>
          </div>
          <div className="p-4 sm:p-5">
            <h2 className="display-3 text-[#073b4c]">{localize(entry.title, locale)}</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
              {localize(entry.summary, locale)}
            </p>
            {entry.conceptual && (
              <span className="mt-5 inline-flex rounded-full border border-[#20bfb2]/35 bg-[#5fe1d5]/10 px-3 py-1 text-xs font-semibold text-[#0b766e]">
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
            <span className="meta-label block text-[#5fe1d5]">
              {String(entries.length).padStart(2, "0")} / {kind.toUpperCase()}
            </span>
            <Link
              className="mt-4 inline-flex font-semibold text-white/80 transition-colors hover:text-[#5fe1d5]"
              href={localizedHref(locale, "/search")}
            >
              {locale === "fa" ? "جست‌وجوی سایت" : "Search the site"}
            </Link>
          </>
        }
      />
      <section className="relative overflow-hidden bg-[#f7fbfa] py-14 sm:py-20">
        <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_15%_15%,rgba(32,191,178,0.11),transparent_28%),radial-gradient(circle_at_85%_70%,rgba(99,146,255,0.08),transparent_30%)]" />
        <Container>
          <div className="relative">
            <PublicContentCards locale={locale} entries={entries} />
          </div>
        </Container>
      </section>
      <FinalBand locale={locale} />
    </>
  );
}
