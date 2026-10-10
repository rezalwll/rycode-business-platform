import { CheckCircle2, ShieldCheck } from "lucide-react";
import Image from "next/image";

import { ContextVisual, type ContextVisualVariant } from "@/components/site/context-visual";
import { Container } from "@/components/site/primitives";
import type { LeadKind } from "@/features/leads/schema";
import type { Locale } from "@/i18n/routing";
import { listPublicFaqs } from "@/server/queries/public-content";

import { ActionLink, FinalBand, JsonLd, PageHero } from "./shared";
import { LeadForm } from "./lead-form";

export const companyPageSlugs = [
  "about",
  "why-rycode",
  "process",
  "technologies",
  "faq",
  "terms",
  "privacy",
] as const;
export type CompanyPageSlug = (typeof companyPageSlugs)[number];

type LocalText = { fa: string; en: string };
type InfoSection = { title: LocalText; body: LocalText; items?: LocalText[] };
type PageCopy = { eyebrow: LocalText; title: LocalText; lead: LocalText; sections: InfoSection[] };
type RenderedSection = { title: string; body: string; items?: string[] };

const pages: Record<CompanyPageSlug, PageCopy> = {
  about: {
    eyebrow: { fa: "درباره رای‌کد", en: "About RYCODE" },
    title: {
      fa: "یک تیم فنی که کنار کسب‌وکارتان می‌ایستد",
      en: "An engineering partner for clear decisions and dependable delivery",
    },
    lead: {
      fa: "از اولین گفت‌وگو درباره مسئله تا روزی که محصولتان راه می‌افتد و بعد از آن، کنار شما هستیم.",
      en: "RYCODE works alongside organisations to design, build and improve digital products—from problem framing through post-release care.",
    },
    sections: [
      {
        title: { fa: "نگاه ما", en: "Our perspective" },
        body: {
          fa: "فناوری وقتی ارزش دارد که کارتان را راحت‌تر کند یا مشتری‌تان تجربه بهتری داشته باشد. برای همین قبل از حرف‌زدن از ابزار، اول می‌فهمیم چه چیزی قرار است بهتر شود.",
          en: "Technology matters when it improves a decision, an operation or a customer experience. Work therefore begins with the workflow and constraints, not a predetermined tool.",
        },
      },
      {
        title: { fa: "شیوه همکاری", en: "How we work" },
        body: {
          fa: "از اول مشخص می‌کنیم قرار است چه چیزی تحویل بگیرید، چه کسی مسئول کدام بخش است و موفقیت را چطور می‌سنجیم. کار را هم مرحله‌به‌مرحله نشان می‌دهیم تا غافلگیر نشوید.",
          en: "Scope, responsibilities, acceptance criteria and risks are written down. Work ships in reviewable increments so decisions happen early and on evidence.",
        },
        items: [
          { fa: "شفافیت درباره وضعیت و ریسک", en: "Transparent status and risk" },
          { fa: "دسترسی و مالکیت روشن", en: "Clear access and ownership" },
          { fa: "مستندات متناسب با محصول", en: "Documentation proportionate to the product" },
        ],
      },
      {
        title: { fa: "صداقت در ارائه", en: "Honest presentation" },
        body: {
          fa: "قرار نیست برای جلب اعتماد، عدد و داستان ساختگی تعریف کنیم. هر وقت نمونه واقعی قابل انتشار داشته باشیم، با جزئیات خودش نشانش می‌دهیم.",
          en: "This site makes no invented client, outcome or performance claims. Project studies remain explicitly labelled concepts until real work is approved for publication.",
        },
      },
    ],
  },
  "why-rycode": {
    eyebrow: { fa: "چرا رای‌کد", en: "Why RYCODE" },
    title: {
      fa: "قرار است کارتان راحت‌تر شود، نه فقط چند خط کد بیشتر داشته باشید",
      en: "Engineering should reduce uncertainty, not merely produce code",
    },
    lead: {
      fa: "تصمیم فنی خوب باید برای شما قابل فهم، برای تیم قابل نگهداری و برای مشتری قابل لمس باشد.",
      en: "A sound technical decision should be explainable to the business, maintainable by engineers and tangible to users.",
    },
    sections: [
      {
        title: { fa: "مسئله پیش از راهکار", en: "Problem before solution" },
        body: {
          fa: "قبل از اینکه قیمت یا راهکار بدهیم، می‌فهمیم الان کجا هستید، چه چیزی اذیتتان می‌کند و آخر کار قرار است چه چیزی بهتر شده باشد.",
          en: "Before estimating or proposing architecture, we clarify the current state, roles, data and success criteria.",
        },
      },
      {
        title: { fa: "امنیت و مالکیت از ابتدا", en: "Security and ownership from the start" },
        body: {
          fa: "امنیت و مالکیت را نمی‌گذاریم برای آخر کار. از همان ابتدا معلوم است چه کسی به چه چیزی دسترسی دارد و اگر مشکلی پیش آمد چطور برمی‌گردیم.",
          en: "Access control, secret management, auditability and recovery are design concerns—not tasks postponed until the end.",
        },
      },
      {
        title: { fa: "تحویل قابل بررسی", en: "Reviewable delivery" },
        body: {
          fa: "هر مرحله یک خروجی قابل دیدن و قابل تست دارد؛ پس اگر چیزی نیاز به تغییر داشته باشد، همان موقع می‌فهمیم.",
          en: "Each increment should have a runnable outcome, acceptance criteria and recorded decisions so risk stays visible.",
        },
      },
      {
        title: { fa: "پایه قابل ادامه", en: "A foundation others can continue" },
        body: {
          fa: "کد و مستندات را طوری تحویل می‌دهیم که بعداً برای ادامه کار مجبور نباشید دنبال آدم قبلی بگردید.",
          en: "Code, deployment and documentation are structured so the next team can continue without guesswork or hidden dependency.",
        },
      },
    ],
  },
  process: {
    eyebrow: { fa: "فرآیند همکاری", en: "Engagement process" },
    title: {
      fa: "از اولین گفت‌وگو تا انتشار، قدم‌به‌قدم با هم جلو می‌رویم",
      en: "From diagnosis to release, with explicit decision gates",
    },
    lead: {
      fa: "روند کار را با اندازه پروژه شما تنظیم می‌کنیم؛ اما شناخت مسئله، توافق روی دامنه و تحویل مرحله‌ای همیشه سر جایشان هستند.",
      en: "The process adapts to size and risk, while discovery, explicit scope and incremental verification remain non-negotiable.",
    },
    sections: [
      {
        title: { fa: "۱. شناخت", en: "1. Discovery" },
        body: {
          fa: "با یک گفت‌وگو شروع می‌کنیم: چه می‌خواهید، برای چه کسی و الان کجای کار هستید؟ اگر پروژه‌ای دارید، همان را هم دقیق بررسی می‌کنیم.",
          en: "Goals, users, current workflow, constraints and required access are recorded. For an existing product, we inspect its runtime state and risks.",
        },
      },
      {
        title: { fa: "۲. تعریف مسیر", en: "2. Shape the path" },
        body: {
          fa: "بعد با هم تصمیم می‌گیریم نسخه اول دقیقاً چه چیزهایی داشته باشد، چقدر زمان ببرد و از کجا شروع کنیم.",
          en: "The first scope, acceptance criteria, initial architecture, dependencies and estimate are presented in plain language.",
        },
      },
      {
        title: { fa: "۳. ساخت و بازبینی", en: "3. Build and review" },
        body: {
          fa: "کار را تکه‌تکه می‌سازیم، تست می‌کنیم و به شما نشان می‌دهیم؛ تغییرها هم شفاف با هم تصمیم‌گیری می‌شوند.",
          en: "Work is implemented, tested and demonstrated in small slices. Scope changes and technical decisions are recorded.",
        },
      },
      {
        title: { fa: "۴. انتشار و تداوم", en: "4. Release and continue" },
        body: {
          fa: "محصول را با خیال راحت منتشر می‌کنیم و بعد با توجه به استفاده واقعی، برای بهتر کردنش تصمیم می‌گیریم.",
          en: "Deployment uses a checklist, monitoring and rollback path; ongoing work is then prioritised from real operating data.",
        },
      },
    ],
  },
  technologies: {
    eyebrow: { fa: "تکنولوژی‌ها", en: "Technologies" },
    title: {
      fa: "ابزار درست را برای کار درست انتخاب می‌کنیم",
      en: "Tools are selected for the product’s working life",
    },
    lead: {
      fa: "هر پروژه ابزار خودش را می‌خواهد. چیزی را انتخاب می‌کنیم که امروز جواب بدهد و فردا هم نگهداری و توسعه‌اش دردسر نشود.",
      en: "This platform reflects the approach: server-first, type-safe, deployable on standard infrastructure and free of unnecessary lock-in.",
    },
    sections: [
      {
        title: { fa: "لایه محصول", en: "Product layer" },
        body: {
          fa: "Next.js، React، TypeScript، Tailwind CSS و کامپوننت‌های دسترس‌پذیر برای تجربه وب واکنش‌گرا.",
          en: "Next.js, React, TypeScript, Tailwind CSS and accessible components for responsive web experiences.",
        },
        items: [
          { fa: "Server Components و Server Actions", en: "Server Components and Server Actions" },
          { fa: "رندر و Metadata مناسب جست‌وجو", en: "Search-friendly rendering and metadata" },
          { fa: "رابط دو‌زبانه RTL/LTR", en: "Bilingual RTL/LTR interface" },
        ],
      },
      {
        title: { fa: "داده و هویت", en: "Data and identity" },
        body: {
          fa: "PostgreSQL و Prisma برای مدل داده صریح، Better Auth برای هویت، و Policyهای سمت سرور برای مجوز هر عملیات.",
          en: "PostgreSQL and Prisma for an explicit data model, Better Auth for identity, and server-side policies for every operation.",
        },
      },
      {
        title: { fa: "عملیات", en: "Operations" },
        body: {
          fa: "Docker و Caddy برای استقرار قابل تکرار، ذخیره فایل خصوصی، پشتیبان‌گیری و بررسی سلامت سرویس.",
          en: "Docker and Caddy for repeatable deployment, private file storage, backups and service health checks.",
        },
      },
      {
        title: { fa: "اصل انتخاب", en: "Selection principle" },
        body: {
          fa: "برای هر پروژه ممکن است ابزار متفاوتی مناسب باشد. تیم باید هزینه نگهداری، مهارت موجود، امنیت و مسیر خروج را هم‌زمان بسنجد.",
          en: "A different project may need different tools. Maintenance cost, existing capability, security and exit paths must be evaluated together.",
        },
      },
    ],
  },
  terms: {
    eyebrow: { fa: "قوانین استفاده", en: "Terms of use" },
    title: {
      fa: "چارچوب روشن استفاده از وب‌سایت و همکاری با رای‌کد",
      en: "A clear framework for using this website and working with RYCODE",
    },
    lead: {
      fa: "این صفحه قواعد استفاده از سایت را توضیح می‌دهد. تعهدهای هر پروژه، زمان، هزینه و دامنه کار فقط در توافق یا قرارداد همان پروژه قطعی می‌شوند.",
      en: "These terms govern use of this website. Project scope, timing, fees and commitments become binding only through the written agreement for that engagement.",
    },
    sections: [
      {
        title: { fa: "پذیرش و دامنه", en: "Acceptance and scope" },
        body: {
          fa: "با استفاده از این وب‌سایت می‌پذیرید از آن برای هدف قانونی و بدون آسیب‌زدن به سایت، کاربران یا زیرساخت استفاده کنید. این قواعد فقط استفاده از وب‌سایت را پوشش می‌دهند و جای قرارداد اختصاصی پروژه را نمی‌گیرند.",
          en: "By using this website, you agree to use it lawfully and without harming the service, its users or infrastructure. These terms cover website use and do not replace a project-specific agreement.",
        },
      },
      {
        title: { fa: "درخواست، برآورد و شروع همکاری", en: "Requests, estimates and engagement" },
        body: {
          fa: "ارسال فرم، پیام یا درخواست بررسی به معنی پذیرش پروژه، رزرو ظرفیت یا ارائه قیمت قطعی نیست. همکاری زمانی شروع می‌شود که دامنه کار، خروجی‌ها، مسئولیت‌ها، مبلغ و زمان‌بندی به‌صورت مکتوب تأیید شده باشند.",
          en: "Submitting a form or review request does not constitute project acceptance, reserved capacity or a final quote. Work starts only after scope, deliverables, responsibilities, fees and timing are confirmed in writing.",
        },
      },
      {
        title: { fa: "حساب‌ها و دسترسی‌ها", en: "Accounts and access" },
        body: {
          fa: "اگر حساب مشتری دریافت می‌کنید، مسئول نگهداری امن اطلاعات ورود و فعالیت‌هایی هستید که با حساب شما انجام می‌شود. رمز، کلید API یا اطلاعات محرمانه را در فرم‌های عمومی ارسال نکنید؛ انتقال دسترسی حساس باید از مسیر امن توافق‌شده انجام شود.",
          en: "If you receive a client account, you are responsible for safeguarding its credentials and activity. Do not submit passwords, API keys or confidential material through public forms; sensitive access must use an agreed secure channel.",
        },
      },
      {
        title: { fa: "محتوا و مالکیت", en: "Content and ownership" },
        body: {
          fa: "محتوای عمومی، طراحی و نشان رای‌کد بدون اجازه نباید بازنشر یا به نام دیگری ارائه شوند. مالکیت کد، فایل‌ها و خروجی‌های پروژه مطابق قرارداد همان پروژه تعیین می‌شود و پس از انجام تعهدهای توافق‌شده تحویل خواهد شد.",
          en: "RYCODE's public content, design and marks may not be republished or misrepresented without permission. Ownership of project code, files and deliverables is governed by that project's written agreement and agreed fulfilment conditions.",
        },
      },
      {
        title: { fa: "اطلاعات سایت و محدودیت مسئولیت", en: "Website information and limitations" },
        body: {
          fa: "تلاش می‌کنیم اطلاعات سایت دقیق و در دسترس باشد، اما مطالب عمومی تضمین نتیجه، رتبه، درآمد یا دسترس‌پذیری بدون وقفه نیستند. تصمیم‌های اجرایی و تعهدهای قابل اتکا باید بر اساس بررسی و توافق مکتوب همان پروژه باشند.",
          en: "We aim to keep website information accurate and available, but public content does not guarantee outcomes, rankings, revenue or uninterrupted availability. Actionable commitments must be based on the relevant assessment and written agreement.",
        },
      },
      {
        title: { fa: "تغییرات و ارتباط", en: "Changes and contact" },
        body: {
          fa: "ممکن است این قواعد با تغییر خدمات یا امکانات سایت به‌روزرسانی شوند. نسخه منتشرشده در همین صفحه ملاک استفاده بعدی است. برای پرسش درباره این شرایط از صفحه تماس با ما پیام بفرستید.",
          en: "These terms may be updated as the service or website changes. The version published here applies to subsequent use. Questions about these terms can be sent through the contact page.",
        },
      },
    ],
  },
  privacy: {
    eyebrow: { fa: "حریم خصوصی", en: "Privacy policy" },
    title: {
      fa: "داده‌ای را می‌گیریم که برای پاسخ‌گویی و ارائه خدمت لازم است",
      en: "We collect the data needed to respond and operate the service",
    },
    lead: {
      fa: "اینجا توضیح می‌دهیم چه اطلاعاتی هنگام استفاده از سایت یا ارسال درخواست ثبت می‌شود، چرا از آن استفاده می‌کنیم و چه انتخاب‌هایی دارید.",
      en: "This policy explains what information is recorded when you use the website or submit a request, why it is used and what choices you have.",
    },
    sections: [
      {
        title: { fa: "اطلاعاتی که خودتان می‌فرستید", en: "Information you provide" },
        body: {
          fa: "در فرم‌های تماس، شروع پروژه، بررسی فنی یا سئو ممکن است نام، راه ارتباطی، نشانی وب‌سایت، توضیح نیاز و فایل‌های مرتبط را دریافت کنیم. در حساب مشتری نیز اطلاعات لازم برای ورود، پروژه، پشتیبانی، فایل‌ها و پیگیری امور ثبت می‌شود.",
          en: "Contact, project, technical review and SEO forms may collect your name, contact details, website address, request context and relevant files. Client accounts also store the information required for access, projects, support, files and follow-up.",
        },
      },
      {
        title: { fa: "دلیل استفاده از اطلاعات", en: "How information is used" },
        body: {
          fa: "از اطلاعات برای پاسخ به درخواست، بررسی امکان همکاری، ارائه و پشتیبانی خدمت، امنیت حساب، ثبت سابقه تصمیم‌ها و انجام تعهدهای قراردادی استفاده می‌کنیم. داده‌ها برای ارسال پیام تبلیغاتی بدون انتخاب یا رضایت شما استفاده نمی‌شوند.",
          en: "Information is used to respond, assess an engagement, deliver and support services, secure accounts, record decisions and fulfil contractual obligations. It is not used for promotional messaging without your choice or consent.",
        },
      },
      {
        title: { fa: "آمار بازدید و کوکی‌ها", en: "Analytics and cookies" },
        body: {
          fa: "سایت پیش از فعال‌کردن آمار بازدید از شما اجازه می‌گیرد. در صورت پذیرش، رویدادهای فنی و رفتاری محدود برای بهبود تجربه ثبت می‌شوند و IP خام نگهداری نمی‌شود. کوکی‌های ضروری ورود و امنیت ممکن است برای کارکرد حساب مشتری لازم باشند.",
          en: "The site asks before enabling usage analytics. If accepted, limited technical and behavioural events are recorded to improve the experience, without retaining your raw IP address. Essential authentication and security cookies may be required for client accounts.",
        },
      },
      {
        title: { fa: "نگهداری و امنیت", en: "Retention and security" },
        body: {
          fa: "اطلاعات را تا زمانی نگه می‌داریم که برای پیگیری درخواست، ارائه خدمت، امنیت، سوابق قراردادی یا الزام قانونی لازم باشد. دسترسی‌ها محدود می‌شوند و برای انتقال اطلاعات حساس باید از مسیر امن استفاده شود؛ با این حال هیچ سامانه‌ای مصونیت مطلق ندارد.",
          en: "Information is kept while needed for request follow-up, service delivery, security, contractual records or legal obligations. Access is restricted and sensitive transfers use secure channels, although no system can promise absolute security.",
        },
      },
      {
        title: { fa: "اشتراک‌گذاری", en: "Sharing" },
        body: {
          fa: "اطلاعات شخصی فروخته نمی‌شود. داده فقط در حد لازم با ارائه‌دهندگان زیرساختی که برای میزبانی، ارسال پیام، ذخیره فایل یا امنیت استفاده می‌کنیم، یا در صورت الزام قانونی، پردازش و به اشتراک گذاشته می‌شود.",
          en: "Personal information is not sold. Data is processed or shared only as needed with infrastructure providers used for hosting, messaging, file storage or security, or where disclosure is legally required.",
        },
      },
      {
        title: { fa: "انتخاب‌ها و درخواست شما", en: "Your choices and requests" },
        body: {
          fa: "می‌توانید آمار اختیاری را رد کنید و برای مشاهده، اصلاح یا حذف اطلاعات قابل‌حذف خود از صفحه تماس با ما درخواست بفرستید. ممکن است برای امنیت، احراز هویت درخواست‌کننده لازم باشد و برخی سوابق قراردادی یا قانونی قابل حذف فوری نباشند.",
          en: "You can decline optional analytics and request access, correction or deletion of eligible information through the contact page. Identity verification may be required for security, and some contractual or legal records may not be immediately deletable.",
        },
      },
    ],
  },
  faq: {
    eyebrow: { fa: "سوالات متداول", en: "Frequently asked questions" },
    title: {
      fa: "قبل از شروع، جواب سؤال‌هایتان را بگیریم",
      en: "Resolve the important unknowns before starting",
    },
    lead: {
      fa: "چند سؤال رایج را اینجا جواب داده‌ایم؛ برای برآورد دقیق، اول باید درباره خود پروژه‌تان صحبت کنیم.",
      en: "These answers describe the general engagement model; an exact estimate follows discovery.",
    },
    sections: [
      {
        title: {
          fa: "هزینه و زمان پروژه چطور مشخص می‌شود؟",
          en: "How are cost and timing determined?",
        },
        body: {
          fa: "اول درباره چیزی که می‌خواهید، وضعیت فعلی و محدودیت‌ها حرف می‌زنیم. اگر هنوز بخش‌های زیادی مبهم باشد، با یک بررسی کوتاه شروع می‌کنیم تا عدد و زمان الکی تحویلتان ندهیم.",
          en: "After scope, risk, dependencies and acceptance criteria are known. Where uncertainty is high, a bounded assessment comes first.",
        },
      },
      {
        title: {
          fa: "آیا پروژه موجود را ادامه می‌دهید؟",
          en: "Can you continue an existing project?",
        },
        body: {
          fa: "بله. اول پروژه، دسترسی‌ها و وضعیت کد را بررسی می‌کنیم. بعد صادقانه می‌گوییم ادامه همین مسیر بهتر است، چند بخش باید تعمیر شود یا واقعاً نیاز به بازسازی دارد.",
          en: "Yes, after auditing runtime viability, security, architecture and access ownership. The evidence may support continuation, targeted correction or partial rebuilding.",
        },
      },
      {
        title: { fa: "مالکیت کد و حساب‌ها با چه کسی است؟", en: "Who owns the code and accounts?" },
        body: {
          fa: "کد، حساب‌ها و دسترسی‌های اصلی برای شماست. از اول هم مشخص می‌کنیم هر کسی به چه چیزی دسترسی دارد تا پروژه به حساب شخصی یک نفر وابسته نماند.",
          en: "Ownership and access levels are explicit in the agreement. Operational accounts and the final repository should not depend on hidden personal access.",
        },
      },
      {
        title: { fa: "پشتیبانی پس از انتشار دارید؟", en: "Is post-release support available?" },
        body: {
          fa: "بله. می‌توانیم بعد از انتشار هم برای رفع خطا، نگهداری و قابلیت‌های جدید کنارتان بمانیم. فقط از اول روشن می‌کنیم چه چیزهایی داخل پشتیبانی است و پاسخ‌گویی چقدر زمان می‌برد.",
          en: "Yes; support scope, response expectations and infrastructure responsibility are defined separately and measurably.",
        },
      },
      {
        title: { fa: "برای شروع چه اطلاعاتی لازم است؟", en: "What is needed to begin?" },
        body: {
          fa: "همین که بگویید چه کاری دارید، چه کسانی قرار است از محصول استفاده کنند و الان کجای مسیر هستید کافی است. لازم نیست اسم تکنولوژی بدانید یا از قبل راه‌حل انتخاب کرده باشید.",
          en: "Business goal, primary users, current state, timing constraints and relevant technical access. You do not need to choose a technology or solution in advance.",
        },
      },
    ],
  },
};

