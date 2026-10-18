import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import type { Locale } from "@/i18n/routing";
import { BrandText } from "@/components/site/brand-text";
import { serviceCards } from "@/content/service-cards";
import { familyForService } from "@/content/service-model";
import { localizedHref } from "@/i18n/public-href";
import "./inner-pages.css";

export const cleanInnerTitle = (value: string) => value.trimEnd().replace(/[.。]+$/, "");

/** Use RYCODE's own imagery, never Paknevis product assets or staff portraits. */
export function servicePageImage(slug: string): string {
  const specific: Record<string, string> = {
    ecommerce: "online-store",
    "mobile-app-development": "android-app",
    "api-integration": "workflow-automation",
  };
  if (specific[slug]) return `/images/services/${specific[slug]}.png`;
  const family = familyForService(slug);
  return (
    serviceCards.find((card) => card.categoryId === family?.id)?.image ??
    "/images/editorial/web-experience.png"
  );
}

/** Layout patterns adapted from Paknevis about, downloads, pricing and terms pages. */
export function InnerHero({
  locale,
  eyebrow,
  title,
  lead,
  image,
  imageAlt = "",
  layout = "split",
  children,
}: {
  locale: Locale;
  eyebrow: string;
  title: string;
  lead: string;
  image?: string;
  imageAlt?: string;
  layout?: "split" | "center" | "document" | "showcase";
  children?: ReactNode;
}) {
  return (
    <BrandText>
      <header className={`inner-hero inner-hero-${layout}`} dir={locale === "fa" ? "rtl" : "ltr"}>
        <div className="inner-container inner-hero-grid">
          <div className="inner-hero-copy">
            <p className="inner-eyebrow">{eyebrow}</p>
            <h1>{cleanInnerTitle(title)}</h1>
            <p className="inner-lead">{lead}</p>
            {children && <div className="inner-hero-actions">{children}</div>}
          </div>
          {image && (
            <figure className="inner-hero-media">
              <Image
                src={image}
                alt={imageAlt}
                width={1280}
                height={800}
                sizes="(max-width: 767px) 100vw, 640px"
                loading="eager"
              />
            </figure>
          )}
        </div>
      </header>
    </BrandText>
  );
}

export function InnerLink({
  locale,
  href,
  children,
  secondary = false,
}: {
  locale: Locale;
  href: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  const Arrow = locale === "fa" ? ArrowLeft : ArrowRight;
  return (
    <Link
      href={href.startsWith("#") ? href : localizedHref(locale, href)}
      className={`inner-button${secondary ? " inner-button-secondary" : ""}`}
    >
      {children}
      <Arrow size={17} aria-hidden />
    </Link>
  );
}

export function InnerEndnote({ locale }: { locale: Locale }) {
  return (
    <section className="inner-endnote inner-container">
      <div>
        <p className="inner-eyebrow">{locale === "fa" ? "قدم بعدی" : "NEXT STEP"}</p>
        <h2>{locale === "fa" ? "از مسئلهٔ خودت شروع کنیم" : "Let’s start with your challenge"}</h2>
        <p>
          {locale === "fa"
            ? "چند خط از چیزی که نیاز داری بگو؛ با هم مسیر مناسبش را پیدا می‌کنیم"
            : "Tell us what you need, and we’ll work out the right path together."}
        </p>
      </div>
      <InnerLink locale={locale} href="/start-project">
        {locale === "fa" ? "دربارهٔ پروژه‌ات بگو" : "Tell us about your project"}
      </InnerLink>
    </section>
  );
}
