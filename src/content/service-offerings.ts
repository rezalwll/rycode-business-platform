import type { LocalizedText } from "./catalog";

const l = (fa: string, en: string): LocalizedText => ({ fa, en });

/** Owner-supplied categories; existing detail URLs remain stable. */
export const serviceHighlights = [
  {
    id: "build", slug: "web-development", tag: "WEB / ECOMMERCE", preview: "web",
    title: l("طراحی سایت و فروشگاه اینترنتی", "Website & ecommerce design"),
    summary: l("از یه سایت ساده و شیک تا یه فروشگاه اینترنتی کامل.", "From a simple, polished website to a complete online store."),
    scope: l("طراحی سایت شرکتی، شخصی، فروشگاهی، پزشکی، آموزشی، املاک، صنعتی، وردپرس، ووکامرس، سایت اختصاصی، چندزبانه، B2B، لندینگ‌پیج و بازطراحی سایت‌های قدیمی.", "Business, personal, ecommerce, medical, educational, real-estate and industrial websites; WordPress, WooCommerce, custom and multilingual sites, B2B, landing pages and redesigns."),
    coveredSlugs: ["web-development", "ecommerce"], related: [{ slug: "ecommerce", label: l("فروشگاه اینترنتی", "Online stores") }], accent: "var(--accent-blue)",
  },
  {
    id: "grow", slug: "seo-growth", tag: "SEO / GROWTH", preview: "seo",
    title: l("سئو و رشد سایت", "SEO & website growth"),
    summary: l("کمکت می‌کنیم آدم‌هایی که دنبال خدمات یا محصولاتت هستن، راحت‌تر پیدات کنن.", "Help people looking for your products or services find you more easily."),
    scope: l("سئو تکنیکال، سئو فروشگاهی، سئو محلی، تحقیق کلمات کلیدی، تولید و بهینه‌سازی محتوا، بهبود رتبه صفحات، لینک‌سازی داخلی، افزایش سرعت، رفع مشکلات ایندکس و بررسی رقبا.", "Technical, ecommerce and local SEO, keyword research, content creation and optimization, page-ranking improvements, internal linking, performance, indexing fixes and competitor research."),
    coveredSlugs: ["seo-growth"], related: [], accent: "#6d4cdb",
  },
  {
    id: "software", slug: "custom-software", tag: "CUSTOM SOFTWARE", preview: "software",
    title: l("طراحی و توسعه نرم‌افزار اختصاصی", "Custom software design & development"),
    summary: l("وقتی نرم‌افزارهای آماده جواب کارت رو نمی‌دن، چیزی می‌سازیم که دقیقاً به دردت بخوره.", "When off-the-shelf software does not fit, we build something around the way you work."),
    scope: l("نرم‌افزار تحت وب، ویندوز و اندروید، CRM، پنل مدیریت، داشبورد مدیریتی، سیستم فروش و سفارش‌گیری، سامانه رزرو و نوبت‌دهی، گارانتی، پنل مشتریان و نمایندگان، سامانه آموزشی و نرم‌افزارهای سازمانی.", "Web, Windows and Android software, CRM, admin panels, management dashboards, sales and ordering, booking and scheduling, warranty systems, customer and dealer portals, learning platforms and enterprise software."),
    coveredSlugs: ["custom-software", "mobile-app-development"], related: [{ slug: "mobile-app-development", label: l("اپلیکیشن موبایل", "Mobile apps") }], accent: "#6d4cdb",
  },
  {
    id: "rescue", slug: "project-rescue", tag: "BUG FIX / PROJECT RESCUE", preview: "rescue",
    title: l("رفع باگ و توسعه پروژه‌های موجود", "Bug fixes & existing project development"),
    summary: l("پروژه‌ات نیمه‌کاره مونده یا درست کار نمی‌کنه؟ از همون‌جایی که هست ادامه می‌دیم.", "An unfinished project or something that is not working? We start from where it stands."),
    scope: l("رفع باگ، تکمیل پروژه‌های نیمه‌کاره، اصلاح کدهای قدیمی، اضافه‌کردن امکانات جدید، بهینه‌سازی سرعت و دیتابیس، رفع مشکلات وردپرس و ووکامرس، مهاجرت و بازسازی پروژه‌ها.", "Bug fixes, unfinished project completion, legacy-code improvements, new features, performance and database optimization, WordPress and WooCommerce fixes, migrations and rebuilding."),
    coveredSlugs: ["project-rescue"], related: [], accent: "#ff9c52",
  },
  {
    id: "connect", slug: "api-integration", tag: "BOTS / AUTOMATION / API", preview: "automation",
    title: l("ربات‌ها و خودکارسازی کارها", "Bots & workflow automation"),
    summary: l("کارهای تکراری رو بسپار به ابزارهایی که خودشون انجامشون می‌دن.", "Let tools handle repetitive tasks for you."),
    scope: l("ساخت ربات تلگرام، ربات سفارش‌گیری و اطلاع‌رسانی، طراحی و اتصال API، اتصال فروشگاه به انبار و حسابداری، اتصال درگاه پرداخت و پیامک، جابه‌جایی خودکار اطلاعات و اتوماسیون کارهای روزمره.", "Telegram bots, ordering and notification bots, API design and integration, store connections to inventory and accounting, payments and SMS, automatic data transfer and everyday workflow automation."),
    coveredSlugs: ["api-integration"], related: [], accent: "var(--accent-blue)",
  },
  {
    id: "data", slug: "data-analytics", tag: "EXCEL / DATA / BUSINESS TOOLS", preview: "data",
    title: l("اکسل، داده و ابزارهای کاری", "Excel, data & business tools"),
    summary: l("اگه کارهات بین چندتا فایل و گزارش پخش شده، کمک می‌کنیم مرتب‌تر و سریع‌تر پیش برن.", "If work is scattered across files and reports, we help make it more organized and efficient."),
    scope: l("طراحی فایل اکسل اختصاصی، فرمول‌نویسی، ابزارهای محاسباتی، داشبورد گزارش‌گیری، گزارش‌های مدیریتی، پاک‌سازی و تبدیل داده، ورود و خروجی اطلاعات و ساخت ابزارهای کاربردی برای کسب‌وکار.", "Custom Excel files, formulas, calculators, reporting dashboards, management reports, data cleaning and conversion, imports and exports, and practical business tools."),
    coveredSlugs: ["data-analytics"], related: [], accent: "var(--accent-blue)",
  },
  {
    id: "continue", slug: "ongoing-support", tag: "SUPPORT / MAINTENANCE", preview: "support",
    title: l("پشتیبانی و توسعه مستمر", "Support & ongoing development"),
    summary: l("بعد از تحویل پروژه هم کنارت هستیم؛ برای رفع مشکل، بهترکردن و اضافه‌کردن امکانات جدید.", "We stay alongside you after handover, fixing issues, improving the product and adding new features."),
    scope: l("پشتیبانی سایت، فروشگاه اینترنتی، وردپرس، ووکامرس و نرم‌افزارهای اختصاصی، نگهداری فنی، بروزرسانی، رفع مشکلات دوره‌ای، بهینه‌سازی عملکرد و توسعه امکانات جدید.", "Support for websites, online stores, WordPress, WooCommerce and custom software; technical maintenance, updates, recurring fixes, performance improvements and new features."),
    coveredSlugs: ["ongoing-support"], related: [], accent: "#ff9c52",
  },
] as const;
