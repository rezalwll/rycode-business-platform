import { Link } from "@/i18n/navigation";
import {
  ArrowLeft,
  Boxes,
  Compass,
  Factory,
  Gauge,
  LifeBuoy,
  Link2,
  Rocket,
  Search,
  ShoppingCart,
  Stethoscope,
  Wrench,
} from "lucide-react";
import type { ReactNode } from "react";

import {
  Container,
  CtaLink,
  Eyebrow,
  Lead,
  Section,
  SectionTitle,
} from "@/components/site/primitives";
import type { AppPath } from "@/lib/nav-content";

/* ------------------------------------------------------------------ */
/* /services — CAPABILITY MAP                                          */
/* ------------------------------------------------------------------ */

const servicePaths: { label: string; hint: string; to: AppPath; icon: typeof Rocket }[] = [
  {
    label: "می‌خواهم چیزی بسازم",
    hint: "سایت، فروشگاه، پنل یا نرم‌افزار جدید",
    to: "/start-project",
    icon: Rocket,
  },
  {
    label: "پروژه موجود دارم",
    hint: "تکمیل، رفع مشکل یا توسعه سیستم فعلی",
    to: "/technical-review",
    icon: Wrench,
  },
  {
    label: "سیستم‌ها را به هم متصل می‌کنم",
    hint: "API، یکپارچه‌سازی و انتقال داده",
    to: "/integrations",
    icon: Link2,
  },
  { label: "می‌خواهم رشد کنم", hint: "سئو، سرعت و بهبود نرخ تبدیل", to: "/seo-audit", icon: Gauge },
  {
    label: "نیاز به پشتیبانی دارم",
    hint: "نگهداری، پایش و توسعه مستمر",
    to: "/contact",
    icon: LifeBuoy,
  },
];

const pillars: { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "طراحی و ساخت وب",
    body: "سایت شرکتی، فروشگاه اینترنتی و سایت اختصاصی با ساختار قابل توسعه.",
  },
  {
    n: "02",
    title: "نرم‌افزار اختصاصی",
    body: "پنل، داشبورد و سیستم داخلی متناسب با فرآیند واقعی کسب‌وکار.",
  },
  {
    n: "03",
    title: "توسعه پروژه موجود",
    body: "ادامه دادن سیستمی که هست، به‌جای شروع دوباره از صفر.",
  },
  {
    n: "04",
    title: "یکپارچه‌سازی و API",
    body: "اتصال سیستم‌ها به هم و پایان‌دادن به کارهای دستی تکراری.",
  },
  {
    n: "05",
    title: "حل مشکل فنی",
    body: "رفع باگ، افزایش سرعت، مهاجرت و نجات پروژه‌های متوقف‌شده.",
  },
  { n: "06", title: "سئو و رشد", body: "سئو تکنیکال، معماری محتوا و بهبود مسیر تبدیل کاربر." },
  { n: "07", title: "پشتیبانی و نگهداری", body: "پایداری، به‌روزرسانی و توسعه در بازه‌های مشخص." },
];

