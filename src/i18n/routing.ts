export const routing = {
  locales: ["fa", "en"] as const,
  defaultLocale: "fa",
  localePrefix: "as-needed",
  localeDetection: false,
} as const;

export type Locale = (typeof routing.locales)[number];

export function isLocale(value: string): value is Locale {
  return routing.locales.some((locale) => locale === value);
}

export function localeDirection(locale: Locale): "rtl" | "ltr" {
  return locale === "fa" ? "rtl" : "ltr";
}
