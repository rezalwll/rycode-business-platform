import { cn } from "@/lib/utils";

/** Official RYCODE brand asset, stored locally in the project. */
export const LOGO_SRC = "/brand/rycode-logo.jpg";

/**
 * RYCODE logo: official mark + wordmark (RY graphite, CODE orange).
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span dir="ltr" className={cn("inline-flex select-none items-center gap-2", className)}>
      <img src={LOGO_SRC} alt="RYCODE" width={40} height={30} className="h-[1.4em] w-auto" />
      <span className="font-logo text-[1.35rem] font-extrabold leading-none tracking-[-0.04em]">
        <span className="text-foreground">RY</span>
        <span className="text-brand">CODE</span>
      </span>
    </span>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src={LOGO_SRC}
      alt="RYCODE"
      width={32}
      height={32}
      className={cn("size-8 object-contain", className)}
      aria-hidden
    />
  );
}
