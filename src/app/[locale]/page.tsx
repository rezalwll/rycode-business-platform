import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EnglishHome } from "@/components/home/english-home";
import { Hero } from "@/components/home/hero";
import {
  BlogSection,
  CapabilityStrip,
  FaqSection,
  FinalCta,
  IndustriesSection,
  PathSelector,
  PaymentSection,
  ProcessSection,
  ProjectRescue,
  SelectedProjects,
  ServicesEditorial,
  SolutionExplorer,
  WhyRycode,
} from "@/components/home/sections";
import { SiteShell } from "@/components/site/site-shell";
import { isLocale, type Locale } from "@/i18n/routing";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isFa = locale === "fa";
  return {
    title: isFa
      ? "توسعه نرم‌افزار، طراحی سایت و رشد دیجیتال"
      : "Software engineering and digital growth",
    description: isFa
      ? "سایت، فروشگاه، نرم‌افزار یا سئوی کسب‌وکارتان را با رای‌کد جلو ببرید؛ حتی اگر پروژه‌تان وسط راه مانده باشد."
      : "From idea to execution: web platforms, ecommerce, custom software, integrations and technical SEO.",
    alternates: {
      canonical: isFa ? "/" : "/en",
      languages: { "fa-IR": "/", en: "/en", "x-default": "/" },
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  return (
    <SiteShell locale={locale}>
      {locale === "en" ? (
        <EnglishHome />
      ) : (
        <>
          <Hero />
          <CapabilityStrip />
          <PathSelector />
          <ServicesEditorial />
          <SolutionExplorer />
          <ProjectRescue />
          <SelectedProjects />
          <IndustriesSection />
          <WhyRycode />
          <ProcessSection />
          <PaymentSection />
          <BlogSection />
          <FaqSection />
          <FinalCta />
        </>
      )}
    </SiteShell>
  );
}
