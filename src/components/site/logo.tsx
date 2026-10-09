import { cn } from "@/lib/utils";

function LogoGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 32"
      fill="none"
      aria-hidden="true"
      className={cn("h-[1.45em] w-auto shrink-0", className)}
    >
      <path
        d="M7.5 7.5 1.75 16l5.75 8.5M32.5 7.5 38.25 16l-5.75 8.5"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.72"
      />
      <path
        d="M13 26V6h10.25c4.15 0 6.75 2.15 6.75 5.55 0 3.45-2.6 5.7-6.75 5.7H13m9.1 0L30 26"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** RYCODE mark and wordmark in the current petrol/turquoise identity. */
export function Logo({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "light" | "adaptive";
}) {
  return (
    <span dir="ltr" className={cn("inline-flex select-none items-center gap-2", className)}>
      <LogoGlyph
        className={cn(
          variant === "light" ? "text-[#5fe1d5]" : "text-brand",
          variant === "adaptive" && "dark:text-[#5fe1d5]",
        )}
      />
      <span className="font-logo text-[1.35rem] font-extrabold leading-none tracking-[-0.04em]">
        <span
          className={cn(
            variant === "light" ? "text-white" : "text-foreground",
            variant === "adaptive" && "dark:text-white",
          )}
        >
          RY
        </span>
        <span className={cn(variant === "light" ? "text-[#5fe1d5]" : "text-brand")}>CODE</span>
      </span>
    </span>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex size-8 items-center justify-center text-brand", className)}>
      <LogoGlyph className="h-6" />
      <span className="sr-only">RYCODE</span>
    </span>
  );
}
