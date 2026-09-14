import type { Metadata } from "next";
import { notFound, permanentRedirect, redirect } from "next/navigation";

import { CatalogDetail } from "@/components/public/catalog-pages";
import { PublicCatalogHub } from "@/components/public/cms-catalog";
import {
  companyPageSlugs,
  CompanyPage,
  PublicLeadPage,
  type CompanyPageSlug,
} from "@/components/public/marketing-pages";
import { localizedHref } from "@/components/public/shared";
import { SiteShell } from "@/components/site/site-shell";
import { isCatalogKind, kindCopy, localize } from "@/content/catalog";
import { isLocale, type Locale } from "@/i18n/routing";
import {
  findPublicCatalogEntry,
  findPublicRedirect,
  listPublicCatalog,
  redirectDestination,
} from "@/server/queries/public-content";

type PageParams = { locale: string; path?: string[] };
type PageProps = {
  params: Promise<PageParams>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

const staticMetadata: Record<
  CompanyPageSlug | "contact" | "start-project" | "technical-review" | "seo-audit",
  { fa: { title: string; description: string }; en: { title: string; description: string } }
> = {
  about: {
    fa: {
      title: "درباره رای‌کد",
      description: "رویکرد رای‌کد به طراحی، ساخت و بهبود محصولات و سامانه‌های دیجیتال.",
    },
    en: {
      title: "About RYCODE",
      description:
        "RYCODE's approach to designing, building and improving digital products and systems.",
    },
  },
  "why-rycode": {
    fa: {
      title: "چرا رای‌کد",
      description:
        "مهندسی شفاف، امنیت از ابتدا، تحویل قابل بررسی و پایه‌ای که تیم بعدی بتواند ادامه دهد.",
    },
    en: {
      title: "Why RYCODE",
      description:
        "Transparent engineering, security by design, reviewable delivery and a maintainable foundation.",
    },
  },
  process: {
    fa: {
      title: "فرآیند همکاری",
      description: "فرآیند رای‌کد از شناخت مسئله و تعریف دامنه تا ساخت، انتشار و نگهداری.",
    },
    en: {
      title: "Engagement process",
      description:
        "RYCODE's process from discovery and scope through building, release and continued care.",
    },
  },
  technologies: {
    fa: {
      title: "تکنولوژی‌ها",
      description: "اصول انتخاب استک و فناوری‌های استفاده‌شده در پلتفرم رای‌کد.",
    },
    en: {
      title: "Technologies",
      description: "Technology selection principles and the stack behind the RYCODE platform.",
    },
  },
  faq: {
    fa: {
      title: "سوالات متداول",
      description:
        "پاسخ به سوال‌های رایج درباره برآورد، ادامه پروژه موجود، مالکیت، پشتیبانی و شروع همکاری.",
    },
    en: {
      title: "Frequently asked questions",
      description:
        "Answers about estimates, existing projects, ownership, support and starting an engagement.",
    },
  },
  contact: {
    fa: {
      title: "تماس با رای‌کد",
      description: "ارسال پرسش عمومی یا هماهنگی اولیه با تیم رای‌کد.",
    },
    en: {
      title: "Contact RYCODE",
      description: "Send a general question or arrange an initial conversation with RYCODE.",
    },
  },
  "start-project": {
    fa: {
      title: "شروع پروژه",
      description: "وضعیت، هدف و محدودیت‌های پروژه دیجیتال خود را برای بررسی اولیه ارسال کنید.",
    },
    en: {
      title: "Start a project",
      description:
        "Share the current state, goal and constraints of your digital project for an initial review.",
    },
  },
  "technical-review": {
    fa: {
      title: "درخواست بررسی فنی",
      description: "درخواست ممیزی پروژه کند، ناپایدار، متوقف یا نیمه‌کاره بر اساس شواهد فنی.",
    },
    en: {
      title: "Request a technical review",
      description:
        "Request an evidence-led audit of a slow, unstable, stalled or unfinished product.",
    },
  },
  "seo-audit": {
    fa: {
      title: "درخواست SEO Audit",
      description: "درخواست بررسی فنی و محتوایی دیده‌شدن وب‌سایت با خروجی اولویت‌بندی‌شده.",
    },
    en: {
      title: "Request an SEO audit",
      description:
        "Request a prioritised technical and content review of your website's search visibility.",
    },
  },
};

function isCompanyPage(value: string): value is CompanyPageSlug {
  return companyPageSlugs.some((slug) => slug === value);
}

function alternateMetadata(locale: Locale, path: string, available: Locale[] = ["fa", "en"]) {
  return {
    canonical: localizedHref(locale, path),
    languages: {
      ...(available.includes("fa") ? { "fa-IR": localizedHref("fa", path) } : {}),
      ...(available.includes("en") ? { en: localizedHref("en", path) } : {}),
      "x-default": localizedHref(available.includes("fa") ? "fa" : "en", path),
    },
  };
}

async function applyPublicRedirect(
  locale: Locale,
  path: string[],
  searchParams: PageProps["searchParams"],
): Promise<void> {
  const rule = await findPublicRedirect(localizedHref(locale, `/${path.join("/")}`));
  if (!rule) return;
  const destination = redirectDestination(rule, await searchParams);
  if (rule.permanent) permanentRedirect(destination);
  redirect(destination);
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { locale: rawLocale, path = [] } = await params;
  if (!isLocale(rawLocale) || path.length === 0) notFound();
  const locale = rawLocale;
  await applyPublicRedirect(locale, path, searchParams);
  if (path.length > 2) notFound();
  const route = `/${path.join("/")}`;

  if (path.length === 1) {
    const segment = path[0];
    if (!segment) notFound();
    if (isCatalogKind(segment)) {
      const copy = kindCopy[segment];
      const title = localize(copy.title, locale);
      const description = localize(copy.lead, locale);
      return {
        title,
        description,
        alternates: alternateMetadata(locale, route),
        openGraph: { title, description, url: localizedHref(locale, route) },
      };
    }

    if (segment in staticMetadata) {
      const key = segment as keyof typeof staticMetadata;
      const content = staticMetadata[key][locale];
      return {
        title: content.title,
        description: content.description,
        alternates: alternateMetadata(locale, route),
        openGraph: {
          title: content.title,
          description: content.description,
          url: localizedHref(locale, route),
        },
      };
    }
    notFound();
  }

  const [kind, slug] = path;
  if (!kind || !slug || !isCatalogKind(kind)) notFound();
  const resolved = await findPublicCatalogEntry(kind, slug, locale);
  if (!resolved) notFound();
  const { entry, cms } = resolved;
  const title = cms?.seoTitle ?? localize(entry.title, locale);
  const description = cms?.seoDescription ?? localize(entry.summary, locale);
  const alternates = alternateMetadata(locale, route, cms?.locales);
  const openGraph = {
    title: cms?.ogTitle ?? title,
    description: cms?.ogDescription ?? description,
    url: localizedHref(locale, route),
  };
  return {
    title,
    description,
    alternates: { ...alternates, canonical: cms?.canonicalUrl ?? alternates.canonical },
    robots: { index: !cms?.noIndex, follow: true },
    openGraph:
      kind === "blog"
        ? {
            type: "article",
            ...openGraph,
            ...(cms ? { publishedTime: cms.publishedAt, modifiedTime: cms.updatedAt } : {}),
          }
        : { type: "website", ...openGraph },
  };
}

export default async function PublicPage({ params, searchParams }: PageProps) {
  const { locale: rawLocale, path = [] } = await params;
  if (!isLocale(rawLocale) || path.length === 0) notFound();
  const locale = rawLocale;
  await applyPublicRedirect(locale, path, searchParams);
  if (path.length > 2) notFound();
  let content: React.ReactNode;

  if (path.length === 1) {
    const segment = path[0];
    if (!segment) notFound();

    if (isCatalogKind(segment)) {
      content = (
        <PublicCatalogHub
          locale={locale}
          kind={segment}
          entries={await listPublicCatalog(segment, locale)}
        />
      );
    } else if (isCompanyPage(segment)) {
      content = <CompanyPage locale={locale} slug={segment} />;
    } else if (segment === "contact") {
      content = <PublicLeadPage locale={locale} kind="contact" sourcePath="/contact" />;
    } else if (segment === "start-project") {
      content = <PublicLeadPage locale={locale} kind="project" sourcePath="/start-project" />;
    } else if (segment === "technical-review") {
      content = (
        <PublicLeadPage locale={locale} kind="technical_review" sourcePath="/technical-review" />
      );
    } else if (segment === "seo-audit") {
      content = <PublicLeadPage locale={locale} kind="seo_audit" sourcePath="/seo-audit" />;
    } else {
      notFound();
    }
  } else {
    const [kind, slug] = path;
    if (!kind || !slug || !isCatalogKind(kind)) notFound();
    const resolved = await findPublicCatalogEntry(kind, slug, locale);
    if (!resolved) notFound();
    content = <CatalogDetail locale={locale} entry={resolved.entry} />;
  }

  return <SiteShell locale={locale}>{content}</SiteShell>;
}
