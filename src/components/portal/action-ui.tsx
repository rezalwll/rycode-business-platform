"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState, type ReactNode } from "react";

import type { Locale } from "@/i18n/routing";
import type { ActionResult } from "@/server/services/errors";

export type PortalAction = (input: unknown) => Promise<ActionResult<unknown>>;

type Feedback = { kind: "success" | "error"; message: string } | null;

export const fieldClass =
  "mt-2 min-h-11 w-full rounded-xl border border-[#0b5262]/14 bg-[#f9fcfb] px-3 text-sm text-[#073b4c] outline-none transition-[border-color,background-color,box-shadow] focus:border-[#20bfb2]/70 focus:bg-white focus:ring-4 focus:ring-[#5fe1d5]/12";
export const textAreaClass = `${fieldClass} min-h-24 resize-y py-3`;
export const primaryButtonClass =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#20bfb2]/60 bg-[#5fe1d5] px-5 py-2 text-xs font-bold text-[#00364a] shadow-[0_8px_24px_rgba(32,191,178,0.13)] transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-[#74eadf] disabled:cursor-wait disabled:opacity-60";
export const secondaryButtonClass =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#0b5262]/18 bg-white/65 px-5 py-2 text-xs font-bold text-[#075264] transition-colors hover:border-[#20bfb2]/55 hover:bg-white disabled:cursor-wait disabled:opacity-60";

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
      className={`rounded-xl border px-4 py-3 text-sm leading-6 ${
        feedback.kind === "error"
          ? "border-destructive/40 bg-destructive/5 text-destructive"
          : "border-[#20bfb2]/30 bg-[#5fe1d5]/10 text-[#075264]"
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
      className="group rounded-2xl border border-[#0b5262]/12 bg-white/80 p-5 shadow-[0_12px_38px_rgba(31,92,105,0.055)] backdrop-blur-sm"
    >
      <summary className="cursor-pointer list-none font-bold marker:hidden">
        <span className="flex items-center justify-between gap-4">
          <span>{title}</span>
          <span aria-hidden className="text-[#0b8f87] transition-transform group-open:rotate-45">
            +
          </span>
        </span>
        <span className="mt-2 block text-xs font-normal leading-6 text-muted-foreground">
          {description}
        </span>
      </summary>
      <div className="mt-5 border-t border-[#0b5262]/10 pt-5">{children}</div>
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
