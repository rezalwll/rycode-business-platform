"use client";
import { createContext, useContext, type ReactNode } from "react";
import type { Locale } from "@/i18n/routing";
import { localizedHref } from "@/i18n/public-href";
import { referenceCopy } from "./reference-copy";

const Context = createContext<Locale>("fa");
export function ReferenceLocale({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <Context.Provider value={locale}>{children}</Context.Provider>;
}
export function useReferenceLocale() {
  const locale = useContext(Context);
  return {
    locale,
    fa: locale === "fa",
    href: (path: string) => {
      if (path.startsWith("#") || /^https?:/.test(path)) return path;
      const mapped =
        path === "/download" ? "/start-project" : path === "/insights" ? "/blog" : path;
      return localizedHref(locale, mapped);
    },
    copyText: <T,>(value: T): T => {
      if (typeof value !== "string" || locale === "en") return value;
      const key = value.trim();
      const translated = referenceCopy[key];
      return translated
        ? (`${value.match(/^\s*/)?.[0] ?? ""}${translated}${value.match(/\s*$/)?.[0] ?? ""}` as T)
        : value;
    },
    text: (fa: string, en: string) => (locale === "fa" ? fa : en),
  };
}
