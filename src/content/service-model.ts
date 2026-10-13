import type { CatalogEntry, CatalogSection, LocalizedText } from "./catalog";
import type { Locale } from "@/i18n/routing";
import { serviceHighlights } from "./service-offerings";
export { serviceHighlights } from "./service-offerings";

const l = (fa: string, en: string): LocalizedText => ({ fa, en });

const serviceTitles: Record<string, LocalizedText> = {
  "web-development": l("طراحی سایت", "Website design & development"),
  ecommerce: l("طراحی فروشگاه اینترنتی", "Ecommerce development"),
  "mobile-app-development": l("طراحی اپلیکیشن موبایل", "Mobile app development"),
  ...Object.fromEntries(serviceHighlights.filter(service => service.slug !== "web-development").map(service => [service.slug, service.title])),
};

export const serviceFAQs = [
  { question: l("برای شروع چی لازم داریم؟", "What do we need to get started?"), answer: l("کوتاه بگو چه چیزی می‌خواهی بسازی یا کجای کار گیر کرده. اگر سایت یا پروژه‌ای داری، آدرس و وضعیتش را هم بفرست؛ با هم قدم بعدی را مشخص می‌کنیم", "Tell us what you want to build or what is getting in the way. Share your existing site or project if there is one, and we will work out the next step together") },
  { question: l("پروژهٔ نیمه‌کاره را هم قبول می‌کنید؟", "Can you take over an unfinished project?"), answer: l("بله؛ اول کد، دسترسی‌ها و محیط اجرا را بررسی می‌کنیم. بعد می‌گوییم کدام بخش‌ها قابل ادامه‌اند و کجا تعمیر یا بازسازی منطقی‌تر است؛ قرار نیست از اول همه‌چیز را دور بریزیم", "Yes. We review the code, access and runtime before explaining what can be kept and where repairs or rebuilding make sense") },
  { question: l("هزینه و زمان را چطور مشخص می‌کنید؟", "How are cost and timing estimated?"), answer: l("بعد از شناخت امکانات و اولویت‌ها، خروجی هر مرحله، زمان و هزینه را مشخص می‌کنیم. اگر پروژه بزرگ باشد، می‌توانیم از یک نسخهٔ اولِ جمع‌وجور شروع کنیم و مرحله‌ای جلو برویم", "Once features and priorities are clear, we define each phase’s deliverables, timing and cost. Larger projects can start with a focused first version") },
  { question: l("کد و دسترسی‌ها برای خودمان می‌ماند؟", "Do we retain our code and access?"), answer: l("مالکیت کد، داده، حساب‌ها و دسترسی‌های قابل تحویل از اول در توافق مشخص می‌شود. مجوز ابزارهای آماده هم جدا روشن می‌شود تا برای ادامهٔ کار به یک تیم وابسته نمانی", "Code, data, accounts and handover access are agreed from the start, with third-party licenses explained separately so ongoing work does not depend on one team") },
  { question: l("بعد از راه‌اندازی هم کنارمان هستید؟", "Can you help after launch?"), answer: l("بله؛ برای رفع خطا، نگهداری و امکانات بعدی می‌توانیم ادامه بدهیم. نوع درخواست‌ها، زمان پاسخ‌گویی و مسئولیت زیرساخت را در توافق پشتیبانی روشن می‌کنیم", "Yes. We can continue with fixes, maintenance and new features, with request types, response expectations and infrastructure responsibility defined in the support agreement") },
  { question: l("اپلیکیشن هم می‌سازید؟", "Do you build mobile apps?"), answer: l("بله؛ برای مشتری‌ها یا تیم خودت، اپ Android و iOS می‌سازیم. اگر سایت یا سامانه‌ای داری، اتصال اپ به داده‌ها و API همان سیستم را هم بررسی می‌کنیم", "Yes. We build Android and iOS apps for customers or internal teams, and review how they connect to your existing website, APIs and data") },
  { question: l("وردپرس بهتره یا سایت اختصاصی؟", "Should we use WordPress or custom development?"), answer: l("به نیازت بستگی دارد. برای خیلی از سایت‌ها و فروشگاه‌ها وردپرس انتخاب مناسبی است؛ وقتی امکانات یا روند کار ویژه‌ای لازم باشد، توسعهٔ اختصاصی را بررسی می‌کنیم. پیشنهاد را با توجه به هزینه و نگهداری توضیح می‌دهیم", "It depends on your needs. WordPress fits many sites and stores; custom development can suit specialized workflows. We explain the trade-offs in cost and maintenance") },
  { question: l("برای سئو رتبه یا فروش تضمین می‌کنید؟", "Do you guarantee SEO rankings or sales?"), answer: l("نه؛ چنین نتیجه‌ای فقط دست ما نیست. چیزی که مشخص می‌کنیم برنامهٔ کار، اصلاحات، مسئولیت محتوا و شاخص‌های گزارش‌گیری است تا بتوانی پیشرفت را با داده ببینی", "No. Those outcomes depend on more than our work. We define the roadmap, improvements, content responsibilities and reporting metrics so progress can be evaluated") },
];

