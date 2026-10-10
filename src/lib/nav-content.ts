export type AppPath =
  | "/"
  | "/services"
  | "/services/ongoing-support"
  | "/installment-purchase"
  | "/solutions"
  | "/problems"
  | "/industries"
  | "/integrations"
  | "/projects"
  | "/blog"
  | "/about"
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
export type NavGroup = { title: string; items: NavLink[] };
export type PrimaryNavItem = NavLink & {
  menu?: NavGroup[];
  emphasis?: boolean;
};

export const serviceGroups: NavGroup[] = [
  {
    title: "ساخت",
    items: [
      { label: "طراحی سایت", href: "/services" },
      { label: "فروشگاه اینترنتی", href: "/services" },
      { label: "سایت شرکتی", href: "/services" },
      { label: "سایت اختصاصی", href: "/services" },
      { label: "WordPress", href: "/services" },
      { label: "WooCommerce", href: "/services" },
    ],
  },
  {
    title: "توسعه",
    items: [
      { label: "نرم‌افزار اختصاصی", href: "/services" },
      { label: "API", href: "/integrations" },
      { label: "یکپارچه‌سازی", href: "/integrations" },
      { label: "توسعه پروژه موجود", href: "/services" },
      { label: "پنل و Dashboard", href: "/services" },
    ],
  },
  {
    title: "حل مشکل",
    items: [
      { label: "رفع باگ", href: "/problems" },
      { label: "تکمیل پروژه نیمه‌کاره", href: "/problems" },
      { label: "افزایش سرعت", href: "/problems" },
      { label: "مهاجرت", href: "/problems" },
      { label: "Core Web Vitals", href: "/problems" },
    ],
  },
  {
    title: "رشد",
    items: [
      { label: "سئو", href: "/services" },
      { label: "سئو تکنیکال", href: "/services" },
      { label: "سئو فروشگاهی", href: "/services" },
      { label: "استراتژی محتوا", href: "/services" },
      { label: "SEO Audit", href: "/seo-audit" },
    ],
  },
  {
    title: "پشتیبانی",
    items: [
      { label: "پشتیبانی سایت", href: "/services" },
      { label: "پشتیبانی WordPress", href: "/services" },
      { label: "پشتیبانی فروشگاه", href: "/services" },
      { label: "نگهداری نرم‌افزار", href: "/services" },
      { label: "توسعه مستمر", href: "/services" },
    ],
  },
];

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

const businessSolutionGroups: NavGroup[] = [
  {
    title: "راهکارهای ما",
    items: [
      { label: "همه راهکارها", href: "/solutions", id: "solutions-all" },
      ...solutionGroups.flatMap((group) => group.items),
    ],
  },
  {
    title: "برای چه کسب‌وکارهایی؟",
    items: [
      { label: "همه صنایع", href: "/industries", id: "industries-all" },
      ...industries.map((label, index) => ({
        label,
        href: "/industries" as const,
        id: `industry-${index}`,
      })),
    ],
  },
];

const servicesMenu: NavGroup[] = [
  ...serviceGroups,
  {
    title: "مسیرهای مرتبط",
    items: [
      { label: "کسب‌وکارها و راهکارهای ما", href: "/solutions" },
      { label: "نمونه‌کارها", href: "/projects" },
      { label: "خرید قسطی خدمات", href: "/installment-purchase" },
    ],
  },
];

const projectsMenu: NavGroup[] = [
  {
    title: "نمونه‌کارها",
    items: [
      { label: "همه نمونه‌کارها", href: "/projects" },
      { label: "مطالعات مفهومی", href: "/projects" },
    ],
  },
  {
    title: "بر اساس کسب‌وکار",
    items: [
      { label: "صنایع", href: "/industries" },
      { label: "راهکارهای ما", href: "/solutions" },
    ],
  },
];

const companyMenu: NavGroup[] = [
  {
    title: "درباره و قوانین",
    items: [
      { label: "درباره ما", href: "/about" },
      { label: "قوانین استفاده", href: "/terms" },
      { label: "حریم خصوصی", href: "/privacy" },
    ],
  },
];

export const primaryNav: PrimaryNavItem[] = [
  { label: "خدمات", href: "/services", menu: servicesMenu },
  { label: "نمونه‌کارها", href: "/projects", menu: projectsMenu },
  { label: "بلاگ", href: "/blog" },
  { label: "پشتیبانی", href: "/services/ongoing-support" },
  { label: "سوالات متداول", href: "/faq" },
  { label: "تماس با ما", href: "/contact" },
  { label: "درباره ما", href: "/about", menu: companyMenu },
  { label: "شروع کار", href: "/start-project", emphasis: true },
  {
    label: "کسب‌وکارها و راهکارهای ما",
    href: "/solutions",
    menu: businessSolutionGroups,
  },
];

export const footerNav: NavGroup[] = [
  {
    title: "شرکت",
    items: [
      { label: "درباره رای‌کد", href: "/about" },
      { label: "چرا رای‌کد", href: "/why-rycode" },
      { label: "فرآیند کار", href: "/process" },
      { label: "تکنولوژی‌ها", href: "/technologies" },
      { label: "قوانین استفاده", href: "/terms" },
      { label: "حریم خصوصی", href: "/privacy" },
    ],
  },
  {
    title: "مسیرها",
    items: [
      { label: "خدمات", href: "/services" },
      { label: "پشتیبانی", href: "/services/ongoing-support" },
      { label: "نمونه‌کارها", href: "/projects" },
      { label: "کسب‌وکارها و راهکارهای ما", href: "/solutions" },
    ],
  },
  {
    title: "منابع",
    items: [
      { label: "پروژه‌ها", href: "/projects" },
      { label: "بلاگ", href: "/blog" },
      { label: "سوالات متداول", href: "/faq" },
      { label: "تماس", href: "/contact" },
    ],
  },
  {
    title: "شروع",
    items: [
      { label: "شروع پروژه", href: "/start-project" },
      { label: "خرید قسطی خدمات", href: "/installment-purchase" },
      { label: "درخواست بررسی فنی", href: "/technical-review" },
      { label: "درخواست SEO Audit", href: "/seo-audit" },
      { label: "ورود مشتری", href: "/login" },
    ],
  },
];
