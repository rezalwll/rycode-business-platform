"use server";

import { createHash } from "node:crypto";

import { headers } from "next/headers";

import { env } from "@/server/env";

import { checkLeadRateLimit } from "./rate-limit";
import { leadInputFromFormData, validateLeadSubmission } from "./schema";
import { acceptLead } from "./service";

export type LeadActionState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Record<string, string[]>;
};

async function requestFingerprint(): Promise<string> {
  const requestHeaders = await headers();
  const forwarded = requestHeaders.get("x-forwarded-for")?.split(",").at(-1)?.trim() ?? "unknown";
  return createHash("sha256").update(`${env.BETTER_AUTH_SECRET}:lead:${forwarded}`).digest("hex");
}

function message(locale: "fa" | "en", key: "success" | "invalid" | "busy" | "unavailable") {
  const copy = {
    fa: {
      success: "درخواست شما با موفقیت ثبت شد. برای ادامه با شما تماس می‌گیریم.",
      invalid: "لطفاً اطلاعات مشخص‌شده را بررسی و دوباره ارسال کنید.",
      busy: "تعداد درخواست‌ها زیاد است. کمی بعد دوباره تلاش کنید.",
      unavailable: "ثبت درخواست موقتاً در دسترس نیست. لطفاً کمی بعد دوباره تلاش کنید.",
    },
    en: {
      success: "Your request has been recorded. We will contact you about the next step.",
      invalid: "Please review the highlighted information and submit again.",
      busy: "Too many requests were received. Please try again shortly.",
      unavailable: "Request submission is temporarily unavailable. Please try again shortly.",
    },
  } as const;
  return copy[locale][key];
}

export async function submitLeadAction(
  _previousState: LeadActionState,
  formData: FormData,
): Promise<LeadActionState> {
  const raw = leadInputFromFormData(formData);
  const locale = raw.locale === "en" ? "en" : "fa";
  const validation = validateLeadSubmission(raw);

  // Bots receive the same public success response without touching persistence.
  if (validation.status === "spam") {
    return { status: "success", message: message(locale, "success") };
  }
  if (validation.status === "invalid") {
    return {
      status: "error",
      message: message(locale, "invalid"),
      fieldErrors: validation.fieldErrors,
    };
  }

  const limit = checkLeadRateLimit(await requestFingerprint());
  if (!limit.allowed) return { status: "error", message: message(locale, "busy") };

  const result = await acceptLead(validation.data);
  if (result.status === "created") {
    return { status: "success", message: message(locale, "success") };
  }

  return { status: "error", message: message(locale, "unavailable") };
}
