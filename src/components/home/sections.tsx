"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowUpLeft,
  Blocks,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  Headphones,
  LayoutDashboard,
  Route,
  ScanSearch,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Store,
  UserRound,
  UsersRound,
  Waypoints,
  Webhook,
  Wrench,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  Container,
  CtaLink,
  Eyebrow,
  Lead,
  MetaLabel,
  Section,
  SectionTitle,
  TextLink,
} from "@/components/site/primitives";
import { ContextVisual, type ContextVisualVariant } from "@/components/site/context-visual";
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

const servicePillars = [
  {
    title: "طراحی و توسعه سایت",
    lead: "از یک سایت ساده تا یک پلتفرم کاملاً اختصاصی.",
    body: "سایت شرکتی، فروشگاهی، خدماتی، آموزشی، رزرو و نوبت‌دهی، مارکت‌پلیس، پنل کاربری و پروژه‌های اختصاصی را متناسب با نیاز کسب‌وکارت طراحی و توسعه می‌دهیم.",
    icon: Waypoints,
    visual: "web" as ContextVisualVariant,
    layout: "lg:col-span-7 lg:min-h-[400px]",
    accent: "#20bfb2",
  },
  {
    title: "نرم‌افزار اختصاصی",
    lead: "وقتی ابزارهای آماده دقیقاً کاری که می‌خواهی را انجام نمی‌دهند، ابزار مخصوص کسب‌وکار خودت را می‌سازیم.",
    body: "از سیستم مدیریت مشتری و سفارش گرفته تا پنل‌های مدیریتی، سیستم‌های داخلی شرکت، CRM، مدیریت انبار، رزرو، اتوماسیون فرایندها و نرم‌افزارهای تحت وب.",
    icon: Blocks,
    visual: "software" as ContextVisualVariant,
    layout: "lg:col-span-5 lg:min-h-[400px]",
    accent: "#6c92f4",
  },
  {
    title: "اپلیکیشن موبایل",
    lead: "اپلیکیشن‌هایی که کنار سایت یا به‌صورت یک محصول مستقل کار می‌کنند.",
    body: "اپ فروشگاهی، خدماتی، سازمانی، رزرو و نوبت‌دهی، اپ مشتریان، پنل کارکنان و اپلیکیشن‌های اختصاصی Android و iOS را متناسب با مدل کسب‌وکار توسعه می‌دهیم.",
    icon: Smartphone,
    visual: "mobile" as ContextVisualVariant,
    layout: "lg:col-span-4 lg:min-h-[340px]",
    accent: "#796fe8",
  },
  {
    title: "سئو و رشد ارگانیک",
    lead: "کمک می‌کنیم افرادی که در گوگل دنبال محصولات یا خدماتت هستند راحت‌تر پیدایت کنند.",
    body: "از سئوی فنی و ساختار سایت تا تحقیق کلمات کلیدی، صفحات خدمات و محصولات، محتوا، بهبود صفحات مهم، Search Console، سرعت سایت و رفع مشکلات ایندکس.",
    icon: Search,
    visual: "seo" as ContextVisualVariant,
    layout: "lg:col-span-4 lg:min-h-[340px]",
    accent: "#4eaf8e",
  },
  {
    title: "API، اتصال سیستم‌ها و ربات‌ها",
    lead: "اگر اطلاعات و کارهایت بین چند سیستم مختلف پخش شده، آن‌ها را به هم متصل می‌کنیم.",
    body: "اتصال سایت به نرم‌افزار حسابداری، انبار، CRM، پیامک، درگاه پرداخت و سرویس‌های دیگر، ساخت API، ربات تلگرام، ابزارهای خودکار، Web Scraping، استخراج اطلاعات و انتقال داده بین سیستم‌ها.",
    icon: Webhook,
    visual: "integration" as ContextVisualVariant,
    layout: "lg:col-span-4 lg:min-h-[340px]",
    accent: "#3aaed8",
  },
  {
    title: "داده، داشبورد و گزارش‌گیری",
    lead: "داده‌های پراکنده را تبدیل به اطلاعات قابل استفاده برای تصمیم‌گیری می‌کنیم.",
    body: "داشبورد مدیریتی، گزارش فروش، گزارش مالی و عملیاتی، تحلیل اطلاعات، Power BI، Excel حرفه‌ای، پردازش فایل‌های CSV و Excel، جمع‌آوری و یکپارچه‌سازی داده‌ها و گزارش‌گیری خودکار.",
    icon: LayoutDashboard,
    visual: "data" as ContextVisualVariant,
    layout: "lg:col-span-7 lg:min-h-[360px]",
    accent: "#9b78d5",
  },
  {
    title: "رفع مشکل و ادامه پروژه",
    lead: "پروژه نیمه‌کاره، سایت کند، باگ عجیب یا سیستمی داری که دیگر درست کار نمی‌کند؟",
    body: "کد و ساختار فعلی را بررسی می‌کنیم، مشکل را پیدا می‌کنیم و پروژه را دوباره به مسیر درست برمی‌گردانیم؛ از رفع باگ و مشکلات دیتابیس تا تکمیل پروژه، بهینه‌سازی سرعت، مهاجرت و توسعه سیستم‌های قدیمی.",
    icon: Wrench,
    visual: "recovery" as ContextVisualVariant,
    layout: "lg:col-span-5 lg:min-h-[360px]",
    accent: "#d06f9a",
  },
  {
    title: "پشتیبانی و توسعه",
    lead: "تحویل پروژه پایان همکاری نیست.",
    body: "برای نگهداری، رفع مشکلات، بروزرسانی، افزایش سرعت، اضافه کردن امکانات جدید و توسعه مرحله‌به‌مرحله محصول کنارت می‌مانیم تا سیستم با رشد کسب‌وکارت رشد کند.",
    icon: Headphones,
    visual: "support" as ContextVisualVariant,
    layout: "lg:col-span-12 lg:min-h-[290px]",
    accent: "#5a86d6",
  },
];

