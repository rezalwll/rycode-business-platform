import { notFound } from "next/navigation";

import { AdminContentOperations } from "@/components/portal/admin-content";
import { AdminInvoiceOperations } from "@/components/portal/admin-finance";
import {
  AdminLeadOperations,
  AdminProjectOperations,
  AdminTicketOperations,
} from "@/components/portal/admin-operations";
import { DataTable, PortalHeader } from "@/components/portal/portal-shell";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { hasPermission, type Actor } from "@/server/auth/permissions";
import {
  adminClientOptions,
  adminContentDetail,
  adminInvoiceDetail,
  adminLeadDetail,
  adminLeadOwnerOptions,
  adminMediaOptions,
  adminProjectDetail,
  adminTaxonomyOptions,
  adminTicketDetail,
} from "@/server/queries/admin-details";

const copy = (locale: Locale, fa: string, en: string) => (locale === "fa" ? fa : en);
const date = (value: Date | null, locale: Locale) =>
  value
    ? new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(value)
    : "—";
const amount = (value: bigint, currency: string, locale: Locale) =>
  `${new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(value)} ${currency}`;
const dateField = (value: Date | null) => value?.toISOString().slice(0, 10) ?? "";
type DetailProps = { locale: Locale; actor: Actor; id: string };

function BackLink({ locale, section }: { locale: Locale; section: string }) {
  return (
    <Link
      href={`/admin/${section}`}
      locale={locale}
      className="mb-6 inline-flex min-h-10 items-center text-sm font-bold text-brand hover:underline"
    >
      {copy(locale, "بازگشت به فهرست", "Back to list")}
    </Link>
  );
}

export async function AdminLeadDetailPage({ locale, actor, id }: DetailProps) {
  const lead = await adminLeadDetail(actor, id);
  if (!lead) notFound();
  const manage = hasPermission(actor, "leads.manage");
  const convert =
    manage && hasPermission(actor, "clients.manage") && hasPermission(actor, "projects.manage");
  const [clients, owners] = await Promise.all([
    convert ? adminClientOptions(actor, "clients.manage") : Promise.resolve([]),
    manage ? adminLeadOwnerOptions(actor) : Promise.resolve([]),
  ]);
  return (
    <>
      <BackLink locale={locale} section="leads" />
      <PortalHeader
        eyebrow="CRM / LEAD"
        title={lead.name}
        description={`${lead.type} · ${lead.status}`}
      />
      <dl className="mt-8 grid gap-4 rounded-[6px] border border-border p-5 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">{copy(locale, "تماس", "Contact")}</dt>
          <dd className="mt-2" dir="auto">
            {[lead.email, lead.phone].filter(Boolean).join(" · ") || "—"}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{copy(locale, "مجموعه", "Organisation")}</dt>
          <dd className="mt-2">{lead.company ?? "—"}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-muted-foreground">
            {copy(locale, "شرح درخواست", "Request summary")}
          </dt>
          <dd className="mt-2 whitespace-pre-wrap leading-7">{lead.summary ?? "—"}</dd>
        </div>
        {lead.analyticsSession && (
          <div className="sm:col-span-2">
            <dt className="text-muted-foreground">
              {copy(locale, "منبع بازاریابی", "Marketing attribution")}
            </dt>
            <dd className="mt-2 leading-7" dir="ltr">
              {[
                lead.analyticsSession.utmSource,
                lead.analyticsSession.utmMedium,
                lead.analyticsSession.utmCampaign,
              ]
                .filter(Boolean)
                .join(" / ") ||
                lead.analyticsSession.referrer ||
                lead.analyticsSession.landingPath ||
                "direct"}
            </dd>
          </div>
        )}
      </dl>
      {lead.convertedProject && hasPermission(actor, "projects.read") && (
        <p className="mt-5 text-sm">
          {copy(locale, "پروژه ایجادشده: ", "Created project: ")}
          <Link
            locale={locale}
            href={`/admin/projects/${lead.convertedProject.id}`}
            className="text-brand hover:underline"
          >
            {lead.convertedProject.number} · {lead.convertedProject.name}
          </Link>
        </p>
      )}
      {manage && (
        <AdminLeadOperations
          locale={locale}
          lead={{
            id: lead.id,
            name: lead.name,
            company: lead.company,
            status: lead.status,
            ownerId: lead.ownerId,
            converted: Boolean(lead.convertedProject),
          }}
          clients={clients}
          owners={owners}
          canConvert={convert}
        />
      )}
      <h2 className="mt-10 font-bold">{copy(locale, "سابقه پیگیری", "Follow-up history")}</h2>
      {lead.activities.length > 0 ? (
        <DataTable
          headers={
            locale === "fa"
              ? ["زمان", "همکار", "رویداد", "شرح"]
              : ["Time", "Team member", "Event", "Details"]
          }
          rows={lead.activities.map((activity) => [
            date(activity.createdAt, locale),
            activity.actor?.name ?? "—",
            activity.type,
            <span key={activity.id} className="whitespace-pre-wrap">
              {activity.note ??
                [activity.fromStatus, activity.toStatus].filter(Boolean).join(" → ")}
            </span>,
          ])}
        />
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          {copy(locale, "هنوز رویدادی ثبت نشده است.", "No follow-up activity yet.")}
        </p>
      )}
    </>
  );
}

