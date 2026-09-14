import type { Locale } from "@/i18n/routing";

export const catalogKinds = [
  "services",
  "solutions",
  "problems",
  "industries",
  "integrations",
  "projects",
  "blog",
] as const;

export type CatalogKind = (typeof catalogKinds)[number];

export type LocalizedText = { fa: string; en: string };

export type CatalogSection = {
  title: LocalizedText;
  body?: LocalizedText;
  items?: LocalizedText[];
};

export type CatalogEntry = {
  kind: CatalogKind;
  slug: string;
  title: LocalizedText;
  summary: LocalizedText;
  eyebrow: LocalizedText;
  sections: CatalogSection[];
  conceptual?: boolean;
};

export const kindCopy: Record<
  CatalogKind,
  { title: LocalizedText; lead: LocalizedText; eyebrow: LocalizedText }
> = {
  services: {
    eyebrow: { fa: "خدمات", en: "Services" },
    title: {
      fa: "مسیرهای فنی برای ساخت، نجات و رشد",
      en: "Engineering paths to build, rescue and grow",
    },
    lead: {
      fa: "از وضعیت کسب‌وکار شروع می‌کنیم و ابزار، معماری و دامنهٔ اجرا را بعد از شناخت مسئله انتخاب می‌کنیم.",
      en: "We start with the business situation, then choose the tools, architecture and delivery scope.",
    },
  },
  solutions: {
    eyebrow: { fa: "راهکارها", en: "Solutions" },
    title: {
      fa: "سیستم‌هایی که حول فرآیند واقعی شما ساخته می‌شوند",
      en: "Systems designed around real operating workflows",
    },
    lead: {
      fa: "راهکار آماده تحمیل نمی‌کنیم؛ اجزای لازم را با توجه به نقش‌ها، داده‌ها و مسیر کار طراحی می‌کنیم.",
      en: "We do not force a packaged answer; capabilities follow roles, data and the actual workflow.",
    },
  },
  problems: {
    eyebrow: { fa: "مشکلات رایج", en: "Problems" },
    title: {
      fa: "از نشانه شروع کنید، نه از نام تکنولوژی",
      en: "Start with the symptom, not a technology name",
    },
    lead: {
      fa: "کندی، خطا، توقف پروژه یا فرآیند دستی را بررسی می‌کنیم و قبل از پیشنهاد راه‌حل، علت را مشخص می‌کنیم.",
      en: "We diagnose slowness, failure, stalled delivery and manual work before prescribing a solution.",
    },
  },
  industries: {
    eyebrow: { fa: "صنایع", en: "Industries" },
    title: {
      fa: "تکنولوژی متناسب با مدل کسب‌وکار",
      en: "Technology aligned with the business model",
    },
    lead: {
      fa: "هر بازار قواعد، داده‌ها و نقاط اصطکاک خودش را دارد؛ معماری باید همین تفاوت‌ها را جدی بگیرد.",
      en: "Every market has distinct rules, data and friction points; the architecture should reflect them.",
    },
  },
  integrations: {
    eyebrow: { fa: "یکپارچه‌سازی", en: "Integrations" },
    title: {
      fa: "سیستم‌های جدا را به یک جریان قابل اعتماد وصل کنید",
      en: "Connect separate systems into one dependable flow",
    },
    lead: {
      fa: "مالکیت داده، جهت تبادل، خطاها و بازیابی از ابتدا تعریف می‌شوند تا API فقط یک اتصال شکننده نباشد.",
      en: "Data ownership, direction, failure and recovery are designed up front so an API is not a fragile bridge.",
    },
  },
  projects: {
    eyebrow: { fa: "مطالعات مفهومی", en: "Concept studies" },
    title: { fa: "مسئله، تصمیم و معماری", en: "Problem, decision and architecture" },
    lead: {
      fa: "تا زمان انتشار نمونه‌کار واقعی، این بخش فقط سناریوهای مفهومی و بدون نام مشتری یا عدد ساختگی را نشان می‌دهد.",
      en: "Until real work is approved for publication, this archive contains clearly labelled concepts with no invented client or metric.",
    },
  },
  blog: {
    eyebrow: { fa: "مجله رای‌کد", en: "RYCODE Journal" },
    title: {
      fa: "یادداشت‌های مهندسی، محصول و رشد",
      en: "Notes on engineering, product and growth",
    },
    lead: {
      fa: "مطالب کاربردی درباره ساخت، نگهداری و رشد محصولات دیجیتال؛ بدون آمار یا ادعای ساختگی.",
      en: "Practical writing on building, maintaining and growing digital products—without invented evidence.",
    },
  },
};

