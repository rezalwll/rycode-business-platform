import { AuthCard } from "@/components/auth/auth-card";
import { SiteShell } from "@/components/site/site-shell";
import type { Locale } from "@/i18n/routing";
import { Suspense } from "react";

export function AuthPage({
  locale,
  mode,
}: {
  locale: Locale;
  mode: "login" | "register" | "forgot" | "reset";
}) {
  return (
    <SiteShell locale={locale}>
      <div className="grid-field grid min-h-[calc(100vh-76px)] place-items-center px-5 py-20">
        <Suspense
          fallback={<div className="h-96 w-full max-w-md animate-pulse rounded-[6px] bg-surface" />}
        >
          <AuthCard locale={locale} mode={mode} />
        </Suspense>
      </div>
    </SiteShell>
  );
}
