import { Link } from "@tanstack/react-router";
import { ArrowLeft, Search } from "lucide-react";
import type { ReactNode } from "react";

import { Container, CtaLink, Eyebrow, Lead, SectionTitle } from "@/components/site/primitives";
import { cn } from "@/lib/utils";
import { PAGE_SIZE } from "@/lib/public-content";

export function Breadcrumbs({
  items,
}: {
  items: { label: string; to?: string; params?: Record<string, string> }[];
}) {
  return (
    <nav aria-label="مسیر صفحه" className="mb-6 text-xs text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link to="/" className="hover:text-foreground">
            خانه
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <span aria-hidden className="text-border">
              /
            </span>
            {item.to ? (
              <Link
                to={item.to}
                params={item.params as never}
                className="hover:text-foreground"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-secondary/40 p-10 text-center">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">{hint}</p>
    </div>
  );
}

export function SearchField({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <div className="relative w-full max-w-sm">
      <label htmlFor="collection-search" className="sr-only">
        {label}
      </label>
      <Search
        aria-hidden
        className="pointer-events-none absolute top-1/2 start-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <input
        id="collection-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={label}
        className="h-11 w-full rounded-md border border-border bg-background ps-9 pe-3 text-sm outline-none focus-visible:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      />
    </div>
  );
}

export function Pagination({
  page,
  total,
  onPage,
}: {
  page: number;
  total: number;
  onPage: (p: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (pages <= 1) return null;
  return (
    <nav aria-label="صفحه‌بندی" className="mt-12 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPage(page - 1)}
        disabled={page <= 1}
        className="h-10 rounded-md border border-border px-4 text-sm disabled:opacity-40"
      >
        قبلی
      </button>
      <span className="px-3 text-sm text-muted-foreground">
        صفحه {page} از {pages}
      </span>
      <button
        type="button"
        onClick={() => onPage(page + 1)}
        disabled={page >= pages}
        className="h-10 rounded-md border border-border px-4 text-sm disabled:opacity-40"
      >
        بعدی
      </button>
    </nav>
  );
}

export function ItemCard({
  to,
  slug,
  title,
  summary,
}: {
  to: string;
  slug: string;
  title: string;
  summary: string | null;
}) {
  return (
    <Link
      to={to}
      params={{ slug } as never}
      className="group flex flex-col justify-between rounded-lg border border-border bg-card p-6 transition-colors hover:border-brand/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <div>
        <h3 className="text-base font-bold leading-7">{title}</h3>
        {summary && (
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted-foreground">{summary}</p>
        )}
      </div>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand">
        مشاهده
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
      </span>
    </Link>
  );
}

export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  children?: ReactNode;
}) {
  return (
    <header className="border-b border-border pb-10">
      <Eyebrow>{eyebrow}</Eyebrow>
      <SectionTitle>{title}</SectionTitle>
      <Lead>{lead}</Lead>
      {children && <div className="mt-8">{children}</div>}
    </header>
  );
}

export function PageShell({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("py-12 sm:py-18", className)}>
      <Container>{children}</Container>
    </div>
  );
}

export function DetailBody({ body }: { body: string | null }) {
  if (!body) return null;
  return (
    <div className="mt-10 max-w-3xl space-y-5 text-base leading-9 text-foreground">
      {body
        .split(/\n{2,}/)
        .filter(Boolean)
        .map((p, i) => (
          <p key={i}>{p}</p>
        ))}
    </div>
  );
}

export function DetailCta() {
  return (
    <div className="mt-14 flex flex-wrap gap-3 border-t border-border pt-10">
      <CtaLink to="/start-project">شروع پروژه</CtaLink>
      <CtaLink to="/contact" variant="outline">
        گفتگو با تیم رای‌کد
      </CtaLink>
    </div>
  );
}
