import Image from "next/image";
import Link from "next/link";
import { ArrowUpLeft, ArrowUpRight, Check, Plus } from "lucide-react";
import type { ReactNode } from "react";

import { Container } from "@/components/site/primitives";
import { localizedHref } from "@/components/public/shared";
import { getCatalogEntries, localize } from "@/content/catalog";
import type { Locale } from "@/i18n/routing";
import { ProductScene } from "@/components/site/product-scene";
import { ServiceShowcase } from "./service-showcase";
import { ServicesExplorer } from "./services-explorer";
import { serviceFamilies, serviceExampleEntries } from "@/content/service-model";
export { CoordaHome as StudioHome } from "./coorda-home";

const faqs = [
  [
    "از کجا شروع کنیم؟",
    "یک توضیح کوتاه از چیزی که می‌خواهی بسازی یا مشکلی که داری کافی است. با هم نیازها، اولویت‌ها و مسیر منطقی اجرا را روشن می‌کنیم",
    "Where do we start?",
    "Tell us what you want to build or what is getting in your way. Together we clarify the needs, priorities and a practical path forward.",
  ],
  [
    "پروژهٔ نیمه‌کاره را هم ادامه می‌دهید؟",
    "بله؛ اول کد، دسترسی‌ها و زیرساخت را بررسی می‌کنیم. بعد می‌گوییم کدام بخش‌ها قابل نگه‌داشتن‌اند و ادامهٔ پروژه چه مسیری دارد",
    "Can you take over a stalled project?",
    "Yes. We first review the code, access and infrastructure, then explain what can be kept and how the project can move forward.",
  ],
  [
    "هزینه و زمان را چطور مشخص می‌کنید؟",
    "بعد از شناخت دامنهٔ کار، پیشنهاد مشخص می‌دهیم. برای پروژه‌های بزرگ‌تر، خروجی، زمان و هزینهٔ هر مرحله جداگانه تعریف می‌شود",
    "How do you estimate cost and time?",
    "Once the scope is clear, we provide a proposal. Larger projects can be split into phases with defined deliverables, timelines and costs.",
  ],
  [
    "کد و دسترسی‌های پروژه برای خودمان است؟",
    "بله؛ مالکیت کد، داده و دسترسی‌ها برای شماست. موارد تحویل و مستندات از ابتدا در توافق همکاری مشخص می‌شود",
    "Do we own the code and access?",
    "Yes. The code, data and access belong to you. Deliverables and documentation are defined in the collaboration agreement.",
  ],
  [
    "بعد از تحویل هم پشتیبانی دارید؟",
    "بله؛ نگهداری، رفع مشکل و توسعهٔ بعدی می‌تواند به‌صورت موردی یا مستمر ادامه پیدا کند. دامنه و شرایط پشتیبانی را جداگانه مشخص می‌کنیم",
    "Is support available after launch?",
    "Yes. Maintenance, fixes and further development can continue on an ongoing or as-needed basis, with an agreed support scope.",
  ],
] as const;

function StudioLink({
  locale,
  href,
  children,
  subtle = false,
}: {
  locale: Locale;
  href: string;
  children: ReactNode;
  subtle?: boolean;
}) {
  const Arrow = locale === "fa" ? ArrowUpLeft : ArrowUpRight;
  return (
    <Link href={localizedHref(locale, href)} className={subtle ? "studio-link" : "studio-button"}>
      {children}
      <Arrow className="size-4" aria-hidden />
    </Link>
  );
}

function Label({ children, index }: { children: ReactNode; index: string }) {
  return (
    <p className="studio-label">
      <span dir="ltr">{index}</span>
      <span>{children}</span>
    </p>
  );
}

