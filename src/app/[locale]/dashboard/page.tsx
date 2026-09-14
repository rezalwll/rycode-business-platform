import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { MetricCard, PortalHeader } from "@/components/portal/portal-shell";
import { isLocale } from "@/i18n/routing";
import { hasPermission } from "@/server/auth/permissions";
import { getCurrentIdentity } from "@/server/auth/session";
import { customerOverview } from "@/server/queries/portal";

export const metadata: Metadata = {
  title: "فضای کاری مشتری",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) redirect("/");
  const identity = await getCurrentIdentity();
  if (!identity) redirect(locale === "fa" ? "/login" : "/en/login");
  if (!hasPermission(identity.actor, "workspace.access")) {
    redirect(locale === "fa" ? "/login" : "/en/login");
  }
  const data = await customerOverview(identity.actor);
  const fa = locale === "fa";

  return (
    <>
      <PortalHeader
        eyebrow="DASHBOARD / LIVE"
        title={fa ? `سلام ${identity.name}` : `Hello ${identity.name}`}
        description={
          fa
            ? "خلاصه‌ای از وضعیت واقعی پروژه، پشتیبانی و مالی شما."
            : "A live summary of your projects, support and finance."
        }
      />
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label={fa ? "همه پروژه‌ها" : "All projects"} value={data.projects ?? "—"} />
        <MetricCard
          label={fa ? "پروژه فعال" : "Active projects"}
          value={data.activeProjects ?? "—"}
        />
        <MetricCard label={fa ? "تیکت باز" : "Open tickets"} value={data.openTickets ?? "—"} />
        <MetricCard
          label={fa ? "اعلان خوانده‌نشده" : "Unread notifications"}
          value={data.unreadNotifications ?? "—"}
        />
      </section>
      {data.outstandingByCurrency !== null && (
        <section className="mt-8">
          <h2 className="text-lg font-bold">{fa ? "مانده صورتحساب‌ها" : "Invoice balances"}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {fa
              ? "پس از کسر پرداخت‌های موفق، به تفکیک ارز."
              : "After successful payments, shown separately for each currency."}
          </p>
          {data.outstandingByCurrency.length ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {data.outstandingByCurrency.map((amount) => (
                <MetricCard
                  key={amount.currency}
                  label={amount.currency}
                  value={formatMoney(amount.outstandingAmount, amount.currency, locale)}
                />
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              {fa ? "صورتحساب بازی ندارید." : "You have no open invoices."}
            </p>
          )}
        </section>
      )}
    </>
  );
}

function formatMoney(value: bigint, currency: string, locale: "fa" | "en") {
  return `${new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(value)} ${currency}`;
}
