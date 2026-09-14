"use client";

import { useState } from "react";
import Image from "next/image";
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
    { fa: "طراحی وب", en: "WEB" },
    { fa: "فروشگاه اینترنتی", en: "ECOMMERCE" },
    { fa: "نرم‌افزار اختصاصی", en: "SOFTWARE" },
    { fa: "یکپارچه‌سازی", en: "INTEGRATION" },
    { fa: "سئو", en: "SEO" },
    { fa: "پشتیبانی", en: "SUPPORT" },
  ];
  return (
    <div className="border-b border-border bg-surface">
      <Container className="grid gap-8 py-8 lg:grid-cols-[0.75fr_1.5fr_0.75fr] lg:items-center">
        <div>
          <MetaLabel className="text-muted-foreground">WHAT WE SHIP</MetaLabel>
          <p className="mt-2 text-sm text-muted-foreground">از یک صفحه‌ی ساده تا یک سیستم کامل.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {items.map((item, i) => (
            <span
              key={item.en}
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 transition-colors hover:border-brand hover:bg-brand-soft"
            >
              <span className="grid size-5 place-items-center rounded-full bg-foreground text-[0.6rem] font-bold text-background transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm font-bold">{item.fa}</span>
            </span>
          ))}
        </div>
        <div className="hidden justify-self-end text-end lg:block">
          <MetaLabel className="text-brand">SYSTEM STATUS</MetaLabel>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="size-2 rounded-full bg-emerald-500" />
            آماده‌ی شروع یک پروژه
          </div>
        </div>
      </Container>
    </div>
  );
}

/* 3. CUSTOMER PATH SELECTOR -------------------------------------------- */

const paths = [
  {
    key: "build",
    title: "می‌خوام یه چیز درست‌وحسابی بسازم",
    body: "ایده‌تان سایت، فروشگاه یا نرم‌افزار است؟ کمک می‌کنیم از دل ایده به یک محصول قابل استفاده برسید.",
    cta: { label: "بریم سراغش", to: "/start-project" as const },
  },
  {
    key: "fix",
    title: "پروژه‌مون یه جایی گیر کرده",
    body: "سایت کند شده، خطا می‌دهد یا برنامه‌نویس قبلی رفته؟ اول می‌بینیم چه چیزی قابل نجات است، بعد تصمیم می‌گیریم.",
    cta: { label: "بررسیش کنیم", to: "/technical-review" as const },
  },
  {
    key: "grow",
    title: "می‌خوام مشتری بیشتری پیدامون کنه",
    body: "محصول خوبی دارید اما در جست‌وجو دیده نمی‌شوید؟ از سئوی فنی و محتوایی شروع می‌کنیم و قدم‌به‌قدم جلو می‌رویم.",
    cta: { label: "ببینیم چه می‌شود کرد", to: "/services" as const },
  },
];

export function PathSelector() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <Section className="grain">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-20">
          <div>
            <Eyebrow>مسیر شما</Eyebrow>
            <SectionTitle>از کجا شروع کنیم؟</SectionTitle>
            <Lead>
              لازم نیست اسم فنی مسئله‌تان را بدانید؛ فقط بگویید چه می‌خواهید بسازید یا کجای کار گیر
              کرده‌اید.
            </Lead>
          </div>
          <PathVisual />
        </div>
      </Container>

      <div className="mt-16 border-t border-border">
        {paths.map((p, i) => (
          <Link
            key={p.key}
            href={p.cta.to}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
            className={cn(
              "group block border-b border-border transition-colors duration-300",
              active === i ? "bg-surface" : "bg-transparent",
            )}
          >
            <Container className="flex flex-col gap-5 py-10 sm:py-14 lg:flex-row lg:items-center lg:gap-12">
              <MetaLabel index={i + 1} className="text-muted-foreground lg:w-20" />
              <h3 className="display-3 flex-1">{p.title}</h3>
              <p
                className={cn(
                  "max-w-md text-sm leading-8 text-muted-foreground transition-opacity duration-300 lg:opacity-0",
                  active === i && "lg:opacity-100",
                )}
              >
                {p.body}
              </p>
              <ArrowSquare active={active === i} />
            </Container>
          </Link>
        ))}
      </div>
    </Section>
  );
}

function PathVisual() {
  return (
    <div className="relative overflow-hidden rounded-[1.5rem] border border-border bg-ink p-3 text-ink-foreground shadow-xl">
      <div className="relative aspect-[16/7] overflow-hidden rounded-[1rem]">
        <Image
          src="/images/rycode-project-rescue.png"
          alt="ساختار بصری مسیر حل مسئله و ساخت محصول"
          fill
          className="object-cover object-center opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ink/80 via-transparent to-brand/20" />
        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4">
          <div>
            <MetaLabel className="text-brand">ONE CLEAR PATH</MetaLabel>
            <p className="mt-1 text-sm text-white/80">هر پروژه، مسیر خودش را دارد.</p>
          </div>
          <span className="grid size-10 place-items-center rounded-full bg-brand text-brand-foreground">
            ↗
          </span>
        </div>
      </div>
    </div>
  );
}

