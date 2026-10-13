import type { ReactNode } from "react";

import type { Locale } from "@/i18n/routing";

import { SiteFooter } from "./footer";
import { SiteHeader } from "./header";
import { ReferenceLocale } from "@/components/template/reference-locale";
import "./coorda.css";
import "./coorda-reference.css";
import "./coorda-reference-overrides.css";
import "./coorda-palette.css";

export function SiteShell({
  locale,
  children,
  heroUnderHeader = false,
}: {
  locale: Locale;
  children: ReactNode;
  heroUnderHeader?: boolean;
}) {
  return (
    <div className="rycode-studio rycode-coorda flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader locale={locale} />
      <ReferenceLocale locale={locale}>
      <main id="main-content" className={heroUnderHeader ? "coorda-reference flex-1" : "coorda-reference flex-1 pt-14 sm:pt-[72px]"}>
        {children}
      </main>
      </ReferenceLocale>
      <SiteFooter locale={locale} />
    </div>
  );
}
