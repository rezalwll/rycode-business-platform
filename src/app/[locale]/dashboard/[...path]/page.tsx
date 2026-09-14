import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";
import { z } from "zod";

import {
  CustomerFileUpload,
  CustomerMilestoneApproval,
  CustomerNotificationReadButton,
  CustomerNotificationsToolbar,
  CustomerProfileForm,
  CustomerTicketActions,
  CustomerTicketCreateForm,
} from "@/components/portal/customer-operations";
import {
  DataTable,
  EmptyPortalState,
  MetricCard,
  PortalHeader,
} from "@/components/portal/portal-shell";
import { Link } from "@/i18n/navigation";
import { isLocale, type Locale } from "@/i18n/routing";
import { hasAnyPermission, type Actor, type Permission } from "@/server/auth/permissions";
import { getCurrentIdentity } from "@/server/auth/session";
import {
  customerFinance,
  customerLeads,
  customerNotifications,
  customerProfile,
  customerProject,
  customerProjects,
  customerTickets,
  customerTicketOptions,
} from "@/server/queries/portal";
import {
  canApproveCustomerMilestone,
  customerFileLibrary,
  customerTicketDetail,
  customerUploadProjects,
} from "@/server/queries/customer-details";

export const metadata: Metadata = {
  title: "فضای کاری مشتری",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string; path: string[] }>;
  searchParams: Promise<{ ticket?: string | string[] }>;
};

const sectionPermissions: Readonly<Record<string, readonly Permission[]>> = {
  requests: ["leads.read_own", "leads.read"],
  projects: ["projects.read_own", "projects.read"],
  files: ["files.read_own", "files.read"],
  payments: ["finance.read_own", "finance.read"],
  support: ["tickets.manage_own", "tickets.read", "tickets.manage"],
  notifications: ["notifications.read_own", "notifications.manage"],
  profile: ["profile.manage_own"],
};

export default async function DashboardSectionPage({ params, searchParams }: Props) {
  const { locale: rawLocale, path } = await params;
  if (!isLocale(rawLocale)) redirect("/");
  const locale = rawLocale;
  const identity = await getCurrentIdentity();
  if (!identity) redirect(locale === "fa" ? "/login" : "/en/login");

  if (path[0] === "projects" && path[1] && path.length === 2) {
    if (!hasAnyPermission(identity.actor, sectionPermissions.projects ?? [])) notFound();
    if (!z.string().uuid().safeParse(path[1]).success) notFound();
    return <ProjectDetail locale={locale} actor={identity.actor} projectId={path[1]} />;
  }
  if (path[0] === "support" && path[1] && path.length === 2) {
    if (!hasAnyPermission(identity.actor, sectionPermissions.support ?? [])) notFound();
    return <TicketDetail locale={locale} actor={identity.actor} ticketId={path[1]} />;
  }
  if (path.length !== 1) notFound();
  const requiredPermissions = path[0] ? sectionPermissions[path[0]] : undefined;
  if (!requiredPermissions || !hasAnyPermission(identity.actor, requiredPermissions)) notFound();

  switch (path[0]) {
    case "requests":
      return <Requests locale={locale} actor={identity.actor} />;
    case "projects":
      return <Projects locale={locale} actor={identity.actor} />;
    case "files":
      return <Files locale={locale} actor={identity.actor} />;
    case "payments":
      return <Finance locale={locale} actor={identity.actor} />;
    case "support":
      {
        const { ticket } = await searchParams;
        if (typeof ticket === "string") {
          redirect(
            `${locale === "fa" ? "" : "/en"}/dashboard/support/${encodeURIComponent(ticket)}`,
          );
        }
      }
      return <Support locale={locale} actor={identity.actor} />;
    case "notifications":
      return <Notifications locale={locale} actor={identity.actor} />;
    case "profile":
      return <Profile locale={locale} actor={identity.actor} />;
    default:
      notFound();
  }
}

const date = (value: Date | null, locale: Locale) =>
  value
    ? new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-GB", { dateStyle: "medium" }).format(
        value,
      )
    : "—";
const money = (value: bigint, currency: string, locale: Locale) =>
  `${new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(value)} ${currency}`;

