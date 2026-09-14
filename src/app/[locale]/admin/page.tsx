import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { MetricCard, PortalHeader } from "@/components/portal/portal-shell";
import { isLocale } from "@/i18n/routing";
import { hasPermission, isStaff, type Permission } from "@/server/auth/permissions";
import { getCurrentIdentity } from "@/server/auth/session";
import { adminOverview } from "@/server/queries/portal";

export const metadata: Metadata = {
  title: "مدیریت رای‌کد",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const overviewPermissions: readonly Permission[] = [
  "leads.read",
  "projects.read",
  "tickets.read",
  "finance.read",
  "users.read",
  "cms.read",
];

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) redirect("/");
  const identity = await getCurrentIdentity();
  if (
    !identity ||
    !isStaff(identity.actor) ||
    !overviewPermissions.some((permission) => hasPermission(identity.actor, permission))
  )
    redirect(locale === "fa" ? "/dashboard" : "/en/dashboard");
  const data = await adminOverview(identity.actor);
  const fa = locale === "fa";

  return (
    <>
      <PortalHeader
        eyebrow="OPERATIONS / LIVE"
        title={fa ? "مرکز عملیات رای‌کد" : "RYCODE operations"}
        description={
          fa
            ? "نیازمند توجه، وضعیت کسب‌وکار و محتوا؛ فقط بر اساس داده واقعی."
            : "Attention items, business state and content—derived only from live records."
        }
      />
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <MetricCard label={fa ? "سرنخ جدید" : "New leads"} value={data.newLeads ?? "—"} />
        <MetricCard
          label={fa ? "پروژه فعال" : "Active projects"}
          value={data.activeProjects ?? "—"}
        />
        <MetricCard
          label={fa ? "تیکت منتظر تیم" : "Tickets needing staff"}
          value={data.openTickets ?? "—"}
        />
        <MetricCard
          label={fa ? "صورتحساب معوق" : "Overdue invoices"}
          value={data.overdueInvoices ?? "—"}
        />
        <MetricCard label={fa ? "کاربر" : "Users"} value={data.users ?? "—"} />
        <MetricCard
          label={fa ? "محتوای منتشرشده" : "Published content"}
          value={data.publishedContent ?? "—"}
        />
      </section>
    </>
  );
}