export function ServicesEditorial() {
  return (
    <Section className="relative overflow-hidden bg-white text-[#073b4c] sm:py-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 16%, rgba(32,191,178,0.14), transparent 24%), radial-gradient(circle at 88% 42%, rgba(108,146,244,0.11), transparent 28%), radial-gradient(circle at 26% 78%, rgba(155,120,213,0.08), transparent 24%), linear-gradient(180deg, rgba(255,255,255,0.45), rgba(255,255,255,0.78))",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: "radial-gradient(rgba(7,59,76,0.28) 0.7px, transparent 0.7px)",
          backgroundSize: "34px 34px",
        }}
        aria-hidden
      />

      <Container className="relative z-10">
        <div className="flex flex-col gap-6 border-b border-[#073b4c]/12 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-[clamp(1.9rem,3.5vw,3.2rem)] font-semibold leading-[1.2] tracking-[-0.03em]">
              خدمات رای‌کد
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-8 text-[#52717b] sm:text-base sm:leading-9">
              از ساخت یک حضور دیجیتال دقیق تا توسعه ابزارهای پیچیده؛ هر چیزی را متناسب با مسئله،
              فرایند و مسیر رشد کسب‌وکارت طراحی می‌کنیم.
            </p>
          </div>
          <Link
            href="/services"
            className="group inline-flex min-h-11 w-fit items-center gap-3 rounded-full border border-[#20bfb2]/45 bg-white/65 px-6 text-sm font-semibold text-[#0b766e] shadow-[0_10px_32px_rgba(31,92,105,0.08)] backdrop-blur-md transition-colors hover:border-[#20bfb2]/80 hover:bg-white/90"
          >
            همه خدمات
            <ArrowUpLeft className="size-4 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>

        <ol className="mt-8 grid grid-cols-12 gap-4">
          {servicePillars.map((service, index) => (
            <li
              key={service.title}
              className={cn(
                "col-span-12 md:col-span-6",
                index === servicePillars.length - 1 && "md:col-span-12",
                service.layout,
              )}
            >
              <Link
                href="/services"
                className={cn(
                  "group relative flex h-full min-h-[300px] flex-col overflow-hidden rounded-xl border border-[#0b5262]/12 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_10px_32px_rgba(31,92,105,0.065)] backdrop-blur-md transition-[transform,border-color,background-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-[#20bfb2]/45 hover:shadow-[0_18px_48px_rgba(31,92,105,0.12)] sm:p-7",
                  "bg-white/75",
                )}
              >
                <ContextVisual
                  variant={service.visual}
                  title={service.title}
                  decorative
                  className="absolute inset-0 min-h-0 opacity-[0.72] transition-[transform,opacity] duration-700 group-hover:scale-[1.025] group-hover:opacity-85"
                />
                <span
                  className="absolute inset-0 bg-[linear-gradient(180deg,rgba(234,247,248,0.12)_0%,rgba(234,247,248,0.8)_48%,rgba(234,247,248,0.99)_100%)]"
                  aria-hidden
                />

                {index === 5 && (
                  <span
                    className="pointer-events-none absolute inset-x-8 bottom-7 flex h-36 items-end gap-2 opacity-[0.09]"
                    aria-hidden
                  >
                    {[36, 68, 48, 88, 58, 76, 100, 64, 82].map((height) => (
                      <span
                        key={height}
                        className="flex-1 rounded-t-sm"
                        style={{ height: `${height}%`, backgroundColor: service.accent }}
                      />
                    ))}
                  </span>
                )}

                {index === 7 && (
                  <span
                    className="pointer-events-none absolute -bottom-32 -left-16 size-80 rounded-full border opacity-30 shadow-[0_0_0_42px_rgba(90,134,214,0.07),0_0_0_84px_rgba(90,134,214,0.035)]"
                    style={{ borderColor: service.accent }}
                    aria-hidden
                  />
                )}

                <span
                  className="absolute inset-x-0 top-0 z-10 h-px origin-right scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                  style={{ backgroundColor: service.accent }}
                  aria-hidden
                />

                <span className="relative z-10 flex items-start gap-5">
                  <span
                    className="grid size-11 place-items-center rounded-xl border backdrop-blur-md transition-[filter,transform] group-hover:scale-105 group-hover:brightness-90"
                    style={{
                      borderColor: `${service.accent}59`,
                      backgroundColor: `${service.accent}18`,
                      color: service.accent,
                    }}
                  >
                    <service.icon className="size-5" aria-hidden />
                  </span>
                </span>

                <span className="relative z-10 mt-auto pt-14">
                  <h3 className="text-lg font-bold leading-8 text-[#073b4c] sm:text-xl">
                    {service.title}
                  </h3>
                  <p className="mt-4 max-w-2xl text-sm font-medium leading-8 text-[#214f5b]/90">
                    {service.lead}
                  </p>
                  <span
                    className="my-5 block h-px w-12 opacity-55"
                    style={{ backgroundColor: service.accent }}
                    aria-hidden
                  />
                  <p className="max-w-2xl text-sm leading-7 text-[#52717b]">{service.body}</p>
                </span>

                <span
                  className="relative z-10 mt-7 flex items-center gap-2 text-xs font-semibold transition-[filter] group-hover:brightness-75"
                  style={{ color: service.accent }}
                >
                  جزئیات خدمت
                  <ArrowUpLeft className="size-3.5 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

/* 5. WHAT WE BUILD (dark) ----------------------------------------------- */

const systems = [
  {
    name: "فروشگاه اینترنتی",
    body: "فروش آنلاین با مدیریت محصول، سفارش و پرداختی که با کار شما جور باشد.",
    note: "برای فروش مستقیم به مشتری",
    modules: ["کاتالوگ محصول", "سفارش و پرداخت", "انبار و ارسال"],
    visual: "ecommerce" as ContextVisualVariant,
    icon: ShoppingBag,
  },
  {
    name: "CRM",
    body: "سرنخ‌ها و مشتری‌ها را یک‌جا ببینید و هیچ پیگیری‌ای جا نماند.",
    note: "برای تیم‌های فروش و ارتباط با مشتری",
    modules: ["سرنخ‌ها", "پیگیری فروش", "تاریخچه مشتری"],
    visual: "crm" as ContextVisualVariant,
    icon: UsersRound,
  },
  {
    name: "سامانه سفارش‌گیری",
    body: "سفارش‌های تیم فروش، نماینده‌ها یا مشتری‌ها را منظم کنید.",
    note: "برای فروش عمده و شبکه نمایندگان",
    modules: ["قیمت‌گذاری", "ثبت سفارش", "وضعیت تحویل"],
    visual: "ordering" as ContextVisualVariant,
    icon: ClipboardList,
  },
  {
    name: "پنل مشتری",
    body: "مشتری از یک جا سفارش‌ها، فاکتورها و درخواست‌هایش را ببیند.",
    note: "برای ارائه خدمات سلف‌سرویس",
    modules: ["حساب کاربری", "فاکتورها", "درخواست پشتیبانی"],
    visual: "portal" as ContextVisualVariant,
    icon: UserRound,
  },
  {
    name: "Dashboard",
    body: "عددهای مهم کسب‌وکارتان را یک‌جا و قابل فهم ببینید.",
    note: "برای تصمیم‌گیری سریع‌تر مدیران",
    modules: ["شاخص‌های کلیدی", "گزارش زنده", "هشدارها"],
    visual: "dashboard" as ContextVisualVariant,
    icon: LayoutDashboard,
  },
  {
    name: "نوبت‌دهی",
    body: "نوبت‌ها و ظرفیت مراجعه را بدون تماس و هماهنگی‌های تکراری مدیریت کنید.",
    note: "برای کلینیک و خدمات زمان‌محور",
    modules: ["تقویم کاری", "ظرفیت روزانه", "یادآوری نوبت"],
    visual: "scheduling" as ContextVisualVariant,
    icon: CalendarDays,
  },
  {
    name: "رزرو",
    body: "رزرو آنلاین خدمات، منابع یا فضا با قوانینی که خودتان تعیین می‌کنید.",
    note: "برای فضا، اقامت یا تجهیزات",
    modules: ["موجودی و ظرفیت", "قوانین رزرو", "پرداخت آنلاین"],
    visual: "booking" as ContextVisualVariant,
    icon: CalendarDays,
  },
  {
    name: "Marketplace",
    body: "فروشنده‌ها، سفارش‌ها و تسویه‌ها را در یک پلتفرم مدیریت کنید.",
    note: "برای کسب‌وکارهای چندفروشنده",
    modules: ["پنل فروشنده", "کمیسیون", "تسویه حساب"],
    visual: "marketplace" as ContextVisualVariant,
    icon: Store,
  },
  {
    name: "سامانه گارانتی",
    body: "ثبت محصول و پیگیری گارانتی را برای مشتری ساده کنید.",
    note: "برای خدمات پس از فروش",
    modules: ["ثبت محصول", "اعتبار گارانتی", "پیگیری درخواست"],
    visual: "warranty" as ContextVisualVariant,
    icon: ShieldCheck,
  },
  {
    name: "پنل نمایندگان",
    body: "قیمت، سفارش و گزارش هر نماینده را شفاف و در دسترس کنید.",
    note: "برای شبکه فروش و توزیع",
    modules: ["لیست قیمت", "سفارش نماینده", "گزارش عملکرد"],
    visual: "dealer" as ContextVisualVariant,
    icon: UsersRound,
  },
  {
    name: "LMS",
    body: "دوره، آزمون و مسیر یادگیری را برای آموزش آنلاین کنار هم بچینید.",
    note: "برای آموزش سازمانی و آنلاین",
    modules: ["دوره‌ها", "آزمون و تمرین", "گزارش پیشرفت"],
    visual: "lms" as ContextVisualVariant,
    icon: GraduationCap,
  },
];

export function SolutionExplorer() {
  const [active, setActive] = useState(0);
  const current = systems[active]!;

  return (
    <section className="grain bg-surface-2/45 py-16 text-foreground sm:py-20">
      <Container>
        <div className="grid items-end gap-7 border-b border-border pb-8 lg:grid-cols-[1fr_auto]">
          <div>
            <MetaLabel className="text-brand">SOLUTION FINDER / 11</MetaLabel>
            <h2 className="display-2 mt-6 max-w-3xl">برای کسب‌وکارتان چه چیزی لازم دارید؟</h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-muted-foreground lg:text-end">
            یکی را انتخاب کنید تا ببینید هر راهکار چه بخش‌هایی دارد و قرار است کدام کار را برایتان
            ساده‌تر کند
          </p>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6" role="tablist">
          {systems.map((system, index) => (
            <button
              key={system.name}
              type="button"
              role="tab"
              aria-selected={active === index}
              aria-controls="solution-preview"
              onClick={() => setActive(index)}
              className={cn(
                "group relative min-h-20 border bg-surface px-4 py-3 text-start transition-[border-color,background-color,transform,box-shadow] duration-200 hover:border-brand/45",
                active === index
                  ? "-translate-y-0.5 border-2 border-brand bg-brand/[0.045] shadow-[0_8px_24px_rgba(32,191,178,0.1)]"
                  : "border-border",
              )}
            >
              <span className="flex items-center justify-between gap-3">
                <span
                  className={cn(
                    "font-latin text-[0.58rem] tracking-[0.16em]",
                    active === index ? "text-brand" : "text-muted-foreground/60",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <system.icon
                  className={cn(
                    "size-4",
                    active === index ? "text-brand" : "text-muted-foreground/50",
                  )}
                  aria-hidden
                />
              </span>
              <span className="mt-3 block text-xs font-bold leading-5 sm:text-sm">
                {system.name}
              </span>
              {active === index && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-brand" aria-hidden />
              )}
            </button>
          ))}
        </div>

        <div
          id="solution-preview"
          role="tabpanel"
          key={current.name}
          className="reveal mt-5 grid overflow-hidden rounded-xl border border-border bg-surface shadow-[0_20px_60px_rgba(15,23,42,0.06)] lg:grid-cols-[0.82fr_1.18fr]"
        >
          <div className="flex flex-col p-7 sm:p-9 lg:p-11">
            <span className="flex items-center gap-3 text-xs font-bold text-brand">
              <span className="grid size-9 place-items-center rounded-lg bg-brand/10">
                <current.icon className="size-4" aria-hidden />
              </span>
              {current.note}
            </span>

            <h3 className="mt-8 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
              {current.name}
            </h3>
            <p className="mt-5 max-w-lg text-base leading-8 text-muted-foreground">
              {current.body}
            </p>

            <div className="mt-9 border-t border-border pt-6">
              <MetaLabel className="text-muted-foreground">بخش‌های اصلی این راهکار</MetaLabel>
              <ul className="mt-4 space-y-3">
                {current.modules.map((module, index) => (
                  <li key={module} className="flex items-center gap-3 text-sm font-bold">
                    <span className="grid size-6 place-items-center rounded-full bg-brand/10 font-latin text-[0.58rem] text-brand">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {module}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto pt-9">
              <TextLink to="/solutions">جزئیات راهکارها</TextLink>
            </div>
          </div>

          <figure className="relative min-h-[360px] overflow-hidden bg-ink lg:min-h-[500px]">
            <ContextVisual
              variant={current.visual}
              title={current.name}
              items={current.modules}
              className="absolute inset-0 min-h-0 transition-transform duration-700 hover:scale-[1.015]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            <figcaption className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 border border-white/15 bg-black/30 p-4 text-white backdrop-blur-md sm:inset-x-7 sm:bottom-7">
              <span>
                <MetaLabel className="text-white/55">
                  LIVE VIEW / {String(active + 1).padStart(2, "0")}
                </MetaLabel>
                <span className="mt-2 block text-sm font-bold">نمونه‌ی تصویری {current.name}</span>
              </span>
              <span className="flex items-center gap-2 text-[0.65rem] text-white/60">
                <span className="size-2 animate-pulse rounded-full bg-emerald-400" />
                آماده بررسی
              </span>
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}

/* 6. PROJECT RESCUE ------------------------------------------------------ */

export function ProjectRescue() {
  const auditRows = [
    {
      label: "ساختار کد",
      state: "بخش‌های سالم قابل نگهداری‌اند",
      score: "۷۲٪",
      width: "72%",
      color: "bg-emerald-500",
    },
    {
      label: "زیرساخت و انتشار",
      state: "نیاز به اصلاح فوری دارد",
      score: "۴۶٪",
      width: "46%",
      color: "bg-[#7dc8ff]",
    },
    {
      label: "مسیر توسعه",
      state: "بعد از اصلاحات قابل ادامه است",
      score: "۸۴٪",
      width: "84%",
      color: "bg-sky-500",
    },
  ];

  const reviewDays = [
    { day: "روز ۱", title: "دسترسی و شناخت", icon: ScanSearch },
    { day: "روز ۲", title: "بررسی و اولویت‌بندی", icon: Route },
    { day: "روز ۳", title: "گزارش تصمیم", icon: Wrench },
  ];

  return (
    <section className="relative overflow-hidden border-y border-border bg-[#edf2ed] py-16 text-foreground dark:bg-ink dark:text-ink-foreground sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(to_right,hsl(var(--foreground)/.055)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/.055)_1px,transparent_1px)] [background-size:42px_42px] dark:opacity-15"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-32 size-[34rem] rounded-full bg-emerald-400/10 blur-[110px]"
      />
      <Container>
        <header className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <MetaLabel className="text-brand">TECHNICAL TRIAGE / 06</MetaLabel>
            <h2 className="display-2 mt-6 max-w-[18ch]">
              قبل از بازنویسی، ببینیم چه چیزی هنوز ارزش نگه‌داشتن دارد
            </h2>
          </div>
          <div className="max-w-md lg:justify-self-end">
            <p className="text-base leading-8 text-muted-foreground dark:text-white/60">
              پروژه‌ی نیمه‌کاره را با حدس جلو نمی‌بریم. اول یک گزارش روشن می‌سازیم: چه چیزی سالم
              است، خطر کجاست و کوتاه‌ترین مسیر ادامه کدام است.
            </p>
            <div className="mt-7 inline-flex">
              <CtaLink to="/technical-review">پروژه را برای بررسی بفرستید</CtaLink>
            </div>
          </div>
        </header>

        <article className="relative mt-12 overflow-hidden border border-foreground/15 bg-background shadow-[0_26px_80px_rgba(25,39,31,0.12)] dark:border-white/15 dark:bg-[#111815]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-surface-2/70 px-5 py-4 dark:border-white/10 dark:bg-white/[0.035] sm:px-8">
            <div className="flex items-center gap-4">
              <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_0_5px_rgba(16,185,129,0.12)]" />
              <span className="font-latin text-[0.64rem] tracking-[0.16em] text-muted-foreground">
                TECHNICAL REVIEW / SAMPLE REPORT
              </span>
            </div>
            <span className="font-latin text-[0.64rem] tracking-[0.14em] text-muted-foreground">
              RPT — 006
            </span>
          </div>

          <div dir="ltr" className="grid lg:grid-cols-[0.42fr_1fr]">
            <aside
              dir="rtl"
              className="flex flex-col justify-between border-b border-border bg-[#173b32] p-7 text-white lg:border-r lg:border-b-0 sm:p-10 dark:bg-[#173128]"
            >
              <div>
                <div className="grid size-16 place-items-center rounded-full border border-emerald-300/25 bg-emerald-300/10 text-emerald-200">
                  <ShieldCheck className="size-7" />
                </div>
                <MetaLabel className="mt-10 text-emerald-200/65">نتیجه‌ی نمونه</MetaLabel>
                <p className="mt-3 text-3xl leading-tight font-black sm:text-4xl">قابل نجات است</p>
                <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">
                  ادامه از نسخه‌ی فعلی منطقی است؛ به‌شرط اینکه زیرساخت انتشار و بخش‌های پرریسک اول
                  اصلاح شوند.
                </p>
              </div>
              <div className="mt-12 border-t border-white/15 pt-5">
                <p className="text-xs leading-6 text-white/50">
                  این فقط نمونه‌ی شکل گزارش است؛ نتیجه‌ی واقعی بعد از دیدن کد و دسترسی‌ها مشخص
                  می‌شود
                </p>
              </div>
            </aside>

            <div dir="rtl" className="p-6 sm:p-10 lg:p-12">
              <div className="flex flex-wrap items-end justify-between gap-5 border-b border-border pb-7 dark:border-white/10">
                <div>
                  <MetaLabel className="text-muted-foreground">وضعیت سه بخش اصلی</MetaLabel>
                  <h3 className="mt-3 text-2xl font-black sm:text-3xl">خلاصه‌ی بررسی فنی پروژه</h3>
                </div>
                <span className="border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  تصمیم قبل از هزینه
                </span>
              </div>

              <div className="divide-y divide-border dark:divide-white/10">
                {auditRows.map((row, index) => (
                  <div
                    key={row.label}
                    className="grid gap-4 py-7 sm:grid-cols-[1fr_1.4fr_auto] sm:items-center"
                  >
                    <div>
                      <span className="font-latin text-[0.6rem] text-muted-foreground">
                        0{index + 1}
                      </span>
                      <p className="mt-1 text-sm font-extrabold">{row.label}</p>
                    </div>
                    <div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-foreground/8 dark:bg-white/10">
                        <div
                          className={cn("h-full rounded-full", row.color)}
                          style={{ width: row.width }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground dark:text-white/45">
                        {row.state}
                      </p>
                    </div>
                    <span className="font-latin text-xl font-black tabular-nums">{row.score}</span>
                  </div>
                ))}
              </div>

              <div className="mt-2 border-s-4 border-brand bg-brand/8 p-5">
                <MetaLabel className="text-brand">جمع‌بندی پیشنهادی</MetaLabel>
                <p className="mt-3 text-sm leading-7">
                  نسخه‌ی فعلی نگه داشته شود، انتشار پایدار شود و بازنویسی فقط روی بخش‌های پرریسک
                  انجام بگیرد
                </p>
              </div>
            </div>
          </div>

          <footer className="grid border-t border-border bg-surface-2/55 dark:border-white/10 dark:bg-white/[0.025] sm:grid-cols-3">
            {reviewDays.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.day}
                  className="flex items-center gap-4 border-b border-border px-6 py-5 last:border-b-0 sm:border-e sm:border-b-0 sm:last:border-e-0 dark:border-white/10"
                >
                  <span className="grid size-9 place-items-center rounded-full bg-brand/10 text-brand">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <span className="text-[0.65rem] font-bold text-brand">{item.day}</span>
                    <p className="mt-1 text-sm font-extrabold">{item.title}</p>
                  </div>
                  <span className="ms-auto font-latin text-xs text-muted-foreground">
                    0{index + 1}
                  </span>
                </div>
              );
            })}
          </footer>
        </article>
      </Container>
    </section>
  );
}

/* 7. SELECTED PROJECTS -------------------------------------------------- */

const projects = [
  {
    name: "سامانه سفارش‌گیری نمایندگان",
    industry: "تولید و کارخانه",
    category: "وب‌اپ اختصاصی",
    problem: "نماینده‌ها سفارش را تلفنی و با اکسل می‌فرستادند و پیگیری‌اش سخت بود.",
    solution: "یک پنل اختصاصی برای قیمت‌گذاری، ثبت سفارش و دیدن وضعیت هر سفارش.",
    image: "/images/projects/dealer-ordering-platform.png",
    imageAlt: "نمایی مفهومی از پنل سفارش‌گیری و مدیریت نمایندگان",
    scope: ["پنل نمایندگان", "مدیریت سفارش", "گزارش وضعیت"],
    accent: "#5fe1d5",
  },
  {
    name: "بازطراحی فروشگاه اینترنتی",
    industry: "خودرو و لوازم یدکی",
    category: "فروشگاه و سئو",
    problem: "دسته‌بندی‌ها نامرتب بود و کندی سایت جلوی رشد در گوگل را گرفته بود.",
    solution: "مرتب‌کردن ساختار سایت، سریع‌تر کردن صفحات و تقویت سئوی فروشگاهی.",
    image: "/images/projects/automotive-ecommerce-redesign.png",
    imageAlt: "نمایی مفهومی از بازطراحی تجربه کاربری یک فروشگاه اینترنتی",
    scope: ["بازطراحی UX", "بهینه‌سازی سرعت", "سئوی فنی"],
    accent: "#7dc8ff",
  },
  {
    name: "پرتال خدمات پس از فروش",
    industry: "تجهیزات صنعتی",
    category: "پرتال سازمانی",
    problem: "درخواست‌های گارانتی بین تماس، پیام و کانال‌های مختلف گم می‌شد.",
    solution: "سامانه‌ای برای ثبت محصول، گارانتی و پیگیری همه درخواست‌ها در یک جا.",
    image: "/images/projects/after-sales-service-portal.png",
    imageAlt: "نمایی مفهومی از پرتال یکپارچه خدمات پس از فروش",
    scope: ["ثبت گارانتی", "تیکت پشتیبانی", "داشبورد مدیریتی"],
    accent: "#b9a7ff",
  },
];

function CaseVisual({ project, index }: { project: (typeof projects)[number]; index: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#dceff0]">
      <Image
        src={project.image}
        alt={project.imageAlt}
        fill
        className={cn(
          "object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.045]",
          index === 1 ? "object-left" : "object-center",
        )}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,35,47,0.05)_5%,rgba(2,35,47,0.2)_42%,rgba(2,30,40,0.96)_100%)]" />

      <div className="absolute inset-x-5 top-5 z-10 flex items-center gap-4 sm:inset-x-7 sm:top-7">
        <div className="flex items-center gap-1.5 rounded-full border border-white/25 bg-[#073b4c]/25 px-3 py-2 backdrop-blur-md">
          <span className="size-1.5 rounded-full" style={{ backgroundColor: project.accent }} />
          <span className="size-1.5 rounded-full bg-white/55" />
          <span className="size-1.5 rounded-full bg-white/25" />
        </div>
      </div>
    </div>
  );
}

export function SelectedProjects() {
  return (
    <Section className="relative overflow-hidden bg-white text-[#073b4c] sm:py-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 82% 12%, rgba(32,191,178,0.13), transparent 24%), radial-gradient(circle at 8% 64%, rgba(108,146,244,0.11), transparent 27%), radial-gradient(circle at 78% 82%, rgba(185,167,255,0.08), transparent 24%)",
        }}
        aria-hidden
      />

      <Container className="relative z-10">
        <div className="relative isolate overflow-hidden rounded-[1.35rem] bg-[#073b4c] px-6 py-8 text-white shadow-[0_20px_58px_rgba(17,71,83,0.14)] sm:px-9 sm:py-9 lg:px-11 lg:py-10">
          <span
            className="pointer-events-none absolute -top-40 -right-24 size-[30rem] rounded-full bg-[#20bfb2]/16 blur-3xl"
            aria-hidden
          />
          <span
            className="pointer-events-none absolute -bottom-52 left-0 size-[28rem] rounded-full border border-[#b9a7ff]/16 shadow-[0_0_0_56px_rgba(125,200,255,0.035),0_0_0_112px_rgba(185,167,255,0.022)]"
            aria-hidden
          />
          <span
            className="pointer-events-none absolute inset-0 opacity-[0.09]"
            style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,0.75) 0.7px, transparent 0.7px)",
              backgroundSize: "30px 30px",
            }}
            aria-hidden
          />

          <div className="relative grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            <div>
              <h2 className="max-w-3xl text-[clamp(1.9rem,3.4vw,3.25rem)] font-semibold leading-[1.22] tracking-[-0.03em]">
                نمونه‌کارهای منتخب
                <span className="text-[#5fe1d5]"> رای‌کد</span>
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-white/62 sm:text-base sm:leading-9">
                هر پروژه از یک چالش مشخص شروع شده و به یک محصول دیجیتال روشن، کاربردی و قابل توسعه
                رسیده است.
              </p>
            </div>

            <div className="flex flex-col items-start lg:border-r lg:border-white/12 lg:pr-10">
              <p className="text-sm font-medium leading-7 text-white/75">
                سه مسئله، سه مسیر متفاوت؛ با یک هدف مشترک: ساختن چیزی که واقعاً کار کند.
              </p>
              <Link
                href="/projects"
                className="group mt-6 inline-flex min-h-11 items-center gap-3 rounded-full border border-[#5fe1d5]/35 bg-[#5fe1d5]/10 px-6 text-sm font-semibold text-[#b9fff8] backdrop-blur-md transition-colors hover:border-[#5fe1d5]/70 hover:bg-[#5fe1d5]/18"
              >
                مشاهده همه پروژه‌ها
                <ArrowUpLeft className="size-4 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </div>
          </div>
        </div>

        <ol className="mt-5 grid grid-cols-12 gap-4 sm:gap-5">
          {projects.map((project, index) => (
            <li
              key={project.name}
              className={cn(
                "col-span-12",
                index === 0 && "lg:col-span-7",
                index === 1 && "lg:col-span-5",
                index === 2 && "lg:col-span-12",
              )}
            >
              <article
                className={cn(
                  "group relative isolate flex min-h-[460px] overflow-hidden rounded-[1.2rem] border border-[#073b4c]/10 shadow-[0_16px_48px_rgba(17,71,83,0.1)] sm:min-h-[520px]",
                  index === 2 && "lg:min-h-[440px]",
                )}
              >
                <CaseVisual project={project} index={index + 1} />

                <div
                  className={cn(
                    "relative z-10 mt-auto w-full p-5 sm:p-8",
                    index === 2 && "lg:grid lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-12",
                  )}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-[0.65rem] font-semibold tracking-[0.08em] text-white/65">
                      <span
                        className="rounded-full border px-3 py-1.5 backdrop-blur-md"
                        style={{
                          borderColor: `${project.accent}66`,
                          backgroundColor: `${project.accent}18`,
                          color: project.accent,
                        }}
                      >
                        {project.category}
                      </span>
                      <span className="rounded-full border border-white/20 bg-white/8 px-3 py-1.5 backdrop-blur-md">
                        {project.industry}
                      </span>
                    </div>
                    <h3 className="mt-4 text-[clamp(1.4rem,2.2vw,2.2rem)] font-semibold leading-[1.35] tracking-[-0.025em] text-white">
                      {project.name}
                    </h3>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-white/64">
                      {project.problem}
                    </p>
                  </div>

                  <div className={cn("mt-6", index === 2 && "lg:mt-0")}>
                    <p
                      className="max-w-2xl border-r-2 pr-4 text-sm font-medium leading-7 text-white/88"
                      style={{ borderColor: `${project.accent}b3` }}
                    >
                      {project.solution}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                      {project.scope.map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center gap-2 text-[0.67rem] text-white/55"
                        >
                          <span
                            className="size-1 rounded-full"
                            style={{ backgroundColor: project.accent }}
                          />
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <span
                  className="absolute inset-x-0 top-0 z-20 h-0.5 origin-right scale-x-0 transition-transform duration-700 group-hover:scale-x-100"
                  style={{ backgroundColor: project.accent }}
                  aria-hidden
                />
              </article>
            </li>
          ))}
        </ol>

        <div className="mt-8 border-t border-[#073b4c]/10 pt-6 text-xs leading-6 text-[#52717b]">
          <p>
            تصاویر و سناریوهای این بخش مفهومی‌اند؛ نمونه‌های واقعی فقط با اجازه مشتری منتشر می‌شوند.
          </p>
        </div>
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
          <ContextVisual
            variant="connected"
            title="سیستم‌های متصل برای کسب‌وکار"
            items={["عملیات", "داده", "مشتری"]}
            className="absolute inset-0 min-h-0 opacity-75"
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
    title: "اول مطمئن می‌شویم مسئله درست را حل می‌کنیم",
    body: "هدف کسب‌وکار، کاربران و وضعیت فعلی را بررسی می‌کنیم تا پروژه با یک فهرست امکانات پراکنده شروع نشود.",
    note: "تعریف مسئله و اولویت‌ها",
    icon: ScanSearch,
    accent: "#5fe1d5",
    layout: "lg:col-span-7 lg:min-h-[370px]",
    featured: true,
  },
  {
    title: "دامنه، اولویت و تحویل‌ها از ابتدا روشن‌اند",
    body: "مشخص می‌کنیم چه چیزی ساخته می‌شود، چه چیزی فعلاً خارج از دامنه است و هر مرحله با چه خروجی‌ای تحویل خواهد شد.",
    note: "مسیر روشن، دوباره‌کاری کمتر",
    icon: ClipboardList,
    accent: "#7dc8ff",
    layout: "lg:col-span-5 lg:min-h-[370px]",
  },
  {
    title: "پروژه را مرحله‌ای و قابل دیدن جلو می‌بریم",
    body: "به‌جای یک رونمایی غافلگیرکننده در پایان، نسخه‌های قابل بررسی می‌بینید و بازخوردها زودتر وارد محصول می‌شوند.",
    note: "بازبینی در طول مسیر",
    icon: Route,
    accent: "#796fe8",
    layout: "lg:col-span-4 lg:min-h-[320px]",
  },
  {
    title: "برای بازنویسی و تکنولوژی خاص تعصب نداریم",
    body: "اگر سیستم فعلی قابل نجات باشد، همان را بهتر می‌کنیم. ابزار را بر اساس مسئله، هزینه نگهداری و آینده محصول انتخاب می‌کنیم.",
    note: "راه‌حل متناسب، نه پرهزینه‌تر",
    icon: Wrench,
    accent: "#4eaf8e",
    layout: "lg:col-span-4 lg:min-h-[320px]",
  },
  {
    title: "کد، داده و دسترسی‌ها متعلق به شماست",
    body: "مخزن کد، حساب‌های اصلی، دامنه و مستندات تحویل می‌شوند تا کسب‌وکار شما به حساب شخصی یا حضور یک نفر وابسته نماند.",
    note: "بدون قفل‌شدن به مجری",
    icon: ShieldCheck,
    accent: "#d06f9a",
    layout: "lg:col-span-4 lg:min-h-[320px]",
  },
  {
    title: "انتشار، پایان پروژه نیست؛ شروع یادگیری است",
    body: "بعد از راه‌اندازی می‌توانیم پایش، رفع مشکل و توسعه مرحله بعد را ادامه دهیم تا محصول با نیازهای واقعی کسب‌وکار رشد کند.",
    note: "پشتیبانی و توسعه ادامه‌دار",
    icon: Headphones,
    accent: "#5a86d6",
    layout: "lg:col-span-12 lg:min-h-[270px]",
  },
];