function Frame({
  locale,
  code,
  faTitle,
  enTitle,
  faDescription,
  enDescription,
  children,
}: {
  locale: Locale;
  code: string;
  faTitle: string;
  enTitle: string;
  faDescription: string;
  enDescription: string;
  children: ReactNode;
}) {
  return (
    <>
      <PortalHeader
        eyebrow={code}
        title={locale === "fa" ? faTitle : enTitle}
        description={locale === "fa" ? faDescription : enDescription}
      />
      {children}
    </>
  );
}

async function Requests({ locale, actor }: { locale: Locale; actor: Actor }) {
  const rows = await customerLeads(actor);
  return (
    <Frame
      locale={locale}
      code="REQUESTS"
      faTitle="درخواست‌ها"
      enTitle="Requests"
      faDescription="درخواست‌هایی که با حساب یا مجموعه شما مرتبط شده‌اند."
      enDescription="Requests associated with your account or organisation."
    >
      {rows.length ? (
        <DataTable
          headers={
            locale === "fa"
              ? ["تاریخ", "نوع", "خدمت", "وضعیت"]
              : ["Date", "Type", "Service", "Status"]
          }
          rows={rows.map((row) => [
            date(row.createdAt, locale),
            row.type,
            row.service ?? "—",
            row.status,
          ])}
        />
      ) : (
        <EmptyPortalState
          title={locale === "fa" ? "درخواستی ثبت نشده" : "No requests yet"}
          description={
            locale === "fa"
              ? "پس از ثبت و اتصال درخواست به حساب، وضعیت آن اینجا دیده می‌شود."
              : "Requests appear here after they are submitted and associated with this account."
          }
        />
      )}
    </Frame>
  );
}