export async function AdminProjectDetailPage({ locale, actor, id }: DetailProps) {
  const project = await adminProjectDetail(actor, id);
  if (!project) notFound();
  return (
    <>
      <BackLink locale={locale} section="projects" />
      <PortalHeader
        eyebrow={project.number}
        title={project.name}
        description={`${project.client.displayName} · ${project.status} · ${project.progress}%`}
      />
      {project.scope && (
        <p className="mt-8 whitespace-pre-wrap text-sm leading-8 text-muted-foreground">
          {project.scope}
        </p>
      )}
      <DataTable
        headers={
          locale === "fa"
            ? ["مرحله", "وضعیت", "پیشرفت", "سررسید"]
            : ["Milestone", "Status", "Progress", "Due"]
        }
        rows={project.milestones.map((milestone) => [
          milestone.title,
          milestone.status,
          `${milestone.progress}%`,
          date(milestone.expectedEndDate, locale),
        ])}
      />
      {hasPermission(actor, "projects.manage") && (
        <AdminProjectOperations
          locale={locale}
          project={{
            ...project,
            startDate: dateField(project.startDate),
            expectedEndDate: dateField(project.expectedEndDate),
            milestones: project.milestones.map((milestone) => ({
              ...milestone,
              expectedEndDate: dateField(milestone.expectedEndDate),
            })),
          }}
        />
      )}
    </>
  );
}

export async function AdminInvoiceDetailPage({ locale, actor, id }: DetailProps) {
  const invoice = await adminInvoiceDetail(actor, id);
  if (!invoice) notFound();
  const paid = invoice.allocations
    .filter((allocation) => allocation.payment.status === "SUCCEEDED")
    .reduce((sum, allocation) => sum + allocation.amount, 0n);
  const outstanding = invoice.totalAmount - paid;
  const payments = Array.from(
    new Map(invoice.allocations.map(({ payment }) => [payment.id, payment])).values(),
  );
  return (
    <>
      <BackLink locale={locale} section="finance" />
      <PortalHeader
        eyebrow={invoice.number}
        title={invoice.title}
        description={`${invoice.client.displayName} · ${invoice.status}`}
      />
      <div className="mt-8 grid gap-4 rounded-[6px] border border-border p-5 text-sm sm:grid-cols-3">
        <p>
          {copy(locale, "مبلغ نهایی: ", "Total: ")}
          {amount(invoice.totalAmount, invoice.currency, locale)}
        </p>
        <p>
          {copy(locale, "پرداخت‌شده: ", "Paid: ")}
          {amount(paid, invoice.currency, locale)}
        </p>
        <p>
          {copy(locale, "مانده: ", "Outstanding: ")}
          {amount(outstanding, invoice.currency, locale)}
        </p>
      </div>
      <DataTable
        headers={
          locale === "fa"
            ? ["شرح", "تعداد", "واحد", "جمع"]
            : ["Description", "Quantity", "Unit", "Total"]
        }
        rows={invoice.items.map((item) => [
          item.description,
          item.quantity.toString(),
          amount(item.unitAmount, invoice.currency, locale),
          amount(item.totalAmount, invoice.currency, locale),
        ])}
      />
      {invoice.installments.length > 0 && (
        <>
          <h2 className="mt-8 font-bold">{copy(locale, "اقساط", "Installments")}</h2>
          <DataTable
            headers={
              locale === "fa"
                ? ["عنوان", "مبلغ", "وضعیت", "سررسید"]
                : ["Label", "Amount", "Status", "Due"]
            }
            rows={invoice.installments.map((item) => [
              item.label,
              amount(item.amount, invoice.currency, locale),
              item.status,
              date(item.dueDate, locale),
            ])}
          />
        </>
      )}
      <h2 className="mt-8 font-bold">{copy(locale, "پرداخت‌ها", "Payments")}</h2>
      {invoice.allocations.length > 0 ? (
        <DataTable
          headers={
            locale === "fa"
              ? ["پیگیری", "مبلغ تخصیص", "روش", "وضعیت", "تاریخ"]
              : ["Reference", "Allocation", "Method", "Status", "Date"]
          }
          rows={invoice.allocations.map((allocation) => [
            allocation.payment.providerReference ?? "—",
            amount(allocation.amount, invoice.currency, locale),
            allocation.payment.method,
            allocation.payment.status,
            date(allocation.payment.paidAt, locale),
          ])}
        />
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          {copy(locale, "هنوز پرداختی ثبت نشده است.", "No payments recorded yet.")}
        </p>
      )}
      {invoice.notes && (
        <p className="mt-6 whitespace-pre-wrap text-sm leading-7">{invoice.notes}</p>
      )}
      {hasPermission(actor, "finance.manage") && (
        <AdminInvoiceOperations
          locale={locale}
          invoice={{
            id: invoice.id,
            clientId: invoice.clientId,
            currency: invoice.currency,
            status: invoice.status,
            outstanding: outstanding.toString(),
            installments: invoice.installments.map(
              ({ id: installmentId, label: installmentLabel, status }) => ({
                id: installmentId,
                label: installmentLabel,
                status,
              }),
            ),
          }}
          payments={payments.map((payment) => ({
            id: payment.id,
            status: payment.status,
            reference: payment.providerReference,
          }))}
        />
      )}
    </>
  );
}

