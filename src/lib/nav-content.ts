import { getCatalogEntry } from "@/content/catalog";
import { serviceFamilies } from "@/content/service-model";
import type { Locale } from "@/i18n/routing";

export type AppPath =
  | "/"
  | "/services"
  | `/services/${string}`
  | "/services#solutions"
  | "/services#industries"
  | "/services/ongoing-support"
  | "/installment-purchase"
  | "/solutions"
  | "/problems"
  | "/industries"
  | "/integrations"
  | "/projects"
  | "/blog"
  | "/about"
  | `/about#${string}`
  | `/services#${string}`
  | "/terms"
  | "/privacy"
  | "/why-rycode"
  | "/process"
  | "/technologies"
  | "/contact"
  | "/faq"
  | "/start-project"
  | "/technical-review"
  | "/seo-audit"
  | "/login";

export type NavLink = { label: string; href: AppPath; id?: string };
export type NavGroup = { title: string; items: NavLink[]; id?: string };
export type PrimaryNavItem = NavLink & {
  menu?: NavGroup[];
  emphasis?: boolean;
};

export function getServiceGroups(locale: Locale): NavGroup[] {
  return serviceFamilies.map(family => ({
    title: family.title[locale],
    items: family.slugs.flatMap(slug => {
      const service = getCatalogEntry("services", slug);
      return service ? [{ label: service.title[locale], href: `/services/${slug}` as AppPath }] : [];
    }),
  }));
}
export const serviceGroups = getServiceGroups("fa");

export const solutionGroups: NavGroup[] = [
  {
    title: "فروش و مشتری",
    items: [
      { label: "CRM", href: "/solutions" },
      { label: "پنل مشتری", href: "/solutions" },
      { label: "پنل نمایندگان", href: "/solutions" },
      { label: "B2B Commerce", href: "/solutions" },
      { label: "Lead Management", href: "/solutions" },
    ],
  },
  {
    title: "عملیات",
    items: [
      { label: "سیستم سفارش‌گیری", href: "/solutions" },
      { label: "Dashboard", href: "/solutions" },
      { label: "گزارش‌گیری", href: "/solutions" },
      { label: "Workflow", href: "/solutions" },
      { label: "سیستم مدیریت داخلی", href: "/solutions" },
    ],
  },
  {
    title: "پلتفرم",
    items: [
      { label: "Marketplace", href: "/solutions" },
      { label: "LMS", href: "/solutions" },
      { label: "سیستم رزرو", href: "/solutions" },
      { label: "سیستم نوبت‌دهی", href: "/solutions" },
      { label: "Membership", href: "/solutions" },
    ],
  },
  {
    title: "پس از فروش",
    items: [
      { label: "سامانه گارانتی", href: "/solutions" },
      { label: "تیکتینگ", href: "/solutions" },
      { label: "پرتال پشتیبانی", href: "/solutions" },
      { label: "ثبت محصول", href: "/solutions" },
      { label: "خدمات پس از فروش", href: "/solutions" },
    ],
  },
];

export const industries = [
  "تولید و کارخانه",
  "بازرگانی و صادرات",
  "تجهیزات صنعتی",
  "فروشگاه‌های آنلاین",
  "پزشکی و کلینیک",
  "خودرو و لوازم یدکی",
  "آموزش",
  "املاک",
];

export function getPrimaryNav(locale: Locale): PrimaryNavItem[] {
  const fa = locale === "fa";
  return [
    { label: fa ? "خدمات" : "Services", href: "/services", menu: [...getServiceGroups(locale), {
      title: fa ? "خدمات در عمل" : "Services in context",
      id: "service-resources",
      items: [
        { label: fa ? "نمونه‌ها و مطالعات" : "Project studies", href: "/projects" },
        { label: fa ? "چه سیستم‌هایی می‌سازیم؟" : "Systems we build", href: "/services#solutions" },
        { label: fa ? "برای کسب‌وکار شما" : "For your business", href: "/services#industries" },
        { label: fa ? "شرایط پرداخت مرحله‌ای" : "Installment terms", href: "/installment-purchase" },
      ],
    }] },
    { label: fa ? "نمونه‌کارها" : "Work", href: "/projects" },
    { label: fa ? "درباره ما" : "About us", href: "/about", menu: [{
      title: fa ? "آشنایی با رایکد" : "Meet RYCODE",
      items: [{ label: fa ? "درباره رایکد" : "About RYCODE", href: "/about" }, { label: fa ? "چرا رایکد" : "Why RYCODE", href: "/about#approach" }, { label: fa ? "فرایند همکاری" : "Our process", href: "/about#process" }, { label: fa ? "ابزار و تکنولوژی" : "Our technology", href: "/about#technology" }, { label: fa ? "پرسش‌های متداول" : "FAQ", href: "/faq" }],
    }] },
    { label: fa ? "بلاگ" : "Blog", href: "/blog" },
    { label: fa ? "تماس با ما" : "Contact", href: "/contact" },
    { label: fa ? "شروع همکاری" : "Get started", href: "/start-project", emphasis: true },
  ];
}
export const primaryNav = getPrimaryNav("fa");

export function getFooterNav(locale: Locale): NavGroup[] {
  const fa = locale === "fa";
  return [
    { title: fa ? "رایکد" : "Company", items: [
      { label: fa ? "درباره رایکد" : "About RYCODE", href: "/about" },
      { label: fa ? "چرا رایکد" : "Why RYCODE", href: "/about#approach" },
      { label: fa ? "فرایند همکاری" : "Our process", href: "/about#process" },
      { label: fa ? "ابزار و تکنولوژی" : "Our technology", href: "/about#technology" },
    ] },
    { title: fa ? "خدمات" : "Services", items: serviceFamilies.map(family => ({
      label: family.title[locale], href: `/services#${family.id}` as AppPath,
    })) },
    { title: fa ? "بیشتر ببین" : "Resources", items: [
      { label: fa ? "نمونه‌ها و مطالعات" : "Project studies", href: "/projects" },
      { label: fa ? "بلاگ" : "Blog", href: "/blog" },
      { label: fa ? "پرسش‌های متداول" : "FAQ", href: "/faq" },
      { label: fa ? "حریم خصوصی" : "Privacy policy", href: "/privacy" },
      { label: fa ? "قوانین استفاده" : "Terms of use", href: "/terms" },
    ] },
    { title: fa ? "شروع همکاری" : "Get started", items: [
      { label: fa ? "درباره پروژه حرف بزنیم" : "Start a conversation", href: "/start-project" },
      { label: fa ? "بررسی پروژهٔ فعلی" : "Technical review", href: "/technical-review" },
      { label: fa ? "بررسی سئوی سایت" : "SEO audit", href: "/seo-audit" },
      { label: fa ? "تماس با ما" : "Contact", href: "/contact" },
      { label: fa ? "شرایط پرداخت مرحله‌ای" : "Installment terms", href: "/installment-purchase" },
      { label: fa ? "ورود مشتری" : "Client login", href: "/login" },
    ] },
  ];
}
export const footerNav = getFooterNav("fa");