/* 4. SERVICES INDEX ----------------------------------------------------- */

const pillars = [
  {
    title: "طراحی و توسعه وب",
    body: "سایت شرکتی، فروشگاه یا وب‌اپی که از روز اول درست، سریع و آماده رشد ساخته شود.",
  },
  {
    title: "نرم‌افزار اختصاصی",
    body: "وقتی نرم‌افزار آماده کارتان را راه نمی‌اندازد، پنل و ابزار خودتان را می‌سازیم.",
  },
  {
    title: "نجات و توسعه پروژه",
    body: "پروژه‌ای را که رها شده تحویل می‌گیریم و از همان‌جایی که مانده جلو می‌رویم.",
  },
  {
    title: "API و یکپارچه‌سازی",
    body: "سیستم‌های پراکنده‌تان را به هم وصل می‌کنیم تا اطلاعات دوباره‌کاری نشود.",
  },
  { title: "سئو و رشد", body: "کمک می‌کنیم آدم‌هایی که دنبال شما هستند، راحت‌تر پیدایتان کنند." },
  {
    title: "داده و ابزارهای کسب‌وکار",
    body: "داده‌ها را از چند فایل و سیستم جمع می‌کنیم تا تصمیم‌گیری راحت‌تر شود.",
  },
  {
    title: "پشتیبانی و توسعه مستمر",
    body: "بعد از تحویل هم برای نگهداری و بهتر شدن محصول کنار شما می‌مانیم.",
  },
];

