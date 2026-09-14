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
      fa: "هر چیزی که برای ساختن، درست‌کردن یا رشد محصولتان لازم دارید",
      en: "Engineering paths to build, rescue and grow",
    },
    lead: {
      fa: "اول می‌شنویم الان کجای کارید و چه چیزی اذیتتان می‌کند؛ بعد درباره ابزار و مسیر اجرا تصمیم می‌گیریم.",
      en: "We start with the business situation, then choose the tools, architecture and delivery scope.",
    },
  },
  solutions: {
    eyebrow: { fa: "راهکارها", en: "Solutions" },
    title: {
      fa: "ابزاری که واقعاً با مدل کار شما جور درمی‌آید",
      en: "Systems designed around real operating workflows",
    },
    lead: {
      fa: "قرار نیست کارتان را به زور داخل یک نرم‌افزار آماده جا بدهید. سیستم را دور آدم‌ها و روند واقعی کسب‌وکارتان می‌چینیم.",
      en: "We do not force a packaged answer; capabilities follow roles, data and the actual workflow.",
    },
  },
  problems: {
    eyebrow: { fa: "مشکلات رایج", en: "Problems" },
    title: {
      fa: "لازم نیست اسم فنی مشکل را بدانید",
      en: "Start with the symptom, not a technology name",
    },
    lead: {
      fa: "فقط بگویید کجای کار گیر کرده؛ سایت کند است، پروژه خوابیده یا کارها با اکسل و پیام جلو می‌رود. پیدا کردن علت با ما.",
      en: "We diagnose slowness, failure, stalled delivery and manual work before prescribing a solution.",
    },
  },
  industries: {
    eyebrow: { fa: "صنایع", en: "Industries" },
    title: {
      fa: "هر کسب‌وکاری ابزار خودش را می‌خواهد",
      en: "Technology aligned with the business model",
    },
    lead: {
      fa: "فروشگاه، کارخانه و کلینیک شبیه هم کار نمی‌کنند. قبل از ساخت، با قواعد و دردسرهای صنعت شما آشنا می‌شویم.",
      en: "Every market has distinct rules, data and friction points; the architecture should reflect them.",
    },
  },
  integrations: {
    eyebrow: { fa: "یکپارچه‌سازی", en: "Integrations" },
    title: {
      fa: "سیستم‌هایتان را با هم آشتی بدهید",
      en: "Connect separate systems into one dependable flow",
    },
    lead: {
      fa: "اطلاعات را یک‌بار وارد کنید و بگذارید بین حسابداری، انبار، سایت و CRM درست جابه‌جا شود؛ حتی وقتی یکی از سرویس‌ها خطا می‌دهد.",
      en: "Data ownership, direction, failure and recovery are designed up front so an API is not a fragile bridge.",
    },
  },
  projects: {
    eyebrow: { fa: "مطالعات مفهومی", en: "Concept studies" },
    title: {
      fa: "چند مسئله واقعی، با راه‌حل‌های قابل تصور",
      en: "Problem, decision and architecture",
    },
    lead: {
      fa: "فعلاً اینجا چند سناریوی شفاف و مفهومی می‌بینید؛ نه اسم مشتری ساختگی داریم، نه عددی که نتوانیم ثابتش کنیم.",
      en: "Until real work is approved for publication, this archive contains clearly labelled concepts with no invented client or metric.",
    },
  },
  blog: {
    eyebrow: { fa: "مجله رای‌کد", en: "RYCODE Journal" },
    title: {
      fa: "چیزهایی که موقع ساختن و بهترکردن محصول یاد گرفته‌ایم",
      en: "Notes on engineering, product and growth",
    },
    lead: {
      fa: "یادداشت‌های کوتاه و کاربردی درباره سایت، نرم‌افزار و رشد؛ از همان چیزهایی که در کار واقعی به درد می‌خورند.",
      en: "Practical writing on building, maintaining and growing digital products—without invented evidence.",
    },
  },
};

