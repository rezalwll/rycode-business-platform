import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StudioHome } from "@/components/home/studio-home";
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
      ? "طراحی سایت، فروشگاه، نرم‌افزار و اپلیکیشن؛ اتصال سیستم‌ها و داده، سئو و محتوا، نجات پروژه و پشتیبانی با رایکد."
      : "Websites, ecommerce, software and mobile apps; integrations, data, SEO, content, project rescue and ongoing support with RYCODE.",
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
    <SiteShell locale={locale} heroUnderHeader>
      <StudioHome locale={locale} />
    </SiteShell>
  );
}