export function WhyRycode() {
  return (
    <Section className="relative overflow-hidden bg-white text-[#073b4c] sm:py-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "radial-gradient(circle at 88% 18%, rgba(95,225,213,0.13), transparent 24%), radial-gradient(circle at 10% 56%, rgba(125,200,255,0.11), transparent 27%), radial-gradient(circle at 72% 88%, rgba(185,167,255,0.09), transparent 22%)",
        }}
        aria-hidden
      />

      <Container className="relative z-10">
        <div className="grid gap-8 border-b border-[#073b4c]/12 pb-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div>
            <h2 className="max-w-4xl text-[clamp(1.95rem,3.5vw,3.3rem)] font-semibold leading-[1.22] tracking-[-0.03em]">
              کمتر حدس می‌زنیم.
              <span className="block text-[#159f96]">بیشتر روشن می‌کنیم.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-8 text-[#52717b] sm:text-base sm:leading-9">
              تفاوت یک همکاری خوب فقط در کدی که تحویل می‌شود نیست؛ در تصمیم‌های روشن، ریسک کمتر و
              محصولی است که بعداً هم بتوان آن را فهمید و توسعه داد.
            </p>
          </div>

          <div className="rounded-2xl border border-[#0b5262]/12 bg-white/70 p-6 shadow-[0_18px_50px_rgba(31,92,105,0.08)] backdrop-blur-md sm:p-7">
            <ul className="space-y-4 text-sm font-medium text-[#214f5b]">
              {["خروجی‌های قابل بازبینی", "تصمیم‌ها و دامنه مستند", "مالکیت و دسترسی شفاف"].map(
                (item, index) => (
                  <li key={item} className="flex items-center gap-3">
                    <span
                      className={cn(
                        "grid size-7 shrink-0 place-items-center rounded-full text-[0.65rem] font-bold",
                        index === 0 && "bg-[#5fe1d5]/18 text-[#0b766e]",
                        index === 1 && "bg-[#7dc8ff]/20 text-[#276f9f]",
                        index === 2 && "bg-[#b9a7ff]/22 text-[#6657b8]",
                      )}
                    >
                      ✓
                    </span>
                    {item}
                  </li>
                ),
              )}
            </ul>
            <CtaLink
              to="/start-project"
              variant="outline"
              className="mt-7 !rounded-full !border-[#20bfb2]/45 !bg-[#20bfb2]/8 !text-[#0b766e] hover:!border-[#20bfb2]/80 hover:!bg-[#20bfb2]/14"
            >
              درباره پروژه صحبت کنیم
            </CtaLink>
          </div>
        </div>

        <ol className="mt-8 grid grid-cols-12 gap-4">
          {whyItems.map((item, index) => (
            <li key={item.title} className={cn("col-span-12", item.layout)}>
              <article
                className={cn(
                  "group relative isolate flex h-full min-h-[290px] flex-col overflow-hidden rounded-xl border p-6 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 sm:p-7",
                  item.featured
                    ? "border-white/10 bg-[#073b4c] text-white shadow-[0_24px_70px_rgba(7,59,76,0.2)]"
                    : "border-[#0b5262]/12 bg-white/72 text-[#073b4c] shadow-[0_14px_44px_rgba(31,92,105,0.08)] backdrop-blur-md hover:shadow-[0_24px_65px_rgba(31,92,105,0.14)]",
                )}
                style={{ borderTopColor: item.accent }}
              >
                {item.featured && (
                  <>
                    <ContextVisual
                      variant="software"
                      title={item.title}
                      decorative
                      className="absolute inset-0 -z-10 min-h-0 opacity-30 transition-transform duration-1000 group-hover:scale-[1.025]"
                    />
                    <span
                      className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(7,59,76,0.16),rgba(7,40,52,0.94))]"
                      aria-hidden
                    />
                  </>
                )}

                {!item.featured && (
                  <span
                    className="pointer-events-none absolute -top-20 -left-16 -z-10 size-56 rounded-full blur-3xl"
                    style={{ backgroundColor: `${item.accent}18` }}
                    aria-hidden
                  />
                )}

                <div className="flex items-start gap-5">
                  <span
                    className="grid size-11 place-items-center rounded-xl border backdrop-blur-md"
                    style={{
                      borderColor: `${item.accent}59`,
                      backgroundColor: `${item.accent}18`,
                      color: item.accent,
                    }}
                  >
                    <item.icon className="size-5" aria-hidden />
                  </span>
                </div>

                <div className={cn("mt-auto pt-12", index === 5 && "lg:max-w-4xl")}>
                  <h3 className="max-w-xl text-lg font-bold leading-8 sm:text-xl">{item.title}</h3>
                  <p
                    className={cn(
                      "mt-4 max-w-2xl text-sm leading-8",
                      item.featured ? "text-white/66" : "text-[#52717b]",
                    )}
                  >
                    {item.body}
                  </p>
                  <span
                    className={cn(
                      "mt-6 inline-flex rounded-full border px-3 py-1.5 text-[0.68rem] font-semibold",
                      item.featured ? "bg-white/6" : "bg-white/65",
                    )}
                    style={{ borderColor: `${item.accent}55`, color: item.accent }}
                  >
                    {item.note}
                  </span>
                </div>

                <span
                  className="absolute inset-x-0 top-0 h-0.5 origin-right scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                  style={{ backgroundColor: item.accent }}
                  aria-hidden
                />
              </article>
            </li>
          ))}
        </ol>
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
  const paymentStages = [
    {
      title: "شروع و تعریف دامنه",
      description: "نیازسنجی، اولویت‌ها و برنامه اجرای پروژه",
      icon: ScanSearch,
      accent: "#5fe1d5",
    },
    {
      title: "طراحی و نمونه اولیه",
      description: "مسیرها، وایرفریم و رابط قابل بررسی",
      icon: Waypoints,
      accent: "#7dc8ff",
    },
    {
      title: "توسعه و تست",
      description: "نسخه قابل اجرا، اتصال‌ها و رفع ایراد",
      icon: Blocks,
      accent: "#b9a7ff",
    },
    {
      title: "انتشار و تحویل",
      description: "راه‌اندازی، دسترسی‌ها و مستندات نهایی",
      icon: ShieldCheck,
      accent: "#9be7a8",
    },
  ];

  return (
    <Section className="bg-white py-8 text-[#073b4c] sm:py-14">
      <Container>
        <div className="relative isolate overflow-hidden rounded-[1.5rem] bg-[#073b4c] px-5 py-8 text-white shadow-[0_22px_64px_rgba(7,59,76,0.14)] sm:px-8 sm:py-9 lg:px-10 lg:py-10">
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 88% 8%, rgba(95,225,213,0.2), transparent 28%), radial-gradient(circle at 8% 100%, rgba(125,200,255,0.18), transparent 31%), radial-gradient(circle at 64% 110%, rgba(185,167,255,0.12), transparent 26%)",
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
              backgroundSize: "42px 42px",
              maskImage: "linear-gradient(to bottom, black, transparent 80%)",
            }}
            aria-hidden
          />

          <div className="grid gap-9 lg:grid-cols-[1.12fr_0.88fr] lg:items-center lg:gap-14">
            <div>
              <h2 className="max-w-[18ch] text-[clamp(1.8rem,3.5vw,3.35rem)] font-bold leading-[1.2] tracking-[-0.03em]">
                پروژه را مرحله‌ای جلو ببرید،
                <span className="mt-1 block text-[#5fe1d5]">هزینه را هم مرحله‌ای پرداخت کنید.</span>
              </h2>
              <p className="mt-6 max-w-2xl text-sm leading-8 text-white/72 sm:text-base sm:leading-9">
                برای پروژه‌های واجد شرایط، مبلغ براساس فازهای واقعی کار تقسیم می‌شود. پیش از شروع،
                خروجی هر مرحله، زمان تحویل و مبلغ همان مرحله در پیشنهاد همکاری مشخص است.
              </p>

              <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <CtaLink
                  to="/start-project"
                  className="h-12 rounded-xl bg-[#5fe1d5] px-6 text-[#073b4c] shadow-[0_14px_35px_rgba(95,225,213,0.2)] hover:bg-[#7aebe1] focus-visible:outline-[#5fe1d5]"
                >
                  بررسی شرایط پرداخت پروژه
                </CtaLink>
                <p className="max-w-[30ch] text-xs leading-6 text-white/48">
                  شرایط نهایی پس از بررسی دامنه و زمان‌بندی پروژه مشخص می‌شود.
                </p>
              </div>
            </div>

            <div className="rounded-[1.2rem] border border-white/12 bg-white/[0.07] p-5 shadow-xl backdrop-blur-xl sm:p-6">
              <div className="flex items-start gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#5fe1d5] text-[#073b4c] shadow-[0_10px_30px_rgba(95,225,213,0.22)]">
                  <ClipboardList className="size-6" aria-hidden />
                </span>
                <div>
                  <h3 className="text-lg font-extrabold leading-8 sm:text-xl">
                    هر پرداخت، بعد از یک خروجی قابل بررسی
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-white/58">
                    مسیر مالی پروژه همان‌قدر روشن است که مسیر اجرا.
                  </p>
                </div>
              </div>

              <ul className="mt-7 space-y-3 border-t border-white/10 pt-6 text-sm font-semibold text-white/82">
                {[
                  "خروجی هر مرحله از قبل مشخص است",
                  "پیش از ادامه، نتیجه را بررسی می‌کنید",
                  "مبلغ و زمان‌بندی به‌صورت مکتوب ثبت می‌شود",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#5fe1d5]/15 text-[#5fe1d5]">
                      <span className="size-1.5 rounded-full bg-current" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-2 lg:grid-cols-4">
            {paymentStages.map((stage) => {
              const Icon = stage.icon;

              return (
                <div
                  key={stage.title}
                  className="group rounded-[1.25rem] border border-white/10 bg-white/[0.055] p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.09]"
                >
                  <div className="mb-8 flex items-center justify-between">
                    <span
                      className="grid size-10 place-items-center rounded-xl border border-white/10"
                      style={{ color: stage.accent, backgroundColor: `${stage.accent}14` }}
                    >
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="h-px w-12 bg-gradient-to-l from-white/25 to-transparent" />
                  </div>
                  <h3 className="text-base font-extrabold">{stage.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/55">{stage.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* 12. BLOG --------------------------------------------------------------- */

const sampleArticles = [
  {
    title: "قبل از شروع طراحی سایت، به این ۷ سؤال جواب دهید",
    excerpt:
      "از هدف اصلی سایت و مخاطب گرفته تا محتوا، امکانات و معیار موفقیت؛ تصمیم‌هایی که پیش از طراحی، مسیر پروژه را روشن می‌کنند.",
    category: "استراتژی دیجیتال",
    readTime: "۶ دقیقه مطالعه",
    date: "۲۸ شهریور ۱۴۰۵",
    image: "/images/editorial/web-experience.png",
    imageAlt: "ساختار مفهومی برنامه‌ریزی یک وب‌سایت حرفه‌ای",
    accent: "#20bfb2",
  },
  {
    title: "نرم‌افزار اختصاصی یا ابزار آماده؛ کدام انتخاب بهتری است؟",
    excerpt:
      "همه کسب‌وکارها به نرم‌افزار اختصاصی نیاز ندارند. هزینه، سرعت اجرا، محدودیت‌ها و مسیر رشد هر انتخاب را مقایسه می‌کنیم.",
    category: "محصول و فناوری",
    readTime: "۸ دقیقه مطالعه",
    date: "۲۰ شهریور ۱۴۰۵",
    image: "/images/editorial/data-dashboard.png",
    imageAlt: "نمایی مفهومی از اجزای یک نرم‌افزار و انتخاب ابزار مناسب",
    accent: "#6c92f4",
  },
  {
    title: "چرا پروژه‌های نرم‌افزاری نیمه‌کاره می‌مانند؟",
    excerpt:
      "دامنه نامشخص، تحویل دیرهنگام و وابستگی به یک نفر از نشانه‌های خطرند؛ ببینیم چطور می‌شود قبل از توقف پروژه آن‌ها را کنترل کرد.",
    category: "مدیریت پروژه",
    readTime: "۷ دقیقه مطالعه",
    date: "۱۲ شهریور ۱۴۰۵",
    visual: "recovery" as ContextVisualVariant,
    accent: "#b07ce8",
  },
];

export function BlogSection() {
  return (
    <Section className="relative overflow-hidden bg-white text-[#073b4c] sm:py-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-75"
        style={{
          backgroundImage:
            "radial-gradient(circle at 88% 18%, rgba(32,191,178,0.1), transparent 23%), radial-gradient(circle at 8% 82%, rgba(176,124,232,0.08), transparent 24%)",
        }}
        aria-hidden
      />

      <Container className="relative z-10">
        <div className="flex flex-col gap-7 border-b border-[#073b4c]/12 pb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="max-w-4xl text-[clamp(1.95rem,3.5vw,3.3rem)] font-semibold leading-[1.22] tracking-[-0.03em]">
              تجربه‌هایی برای ساختن
              <span className="block text-[#159f96]">تصمیم‌های بهتر.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-8 text-[#52717b] sm:text-base sm:leading-9">
              یادداشت‌هایی کاربردی درباره طراحی، توسعه، سئو و مدیریت محصول؛ برآمده از مسئله‌هایی که
              در پروژه‌های دیجیتال تکرار می‌شوند.
            </p>
          </div>
          <Link
            href="/blog"
            className="group inline-flex min-h-11 w-fit items-center gap-3 rounded-full border border-[#20bfb2]/45 bg-white/75 px-6 text-sm font-semibold text-[#0b766e] shadow-[0_10px_30px_rgba(31,92,105,0.08)] transition-colors hover:border-[#20bfb2]/80 hover:bg-white"
          >
            همه مقاله‌ها
            <ArrowUpLeft className="size-4 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>

        <ol className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {sampleArticles.map((article, index) => (
            <li key={article.title} className={cn(index === 2 && "md:col-span-2 lg:col-span-1")}>
              <article className="h-full">
                <Link
                  href="/blog"
                  className="group flex h-full min-h-[480px] flex-col overflow-hidden rounded-xl border border-[#0b5262]/12 bg-white/78 shadow-[0_12px_36px_rgba(31,92,105,0.075)] backdrop-blur-md transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_52px_rgba(31,92,105,0.12)]"
                  style={{ borderTopColor: article.accent }}
                >
                  <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-[#eaf3f4]">
                    {"image" in article ? (
                      <Image
                        src={article.image}
                        alt={article.imageAlt ?? article.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.045]"
                      />
                    ) : (
                      <ContextVisual
                        variant={article.visual}
                        title={article.title}
                        className="absolute inset-0 min-h-0 transition-transform duration-700 group-hover:scale-[1.025]"
                      />
                    )}
                    <span className="absolute inset-0 bg-gradient-to-t from-[#073b4c]/38 via-transparent to-transparent" />
                    <span
                      className="absolute top-4 right-4 rounded-full border bg-[#073b4c]/35 px-3 py-1.5 text-[0.65rem] font-semibold text-white backdrop-blur-md"
                      style={{ borderColor: `${article.accent}80` }}
                    >
                      {article.category}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <div className="flex items-center justify-between gap-4 text-[0.68rem] text-[#52717b]">
                      <span>{article.date}</span>
                      <span>{article.readTime}</span>
                    </div>
                    <h3 className="mt-5 text-lg font-bold leading-8 tracking-[-0.015em] text-[#073b4c] sm:text-xl">
                      {article.title}
                    </h3>
                    <p className="mt-4 text-sm leading-8 text-[#52717b]">{article.excerpt}</p>

                    <span
                      className="mt-auto flex items-center justify-between gap-4 border-t border-[#073b4c]/10 pt-6 text-sm font-semibold"
                      style={{ color: article.accent }}
                    >
                      خواندن مقاله
                      <span
                        className="grid size-9 place-items-center rounded-full border transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1"
                        style={{ borderColor: `${article.accent}66` }}
                      >
                        <ArrowUpLeft className="size-4" />
                      </span>
                    </span>
                  </div>
                </Link>
              </article>
            </li>
          ))}
        </ol>

        <p className="mt-6 text-xs leading-6 text-[#52717b]">
          این نوشته‌ها نمونه محتوایی هستند و در نسخه نهایی با مقاله‌های منتشرشده جایگزین می‌شوند.
        </p>
      </Container>
    </Section>
  );
}

/* 13. FAQ ---------------------------------------------------------------- */

const faqs = [
  {
    q: "پروژه‌ای که نیمه‌کاره مانده را هم قبول می‌کنید؟",
    a: "بله. اول کد، دسترسی‌ها و زیرساخت را بررسی می‌کنیم؛ بعد صادقانه می‌گوییم ادامه دادن همین مسیر بهتر است یا باید بخشی از آن را دوباره ساخت.",
    accent: "#20bfb2",
  },
  {
    q: "هزینه پروژه را چطور حساب می‌کنید؟",
    a: "بعد از اینکه درباره نیاز و دامنه کار به جمع‌بندی رسیدیم، زمان و هزینه را شفاف اعلام می‌کنیم. پروژه‌های بزرگ‌تر را هم می‌شود مرحله‌ای جلو برد.",
    accent: "#6c92f4",
  },
  {
    q: "برای شروع همکاری چه چیزهایی لازم است؟",
    a: "یک توضیح کوتاه از مسئله، هدف کسب‌وکار و امکاناتی که در ذهن دارید کافی است. اگر مستندات، طرح یا سیستم فعلی دارید بررسی می‌کنیم؛ اگر هم ندارید، مسیر را از جلسه شناخت شروع می‌کنیم.",
    accent: "#b07ce8",
  },
  {
    q: "مدت زمان اجرای پروژه چقدر است؟",
    a: "به دامنه، پیچیدگی و آماده‌بودن محتوا بستگی دارد. پیش از شروع، پروژه را به فازهای مشخص تقسیم می‌کنیم و زمان تقریبی تحویل هر فاز را در برنامه اجرا می‌نویسیم.",
    accent: "#55bfe0",
  },
  {
    q: "کد و دسترسی‌ها برای چه کسی است؟",
    a: "برای شماست. کد، دسترسی‌ها، دیتابیس و دامنه در پایان پروژه کامل و شفاف تحویل داده می‌شود.",
    accent: "#45c879",
  },
  {
    q: "بعد از تحویل هم کمک می‌کنید؟",
    a: "بله. می‌توانیم نگهداری، رفع مشکل و توسعه‌های بعدی را به‌صورت مستمر یا موردی کنار شما ادامه بدهیم.",
    accent: "#e6b85c",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  const items = faqs;

  return (
    <Section className="relative overflow-hidden bg-white py-16 text-[#073b4c] sm:py-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "radial-gradient(circle at 92% 6%, rgba(32,191,178,0.1), transparent 25%), radial-gradient(circle at 4% 92%, rgba(108,146,244,0.08), transparent 27%)",
        }}
        aria-hidden
      />

      <Container className="relative z-10">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <span className="inline-flex items-center gap-3 rounded-full border border-[#20bfb2]/20 bg-[#20bfb2]/8 px-4 py-2 text-xs font-bold text-[#0a8f86]">
              <span className="size-2 rounded-full bg-[#20bfb2] shadow-[0_0_0_5px_rgba(32,191,178,0.12)]" />
              پاسخ روشن، پیش از شروع همکاری
            </span>

            <h2 className="mt-6 max-w-[14ch] text-[clamp(2rem,3.6vw,3.55rem)] font-bold leading-[1.2] tracking-[-0.03em]">
              چیزهایی که معمولاً از ما می‌پرسید.
            </h2>
            <p className="mt-6 max-w-md text-base leading-9 text-[#52717b]">
              درباره روند کار، هزینه، مالکیت و ادامه مسیر؛ جواب کوتاه و شفاف سؤال‌های رایج را اینجا
              ببینید.
            </p>

            <div className="mt-8 rounded-[1.2rem] border border-[#073b4c]/10 bg-[#effbf9] p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#073b4c] text-[#5fe1d5]">
                  <Headphones className="size-5" aria-hidden />
                </span>
                <div>
                  <h3 className="font-extrabold">سؤال دیگری در ذهن دارید؟</h3>
                  <p className="mt-2 text-sm leading-7 text-[#52717b]">
                    مسئله‌تان را بگویید؛ مستقیم و بدون پیچیدگی راهنمایی‌تان می‌کنیم.
                  </p>
                </div>
              </div>
              <CtaLink
                to="/start-project"
                variant="outline"
                className="mt-5 h-11 w-full rounded-xl border-[#073b4c]/15 bg-white text-[#073b4c] hover:border-[#20bfb2] hover:bg-[#20bfb2]/8"
              >
                مطرح کردن سؤال
              </CtaLink>
            </div>
          </div>

          <div className="space-y-3">
            {items.map((f, i) => (
              <div
                key={f.q}
                className={cn(
                  "overflow-hidden rounded-xl border bg-white transition-[border-color,box-shadow,transform] duration-300",
                  open === i
                    ? "-translate-y-0.5 border-[#073b4c]/16 shadow-[0_20px_60px_rgba(7,59,76,0.09)]"
                    : "border-[#073b4c]/10 hover:border-[#073b4c]/20",
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="group flex w-full items-center gap-4 px-5 py-5 text-start sm:gap-5 sm:px-6 sm:py-6"
                  aria-expanded={open === i}
                  aria-controls={`faq-answer-${i}`}
                >
                  <span
                    className="grid size-10 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-105"
                    style={{ color: f.accent, backgroundColor: `${f.accent}14` }}
                  >
                    <span
                      className="size-2 rounded-full bg-current"
                      style={{ boxShadow: `0 0 0 5px ${f.accent}1f` }}
                    />
                  </span>
                  <span
                    className={cn(
                      "flex-1 text-base font-extrabold leading-8 transition-colors sm:text-lg",
                      open === i ? "text-[#073b4c]" : "text-[#214f5c]",
                    )}
                  >
                    {f.q}
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "relative grid size-10 shrink-0 place-items-center rounded-full border transition-all duration-300",
                      open === i
                        ? "rotate-45 border-[#073b4c] bg-[#073b4c] text-white"
                        : "border-[#073b4c]/14 bg-[#f4f9f8] text-[#073b4c] group-hover:border-[#20bfb2] group-hover:text-[#0a9b90]",
                    )}
                  >
                    <span className="absolute h-px w-4 bg-current" />
                    <span className="absolute h-4 w-px bg-current" />
                  </span>
                </button>
                {open === i && (
                  <div id={`faq-answer-${i}`} className="px-5 pb-6 sm:px-7 sm:pb-7">
                    <p className="mr-14 border-t border-[#073b4c]/8 pt-5 text-sm leading-8 text-[#52717b] sm:mr-16 sm:text-base sm:leading-9">
                      {f.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* 14. FINAL CTA ---------------------------------------------------------- */

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-white py-14 text-foreground dark:bg-ink dark:text-ink-foreground sm:py-16">
      <div className="absolute inset-0 opacity-80 [background-image:radial-gradient(circle_at_82%_18%,rgba(95,225,213,0.14),transparent_28%),radial-gradient(circle_at_18%_88%,rgba(125,200,255,0.11),transparent_30%)]" />
      <div className="absolute inset-0 bg-gradient-to-l from-background/40 via-background/85 to-background dark:from-ink/40 dark:via-ink/85 dark:to-ink" />
      <Container>
        <div className="relative">
          <h2 className="display-1 max-w-[15ch]">
            یه پروژه توی ذهنتونه؟
            <br />
            یا یه <span className="text-brand">مشکل</span> که باید حل بشه؟
          </h2>
          <div className="mt-10 flex flex-wrap items-center gap-7 border-t border-border pt-8 dark:border-white/12">
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