export const serviceFamilies = serviceHighlights.map(service => ({
  id: service.id,
  title: service.title,
  tagline: l(service.tag, service.tag),
  description: service.summary,
  scope: service.scope,
  icon: service.preview,
  accent: service.accent,
  slugs: service.coveredSlugs,
}));

export function familyForService(slug: string) {
  return serviceFamilies.find((family) => (family.slugs as readonly string[]).includes(slug));
}

export function serviceEnquiry(slug: string) {
  if (slug === "seo-growth") return { href: "/seo-audit", label: l("سئوی سایتم را بررسی کنید", "Review my site’s SEO") };
  if (slug === "project-rescue") return { href: "/technical-review", label: l("پروژه‌ام را بررسی کنید", "Review my project") };
  if (slug === "ongoing-support") return { href: "/contact", label: l("دربارهٔ پشتیبانی حرف بزنیم", "Let’s talk about support") };
  return { href: "/start-project", label: l("دربارهٔ پروژه‌ام حرف بزنیم", "Let’s talk about my project") };
}

export function serviceExampleEntries(
  projects: CatalogEntry[],
): Partial<Record<string, CatalogEntry[]>> {
  return {
    ecommerce: projects.filter((project) => project.slug === "ecommerce-redesign-concept"),
    "custom-software": projects.filter(
      (project) =>
        project.slug === "dealer-ordering-concept" || project.slug === "after-sales-concept",
    ),
  };
}

export const additionalServices: CatalogEntry[] = [
  {
    kind: "services",
    slug: "mobile-app-development",
    eyebrow: l("خدمت / اپلیکیشن", "Service / Mobile"),
    title: l("طراحی و توسعه اپلیکیشن", "Mobile app development"),
    summary: l(
      "اپلیکیشنی برای مشتری‌ها یا تیم خودت؛ مستقل یا متصل به سایت و سیستم‌های موجود",
      "Apps for customers or your team, standalone or connected to existing websites and systems.",
    ),
    sections: [
      {
        title: l("چه اپلیکیشن‌هایی می‌سازیم؟", "What can we build?"),
        items: [
          l(
            "اپ فروشگاهی و خدماتی برای Android و iOS",
            "Commerce and service apps for Android and iOS",
          ),
          l("رزرو، نوبت‌دهی و پنل مشتری", "Booking, scheduling and customer portals"),
          l(
            "اپ کارکنان، نمایندگان و عملیات سازمانی",
            "Apps for staff, dealers and business operations",
          ),
        ],
      },
      {
        title: l("سایت و اپ، دو تجربهٔ متصل", "One connected product"),
        body: l(
          "اگر سایت یا نرم‌افزار موجود داری، قبل از ساخت اپ وضعیت API و داده‌ها را بررسی می‌کنیم تا دو سیستم جدا با اطلاعات متفاوت نسازیم",
          "When a website or system already exists, we review its APIs and data before building a disconnected app.",
        ),
      },
    ],
  },
  {
    kind: "services",
    slug: "data-analytics",
    eyebrow: l("خدمت / داده", "Service / Data"),
    title: l("داده، داشبورد و گزارش‌گیری", "Data, dashboards & reporting"),
    summary: l(
      "از فایل‌های پراکنده و گزارش دستی تا داشبوردی که بتوانی با آن تصمیم بگیری",
      "Turn fragmented files and manual reports into dashboards you can make decisions with.",
    ),
    sections: [
      {
        title: l("از کدام داده‌ها شروع می‌کنیم؟", "Where does the data come from?"),
        items: [
          l("فروش، مالی، انبار و اطلاعات عملیاتی", "Sales, finance, inventory and operations"),
          l("فایل‌های Excel و CSV و دیتابیس‌های موجود", "Existing Excel, CSV files and databases"),
          l("اطلاعات سایت، CRM و سرویس‌های دیگر", "Website, CRM and third-party service data"),
        ],
      },
      {
        title: l("ابزار متناسب با مسئله", "Choose the right tool"),
        body: l(
          "گاهی یک فایل Excel درست کافی است؛ گاهی Power BI یا یک داشبورد اختصاصی لازم می‌شود. ابزار را بعد از شناخت داده، کاربران و نیاز به‌روزرسانی انتخاب می‌کنیم",
          "A well-built spreadsheet may be enough; another project may need Power BI or a custom dashboard. The data, users and update requirements guide the choice.",
        ),
      },
    ],
  },
];

