import type { ReactNode } from "react";

import type { Locale } from "@/i18n/routing";

import { SiteFooter } from "./footer";
import { SiteHeader } from "./header";

export function SiteShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader locale={locale} />
      <main className="flex-1">{children}</main>
      <SiteFooter locale={locale} />
    </div>
  );
}
