import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { PortalShell } from "@/components/portal/portal-shell";
import { isLocale } from "@/i18n/routing";
import { hasPermission, isStaff } from "@/server/auth/permissions";
import { getCurrentIdentity } from "@/server/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
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
  if (!isStaff(identity.actor) || !hasPermission(identity.actor, "workspace.access")) {
    redirect(locale === "fa" ? "/dashboard" : "/en/dashboard");
  }

  return (
    <PortalShell locale={locale} kind="admin" identity={identity}>
      {children}
    </PortalShell>
  );
}