export async function AdminTicketDetailPage({ locale, actor, id }: DetailProps) {
  const ticket = await adminTicketDetail(actor, id);
  if (!ticket) notFound();
  return (
    <>
      <BackLink locale={locale} section="support" />
      <PortalHeader
        eyebrow={ticket.number}
        title={ticket.subject}
        description={`${ticket.client.displayName} · ${ticket.priority} · ${ticket.status}`}
      />
      <div className="mt-8 space-y-4">
        {ticket.messages.map((message) => (
          <article
            key={message.id}
            className={`rounded-[6px] border p-5 ${message.visibility === "INTERNAL" ? "border-brand/40 bg-brand/5" : "border-border bg-surface"}`}
          >
            <div className="flex flex-wrap justify-between gap-3 text-xs text-muted-foreground">
              <span>
                {message.author?.name ?? copy(locale, "سیستم", "System")} ·{" "}
                {message.visibility === "INTERNAL"
                  ? copy(locale, "یادداشت داخلی", "Internal note")
                  : copy(locale, "قابل مشاهده برای مشتری", "Visible to client")}
              </span>
              <time dateTime={message.createdAt.toISOString()}>
                {date(message.createdAt, locale)}
              </time>
            </div>
            <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-8">{message.body}</p>
          </article>
        ))}
      </div>
      {hasPermission(actor, "tickets.manage") && (
        <AdminTicketOperations locale={locale} ticketId={ticket.id} status={ticket.status} />
      )}
    </>
  );
}

export async function AdminContentDetailPage({ locale, actor, id }: DetailProps) {
  const content = await adminContentDetail(actor, id);
  if (!content) notFound();
  const manage = hasPermission(actor, "cms.manage");
  const [media, taxonomy] = await Promise.all([
    manage ? adminMediaOptions(actor) : Promise.resolve([]),
    manage
      ? adminTaxonomyOptions(actor)
      : Promise.resolve({ categories: [], tags: [], authors: [], faqs: [] }),
  ]);
  const title =
    content.translations.find((translation) => translation.locale === locale)?.title ??
    content.slug;
  return (
    <>
      <BackLink locale={locale} section="content" />
      <PortalHeader
        eyebrow={`${content.kind} / ${content.status}`}
        title={title}
        description={content.slug}
      />
      <DataTable
        headers={locale === "fa" ? ["زبان", "عنوان", "وضعیت"] : ["Language", "Title", "State"]}
        rows={content.translations.map((translation) => [
          translation.locale,
          translation.title,
          translation.state,
        ])}
      />
      <AdminContentOperations
        locale={locale}
        content={content}
        media={media}
        categories={taxonomy.categories}
        tags={taxonomy.tags}
        authors={taxonomy.authors}
        faqs={taxonomy.faqs}
        canManage={manage}
        canPublish={hasPermission(actor, "cms.publish")}
      />
    </>
  );
}
