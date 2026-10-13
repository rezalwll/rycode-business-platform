import { ArrowLeft, ArrowRight } from "lucide-react";
import { BrandText } from "@/components/site/brand-text";
import Link from "next/link";
import type { ReactNode } from "react";

import type { ContextVisualVariant } from "@/components/site/context-visual";
import { Container } from "@/components/site/primitives";
import type { Locale } from "@/i18n/routing";
import { localizedHref } from "@/i18n/public-href";
import ReferencePhotoHero from "@/components/template/reference-photo-hero";
import ReferenceCommunityCTA from "@/components/template/reference-community-cta";

export { localizedHref } from "@/i18n/public-href";

export function PageHero({
  locale,
  eyebrow,
  title,
  lead,
  aside,
  imageSrc,
  imageAlt = "",
  visualVariant = "software",
  tone,
}: {
  locale: Locale;
  eyebrow: string;
  title: string;
  lead: string;
  aside?: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  visualVariant?: ContextVisualVariant;
  visualItems?: readonly string[];
  tone?: "photo" | "abstract";
}) {
  const abstract = tone === "abstract" || (!imageSrc && !tone && visualVariant === "article");
  const photo =
    imageSrc ??
    (visualVariant === "seo"
      ? "/images/editorial/seo-growth-workspace.png"
      : visualVariant === "data" || visualVariant === "dashboard" || visualVariant === "software"
        ? "/images/editorial/data-dashboard.png"
        : "/images/editorial/web-experience.png");
  return (
    <BrandText><>
      <ReferencePhotoHero title={title.trimEnd().replace(/[.。]+$/, "")} image={photo} alt={imageSrc ? imageAlt : ""} abstract={abstract} />
      <section className="reference-page-intro">
        <div className="page-container">
          <p className="reference-page-eyebrow">{eyebrow}</p>
          <p>{lead}</p>
          {aside && <div className="reference-page-note">{aside}</div>}
        </div>
      </section>
    </></BrandText>
  );
}

export function ActionLink({
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
  const Icon = locale === "fa" ? ArrowLeft : ArrowRight;
  return (
    <BrandText><Link
      href={localizedHref(locale, href)}
      className={secondary ? "coorda-button coorda-button-secondary" : "coorda-button"}
    >
      {children}
      <Icon className="size-4" aria-hidden />
    </Link></BrandText>
  );
}

export function FinalBand({ locale: _locale }: { locale: Locale }) {
  return <BrandText><ReferenceCommunityCTA /></BrandText>;
}

export function JsonLd({ value }: { value: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(value).replaceAll("<", "\\u003c") }}
    />
  );
}