const commonProcess: CatalogSection = {
  title: { fa: "فرآیند اجرا", en: "Delivery process" },
  items: [
    { fa: "شناخت مسئله و محدودیت‌ها", en: "Understand the problem and constraints" },
    { fa: "تعریف دامنه، معیار پذیرش و ریسک‌ها", en: "Define scope, acceptance criteria and risks" },
    { fa: "طراحی، پیاده‌سازی و آزمون مرحله‌ای", en: "Design, implement and verify incrementally" },
    { fa: "انتشار کنترل‌شده و بهبود مستمر", en: "Release deliberately and improve continuously" },
  ],
};

const entries: CatalogEntry[] = [
  {
    kind: "services",
    slug: "web-development",
    eyebrow: { fa: "خدمت / وب", en: "Service / Web" },
    title: { fa: "طراحی و توسعه وب", en: "Web design and development" },
    summary: {
      fa: "وب‌سایت و وب‌اپلیکیشن سریع، دسترس‌پذیر و آمادهٔ رشد محتوا از روز اول.",
      en: "Fast, accessible websites and web applications designed for content-led growth from day one.",
    },
    sections: [
      {
        title: { fa: "برای چه مسئله‌ای؟", en: "What it solves" },
        body: {
          fa: "وقتی وب‌سایت باید هم ابزار معرفی و فروش باشد و هم پایه‌ای قابل توسعه برای محصول و محتوا.",
          en: "For websites that must support sales and communication while remaining a maintainable product foundation.",
        },
      },
      {
        title: { fa: "خروجی", en: "Deliverables" },
        items: [
          { fa: "معماری اطلاعات و تجربه کاربر", en: "Information architecture and UX" },
          { fa: "پیاده‌سازی واکنش‌گرا و دسترس‌پذیر", en: "Responsive, accessible implementation" },
          { fa: "SEO فنی و Core Web Vitals", en: "Technical SEO and Core Web Vitals" },
          { fa: "مدیریت محتوا و مستندات", en: "Content management and documentation" },
        ],
      },
      commonProcess,
    ],
  },
  {
    kind: "services",
    slug: "ecommerce",
    eyebrow: { fa: "خدمت / تجارت", en: "Service / Commerce" },
    title: { fa: "فروشگاه اینترنتی", en: "Ecommerce engineering" },
    summary: {
      fa: "تجربه خرید، مدیریت محصول و عملیات سفارش متناسب با مدل واقعی فروش.",
      en: "Buying experience, product management and order operations shaped around the real sales model.",
    },
    sections: [
      {
        title: { fa: "دامنه", en: "Scope" },
        items: [
          { fa: "کاتالوگ و جست‌وجوی محصول", en: "Product catalog and search" },
          { fa: "سبد، سفارش و وضعیت پرداخت", en: "Basket, order and payment state" },
          { fa: "پنل مشتری و عملیات داخلی", en: "Customer portal and internal operations" },
          {
            fa: "اتصال به انبار و حسابداری در صورت نیاز",
            en: "Inventory and accounting integration when required",
          },
        ],
      },
      commonProcess,
    ],
  },
  {
    kind: "services",
    slug: "custom-software",
    eyebrow: { fa: "خدمت / نرم‌افزار", en: "Service / Software" },
    title: { fa: "نرم‌افزار اختصاصی", en: "Custom software" },
    summary: {
      fa: "پنل، سامانه و ابزار داخلی برای فرآیندی که نرم‌افزار آماده پاسخ‌گوی آن نیست.",
      en: "Portals, systems and internal tools for workflows that off-the-shelf software cannot fit.",
    },
    sections: [
      {
        title: { fa: "رویکرد", en: "Approach" },
        body: {
          fa: "نقش‌ها، تصمیم‌ها و جریان داده پیش از انتخاب تکنولوژی مدل می‌شوند.",
          en: "Roles, decisions and data flows are modelled before the technology is selected.",
        },
      },
      commonProcess,
    ],
  },
  {
    kind: "services",
    slug: "project-rescue",
    eyebrow: { fa: "خدمت / نجات", en: "Service / Rescue" },
    title: { fa: "نجات و توسعه پروژه", en: "Project rescue and continuation" },
    summary: {
      fa: "ممیزی کد و زیرساخت برای تصمیم آگاهانه میان ادامه، اصلاح یا بازسازی بخش‌های ضروری.",
      en: "A code and infrastructure audit to choose deliberately between continuation, correction and targeted rebuilding.",
    },
    sections: [
      {
        title: { fa: "آنچه بررسی می‌شود", en: "What we inspect" },
        items: [
          { fa: "سلامت معماری و امنیت", en: "Architecture and security" },
          { fa: "قابلیت Build، Test و استقرار", en: "Build, test and deployment readiness" },
          { fa: "بدهی فنی و ریسک داده", en: "Technical debt and data risk" },
          { fa: "مسیر کوتاه‌مدت بازگشت پروژه", en: "Shortest safe route back to delivery" },
        ],
      },
      commonProcess,
    ],
  },
  {
    kind: "services",
    slug: "api-integration",
    eyebrow: { fa: "خدمت / اتصال", en: "Service / Integration" },
    title: { fa: "API و یکپارچه‌سازی", en: "API and integration" },
    summary: {
      fa: "اتصال سیستم‌ها با قرارداد داده روشن، امنیت، مشاهده‌پذیری و بازیابی خطا.",
      en: "Connect systems with explicit data contracts, security, observability and failure recovery.",
    },
    sections: [
      {
        title: { fa: "اصول", en: "Principles" },
        items: [
          { fa: "منبع حقیقت مشخص", en: "Explicit source of truth" },
          { fa: "Idempotency و Retry کنترل‌شده", en: "Idempotency and controlled retry" },
          { fa: "ثبت رخداد و هشدار خطا", en: "Event logging and failure alerts" },
        ],
      },
      commonProcess,
    ],
  },
  {
    kind: "services",
    slug: "seo-growth",
    eyebrow: { fa: "خدمت / رشد", en: "Service / Growth" },
    title: { fa: "سئو و رشد فنی", en: "Technical SEO and growth" },
    summary: {
      fa: "معماری محتوا، سلامت فنی و اندازه‌گیری First-party برای رشد قابل پیگیری.",
      en: "Content architecture, technical health and first-party measurement for accountable growth.",
    },
    sections: [
      {
        title: { fa: "حوزه‌ها", en: "Areas" },
        items: [
          { fa: "خزش، ایندکس و Metadata", en: "Crawling, indexing and metadata" },
          { fa: "ساختار محتوا و لینک داخلی", en: "Content structure and internal linking" },
          { fa: "سرعت و تجربه صفحه", en: "Performance and page experience" },
          { fa: "قیف و Attribution داخلی", en: "First-party funnels and attribution" },
        ],
      },
      commonProcess,
    ],
  },
  {
    kind: "services",
    slug: "ongoing-support",
    eyebrow: { fa: "خدمت / تداوم", en: "Service / Continuity" },
    title: { fa: "پشتیبانی و توسعه مستمر", en: "Ongoing support and development" },
    summary: {
      fa: "رفع مشکل، نگهداری، پایش و تحویل تدریجی قابلیت‌های جدید با اولویت روشن.",
      en: "Issue resolution, maintenance, monitoring and incremental delivery with explicit priorities.",
    },
    sections: [
      {
        title: { fa: "مدل همکاری", en: "Engagement model" },
        body: {
          fa: "درخواست‌ها ثبت، اولویت‌بندی و با وضعیت شفاف تا تحویل دنبال می‌شوند.",
          en: "Requests are recorded, prioritised and followed through transparent states to delivery.",
        },
      },
      commonProcess,
    ],
  },
  {
    kind: "solutions",
    slug: "ecommerce-platform",
    eyebrow: { fa: "راهکار / فروش", en: "Solution / Sales" },
    title: { fa: "پلتفرم فروش اینترنتی", en: "Ecommerce platform" },
    summary: {
      fa: "محصول، سفارش، مشتری و عملیات فروش در یک جریان قابل توسعه.",
      en: "Products, orders, customers and sales operations in one extensible flow.",
    },
    sections: [
      {
        title: { fa: "قابلیت‌های پایه", en: "Core capabilities" },
        items: [
          { fa: "کاتالوگ و قیمت‌گذاری", en: "Catalog and pricing" },
          { fa: "سبد و سفارش", en: "Basket and orders" },
          { fa: "پنل مشتری", en: "Customer portal" },
          { fa: "مدیریت عملیات", en: "Operations management" },
        ],
      },
      commonProcess,
    ],
  },
  {
    kind: "solutions",
    slug: "crm",
    eyebrow: { fa: "راهکار / مشتری", en: "Solution / Customer" },
    title: { fa: "مدیریت سرنخ و مشتری", en: "Lead and customer management" },
    summary: {
      fa: "از اولین تماس تا تبدیل و پیگیری رابطه با مشتری، با تاریخچه‌ای قابل اعتماد.",
      en: "From first contact through conversion and continued relationship, with a dependable history.",
    },
    sections: [
      {
        title: { fa: "جریان", en: "Workflow" },
        items: [
          { fa: "ورود و Qualification سرنخ", en: "Lead intake and qualification" },
          { fa: "مالکیت و فعالیت‌ها", en: "Ownership and activities" },
          { fa: "تبدیل تراکنشی به مشتری/پروژه", en: "Transactional conversion to client/project" },
          { fa: "گزارش قیف", en: "Funnel reporting" },
        ],
      },
    ],
  },
  {
    kind: "solutions",
    slug: "ordering-system",
    eyebrow: { fa: "راهکار / عملیات", en: "Solution / Operations" },
    title: { fa: "سامانه سفارش‌گیری", en: "Ordering system" },
    summary: {
      fa: "ثبت، اعتبارسنجی و پیگیری سفارش برای مشتری، نماینده یا تیم فروش.",
      en: "Capture, validate and track orders for customers, dealers or sales teams.",
    },
    sections: [
      {
        title: { fa: "نقش‌ها", en: "Roles" },
        items: [
          { fa: "مشتری یا نماینده", en: "Customer or dealer" },
          { fa: "فروش و تایید", en: "Sales and approval" },
          { fa: "انبار و ارسال", en: "Inventory and fulfilment" },
          { fa: "مدیریت", en: "Management" },
        ],
      },
    ],
  },
  {
    kind: "solutions",
    slug: "customer-portal",
    eyebrow: { fa: "راهکار / تجربه", en: "Solution / Experience" },
    title: { fa: "پنل مشتری", en: "Customer portal" },
    summary: {
      fa: "نمای واحد پروژه‌ها، فایل‌ها، تاییدها، صورتحساب‌ها و پشتیبانی.",
      en: "One secure view of projects, files, approvals, invoices and support.",
    },
    sections: [
      {
        title: { fa: "امنیت", en: "Security" },
        body: {
          fa: "دسترسی هر رکورد با عضویت مشتری و Policy سروری بررسی می‌شود.",
          en: "Every record is authorised server-side against client and project membership.",
        },
      },
    ],
  },
  {
    kind: "solutions",
    slug: "management-dashboard",
    eyebrow: { fa: "راهکار / داده", en: "Solution / Data" },
    title: { fa: "داشبورد مدیریتی", en: "Management dashboard" },
    summary: {
      fa: "شاخص‌های عملیاتی از دادهٔ واقعی، با تعریف روشن و امکان پیگیری منبع.",
      en: "Operational indicators derived from real data with explicit definitions and traceable sources.",
    },
    sections: [
      {
        title: { fa: "قاعده", en: "Rule" },
        body: {
          fa: "نمودار ساختگی یا عدد نمایشی جای دادهٔ واقعی را نمی‌گیرد؛ وضعیت بدون داده صادقانه نمایش داده می‌شود.",
          en: "Decorative metrics never replace real data; empty states are shown honestly.",
        },
      },
    ],
  },
  {
    kind: "solutions",
    slug: "warranty-portal",
    eyebrow: { fa: "راهکار / پس از فروش", en: "Solution / After-sales" },
    title: { fa: "پرتال گارانتی و خدمات", en: "Warranty and service portal" },
    summary: {
      fa: "ثبت محصول، اعتبار گارانتی، درخواست خدمت و پیگیری تیکت در یک مسیر.",
      en: "Product registration, warranty validity, service requests and support tickets in one flow.",
    },
    sections: [
      {
        title: { fa: "قابلیت‌ها", en: "Capabilities" },
        items: [
          { fa: "ثبت و تایید محصول", en: "Product registration and verification" },
          { fa: "قواعد گارانتی", en: "Warranty rules" },
          { fa: "تیکت و فایل پیوست", en: "Tickets and attachments" },
          { fa: "گزارش خدمات", en: "Service reporting" },
        ],
      },
    ],
  },
  {
    kind: "problems",
    slug: "stalled-project",
    eyebrow: { fa: "تشخیص / توقف", en: "Diagnosis / Stalled" },
    title: { fa: "پروژه متوقف یا نیمه‌کاره است", en: "The project is stalled or unfinished" },
    summary: {
      fa: "ابتدا قابلیت ادامهٔ امن را می‌سنجیم؛ بازنویسی فقط وقتی پیشنهاد می‌شود که شواهد آن را توجیه کنند.",
      en: "We first test whether safe continuation is viable; rebuilding is recommended only when evidence supports it.",
    },
    sections: [
      {
        title: { fa: "آنچه بررسی می‌کنیم", en: "What we check" },
        items: [
          { fa: "قابلیت اجرا و استقرار", en: "Runtime and deployment" },
          { fa: "مالکیت و کیفیت کد", en: "Code ownership and quality" },
          { fa: "امنیت و یکپارچگی داده", en: "Security and data integrity" },
          { fa: "هزینهٔ ادامه در برابر بازسازی", en: "Continuation versus rebuild cost" },
        ],
      },
    ],
  },
  {
    kind: "problems",
    slug: "slow-website",
    eyebrow: { fa: "تشخیص / سرعت", en: "Diagnosis / Performance" },
    title: { fa: "سایت کند است", en: "The website is slow" },
    summary: {
      fa: "اندازه‌گیری واقعی شبکه، سرور، پایگاه‌داده و رندر پیش از هر بهینه‌سازی.",
      en: "Measure network, server, database and rendering behaviour before optimising.",
    },
    sections: [
      {
        title: { fa: "علت‌های محتمل", en: "Likely causes" },
        items: [
          { fa: "تصویر و JavaScript سنگین", en: "Heavy images and JavaScript" },
          { fa: "Query یا Cache نامناسب", en: "Poor queries or caching" },
          { fa: "رندر Client-side غیرضروری", en: "Unnecessary client rendering" },
          { fa: "زیرساخت یا تنظیمات نادرست", en: "Infrastructure or configuration issues" },
        ],
      },
    ],
  },
  {
    kind: "problems",
    slug: "low-organic-visibility",
    eyebrow: { fa: "تشخیص / دیده‌شدن", en: "Diagnosis / Visibility" },
    title: { fa: "در جست‌وجو دیده نمی‌شویم", en: "We are not visible in search" },
    summary: {
      fa: "خزش، معماری محتوا، قصد جست‌وجو و کیفیت تجربه را کنار هم بررسی می‌کنیم.",
      en: "We examine crawling, content architecture, search intent and experience together.",
    },
    sections: [
      {
        title: { fa: "خروجی Audit", en: "Audit output" },
        items: [
          { fa: "مشکلات فنی اولویت‌بندی‌شده", en: "Prioritised technical issues" },
          { fa: "نقشه محتوای قابل دفاع", en: "Defensible content map" },
          { fa: "معیارهای اندازه‌گیری", en: "Measurement criteria" },
        ],
      },
    ],
  },
  {
    kind: "problems",
    slug: "disconnected-systems",
    eyebrow: { fa: "تشخیص / اتصال", en: "Diagnosis / Integration" },
    title: { fa: "سیستم‌ها از هم جدا هستند", en: "Systems are disconnected" },
    summary: {
      fa: "ورود تکراری داده و وضعیت‌های متناقض را با قرارداد داده و جریان قابل بازیابی حذف می‌کنیم.",
      en: "Remove duplicate entry and conflicting state through explicit contracts and recoverable flows.",
    },
    sections: [
      {
        title: { fa: "بررسی", en: "Assessment" },
        items: [
          { fa: "منبع حقیقت", en: "Source of truth" },
          { fa: "جهت و زمان تبادل", en: "Direction and timing" },
          { fa: "خطا، Retry و Reconciliation", en: "Failure, retry and reconciliation" },
        ],
      },
    ],
  },
  {
    kind: "problems",
    slug: "manual-operations",
    eyebrow: { fa: "تشخیص / عملیات", en: "Diagnosis / Operations" },
    title: { fa: "فرآیندها دستی و پراکنده‌اند", en: "Operations are manual and fragmented" },
    summary: {
      fa: "نقاط تصمیم و تکرار را مدل می‌کنیم و فقط بخش‌هایی را خودکار می‌کنیم که ارزش روشن دارند.",
      en: "We model decisions and repetition, automating only the steps with clear value.",
    },
    sections: [
      {
        title: { fa: "نشانه‌ها", en: "Symptoms" },
        items: [
          { fa: "فایل‌های اکسل متعدد", en: "Multiple spreadsheets" },
          { fa: "پیگیری در پیام‌رسان", en: "Follow-up in chat tools" },
          { fa: "نبود تاریخچه تصمیم", en: "No decision history" },
          { fa: "گزارش دیرهنگام", en: "Late reporting" },
        ],
      },
    ],
  },
  ...[
    [
      "manufacturing",
      "تولید و کارخانه",
      "Manufacturing",
      "سفارش، تولید و گزارش عملیاتی",
      "Orders, production and operational reporting",
    ],
    [
      "trade-export",
      "بازرگانی و صادرات",
      "Trade and export",
      "کاتالوگ دوزبانه، استعلام و پیگیری فروش",
      "Bilingual catalogues, enquiries and sales follow-up",
    ],
    [
      "industrial-equipment",
      "تجهیزات صنعتی",
      "Industrial equipment",
      "جست‌وجوی فنی، استعلام و خدمات پس از فروش",
      "Technical search, quotation and after-sales service",
    ],
    [
      "online-retail",
      "فروشگاه‌های آنلاین",
      "Online retail",
      "سرعت، تبدیل، سفارش و وفاداری",
      "Performance, conversion, orders and retention",
    ],
    [
      "healthcare",
      "پزشکی و کلینیک",
      "Healthcare",
      "نوبت، ظرفیت و ارتباط امن با مراجع",
      "Scheduling, capacity and secure client communication",
    ],
    [
      "automotive",
      "خودرو و لوازم یدکی",
      "Automotive",
      "سازگاری قطعه، انبار و شبکه نمایندگان",
      "Part compatibility, inventory and dealer networks",
    ],
    [
      "education",
      "آموزش",
      "Education",
      "ثبت‌نام، محتوا و مسیر یادگیری",
      "Enrolment, content and learning journeys",
    ],
    [
      "real-estate",
      "املاک",
      "Real estate",
      "فایل، جست‌وجو و مدیریت سرنخ",
      "Listings, search and lead management",
    ],
  ].map(([slug, faTitle, enTitle, faSummary, enSummary]) => ({
    kind: "industries" as const,
    slug: slug!,
    eyebrow: { fa: "صنعت", en: "Industry" },
    title: { fa: faTitle!, en: enTitle! },
    summary: { fa: faSummary!, en: enSummary! },
    sections: [
      {
        title: { fa: "چالش", en: "Challenge" },
        body: {
          fa: "فرآیند، داده و نقش‌های این صنعت باید پیش از انتخاب راهکار دقیق مدل شوند.",
          en: "The market's workflows, data and roles must be modelled before selecting a solution.",
        },
      },
      {
        title: { fa: "مسیر پیشنهادی", en: "Recommended path" },
        items: [
          { fa: "شناخت جریان فعلی", en: "Map the current flow" },
          { fa: "تعیین گلوگاه و معیار موفقیت", en: "Define the bottleneck and success criteria" },
          { fa: "اجرای مرحله‌ای", en: "Deliver incrementally" },
        ],
      },
    ],
  })),
  ...[
    ["accounting", "اتصال حسابداری", "Accounting integration"],
    ["inventory", "اتصال انبار", "Inventory integration"],
    ["crm", "اتصال CRM", "CRM integration"],
    ["payment", "اتصال پرداخت", "Payment integration"],
  ].map(([slug, faTitle, enTitle]) => ({
    kind: "integrations" as const,
    slug: slug!,
    eyebrow: { fa: "یکپارچه‌سازی", en: "Integration" },
    title: { fa: faTitle!, en: enTitle! },
    summary: {
      fa: "تبادل داده با قرارداد روشن، امنیت، ثبت خطا و امکان بازیابی.",
      en: "Data exchange with clear contracts, security, failure logging and recovery.",
    },
    sections: [
      {
        title: { fa: "طراحی جریان", en: "Flow design" },
        items: [
          { fa: "سیستم مبدا و مقصد", en: "Source and destination" },
          { fa: "داده و جهت تبادل", en: "Data and direction" },
          { fa: "Trigger و زمان‌بندی", en: "Triggers and timing" },
          { fa: "Retry و Reconciliation", en: "Retry and reconciliation" },
        ],
      },
      {
        title: { fa: "امنیت", en: "Security" },
        body: {
          fa: "اعتبارنامه‌ها فقط سمت سرور نگهداری می‌شوند و دسترسی‌ها کمینه هستند.",
          en: "Credentials remain server-side and every integration uses least privilege.",
        },
      },
    ],
  })),
  ...[
    [
      "dealer-ordering-concept",
      "سامانه سفارش‌گیری نمایندگان",
      "Dealer ordering system",
      "ثبت سفارش تلفنی و فایل‌های پراکنده",
      "Phone orders and fragmented files",
      "پنل نقش‌محور با قیمت‌گذاری و وضعیت سفارش",
      "A role-based portal with pricing and order states",
    ],
    [
      "ecommerce-redesign-concept",
      "بازطراحی فروشگاه اینترنتی",
      "Ecommerce redesign",
      "ساختار دسته‌بندی و سرعت نامناسب",
      "Weak category structure and performance",
      "معماری اطلاعات، سرعت و سئوی فروشگاهی",
      "Information architecture, performance and ecommerce SEO",
    ],
    [
      "after-sales-concept",
      "پرتال خدمات پس از فروش",
      "After-sales portal",
      "درخواست‌های گارانتی در کانال‌های پراکنده",
      "Warranty requests spread across channels",
      "ثبت محصول، گارانتی و تیکتینگ یکپارچه",
      "Integrated product registration, warranty and ticketing",
    ],
  ].map(([slug, faTitle, enTitle, faProblem, enProblem, faSolution, enSolution]) => ({
    kind: "projects" as const,
    slug: slug!,
    eyebrow: { fa: "مطالعه مفهومی — بدون مشتری واقعی", en: "Concept study — no real client" },
    title: { fa: faTitle!, en: enTitle! },
    summary: {
      fa: `${faProblem}؛ مسیر پیشنهادی: ${faSolution}.`,
      en: `${enProblem}; proposed direction: ${enSolution}.`,
    },
    conceptual: true,
    sections: [
      {
        title: { fa: "مسئله مفهومی", en: "Conceptual problem" },
        body: { fa: faProblem!, en: enProblem! },
      },
      {
        title: { fa: "راهکار مفهومی", en: "Conceptual solution" },
        body: { fa: faSolution!, en: enSolution! },
      },
      {
        title: { fa: "یادداشت شفافیت", en: "Transparency note" },
        body: {
          fa: "این سناریو برای توضیح نوع مسئله و معماری تهیه شده و ادعای پروژه، مشتری یا نتیجه واقعی نیست.",
          en: "This scenario explains a problem and architecture pattern; it is not a claim about a real client, delivery or result.",
        },
      },
    ],
  })),
  {
    kind: "blog",
    slug: "how-to-audit-a-stalled-software-project",
    eyebrow: { fa: "مهندسی / راهنما", en: "Engineering / Guide" },
    title: {
      fa: "ممیزی یک پروژه نرم‌افزاری متوقف‌شده از کجا شروع می‌شود؟",
      en: "Where should a stalled software audit begin?",
    },
    summary: {
      fa: "یک چارچوب عملی برای جداکردن مشکل محیط، معماری، امنیت و فرآیند تحویل.",
      en: "A practical framework for separating environment, architecture, security and delivery problems.",
    },
    sections: [
      {
        title: { fa: "اول بازتولید، بعد قضاوت", en: "Reproduce before judging" },
        body: {
          fa: "نسخه موجود را با همان وابستگی‌ها اجرا کنید، خطاها را ثبت کنید و میان خرابی محیط و نقص کد تفاوت بگذارید.",
          en: "Run the existing version with its declared dependencies, record failures and separate environment problems from code defects.",
        },
      },
      {
        title: { fa: "ریسک‌ها را دسته‌بندی کنید", en: "Classify risk" },
        items: [
          { fa: "امنیت و از دست‌رفتن داده", en: "Security and data loss" },
          { fa: "قابلیت Build و استقرار", en: "Build and deployment" },
          { fa: "مالکیت و دسترسی‌ها", en: "Ownership and access" },
          { fa: "تجربه کاربر و رفتار محصول", en: "User experience and product behaviour" },
        ],
      },
      {
        title: { fa: "تصمیم مستند", en: "Document the decision" },
        body: {
          fa: "ادامه، اصلاح یا بازسازی باید بر اساس هزینه و ریسک سنجیده شود، نه ترجیح شخصی نسبت به یک فریم‌ورک.",
          en: "Continue, correct or rebuild based on cost and risk—not personal preference for a framework.",
        },
      },
    ],
  },
];

export function localize(text: LocalizedText, locale: Locale): string {
  return text[locale] || text.fa;
}

export function getCatalogEntries(kind: CatalogKind): CatalogEntry[] {
  return entries.filter((entry) => entry.kind === kind);
}

export function getCatalogEntry(kind: CatalogKind, slug: string): CatalogEntry | undefined {
  return entries.find((entry) => entry.kind === kind && entry.slug === slug);
}

export function isCatalogKind(value: string): value is CatalogKind {
  return catalogKinds.some((kind) => kind === value);
}

export function allCatalogEntries(): readonly CatalogEntry[] {
  return entries;
}
