import { ArrowUpLeft, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/site/primitives";
import {
  getCatalogEntries,
  kindCopy,
  localize,
  type CatalogEntry,
  type CatalogKind,
} from "@/content/catalog";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import { ActionLink, FinalBand, JsonLd, localizedHref, PageHero } from "./shared";

const contentTones = [
  {
    card: "border-sky-500/20 bg-gradient-to-bl from-sky-500/8 via-surface to-surface hover:border-sky-500/45",
    rail: "border-s-sky-500/70",
    label: "text-sky-600 dark:text-sky-300",
  },
  {
    card: "border-emerald-500/20 bg-gradient-to-bl from-emerald-500/8 via-surface to-surface hover:border-emerald-500/45",
    rail: "border-s-emerald-500/70",
    label: "text-emerald-600 dark:text-emerald-300",
  },
  {
    card: "border-violet-500/20 bg-gradient-to-bl from-violet-500/8 via-surface to-surface hover:border-violet-500/45",
    rail: "border-s-violet-500/70",
    label: "text-violet-600 dark:text-violet-300",
  },
  {
    card: "border-rose-500/20 bg-gradient-to-bl from-rose-500/8 via-surface to-surface hover:border-rose-500/45",
    rail: "border-s-rose-500/70",
    label: "text-rose-600 dark:text-rose-300",
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
    fa: { item: "راهکار", back: "همه راهکارها" },
    en: { item: "Solution", back: "All solutions" },
  },
  problems: {
    fa: { item: "مسئله", back: "همه مسائل" },
    en: { item: "Problem", back: "All problems" },
  },
  industries: {
    fa: { item: "صنعت", back: "همه صنایع" },
    en: { item: "Industry", back: "All industries" },
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
  const cardImages = [
    "/images/rycode-product-system.png",
    "/images/rycode-hero-structure.png",
    "/images/rycode-connected-world.png",
    "/images/rycode-project-rescue.png",
  ];

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
            <span className="mt-3 block">
              {locale === "fa"
                ? "از چیزی که لازم دارید شروع کنید؛ اسم فنی‌اش مهم نیست."
                : "This collection is organised around problems and outcomes."}
            </span>
          </>
        }
      />
      <section className="bg-background py-12 sm:py-18">
        <Container>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {entries.map((entry, index) => (
              <Link
                key={entry.slug}
                href={localizedHref(locale, `/${kind}/${entry.slug}`)}
                className={cn(
                  "group relative overflow-hidden rounded-xl border bg-surface p-3 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:shadow-xl",
                  contentTone(index).card,
                )}
              >
                <div className="relative aspect-[16/9] overflow-hidden rounded-[1rem] bg-ink">
                  <Image
                    src={cardImages[index % cardImages.length]!}
                    alt=""
                    fill
                    className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                  <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-4">
                    <span className="meta-label text-white/70">
                      {String(index + 1).padStart(2, "0")} / {labels[kind][locale].item}
                    </span>
                    <span className="grid size-9 place-items-center rounded-full border border-white/25 bg-ink/30 text-white backdrop-blur-sm transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-brand-foreground">
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
                      {locale === "fa" ? "یک نمونه فرضی" : "Concept study"}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
      <FinalBand locale={locale} />
    </>
  );
}

export function CatalogDetail({ locale, entry }: { locale: Locale; entry: CatalogEntry }) {
  const kindLabel = labels[entry.kind][locale];
  const absolutePath = localizedHref(locale, `/${entry.kind}/${entry.slug}`);

  return (
    <>
      <JsonLd
        value={{
          "@context": "https://schema.org",
          "@type": entry.kind === "blog" ? "Article" : "WebPage",
          name: localize(entry.title, locale),
          description: localize(entry.summary, locale),
          inLanguage: locale === "fa" ? "fa-IR" : "en",
          url: absolutePath,
          ...(entry.kind === "blog" ? { author: { "@type": "Organization", name: "RYCODE" } } : {}),
        }}
      />
      <PageHero
        locale={locale}
        eyebrow={localize(entry.eyebrow, locale)}
        title={localize(entry.title, locale)}
        lead={localize(entry.summary, locale)}
        aside={
          <>
            {entry.conceptual && (
              <strong className="mb-4 block text-brand">
                {locale === "fa"
                  ? "این صفحه یک مثال فرضی است، نه پروژه واقعی."
                  : "This is a concept scenario."}
              </strong>
            )}
            {locale === "fa"
              ? "بعد از اینکه وضعیت فعلی را دیدیم، درباره زمان و مسیر اجرا دقیق‌تر حرف می‌زنیم."
              : "Scope and timing are determined after reviewing the current state."}
          </>
        }
      />
      <section className="bg-background py-12 sm:py-18">
        <Container>
          <Link
            href={localizedHref(locale, `/${entry.kind}`)}
            className="brand-underline inline-flex text-sm font-bold"
          >
            {kindLabel.back}
          </Link>
          <div className="mt-12 grid gap-4">
            {entry.sections.map((section, index) => (
              <section
                key={`${entry.slug}-${index}`}
                className={cn(
                  "grid gap-8 rounded-xl border border-s-[3px] bg-surface p-6 sm:p-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:p-10",
                  contentTone(index).rail,
                )}
              >
                <div className={cn("meta-label", contentTone(index).label)}>
                  {String(index + 1).padStart(2, "0")} / {kindLabel.item}
                </div>
                <div className="max-w-3xl">
                  <h2 className="display-3">{localize(section.title, locale)}</h2>
                  {section.body && (
                    <p className="mt-6 text-base leading-8 text-muted-foreground sm:text-lg sm:leading-9">
                      {localize(section.body, locale)}
                    </p>
                  )}
                  {section.items && (
                    <ol className="mt-8 grid gap-0 border-t border-hairline">
                      {section.items.map((item, itemIndex) => (
                        <li
                          key={localize(item, locale)}
                          className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-hairline py-5 text-base"
                        >
                          <span className="meta-label text-brand">
                            {String(itemIndex + 1).padStart(2, "0")}
                          </span>
                          <span>{localize(item, locale)}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </section>
            ))}
          </div>
          <div className="mt-14 flex flex-wrap gap-3">
            <ActionLink locale={locale} href="/start-project">
              {locale === "fa" ? "گفت‌وگو درباره این مسیر" : "Discuss this path"}
            </ActionLink>
            <ActionLink locale={locale} href={`/${entry.kind}`} secondary>
              {kindLabel.back}
            </ActionLink>
          </div>
        </Container>
      </section>
      <FinalBand locale={locale} />
    </>
  );
}