function t(value: LocalText, locale: Locale): string {
  return value[locale];
}

export async function CompanyPage({ locale, slug }: { locale: Locale; slug: CompanyPageSlug }) {
  const page = pages[slug];
  const companyVisual: Record<CompanyPageSlug, ContextVisualVariant> = {
    about: "connected",
    "why-rycode": "software",
    process: "ordering",
    technologies: "integration",
    faq: "support",
    terms: "article",
    privacy: "support",
  };
  const isFaq = slug === "faq";
  const managedFaqs = isFaq ? await listPublicFaqs(locale) : [];
  const sections: RenderedSection[] = managedFaqs.length
    ? managedFaqs.map(({ question, answer }) => ({ title: question, body: answer }))
    : page.sections.map((section) => ({
        title: t(section.title, locale),
        body: t(section.body, locale),
        ...(section.items ? { items: section.items.map((item) => t(item, locale)) } : {}),
      }));

  return (
    <>
      {isFaq && (
        <JsonLd
          value={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: sections.map((section) => ({
              "@type": "Question",
              name: section.title,
              acceptedAnswer: { "@type": "Answer", text: section.body },
            })),
          }}
        />
      )}
      <PageHero
        locale={locale}
        eyebrow={t(page.eyebrow, locale)}
        title={t(page.title, locale)}
        lead={t(page.lead, locale)}
        visualVariant={companyVisual[slug]}
      />
      <section className="relative overflow-hidden bg-[#f7fbfa] py-14 sm:py-20">
        <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_10%_16%,rgba(32,191,178,0.1),transparent_25%),radial-gradient(circle_at_88%_72%,rgba(99,146,255,0.08),transparent_27%)]" />
        <Container>
          <div className="relative grid gap-4 lg:grid-cols-2">
            {sections.map((section, index) => (
              <article
                key={section.title}
                className="group rounded-2xl border border-[#0b5262]/12 bg-white/78 p-6 shadow-[0_10px_34px_rgba(31,92,105,0.055)] backdrop-blur-sm transition-[box-shadow,border-color] duration-300 hover:border-[#20bfb2]/45 hover:shadow-[0_20px_50px_rgba(31,92,105,0.12)] sm:p-8"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="meta-label text-[#0b766e]">
                    {String(index + 1).padStart(2, "0")} / RYCODE
                  </span>
                  <span className="grid size-9 place-items-center rounded-full border border-[#20bfb2]/20 bg-[#5fe1d5]/12 text-[#0b8f87]">
                    <CheckCircle2 className="size-4" aria-hidden />
                  </span>
                </div>
                <div className="mt-12 max-w-3xl">
                  <h2 className="display-3 text-[#073b4c]">{section.title}</h2>
                  <p className="mt-5 text-base leading-8 text-muted-foreground sm:text-lg sm:leading-9">
                    {section.body}
                  </p>
                  {section.items && (
                    <ul className="mt-7 grid gap-2">
                      {section.items.map((item) => (
                        <li
                          key={item}
                          className="flex gap-3 rounded-xl border border-[#0b5262]/10 bg-[#f8fcfb] p-3 text-sm leading-7 text-[#214f5b]"
                        >
                          <span className="mt-1 size-1.5 shrink-0 rounded-full bg-[#20bfb2]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>
      <FinalBand locale={locale} />
    </>
  );
}

type InstallmentCopy = {
  eyebrow: LocalText;
  title: LocalText;
  lead: LocalText;
  aside: LocalText;
  steps: Array<{ title: LocalText; body: LocalText }>;
  conditions: LocalText[];
  notes: LocalText[];
};

const installmentCopy: InstallmentCopy = {
  eyebrow: { fa: "خرید قسطی خدمات", en: "Installment payment" },
  title: {
    fa: "پروژه را شروع کنید؛ هزینه را با خروجی‌های واقعی تقسیم کنید",
    en: "Start the project and spread the cost across real deliverables",
  },
  lead: {
    fa: "برای پروژه‌های واجد شرایط، هزینه به‌جای یک پرداخت سنگین، بر اساس فازهای مشخص و قابل بررسی پرداخت می‌شود.",
    en: "For eligible projects, the cost can be split into clear, reviewable stages instead of one large upfront payment.",
  },
  aside: {
    fa: "تعداد قسط و مبلغ هر مرحله بعد از شناخت دامنه، زمان‌بندی و ریسک پروژه مشخص می‌شود.",
    en: "The number and amount of instalments are defined after scope, timing and project risk are understood.",
  },
  steps: [
    {
      title: { fa: "۱. شناخت و برآورد", en: "1. Discover and estimate" },
      body: {
        fa: "مسئله، دامنه، اولویت‌ها و خروجی‌های قابل تحویل را با هم روشن می‌کنیم.",
        en: "We clarify the problem, scope, priorities and reviewable deliverables together.",
      },
    },
    {
      title: { fa: "۲. تقسیم به فازهای واقعی", en: "2. Split into real stages" },
      body: {
        fa: "هر فاز هدف، زمان، مبلغ و نقطه پذیرش خودش را دارد؛ نه یک عدد مبهم برای کل پروژه.",
        en: "Each stage gets its own goal, timing, amount and acceptance point—not an opaque total.",
      },
    },
    {
      title: { fa: "۳. تحویل و پرداخت مرحله‌ای", en: "3. Review, deliver and pay" },
      body: {
        fa: "بعد از ارائه خروجی و تأیید مرحله، پرداخت بعدی طبق توافق انجام می‌شود.",
        en: "After a stage is demonstrated and accepted, the next payment follows the written agreement.",
      },
    },
  ],
  conditions: [
    {
      fa: "دامنه پروژه و خروجی هر فاز قابل تعریف باشد",
      en: "The project scope and stage outputs can be defined",
    },
    {
      fa: "زمان‌بندی و مسئولیت‌های دو طرف از ابتدا روشن باشد",
      en: "Timing and both parties' responsibilities are clear from the start",
    },
    {
      fa: "مبلغ و نقطه پرداخت هر مرحله در توافق مکتوب ثبت شود",
      en: "Each stage's amount and payment point are recorded in writing",
    },
  ],
  notes: [
    {
      fa: "خرید قسطی در این صفحه به معنی پرداخت مرحله‌ای هزینه خدمات است، نه دریافت اعتبار بانکی یا وام.",
      en: "Installment payment here means staged payment for services, not a bank loan or credit facility.",
    },
    {
      fa: "این امکان برای همه پروژه‌ها خودکار نیست و پس از بررسی دامنه و ریسک تصمیم‌گیری می‌شود.",
      en: "This option is not automatic for every project; eligibility is decided after scope and risk review.",
    },
  ],
};

export function InstallmentPage({ locale }: { locale: Locale }) {
  const copy = installmentCopy;

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={t(copy.eyebrow, locale)}
        title={t(copy.title, locale)}
        lead={t(copy.lead, locale)}
        aside={t(copy.aside, locale)}
        visualVariant="dashboard"
        visualItems={[
          locale === "fa" ? "دامنه روشن" : "Clear scope",
          locale === "fa" ? "خروجی قابل بررسی" : "Reviewable output",
          locale === "fa" ? "پرداخت مرحله‌ای" : "Staged payment",
        ]}
      />

      <section className="relative overflow-hidden bg-[#f7fbfa] py-14 sm:py-20">
        <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_8%_16%,rgba(32,191,178,0.11),transparent_25%),radial-gradient(circle_at_88%_72%,rgba(99,146,255,0.08),transparent_27%)]" />
        <Container>
          <div className="relative grid gap-4 lg:grid-cols-3">
            {copy.steps.map((step, index) => (
              <article
                key={step.title.en}
                className="rounded-2xl border border-[#0b5262]/12 bg-white/80 p-6 shadow-[0_12px_36px_rgba(31,92,105,0.06)] backdrop-blur-sm sm:p-8"
              >
                <span className="meta-label text-[#0b766e]">
                  {String(index + 1).padStart(2, "0")} / RYCODE
                </span>
                <h2 className="mt-10 text-xl font-bold leading-8 text-[#073b4c]">
                  {t(step.title, locale)}
                </h2>
                <p className="mt-4 text-sm leading-8 text-muted-foreground">
                  {t(step.body, locale)}
                </p>
              </article>
            ))}
          </div>

          <div className="relative mt-10 grid gap-8 rounded-2xl border border-white/90 bg-[linear-gradient(120deg,#e4faf5,#eef5ff_58%,#fff8df)] p-7 text-[#073b4c] shadow-[0_22px_70px_rgba(7,59,76,0.12)] sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <span className="meta-label text-[#087b83]">
                {locale === "fa" ? "شرایط بررسی" : "ELIGIBILITY"}
              </span>
              <h2 className="mt-5 text-2xl font-bold leading-9 sm:text-3xl">
                {locale === "fa"
                  ? "چه پروژه‌هایی مناسب این مسیرند؟"
                  : "Which projects fit this path?"}
              </h2>
              <p className="mt-4 text-sm leading-8 text-[#315d68]/78">
                {locale === "fa"
                  ? "به‌جای قول ثابت برای همه، شرایط را بر اساس وضعیت واقعی پروژه مشخص می‌کنیم."
                  : "Instead of making a fixed promise for every project, we assess the real situation first."}
              </p>
            </div>
            <ul className="grid gap-3">
              {copy.conditions.map((condition) => (
                <li
                  key={condition.en}
                  className="flex items-start gap-3 rounded-xl border border-[#073b4c]/10 bg-white/65 p-4 text-sm leading-7 text-[#315d68]/88"
                >
                  <CheckCircle2 className="mt-1 size-4 shrink-0 text-[#0ba99d]" aria-hidden />
                  {t(condition, locale)}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mt-8 grid gap-3 border-t border-[#0b5262]/12 pt-7 text-sm leading-8 text-muted-foreground sm:grid-cols-2">
            {copy.notes.map((note) => (
              <p key={note.en} className="rounded-xl bg-white/65 p-4">
                {t(note, locale)}
              </p>
            ))}
          </div>

          <div className="relative mt-10 flex flex-wrap items-center gap-4">
            <ActionLink locale={locale} href="/start-project">
              {locale === "fa" ? "درخواست بررسی شرایط" : "Request an eligibility review"}
            </ActionLink>
            <ActionLink locale={locale} href="/contact" secondary>
              {locale === "fa" ? "سؤال دارید؟ تماس بگیرید" : "Have a question? Contact us"}
            </ActionLink>
          </div>
        </Container>
      </section>
      <FinalBand locale={locale} />
    </>
  );
}

type LeadPageCopy = { eyebrow: LocalText; title: LocalText; lead: LocalText; note: LocalText };

const leadPages: Record<LeadKind, LeadPageCopy> = {
  project: {
    eyebrow: { fa: "شروع پروژه", en: "Start a project" },
    title: {
      fa: "بگویید چه چیزی توی ذهنتان است؛ با هم مسیرش را پیدا می‌کنیم",
      en: "Define the problem before deciding what to build",
    },
    lead: {
      fa: "کوتاه بگویید الان چه دارید، چه چیزی می‌خواهید بهتر شود و اگر زمان یا محدودیت خاصی هست. ما می‌خوانیم و برای قدم بعدی با شما هماهنگ می‌شویم.",
      en: "Tell us about the current state, required outcome and constraints. After review, we will suggest the right next conversation.",
    },
    note: {
      fa: "فرستادن این فرم فقط شروع گفت‌وگوست. بعد از اینکه موضوع را بررسی کردیم، درباره مسیر، زمان و هزینه شفاف با هم توافق می‌کنیم.",
      en: "Submitting this form does not confirm acceptance or an estimate; scope and commitments follow review and written agreement.",
    },
  },
  technical_review: {
    eyebrow: { fa: "بررسی فنی", en: "Technical review" },
    title: {
      fa: "قبل از اینکه دوباره هزینه کنید، ببینیم واقعاً چه چیزی خراب است",
      en: "Gather technical evidence before continuing or rebuilding",
    },
    lead: {
      fa: "اگر پروژه کند شده، مدام خطا می‌دهد یا نیمه‌کاره مانده، کد و زیرساختش را نگاه می‌کنیم تا قدم بعدی را با حدس انتخاب نکنید.",
      en: "If a product is slow, unstable or stalled, we inspect runtime, code, security and deployment before the next decision.",
    },
    note: {
      fa: "اینجا رمز، کلید API یا اطلاعات محرمانه نفرستید. اگر به دسترسی نیاز باشد، بعد از تماس یک راه امن برایش هماهنگ می‌کنیم.",
      en: "Do not place passwords, API keys or confidential data in this form. A secure access-transfer path is arranged after contact.",
    },
  },
  seo_audit: {
    eyebrow: { fa: "درخواست SEO Audit", en: "Request an SEO audit" },
    title: {
      fa: "ببینیم چرا گوگل سایتتان را آن‌طور که باید نمی‌بیند",
      en: "Investigate search visibility with evidence and clear priorities",
    },
    lead: {
      fa: "آدرس سایت، تغییرهای اخیر و چیزی که می‌خواهید از گوگل بگیرید را بفرستید؛ ما مشخص می‌کنیم بررسی را از کجا باید شروع کرد.",
      en: "Share the site, recent changes and business goal so the technical and content audit scope can be defined.",
    },
    note: {
      fa: "قول رتبه یک نمی‌دهیم. در عوض دقیق نشان می‌دهیم مشکل کجاست، کدام کار مهم‌تر است و نتیجه را چطور باید سنجید.",
      en: "No ranking or outcome is guaranteed. The assessment focuses on evidence, priorities and measurable criteria.",
    },
  },
  contact: {
    eyebrow: { fa: "تماس", en: "Contact" },
    title: {
      fa: "سلام؛ بگویید چطور می‌توانیم کمک کنیم",
      en: "Start the conversation with context and the problem",
    },
    lead: {
      fa: "سؤال یا موضوعتان را همین‌جا بنویسید. اگر درباره شروع پروژه، بررسی فنی یا سئو است، فرم مخصوص همان بخش سریع‌تر ما را به اصل موضوع می‌رساند.",
      en: "Send a general question or initial note. For a project, technical review or SEO audit, use the corresponding dedicated form.",
    },
    note: {
      fa: "اطلاعاتی که می‌فرستید فقط برای خواندن و پیگیری همین درخواست استفاده می‌شود.",
      en: "Information submitted here is used only to review and follow up your request.",
    },
  },
};

export function PublicLeadPage({
  locale,
  kind,
  sourcePath,
}: {
  locale: Locale;
  kind: LeadKind;
  sourcePath: string;
}) {
  const page = leadPages[kind];
  const visualVariant: Record<LeadKind, ContextVisualVariant> = {
    project: "software",
    technical_review: "recovery",
    seo_audit: "seo",
    contact: "connected",
  };
  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={t(page.eyebrow, locale)}
        title={t(page.title, locale)}
        lead={t(page.lead, locale)}
        visualVariant={visualVariant[kind]}
      />
      <section className="relative overflow-hidden bg-[#f7fbfa] py-14 sm:py-20">
        <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_12%_18%,rgba(32,191,178,0.1),transparent_26%),radial-gradient(circle_at_86%_72%,rgba(99,146,255,0.08),transparent_28%)]" />
        <Container>
          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
            <div className="rounded-2xl border border-[#0b5262]/12 bg-white/80 p-6 shadow-[0_18px_55px_rgba(31,92,105,0.08)] backdrop-blur-sm sm:p-9">
              <LeadForm locale={locale} kind={kind} sourcePath={sourcePath} />
            </div>
            <aside className="overflow-hidden rounded-2xl border border-[#0b5262]/12 bg-white/82 shadow-[0_18px_55px_rgba(31,92,105,0.08)] backdrop-blur-sm lg:sticky lg:top-28">
              <div className="relative aspect-[4/3] overflow-hidden bg-ink">
                {kind === "seo_audit" ? (
                  <Image
                    src="/images/editorial/seo-growth-workspace.png"
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 20rem, 100vw"
                    className="object-cover opacity-90"
                    aria-hidden
                  />
                ) : (
                  <ContextVisual
                    variant={visualVariant[kind]}
                    title={t(page.title, locale)}
                    decorative
                    className="absolute inset-0 min-h-0 opacity-90"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#00364a] via-[#00364a]/15 to-transparent" />
                <span className="meta-label absolute inset-x-5 bottom-5 text-[#5fe1d5]">
                  RYCODE / NEXT STEP
                </span>
              </div>
              <div className="p-6">
                <ShieldCheck className="size-6 text-[#20bfb2]" aria-hidden />
                <h2 className="mt-5 text-lg font-bold text-[#073b4c]">
                  {locale === "fa" ? "شفافیت و امنیت" : "Clarity and security"}
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {t(page.note, locale)}
                </p>
                {kind === "contact" && (
                  <div className="mt-6 border-t border-hairline pt-6">
                    <p className="text-sm leading-7 text-muted-foreground">
                      {locale === "fa"
                        ? "برای درخواست تخصصی مسیر مناسب را انتخاب کنید:"
                        : "For a scoped request, choose the relevant path:"}
                    </p>
                    <div className="mt-4 flex flex-col items-start gap-3">
                      <ActionLink locale={locale} href="/start-project" secondary>
                        {locale === "fa" ? "شروع پروژه" : "Start a project"}
                      </ActionLink>
                      <ActionLink locale={locale} href="/technical-review" secondary>
                        {locale === "fa" ? "بررسی فنی" : "Technical review"}
                      </ActionLink>
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
