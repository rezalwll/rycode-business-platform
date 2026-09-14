import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";

import { AdminCreateContent } from "@/components/portal/admin-content";
import { AdminClientForm, AdminClientMembersForm } from "@/components/portal/admin-clients";
import { AdminFaqForm } from "@/components/portal/admin-faqs";
import { AdminUserRolesForm } from "@/components/portal/admin-access";
import { AdminMediaUpload } from "@/components/portal/admin-media-upload";
import { AdminMediaMetadataForm } from "@/components/portal/admin-media-metadata";
import { AdminRedirectForm } from "@/components/portal/admin-redirect";
import { AdminSettingForm } from "@/components/portal/admin-settings";
import {
  AdminAuthorForm,
  AdminCategoryForm,
  AdminTagForm,
} from "@/components/portal/admin-taxonomy";
import {
  AdminContentDetailPage,
  AdminInvoiceDetailPage,
  AdminLeadDetailPage,
  AdminProjectDetailPage,
  AdminTicketDetailPage,
} from "@/components/portal/admin-details";
import { AdminCreateInvoice } from "@/components/portal/admin-finance";
import { AdminCreateProject } from "@/components/portal/admin-operations";
import {
  DataTable,
  EmptyPortalState,
  MetricCard,
  PortalHeader,
} from "@/components/portal/portal-shell";
import { isLocale, type Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { reviewFileScanFormAction } from "@/features/storage/actions";
import { hasPermission, isStaff, type Actor, type Permission } from "@/server/auth/permissions";
import { getCurrentIdentity } from "@/server/auth/session";
import {
  adminClientOptions,
  adminClientMemberOptions,
  adminInvoiceOptions,
  adminMediaOptions,
} from "@/server/queries/admin-details";
import {
  adminAnalytics,
  adminAuthors,
  adminAuditLogs,
  adminCategories,
  adminClients,
  adminContent,
  adminFinance,
  adminFaqs,
  adminFiles,
  adminLeads,
  adminProjects,
  adminRoles,
  adminSeo,
  adminSettings,
  adminTags,
  adminTickets,
  adminUsers,
} from "@/server/queries/portal";

export const metadata: Metadata = {
  title: "مدیریت رای‌کد",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const sectionPermissions: Readonly<Record<string, Permission>> = {
  leads: "leads.read",
  customers: "clients.read",
  projects: "projects.read",
  files: "files.manage",
  finance: "finance.read",
  invoices: "finance.read",
  payments: "finance.read",
  installments: "finance.read",
  support: "tickets.read",
  tickets: "tickets.read",
  messages: "tickets.read",
  content: "cms.read",
  articles: "cms.read",
  authors: "cms.read",
  categories: "cms.read",
  tags: "cms.read",
  faqs: "cms.read",
  seo: "cms.read",
  analytics: "analytics.read",
  users: "users.read",
  roles: "roles.manage",
  logs: "audit.read",
  settings: "settings.manage",
};

export default async function AdminSectionPage({
  params,
}: {
  params: Promise<{ locale: string; path: string[] }>;
}) {
  const { locale: rawLocale, path } = await params;
  if (!isLocale(rawLocale)) redirect("/");
  const identity = await getCurrentIdentity();
  if (!identity || !isStaff(identity.actor))
    redirect(rawLocale === "fa" ? "/dashboard" : "/en/dashboard");
  const locale = rawLocale;
  if (path.length < 1 || path.length > 2) notFound();
  const segment = path[0];
  const requiredPermission = segment ? sectionPermissions[segment] : undefined;
  if (!requiredPermission || !hasPermission(identity.actor, requiredPermission)) notFound();

  const actor = identity.actor;
  const detailId = path[1];
  if (detailId) {
    if (segment === "leads")
      return <AdminLeadDetailPage locale={locale} actor={actor} id={detailId} />;
    if (segment === "projects")
      return <AdminProjectDetailPage locale={locale} actor={actor} id={detailId} />;
    if (["finance", "invoices"].includes(segment ?? ""))
      return <AdminInvoiceDetailPage locale={locale} actor={actor} id={detailId} />;
    if (["support", "tickets", "messages"].includes(segment ?? ""))
      return <AdminTicketDetailPage locale={locale} actor={actor} id={detailId} />;
    if (["content", "articles"].includes(segment ?? ""))
      return <AdminContentDetailPage locale={locale} actor={actor} id={detailId} />;
    notFound();
  }
  if (segment === "leads") return <Leads locale={locale} actor={actor} />;
  if (segment === "customers") return <Clients locale={locale} actor={actor} />;
  if (segment === "projects") return <Projects locale={locale} actor={actor} />;
  if (segment === "files") return <Files locale={locale} actor={actor} />;
  if (["finance", "invoices", "payments", "installments"].includes(segment ?? ""))
    return <Finance locale={locale} actor={actor} />;
  if (["support", "tickets", "messages"].includes(segment ?? ""))
    return <Tickets locale={locale} actor={actor} />;
  if (segment === "categories") return <Categories locale={locale} actor={actor} />;
  if (segment === "tags") return <Tags locale={locale} actor={actor} />;
  if (segment === "authors") return <Authors locale={locale} actor={actor} />;
  if (segment === "faqs") return <Faqs locale={locale} actor={actor} />;
  if (["content", "articles"].includes(segment ?? ""))
    return <Content locale={locale} actor={actor} />;
  if (segment === "seo") return <Seo locale={locale} actor={actor} />;
  if (segment === "analytics") return <Analytics locale={locale} actor={actor} />;
  if (segment === "users") return <Users locale={locale} actor={actor} />;
  if (segment === "roles") return <Roles locale={locale} actor={actor} />;
  if (segment === "logs") return <Logs locale={locale} actor={actor} />;
  if (segment === "settings") return <Settings locale={locale} actor={actor} />;
  notFound();
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

function Empty({ locale, noun }: { locale: Locale; noun: string }) {
  return (
    <EmptyPortalState
      title={locale === "fa" ? `هنوز ${noun} ثبت نشده است` : `No ${noun} yet`}
      description={
        locale === "fa"
          ? "رکوردهای ثبت‌شده در این بخش نمایش داده می‌شوند."
          : "Records will appear here as they are created."
      }
    />
  );
}

type SectionProps = { locale: Locale; actor: Actor };

async function Leads({ locale, actor }: SectionProps) {
  const rows = await adminLeads(actor);
  return (
    <Frame
      locale={locale}
      code="CRM / LEADS"
      faTitle="سرنخ‌ها"
      enTitle="Leads"
      faDescription="ورودی فرم‌ها، مالکیت، Qualification و تبدیل تراکنشی."
      enDescription="Form intake, ownership, qualification and transactional conversion."
    >
      {rows.length ? (
        <DataTable
          headers={
            locale === "fa"
              ? ["تاریخ", "نام", "تماس", "نوع", "وضعیت", "مالک"]
              : ["Date", "Name", "Contact", "Type", "Status", "Owner"]
          }
          rows={rows.map((row) => [
            date(row.createdAt, locale),
            <Link
              key={row.id}
              locale={locale}
              href={`/admin/leads/${row.id}`}
              className="font-bold text-brand hover:underline"
            >
              {row.name}
            </Link>,
            row.email ?? row.phone ?? "—",
            row.type,
            row.status,
            row.owner?.name ?? "—",
          ])}
        />
      ) : (
        <Empty locale={locale} noun={locale === "fa" ? "سرنخی" : "leads"} />
      )}
    </Frame>
  );
}

async function Clients({ locale, actor }: SectionProps) {
  const rows = await adminClients(actor);
  const canManage = hasPermission(actor, "clients.manage");
  const users = canManage ? await adminClientMemberOptions(actor) : [];
  return (
    <Frame
      locale={locale}
      code="CRM / CLIENTS"
      faTitle="مشتریان"
      enTitle="Clients"
      faDescription="مجموعه، اعضا و ارتباط آن با پروژه و امور مالی."
      enDescription="Organisations, memberships and links to projects and finance."
    >
      {canManage && <AdminClientForm locale={locale} />}
      {rows.length ? (
        <>
          <DataTable
            headers={
              locale === "fa"
                ? ["نام", "نوع", "اعضا", "پروژه", "صورتحساب", "وضعیت"]
                : ["Name", "Type", "Members", "Projects", "Invoices", "State"]
            }
            rows={rows.map((row) => [
              row.displayName,
              row.kind,
              row._count.members,
              row._count.projects,
              row._count.invoices,
              row.isActive
                ? locale === "fa"
                  ? "فعال"
                  : "Active"
                : locale === "fa"
                  ? "غیرفعال"
                  : "Inactive",
            ])}
          />
          {canManage && (
            <div className="mt-6 space-y-4">
              {rows.map((row) => {
                const item = {
                  id: row.id,
                  kind: row.kind,
                  displayName: row.displayName,
                  legalName: row.legalName,
                  email: row.email,
                  phone: row.phone,
                  taxId: row.taxId,
                  billingAddress: row.billingAddress,
                  isActive: row.isActive,
                  members: row.members.map(({ userId, role, isPrimary }) => ({
                    userId,
                    role,
                    isPrimary,
                  })),
                };
                return (
                  <div key={row.id} className="grid items-start gap-4 xl:grid-cols-2">
                    <AdminClientForm locale={locale} item={item} />
                    <AdminClientMembersForm locale={locale} client={item} users={users} />
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <Empty locale={locale} noun={locale === "fa" ? "مشتری‌ای" : "clients"} />
      )}
    </Frame>
  );
}

async function Projects({ locale, actor }: SectionProps) {
  const rows = await adminProjects(actor);
  const canManage = hasPermission(actor, "projects.manage");
  const clients = canManage ? await adminClientOptions(actor, "projects.manage") : [];
  return (
    <Frame
      locale={locale}
      code="DELIVERY / PROJECTS"
      faTitle="پروژه‌ها"
      enTitle="Projects"
      faDescription="وضعیت تحویل، اعضا، نقاط عطف و پشتیبانی."
      enDescription="Delivery state, members, milestones and support."
    >
      {canManage && <AdminCreateProject locale={locale} clients={clients} />}
      {rows.length ? (
        <DataTable
          headers={
            locale === "fa"
              ? ["شماره", "پروژه", "مشتری", "وضعیت", "پیشرفت", "Milestone", "به‌روزرسانی"]
              : ["Number", "Project", "Client", "Status", "Progress", "Milestones", "Updated"]
          }
          rows={rows.map((row) => [
            row.number,
            <Link
              key={row.id}
              locale={locale}
              href={`/admin/projects/${row.id}`}
              className="font-bold text-brand hover:underline"
            >
              {row.name}
            </Link>,
            row.client.displayName,
            row.status,
            `${row.progress}%`,
            row._count.milestones,
            date(row.updatedAt, locale),
          ])}
        />
      ) : (
        <Empty locale={locale} noun={locale === "fa" ? "پروژه‌ای" : "projects"} />
      )}
    </Frame>
  );
}

async function Files({ locale, actor }: SectionProps) {
  const rows = await adminFiles(actor);
  return (
    <Frame
      locale={locale}
      code="STORAGE / QUARANTINE"
      faTitle="فایل‌ها و قرنطینه"
      enTitle="Files and quarantine"
      faDescription="دانلود عمومی فقط پس از بررسی قرنطینه و ثبت تصمیم در Audit فعال می‌شود."
      enDescription="Normal downloads remain blocked until quarantine review is audited."
    >
      {hasPermission(actor, "cms.manage") && <AdminMediaUpload locale={locale} />}
      {rows.length ? (
        <>
          <DataTable
            headers={
              locale === "fa"
                ? ["فایل", "نوع", "اندازه", "وضعیت", "اسکن", "بارگذار", "تاریخ", "بررسی"]
                : ["File", "Kind", "Size", "Status", "Scan", "Uploader", "Date", "Review"]
            }
            rows={rows.map((row) => [
              row.originalName,
              row.category,
              `${new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(Number(row.sizeBytes))} B`,
              row.status,
              row.scanStatus,
              row.uploadedBy?.name ?? row.uploadedBy?.email ?? "—",
              date(row.createdAt, locale),
              row.status === "QUARANTINED" && ["PENDING", "FAILED"].includes(row.scanStatus) ? (
                <div key={row.id} className="flex gap-2">
                  <form action={reviewFileScanFormAction}>
                    <input type="hidden" name="fileId" value={row.id} />
                    <button
                      name="decision"
                      value="scan"
                      className="rounded-[5px] bg-brand px-3 py-2 text-xs font-bold text-brand-foreground"
                    >
                      {locale === "fa" ? "اسکن بدافزار" : "Scan for malware"}
                    </button>
                  </form>
                  <form action={reviewFileScanFormAction}>
                    <input type="hidden" name="fileId" value={row.id} />
                    <button
                      name="decision"
                      value="reject"
                      className="rounded-[5px] border border-destructive px-3 py-2 text-xs font-bold text-destructive"
                    >
                      {locale === "fa" ? "رد" : "Reject"}
                    </button>
                  </form>
                </div>
              ) : (
                "—"
              ),
            ])}
          />
          {hasPermission(actor, "cms.manage") && (
            <div className="mt-6 grid items-start gap-4 xl:grid-cols-2">
              {rows.flatMap((row) =>
                row.media
                  ? [
                      <AdminMediaMetadataForm
                        key={row.media.id}
                        locale={locale}
                        media={{
                          ...row.media,
                          focalPointX:
                            row.media.focalPointX === null ? null : Number(row.media.focalPointX),
                          focalPointY:
                            row.media.focalPointY === null ? null : Number(row.media.focalPointY),
                        }}
                      />,
                    ]
                  : [],
              )}
            </div>
          )}
        </>
      ) : (
        <Empty locale={locale} noun={locale === "fa" ? "فایلی" : "files"} />
      )}
    </Frame>
  );
}

async function Finance({ locale, actor }: SectionProps) {
  const rows = await adminFinance(actor);
  const canManage = hasPermission(actor, "finance.manage");
  const [clients, projects] = await Promise.all([
    canManage ? adminClientOptions(actor, "finance.manage") : Promise.resolve([]),
    canManage ? adminInvoiceOptions(actor) : Promise.resolve([]),
  ]);
  return (
    <Frame
      locale={locale}
      code="FINANCE / LEDGER"
      faTitle="مالی"
      enTitle="Finance"
      faDescription="صورتحساب، تخصیص پرداخت و مانده از داده واقعی."
      enDescription="Invoices, payment allocations and balance from real records."
    >
      {canManage && <AdminCreateInvoice locale={locale} clients={clients} projects={projects} />}
      {rows.length ? (
        <DataTable
          headers={
            locale === "fa"
              ? ["شماره", "مشتری", "عنوان", "کل", "پرداخت‌شده", "وضعیت", "سررسید"]
              : ["Number", "Client", "Title", "Total", "Allocated", "Status", "Due"]
          }
          rows={rows.map((row) => [
            <Link
              key={row.id}
              locale={locale}
              href={`/admin/finance/${row.id}`}
              className="font-bold text-brand hover:underline"
            >
              {row.number}
            </Link>,
            row.client.displayName,
            row.title,
            money(row.totalAmount, row.currency, locale),
            money(
              row.allocations.reduce((sum, item) => sum + item.amount, 0n),
              row.currency,
              locale,
            ),
            row.status,
            date(row.dueDate, locale),
          ])}
        />
      ) : (
        <Empty locale={locale} noun={locale === "fa" ? "رکورد مالی‌ای" : "finance records"} />
      )}
    </Frame>
  );
}

async function Tickets({ locale, actor }: SectionProps) {
  const rows = await adminTickets(actor);
  return (
    <Frame
      locale={locale}
      code="SUPPORT / QUEUE"
      faTitle="صف پشتیبانی"
      enTitle="Support queue"
      faDescription="تیکت‌های باز، اولویت و مسئول پاسخ."
      enDescription="Open tickets, priorities and assignment."
    >
      {rows.length ? (
        <DataTable
          headers={
            locale === "fa"
              ? ["شماره", "مشتری", "موضوع", "اولویت", "وضعیت", "مسئول", "پیام"]
              : ["Number", "Client", "Subject", "Priority", "Status", "Assignee", "Messages"]
          }
          rows={rows.map((row) => [
            row.number,
            row.client.displayName,
            <Link
              key={row.id}
              locale={locale}
              href={`/admin/support/${row.id}`}
              className="font-bold text-brand hover:underline"
            >
              {row.subject}
            </Link>,
            row.priority,
            row.status,
            row.assignedTo?.name ?? "—",
            row._count.messages,
          ])}
        />
      ) : (
        <Empty locale={locale} noun={locale === "fa" ? "تیکتی" : "tickets"} />
      )}
    </Frame>
  );
}

async function Content({ locale, actor }: SectionProps) {
  const rows = await adminContent(actor);
  return (
    <Frame
      locale={locale}
      code="CMS / CONTENT GRAPH"
      faTitle="مدیریت محتوا"
      enTitle="Content management"
      faDescription="وضعیت انتشار و پوشش ترجمه برای همه انواع محتوا."
      enDescription="Publishing state and translation coverage across every content type."
    >
      {hasPermission(actor, "cms.manage") && <AdminCreateContent locale={locale} />}
      {rows.length ? (
        <DataTable
          headers={
            locale === "fa"
              ? ["Slug", "نوع", "عنوان‌ها", "وضعیت", "Noindex", "به‌روزرسانی"]
              : ["Slug", "Kind", "Titles", "Status", "Noindex", "Updated"]
          }
          rows={rows.map((row) => [
            <Link
              key={row.id}
              locale={locale}
              href={`/admin/content/${row.id}`}
              className="font-bold text-brand hover:underline"
            >
              {row.slug}
            </Link>,
            row.kind,
            row.translations
              .map((translation) => `${translation.locale}: ${translation.title}`)
              .join(" / ") || "—",
            row.status,
            row.noIndex ? "yes" : "no",
            date(row.updatedAt, locale),
          ])}
        />
      ) : (
        <Empty locale={locale} noun={locale === "fa" ? "محتوایی" : "content"} />
      )}
    </Frame>
  );
}

async function Categories({ locale, actor }: SectionProps) {
  const rows = await adminCategories(actor);
  const canManage = hasPermission(actor, "cms.manage");
  return (
    <Frame
      locale={locale}
      code="CMS / CATEGORIES"
      faTitle="دسته‌بندی‌ها"
      enTitle="Categories"
      faDescription="واژگان دوزبانه برای گروه‌بندی و مسیریابی محتوای عمومی."
      enDescription="Bilingual vocabulary for grouping and navigating public content."
    >
      {canManage && <AdminCategoryForm locale={locale} />}
      {rows.length ? (
        <>
          <DataTable
            headers={
              locale === "fa"
                ? ["Slug", "فارسی", "English", "محتوا"]
                : ["Slug", "Persian", "English", "Content"]
            }
            rows={rows.map((row) => [
              row.slug,
              row.translations.find(({ locale: rowLocale }) => rowLocale === "fa")?.name ?? "—",
              row.translations.find(({ locale: rowLocale }) => rowLocale === "en")?.name ?? "—",
              row._count.content,
            ])}
          />
          {canManage && (
            <div className="mt-6 grid items-start gap-4 xl:grid-cols-2">
              {rows.map((row) => (
                <AdminCategoryForm key={row.id} locale={locale} item={row} />
              ))}
            </div>
          )}
        </>
      ) : (
        <Empty locale={locale} noun={locale === "fa" ? "دسته‌بندی‌ای" : "categories"} />
      )}
    </Frame>
  );
}

async function Authors({ locale, actor }: SectionProps) {
  const rows = await adminAuthors(actor);
  const canManage = hasPermission(actor, "cms.manage");
  const media = canManage ? await adminMediaOptions(actor) : [];
  return (
    <Frame
      locale={locale}
      code="CMS / AUTHORS"
      faTitle="نویسندگان"
      enTitle="Authors"
      faDescription="پروفایل دوزبانه نویسندگان و اتصال آن‌ها به محتوای تحریریه."
      enDescription="Bilingual author profiles connected to editorial content."
    >
      {canManage && <AdminAuthorForm locale={locale} media={media} />}
      {rows.length ? (
        <>
          <DataTable
            headers={
              locale === "fa"
                ? ["Slug", "فارسی", "English", "تصویر", "محتوا"]
                : ["Slug", "Persian", "English", "Image", "Content"]
            }
            rows={rows.map((row) => [
              row.slug,
              row.translations.find(({ locale: rowLocale }) => rowLocale === "fa")?.name ?? "—",
              row.translations.find(({ locale: rowLocale }) => rowLocale === "en")?.name ?? "—",
              row.avatarMedia?.key ?? "—",
              row._count.content,
            ])}
          />
          {canManage && (
            <div className="mt-6 grid items-start gap-4 xl:grid-cols-2">
              {rows.map((row) => (
                <AdminAuthorForm key={row.id} locale={locale} item={row} media={media} />
              ))}
            </div>
          )}
        </>
      ) : (
        <Empty locale={locale} noun={locale === "fa" ? "نویسنده‌ای" : "authors"} />
      )}
    </Frame>
  );
}

async function Tags({ locale, actor }: SectionProps) {
  const rows = await adminTags(actor);
  const canManage = hasPermission(actor, "cms.manage");
  return (
    <Frame
      locale={locale}
      code="CMS / TAGS"
      faTitle="برچسب‌ها"
      enTitle="Tags"
      faDescription="برچسب‌های دوزبانه برای ارتباط موضوعی میان محتواها."
      enDescription="Bilingual tags for topical relationships across content."
    >
      {canManage && <AdminTagForm locale={locale} />}
      {rows.length ? (
        <>
          <DataTable
            headers={
              locale === "fa"
                ? ["Slug", "فارسی", "English", "محتوا"]
                : ["Slug", "Persian", "English", "Content"]
            }
            rows={rows.map((row) => [
              row.slug,
              row.translations.find(({ locale: rowLocale }) => rowLocale === "fa")?.name ?? "—",
              row.translations.find(({ locale: rowLocale }) => rowLocale === "en")?.name ?? "—",
              row._count.content,
            ])}
          />
          {canManage && (
            <div className="mt-6 grid items-start gap-4 xl:grid-cols-2">
              {rows.map((row) => (
                <AdminTagForm key={row.id} locale={locale} item={row} />
              ))}
            </div>
          )}
        </>
      ) : (
        <Empty locale={locale} noun={locale === "fa" ? "برچسبی" : "tags"} />
      )}
    </Frame>
  );
}

async function Faqs({ locale, actor }: SectionProps) {
  const rows = await adminFaqs(actor);
  const canManage = hasPermission(actor, "cms.manage");
  const canPublish = hasPermission(actor, "cms.publish");
  return (
    <Frame
      locale={locale}
      code="CMS / FAQ"
      faTitle="پرسش‌های متداول"
      enTitle="Frequently asked questions"
      faDescription="پرسش‌وپاسخ ساختاریافته، دوزبانه و قابل اتصال به هر محتوا."
      enDescription="Structured bilingual answers that can be attached to any content."
    >
      {canManage && <AdminFaqForm locale={locale} canPublish={canPublish} />}
      {rows.length ? (
        <>
          <DataTable
            headers={
              locale === "fa"
                ? ["پرسش", "وضعیت", "محتوا", "صفحه"]
                : ["Question", "Status", "Content", "Pages"]
            }
            rows={rows.map((row) => [
              row.translations.find(({ locale: rowLocale }) => rowLocale === locale)?.question ??
                row.id,
              row.status,
              row._count.content,
              row._count.pages,
            ])}
          />
          {canManage && (
            <div className="mt-6 space-y-4">
              {rows.map((row) =>
                row.status !== "PUBLISHED" || canPublish ? (
                  <AdminFaqForm key={row.id} locale={locale} item={row} canPublish={canPublish} />
                ) : null,
              )}
            </div>
          )}
        </>
      ) : (
        <Empty locale={locale} noun={locale === "fa" ? "پرسشی" : "FAQs"} />
      )}
    </Frame>
  );
}

async function Seo({ locale, actor }: SectionProps) {
  const data = await adminSeo(actor);
  const canManage = hasPermission(actor, "cms.manage");
  return (
    <Frame
      locale={locale}
      code="SEO / HEALTH"
      faTitle="سلامت سئو"
      enTitle="SEO health"
      faDescription="Redirect، noindex و پوشش زبان بدون اتصال به سرویس بیرونی."
      enDescription="Redirects, noindex and language coverage without an external service."
    >
      {canManage && <AdminRedirectForm locale={locale} />}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <MetricCard label="Redirects" value={data.redirects.length} />
        <MetricCard label="Noindex" value={data.noIndexCount} />
        <MetricCard
          label={locale === "fa" ? "فاقد ترجمه انگلیسی" : "Missing English"}
          value={data.missingEnglish}
        />
      </div>
      {data.redirects.length ? (
        <>
          <DataTable
            headers={
              locale === "fa"
                ? ["مبدا", "مقصد", "کد", "فعال"]
                : ["Source", "Destination", "Code", "Active"]
            }
            rows={data.redirects.map((row) => [
              row.sourcePath,
              row.destination,
              row.statusCode,
              row.isActive ? "yes" : "no",
            ])}
          />
          {canManage && (
            <div className="mt-6 grid items-start gap-4 xl:grid-cols-2">
              {data.redirects.map((row) => (
                <AdminRedirectForm key={row.id} locale={locale} item={row} />
              ))}
            </div>
          )}
        </>
      ) : (
        <Empty locale={locale} noun="redirect" />
      )}
    </Frame>
  );
}

async function Analytics({ locale, actor }: SectionProps) {
  const data = await adminAnalytics(actor);
  return (
    <Frame
      locale={locale}
      code="ANALYTICS / 30 DAYS"
      faTitle="آنالیتیکس فرست‌پارتی"
      enTitle="First-party analytics"
      faDescription="رویدادهای واقعی و حداقلی؛ بدون Google Analytics و بدون نمودار ساختگی."
      enDescription="Real, minimal events—without Google Analytics or fake charts."
    >
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label={locale === "fa" ? "نشست" : "Sessions"} value={data.sessions} />
        <MetricCard label={locale === "fa" ? "بازدید صفحه" : "Page views"} value={data.pageViews} />
        <MetricCard label="CTA" value={data.ctaClicks} />
        <MetricCard label={locale === "fa" ? "شروع فرم" : "Form starts"} value={data.formStarts} />
        <MetricCard
          label={locale === "fa" ? "تکمیل فرم" : "Form completions"}
          value={data.formSubmissions}
        />
        <MetricCard label={locale === "fa" ? "جست‌وجو" : "Searches"} value={data.searches} />
        <MetricCard
          label={locale === "fa" ? "لید منتسب" : "Attributed leads"}
          value={data.attributedLeads}
        />
        <MetricCard
          label={locale === "fa" ? "نرخ شروع تا ثبت" : "Start-to-submit rate"}
          value={
            data.formStarts > 0
              ? `${Math.round((data.formSubmissions / data.formStarts) * 100)}%`
              : "—"
          }
        />
      </div>
      {data.topPages.length ? (
        <DataTable
          headers={locale === "fa" ? ["مسیر", "بازدید"] : ["Path", "Views"]}
          rows={data.topPages.map((row) => [row.path ?? "—", row._count._all])}
        />
      ) : (
        <Empty
          locale={locale}
          noun={locale === "fa" ? "رویداد آنالیتیکی‌ای" : "analytics events"}
        />
      )}
      {data.campaigns.length > 0 && (
        <>
          <h2 className="mt-10 text-lg font-bold">
            {locale === "fa" ? "کمپین‌ها و لیدهای منتسب" : "Campaigns and attributed leads"}
          </h2>
          <DataTable
            headers={
              locale === "fa"
                ? ["منبع", "رسانه", "کمپین", "نشست", "لید"]
                : ["Source", "Medium", "Campaign", "Sessions", "Leads"]
            }
            rows={data.campaigns.map((row) => [
              row.source,
              row.medium,
              row.campaign,
              row.sessions,
              row.leads,
            ])}
          />
        </>
      )}
    </Frame>
  );
}

async function Users({ locale, actor }: SectionProps) {
  const rows = await adminUsers(actor);
  const canManageRoles = hasPermission(actor, "roles.manage");
  const roles = canManageRoles ? await adminRoles(actor) : [];
  return (
    <Frame
      locale={locale}
      code="ACCESS / USERS"
      faTitle="کاربران"
      enTitle="Users"
      faDescription="هویت، نقش و عضویت مشتری بدون امکان ارتقای نقش از سمت Client."
      enDescription="Identities, roles and client membership with no client-side privilege escalation."
    >
      {rows.length ? (
        <>
          <DataTable
            headers={
              locale === "fa"
                ? ["نام", "ایمیل", "نقش", "عضویت", "Session", "ایجاد"]
                : ["Name", "Email", "Roles", "Memberships", "Sessions", "Created"]
            }
            rows={rows.map((row) => [
              row.name,
              row.email,
              row.roles.map(({ role }) => role.key).join(", ") || "—",
              row._count.clientMemberships,
              row._count.sessions,
              date(row.createdAt, locale),
            ])}
          />
          {canManageRoles && (
            <div className="mt-6 grid items-start gap-4 xl:grid-cols-2">
              {rows.map((row) => (
                <AdminUserRolesForm
                  key={row.id}
                  locale={locale}
                  user={{
                    id: row.id,
                    name: row.name,
                    email: row.email,
                    roleIds: row.roles.map(({ roleId }) => roleId),
                  }}
                  roles={roles}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <Empty locale={locale} noun={locale === "fa" ? "کاربری" : "users"} />
      )}
    </Frame>
  );
}

async function Roles({ locale, actor }: SectionProps) {
  const rows = await adminRoles(actor);
  return (
    <Frame
      locale={locale}
      code="ACCESS / RBAC"
      faTitle="نقش‌ها و مجوزها"
      enTitle="Roles and permissions"
      faDescription="ماتریس مجوز سمت سرور؛ مدیریت نقش فقط برای Super Admin."
      enDescription="Server-side permission matrix; role management is restricted to Super Admin."
    >
      <DataTable
        headers={
          locale === "fa"
            ? ["کلید", "نام", "کاربر", "مجوزها"]
            : ["Key", "Name", "Users", "Permissions"]
        }
        rows={rows.map((row) => [
          row.key,
          row.name,
          row._count.users,
          row.permissions.map(({ permission }) => permission.key).join(", "),
        ])}
      />
    </Frame>
  );
}

async function Logs({ locale, actor }: SectionProps) {
  const rows = await adminAuditLogs(actor);
  return (
    <Frame
      locale={locale}
      code="SECURITY / AUDIT"
      faTitle="گزارش تغییرات"
      enTitle="Audit log"
      faDescription="ردپای عملیات حساس با Actor و موجودیت هدف."
      enDescription="Sensitive operations recorded with actor and target entity."
    >
      {rows.length ? (
        <DataTable
          headers={
            locale === "fa"
              ? ["زمان", "Actor", "عملیات", "نوع", "شناسه"]
              : ["Time", "Actor", "Action", "Type", "ID"]
          }
          rows={rows.map((row) => [
            date(row.createdAt, locale),
            row.actor?.email ?? "system",
            row.action,
            row.entityType,
            row.entityId ?? "—",
          ])}
        />
      ) : (
        <Empty locale={locale} noun={locale === "fa" ? "گزارشی" : "audit events"} />
      )}
    </Frame>
  );
}

async function Settings({ locale, actor }: SectionProps) {
  const rows = await adminSettings(actor);
  return (
    <Frame
      locale={locale}
      code="PLATFORM / SETTINGS"
      faTitle="تنظیمات"
      enTitle="Settings"
      faDescription="مقادیر Secret هرگز در این نما خوانده یا نمایش داده نمی‌شوند."
      enDescription="Secret values are never queried or rendered in this view."
    >
      <AdminSettingForm locale={locale} />
      {rows.length ? (
        <>
          <DataTable
            headers={
              locale === "fa"
                ? ["کلید", "مقدار", "سطح", "به‌روزرسانی"]
                : ["Key", "Value", "Visibility", "Updated"]
            }
            rows={rows.map((row) => [
              row.key,
              JSON.stringify(row.value),
              row.visibility,
              date(row.updatedAt, locale),
            ])}
          />
          <div className="mt-6 grid items-start gap-4 xl:grid-cols-2">
            {rows.map((row) => (
              <AdminSettingForm key={row.key} locale={locale} item={row} />
            ))}
          </div>
        </>
      ) : (
        <Empty locale={locale} noun={locale === "fa" ? "تنظیمی" : "settings"} />
      )}
    </Frame>
  );
}