export function ServicesHubIntro() {
  return (
    <>
      <Eyebrow>خدمات</Eyebrow>
      <h1 className="mt-5 max-w-3xl text-[2rem] leading-[1.35] font-bold sm:text-[2.6rem] sm:leading-[1.25]">
        هر پروژه از یک نیاز متفاوت شروع می‌شود.
      </h1>
      <Lead className="max-w-2xl">
        به‌جای فهرست‌کردن خدمات، از وضعیت خودتان شروع کنید؛ مسیر درست را پیدا می‌کنیم.
      </Lead>

      <ul className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
        {servicePaths.map((p) => (
          <li key={p.label} className="bg-background">
            <Link
              href={p.to}
              className="flex h-full flex-col gap-3 p-6 transition-colors hover:bg-secondary/60"
            >
              <p.icon className="size-5 text-brand" aria-hidden />
              <span className="text-sm font-bold leading-6">{p.label}</span>
              <span className="text-xs leading-6 text-muted-foreground">{p.hint}</span>
              <ArrowLeft className="mt-auto size-4 text-brand" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-16">
        <div>
          <Eyebrow>ستون‌های خدمات</Eyebrow>
          <SectionTitle className="text-2xl sm:text-3xl">هفت حوزه کاری رای‌کد</SectionTitle>
        </div>
        <ol className="grid gap-0">
          {pillars.map((p) => (
            <li
              key={p.n}
              className="grid gap-2 border-t border-border py-6 sm:grid-cols-[3rem_minmax(0,16rem)_minmax(0,1fr)] sm:gap-6"
            >
              <span dir="ltr" className="font-display text-xs font-bold text-brand">
                {p.n}
              </span>
              <h3 className="text-base font-bold">{p.title}</h3>
              <p className="text-sm leading-7 text-muted-foreground">{p.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* /solutions — PRODUCT / SYSTEM EXPLORER                              */
/* ------------------------------------------------------------------ */

const families: { title: string; body: string; items: string[] }[] = [
  {
    title: "فروش و مشتری",
    body: "از اولین تماس تا مشتری وفادار، در یک جریان.",
    items: ["CRM", "پنل مشتری", "پنل نمایندگان", "مدیریت سرنخ", "B2B Commerce"],
  },
  {
    title: "عملیات",
    body: "کارهای روزمره شرکت از حالت دستی و اکسل خارج می‌شود.",
    items: ["سیستم سفارش‌گیری", "مدیریت انبار", "Workflow", "مدیریت پروژه داخلی"],
  },
  {
    title: "رزرو و خدمات",
    body: "زمان، ظرفیت و نوبت به‌صورت خودکار مدیریت می‌شود.",
    items: ["سیستم رزرو", "نوبت‌دهی", "مدیریت ظرفیت", "خدمات دوره‌ای"],
  },
  {
    title: "پس از فروش",
    body: "بعد از فروش، رابطه با مشتری قطع نمی‌شود.",
    items: ["سامانه گارانتی", "تیکتینگ", "ثبت محصول", "پرتال پشتیبانی"],
  },
  {
    title: "پلتفرم",
    body: "محصولاتی که خودشان کسب‌وکار هستند.",
    items: ["Marketplace", "LMS", "Membership", "پلتفرم چندفروشندگی"],
  },
  {
    title: "داده و گزارش",
    body: "تصمیم بر پایه عدد، نه حدس.",
    items: ["Dashboard مدیریتی", "گزارش‌گیری", "KPI داخلی", "خروجی و ایمپورت داده"],
  },
];

export function SolutionsHubIntro() {
  return (
    <>
      <Eyebrow>راهکارها</Eyebrow>
      <h1 className="mt-5 max-w-3xl text-[2rem] leading-[1.35] font-bold sm:text-[2.6rem] sm:leading-[1.25]">
        رای‌کد دقیقاً چه چیزهایی می‌سازد؟
      </h1>
      <Lead className="max-w-2xl">
        راهکارها بر اساس کاری که انجام می‌دهند دسته‌بندی شده‌اند، نه بر اساس نام تکنولوژی.
      </Lead>

      <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
        {families.map((f) => (
          <section key={f.title} className="bg-background p-7">
            <h2 className="text-base font-bold">{f.title}</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{f.body}</p>
            <ul className="mt-5 space-y-2.5">
              {f.items.map((i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-foreground/85">
                  <span className="size-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
                  {i}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* /problems — DIAGNOSTIC INTERFACE                                    */
/* ------------------------------------------------------------------ */

const symptoms: { label: string; next: string }[] = [
  { label: "پروژه متوقف شده", next: "بررسی وضعیت کد و تصمیم ادامه یا بازنویسی" },
  { label: "سایت خراب است", next: "شناسایی خطا و بازگرداندن سرویس" },
  { label: "سایت کند است", next: "بررسی سرعت، کش و Core Web Vitals" },
  { label: "سایت مشتری نمی‌گیرد", next: "بررسی مسیر تبدیل و سئو" },
  { label: "کارهای شرکت دستی است", next: "طراحی سیستم داخلی و خودکارسازی" },
  { label: "سیستم‌ها از هم جدا هستند", next: "یکپارچه‌سازی و اتصال داده" },
  { label: "گزارش نداریم", next: "ساخت داشبورد و گزارش داخلی" },
  { label: "سایت قدیمی شده", next: "بازطراحی بدون از دست دادن سئو" },
  { label: "سیستم فعلی جواب نمی‌دهد", next: "بازبینی معماری و مسیر توسعه" },
];

export function ProblemsHubIntro() {
  return (
    <>
      <Eyebrow>عیب‌یابی</Eyebrow>
      <h1 className="mt-5 max-w-3xl text-[2rem] leading-[1.35] font-bold sm:text-[2.6rem] sm:leading-[1.25]">
        لازم نیست اسم راه‌حل را بدانید.
      </h1>
      <Lead className="max-w-2xl">
        نشانه‌ای که به وضعیت شما نزدیک‌تر است انتخاب کنید؛ بقیه مسیر را ما مشخص می‌کنیم.
      </Lead>

      <ul className="mt-10 divide-y divide-border overflow-hidden rounded-lg border border-border">
        {symptoms.map((s) => (
          <li key={s.label}>
            <Link
              href="/technical-review"
              className="flex flex-wrap items-center gap-x-6 gap-y-2 px-6 py-5 transition-colors hover:bg-secondary/60"
            >
              <span className="flex items-center gap-3 text-sm font-bold sm:min-w-[15rem]">
                <Search className="size-4 shrink-0 text-brand" aria-hidden />
                {s.label}
              </span>
              <span className="text-sm text-muted-foreground">{s.next}</span>
              <ArrowLeft className="ms-auto size-4 shrink-0 text-brand" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-sm leading-7 text-muted-foreground">
        هیچ‌کدام دقیقاً مشکل شما نیست؟{" "}
        <Link href="/contact" className="brand-underline font-semibold text-foreground">
          وضعیت‌تان را توضیح دهید
        </Link>
        .
      </p>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* /industries — MARKET EXPLORER                                       */
/* ------------------------------------------------------------------ */

const markets: {
  name: string;
  icon: typeof Factory;
  challenge: string;
  solutions: string[];
  services: string[];
}[] = [
  {
    name: "تولید و کارخانه",
    icon: Factory,
    challenge: "سفارش‌ها و تولید در اکسل و تلفن مدیریت می‌شود و گزارش دقیقی وجود ندارد.",
    solutions: ["سیستم سفارش‌گیری", "پنل نمایندگان", "داشبورد تولید"],
    services: ["نرم‌افزار اختصاصی", "یکپارچه‌سازی"],
  },
  {
    name: "بازرگانی و صادرات",
    icon: Boxes,
    challenge: "کاتالوگ چندزبانه، استعلام قیمت و پیگیری مشتریان خارجی پراکنده است.",
    solutions: ["B2B Commerce", "مدیریت سرنخ", "کاتالوگ دوزبانه"],
    services: ["طراحی سایت", "سئو"],
  },
  {
    name: "تجهیزات صنعتی",
    icon: Wrench,
    challenge: "محصولات فنی با مشخصات پیچیده در سایت قابل جستجو و مقایسه نیستند.",
    solutions: ["کاتالوگ فنی", "استعلام قیمت", "سامانه گارانتی"],
    services: ["طراحی سایت", "سئو تکنیکال"],
  },
  {
    name: "فروشگاه‌های آنلاین",
    icon: ShoppingCart,
    challenge: "ترافیک هست ولی نرخ تبدیل پایین است و سرعت سایت مشکل دارد.",
    solutions: ["فروشگاه اینترنتی", "مدیریت سفارش", "پنل مشتری"],
    services: ["افزایش سرعت", "سئو فروشگاهی"],
  },
  {
    name: "پزشکی و کلینیک",
    icon: Stethoscope,
    challenge: "نوبت‌دهی تلفنی وقت‌گیر است و پرونده مراجعان پراکنده می‌ماند.",
    solutions: ["سیستم نوبت‌دهی", "پرتال مراجع", "یادآوری خودکار"],
    services: ["نرم‌افزار اختصاصی", "طراحی سایت"],
  },
  {
    name: "خودرو و لوازم یدکی",
    icon: Compass,
    challenge: "تطبیق قطعه با مدل خودرو سخت است و سفارش اشتباه زیاد می‌شود.",
    solutions: ["کاتالوگ سازگاری قطعات", "پنل نمایندگان", "مدیریت انبار"],
    services: ["فروشگاه اینترنتی", "یکپارچه‌سازی"],
  },
  {
    name: "آموزش",
    icon: Rocket,
    challenge: "دوره‌ها، ثبت‌نام و پیگیری پیشرفت در ابزارهای جدا انجام می‌شود.",
    solutions: ["LMS", "Membership", "پرتال دانشجو"],
    services: ["نرم‌افزار اختصاصی", "سئو محتوا"],
  },
  {
    name: "املاک",
    icon: Gauge,
    challenge: "فایل‌ها و مشتریان در کانال‌های مختلف پخش‌اند و گزارش فروش دقیق نیست.",
    solutions: ["CRM املاک", "جستجوی پیشرفته فایل", "پنل مشاوران"],
    services: ["طراحی سایت", "سئو محلی"],
  },
];

export function IndustriesHubIntro() {
  return (
    <>
      <Eyebrow>صنایع</Eyebrow>
      <h1 className="mt-5 max-w-3xl text-[2rem] leading-[1.35] font-bold sm:text-[2.6rem] sm:leading-[1.25]">
        هر صنعت مسئله‌های خودش را دارد.
      </h1>
      <Lead className="max-w-2xl">
        این فهرست نمایش نام صنایع نیست؛ چالش رایج هر بازار و راهکار متناسب با آن است.
      </Lead>

      <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2">
        {markets.map((m) => (
          <section key={m.name} className="bg-background p-7">
            <div className="flex items-center gap-3">
              <m.icon className="size-5 text-brand" aria-hidden />
              <h2 className="text-base font-bold">{m.name}</h2>
            </div>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{m.challenge}</p>
            <dl className="mt-5 space-y-3 text-xs">
              <div className="flex flex-wrap items-baseline gap-2">
                <dt className="font-bold text-foreground/70">راهکارها:</dt>
                <dd className="flex flex-wrap gap-2">
                  {m.solutions.map((s) => (
                    <span key={s} className="rounded-full border border-border px-2.5 py-1">
                      {s}
                    </span>
                  ))}
                </dd>
              </div>
              <div className="flex flex-wrap items-baseline gap-2">
                <dt className="font-bold text-foreground/70">خدمات:</dt>
                <dd className="flex flex-wrap gap-2">
                  {m.services.map((s) => (
                    <span key={s} className="rounded-full border border-border px-2.5 py-1">
                      {s}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </section>
        ))}
      </div>
    </>
  );
}

/* Shared closing block for hub pages. */
export function HubOutro({ children }: { children?: ReactNode }) {
  return (
    <Section className="border-t border-border bg-surface">
      <Container>
        <SectionTitle className="mt-0">مطمئن نیستید از کجا شروع کنید؟</SectionTitle>
        <Lead>
          {children ?? "وضعیت فعلی‌تان را بنویسید؛ مسیر پیشنهادی را برایتان مشخص می‌کنیم."}
        </Lead>
        <div className="mt-8 flex flex-wrap gap-3">
          <CtaLink to="/start-project">شروع پروژه</CtaLink>
          <CtaLink to="/contact" variant="outline">
            مشاوره رایگان
          </CtaLink>
        </div>
      </Container>
    </Section>
  );
}