export function ServicesEditorial() {
  return (
    <Section className="bg-surface">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.6fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <MetaLabel className="text-muted-foreground">SERVICES / 07</MetaLabel>
            <h2 className="display-2 mt-6">خدمات رای‌کد</h2>
            <p className="mt-6 max-w-sm text-base leading-8 text-muted-foreground">
              هر کدام از این خدمات را می‌توانید جداگانه بردارید یا کنار هم پیش ببرید؛ بستگی دارد
              الان کجای مسیر باشید.
            </p>
            <div className="visual-card relative mt-8 aspect-[1.5/1] overflow-hidden bg-ink">
              <Image
                src="/images/rycode-product-system.png"
                alt="ترکیب چند لایه‌ی طراحی و توسعه برای ساخت محصول"
                fill
                className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between">
                <MetaLabel className="text-brand">STACK / 07</MetaLabel>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70 backdrop-blur-sm">
                  یک تیم، چند تخصص
                </span>
              </div>
            </div>
            <div className="mt-8">
              <TextLink to="/services">همه خدمات</TextLink>
            </div>
          </div>

          <ul className="border-t border-border">
            {pillars.map((p, i) => (
              <li key={p.title}>
                <Link
                  href="/services"
                  className="group flex items-center gap-6 border-b border-border py-8 transition-colors hover:bg-background"
                >
                  <MetaLabel index={i + 1} className="text-muted-foreground" />
                  <span className="flex-1">
                    <span className="block text-xl font-bold sm:text-2xl">{p.title}</span>
                    <span className="mt-2 block max-w-lg text-sm leading-7 text-muted-foreground">
                      {p.body}
                    </span>
                  </span>
                  <ArrowSquare />
                </Link>
              </li>
            ))}
          </ul>
        </div>
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
    <section className="bg-ink py-24 text-ink-foreground sm:py-32">
      <Container>
        <MetaLabel className="text-brand">SOLUTIONS</MetaLabel>
        <h2 className="display-2 mt-6 max-w-3xl">برای کسب‌وکارتان چه چیزی لازم دارید؟</h2>

        <div className="mt-14 grid gap-0 border-t border-white/12 lg:grid-cols-[1fr_1fr]">
          <ul className="lg:border-e lg:border-white/12 lg:pe-10">
            {systems.map((s, i) => (
              <li key={s.name}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={active === i}
                  className={cn(
                    "flex w-full items-center gap-5 border-b border-white/10 py-5 text-start transition-colors duration-200",
                    active === i
                      ? "text-brand"
                      : "text-ink-foreground/70 hover:text-ink-foreground",
                  )}
                >
                  <MetaLabel index={i + 1} className="opacity-60" />
                  <span className="text-lg font-bold sm:text-xl">{s.name}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="border-b border-white/12 px-0 py-12 lg:ps-14">
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
              <p className="mt-4 text-base leading-8 text-ink-foreground/70">{current.body}</p>
              <div className="mt-8">
                <TextLink to="/solutions" className="text-ink-foreground">
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
    <section className="bg-brand py-24 text-brand-foreground sm:py-32">
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
              چند نمونه از مسئله‌هایی که برایشان راه‌حل ساخته‌ایم.
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
    <section className="bg-ink py-24 text-ink-foreground sm:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <MetaLabel className="text-brand">INDUSTRIES</MetaLabel>
            <h2 className="display-2 mt-6 max-w-2xl">راه‌حل خوب باید به کسب‌وکار شما بخورد.</h2>
          </div>
          <TextLink to="/industries" className="text-ink-foreground">
            همه صنایع
          </TextLink>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-4">
          {[
            { label: "WEB", value: "۰۸", tone: "bg-brand text-brand-foreground" },
            { label: "SOFTWARE", value: "۰۵", tone: "bg-white/10 text-white" },
            { label: "SEO", value: "۰۶", tone: "bg-white/10 text-white" },
            { label: "DATA", value: "۰۴", tone: "bg-white/10 text-white" },
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

        <div className="relative mt-4 min-h-[240px] overflow-hidden rounded-2xl border border-white/12">
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
              هر ابزار وقتی ارزش دارد که به بقیه‌ی کسب‌وکار وصل باشد.
            </p>
          </div>
        </div>

        <div className="mt-14 hidden border-t border-white/12 lg:block">
          <div className="grid grid-cols-[1.6fr_repeat(4,minmax(0,1fr))] border-b border-white/12 py-4">
            <span />
            {capabilityColumns.map((c) => (
              <MetaLabel key={c} className="text-white/45">
                {c}
              </MetaLabel>
            ))}
          </div>
          {industries.map((name, i) => (
            <Link
              key={name}
              href="/industries"
              className="grid grid-cols-[1.6fr_repeat(4,minmax(0,1fr))] items-center border-b border-white/10 py-5 transition-colors hover:bg-white/5"
            >
              <span className="text-base font-semibold">{name}</span>
              {capabilitiesFor(i).map((on, j) => (
                <span key={capabilityColumns[j]} className="text-sm">
                  {on ? (
                    <span className="inline-block size-2 rounded-full bg-brand" />
                  ) : (
                    <span className="inline-block size-2 rounded-full bg-white/15" />
                  )}
                </span>
              ))}
            </Link>
          ))}
        </div>

        <ul className="mt-12 border-t border-white/12 lg:hidden">
          {industries.map((name, i) => (
            <li key={name}>
              <Link
                href="/industries"
                className="flex items-center justify-between gap-4 border-b border-white/10 py-5"
              >
                <span className="text-base font-semibold">{name}</span>
                <span className="flex items-center gap-1.5">
                  {capabilitiesFor(i).map((on, j) => (
                    <span
                      key={capabilityColumns[j]}
                      className={cn(
                        "inline-block size-1.5 rounded-full",
                        on ? "bg-brand" : "bg-white/15",
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
    title: "اول می‌فهمیم مشکل کجاست.",
    body: "قبل از اینکه ابزار و تکنولوژی پیشنهاد بدهیم، می‌نشینیم ببینیم دقیقاً چه چیزی قرار است بهتر شود.",
  },
  {
    title: "لازم نیست همه‌چیز را از نو بسازید.",
    body: "اگر پروژه فعلی قابل نجات باشد، همان را مرتب و قوی‌تر می‌کنیم؛ بازنویسی فقط وقتی که واقعاً لازم باشد.",
  },
  {
    title: "سئو را آخر کار یادمان نمی‌افتد.",
    body: "ساختار فنی و دیده‌شدن در گوگل را از همان اول کنار هم جلو می‌بریم.",
  },
  {
    title: "کد و دسترسی‌ها برای خودتان می‌ماند.",
    body: "همه‌چیز شفاف تحویل شما می‌شود؛ کد، داده‌ها، دامنه و دسترسی‌ها.",
  },
  {
    title: "بعد از تحویل هم تنها نمی‌مانید.",
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
                شفاف، قابل توسعه، ساخته‌شده برای فردا.
              </p>
            </div>
          </div>
          <div className="visual-card flex items-end justify-between bg-brand p-6 text-brand-foreground">
            <span className="text-6xl font-extrabold tracking-[-0.08em]">۰۵</span>
            <span className="max-w-[8rem] text-sm font-bold leading-6">
              دلیل برای اینکه پروژه را درست شروع کنیم.
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
            <h2 className="display-2 mt-6">
              از اولین گفت‌وگو تا تحویل، قدم‌به‌قدم کنار شما هستیم.
            </h2>
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
          <h2 className="display-2 max-w-[14ch]">لازم نیست همه هزینه را یک‌جا پرداخت کنید.</h2>
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
              از چیزهایی می‌نویسیم که در مسیر ساخت و رشد یاد می‌گیریم.
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
    <section className="relative overflow-hidden bg-ink py-24 text-ink-foreground sm:py-32">
      <Image
        src="/images/rycode-connected-world.png"
        alt=""
        fill
        className="object-cover object-right opacity-20"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-l from-ink/40 via-ink/85 to-ink" />
      <Container>
        <div className="relative">
          <MetaLabel className="text-brand">START HERE</MetaLabel>
          <h2 className="display-1 mt-8 max-w-[15ch]">
            یه پروژه توی ذهنتونه؟
            <br />
            یا یه <span className="text-brand">مشکل</span> که باید حل بشه؟
          </h2>
          <div className="mt-14 flex flex-wrap items-center gap-8 border-t border-white/12 pt-10">
            <CtaLink to="/start-project">با هم شروع کنیم</CtaLink>
            <TextLink to="/technical-review" className="text-ink-foreground">
              پروژه‌تان را بررسی کنیم
            </TextLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
