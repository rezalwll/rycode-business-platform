import type { MetadataRoute } from "next";

import { catalogKinds } from "@/content/catalog";
import type { Locale } from "@/i18n/routing";
import { listPublicSitemapContent } from "@/server/queries/public-content";

export const dynamic = "force-dynamic";

const publicPages = [
  "",
  "about",
  "why-rycode",
  "process",
  "technologies",
  "faq",
  "contact",
  "start-project",
  "technical-review",
  "seo-audit",
] as const;

function baseUrl(): URL {
  try {
    return new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://rycode.ir");
  } catch {
    return new URL("https://rycode.ir");
  }
}

function absolute(path: string): string {
  return new URL(path, baseUrl()).toString();
}

function item(
  path: string,
  priority: number,
  locale: "fa" | "en",
  available: Locale[] = ["fa", "en"],
  updatedAt?: string,
): MetadataRoute.Sitemap[number] {
  const normalized = path ? `/${path}` : "/";
  const localized = locale === "en" ? `/en${normalized === "/" ? "" : normalized}` : normalized;
  return {
    url: absolute(localized),
    changeFrequency: path === "blog" || path.startsWith("blog/") ? "weekly" : "monthly",
    priority,
    ...(updatedAt ? { lastModified: updatedAt } : {}),
    alternates: {
      languages: {
        ...(available.includes("fa") ? { "fa-IR": absolute(normalized) } : {}),
        ...(available.includes("en")
          ? { en: absolute(`/en${normalized === "/" ? "" : normalized}`) }
          : {}),
        "x-default": absolute(
          available.includes("fa") ? normalized : `/en${normalized === "/" ? "" : normalized}`,
        ),
      },
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = ["fa", "en"] as const;
  const staticItems = publicPages.flatMap((path) =>
    locales.map((locale) => item(path, path === "" ? 1 : 0.7, locale)),
  );
  const hubs = catalogKinds.flatMap((kind) => locales.map((locale) => item(kind, 0.8, locale)));
  const content = await listPublicSitemapContent();
  const details = content
    .filter((entry) => !entry.noIndex)
    .flatMap((entry) =>
      entry.locales.map((locale) =>
        item(`${entry.kind}/${entry.slug}`, 0.65, locale, entry.locales, entry.updatedAt),
      ),
    );

  return [...staticItems, ...hubs, ...details];
}
