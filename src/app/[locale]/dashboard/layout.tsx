import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { PortalShell } from "@/components/portal/portal-shell";
import { isLocale } from "@/i18n/routing";
import { hasPermission } from "@/server/auth/permissions";
import { getCurrentIdentity } from "@/server/auth/session";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) redirect("/");
  const identity = await getCurrentIdentity();
  if (!identity) redirect(locale === "fa" ? "/login" : "/en/login");
  if (!hasPermission(identity.actor, "workspace.access")) {
    redirect(locale === "fa" ? "/login" : "/en/login");
  }

  return (
    <PortalShell locale={locale} kind="customer" identity={identity}>
      {children}
    </PortalShell>
  );
}
