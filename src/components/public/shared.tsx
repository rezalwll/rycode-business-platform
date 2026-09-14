import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { Container, Eyebrow } from "@/components/site/primitives";
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
    <section className="relative overflow-hidden border-b border-border bg-surface text-foreground dark:border-white/10 dark:bg-ink dark:text-ink-foreground">
      <Image
        src="/images/rycode-connected-world.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center opacity-10 dark:opacity-25"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-l from-background/45 via-background/85 to-background dark:from-ink/45 dark:via-ink/85 dark:to-ink" />
      <div className="absolute -top-28 right-[8%] size-72 rounded-full bg-sky-400/15 blur-3xl dark:bg-sky-400/10" />
      <div className="absolute -bottom-32 left-[28%] size-80 rounded-full bg-violet-400/12 blur-3xl dark:bg-violet-400/8" />
      <Container className="relative py-10 sm:py-12 lg:py-14">
        <div className="grid gap-7 lg:grid-cols-[1.35fr_0.65fr] lg:items-center lg:gap-10">
          <div className="reveal">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="display-1 mt-5 max-w-3xl text-foreground dark:text-white">{title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground dark:text-white/65 sm:text-lg">
              {lead}
            </p>
          </div>
          <div className="relative overflow-hidden rounded-xl border border-border bg-background/70 p-2 shadow-lg backdrop-blur-sm dark:border-white/15 dark:bg-white/[0.06]">
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
              <Image
                src="/images/rycode-product-system.png"
                alt="نمایی انتزاعی از سیستم‌های دیجیتال و داده‌های متصل"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
              <div className="absolute inset-x-4 bottom-4">
                <span className="meta-label text-brand">RYCODE / FIELD NOTE</span>
                <p className="mt-2 text-sm leading-6 text-white/80">
                  {locale === "fa"
                    ? "اول ببینیم واقعاً چه چیزی لازم دارید."
                    : "Start with the real problem."}
                </p>
              </div>
            </div>
            <div className="mt-2 rounded-lg border border-border bg-surface p-3 text-xs leading-6 text-muted-foreground dark:border-white/10 dark:bg-ink/60 dark:text-white/60">
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
          ? "group inline-flex min-h-10 items-center gap-2.5 rounded-[5px] border border-foreground/25 px-5 text-sm font-bold transition-colors hover:border-foreground hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          : "group inline-flex min-h-10 items-center gap-2.5 rounded-[5px] bg-brand px-5 text-sm font-bold text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      }
    >
      {children}
      <Icon className="size-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
    </Link>
  );
}

export function FinalBand({ locale }: { locale: Locale }) {
  return (
    <section className="relative overflow-hidden bg-surface-2 py-14 text-foreground dark:bg-ink dark:text-ink-foreground sm:py-20">
      <Image
        src="/images/rycode-connected-world.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-10 dark:opacity-20"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-l from-background/35 via-background/85 to-background dark:from-ink/35 dark:via-ink/85 dark:to-ink" />
      <div className="absolute -top-28 left-[18%] size-64 rounded-full bg-cyan-400/12 blur-3xl dark:bg-cyan-400/8" />
      <Container className="relative">
        <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="meta-label text-brand">RYCODE / START</p>
            <h2 className="display-2 mt-4 max-w-3xl">
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
              className="inline-flex min-h-10 items-center rounded-[5px] border border-foreground/25 px-5 text-sm font-bold text-foreground transition-colors hover:border-foreground dark:border-white/25 dark:text-white dark:hover:border-white"
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
