import {
  Bell,
  BookOpen,
  Building2,
  ChartNoAxesCombined,
  CircleDollarSign,
  FileArchive,
  FileText,
  FolderKanban,
  Gauge,
  Headphones,
  Inbox,
  LayoutDashboard,
  Logs,
  SearchCheck,
  Settings,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";

import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { hasPermission, type Actor, type Permission } from "@/server/auth/permissions";

import { LogoutButton } from "./logout-button";

type PortalKind = "customer" | "admin";

type PortalItem = {
  href: string;
  fa: string;
  en: string;
  icon: typeof Gauge;
  permission?: Permission;
};

const customerItems: PortalItem[] = [
  { href: "/dashboard", fa: "نمای کلی", en: "Overview", icon: Gauge },
  {
    href: "/dashboard/requests",
    fa: "درخواست‌ها",
    en: "Requests",
    icon: Inbox,
    permission: "leads.read_own",
  },
  {
    href: "/dashboard/projects",
    fa: "پروژه‌ها",
    en: "Projects",
    icon: FolderKanban,
    permission: "projects.read_own",
  },
  {
    href: "/dashboard/files",
    fa: "فایل‌ها",
    en: "Files",
    icon: FileArchive,
    permission: "files.read_own",
  },
  {
    href: "/dashboard/payments",
    fa: "مالی",
    en: "Finance",
    icon: CircleDollarSign,
    permission: "finance.read_own",
  },
  {
    href: "/dashboard/support",
    fa: "پشتیبانی",
    en: "Support",
    icon: Headphones,
    permission: "tickets.manage_own",
  },
  {
    href: "/dashboard/notifications",
    fa: "اعلان‌ها",
    en: "Notifications",
    icon: Bell,
    permission: "notifications.read_own",
  },
  {
    href: "/dashboard/profile",
    fa: "پروفایل",
    en: "Profile",
    icon: UserRound,
    permission: "profile.manage_own",
  },
];

const adminItems: PortalItem[] = [
  { href: "/admin", fa: "داشبورد", en: "Overview", icon: LayoutDashboard },
  { href: "/admin/leads", fa: "سرنخ‌ها", en: "Leads", icon: Inbox, permission: "leads.read" },
  {
    href: "/admin/customers",
    fa: "مشتریان",
    en: "Customers",
    icon: Building2,
    permission: "clients.read",
  },
  {
    href: "/admin/projects",
    fa: "پروژه‌ها",
    en: "Projects",
    icon: FolderKanban,
    permission: "projects.read",
  },
  {
    href: "/admin/files",
    fa: "فایل‌ها",
    en: "Files",
    icon: FileArchive,
    permission: "files.manage",
  },
  {
    href: "/admin/finance",
    fa: "مالی",
    en: "Finance",
    icon: CircleDollarSign,
    permission: "finance.read",
  },
  {
    href: "/admin/support",
    fa: "پشتیبانی",
    en: "Support",
    icon: Headphones,
    permission: "tickets.read",
  },
  { href: "/admin/content", fa: "محتوا", en: "Content", icon: BookOpen, permission: "cms.read" },
  { href: "/admin/seo", fa: "سئو", en: "SEO", icon: SearchCheck, permission: "cms.read" },
  {
    href: "/admin/analytics",
    fa: "آنالیتیکس",
    en: "Analytics",
    icon: ChartNoAxesCombined,
    permission: "analytics.read",
  },
  { href: "/admin/users", fa: "کاربران", en: "Users", icon: Users, permission: "users.read" },
  {
    href: "/admin/roles",
    fa: "نقش‌ها",
    en: "Roles",
    icon: ShieldCheck,
    permission: "roles.manage",
  },
  {
    href: "/admin/logs",
    fa: "گزارش فعالیت",
    en: "Audit log",
    icon: Logs,
    permission: "audit.read",
  },
  {
    href: "/admin/settings",
    fa: "تنظیمات",
    en: "Settings",
    icon: Settings,
    permission: "settings.manage",
  },
];

export function PortalShell({
  locale,
  kind,
  identity,
  children,
}: {
  locale: Locale;
  kind: PortalKind;
  identity: { name: string; email: string; actor: Actor };
  children: ReactNode;
}) {
  const isFa = locale === "fa";
  const items = (kind === "admin" ? adminItems : customerItems).filter(
    (item) => !item.permission || hasPermission(identity.actor, item.permission),
  );

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-border bg-ink text-ink-foreground lg:sticky lg:top-0 lg:h-screen lg:border-e lg:border-b-0">
        <div className="flex h-[72px] items-center justify-between border-b border-white/10 px-5 lg:px-7">
          <Link
            href={kind === "admin" ? "/admin" : "/dashboard"}
            className="text-xl font-black tracking-[-.04em]"
          >
            RY<span className="text-brand">CODE</span>
          </Link>
          <span className="meta-label text-white/40">{kind === "admin" ? "OPS" : "CLIENT"}</span>
        </div>
        <nav
          className="flex gap-1 overflow-x-auto p-3 lg:block lg:space-y-1 lg:overflow-visible lg:p-4"
          aria-label={isFa ? "ناوبری فضای کاری" : "Workspace navigation"}
        >
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex shrink-0 items-center gap-3 rounded-[5px] px-3 py-2.5 text-sm text-white/65 transition-colors hover:bg-white/8 hover:text-white lg:flex"
              >
                <Icon aria-hidden className="size-4 text-brand" />
                {isFa ? item.fa : item.en}
              </Link>
            );
          })}
        </nav>
        <div className="hidden border-t border-white/10 p-6 lg:absolute lg:inset-x-0 lg:bottom-0 lg:block">
          <p className="truncate text-sm font-semibold">{identity.name}</p>
          <p className="mt-1 truncate text-xs text-white/45" dir="ltr">
            {identity.email}
          </p>
          <div className="mt-4">
            <LogoutButton locale={locale} />
          </div>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="flex min-h-[72px] items-center justify-between border-b border-border bg-surface px-5 sm:px-8">
          <div>
            <p className="meta-label text-brand">
              {kind === "admin" ? "INTERNAL OPERATIONS" : "CUSTOMER WORKSPACE"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {isFa ? "داده واقعی؛ بدون شاخص نمایشی" : "Live data; no decorative metrics"}
            </p>
          </div>
          <div className="lg:hidden">
            <LogoutButton locale={locale} />
          </div>
        </header>
        <main className="px-5 py-10 sm:px-8 lg:px-12 lg:py-12">{children}</main>
      </div>
    </div>
  );
}

