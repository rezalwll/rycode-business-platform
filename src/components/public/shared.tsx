import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

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
}: {
  locale: Locale;
  eyebrow: string;
  title: string;
  lead: string;
  aside?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-[#00364a] text-white">
      <Image
        src="/images/rycode-connected-world.png"
        alt=""
        fill
        sizes="100vw"
        className="-z-30 object-cover object-center opacity-30 mix-blend-screen"
        aria-hidden
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(110deg,rgba(0,30,42,0.98)_4%,rgba(0,54,74,0.9)_54%,rgba(0,49,67,0.55)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_20%,rgba(95,225,213,0.18),transparent_24%),radial-gradient(circle_at_12%_85%,rgba(99,146,255,0.16),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08] [background-image:radial-gradient(rgba(255,255,255,0.8)_0.7px,transparent_0.7px)] [background-size:34px_34px]" />
      <Container className="relative py-16 sm:py-20 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.18fr_0.82fr] lg:items-center lg:gap-16">
          <div className="reveal max-w-3xl">
            <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.16em] text-[#5fe1d5] uppercase">
              <span className="inline-block h-px w-8 bg-[#5fe1d5]" />
              {eyebrow}
            </p>
            <h1 className="mt-6 text-[clamp(2rem,4.4vw,4.5rem)] font-light leading-[1.2] tracking-[-0.035em] text-white">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/68 sm:text-lg sm:leading-9">
              {lead}
            </p>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.07] p-2 shadow-[0_30px_90px_rgba(0,18,26,0.4)] backdrop-blur-md">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
              <Image
                src="/images/rycode-product-system.png"
                alt="نمایی انتزاعی از سیستم‌های دیجیتال و داده‌های متصل"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover opacity-90 saturate-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#002936]/95 via-[#00364a]/10 to-transparent" />
              <div className="absolute inset-x-4 bottom-4">
                <span className="meta-label text-[#5fe1d5]">RYCODE / FIELD NOTE</span>
                <p className="mt-2 text-sm leading-6 text-white/82">
                  {locale === "fa"
                    ? "اول ببینیم واقعاً چه چیزی لازم دارید."
                    : "Start with the real problem."}
                </p>
              </div>
            </div>
            <div className="mt-2 rounded-xl border border-white/10 bg-black/10 p-4 text-xs leading-6 text-white/60">
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
          ? "group inline-flex min-h-11 items-center gap-2.5 rounded-full border border-[#0b6470]/25 bg-white/50 px-6 text-sm font-bold text-[#075264] transition-[background-color,border-color,transform] hover:-translate-y-0.5 hover:border-[#20bfb2]/60 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#20bfb2] dark:border-white/20 dark:bg-white/[0.06] dark:text-white"
          : "group inline-flex min-h-11 items-center gap-2.5 rounded-full border border-[#5fe1d5]/60 bg-[#5fe1d5] px-6 text-sm font-bold text-[#00364a] shadow-[0_10px_30px_rgba(95,225,213,0.16)] transition-[background-color,border-color,transform] hover:-translate-y-0.5 hover:bg-[#74eadf] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#20bfb2]"
      }
    >
      {children}
      <Icon className="size-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
    </Link>
  );
}

export function FinalBand({ locale }: { locale: Locale }) {
  return (
    <section className="relative isolate overflow-hidden bg-[#00364a] py-16 text-white sm:py-24">
      <Image
        src="/images/rycode-connected-world.png"
        alt=""
        fill
        sizes="100vw"
        className="-z-30 object-cover opacity-25 mix-blend-screen"
        aria-hidden
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(105deg,rgba(0,33,46,0.98),rgba(0,54,74,0.82),rgba(0,42,58,0.96))]" />
      <div className="absolute -top-28 left-[18%] -z-10 size-72 rounded-full bg-[#5fe1d5]/15 blur-3xl" />
      <Container className="relative">
        <div className="grid gap-8 rounded-2xl border border-white/12 bg-white/[0.055] p-7 shadow-[0_24px_80px_rgba(0,22,30,0.24)] backdrop-blur-md sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="meta-label text-[#5fe1d5]">RYCODE / START</p>
            <h2 className="mt-4 max-w-3xl text-[clamp(1.65rem,3vw,3rem)] font-light leading-[1.3] tracking-[-0.025em] text-white">
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
              className="inline-flex min-h-11 items-center rounded-full border border-white/25 bg-white/[0.04] px-6 text-sm font-bold text-white/85 transition-colors hover:border-white/55 hover:bg-white/[0.09] hover:text-white"
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