async function Projects({ locale, actor }: { locale: Locale; actor: Actor }) {
  const rows = await customerProjects(actor);
  return (
    <Frame
      locale={locale}
      code="PROJECTS"
      faTitle="پروژه‌ها"
      enTitle="Projects"
      faDescription="وضعیت، پیشرفت و موارد نیازمند اقدام شما."
      enDescription="Status, progress and items requiring your action."
    >
      {rows.length ? (
        <div className="mt-8 grid gap-4 xl:grid-cols-2">
          {rows.map((row) => (
            <Link
              key={row.id}
              href={`/dashboard/projects/${row.id}`}
              className="rounded-[6px] border border-border bg-surface p-6 transition-colors hover:border-brand/50"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="meta-label text-brand">{row.number}</span>
                <span className="text-xs text-muted-foreground">{row.status}</span>
              </div>
              <h2 className="mt-5 text-xl font-bold">{row.name}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{row.client.displayName}</p>
              <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-brand"
                  style={{ width: `${Math.max(0, Math.min(100, row.progress))}%` }}
                />
              </div>
              <p className="mt-2 text-xs tabular-nums text-muted-foreground">{row.progress}%</p>
              {row.clientAction && (
                <p className="mt-5 border-s-2 border-brand ps-3 text-sm leading-7">
                  {row.clientAction}
                </p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <EmptyPortalState
          title={locale === "fa" ? "پروژه‌ای در حساب نیست" : "No projects yet"}
          description={
            locale === "fa"
              ? "وقتی پروژه‌ای به حساب یا مجموعه شما تخصیص یابد، اینجا نمایش داده می‌شود."
              : "Projects appear here when they are assigned to your account or organisation."
          }
        />
      )}
    </Frame>
  );
}

async function ProjectDetail({
  locale,
  actor,
  projectId,
}: {
  locale: Locale;
  actor: Actor;
  projectId: string;
}) {
  const project = await customerProject(actor, projectId);
  if (!project) notFound();
  const canApprove = canApproveCustomerMilestone(actor, project.id, project.clientId);
  const canReadFiles = hasAnyPermission(actor, ["files.read_own", "files.read", "files.manage"]);
  const files = canReadFiles ? await customerFileLibrary(actor, project.id) : [];
  return (
    <Frame
      locale={locale}
      code={`PROJECT / ${project.number}`}
      faTitle={project.name}
      enTitle={project.name}
      faDescription={`${project.client.displayName} — ${project.status}`}
      enDescription={`${project.client.displayName} — ${project.status}`}
    >
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <MetricCard
          label={locale === "fa" ? "پیشرفت" : "Progress"}
          value={`${project.progress}%`}
        />
        <MetricCard
          label={locale === "fa" ? "نقاط عطف" : "Milestones"}
          value={project.milestones.length}
        />
        <MetricCard
          label={locale === "fa" ? "تیکت‌ها" : "Tickets"}
          value={project.tickets.length}
        />
      </section>
      <section className="mt-10">
        <h2 className="text-xl font-bold">{locale === "fa" ? "نقاط عطف" : "Milestones"}</h2>
        {project.milestones.length ? (
          <DataTable
            headers={
              locale === "fa"
                ? ["عنوان", "وضعیت", "پیشرفت", "موعد", "تایید"]
                : ["Title", "Status", "Progress", "Due", "Approval"]
            }
            rows={project.milestones.map((item) => [
              item.title,
              item.status,
              `${item.progress}%`,
              date(item.expectedEndDate, locale),
              canApprove && item.approvalRequired && item.status === "AWAITING_APPROVAL" ? (
                <CustomerMilestoneApproval key={item.id} locale={locale} milestoneId={item.id} />
              ) : (
                (item.approvals[0]?.decision ??
                (item.approvalRequired ? (locale === "fa" ? "منتظر" : "Pending") : "—"))
              ),
            ])}
          />
        ) : (
          <EmptyPortalState
            title={locale === "fa" ? "نقطه عطفی تعریف نشده" : "No milestones"}
            description={
              locale === "fa"
                ? "برنامه پروژه پس از تعریف توسط مدیر پروژه نمایش داده می‌شود."
                : "The delivery plan appears after the project manager defines it."
            }
          />
        )}
      </section>
      {canReadFiles && (
        <section className="mt-10">
          <h2 className="text-xl font-bold">
            {locale === "fa" ? "فایل‌های پروژه" : "Project files"}
          </h2>
          {hasAnyPermission(actor, ["files.read_own", "files.manage"]) && (
            <CustomerFileUpload
              locale={locale}
              target={{
                kind: "project",
                projectId: project.id,
                projects: [{ id: project.id, name: project.name }],
              }}
            />
          )}
          <FileRows locale={locale} rows={files} />
        </section>
      )}
      {project.activities.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold">
            {locale === "fa" ? "فعالیت پروژه" : "Project activity"}
          </h2>
          <DataTable
            headers={locale === "fa" ? ["تاریخ", "شرح"] : ["Date", "Description"]}
            rows={project.activities.map((item) => [
              date(item.createdAt, locale),
              item.description,
            ])}
          />
        </section>
      )}
    </Frame>
  );
}

async function Files({ locale, actor }: { locale: Locale; actor: Actor }) {
  const [rows, projects] = await Promise.all([
    customerFileLibrary(actor),
    hasAnyPermission(actor, ["files.read_own", "files.manage"])
      ? customerUploadProjects(actor)
      : Promise.resolve([]),
  ]);
  return (
    <Frame
      locale={locale}
      code="FILES / PRIVATE"
      faTitle="فایل‌های خصوصی"
      enTitle="Private files"
      faDescription="فایل‌های پروژه و وضعیت بررسی فایل‌های ارسالی شما."
      enDescription="Project files and the review status of your uploads."
    >
      <CustomerFileUpload locale={locale} target={{ kind: "project", projects }} />
      <FileRows locale={locale} rows={rows} />
    </Frame>
  );
}

function FileRows({
  locale,
  rows,
}: {
  locale: Locale;
  rows: Awaited<ReturnType<typeof customerFileLibrary>>;
}) {
  return (
    <>
      {rows.length ? (
        <DataTable
          headers={
            locale === "fa"
              ? ["فایل", "پروژه", "نوع", "حجم", "وضعیت"]
              : ["File", "Project", "Type", "Size", "Status"]
          }
          rows={rows.map((row) => [
            row.label ?? row.file.originalName,
            row.project.name,
            row.file.mimeType,
            `${Math.ceil(Number(row.file.sizeBytes) / 1024)} KB`,
            <FileDownload key={row.file.id} locale={locale} file={row.file} />,
          ])}
        />
      ) : (
        <EmptyPortalState
          title={locale === "fa" ? "فایلی در دسترس نیست" : "No files available"}
          description={
            locale === "fa"
              ? "فایل‌های پروژه و وضعیت فایل‌های ارسالی اینجا نمایش داده می‌شوند."
              : "Project files and upload review status appear here."
          }
        />
      )}
    </>
  );
}

function FileDownload({
  locale,
  file,
}: {
  locale: Locale;
  file: { id: string; status: string; scanStatus: string };
}) {
  if (file.status === "READY" && file.scanStatus === "CLEAN") {
    return (
      <a href={`/api/files/${file.id}`} className="font-bold text-brand">
        {locale === "fa" ? "دریافت" : "Download"}
      </a>
    );
  }
  return (
    <span className="text-xs text-muted-foreground">
      {file.status === "REJECTED"
        ? locale === "fa"
          ? "ردشده در بررسی امنیتی"
          : "Rejected in security review"
        : locale === "fa"
          ? "قرنطینه؛ در انتظار بررسی امنیتی"
          : "Quarantined; awaiting security review"}
    </span>
  );
}

async function Finance({ locale, actor }: { locale: Locale; actor: Actor }) {
  const rows = await customerFinance(actor);
  return (
    <Frame
      locale={locale}
      code="FINANCE"
      faTitle="صورتحساب‌ها و پرداخت"
      enTitle="Invoices and payments"
      faDescription="مبالغ بر حسب واحد ارز درج‌شده‌اند؛ IRR به معنای ریال است. مانده پس از کسر پرداخت‌های موفق نمایش داده می‌شود."
      enDescription="Amounts are in the stated currency units; IRR means Iranian rials. Balances subtract successful payments."
    >
      {rows.length ? (
        <DataTable
          headers={
            locale === "fa"
              ? ["شماره", "عنوان", "مبلغ", "پرداخت موفق", "مانده", "وضعیت", "سررسید"]
              : ["Number", "Title", "Amount", "Successful payments", "Balance", "Status", "Due"]
          }
          rows={rows.map((row) => {
            const paid = row.allocations.reduce((sum, allocation) => sum + allocation.amount, 0n);
            return [
              row.number,
              row.title,
              money(row.totalAmount, row.currency, locale),
              money(paid, row.currency, locale),
              row.status === "VOID" ? "—" : money(row.totalAmount - paid, row.currency, locale),
              row.status,
              date(row.dueDate, locale),
            ];
          })}
        />
      ) : (
        <EmptyPortalState
          title={locale === "fa" ? "صورتحسابی وجود ندارد" : "No invoices"}
          description={
            locale === "fa"
              ? "پس از صدور، صورتحساب‌های مجموعه شما اینجا قرار می‌گیرند."
              : "Issued invoices for your organisation appear here."
          }
        />
      )}
    </Frame>
  );
}

async function Support({ locale, actor }: { locale: Locale; actor: Actor }) {
  const canManage = hasAnyPermission(actor, ["tickets.manage_own", "tickets.manage"]);
  const [rows, options] = await Promise.all([
    customerTickets(actor),
    canManage ? customerTicketOptions(actor) : Promise.resolve(null),
  ]);
  return (
    <Frame
      locale={locale}
      code="SUPPORT"
      faTitle="پشتیبانی"
      enTitle="Support"
      faDescription="درخواست‌های پشتیبانی و تاریخچه پاسخ‌ها."
      enDescription="Support requests and reply history."
    >
      {options && (
        <CustomerTicketCreateForm
          locale={locale}
          clients={options.clients}
          projects={options.projects}
        />
      )}
      {rows.length ? (
        <DataTable
          headers={
            locale === "fa"
              ? ["شماره", "موضوع", "اولویت", "وضعیت", "پاسخ‌ها", "به‌روزرسانی"]
              : ["Number", "Subject", "Priority", "Status", "Replies", "Updated"]
          }
          rows={rows.map((row) => [
            row.number,
            <Link
              key={row.id}
              href={`/dashboard/support/${row.id}`}
              className="font-bold text-brand"
            >
              {row.subject}
            </Link>,
            row.priority,
            row.status,
            row._count.messages,
            date(row.updatedAt, locale),
          ])}
        />
      ) : (
        <EmptyPortalState
          title={locale === "fa" ? "تیکتی وجود ندارد" : "No tickets"}
          description={
            locale === "fa"
              ? "در این حساب هنوز درخواست پشتیبانی ثبت نشده است."
              : "No support request has been created for this account."
          }
        />
      )}
    </Frame>
  );
}

async function TicketDetail({
  locale,
  actor,
  ticketId,
}: {
  locale: Locale;
  actor: Actor;
  ticketId: string;
}) {
  const ticket = await customerTicketDetail(actor, ticketId);
  if (!ticket) notFound();
  const fa = locale === "fa";
  const canManage = hasAnyPermission(actor, ["tickets.manage_own", "tickets.manage"]);
  const latestOwnMessage = ticket.messages.find(
    (message) => message.authorId === actor.userId && !message.isSystem,
  );
  return (
    <Frame
      locale={locale}
      code={`SUPPORT / ${ticket.number}`}
      faTitle={ticket.subject}
      enTitle={ticket.subject}
      faDescription={`${ticket.client.displayName} — ${ticket.status}`}
      enDescription={`${ticket.client.displayName} — ${ticket.status}`}
    >
      <Link href="/dashboard/support" className="mt-6 inline-flex text-sm font-bold text-brand">
        {fa ? "همه تیکت‌ها" : "All tickets"}
      </Link>
      <dl className="mt-6 flex flex-wrap gap-6 text-sm">
        <div>
          <dt className="text-muted-foreground">{fa ? "اولویت" : "Priority"}</dt>
          <dd className="mt-1">{ticket.priority}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{fa ? "دسته‌بندی" : "Category"}</dt>
          <dd className="mt-1">{ticket.category}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{fa ? "ایجاد" : "Created"}</dt>
          <dd className="mt-1">{date(ticket.createdAt, locale)}</dd>
        </div>
        {ticket.project && (
          <div>
            <dt className="text-muted-foreground">{fa ? "پروژه" : "Project"}</dt>
            <dd className="mt-1">{ticket.project.name}</dd>
          </div>
        )}
      </dl>
      {ticket._count.messages > ticket.messages.length && (
        <p className="mt-6 text-xs text-muted-foreground">
          {fa ? "۱۰۰ پیام آخر نمایش داده می‌شود." : "Showing the latest 100 messages."}
        </p>
      )}
      <section aria-label={fa ? "گفتگو" : "Conversation"} className="mt-8 space-y-4">
        {[...ticket.messages].reverse().map((message) => (
          <article key={message.id} className="rounded-[6px] border border-border bg-surface p-5">
            <header className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="font-bold">
                {message.isSystem
                  ? fa
                    ? "رویداد تیکت"
                    : "Ticket event"
                  : (message.author?.name ?? (fa ? "کاربر" : "User"))}
              </span>
              <time dateTime={message.createdAt.toISOString()} className="text-muted-foreground">
                {date(message.createdAt, locale)}
              </time>
            </header>
            <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-8">{message.body}</p>
            {message.attachments.length > 0 && (
              <ul className="mt-4 space-y-3 border-t border-border pt-4">
                {message.attachments.map(({ file }) => (
                  <li
                    key={file.id}
                    className="flex flex-wrap items-center justify-between gap-3 text-sm"
                  >
                    <span>{file.originalName}</span>
                    <FileDownload locale={locale} file={file} />
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </section>
      {canManage && (
        <section className="mt-8 rounded-[6px] border border-border bg-surface p-5">
          <CustomerTicketActions locale={locale} ticketId={ticket.id} status={ticket.status} />
        </section>
      )}
      {canManage && latestOwnMessage && ticket.status !== "CLOSED" && (
        <div className="mt-6">
          <p className="text-xs text-muted-foreground">
            {fa
              ? "فایل به آخرین پیام شما در این تیکت پیوست می‌شود."
              : "The file will be attached to your latest message in this ticket."}
          </p>
          <CustomerFileUpload
            locale={locale}
            target={{ kind: "ticketMessage", messageId: latestOwnMessage.id }}
          />
        </div>
      )}
    </Frame>
  );
}

async function Notifications({ locale, actor }: { locale: Locale; actor: Actor }) {
  const rows = await customerNotifications(actor);
  return (
    <Frame
      locale={locale}
      code="NOTIFICATIONS"
      faTitle="اعلان‌ها"
      enTitle="Notifications"
      faDescription="رویدادهای مهم پروژه و پشتیبانی."
      enDescription="Important project and support events."
    >
      {rows.some((row) => !row.readAt) && <CustomerNotificationsToolbar locale={locale} />}
      {rows.length ? (
        <div className="mt-8 divide-y divide-border rounded-[6px] border border-border bg-surface">
          {rows.map((row) => (
            <article key={row.id} className="p-5">
              <div className="flex items-center justify-between gap-5">
                <h2 className="font-bold">{row.title}</h2>
                <span className="text-xs text-muted-foreground">{date(row.createdAt, locale)}</span>
              </div>
              {row.body && (
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{row.body}</p>
              )}
              <span className="mt-3 inline-flex text-xs text-brand">
                {row.readAt
                  ? locale === "fa"
                    ? "خوانده‌شده"
                    : "Read"
                  : locale === "fa"
                    ? "جدید"
                    : "New"}
              </span>
              {!row.readAt && (
                <div className="mt-4">
                  <CustomerNotificationReadButton locale={locale} notificationId={row.id} />
                </div>
              )}
              {row.link?.startsWith("/dashboard") && !row.link.includes("\\") && (
                <Link href={row.link} className="mt-4 inline-flex text-sm font-bold text-brand">
                  {locale === "fa" ? "مشاهده" : "View"}
                </Link>
              )}
            </article>
          ))}
        </div>
      ) : (
        <EmptyPortalState
          title={locale === "fa" ? "اعلان جدیدی ندارید" : "No notifications"}
          description={
            locale === "fa"
              ? "رویدادهای مهم در این بخش نمایش داده می‌شوند."
              : "Important events appear here."
          }
        />
      )}
    </Frame>
  );
}

async function Profile({ locale, actor }: { locale: Locale; actor: Actor }) {
  const row = await customerProfile(actor);
  if (!row) notFound();
  return (
    <Frame
      locale={locale}
      code="PROFILE"
      faTitle="پروفایل و عضویت‌ها"
      enTitle="Profile and memberships"
      faDescription="اطلاعات هویتی و مجموعه‌هایی که به آن‌ها دسترسی دارید."
      enDescription="Identity details and organisations you can access."
    >
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <CustomerProfileForm
          locale={locale}
          defaults={{
            displayName: row.profile?.displayName ?? row.name,
            phone: row.profile?.phone ?? null,
            company: row.profile?.company ?? null,
            locale: row.profile?.locale ?? locale,
            timezone: row.profile?.timezone ?? "Asia/Tehran",
            bio: row.profile?.bio ?? null,
          }}
        />
        <article className="rounded-[6px] border border-border bg-surface p-6">
          <dl className="space-y-5 text-sm">
            <div>
              <dt className="text-muted-foreground">{locale === "fa" ? "نام" : "Name"}</dt>
              <dd className="mt-1 font-bold">{row.profile?.displayName ?? row.name}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{locale === "fa" ? "ایمیل" : "Email"}</dt>
              <dd className="mt-1 font-bold" dir="ltr">
                {row.email}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{locale === "fa" ? "تلفن" : "Phone"}</dt>
              <dd className="mt-1 font-bold" dir="ltr">
                {row.profile?.phone ?? "—"}
              </dd>
            </div>
          </dl>
        </article>
        <article className="rounded-[6px] border border-border bg-surface p-6">
          <h2 className="font-bold">{locale === "fa" ? "مجموعه‌ها" : "Organisations"}</h2>
          {row.clientMemberships.length ? (
            <ul className="mt-4 space-y-3">
              {row.clientMemberships.map((membership) => (
                <li
                  key={membership.client.id}
                  className="flex items-center justify-between border-t border-border pt-3 text-sm"
                >
                  <span>{membership.client.displayName}</span>
                  <span className="text-xs text-muted-foreground">{membership.role}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              {locale === "fa" ? "هنوز عضویتی ثبت نشده است." : "No organisation memberships yet."}
            </p>
          )}
        </article>
      </div>
    </Frame>
  );
}
