import { cn } from "@/lib/utils";

/** Shared wordmark; keep the original lettering and spacing unchanged. */
export function LogoWordmark({ className }: { className?: string }) {
  return (
    <span dir="ltr" className={cn("rycode-wordmark", className)}>
      <span className="rycode-wordmark-prefix">RY</span><span className="rycode-wordmark-suffix">CODE</span>
    </span>
  );
}
