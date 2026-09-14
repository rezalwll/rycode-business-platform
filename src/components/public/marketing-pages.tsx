import { CheckCircle2, ShieldCheck } from "lucide-react";
import Image from "next/image";

import { Container } from "@/components/site/primitives";
import type { LeadKind } from "@/features/leads/schema";
import type { Locale } from "@/i18n/routing";
import { listPublicFaqs } from "@/server/queries/public-content";

import { ActionLink, FinalBand, JsonLd, PageHero } from "./shared";
import { LeadForm } from "./lead-form";

export const companyPageSlugs = ["about", "why-rycode", "process", "technologies", "faq"] as const;
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
          fa: "پس از مشخص‌شدن دامنه، ریسک، وابستگی و معیار پذیرش. اگر ابهام زیاد باشد، ابتدا یک مرحله بررسی محدود پیشنهاد می‌شود.",
          en: "After scope, risk, dependencies and acceptance criteria are known. Where uncertainty is high, a bounded assessment comes first.",
        },
      },
      {
        title: {
          fa: "آیا پروژه موجود را ادامه می‌دهید؟",
          en: "Can you continue an existing project?",
        },
        body: {
          fa: "بله، پس از ممیزی اجراپذیری، امنیت، معماری و مالکیت دسترسی‌ها. نتیجه ممیزی می‌تواند ادامه، اصلاح هدفمند یا بازسازی بخشی باشد.",
          en: "Yes, after auditing runtime viability, security, architecture and access ownership. The evidence may support continuation, targeted correction or partial rebuilding.",
        },
      },
      {
        title: { fa: "مالکیت کد و حساب‌ها با چه کسی است؟", en: "Who owns the code and accounts?" },
        body: {
          fa: "مالکیت و سطح دسترسی در قرارداد روشن می‌شود. حساب‌های عملیاتی و مخزن نهایی نباید به دسترسی شخصی و پنهان وابسته باشند.",
          en: "Ownership and access levels are explicit in the agreement. Operational accounts and the final repository should not depend on hidden personal access.",
        },
      },
      {
        title: { fa: "پشتیبانی پس از انتشار دارید؟", en: "Is post-release support available?" },
        body: {
          fa: "بله؛ دامنه پشتیبانی، زمان پاسخ و مسئولیت زیرساخت باید جداگانه و قابل اندازه‌گیری تعریف شود.",
          en: "Yes; support scope, response expectations and infrastructure responsibility are defined separately and measurably.",
        },
      },
      {
        title: { fa: "برای شروع چه اطلاعاتی لازم است؟", en: "What is needed to begin?" },
        body: {
          fa: "هدف کسب‌وکار، کاربران اصلی، وضعیت فعلی، محدودیت زمانی و دسترسی‌های فنی مرتبط. لازم نیست از قبل نام تکنولوژی یا راه‌حل را انتخاب کرده باشید.",
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
      />
      <section className="bg-background py-16 sm:py-24">
        <Container>
          <div className="grid gap-4 lg:grid-cols-2">
            {sections.map((section, index) => (
              <article
                key={section.title}
                className="group rounded-[1.25rem] border border-border bg-surface p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-brand/45 hover:shadow-xl sm:p-8"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="meta-label text-muted-foreground">
                    {String(index + 1).padStart(2, "0")} / RYCODE
                  </span>
                  <span className="grid size-9 place-items-center rounded-full bg-brand-soft text-brand transition-transform duration-300 group-hover:rotate-12">
                    <CheckCircle2 className="size-4" aria-hidden />
                  </span>
                </div>
                <div className="mt-12 max-w-3xl">
                  <h2 className="display-3">{section.title}</h2>
                  <p className="mt-5 text-base leading-8 text-muted-foreground sm:text-lg sm:leading-9">
                    {section.body}
                  </p>
                  {section.items && (
                    <ul className="mt-7 grid gap-2">
                      {section.items.map((item) => (
                        <li
                          key={item}
                          className="flex gap-3 rounded-lg border border-border bg-background p-3 text-sm leading-7"
                        >
                          <span className="mt-1 size-1.5 shrink-0 rounded-full bg-brand" />
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

type LeadPageCopy = { eyebrow: LocalText; title: LocalText; lead: LocalText; note: LocalText };

const leadPages: Record<LeadKind, LeadPageCopy> = {
  project: {
    eyebrow: { fa: "شروع پروژه", en: "Start a project" },
    title: {
      fa: "برای ساختن، ابتدا مسئله را دقیق تعریف کنیم",
      en: "Define the problem before deciding what to build",
    },
    lead: {
      fa: "درباره وضعیت فعلی، نتیجه مورد انتظار و محدودیت‌ها بنویسید. پس از بررسی، مسیر مناسب گفت‌وگو را پیشنهاد می‌کنیم.",
      en: "Tell us about the current state, required outcome and constraints. After review, we will suggest the right next conversation.",
    },
    note: {
      fa: "ثبت فرم به‌معنای پذیرش پروژه یا اعلام برآورد نیست؛ دامنه و تعهدات پس از بررسی و توافق مکتوب مشخص می‌شوند.",
      en: "Submitting this form does not confirm acceptance or an estimate; scope and commitments follow review and written agreement.",
    },
  },
  technical_review: {
    eyebrow: { fa: "بررسی فنی", en: "Technical review" },
    title: {
      fa: "پیش از ادامه یا بازسازی، شواهد فنی جمع کنیم",
      en: "Gather technical evidence before continuing or rebuilding",
    },
    lead: {
      fa: "اگر پروژه کند، ناپایدار یا متوقف شده، وضعیت اجرا، کد، امنیت و استقرار را برای تصمیم بعدی بررسی می‌کنیم.",
      en: "If a product is slow, unstable or stalled, we inspect runtime, code, security and deployment before the next decision.",
    },
    note: {
      fa: "از قراردادن رمز عبور، کلید API یا داده محرمانه در فرم خودداری کنید. مسیر امن تبادل دسترسی پس از تماس هماهنگ می‌شود.",
      en: "Do not place passwords, API keys or confidential data in this form. A secure access-transfer path is arranged after contact.",
    },
  },
  seo_audit: {
    eyebrow: { fa: "درخواست SEO Audit", en: "Request an SEO audit" },
    title: {
      fa: "مشکل دیده‌شدن را با داده و اولویت روشن بررسی کنیم",
      en: "Investigate search visibility with evidence and clear priorities",
    },
    lead: {
      fa: "نشانی سایت، تغییرات اخیر و هدف کسب‌وکار را ارسال کنید تا دامنه بررسی فنی و محتوایی مشخص شود.",
      en: "Share the site, recent changes and business goal so the technical and content audit scope can be defined.",
    },
    note: {
      fa: "هیچ رتبه یا نتیجه‌ای تضمین نمی‌شود. خروجی بررسی شامل شواهد، اولویت و معیار سنجش خواهد بود.",
      en: "No ranking or outcome is guaranteed. The assessment focuses on evidence, priorities and measurable criteria.",
    },
  },
  contact: {
    eyebrow: { fa: "تماس", en: "Contact" },
    title: {
      fa: "گفت‌وگو را از زمینه و مسئله شروع کنیم",
      en: "Start the conversation with context and the problem",
    },
    lead: {
      fa: "برای پرسش عمومی یا هماهنگی اولیه پیام بفرستید. برای پروژه، بررسی فنی یا سئو از فرم اختصاصی همان مسیر استفاده کنید.",
      en: "Send a general question or initial note. For a project, technical review or SEO audit, use the corresponding dedicated form.",
    },
    note: {
      fa: "اطلاعات این فرم فقط برای بررسی و پیگیری درخواست شما استفاده می‌شود.",
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
  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={t(page.eyebrow, locale)}
        title={t(page.title, locale)}
        lead={t(page.lead, locale)}
      />
      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
            <LeadForm locale={locale} kind={kind} sourcePath={sourcePath} />
            <aside className="overflow-hidden border border-hairline bg-surface lg:sticky lg:top-28">
              <div className="relative aspect-[4/3] overflow-hidden bg-ink">
                <Image
                  src={
                    kind === "technical_review"
                      ? "/images/rycode-project-rescue.png"
                      : "/images/rycode-product-system.png"
                  }
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 20rem, 100vw"
                  className="object-cover opacity-80"
                  aria-hidden
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
                <span className="meta-label absolute inset-x-5 bottom-5 text-white/75">
                  RYCODE / NEXT STEP
                </span>
              </div>
              <div className="p-6">
                <ShieldCheck className="size-6 text-brand" aria-hidden />
                <h2 className="mt-5 text-lg font-bold">
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
