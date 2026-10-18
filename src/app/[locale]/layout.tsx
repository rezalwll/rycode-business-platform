import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { AnalyticsProvider } from "@/components/analytics/analytics-provider";
import { isLocale, localeDirection, routing } from "@/i18n/routing";
import { BRAND_APPLE_ICON_SRC, BRAND_ICON_SRC } from "@/lib/brand";

import "@/styles.css";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://rycode.ir";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f2f2" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const isFa = locale === "fa";
  const title = isFa
    ? "RYCODE | رای‌کد — توسعه نرم‌افزار، طراحی سایت و رشد دیجیتال"
    : "RYCODE | Software engineering and digital growth";
  const description = isFa
    ? "رای‌کد شریک فنی کسب‌وکارها برای طراحی سایت، فروشگاه اینترنتی، نرم‌افزار اختصاصی، یکپارچه‌سازی و سئو است."
    : "RYCODE designs, builds and improves web platforms, custom software, integrations and search-led digital products.";

  return {
    metadataBase: new URL(appUrl),
    title: { default: title, template: `%s | RYCODE` },
    description,
    applicationName: "RYCODE",
    authors: [{ name: "RYCODE", url: appUrl }],
    creator: "RYCODE",
    publisher: "RYCODE",
    formatDetection: { email: false, address: false, telephone: false },
    alternates: {
      canonical: isFa ? "/" : "/en",
      languages: { "fa-IR": "/", en: "/en", "x-default": "/" },
    },
    openGraph: {
      type: "website",
      siteName: "RYCODE",
      locale: isFa ? "fa_IR" : "en_US",
      title,
      description,
      url: isFa ? "/" : "/en",
    },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true },
    icons: {
      icon: [{ url: BRAND_ICON_SRC, type: "image/png", sizes: "512x512" }],
      apple: [{ url: BRAND_APPLE_ICON_SRC, type: "image/png", sizes: "180x180" }],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} dir={localeDirection(locale)} suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/iranyekan/iranyekan.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              '(function(){try{var m=localStorage.getItem("rycode-theme")||"light";var d=m==="dark"||(m==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();',
          }}
        />
      </head>
      <body>
        {children}
        <AnalyticsProvider locale={locale} />
      </body>
    </html>
  );
}
