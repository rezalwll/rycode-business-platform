"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState, type ReactNode } from "react";

import type { Locale } from "@/i18n/routing";
import type { ActionResult } from "@/server/services/errors";

export type PortalAction = (input: unknown) => Promise<ActionResult<unknown>>;

type Feedback = { kind: "success" | "error"; message: string } | null;

export const fieldClass =
  "mt-2 min-h-11 w-full rounded-[5px] border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20";
export const textAreaClass = `${fieldClass} min-h-24 resize-y py-3`;
export const primaryButtonClass =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-[5px] bg-brand px-4 py-2 text-xs font-bold text-brand-foreground transition-opacity disabled:cursor-wait disabled:opacity-60";
export const secondaryButtonClass =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-[5px] border border-border bg-background px-4 py-2 text-xs font-bold transition-colors hover:border-brand/50 disabled:cursor-wait disabled:opacity-60";

export function usePortalMutation(locale: Locale) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const execute = useCallback(
    async (action: PortalAction, input: unknown, successMessage?: string): Promise<boolean> => {
      if (pending) return false;
      setPending(true);
      setFeedback(null);
      try {
        const result = await action(input);
        if (!result.ok) {
          setFeedback({ kind: "error", message: result.error.message });
          return false;
        }
        setFeedback({
          kind: "success",
          message:
            successMessage ??
            (locale === "fa" ? "تغییر با موفقیت ثبت شد." : "The change was saved successfully."),
        });
        router.refresh();
        return true;
      } catch {
        setFeedback({
          kind: "error",
          message:
            locale === "fa"
              ? "ارتباط با سرور ممکن نشد. دوباره تلاش کنید."
              : "The server could not be reached. Please try again.",
        });
        return false;
      } finally {
        setPending(false);
      }
    },
    [locale, pending, router],
  );

  return { pending, feedback, execute, clearFeedback: () => setFeedback(null) };
}

export function ActionFeedback({ feedback }: { feedback: Feedback }) {
  if (!feedback) return null;
  return (
    <p
      role={feedback.kind === "error" ? "alert" : "status"}
      className={`rounded-[5px] border px-4 py-3 text-sm leading-6 ${
        feedback.kind === "error"
          ? "border-destructive/40 bg-destructive/5 text-destructive"
          : "border-brand/35 bg-brand/5 text-foreground"
      }`}
    >
      {feedback.message}
    </p>
  );
}

export function ActionPanel({
  title,
  description,
  children,
  open = false,
}: {
  title: string;
  description: string;
  children: ReactNode;
  open?: boolean;
}) {
  return (
    <details
      open={open}
      className="group rounded-[6px] border border-border bg-surface p-5 shadow-[0_12px_36px_rgba(0,0,0,.025)]"
    >
      <summary className="cursor-pointer list-none font-bold marker:hidden">
        <span className="flex items-center justify-between gap-4">
          <span>{title}</span>
          <span aria-hidden className="text-brand transition-transform group-open:rotate-45">
            +
          </span>
        </span>
        <span className="mt-2 block text-xs font-normal leading-6 text-muted-foreground">
          {description}
        </span>
      </summary>
      <div className="mt-5 border-t border-border pt-5">{children}</div>
    </details>
  );
}

export function SubmitButton({ pending, children }: { pending: boolean; children: ReactNode }) {
  return (
    <button type="submit" disabled={pending} className={primaryButtonClass}>
      {pending && <LoaderCircle aria-hidden className="size-4 animate-spin" />}
      {children}
    </button>
  );
}