const commonProcess: CatalogSection = {
  title: { fa: "چطور جلو می‌رویم؟", en: "Delivery process" },
  items: [
    {
      fa: "اول مسئله و محدودیت‌ها را با هم روشن می‌کنیم",
      en: "Understand the problem and constraints",
    },
    {
      fa: "روی نسخه اول، زمان‌بندی و خط قرمزها توافق می‌کنیم",
      en: "Define scope, acceptance criteria and risks",
    },
    {
      fa: "مرحله‌به‌مرحله می‌سازیم، تست می‌کنیم و نشانتان می‌دهیم",
      en: "Design, implement and verify incrementally",
    },
    {
      fa: "با خیال راحت منتشر می‌کنیم و بعد بهترش می‌کنیم",
      en: "Release deliberately and improve continuously",
    },
  ],
};

const entries: CatalogEntry[] = [
  {
    kind: "services",
    slug: "web-development",
    eyebrow: { fa: "خدمت / وب", en: "Service / Web" },
    title: { fa: "طراحی و توسعه وب", en: "Web design and development" },
    summary: {
      fa: "سایتی که سریع باز شود، راحت فهمیده شود و با بزرگ‌شدن کسب‌وکارتان کم نیاورد.",
      en: "Fast, accessible websites and web applications designed for content-led growth from day one.",
    },
    sections: [
      {
        title: { fa: "این سرویس به درد چه کاری می‌خورد؟", en: "What it solves" },
        body: {
          fa: "وقتی سایت قرار است فقط یک کارت ویزیت نباشد؛ باید مشتری بیاورد، محتوا را خوب نشان بدهد و بعداً هم بتوانید گسترشش دهید.",
          en: "For websites that must support sales and communication while remaining a maintainable product foundation.",
        },
      },
      {
        title: { fa: "آخر کار چه چیزی تحویل می‌گیرید؟", en: "Deliverables" },
        items: [
          { fa: "ساختاری که کاربر در آن گم نشود", en: "Information architecture and UX" },
          {
            fa: "نمای درست روی موبایل، تبلت و دسکتاپ",
            en: "Responsive, accessible implementation",
          },
          {
            fa: "پایه فنی سالم برای سرعت و دیده‌شدن در گوگل",
            en: "Technical SEO and Core Web Vitals",
          },
          {
            fa: "راه ساده برای مدیریت محتوا، همراه با توضیحات لازم",
            en: "Content management and documentation",
          },
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
      fa: "فروشگاهی که خرید را برای مشتری ساده و جمع‌کردن سفارش‌ها را برای تیم شما راحت کند.",
      en: "Buying experience, product management and order operations shaped around the real sales model.",
    },
    sections: [
      {
        title: { fa: "چه بخش‌هایی می‌تواند داشته باشد؟", en: "Scope" },
        items: [
          {
            fa: "محصول‌ها و جست‌وجویی که واقعاً به پیدا کردن کمک کند",
            en: "Product catalog and search",
          },
          {
            fa: "سبد خرید، سفارش و پرداخت بدون مسیرهای گیج‌کننده",
            en: "Basket, order and payment state",
          },
          {
            fa: "پنل مشتری و یک فضای مرتب برای مدیریت سفارش‌ها",
            en: "Customer portal and internal operations",
          },
          {
            fa: "اگر لازم باشد، اتصال مستقیم به انبار و حسابداری",
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
      fa: "وقتی نرم‌افزارهای آماده به مدل کارتان نمی‌خورند، ابزار مخصوص خودتان را می‌سازیم.",
      en: "Portals, systems and internal tools for workflows that off-the-shelf software cannot fit.",
    },
    sections: [
      {
        title: { fa: "از کجا شروع می‌کنیم؟", en: "Approach" },
        body: {
          fa: "اول می‌بینیم چه کسی چه کاری انجام می‌دهد، اطلاعات از کجا می‌آید و کجا تصمیم گرفته می‌شود؛ انتخاب تکنولوژی بعد از این‌هاست.",
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
      fa: "پروژه نیمه‌کاره را بررسی می‌کنیم تا بفهمیم بهتر است ادامه‌اش بدهیم، تعمیرش کنیم یا فقط بخش‌های خراب را از نو بسازیم.",
      en: "A code and infrastructure audit to choose deliberately between continuation, correction and targeted rebuilding.",
    },
    sections: [
      {
        title: { fa: "دقیقاً چه چیزهایی را نگاه می‌کنیم؟", en: "What we inspect" },
        items: [
          { fa: "وضعیت کلی کد و امنیت", en: "Architecture and security" },
          {
            fa: "اینکه پروژه واقعاً اجرا، تست و منتشر می‌شود یا نه",
            en: "Build, test and deployment readiness",
          },
          { fa: "ریسک‌های فنی و احتمال آسیب‌دیدن اطلاعات", en: "Technical debt and data risk" },
          {
            fa: "کوتاه‌ترین راه امن برای راه‌انداختن دوباره پروژه",
            en: "Shortest safe route back to delivery",
          },
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
      fa: "سایت، انبار، حسابداری و ابزارهای دیگر را طوری وصل می‌کنیم که اطلاعات بینشان گم یا دوباره‌کاری نشود.",
      en: "Connect systems with explicit data contracts, security, observability and failure recovery.",
    },
    sections: [
      {
        title: { fa: "چیزهایی که حواسمان به آن‌هاست", en: "Principles" },
        items: [
          { fa: "معلوم باشد نسخه اصلی هر اطلاعات کجاست", en: "Explicit source of truth" },
          {
            fa: "اگر ارتباط قطع شد، اطلاعات دوباره و اشتباه ثبت نشود",
            en: "Idempotency and controlled retry",
          },
          {
            fa: "خطاها ثبت شوند و قبل از دردسر جدی خبردار شویم",
            en: "Event logging and failure alerts",
          },
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
      fa: "کمک می‌کنیم گوگل سایتتان را درست بفهمد و شما هم بدانید کدام کار واقعاً نتیجه داده است.",
      en: "Content architecture, technical health and first-party measurement for accountable growth.",
    },
    sections: [
      {
        title: { fa: "روی چه چیزهایی کار می‌کنیم؟", en: "Areas" },
        items: [
          {
            fa: "اینکه گوگل صفحه‌ها را پیدا کند و درست بشناسد",
            en: "Crawling, indexing and metadata",
          },
          {
            fa: "ساختار محتوا و ارتباط درست بین صفحه‌ها",
            en: "Content structure and internal linking",
          },
          {
            fa: "سرعت سایت و تجربه‌ای که کاربر واقعاً حس می‌کند",
            en: "Performance and page experience",
          },
          {
            fa: "اندازه‌گیری مسیر مشتری، بدون حدس و عددهای تزئینی",
            en: "First-party funnels and attribution",
          },
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
      fa: "بعد از انتشار هم کنارتان می‌مانیم؛ از رفع خطا و نگهداری تا اضافه‌کردن قابلیت‌های بعدی.",
      en: "Issue resolution, maintenance, monitoring and incremental delivery with explicit priorities.",
    },
    sections: [
      {
        title: { fa: "همکاری چطور پیش می‌رود؟", en: "Engagement model" },
        body: {
          fa: "درخواست‌ها یک‌جا ثبت می‌شوند، با هم اولویت می‌دهیم و همیشه می‌دانید هر کار الان در چه وضعیتی است.",
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
      fa: "محصول، سفارش و مشتری را یک‌جا مدیریت کنید؛ بدون اینکه با بیشترشدن فروش همه‌چیز به‌هم بریزد.",
      en: "Products, orders, customers and sales operations in one extensible flow.",
    },
    sections: [
      {
        title: { fa: "از چه بخش‌هایی تشکیل می‌شود؟", en: "Core capabilities" },
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
      fa: "از اولین پیام تا خرید و پیگیری‌های بعدی، هیچ مشتری بین تماس‌ها و یادداشت‌ها گم نمی‌شود.",
      en: "From first contact through conversion and continued relationship, with a dependable history.",
    },
    sections: [
      {
        title: { fa: "مسیر کار", en: "Workflow" },
        items: [
          { fa: "ثبت سرنخ و تشخیص اینکه چقدر جدی است", en: "Lead intake and qualification" },
          { fa: "معلوم‌بودن مسئول هر مشتری و کارهای انجام‌شده", en: "Ownership and activities" },
          {
            fa: "تبدیل ساده سرنخ به مشتری یا پروژه",
            en: "Transactional conversion to client/project",
          },
          { fa: "دیدن اینکه مشتری‌ها در کجای مسیر فروش هستند", en: "Funnel reporting" },
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
      fa: "مشتری یا نماینده سفارش را راحت ثبت می‌کند و تیم شما هم تا لحظه ارسال همه‌چیز را می‌بیند.",
      en: "Capture, validate and track orders for customers, dealers or sales teams.",
    },
    sections: [
      {
        title: { fa: "چه کسانی با آن کار می‌کنند؟", en: "Roles" },
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
      fa: "یک جای مرتب برای دیدن پروژه‌ها، فایل‌ها، تأییدها، صورتحساب‌ها و درخواست‌های پشتیبانی.",
      en: "One secure view of projects, files, approvals, invoices and support.",
    },
    sections: [
      {
        title: { fa: "هر کسی فقط چیزهای مربوط به خودش را می‌بیند", en: "Security" },
        body: {
          fa: "دسترسی‌ها سمت سرور بررسی می‌شوند؛ یعنی هر مشتری فقط اطلاعات و پروژه‌های مربوط به خودش را می‌بیند.",
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
      fa: "عددهای مهم کسب‌وکارتان را یک‌جا و به زبان قابل فهم ببینید؛ با منبع مشخص برای هر عدد.",
      en: "Operational indicators derived from real data with explicit definitions and traceable sources.",
    },
    sections: [
      {
        title: { fa: "یک اصل ساده", en: "Rule" },
        body: {
          fa: "نمودار قشنگ جای اطلاعات واقعی را نمی‌گیرد. اگر هنوز داده کافی نداریم، همان را شفاف نشان می‌دهیم.",
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
      fa: "مشتری محصولش را ثبت می‌کند، وضعیت گارانتی را می‌بیند و درخواستش را بدون تماس‌های تکراری پیگیری می‌کند.",
      en: "Product registration, warranty validity, service requests and support tickets in one flow.",
    },
    sections: [
      {
        title: { fa: "چه کارهایی انجام می‌دهد؟", en: "Capabilities" },
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
      fa: "اول می‌بینیم همین پروژه را می‌شود سالم ادامه داد یا نه. از نو ساختن آخرین گزینه است، نه اولین پیشنهاد.",
      en: "We first test whether safe continuation is viable; rebuilding is recommended only when evidence supports it.",
    },
    sections: [
      {
        title: { fa: "اول این‌ها را بررسی می‌کنیم", en: "What we check" },
        items: [
          { fa: "آیا پروژه اجرا و منتشر می‌شود؟", en: "Runtime and deployment" },
          {
            fa: "کد دست چه کسی است و چقدر می‌شود به آن تکیه کرد؟",
            en: "Code ownership and quality",
          },
          { fa: "اطلاعات و دسترسی‌ها امن مانده‌اند؟", en: "Security and data integrity" },
          {
            fa: "ادامه‌دادن به‌صرفه‌تر است یا بازسازی بخشی از کار؟",
            en: "Continuation versus rebuild cost",
          },
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
      fa: "قبل از نصب افزونه و تغییر سرور، دقیق اندازه می‌گیریم کندی از کجاست؛ مرورگر، کد، دیتابیس یا زیرساخت.",
      en: "Measure network, server, database and rendering behaviour before optimising.",
    },
    sections: [
      {
        title: { fa: "معمولاً مشکل یکی از این‌هاست", en: "Likely causes" },
        items: [
          { fa: "تصویر و JavaScript سنگین", en: "Heavy images and JavaScript" },
          { fa: "درخواست‌های سنگین دیتابیس یا کش نامناسب", en: "Poor queries or caching" },
          {
            fa: "کاری که بی‌دلیل روی دستگاه کاربر انجام می‌شود",
            en: "Unnecessary client rendering",
          },
          { fa: "سرور ضعیف یا تنظیمات اشتباه", en: "Infrastructure or configuration issues" },
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
      fa: "بررسی می‌کنیم گوگل سایت را چطور می‌بیند، آدم‌ها دنبال چه هستند و چرا صفحه‌های شما جوابشان را نمی‌دهند.",
      en: "We examine crawling, content architecture, search intent and experience together.",
    },
    sections: [
      {
        title: { fa: "آخر بررسی چه چیزی دستتان می‌رسد؟", en: "Audit output" },
        items: [
          { fa: "فهرست مشکلات فنی، به‌ترتیب اهمیت", en: "Prioritised technical issues" },
          { fa: "نقشه محتوایی که دلیل و هدف مشخص دارد", en: "Defensible content map" },
          { fa: "چند معیار روشن برای اینکه بفهمیم بهتر شده یا نه", en: "Measurement criteria" },
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
      fa: "اطلاعات را چندبار وارد نکنید و بین دو سیستم دنبال نسخه درست نگردید؛ جریان داده را یکدست می‌کنیم.",
      en: "Remove duplicate entry and conflicting state through explicit contracts and recoverable flows.",
    },
    sections: [
      {
        title: { fa: "قبل از اتصال، این‌ها را روشن می‌کنیم", en: "Assessment" },
        items: [
          { fa: "نسخه اصلی هر اطلاعات کدام سیستم است؟", en: "Source of truth" },
          { fa: "اطلاعات چه زمانی و به کدام سمت برود؟", en: "Direction and timing" },
          {
            fa: "اگر اتصال قطع شد، چطور بدون دوباره‌کاری جبران شود؟",
            en: "Failure, retry and reconciliation",
          },
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
      fa: "کارهای تکراری را پیدا می‌کنیم و فقط همان جاهایی را خودکار می‌کنیم که واقعاً وقت یا خطا را کم می‌کند.",
      en: "We model decisions and repetition, automating only the steps with clear value.",
    },
    sections: [
      {
        title: { fa: "اگر این‌ها آشناست، احتمالاً وقت تغییر رسیده", en: "Symptoms" },
        items: [
          { fa: "فایل‌های اکسل متعدد", en: "Multiple spreadsheets" },
          { fa: "پیگیری در پیام‌رسان", en: "Follow-up in chat tools" },
          { fa: "کسی یادش نیست یک تصمیم چرا گرفته شده", en: "No decision history" },
          { fa: "گزارشی که وقتی می‌رسد دیگر دیر شده", en: "Late reporting" },
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
        title: { fa: "اصل ماجرا چیست؟", en: "Challenge" },
        body: {
          fa: "قبل از پیشنهاد هر ابزاری، باید بفهمیم کار در این صنعت واقعاً چطور جلو می‌رود، چه اطلاعاتی مهم است و چه کسی تصمیم می‌گیرد.",
          en: "The market's workflows, data and roles must be modelled before selecting a solution.",
        },
      },
      {
        title: { fa: "پیشنهاد می‌کنیم این‌طور شروع کنیم", en: "Recommended path" },
        items: [
          { fa: "ببینیم کار امروز چطور انجام می‌شود", en: "Map the current flow" },
          {
            fa: "بزرگ‌ترین دردسر و نشانه موفقیت را مشخص کنیم",
            en: "Define the bottleneck and success criteria",
          },
          {
            fa: "از یک بخش کوچک شروع کنیم و مرحله‌به‌مرحله جلو برویم",
            en: "Deliver incrementally",
          },
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
      fa: "اطلاعات بین دو سیستم درست و امن جابه‌جا می‌شود و اگر خطایی پیش بیاید، قابل پیگیری و جبران است.",
      en: "Data exchange with clear contracts, security, failure logging and recovery.",
    },
    sections: [
      {
        title: { fa: "اول مسیر اطلاعات را روشن می‌کنیم", en: "Flow design" },
        items: [
          { fa: "اطلاعات از کجا می‌آید و کجا می‌رود؟", en: "Source and destination" },
          { fa: "دقیقاً چه چیزی باید جابه‌جا شود؟", en: "Data and direction" },
          { fa: "چه اتفاقی انتقال را شروع می‌کند و هر چند وقت یک‌بار؟", en: "Triggers and timing" },
          { fa: "اگر وسط کار خطا شد، چطور دوباره ادامه بدهیم؟", en: "Retry and reconciliation" },
        ],
      },
      {
        title: { fa: "دسترسی‌ها امن می‌مانند", en: "Security" },
        body: {
          fa: "کلیدها و رمزها داخل مرورگر یا کد عمومی نمی‌مانند و هر اتصال فقط به چیزهایی دسترسی دارد که واقعاً لازم است.",
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
    eyebrow: { fa: "یک سناریوی فرضی، نه پروژه واقعی", en: "Concept study — no real client" },
    title: { fa: faTitle!, en: enTitle! },
    summary: {
      fa: `${faProblem}؛ مسیر پیشنهادی: ${faSolution}.`,
      en: `${enProblem}; proposed direction: ${enSolution}.`,
    },
    conceptual: true,
    sections: [
      {
        title: { fa: "داستان از چه قرار است؟", en: "Conceptual problem" },
        body: { fa: faProblem!, en: enProblem! },
      },
      {
        title: { fa: "چه راهی برایش داریم؟", en: "Conceptual solution" },
        body: { fa: faSolution!, en: enSolution! },
      },
      {
        title: { fa: "یک توضیح صادقانه", en: "Transparency note" },
        body: {
          fa: "این فقط یک مثال برای نشان‌دادن مدل فکر و راه‌حل ماست؛ پشت آن مشتری، قرارداد یا نتیجه ساختگی وجود ندارد.",
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
      fa: "یک پروژه نرم‌افزاری نیمه‌کاره را از کجا باید جمع‌وجور کرد؟",
      en: "Where should a stalled software audit begin?",
    },
    summary: {
      fa: "یک راهنمای عملی برای اینکه بفهمیم مشکل از محیط اجراست، کد است، امنیت است یا شیوه تحویل.",
      en: "A practical framework for separating environment, architecture, security and delivery problems.",
    },
    sections: [
      {
        title: { fa: "اول اجراش کنیم، بعد درباره‌اش نظر بدهیم", en: "Reproduce before judging" },
        body: {
          fa: "نسخه فعلی را با همان وابستگی‌ها بالا بیاورید، خطاها را یادداشت کنید و ببینید ایراد واقعاً از کد است یا فقط محیط اجرا درست تنظیم نشده.",
          en: "Run the existing version with its declared dependencies, record failures and separate environment problems from code defects.",
        },
      },
      {
        title: { fa: "ببینیم کدام مشکل خطرناک‌تر است", en: "Classify risk" },
        items: [
          { fa: "امنیت و از دست‌رفتن داده", en: "Security and data loss" },
          { fa: "قابلیت Build و استقرار", en: "Build and deployment" },
          { fa: "مالکیت و دسترسی‌ها", en: "Ownership and access" },
          { fa: "تجربه کاربر و رفتار محصول", en: "User experience and product behaviour" },
        ],
      },
      {
        title: { fa: "تصمیمی بگیریم که بشود از آن دفاع کرد", en: "Document the decision" },
        body: {
          fa: "ادامه‌دادن، تعمیر یا بازسازی باید با توجه به هزینه و ریسک انتخاب شود؛ نه اینکه چه کسی کدام فریم‌ورک را بیشتر دوست دارد.",
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
