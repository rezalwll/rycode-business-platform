import Image from "next/image";
import { cn } from "@/lib/utils";

export const LOGO_MARK_SRC = "/brand/rycode-logo.png";

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
      <Image
        src={LOGO_MARK_SRC}
        alt=""
        width={40}
        height={30}
        className={cn(
          "h-[1.55em] w-auto shrink-0 object-contain",
          variant === "light" && "brightness-0 invert",
          variant === "adaptive" && "dark:brightness-0 dark:invert",
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
    <Image
      src={LOGO_MARK_SRC}
      alt="RYCODE"
      width={40}
      height={30}
      className={cn("size-8 object-contain", className)}
    />
  );
}
