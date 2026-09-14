"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowUpLeft,
  Blocks,
  Database,
  Headphones,
  Search,
  ShoppingBag,
  Waypoints,
  Webhook,
  Wrench,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  ArrowSquare,
  Container,
  CtaLink,
  Eyebrow,
  Lead,
  MetaLabel,
  Section,
  SectionTitle,
  TextLink,
} from "@/components/site/primitives";
import { industries } from "@/lib/nav-content";
import { cn } from "@/lib/utils";

/* 2. CAPABILITY RAIL ---------------------------------------------------- */

export function CapabilityStrip() {
  const items = [
    {
      fa: "طراحی وب",
      en: "WEB",
      description: "سریع، روشن و آماده رشد",
      href: "/services/web-development" as const,
      icon: Waypoints,
      tone: "text-sky-600 border-sky-500/25 bg-sky-500/10 dark:text-sky-300",
      rail: "bg-sky-500",
    },
    {
      fa: "فروشگاه اینترنتی",
      en: "ECOMMERCE",
      description: "فروش و عملیات یکپارچه",
      href: "/services/ecommerce" as const,
      icon: ShoppingBag,
      tone: "text-emerald-600 border-emerald-500/25 bg-emerald-500/10 dark:text-emerald-300",
      rail: "bg-emerald-500",
    },
    {
      fa: "نرم‌افزار اختصاصی",
      en: "SOFTWARE",
      description: "متناسب با فرآیند واقعی شما",
      href: "/services/custom-software" as const,
      icon: Blocks,
      tone: "text-violet-600 border-violet-500/25 bg-violet-500/10 dark:text-violet-300",
      rail: "bg-violet-500",
    },
    {
      fa: "یکپارچه‌سازی",
      en: "INTEGRATION",
      description: "اتصال سیستم‌ها و داده‌ها",
      href: "/services/api-integration" as const,
      icon: Webhook,
      tone: "text-cyan-600 border-cyan-500/25 bg-cyan-500/10 dark:text-cyan-300",
      rail: "bg-cyan-500",
    },
    {
      fa: "سئو و رشد",
      en: "SEO",
      description: "دیده‌شدن با پایه فنی درست",
      href: "/services/seo-growth" as const,
      icon: Search,
      tone: "text-lime-700 border-lime-500/30 bg-lime-500/10 dark:text-lime-300",
      rail: "bg-lime-500",
    },
    {
      fa: "پشتیبانی",
      en: "SUPPORT",
      description: "نگهداری و توسعه مستمر",
      href: "/services/ongoing-support" as const,
      icon: Headphones,
      tone: "text-rose-600 border-rose-500/25 bg-rose-500/10 dark:text-rose-300",
      rail: "bg-rose-500",
    },
  ];

  return (
    <section className="border-y border-border bg-surface">
      <Container className="py-10 sm:py-12">
        <div>
          <div className="max-w-xl">
            <MetaLabel className="text-brand">WHAT WE SHIP / 06</MetaLabel>
            <h2 className="mt-3 text-xl font-bold tracking-[-0.02em] sm:text-2xl">
              از یک صفحه‌ی دقیق تا یک سیستم کامل
            </h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              هر توانمندی مستقل است؛ ترکیب درستشان یک محصول قابل اتکا می‌سازد.
            </p>
          </div>
        </div>

        <div className="mt-7 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {items.map((item, i) => (
            <Link
              key={item.en}
              href={item.href}
              className="group relative flex min-h-40 flex-col justify-between bg-surface p-5 hover:z-10 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-brand"
            >
              <span
                className={cn(
                  "absolute inset-x-0 bottom-0 h-0.5 origin-right scale-x-0 transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100",
                  item.rail,
                )}
              />
              <span className="flex items-start justify-between gap-3">
                <span
                  className={cn(
                    "grid size-9 place-items-center rounded-lg border transition-transform duration-300 group-hover:-translate-y-0.5",
                    item.tone,
                  )}
                >
                  <item.icon className="size-4" aria-hidden />
                </span>
                <span className="font-latin text-[0.62rem] tracking-[0.16em] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </span>

              <span className="mt-8 block">
                <span className="flex items-center justify-between gap-3">
                  <strong className="text-sm font-bold">{item.fa}</strong>
                  <ArrowUpLeft className="size-3.5 text-muted-foreground transition-[color,transform] group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand" />
                </span>
                <span className="mt-2 block text-xs leading-6 text-muted-foreground">
                  {item.description}
                </span>
                <span className="mt-3 block font-latin text-[0.58rem] tracking-[0.14em] text-brand">
                  {item.en}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* 3. CUSTOMER PATH SELECTOR -------------------------------------------- */

const paths = [
  {
    key: "build",
    kicker: "ساخت از صفر",
    title: "یه پروژه تازه توی ذهنمونه",
    body: "ایده‌تان هرچقدر خام باشد، کمک می‌کنیم تبدیلش کنید به یک سایت، فروشگاه یا نرم‌افزار واقعی و قابل استفاده",
    cta: { label: "ایده‌ام را تعریف کنم", to: "/start-project" as const },
    accent: "text-sky-600 dark:text-sky-300",
    wash: "group-hover:bg-sky-500/[0.045] dark:group-hover:bg-sky-400/[0.035]",
  },
  {
    key: "fix",
    kicker: "نجات و ادامه",
    title: "پروژه‌مون یه جایی گیر کرده",
    body: "کند شده، خطا می‌دهد یا نیمه‌کاره مانده؟ اول می‌بینیم چه چیزی سالم است، بعد کوتاه‌ترین راه ادامه را پیدا می‌کنیم",
    cta: { label: "پروژه را بررسی کنیم", to: "/technical-review" as const },
    accent: "text-violet-600 dark:text-violet-300",
    wash: "group-hover:bg-violet-500/[0.045] dark:group-hover:bg-violet-400/[0.035]",
  },
  {
    key: "grow",
    kicker: "رشد و دیده‌شدن",
    title: "می‌خوایم مشتری‌های بیشتری پیدامون کنند",
    body: "محصول خوبی دارید اما کم دیده می‌شوید؟ سایت، محتوا و مسیر ورود مشتری را کنار هم بررسی می‌کنیم",
    cta: { label: "برای رشد از کجا شروع کنیم؟", to: "/services/seo-growth" as const },
    accent: "text-emerald-600 dark:text-emerald-300",
    wash: "group-hover:bg-emerald-500/[0.045] dark:group-hover:bg-emerald-400/[0.035]",
  },
];

export function PathSelector() {
  return (
    <Section className="grain overflow-hidden bg-surface-2/45">
      <Container>
        <div className="grid items-end gap-6 border-b border-border pb-7 lg:grid-cols-[1fr_auto]">
          <div className="max-w-2xl">
            <Eyebrow>انتخاب مسیر شروع</Eyebrow>
            <SectionTitle>الان کجای مسیر هستید؟</SectionTitle>
            <Lead>
              لازم نیست اسم فنی چیزی را بدانید؛ نزدیک‌ترین گزینه به وضعیت امروزتان را انتخاب کنید
            </Lead>
          </div>
          <div className="hidden items-baseline gap-2 pb-1 lg:flex" aria-hidden>
            <span className="font-latin text-4xl font-semibold tracking-[-0.08em]">03</span>
            <span className="text-xs font-bold text-muted-foreground">راه برای شروع</span>
          </div>
        </div>

        <div className="mt-5">
          {paths.map((path, index) => (
            <Link
              key={path.key}
              href={path.cta.to}
              className={cn(
                "group relative grid min-h-36 grid-cols-[4.5rem_minmax(0,1fr)_2.5rem] items-center gap-x-4 overflow-hidden border-b border-border px-2 py-6 transition-[background-color,transform,box-shadow,padding] duration-200 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:grid-cols-[6rem_minmax(0,1fr)_3rem] sm:px-4 lg:min-h-40 lg:grid-cols-[8.5rem_minmax(220px,0.8fr)_minmax(280px,1.2fr)_3.5rem] lg:gap-x-7 lg:px-6 lg:hover:z-10 lg:hover:scale-[1.008] lg:hover:px-8 lg:hover:shadow-[0_14px_36px_rgba(15,23,42,0.07)]",
                path.wash,
              )}
            >
              <span
                className={cn(
                  "font-latin text-[3.6rem] font-semibold leading-none tracking-[-0.09em] opacity-[0.08] transition-opacity duration-200 group-hover:opacity-20 sm:text-[4.8rem] lg:text-[6rem]",
                  path.accent,
                )}
                aria-hidden
              >
                0{index + 1}
              </span>

              <span>
                <span className={cn("text-[0.68rem] font-bold", path.accent)}>{path.kicker}</span>
                <h3 className="mt-2 max-w-md text-lg font-bold leading-8 tracking-[-0.02em] sm:text-xl">
                  {path.title}
                </h3>
              </span>

              <span className="col-span-2 col-start-2 mt-3 self-center lg:col-span-1 lg:col-start-auto lg:mt-0">
                <p className="max-w-xl text-sm leading-7 text-muted-foreground">{path.body}</p>
                <span className="mt-2 block text-xs font-bold text-foreground/75">
                  {path.cta.label}
                </span>
              </span>

              <ArrowUpLeft
                className={cn(
                  "size-5 justify-self-end transition-transform duration-200 group-hover:-translate-x-1.5 group-hover:-translate-y-1.5",
                  path.accent,
                )}
                aria-hidden
              />
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* 4. SERVICES INDEX ----------------------------------------------------- */

const pillars = [
  {
    title: "طراحی و توسعه وب",
    body: "سایت شرکتی، فروشگاه یا وب‌اپی که از روز اول درست، سریع و آماده رشد ساخته شود.",
    icon: Waypoints,
    tone: "text-sky-600 dark:text-sky-300",
    iconTone: "bg-sky-500/10",
    rail: "bg-sky-500",
    image: "/images/rycode-hero-structure.png",
    imageAlt: "ساختار بصری یک محصول دیجیتال مدرن",
    layout: "lg:col-span-7 lg:min-h-[360px]",
  },
  {
    title: "نرم‌افزار اختصاصی",
    body: "وقتی نرم‌افزار آماده کارتان را راه نمی‌اندازد، پنل و ابزار خودتان را می‌سازیم.",
    icon: Blocks,
    tone: "text-violet-600 dark:text-violet-300",
    iconTone: "bg-violet-500/10",
    rail: "bg-violet-500",
    image: "/images/rycode-product-system.png",
    imageAlt: "لایه‌های مختلف یک نرم‌افزار اختصاصی",
    layout: "lg:col-span-5 lg:min-h-[360px]",
  },
  {
    title: "نجات و توسعه پروژه",
    body: "پروژه‌ای را که رها شده تحویل می‌گیریم و از همان‌جایی که مانده جلو می‌رویم.",
    icon: Wrench,
    tone: "text-amber-600 dark:text-amber-300",
    iconTone: "bg-amber-500/10",
    rail: "bg-amber-500",
    image: "/images/rycode-project-rescue.png",
    imageAlt: "بازسازی و منظم‌کردن یک پروژه نرم‌افزاری",
    layout: "lg:col-span-4 lg:min-h-[280px]",
  },
  {
    title: "API و یکپارچه‌سازی",
    body: "سیستم‌های پراکنده‌تان را به هم وصل می‌کنیم تا اطلاعات دوباره‌کاری نشود.",
    icon: Webhook,
    tone: "text-cyan-600 dark:text-cyan-300",
    iconTone: "bg-cyan-500/10",
    rail: "bg-cyan-500",
    image: "/images/rycode-connected-world.png",
    imageAlt: "اتصال سرویس‌ها و داده‌ها به یکدیگر",
    layout: "lg:col-span-4 lg:min-h-[280px]",
  },
  {
    title: "سئو و رشد",
    body: "کمک می‌کنیم آدم‌هایی که دنبال شما هستند، راحت‌تر پیدایتان کنند.",
    icon: Search,
    tone: "text-emerald-600 dark:text-emerald-300",
    iconTone: "bg-emerald-500/10",
    rail: "bg-emerald-500",
    layout: "lg:col-span-4 lg:min-h-[280px]",
  },
  {
    title: "داده و ابزارهای کسب‌وکار",
    body: "داده‌ها را از چند فایل و سیستم جمع می‌کنیم تا تصمیم‌گیری راحت‌تر شود.",
    icon: Database,
    tone: "text-rose-600 dark:text-rose-300",
    iconTone: "bg-rose-500/10",
    rail: "bg-rose-500",
    layout: "lg:col-span-7 lg:min-h-[280px]",
  },
  {
    title: "پشتیبانی و توسعه مستمر",
    body: "بعد از تحویل هم برای نگهداری و بهتر شدن محصول کنار شما می‌مانیم.",
    icon: Headphones,
    tone: "text-orange-600 dark:text-orange-300",
    iconTone: "bg-orange-500/10",
    rail: "bg-orange-500",
    layout: "lg:col-span-5 lg:min-h-[280px]",
  },
];

export function ServicesEditorial() {
  return (
    <Section className="bg-surface">
      <Container>
        <div className="flex flex-col gap-7 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <MetaLabel className="text-muted-foreground">SERVICES / 07</MetaLabel>
            <h2 className="display-2 mt-6">خدمات رای‌کد</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
              هر کدام از این خدمات را می‌توانید جداگانه بردارید یا کنار هم پیش ببرید؛ بستگی دارد
              الان کجای مسیر باشید.
            </p>
          </div>
          <TextLink to="/services">همه خدمات</TextLink>
        </div>

        <ul className="mt-10 grid grid-cols-12 gap-3">
          {pillars.map((pillar, index) => (
            <li
              key={pillar.title}
              className={cn(
                "col-span-12 md:col-span-6",
                index === pillars.length - 1 && "sm:col-span-12",
                pillar.layout,
              )}
            >
              <Link
                href="/services"
                className={cn(
                  "group relative flex h-full min-h-64 flex-col overflow-hidden rounded-xl border border-border bg-surface p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:p-7",
                  "image" in pillar && "border-white/15 bg-ink text-white",
                )}
              >
                {"image" in pillar && (
                  <>
                    <Image
                      src={pillar.image}
                      alt={pillar.imageAlt ?? ""}
                      fill
                      className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-[1.035]"
                    />
                    <span
                      className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10"
                      aria-hidden
                    />
                  </>
                )}

                {index === 5 && (
                  <span
                    className="pointer-events-none absolute inset-x-7 bottom-5 flex h-28 items-end gap-2 opacity-[0.11]"
                    aria-hidden
                  >
                    {[36, 68, 48, 88, 58, 76, 100, 64, 82].map((height) => (
                      <span
                        key={height}
                        className="flex-1 rounded-t-sm bg-rose-500"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </span>
                )}

                {index === 6 && (
                  <span
                    className="pointer-events-none absolute -bottom-28 -left-20 size-72 rounded-full border border-orange-500/15 shadow-[0_0_0_38px_rgba(249,115,22,0.04),0_0_0_76px_rgba(249,115,22,0.025)]"
                    aria-hidden
                  />
                )}

                <span
                  className={cn(
                    "absolute inset-x-0 top-0 z-10 h-0.5 origin-right scale-x-0 transition-transform duration-200 group-hover:scale-x-100 group-focus-visible:scale-x-100",
                    pillar.rail,
                  )}
                  aria-hidden
                />

                <span className="relative z-10 flex items-start justify-between gap-4">
                  <span
                    className={cn(
                      "grid size-10 place-items-center rounded-[0.65rem] backdrop-blur-sm",
                      "image" in pillar ? "bg-white/12 text-white" : pillar.iconTone,
                      !("image" in pillar) && pillar.tone,
                    )}
                  >
                    <pillar.icon className="size-[1.1rem]" aria-hidden />
                  </span>
                  <span
                    className={cn(
                      "font-latin text-[0.62rem] tracking-[0.18em]",
                      "image" in pillar ? "text-white/65" : "text-muted-foreground/70",
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </span>

                <span className="relative z-10 mt-auto pt-16">
                  <h3
                    className={cn(
                      "font-bold leading-8",
                      "image" in pillar ? "text-2xl" : "text-xl",
                    )}
                  >
                    {pillar.title}
                  </h3>
                  <p
                    className={cn(
                      "mt-3 max-w-xl text-sm leading-7",
                      "image" in pillar ? "text-white/72" : "text-muted-foreground",
                    )}
                  >
                    {pillar.body}
                  </p>
                </span>

                <span
                  className={cn(
                    "relative z-10 flex items-center gap-2 pt-5 text-xs font-bold opacity-70 transition-opacity group-hover:opacity-100",
                    "image" in pillar ? "text-white" : pillar.tone,
                  )}
                >
                  بیشتر ببینید
                  <ArrowUpLeft className="size-3.5 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

/* 5. WHAT WE BUILD (dark) ----------------------------------------------- */

const systems = [
  {
    name: "فروشگاه اینترنتی",
    body: "فروش آنلاین با مدیریت محصول، سفارش و پرداختی که با کار شما جور باشد.",
  },
  { name: "CRM", body: "سرنخ‌ها و مشتری‌ها را یک‌جا ببینید و هیچ پیگیری‌ای جا نماند." },
  { name: "سامانه سفارش‌گیری", body: "سفارش‌های تیم فروش، نماینده‌ها یا مشتری‌ها را منظم کنید." },
  { name: "پنل مشتری", body: "مشتری از یک جا سفارش‌ها، فاکتورها و درخواست‌هایش را ببیند." },
  { name: "Dashboard", body: "عددهای مهم کسب‌وکارتان را یک‌جا و قابل فهم ببینید." },
  {
    name: "نوبت‌دهی",
    body: "نوبت‌ها و ظرفیت مراجعه را بدون تماس و هماهنگی‌های تکراری مدیریت کنید.",
  },
  { name: "رزرو", body: "رزرو آنلاین خدمات، منابع یا فضا با قوانینی که خودتان تعیین می‌کنید." },
  { name: "Marketplace", body: "فروشنده‌ها، سفارش‌ها و تسویه‌ها را در یک پلتفرم مدیریت کنید." },
  { name: "سامانه گارانتی", body: "ثبت محصول و پیگیری گارانتی را برای مشتری ساده کنید." },
  { name: "پنل نمایندگان", body: "قیمت، سفارش و گزارش هر نماینده را شفاف و در دسترس کنید." },
  { name: "LMS", body: "دوره، آزمون و مسیر یادگیری را برای آموزش آنلاین کنار هم بچینید." },
];

export function SolutionExplorer() {
  const [active, setActive] = useState(0);
  const current = systems[active]!;

  return (
    <section className="bg-surface py-16 text-foreground dark:bg-ink dark:text-ink-foreground sm:py-20">
      <Container>
        <MetaLabel className="text-brand">SOLUTIONS</MetaLabel>
        <h2 className="display-2 mt-6 max-w-3xl">برای کسب‌وکارتان چه چیزی لازم دارید؟</h2>

        <div className="mt-14 grid gap-0 border-t border-border dark:border-white/12 lg:grid-cols-[1fr_1fr]">
          <ul className="lg:border-e lg:border-border lg:pe-10 dark:lg:border-white/12">
            {systems.map((s, i) => (
              <li key={s.name}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={active === i}
                  className={cn(
                    "flex w-full items-center gap-5 border-b border-border py-5 text-start transition-colors duration-200 dark:border-white/10",
                    active === i
                      ? "text-brand"
                      : "text-muted-foreground hover:text-foreground dark:text-ink-foreground/70 dark:hover:text-ink-foreground",
                  )}
                >
                  <MetaLabel index={i + 1} className="opacity-60" />
                  <span className="text-lg font-bold sm:text-xl">{s.name}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="border-b border-border px-0 py-12 dark:border-white/12 lg:ps-14">
            <div className="lg:sticky lg:top-28">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.25rem] border border-white/12 bg-white/[0.04] p-4">
                <div className="grid-field absolute inset-0 opacity-20" />
                <div className="relative h-full rounded-[0.9rem] border border-white/10 bg-ink/60 p-4 backdrop-blur-sm">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <MetaLabel className="text-white/40">
                      PREVIEW / {String(active + 1).padStart(2, "0")}
                    </MetaLabel>
                    <span className="size-2 rounded-full bg-brand shadow-[0_0_12px_var(--color-brand)]" />
                  </div>
                  <div className="mt-6 grid grid-cols-[1.2fr_0.8fr] gap-3">
                    <div className="rounded-lg border border-white/10 bg-white/[0.06] p-3">
                      <div className="flex h-24 items-end gap-1.5">
                        {[32, 48, 25, 64, 52, 78, 58].map((height, i) => (
                          <span
                            key={i}
                            className="flex-1 rounded-t-sm bg-brand/80"
                            style={{ height: `${height}%` }}
                          />
                        ))}
                      </div>
                      <span className="mt-3 block text-[0.65rem] text-white/45">
                        ACTIVITY / THIS WEEK
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="rounded-lg border border-white/10 bg-white/[0.06] p-3">
                        <span className="block text-2xl font-bold text-white">۸۶٪</span>
                        <span className="text-[0.65rem] text-white/45">HEALTH SCORE</span>
                      </div>
                      <div className="rounded-lg border border-white/10 bg-brand p-3 text-brand-foreground">
                        <span className="block text-lg font-bold">+۱۲</span>
                        <span className="text-[0.65rem]">NEW SIGNALS</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <span className="h-2 flex-1 rounded-full bg-white/10" />
                    <span className="h-2 w-1/4 rounded-full bg-white/10" />
                  </div>
                </div>
              </div>
              <h3 className="mt-8 text-2xl font-bold">{current.name}</h3>
              <p className="mt-4 text-base leading-8 text-muted-foreground dark:text-ink-foreground/70">
                {current.body}
              </p>
              <div className="mt-8">
                <TextLink to="/solutions" className="text-foreground dark:text-ink-foreground">
                  جزئیات راهکارها
                </TextLink>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* 6. PROJECT RESCUE (orange interruption) -------------------------------- */

export function ProjectRescue() {
  const steps = ["بررسی", "تصمیم", "ادامه"];
  return (
    <section className="bg-brand py-16 text-brand-foreground sm:py-20">
      <Container>
        <MetaLabel>PROJECT RESCUE</MetaLabel>
        <h2 className="display-1 mt-8 max-w-[14ch]">پروژه‌تان وسط راه مانده؟</h2>

        <figure className="mt-12 overflow-hidden border border-brand-foreground/25 bg-ink shadow-[12px_12px_0_hsl(var(--brand-foreground)/0.16)] lg:ms-auto lg:max-w-xl">
          <Image
            src="/images/rycode-project-rescue.png"
            alt="تبدیل یک ساختار پراکنده و شکسته به سیستمی منظم و پایدار"
            width={1248}
            height={1248}
            className="aspect-square w-full object-cover"
          />
          <figcaption className="border-t border-brand-foreground/20 px-4 py-3 text-xs tracking-[0.14em] opacity-70">
            UNTANGLE / REBUILD / MOVE FORWARD
          </figcaption>
        </figure>

        <div className="mt-16 grid gap-10 border-t border-brand-foreground/25 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <ol className="grid gap-0 sm:grid-cols-3">
            {steps.map((step, i) => (
              <li key={step} className="border-t border-brand-foreground/25 py-6 sm:border-t-0">
                <MetaLabel index={i + 1} className="opacity-70" />
                <p className="mt-3 text-2xl font-bold">{step}</p>
              </li>
            ))}
          </ol>
          <div className="lg:text-end">
            <p className="max-w-md text-base leading-8 lg:ms-auto">
              اگر برنامه‌نویس قبلی پروژه را رها کرده یا سیستم فعلی برای رشد کافی نیست، لازم نیست
              دوباره از صفر شروع کنید.
            </p>
            <div className="mt-8 inline-flex">
              <CtaLink
                to="/technical-review"
                className="bg-brand-foreground text-brand hover:bg-brand-foreground/90"
              >
                بفرستید بررسی‌اش کنیم
              </CtaLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* 7. SELECTED PROJECTS -------------------------------------------------- */

const projects = [
  {
    name: "سامانه سفارش‌گیری نمایندگان",
    industry: "تولید و کارخانه",
    problem: "نماینده‌ها سفارش را تلفنی و با اکسل می‌فرستادند و پیگیری‌اش سخت بود.",
    solution: "یک پنل اختصاصی برای قیمت‌گذاری، ثبت سفارش و دیدن وضعیت هر سفارش.",
  },
  {
    name: "بازطراحی فروشگاه اینترنتی",
    industry: "خودرو و لوازم یدکی",
    problem: "دسته‌بندی‌ها نامرتب بود و کندی سایت جلوی رشد در گوگل را گرفته بود.",
    solution: "مرتب‌کردن ساختار سایت، سریع‌تر کردن صفحات و تقویت سئوی فروشگاهی.",
  },
  {
    name: "پرتال خدمات پس از فروش",
    industry: "تجهیزات صنعتی",
    problem: "درخواست‌های گارانتی بین تماس، پیام و کانال‌های مختلف گم می‌شد.",
    solution: "سامانه‌ای برای ثبت محصول، گارانتی و پیگیری همه درخواست‌ها در یک جا.",
  },
];

function CaseVisual({ index }: { index: number }) {
  const source = [
    "/images/rycode-product-system.png",
    "/images/rycode-project-rescue.png",
    "/images/rycode-connected-world.png",
  ][(index - 1) % 3]!;
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.25rem] border border-border bg-surface-2">
      <Image
        src={source}
        alt="تصویر مفهومی از یک پروژه‌ی دیجیتال رای‌کد"
        fill
        className={cn(
          "object-cover transition-transform duration-700 group-hover:scale-105",
          index === 2 ? "object-center" : "object-left",
        )}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-80" />
      <div className="absolute top-4 right-4 rounded-full border border-white/20 bg-ink/35 px-3 py-1 text-[0.65rem] tracking-[0.14em] text-white/70 backdrop-blur-sm">
        RYCODE / CASE
      </div>
      <span
        dir="ltr"
        className="absolute bottom-3 left-5 text-[4.5rem] leading-none font-extrabold text-white/20"
      >
        {String(index).padStart(2, "0")}
      </span>
    </div>
  );
}

export function SelectedProjects() {
  const published: {
    id: string;
    slug: string;
    title_fa: string;
    summary_fa: string | null;
  }[] = [];

  return (
    <Section className="grain">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <MetaLabel className="text-muted-foreground">SELECTED WORK</MetaLabel>
            <h2 className="display-2 mt-6 max-w-3xl">
              چند نمونه از مسئله‌هایی که برایشان راه‌حل ساخته‌ایم
            </h2>
          </div>
          <TextLink to="/projects">همه پروژه‌ها</TextLink>
        </div>

        <div className="mt-16 border-t border-border">
          {published.length > 0
            ? published.map((p, i) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.slug}`}
                  className="group grid gap-8 border-b border-border py-14 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-16 lg:even:[direction:inherit]"
                >
                  <div className={cn(i % 2 === 1 && "lg:order-2")}>
                    <CaseVisual index={i + 1} />
                  </div>
                  <div>
                    <MetaLabel index={i + 1} className="text-muted-foreground">
                      CASE STUDY
                    </MetaLabel>
                    <h3 className="display-3 mt-5">{p.title_fa}</h3>
                    {p.summary_fa && (
                      <p className="mt-5 max-w-lg text-base leading-8 text-muted-foreground">
                        {p.summary_fa}
                      </p>
                    )}
                    <span className="mt-8 inline-flex items-center gap-3 text-sm font-bold">
                      مطالعه موردی
                      <ArrowSquare />
                    </span>
                  </div>
                </Link>
              ))
            : projects.map((p, i) => (
                <article
                  key={p.name}
                  className="group grid gap-8 border-b border-border py-14 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-16"
                >
                  <div className={cn(i % 2 === 1 && "lg:order-2")}>
                    <CaseVisual index={i + 1} />
                  </div>
                  <div>
                    <MetaLabel index={i + 1} className="text-muted-foreground">
                      {p.industry}
                    </MetaLabel>
                    <h3 className="display-3 mt-5">{p.name}</h3>
                    <dl className="mt-6 space-y-5 text-sm">
                      <div>
                        <dt className="meta-label text-brand">PROBLEM</dt>
                        <dd className="mt-2 max-w-lg leading-8 text-muted-foreground">
                          {p.problem}
                        </dd>
                      </div>
                      <div>
                        <dt className="meta-label text-brand">SOLUTION</dt>
                        <dd className="mt-2 max-w-lg leading-8 text-muted-foreground">
                          {p.solution}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </article>
              ))}
        </div>

        {published.length === 0 && (
          <p className="mt-6 text-xs text-muted-foreground">
            این‌ها نمونه‌های مفهومی‌اند تا ببینید برای چه جور مسئله‌هایی می‌توانیم راه‌حل بسازیم؛
            نام مشتری یا آمار واقعی در آن‌ها نیست.
          </p>
        )}
      </Container>
    </Section>
  );
}

/* 8. INDUSTRIES MATRIX --------------------------------------------------- */

const capabilityColumns = ["WEB", "SOFTWARE", "SEO", "DATA"] as const;

function capabilitiesFor(index: number): boolean[] {
  // Deterministic, presentational coverage map derived from list order.
  const patterns = [
    [true, true, true, false],
    [true, true, true, true],
    [true, false, true, false],
    [true, true, false, true],
  ];
  return patterns[index % patterns.length]!;
}

export function IndustriesSection() {
  return (
    <section className="bg-surface py-16 text-foreground dark:bg-ink dark:text-ink-foreground sm:py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <MetaLabel className="text-brand">INDUSTRIES</MetaLabel>
            <h2 className="display-2 mt-6 max-w-2xl">راه‌حل خوب باید به کسب‌وکار شما بخورد</h2>
          </div>
          <TextLink to="/industries" className="text-foreground dark:text-ink-foreground">
            همه صنایع
          </TextLink>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-4">
          {[
            { label: "WEB", value: "۰۸", tone: "bg-brand text-brand-foreground" },
            {
              label: "SOFTWARE",
              value: "۰۵",
              tone: "border border-border bg-background text-foreground dark:border-transparent dark:bg-white/10 dark:text-white",
            },
            {
              label: "SEO",
              value: "۰۶",
              tone: "border border-border bg-background text-foreground dark:border-transparent dark:bg-white/10 dark:text-white",
            },
            {
              label: "DATA",
              value: "۰۴",
              tone: "border border-border bg-background text-foreground dark:border-transparent dark:bg-white/10 dark:text-white",
            },
          ].map((item) => (
            <div key={item.label} className={cn("rounded-2xl p-4", item.tone)}>
              <MetaLabel className="opacity-65">{item.label}</MetaLabel>
              <div className="mt-5 flex items-end justify-between">
                <span className="text-3xl font-bold">{item.value}</span>
                <span className="text-xs opacity-60">مسیر فعال</span>
              </div>
            </div>
          ))}
        </div>

        <div className="relative mt-4 min-h-[240px] overflow-hidden rounded-2xl border border-border bg-ink text-white dark:border-white/12">
          <Image
            src="/images/rycode-connected-world.png"
            alt="شبکه‌ای از سیستم‌های متصل برای صنایع مختلف"
            fill
            className="object-cover opacity-65"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/35 to-transparent" />
          <div className="absolute inset-y-0 left-0 flex max-w-sm flex-col justify-end p-6 sm:p-8">
            <MetaLabel className="text-brand">CONNECTED BUSINESS</MetaLabel>
            <p className="mt-3 text-xl font-bold leading-8">
              هر ابزار وقتی ارزش دارد که به بقیه‌ی کسب‌وکار وصل باشد
            </p>
          </div>
        </div>

        <div className="mt-14 hidden border-t border-border dark:border-white/12 lg:block">
          <div className="grid grid-cols-[1.6fr_repeat(4,minmax(0,1fr))] border-b border-border py-4 dark:border-white/12">
            <span />
            {capabilityColumns.map((c) => (
              <MetaLabel key={c} className="text-muted-foreground dark:text-white/45">
                {c}
              </MetaLabel>
            ))}
          </div>
          {industries.map((name, i) => (
            <Link
              key={name}
              href="/industries"
              className="grid grid-cols-[1.6fr_repeat(4,minmax(0,1fr))] items-center border-b border-border py-5 transition-colors hover:bg-brand-soft dark:border-white/10 dark:hover:bg-white/5"
            >
              <span className="text-base font-semibold">{name}</span>
              {capabilitiesFor(i).map((on, j) => (
                <span key={capabilityColumns[j]} className="text-sm">
                  {on ? (
                    <span className="inline-block size-2 rounded-full bg-brand" />
                  ) : (
                    <span className="inline-block size-2 rounded-full bg-border dark:bg-white/15" />
                  )}
                </span>
              ))}
            </Link>
          ))}
        </div>

        <ul className="mt-12 border-t border-border dark:border-white/12 lg:hidden">
          {industries.map((name, i) => (
            <li key={name}>
              <Link
                href="/industries"
                className="flex items-center justify-between gap-4 border-b border-border py-5 dark:border-white/10"
              >
                <span className="text-base font-semibold">{name}</span>
                <span className="flex items-center gap-1.5">
                  {capabilitiesFor(i).map((on, j) => (
                    <span
                      key={capabilityColumns[j]}
                      className={cn(
                        "inline-block size-1.5 rounded-full",
                        on ? "bg-brand" : "bg-border dark:bg-white/15",
                      )}
                    />
                  ))}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* 9. WHY RYCODE ---------------------------------------------------------- */

const whyItems = [
  {
    title: "اول می‌فهمیم مشکل کجاست",
    body: "قبل از اینکه ابزار و تکنولوژی پیشنهاد بدهیم، می‌نشینیم ببینیم دقیقاً چه چیزی قرار است بهتر شود.",
  },
  {
    title: "لازم نیست همه‌چیز را از نو بسازید",
    body: "اگر پروژه فعلی قابل نجات باشد، همان را مرتب و قوی‌تر می‌کنیم؛ بازنویسی فقط وقتی که واقعاً لازم باشد.",
  },
  {
    title: "سئو را آخر کار یادمان نمی‌افتد",
    body: "ساختار فنی و دیده‌شدن در گوگل را از همان اول کنار هم جلو می‌بریم.",
  },
  {
    title: "کد و دسترسی‌ها برای خودتان می‌ماند",
    body: "همه‌چیز شفاف تحویل شما می‌شود؛ کد، داده‌ها، دامنه و دسترسی‌ها.",
  },
  {
    title: "بعد از تحویل هم تنها نمی‌مانید",
    body: "اگر خواستید، نگهداری، رفع مشکل و توسعه‌های بعدی را هم کنار شما ادامه می‌دهیم.",
  },
];

export function WhyRycode() {
  return (
    <Section className="grain bg-surface">
      <Container>
        <MetaLabel className="text-muted-foreground">WHY RYCODE</MetaLabel>
        <div className="mt-10 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="relative min-h-[180px] overflow-hidden rounded-[1.25rem] bg-ink">
            <Image
              src="/images/rycode-product-system.png"
              alt="لایه‌های مختلف یک سیستم منسجم و قابل رشد"
              fill
              className="object-cover object-right opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/30 to-transparent" />
            <div className="absolute inset-y-0 left-0 flex max-w-xs flex-col justify-center p-6 text-white">
              <MetaLabel className="text-brand">THE RYCODE METHOD</MetaLabel>
              <p className="mt-2 text-lg font-bold leading-7">
                شفاف، قابل توسعه، ساخته‌شده برای فردا
              </p>
            </div>
          </div>
          <div className="visual-card flex items-end justify-between bg-brand p-6 text-brand-foreground">
            <span className="text-6xl font-extrabold tracking-[-0.08em]">۰۵</span>
            <span className="max-w-[8rem] text-sm font-bold leading-6">
              دلیل برای اینکه پروژه را درست شروع کنیم
            </span>
          </div>
        </div>
        <div className="mt-14 border-t border-border">
          {whyItems.map((item, i) => (
            <div
              key={item.title}
              className={cn(
                "grid gap-6 border-b border-border py-14 lg:grid-cols-2 lg:items-start lg:gap-16",
              )}
            >
              <div className={cn(i % 2 === 1 && "lg:order-2")}>
                <MetaLabel index={i + 1} className="text-brand" />
                <h3 className="display-3 mt-5 max-w-[16ch]">{item.title}</h3>
              </div>
              <p className="max-w-md text-base leading-9 text-muted-foreground lg:pt-14">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* 10. PROCESS ------------------------------------------------------------ */

const stages = [
  { fa: "شناخت", en: "DISCOVER" },
  { fa: "تعریف", en: "DEFINE" },
  { fa: "طراحی", en: "DESIGN" },
  { fa: "توسعه", en: "BUILD" },
  { fa: "تست", en: "TEST" },
  { fa: "انتشار", en: "LAUNCH" },
  { fa: "بهبود", en: "IMPROVE" },
];

export function ProcessSection() {
  return (
    <Section>
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <MetaLabel className="text-muted-foreground">PROCESS</MetaLabel>
            <h2 className="display-2 mt-6">از اولین گفت‌وگو تا تحویل، قدم‌به‌قدم کنار شما هستیم</h2>
          </div>
          <TextLink to="/process">جزئیات فرآیند</TextLink>
        </div>

        <div className="relative mt-12 overflow-hidden rounded-[1.25rem] border border-border bg-surface-2 p-6 sm:p-8">
          <div className="absolute inset-0 soft-grid opacity-50" />
          <div className="relative flex flex-wrap items-center justify-between gap-5">
            {stages.map((stage, i) => (
              <div key={stage.en} className="flex items-center gap-3">
                <span
                  className={cn(
                    "grid size-10 place-items-center rounded-full border text-sm font-bold",
                    i === 0
                      ? "border-brand bg-brand text-brand-foreground"
                      : "border-border bg-background",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {i < stages.length - 1 && (
                  <span className="hidden h-px w-8 bg-border sm:block lg:w-12" />
                )}
              </div>
            ))}
          </div>
          <div className="relative mt-6 flex items-center justify-between gap-4 text-xs text-muted-foreground">
            <span>از شناخت مسئله تا بهبود مداوم</span>
            <span dir="ltr" className="tracking-[0.14em]">
              DISCOVER → IMPROVE
            </span>
          </div>
        </div>

        <ol className="mt-16 border-t border-border">
          {stages.map((stage, i) => (
            <li
              key={stage.en}
              className="flex items-baseline gap-6 border-b border-border py-7 sm:gap-12"
            >
              <span dir="ltr" className="text-3xl font-extrabold text-foreground/15 sm:text-5xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 text-xl font-bold sm:text-2xl">{stage.fa}</span>
              <MetaLabel className="text-muted-foreground">{stage.en}</MetaLabel>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

/* 11. PAYMENT ------------------------------------------------------------ */

export function PaymentSection() {
  return (
    <Section className="bg-brand-soft">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <h2 className="display-2 max-w-[14ch]">لازم نیست همه هزینه را یک‌جا پرداخت کنید</h2>
          <div className="text-base leading-9 text-muted-foreground">
            <p>
              برای پروژه‌های واجد شرایط، هزینه را به چند مرحله تقسیم می‌کنیم. هر مرحله که تحویل و
              تأیید شد، سراغ مرحله بعد می‌رویم.
            </p>
            <div className="mt-8">
              <TextLink to="/start-project">درباره پرداخت مرحله‌ای بپرسید</TextLink>
            </div>
          </div>
        </div>
        <div className="relative mt-14 overflow-hidden rounded-[1.5rem] border border-brand/25 bg-background p-5 sm:p-8">
          <div className="absolute inset-0 soft-grid opacity-40" />
          <div className="relative grid gap-3 sm:grid-cols-4">
            {["شروع", "طراحی", "ساخت", "رشد"].map((label, i) => (
              <div key={label} className="rounded-xl border border-border bg-surface p-4">
                <MetaLabel index={i + 1} className="text-brand" />
                <p className="mt-6 text-sm font-bold">{label}</p>
                <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-border">
                  <span
                    className="block h-full rounded-full bg-brand"
                    style={{ width: `${[28, 52, 76, 100][i]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* 12. BLOG --------------------------------------------------------------- */

export function BlogSection() {
  const rows: {
    id: string;
    slug: string;
    title_fa: string;
    excerpt_fa: string | null;
  }[] = [];
  const featured = rows[0] ?? null;
  const latest = rows.slice(1, 6);

  return (
    <Section>
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <MetaLabel className="text-muted-foreground">JOURNAL</MetaLabel>
            <h2 className="display-2 mt-6 max-w-3xl">
              از چیزهایی می‌نویسیم که در مسیر ساخت و رشد یاد می‌گیریم
            </h2>
          </div>
          <TextLink to="/blog">همه مقاله‌ها</TextLink>
        </div>

        {featured ? (
          <Link
            href={`/blog/${featured.slug}`}
            className="group mt-14 grid gap-10 border-y border-border py-12 lg:grid-cols-[1fr_1fr] lg:items-center"
          >
            <div className="relative aspect-[16/9] overflow-hidden border border-border bg-surface-2">
              <div className="grid-field absolute inset-0 opacity-50" />
              <div className="absolute bottom-0 left-0 h-1.5 w-1/3 bg-brand" />
            </div>
            <div>
              <MetaLabel className="text-brand">FEATURED</MetaLabel>
              <h3 className="display-3 mt-5">{featured.title_fa}</h3>
              {featured.excerpt_fa && (
                <p className="mt-5 line-clamp-3 max-w-lg text-base leading-8 text-muted-foreground">
                  {featured.excerpt_fa}
                </p>
              )}
              <span className="mt-8 inline-flex items-center gap-3 text-sm font-bold">
                خواندن مقاله
                <ArrowSquare />
              </span>
            </div>
          </Link>
        ) : (
          <div className="mt-14 grid gap-8 overflow-hidden rounded-[1.5rem] border border-border bg-surface-2 p-5 sm:p-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <MetaLabel className="text-muted-foreground">FEATURED / SOON</MetaLabel>
              <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground">
                هنوز مقاله‌ای منتشر نکرده‌ایم؛ به‌زودی تجربه‌ها و نکته‌های کاربردی تیم را اینجا
                می‌گذاریم.
              </p>
            </div>
            <div className="relative aspect-[16/8] overflow-hidden rounded-xl bg-ink">
              <Image
                src="/images/rycode-product-system.png"
                alt="تصویر انتزاعی دفترچه‌ی یادداشت و ساخت محصول"
                fill
                className="object-cover opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-ink/70 via-transparent to-brand/20" />
              <span className="absolute right-4 bottom-4 rounded-full bg-brand px-3 py-1 text-xs font-bold text-brand-foreground">
                یادداشت‌های تیم
              </span>
            </div>
          </div>
        )}

        {latest.length > 0 && (
          <ul>
            {latest.map((a, i) => (
              <li key={a.id}>
                <Link
                  href={`/blog/${a.slug}`}
                  className="group flex items-center gap-6 border-b border-border py-7 transition-colors hover:text-brand"
                >
                  <MetaLabel index={i + 2} className="text-muted-foreground" />
                  <span className="flex-1 text-lg font-bold leading-8">{a.title_fa}</span>
                  <ArrowSquare />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </Section>
  );
}

/* 13. FAQ ---------------------------------------------------------------- */

const faqs = [
  {
    q: "پروژه‌ای که نیمه‌کاره مانده را هم قبول می‌کنید؟",
    a: "بله. اول کد، دسترسی‌ها و زیرساخت را بررسی می‌کنیم؛ بعد صادقانه می‌گوییم ادامه دادن همین مسیر بهتر است یا باید بخشی از آن را دوباره ساخت.",
  },
  {
    q: "هزینه پروژه را چطور حساب می‌کنید؟",
    a: "بعد از اینکه درباره نیاز و دامنه کار به جمع‌بندی رسیدیم، زمان و هزینه را شفاف اعلام می‌کنیم. پروژه‌های بزرگ‌تر را هم می‌شود مرحله‌ای جلو برد.",
  },
  {
    q: "کد و دسترسی‌ها برای چه کسی است؟",
    a: "برای شماست. کد، دسترسی‌ها، دیتابیس و دامنه در پایان پروژه کامل و شفاف تحویل داده می‌شود.",
  },
  {
    q: "بعد از تحویل هم کمک می‌کنید؟",
    a: "بله. می‌توانیم نگهداری، رفع مشکل و توسعه‌های بعدی را به‌صورت مستمر یا موردی کنار شما ادامه بدهیم.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  const items = faqs;

  return (
    <Section className="bg-surface">
      <Container>
        <MetaLabel className="text-muted-foreground">FAQ</MetaLabel>
        <h2 className="display-2 mt-6">پرسش‌های پرتکرار</h2>

        <div className="mt-14 border-t border-border">
          {items.map((f, i) => (
            <div key={f.q} className="border-b border-border">
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-8 py-8 text-start"
                aria-expanded={open === i}
              >
                <span
                  className={cn(
                    "text-xl font-bold sm:text-2xl",
                    open === i ? "text-brand" : "text-foreground",
                  )}
                >
                  {f.q}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-[5px] border text-lg transition-colors",
                    open === i ? "border-brand bg-brand text-brand-foreground" : "border-border",
                  )}
                >
                  {open === i ? "−" : "+"}
                </span>
              </button>
              {open === i && (
                <p className="max-w-3xl pb-8 text-base leading-9 text-muted-foreground">{f.a}</p>
              )}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* 14. FINAL CTA ---------------------------------------------------------- */

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-surface-2 py-16 text-foreground dark:bg-ink dark:text-ink-foreground sm:py-20">
      <Image
        src="/images/rycode-connected-world.png"
        alt=""
        fill
        className="object-cover object-right opacity-10 dark:opacity-20"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-l from-background/40 via-background/85 to-background dark:from-ink/40 dark:via-ink/85 dark:to-ink" />
      <Container>
        <div className="relative">
          <MetaLabel className="text-brand">START HERE</MetaLabel>
          <h2 className="display-1 mt-8 max-w-[15ch]">
            یه پروژه توی ذهنتونه؟
            <br />
            یا یه <span className="text-brand">مشکل</span> که باید حل بشه؟
          </h2>
          <div className="mt-14 flex flex-wrap items-center gap-8 border-t border-border pt-10 dark:border-white/12">
            <CtaLink to="/start-project">با هم شروع کنیم</CtaLink>
            <TextLink to="/technical-review" className="text-foreground dark:text-ink-foreground">
              پروژه‌تان را بررسی کنیم
            </TextLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
