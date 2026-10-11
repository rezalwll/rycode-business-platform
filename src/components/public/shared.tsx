import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { ContextVisual, type ContextVisualVariant } from "@/components/site/context-visual";
import { Container } from "@/components/site/primitives";
import type { Locale } from "@/i18n/routing";

export function localizedHref(locale: Locale, path: string): string {
  const normalized = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return locale === "en" ? `/en${normalized}` || "/en" : normalized || "/";
}

export function PageHero({
  locale,
  eyebrow,
  title,
  lead,
  aside,
  imageSrc,
  imageAlt = "",
  visualVariant = "software",
  visualItems = [],
}: {
  locale: Locale;
  eyebrow: string;
  title: string;
  lead: string;
  aside?: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  visualVariant?: ContextVisualVariant;
  visualItems?: readonly string[];
}) {
  return (
    <section className="relative isolate overflow-hidden bg-[#f7fcfb] text-[#073b4c] dark:bg-[#0f2027] dark:text-white">
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(120deg,rgba(239,252,249,0.98)_4%,rgba(247,252,255,0.92)_54%,rgba(255,250,235,0.84)_100%)] dark:bg-[linear-gradient(120deg,rgba(15,32,39,0.98)_4%,rgba(17,42,53,0.94)_54%,rgba(36,35,31,0.9)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_20%,rgba(95,225,213,0.24),transparent_24%),radial-gradient(circle_at_12%_85%,rgba(99,146,255,0.16),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.18] [background-image:radial-gradient(rgba(7,59,76,0.5)_0.7px,transparent_0.7px)] [background-size:34px_34px]" />
      <Container className="relative py-16 sm:py-20 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.18fr_0.82fr] lg:items-center lg:gap-16">
          <div className="reveal max-w-3xl">
            <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.16em] text-[#087b83] uppercase">
              <span className="inline-block h-px w-8 bg-[#20bfb2]" />
              {eyebrow}
            </p>
            <h1 className="mt-6 text-[clamp(2rem,4.4vw,4.5rem)] font-light leading-[1.2] tracking-[-0.035em] text-[#073b4c] dark:text-white">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#315d68]/78 dark:text-white/70 sm:text-lg sm:leading-9">
              {lead}
            </p>
          </div>
          <div className="relative overflow-hidden rounded-2xl">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <ContextVisual
                  variant={visualVariant}
                  title={title}
                  items={visualItems}
                  className="absolute inset-0 min-h-0"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#073b4c]/78 via-[#073b4c]/5 to-transparent" />
              <div className="absolute inset-x-4 bottom-4">
                <span className="meta-label text-[#a5fff1]">RYCODE / FIELD NOTE</span>
                <p className="mt-2 text-sm leading-6 text-white/90">
                  {locale === "fa"
                    ? "اول ببینیم واقعاً چه چیزی لازم دارید."
                    : "Start with the real problem."}
                </p>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-[#073b4c]/10 bg-[#e8f9f6] p-4 text-xs leading-6 text-[#315d68]/80 dark:border-white/10 dark:bg-white/[0.06] dark:text-white/65">
              {aside ??
                (locale === "fa"
                  ? "اول حرف‌هایتان را می‌شنویم؛ پیشنهاد فنی بعد از آن شکل می‌گیرد."
                  : "Every recommendation follows an understanding of the problem, constraints and success criteria.")}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function ActionLink({
  locale,
  href,
  children,
  secondary = false,
}: {
  locale: Locale;
  href: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  const Icon = locale === "fa" ? ArrowLeft : ArrowRight;
  return (
    <Link
      href={localizedHref(locale, href)}
      className={
        secondary
          ? "group inline-flex min-h-11 items-center gap-2.5 rounded-full border border-[#0b6470]/25 bg-white/50 px-6 text-sm font-bold text-[#075264] transition-colors hover:border-[#20bfb2]/60 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#20bfb2] dark:border-white/20 dark:bg-white/[0.06] dark:text-white"
          : "group inline-flex min-h-11 items-center gap-2.5 rounded-full border border-[#5fe1d5]/60 bg-[#5fe1d5] px-6 text-sm font-bold text-[#00364a] shadow-[0_10px_30px_rgba(95,225,213,0.16)] transition-colors hover:bg-[#74eadf] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#20bfb2]"
      }
    >
      {children}
      <Icon className="size-4" />
    </Link>
  );
}

export function FinalBand({ locale }: { locale: Locale }) {
  return (
    <section className="relative isolate overflow-hidden bg-[#effbf8] py-16 text-[#073b4c] dark:bg-[#0f2027] dark:text-white sm:py-24">
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(105deg,#e9faf6,#f7fcff_55%,#fff7dc)] dark:bg-[linear-gradient(105deg,#102d35,#14283d_55%,#302d22)]" />
      <div className="absolute -top-28 left-[18%] -z-10 size-72 rounded-full bg-[#5fe1d5]/25 blur-3xl" />
      <div className="absolute -bottom-32 right-[8%] -z-10 size-80 rounded-full bg-[#dbe7ff]/55 blur-3xl" />
      <Container className="relative">
        <div className="grid gap-8 rounded-2xl border border-white/90 bg-white/72 p-7 shadow-[0_24px_80px_rgba(7,59,76,0.12)] backdrop-blur-md dark:border-white/12 dark:bg-white/[0.06] dark:shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="meta-label text-[#087b83]">RYCODE / START</p>
            <h2 className="mt-4 max-w-3xl text-[clamp(1.65rem,3vw,3rem)] font-light leading-[1.3] tracking-[-0.025em] text-[#073b4c] dark:text-white">
              {locale === "fa"
                ? "از اصل مسئله شروع کنیم؛ راهش را با هم پیدا می‌کنیم."
                : "Clarify the problem first; the engineering path follows."}
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <ActionLink locale={locale} href="/start-project">
              {locale === "fa" ? "شروع پروژه" : "Start a project"}
            </ActionLink>
            <Link
              href={localizedHref(locale, "/contact")}
              className="inline-flex min-h-11 items-center rounded-full border border-[#073b4c]/15 bg-white/75 px-6 text-sm font-bold text-[#174a58] transition-colors hover:border-[#20bfb2]/55 hover:bg-white hover:text-[#073b4c]"
            >
              {locale === "fa" ? "تماس با ما" : "Contact us"}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function JsonLd({ value }: { value: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(value).replaceAll("<", "\\u003c") }}
    />
  );
}