export function PortalHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-col justify-between gap-6 border-b border-border pb-8 md:flex-row md:items-end">
      <div>
        <p className="meta-label text-brand">{eyebrow}</p>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{description}</p>
      </div>
      {action}
    </header>
  );
}

export function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <article className="rounded-[6px] border border-border bg-surface p-5">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <p className="mt-4 text-3xl font-black tabular-nums">{value}</p>
      {hint && <p className="mt-2 text-xs leading-6 text-muted-foreground">{hint}</p>}
    </article>
  );
}

export function EmptyPortalState({ title, description }: { title: string; description: string }) {
  return (
    <div className="mt-8 rounded-[6px] border border-dashed border-border bg-surface/70 px-6 py-14 text-center">
      <FileText aria-hidden className="mx-auto size-6 text-brand" />
      <p className="mt-4 text-sm font-bold">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">{description}</p>
    </div>
  );
}

export function DataTable({
  headers,
  rows,
}: {
  headers: readonly string[];
  rows: readonly (readonly ReactNode[])[];
}) {
  if (rows.length === 0) return null;
  return (
    <div className="mt-8 overflow-x-auto rounded-[6px] border border-border bg-surface">
      <table className="w-full min-w-[680px] border-collapse text-sm">
        <thead className="bg-secondary/60 text-start text-xs text-muted-foreground">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="border-b border-border px-5 py-3 text-start font-semibold"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-5 py-4 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
