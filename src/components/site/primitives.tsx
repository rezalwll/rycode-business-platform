import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { AppPath } from "@/lib/nav-content";

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("mx-auto w-full max-w-[1280px] px-5 sm:px-7 lg:px-9", className)}>
      {children}
    </div>
  );
}

export function Section({
  className,
  children,
  id,
}: {
  className?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-14 sm:py-20", className)}>
      {children}
    </section>
  );
}

/** Small technical metadata label: `SERVICES / 04`. */
export function MetaLabel({
  children,
  className,
  index,
}: {
  children?: ReactNode;
  className?: string;
  index?: number;
}) {
  return (
    <span dir="ltr" className={cn("meta-label inline-flex items-center gap-2", className)}>
      {typeof index === "number" && (
        <span className="text-brand">{String(index).padStart(2, "0")}</span>
      )}
      {typeof index === "number" && children && <span className="opacity-40">/</span>}
      {children}
    </span>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.16em] text-brand uppercase">
      <span className="inline-block h-px w-8 bg-brand" />
      {children}
    </p>
  );
}

export function SectionTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cn("display-2 mt-5 max-w-3xl", className)}>{children}</h2>;
}

export function Lead({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("mt-4 max-w-2xl text-base leading-8 text-muted-foreground", className)}>
      {children}
    </p>
  );
}

const base =
  "group inline-flex items-center justify-center gap-3 text-sm font-bold transition-[background-color,border-color,color] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

export function CtaLink({
  to,
  children,
  variant = "primary",
  className,
}: {
  to: AppPath;
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost";
  className?: string;
}) {
  return (
    <Link
      href={to}
      className={cn(
        base,
        variant === "primary" &&
          "h-10 rounded-[5px] bg-brand px-5 text-brand-foreground hover:bg-brand/90",
        variant === "outline" &&
          "h-10 rounded-[5px] border border-foreground/25 px-5 text-foreground hover:border-foreground hover:bg-foreground/5",
        variant === "ghost" && "text-foreground hover:text-brand",
        className,
      )}
    >
      {children}
      <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-1" />
    </Link>
  );
}

export function TextLink({
  to,
  children,
  className,
}: {
  to: AppPath;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={to}
      className={cn(
        "group inline-flex items-center gap-3 text-sm font-bold text-foreground",
        className,
      )}
    >
      <span className="brand-underline">{children}</span>
      <ArrowSquare />
    </Link>
  );
}

/** Reusable square arrow action — the RYCODE control signature. */
export function ArrowSquare({
  className,
  active = false,
}: {
  className?: string;
  active?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-[4px] border transition-[background-color,border-color,color] duration-200",
        active
          ? "border-brand bg-brand text-brand-foreground"
          : "border-current/25 text-current group-hover:border-brand group-hover:bg-brand group-hover:text-brand-foreground",
        className,
      )}
    >
      <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
    </span>
  );
}