type ServiceBrief = {
  fit: LocalizedText;
  deliverables: LocalizedText[];
  factors: LocalizedText;
  support: LocalizedText;
};
export const serviceBriefs: Record<string, ServiceBrief> = {
  "web-development": {
    fit: l(
      "برای معرفی حرفه‌ای کسب‌وکار، دریافت درخواست و ساخت تجربه‌ای که کاربر در آن گم نشود",
      "For presenting your business, receiving enquiries and creating an easy-to-navigate experience.",
    ),
    deliverables: [
      l(
        "ساختار صفحات و طراحی رابط متناسب با برند",
        "Page structure and brand-aligned interface design",
      ),
      l(
        "نسخهٔ موبایل، مدیریت محتوا و فرم‌های موردنیاز",
        "Responsive implementation, content management and required forms",
      ),
      l(
        "سئوی پایه، بررسی سرعت و راهنمای مدیریت سایت",
        "Search foundations, performance checks and site management guidance",
      ),
    ],
    factors: l(
      "تعداد و نوع صفحات، محتوای آماده، امکانات اختصاصی، زبان‌ها و اتصال به سرویس‌های دیگر روی برآورد اثر دارند. WordPress یا توسعهٔ اختصاصی را بر اساس همین نیازها انتخاب می‌کنیم",
      "Page types, available content, custom features, languages and integrations affect the estimate. These needs guide the choice between WordPress and custom development.",
    ),
    support: l(
      "دامنه، هاست، حساب‌های اصلی و دسترسی مدیریت با مالکیت روشن تحویل می‌شوند؛ نگهداری و توسعهٔ بعدی دامنهٔ جداگانه دارد",
      "Domains, hosting accounts and administration access have explicit ownership. Ongoing care has a separately agreed scope.",
    ),
  },
  ecommerce: {
    fit: l(
      "برای فروش محصول، مدیریت سفارش‌ها و ساده‌ترکردن خرید برای مشتری و کار روزانهٔ تیم",
      "For selling products, managing orders and making shopping and daily operations easier.",
    ),
    deliverables: [
      l(
        "دسته‌بندی، جست‌وجو، صفحات محصول و مسیر خرید",
        "Catalogue, search, product pages and checkout",
      ),
      l(
        "مدیریت سفارش، موجودی، ارسال و پرداخت",
        "Order, inventory, shipping and payment management",
      ),
      l(
        "اتصال‌های توافق‌شده و آموزش مدیریت فروشگاه",
        "Agreed integrations and store management guidance",
      ),
    ],
    factors: l(
      "تنوع محصول، قواعد قیمت و ارسال، اتصال حسابداری و انبار، حجم انتقال اطلاعات و امکانات موردنیاز مشتری روی هزینه و زمان اثر دارند",
      "Product variety, pricing and shipping rules, accounting and inventory integrations, migration and customer features affect timing and cost.",
    ),
    support: l(
      "مسیر خرید پیش از انتشار بررسی می‌شود؛ نگهداری، خطاهای پرداخت و قابلیت‌های بعدی در توافق پشتیبانی مشخص می‌شوند",
      "The shopping flow is reviewed before release. Maintenance, payment issues and further features are defined in the support agreement.",
    ),
  },
  "custom-software": {
    fit: l(
      "وقتی ابزار آماده با روند کار تو جور نیست یا کارها بین فایل، پیام و چند نرم‌افزار پراکنده شده‌اند",
      "When packaged tools no longer fit your workflow or work is spread across files, messages and separate systems.",
    ),
    deliverables: [
      l(
        "نقشهٔ فرایند و نسخهٔ اول با امکانات مشخص",
        "Workflow map and a clearly scoped first version",
      ),
      l(
        "سیستم نقش‌محور، مدل داده و اتصال‌های لازم",
        "Role-based system, data model and required integrations",
      ),
      l(
        "کد، راهنمای اجرا و مستندات متناسب با محصول",
        "Code, deployment guidance and proportionate documentation",
      ),
    ],
    factors: l(
      "نقش‌های کاربری، قواعد کسب‌وکار، پیچیدگی داده، اتصال‌ها و انتقال از سیستم قبلی تعیین‌کننده‌اند. نسخهٔ اول را از امکانات ضروری شروع می‌کنیم",
      "User roles, business rules, data complexity, integrations and migration drive scope. The first version starts with essential capabilities.",
    ),
    support: l(
      "تحویل مرحله‌ای و معیار پذیرش از ابتدا مشخص می‌شود؛ مسیر توسعهٔ بعدی و مالکیت کد و داده هم روشن می‌ماند",
      "Milestones and acceptance criteria are agreed early, with clear code and data ownership and a path for future development.",
    ),
  },
  "mobile-app-development": {
    fit: l(
      "وقتی مشتری یا تیم باید کاری را راحت‌تر روی گوشی انجام بدهد؛ نه صرفاً برای اینکه یک اپ داشته باشی",
      "When customers or staff need a better mobile workflow, not just an app for its own sake.",
    ),
    deliverables: [
      l(
        "طراحی تجربهٔ اپ و نسخهٔ Android یا iOS طبق دامنه",
        "App experience design and Android or iOS builds as scoped",
      ),
      l(
        "اتصال به API، حساب کاربری و جریان‌های اصلی",
        "API integration, accounts and core workflows",
      ),
      l("بستهٔ انتشار، کد و راهنمای نگهداری", "Release package, code and maintenance guidance"),
    ],
    factors: l(
      "تعداد پلتفرم‌ها، آماده‌بودن API، قابلیت‌های آفلاین، اعلان‌ها و اتصال به قابلیت‌های گوشی روی برآورد اثر دارند",
      "Platforms, API readiness, offline support, notifications and device features affect the estimate.",
    ),
    support: l(
      "مسئولیت حساب‌های انتشار و شرایط فروشگاه‌ها از ابتدا روشن می‌شود. پذیرش نهایی انتشار تابع بررسی همان فروشگاه است",
      "Publishing accounts and store requirements are agreed up front. Final store approval remains subject to that store’s review.",
    ),
  },
  "api-integration": {
    fit: l(
      "برای کم‌کردن ورود دوبارهٔ اطلاعات، اتصال ابزارها و خودکارکردن کارهایی که هر روز تکرار می‌شوند",
      "For reducing duplicate data entry, connecting tools and automating repetitive work.",
    ),
    deliverables: [
      l("نقشهٔ جریان داده و قرارداد اتصال", "Data flow map and integration contracts"),
      l(
        "API، اتصال حسابداری، انبار، CRM و پرداخت طبق نیاز",
        "APIs and scoped accounting, inventory, CRM and payment connections",
      ),
      l(
        "ربات، استخراج داده، ثبت خطا و بازیابی طبق دامنه",
        "Scoped bots, data extraction, error logging and recovery",
      ),
    ],
    factors: l(
      "مستندات و محدودیت سرویس مقصد، حجم و تناوب انتقال، مالکیت داده و روش مدیریت خطا در برآورد مهم‌اند",
      "Destination API limitations, data volume, transfer frequency, data ownership and failure handling shape the estimate.",
    ),
    support: l(
      "دسترسی به سرویس مقصد باید مجاز و در اختیار کسب‌وکار باشد. تغییر API سرویس‌های دیگر ممکن است به به‌روزرسانی اتصال نیاز داشته باشد",
      "Third-party access must be authorised and available to the business. Upstream API changes may require integration updates.",
    ),
  },
  "data-analytics": {
    fit: l(
      "وقتی گزارش‌گیری دستی وقت می‌گیرد یا اعداد مهم بین فایل‌ها و سیستم‌های مختلف پخش‌اند",
      "When manual reporting takes time or important numbers are scattered across files and systems.",
    ),
    deliverables: [
      l(
        "پاک‌سازی، یکپارچه‌سازی و تعریف شاخص‌ها",
        "Data cleaning, consolidation and metric definitions",
      ),
      l(
        "داشبورد، Power BI یا فایل Excel متناسب با نیاز",
        "A dashboard, Power BI report or spreadsheet suited to the need",
      ),
      l(
        "به‌روزرسانی گزارش و راهنمای استفاده طبق توافق",
        "Agreed report refresh process and usage guidance",
      ),
    ],
    factors: l(
      "کیفیت و دسترسی داده، تعداد منابع، پیچیدگی شاخص‌ها، سطح دسترسی کاربران و نیاز به گزارش زنده تعیین‌کننده‌اند",
      "Data quality, source count, metric complexity, access levels and live reporting needs drive scope.",
    ),
    support: l(
      "منبع و روش محاسبهٔ هر شاخص مستند می‌شود تا عددها قابل‌پیگیری باشند؛ کیفیت گزارش به کیفیت دادهٔ ورودی هم وابسته است",
      "Metric sources and calculations are documented. Report quality also depends on the quality of incoming data.",
    ),
  },
  "seo-growth": {
    fit: l(
      "برای کسب‌وکاری که می‌خواهد مشتری‌های مرتبط، سایت و محتوایش را در جست‌وجو راحت‌تر پیدا کنند",
      "For businesses that want relevant customers to find their site and content in search.",
    ),
    deliverables: [
      l(
        "بررسی فنی، تحقیق جست‌وجو و نقشهٔ اولویت‌ها",
        "Technical review, search research and a prioritised roadmap",
      ),
      l(
        "استراتژی و تولید محتوا، بهبود صفحات و ساختار",
        "Content strategy and production, page and structure improvements",
      ),
      l(
        "بررسی سرعت، ایندکس و گزارش شاخص‌های توافق‌شده",
        "Performance, indexing and agreed metric reporting",
      ),
    ],
    factors: l(
      "وضعیت فعلی سایت، رقابت حوزه، حجم صفحات و محتوا و دسترسی اجرای اصلاحات روی دامنه و زمان اثر دارند",
      "Current site condition, competition, content volume and access to implement improvements affect scope and timing.",
    ),
    support: l(
      "رتبه یا فروش تضمینی اعلام نمی‌کنیم؛ معیارهای سنجش و مسئولیت تولید و انتشار محتوا از ابتدا روشن می‌شوند",
      "We do not guarantee rankings or sales. Measurement criteria and content responsibilities are agreed in advance.",
    ),
  },
  "project-rescue": {
    fit: l(
      "وقتی پروژه نیمه‌کاره مانده، خطا دارد یا تیم جدید نمی‌داند از کجا باید ادامه بدهد",
      "When a project is stalled, failing or difficult for a new team to continue.",
    ),
    deliverables: [
      l(
        "گزارش وضعیت، ریسک‌ها و اولویت اصلاحات",
        "Current-state review, risks and repair priorities",
      ),
      l(
        "پیشنهاد ادامه، تعمیر یا بازسازی با دلیل روشن",
        "Evidence-based recommendation to continue, fix or rebuild",
      ),
      l("اجرای اصلاحات و برنامهٔ تحویل طبق دامنه", "Scoped fixes and a delivery plan"),
    ],
    factors: l(
      "دسترسی به کد و محیط اجرا، وضعیت وابستگی‌ها، مستندات و ریسک داده را اول بررسی می‌کنیم؛ قبل از شناخت پروژه قیمت بازسازی نمی‌دهیم",
      "We review code access, runtime, dependencies, documentation and data risks before quoting a rebuild.",
    ),
    support: l(
      "بخش‌های سالم را تا جای ممکن حفظ می‌کنیم؛ پشتیبان‌گیری و مسیر برگشت باید پیش از تغییرهای پرریسک مشخص شود",
      "Healthy parts are preserved where practical, with backups and rollback plans before high-risk changes.",
    ),
  },
  "ongoing-support": {
    fit: l(
      "برای سایت، فروشگاه یا نرم‌افزاری که منتشر شده و به یک همراه فنی برای نگهداری و توسعه نیاز دارد",
      "For live websites, stores or software that need a technical partner for maintenance and development.",
    ),
    deliverables: [
      l(
        "برنامهٔ نگهداری، به‌روزرسانی و رفع مشکلات",
        "Maintenance, updates and issue resolution plan",
      ),
      l(
        "پایش و پشتیبان‌گیری متناسب با زیرساخت",
        "Monitoring and backup arrangements suited to the infrastructure",
      ),
      l(
        "اولویت‌بندی قابلیت‌ها و توسعهٔ مستمر طبق توافق",
        "Agreed feature prioritisation and ongoing development",
      ),
    ],
    factors: l(
      "اندازه و وضعیت سیستم، زیرساخت، حجم درخواست‌ها و سطح پاسخ‌گویی موردنیاز روی قرارداد پشتیبانی اثر دارند",
      "System size and condition, infrastructure, request volume and response expectations shape the support agreement.",
    ),
    support: l(
      "ساعات پاسخ‌گویی، کانال ثبت درخواست و مسئولیت زیرساخت در توافق مشخص می‌شوند؛ وعدهٔ پشتیبانی نامحدود و مبهم نمی‌دهیم",
      "Response hours, request channels and infrastructure responsibility are explicit. Support is not presented as unlimited or undefined.",
    ),
  },
};

