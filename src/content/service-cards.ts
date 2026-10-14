import type { LocalizedText } from "./catalog";
import { serviceHighlights } from "./service-offerings";

type CategoryId = (typeof serviceHighlights)[number]["id"];
type CardRow = [id: string, faTitle: string, enTitle: string, faSummary: string, enSummary: string];
const l = (fa: string, en: string): LocalizedText => ({ fa, en });

const categoryLinkTitles: Record<CategoryId, LocalizedText> = {
  build: l("طراحی سایت و فروشگاه", "Websites & ecommerce"),
  grow: l("سئو و رشد سایت", "SEO & website growth"),
  software: l("نرم‌افزار اختصاصی", "Custom software"),
  rescue: l("رفع باگ و توسعه پروژه", "Bug fixes & project development"),
  connect: l("ربات‌ها و خودکارسازی", "Bots & automation"),
  data: l("اکسل و ابزارهای کاری", "Excel & business tools"),
  continue: l("پشتیبانی و توسعه مستمر", "Support & ongoing development"),
};

function cards(categoryId: CategoryId, rows: CardRow[]) {
  const category = serviceHighlights.find(service => service.id === categoryId)!;
  return rows.map(([id, faTitle, enTitle, faSummary, enSummary]) => ({
    id, categoryId, slug: category.slug,
    title: l(faTitle, enTitle), summary: l(faSummary, enSummary),
    categoryTitle: category.title, linkTitle: categoryLinkTitles[categoryId], tag: category.tag, accent: category.accent,
    image: `/images/services/${id}.png`,
  }));
}

/** Curated homepage highlights; the full service scope stays on the service pages. */
const categoryCards = [
  ...cards("build", [
    ["business-site", "طراحی سایت", "Website design", "سایت شرکتی، وردپرسی یا اختصاصی؛ یک معرفی مرتب از کسب‌وکارت، با مدیریت سادهٔ محتوا", "A business, WordPress or custom website that presents your work clearly and keeps content manageable"],
    ["online-store", "فروشگاه اینترنتی", "Online stores", "از معرفی محصول و سبد خرید تا پرداخت و پیگیری سفارش، در یک مسیر مشخص", "Connect products, cart, checkout and order tracking in one clear journey"],
    ["landing-redesign", "لندینگ‌پیج و بازطراحی", "Landing pages & redesigns", "یک صفحه برای معرفی پیشنهادت بساز یا مسیرهای گیج‌کنندهٔ سایت قدیمی را بهتر کن", "Build a page for your offer or improve confusing journeys on an existing site"],
  ]),
  ...cards("grow", [
    ["technical-seo", "سئو و رشد سایت", "SEO & website growth", "مشکلات فنی، محتوا و مسیر جست‌وجو را بررسی کنیم تا مشتری‌های مرتبط راحت‌تر پیدایت کنند", "Review technical issues, content and search journeys to help relevant customers find your website"],
    ["content-work", "تولید و بهبود محتوا", "Content creation & improvement", "محتوای تازه و صفحه‌های فعلی را به جواب‌های کاربردی برای مخاطب تبدیل کنیم", "Create useful content and improve existing pages around audience questions"],
  ]),
  ...cards("software", [
    ["web-platform", "نرم‌افزار اختصاصی", "Custom software", "از پنل و داشبورد تا ابزار سازمانی؛ نرم‌افزاری بسازیم که با روند واقعی کارت جور باشد", "From admin panels and dashboards to business tools, build software around the way you actually work"],
    ["android-app", "اپلیکیشن اندروید", "Android apps", "خدمات یا ابزار کاری را روی موبایل ارائه کن، مستقل یا متصل به سامانهٔ فعلی", "Bring services or work tools to mobile, standalone or connected to your existing system"],
    ["crm", "سیستم مدیریت مشتریان (CRM)", "CRM systems", "اطلاعات مشتری و پیگیری‌های فروش را از پیام‌ها و فایل‌های پراکنده جمع کن", "Bring customer information and sales follow-ups out of scattered messages and files"],
  ]),
  ...cards("rescue", [
    ["bug-fixes", "رفع باگ", "Bug fixes", "خطا را پیدا کنیم، علتش را بفهمیم و اصلاحی انجام بدهیم که قابل بررسی باشد", "Trace errors to their cause and implement a verifiable fix"],
    ["stalled-project", "تکمیل پروژهٔ نیمه‌کاره", "Unfinished projects", "اول وضعیت پروژه را بررسی کنیم، بعد از بخش‌های قابل ادامه جلو برویم", "Review the current state and continue from the parts that can be kept"],
  ]),
  ...cards("connect", [
    ["telegram-order-bot", "ربات سفارش‌گیری تلگرام", "Telegram order bots", "دریافت سفارش از تلگرام را به روند کاری مشخصی برای مجموعه وصل کن", "Connect Telegram orders to a defined business workflow"],
    ["workflow-automation", "اتصال API و خودکارسازی", "APIs & automation", "سایت، انبار، حسابداری و سرویس‌های دیگر را به هم وصل کن و کارهای تکراری را کمتر کن", "Connect your website, inventory, accounting and other services to reduce repetitive work"],
  ]),
  ...cards("data", [
    ["custom-excel", "اکسل و ابزارهای کاری", "Excel & business tools", "فایل، فرمول و ابزار محاسباتی را برای مدل کار خودت بساز، به‌جای چند شیت پراکنده", "Build workbooks, formulas and calculators around your workflow instead of juggling scattered sheets"],
    ["reporting-dashboard", "داشبورد و گزارش‌گیری", "Reporting dashboards", "فایل‌ها و داده‌های موجود را به گزارش‌هایی تبدیل کن که بتوانی با آن‌ها تصمیم بگیری", "Turn existing files and data into reports you can make decisions with"],
  ]),
  ...cards("continue", [
    ["website-support", "پشتیبانی و توسعه مستمر", "Support & ongoing development", "برای نگهداری، رفع مشکل و امکانات جدید سایت، فروشگاه یا نرم‌افزارت کنارت بمانیم", "Stay alongside you for maintenance, fixes and new features on your website, store or custom software"],
  ]),
];

// Alternate categories so the first screen represents the full service range,
// while keeping specialist tasks within their related service pages.
const groups = serviceHighlights.map(category => categoryCards.filter(card => card.categoryId === category.id));
export const serviceCards = Array.from({ length: Math.max(...groups.map(group => group.length)) }, (_, index) =>
  groups.flatMap(group => group[index] ? [group[index]!] : []),
).flat();
