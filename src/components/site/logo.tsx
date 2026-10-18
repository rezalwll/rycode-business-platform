import Image from "next/image";
import { cn } from "@/lib/utils";
import { BRAND_MARK_HEIGHT, BRAND_MARK_SRC, BRAND_MARK_WIDTH } from "@/lib/brand";
import { LogoWordmark } from "./wordmark";

// The same transparent supplied artwork works on both light and dark surfaces.
export const LOGO_MARK_SRC = BRAND_MARK_SRC;
export const LOGO_MARK_LIGHT_SRC = BRAND_MARK_SRC;
type LogoVariant = "default" | "light" | "adaptive";

function LogoImage({ className, alt = "", variant = "adaptive" }: {
  className?: string;
  alt?: string;
  variant?: LogoVariant;
}) {
  return <Image src={LOGO_MARK_SRC} alt={alt} width={BRAND_MARK_WIDTH} height={BRAND_MARK_HEIGHT}
    sizes="(max-width: 640px) 36px, 96px" data-logo-variant={variant} className={className} />;
}

export function Logo({ className, variant = "default" }: {
  className?: string;
  variant?: LogoVariant;
}) {
  return <span dir="ltr" data-variant={variant} className={cn("rycode-logo inline-flex select-none items-center gap-2 text-[var(--logo-color)]", className)}>
    <LogoImage variant={variant} className="h-[2em] w-auto shrink-0 object-contain" />
    <LogoWordmark className="font-logo text-[1.35rem] font-extrabold leading-none tracking-[-0.04em]" />
  </span>;
}

export function LogoMark({ className, variant = "adaptive", alt = "RYCODE" }: { className?: string; variant?: LogoVariant; alt?: string }) {
  return <LogoImage variant={variant} alt={alt} className={cn("rycode-logo-mark size-8 shrink-0 object-contain", className)} />;
}
