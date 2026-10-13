import Image from "next/image";
import { cn } from "@/lib/utils";
import { LogoWordmark } from "./wordmark";

// Both self-contained assets preserve the original artwork's silhouette.
export const LOGO_MARK_SRC = "/brand/rycode-logo-blue.svg";
export const LOGO_MARK_LIGHT_SRC = "/brand/rycode-logo-white.svg";
type LogoVariant = "default" | "light" | "adaptive";

function LogoImage({ className, alt = "", variant = "adaptive" }: {
  className?: string;
  alt?: string;
  variant?: LogoVariant;
}) {
  if (variant === "light") {
    return <Image src={LOGO_MARK_LIGHT_SRC} alt={alt} width={40} height={30} className={className} />;
  }
  return <>
    <Image src={LOGO_MARK_SRC} alt={alt} width={40} height={30} className={cn(className, "block dark:hidden")} />
    <Image src={LOGO_MARK_LIGHT_SRC} alt={alt} width={40} height={30} className={cn(className, "hidden dark:block")} />
  </>;
}

export function Logo({ className, variant = "default" }: {
  className?: string;
  variant?: LogoVariant;
}) {
  return <span dir="ltr" data-variant={variant} className={cn("rycode-logo inline-flex select-none items-center gap-2 text-[var(--logo-color)]", className)}>
    <LogoImage variant={variant} className="h-[1.55em] w-auto shrink-0 object-contain" />
    <LogoWordmark className="font-logo text-[1.35rem] font-extrabold leading-none tracking-[-0.04em]" />
  </span>;
}

export function LogoMark({ className, variant = "adaptive" }: { className?: string; variant?: LogoVariant }) {
  return <LogoImage variant={variant} alt="RYCODE" className={cn("size-8 object-contain", className)} />;
}