export function enrichService(entry: CatalogEntry): CatalogEntry {
  if (entry.kind !== "services") return entry;
  const brief = serviceBriefs[entry.slug];
  if (!brief) return entry;
  const offering = serviceHighlights.find(service => service.slug === entry.slug);
  const additions: CatalogSection[] = [
    { title: l("برای چه نیازی مناسب است؟", "Who is this for?"), body: brief.fit },
    {
      title: l("خروجی همکاری چه خواهد بود؟", "What will you receive?"),
      body: l(
        "بسته به دامنهٔ توافق‌شده، خروجی‌ها می‌توانند شامل این موارد باشند",
        "Depending on the agreed scope, deliverables can include:",
      ),
      items: brief.deliverables,
    },
  ];
  return {
    ...entry,
    ...(serviceTitles[entry.slug] ? { title: serviceTitles[entry.slug]! } : {}),
    ...(offering ? { summary: offering.summary } : {}),
    sections: [
      ...additions,
      ...(offering ? [{ title: l("چه کارهایی انجام می‌دیم؟", "What can we help with?"), body: offering.scope }] : []),
      ...entry.sections,
      {
        title: l("هزینه و زمان به چه چیزهایی بستگی دارد؟", "What affects cost and timing?"),
        body: brief.factors,
      },
      { title: l("تحویل و ادامهٔ همکاری", "Handover and ongoing care"), body: brief.support },
    ],
  };
}

export function familyTitle(slug: string, locale: Locale) {
  return familyForService(slug)?.title[locale];
}