/** Retained reference for the previous design; public routes use CoordaHome. */
export function StripeHome({ locale }: { locale: Locale }) {
  const fa = locale === "fa";
  const text = (persian: string, english: string) => (fa ? persian : english);
  const projects = getCatalogEntries("projects");
  const serviceExamples = serviceExampleEntries(projects);
  const services = getCatalogEntries("services");
  const articles = getCatalogEntries("blog");
  const Arrow = fa ? ArrowUpLeft : ArrowUpRight;

  return (
    <div className="studio-home">
      <section className="studio-hero">
        <div className="stripe-gradient" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <Container>
          <div className="stripe-hero-grid">
            <div className="studio-hero-copy">
              <Link href={localizedHref(locale, "/services")} className="stripe-hero-kicker">
                <span className="stripe-kicker-dot" />
                {text(
                  "طراحی، توسعه و رشد — یک مسیر روشن",
                  "Design, engineering & growth. Connected.",
                )}
                <Arrow className="size-3.5" aria-hidden />
              </Link>
              <h1>
                {text("از ایدهٔ تو", "From your idea")}
                <br />
                <span className="studio-hero-highlight">{text("تا یک محصول", "to a product")}</span>
                <br />
                {text("واقعاً کاربردی", "that works")}
              </h1>
              <p className="studio-hero-lead">
                {text(
                  "سایت، فروشگاه، نرم‌افزار و اپلیکیشن می‌سازیم؛ ابزارها و داده‌ها را به هم وصل می‌کنیم و برای رشد و ادامهٔ مسیر کنارت می‌مانیم",
                  "We build websites, stores, software and apps, connect your tools and data, and help your product grow and keep moving forward.",
                )}
              </p>
              <div className="studio-hero-actions">
                <StudioLink locale={locale} href="/start-project">
                  {text("با هم شروع کنیم", "Let’s get started")}
                </StudioLink>
                <a href="#expertise" className="studio-link">
                  {text("خدمات رایکد", "Explore our services")}
                  <Arrow className="size-4" aria-hidden />
                </a>
              </div>
            </div>
            <div className="stripe-hero-product">
              <ProductScene kind="software" locale={locale} hero />
            </div>
          </div>
          <div className="stripe-capability-rail" aria-label={text("توانمندی‌ها", "Capabilities")}>
            {serviceFamilies.map((family) => (
              <Link key={family.id} href={localizedHref(locale, `/services#${family.id}`)}>
                <span
                  className="capability-rail-dot"
                  style={{ background: family.accent }}
                  aria-hidden
                />
                {family.title[locale]}
                <span aria-hidden>↗</span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section id="expertise" className="studio-section studio-expertise">
        <Container>
          <div className="studio-section-heading">
            <div>
              <Label index="01">{text("خدمات و نمونه‌ها", "Services in practice")}</Label>
              <h2>{text("هر نیازی، مسیر خودش را دارد", "Different needs, a clear way forward")}</h2>
            </div>
            <div className="service-showcase-actions">
              <StudioLink locale={locale} href="/services" subtle>
                {text("همهٔ خدمات", "All services")}
              </StudioLink>
              <StudioLink locale={locale} href="/projects" subtle>
                {text("نمونه‌ها و مطالعات", "Project studies")}
              </StudioLink>
            </div>
          </div>
          <p className="service-showcase-intro studio-body">
            {text(
              "هر خدمت، یک راه برای بهترکردن کسب‌وکارت؛ نمونه‌های مفهومی کنار همان خدمت نشان می‌دهند خروجی کار چه شکلی می‌تواند باشد",
              "Explore the service and see what it could become. Concept studies sit alongside the relevant expertise, not in a separate showcase.",
            )}
          </p>
          <ServicesExplorer
            locale={locale}
            groups={serviceFamilies.map((family) => ({
              id: family.id,
              title: family.title[locale],
              tagline: family.tagline[locale],
              description: family.description[locale],
              accent: family.accent,
              count: family.slugs.length,
            }))}
            panels={serviceFamilies.map((family) => (
              <ServiceShowcase
                key={family.id}
                locale={locale}
                examples={serviceExamples}
                layout="compact"
                entries={family.slugs.flatMap((slug) => {
                  const entry = services.find((service) => service.slug === slug);
                  return entry ? [entry] : [];
                })}
              />
            ))}
          />
          <div className="studio-rescue">
            <div>
              <h3>{text("پروژه‌ات وسط راه مانده؟", "Is your project stuck?")}</h3>
              <p>
                {text(
                  "لازم نیست همیشه از صفر شروع کنیم؛ اول ببینیم چه چیزی قابل نجات است",
                  "You may not need to start over. Let’s find out what can be saved.",
                )}
              </p>
            </div>
            <StudioLink locale={locale} href="/technical-review">
              {text("یک بررسی فنی انجام بدهیم", "Let’s review your project")}
            </StudioLink>
          </div>
        </Container>
      </section>

      <section className="studio-section studio-partnership">
        <Container>
          <div className="studio-partnership-grid">
            <div>
              <Label index="02">{text("چرا رایکد", "The way we work")}</Label>
              <h2>
                {text("همکار فنی،", "Your technical partner,")}
                <br />
                <span className="text-brand">
                  {text("نه فقط مجری پروژه", "not just a supplier")}
                </span>
              </h2>
              <p className="studio-body mt-6 max-w-lg">
                {text(
                  "همکاری خوب یعنی بدانی چه چیزی ساخته می‌شود، چرا این تصمیم را گرفته‌ایم و قدم بعدی چیست. قرار نیست پشت اصطلاحات فنی پنهان شویم",
                  "Good collaboration means knowing what is being built, why a decision was made and what comes next. No hiding behind technical jargon.",
                )}
              </p>
              <StudioLink locale={locale} href="/about#approach" subtle>
                {text("بیشتر دربارهٔ همکاری با ما", "More about working with us")}
              </StudioLink>
            </div>
            <div className="studio-principles">
              {[
                [
                  "تصمیم روشن، قبل از کد",
                  "قبل از انتخاب ابزار، مسئله و اولویت‌ها را می‌فهمیم",
                  "Clarity before code",
                  "Understand the problem and priorities before choosing tools.",
                ],
                [
                  "خروجی قابل‌دیدن، در طول مسیر",
                  "پروژه را مرحله‌ای می‌بینی و بازخوردت وارد کار می‌شود",
                  "Progress you can see",
                  "Review working versions and give feedback along the way.",
                ],
                [
                  "مالکیت کامل، بدون وابستگی",
                  "کد، داده و دسترسی‌ها برای خودت می‌ماند",
                  "Ownership without lock-in",
                  "Your code, data and access stay yours.",
                ],
              ].map(([p, b, e, eb], index) => (
                <div key={p}>
                  <span className="studio-principle-number" dir="ltr">
                    0{index + 1}
                  </span>
                  <div>
                    <h3>{text(p!, e!)}</h3>
                    <p className="studio-body">{text(b!, eb!)}</p>
                  </div>
                  <Check className="size-5 text-brand" aria-hidden />
                </div>
              ))}
            </div>
          </div>
          <div className="studio-process-heading">
            <h3>
              {text("مسیر همکاری، از اولین حرف تا انتشار", "From first conversation to launch")}
            </h3>
            <StudioLink locale={locale} href="/about#process" subtle>
              {text("جزئیات فرایند", "Our process")}
            </StudioLink>
          </div>
          <ol className="studio-process">
            {[
              [
                "شناخت",
                "حرف می‌زنیم و مسئله را روشن می‌کنیم",
                "Discover",
                "Understand the problem and the goals",
              ],
              [
                "طراحی مسیر",
                "دامنه، زمان و خروجی‌ها را مشخص می‌کنیم",
                "Plan",
                "Agree on scope, timeline and deliverables",
              ],
              [
                "ساخت و بازبینی",
                "نسخه‌های قابل‌بررسی می‌سازیم",
                "Build",
                "Develop and review working versions",
              ],
              [
                "انتشار و ادامه",
                "تحویل می‌دهیم و مسیر بعدی را می‌چینیم",
                "Launch",
                "Hand over and plan what comes next",
              ],
            ].map(([p, b, e, eb], index) => (
              <li key={p}>
                <span dir="ltr">0{index + 1}</span>
                <h4>{text(p!, e!)}</h4>
                <p className="studio-body">{text(b!, eb!)}</p>
              </li>
            ))}
          </ol>
          <div className="studio-payment">
            <span className="studio-payment-mark" aria-hidden>
              ↗
            </span>
            <div>
              <h3>
                {text(
                  "قدم‌به‌قدم بساز، مرحله‌به‌مرحله پرداخت کن",
                  "Build in phases, pay in stages",
                )}
              </h3>
              <p className="studio-body">
                {text(
                  "برای پروژه‌های واجد شرایط، خروجی، مبلغ و زمان هر مرحله از قبل مشخص می‌شود",
                  "For eligible projects, each phase has an agreed deliverable, price and timeline.",
                )}
              </p>
            </div>
            <StudioLink locale={locale} href="/installment-purchase" subtle>
              {text("شرایط همکاری قسطی", "Installment terms")}
            </StudioLink>
          </div>
        </Container>
      </section>

      <section className="studio-section studio-journal">
        <Container>
          <div className="studio-section-heading">
            <div>
              <Label index="03">{text("یادداشت‌های رایکد", "Field notes")}</Label>
              <h2>{text("برای تصمیم‌های بهتر", "A little more perspective")}</h2>
            </div>
            <StudioLink locale={locale} href="/blog" subtle>
              {text("برو به بلاگ", "Visit the journal")}
            </StudioLink>
          </div>
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={localizedHref(locale, `/blog/${article.slug}`)}
              className="studio-journal-entry"
            >
              <div className="studio-journal-image">
                <Image
                  src="/images/editorial/data-dashboard.png"
                  alt=""
                  fill
                  sizes="(min-width: 768px) 280px, 94vw"
                  className="object-cover"
                />
              </div>
              <div>
                <span className="studio-micro">{localize(article.eyebrow, locale)}</span>
                <h3>{localize(article.title, locale)}</h3>
                <p className="studio-body">{localize(article.summary, locale)}</p>
              </div>
              <Arrow className="size-6" aria-hidden />
            </Link>
          ))}
        </Container>
      </section>

      <section className="studio-section studio-faq">
        <Container>
          <div className="studio-faq-grid">
            <div>
              <Label index="04">{text("قبل از شروع", "Before we begin")}</Label>
              <h2>
                {text("سؤال خوب،", "Good questions,")}
                <br />
                {text("جواب روشن", "clear answers")}
              </h2>
              <StudioLink locale={locale} href="/faq" subtle>
                {text("همهٔ پرسش‌ها", "All frequently asked questions")}
              </StudioLink>
            </div>
            <div>
              {faqs.map(([q, a, eq, ea], index) => (
                <details className="studio-faq-item" key={q} name="home-faq">
                  <summary>
                    <span className="studio-micro" dir="ltr">
                      0{index + 1}
                    </span>
                    <h3>{text(q, eq)}</h3>
                    <Plus className="size-5" aria-hidden />
                  </summary>
                  <p className="studio-body">{text(a, ea)}</p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="studio-support">
        <Container>
          <div className="studio-support-inner">
            <div>
              <span className="studio-label">
                {text("پشتیبانی و توسعهٔ مستمر", "Support & continuous development")}
              </span>
              <h2>{text("محصولت را تنها نمی‌گذاریم", "Your product is not on its own")}</h2>
              <p className="studio-body">
                {text(
                  "برای نگهداری، رفع مشکل و قدم بعدی محصول، یک همراه فنی داشته باش",
                  "Have a technical partner for maintenance, fixes and your product’s next chapter.",
                )}
              </p>
            </div>
            <StudioLink locale={locale} href="/services/ongoing-support">
              {text("دربارهٔ پشتیبانی حرف بزنیم", "Let’s talk about support")}
            </StudioLink>
          </div>
        </Container>
      </section>
    </div>
  );
}
