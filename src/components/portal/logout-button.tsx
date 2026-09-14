"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";

import { useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { authClient } from "@/lib/auth-client";

export function LogoutButton({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await authClient.signOut();
        router.replace("/");
        router.refresh();
      }}
      className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50"
    >
      <LogOut aria-hidden className="size-4" />
      {pending
        ? locale === "fa"
          ? "در حال خروج…"
          : "Signing out…"
        : locale === "fa"
          ? "خروج"
          : "Sign out"}
    </button>
  );
}
