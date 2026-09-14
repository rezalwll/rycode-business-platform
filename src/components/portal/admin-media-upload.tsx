"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";

import {
  ActionFeedback,
  ActionPanel,
  fieldClass,
  primaryButtonClass,
} from "@/components/portal/action-ui";
import type { Locale } from "@/i18n/routing";

type Feedback = { kind: "success" | "error"; message: string } | null;

const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
const mediaKeyPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const uploadErrors: Record<string, Record<Locale, string>> = {
  authentication_required: {
    fa: "نشست شما منقضی شده است؛ دوباره وارد شوید.",
    en: "Your session has expired. Please sign in again.",
  },
  forbidden: {
    fa: "مجوز بارگذاری رسانه را ندارید.",
    en: "You do not have permission to upload media.",
  },
  file_too_large: {
    fa: "حجم تصویر باید حداکثر ۲۰ مگابایت باشد.",
    en: "The image must be no larger than 20 MB.",
  },
  unsupported_extension: {
    fa: "فقط PNG، JPEG، GIF و WebP پذیرفته می‌شود.",
    en: "Only PNG, JPEG, GIF and WebP images are accepted.",
  },
  mime_mismatch: {
    fa: "نوع اعلام‌شدهٔ فایل با تصویر تطابق ندارد.",
    en: "The declared file type does not match the image.",
  },
  signature_mismatch: {
    fa: "امضای واقعی فایل تصویر معتبر نیست.",
    en: "The image file signature is invalid.",
  },
  invalid_attachment: {
    fa: "کلید رسانه معتبر یا یکتا نیست.",
    en: "The media key is invalid or unavailable.",
  },
  invalid_name: {
    fa: "این کلید رسانه قبلاً استفاده شده یا معتبر نیست.",
    en: "This media key is already used or invalid.",
  },
};

function responseErrorCode(value: unknown): string | null {
  if (typeof value !== "object" || value === null || !("error" in value)) return null;
  const error = value.error;
  if (typeof error !== "object" || error === null || !("code" in error)) return null;
  return typeof error.code === "string" ? error.code : null;
}

export function AdminMediaUpload({ locale }: { locale: Locale }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const submitting = useRef(false);
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const fa = locale === "fa";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;

    const data = new FormData(event.currentTarget);
    const mediaKey = String(data.get("mediaKey") ?? "").trim();
    const file = data.get("file");
    if (!mediaKeyPattern.test(mediaKey) || mediaKey.length > 180) {
      setFeedback({
        kind: "error",
        message: fa
          ? "کلید رسانه باید با حروف کوچک انگلیسی و خط تیره نوشته شود."
          : "Use lowercase letters, numbers, and single hyphens for the media key.",
      });
      return;
    }
    if (!(file instanceof File) || file.size === 0 || file.size > MAX_UPLOAD_BYTES) {
      setFeedback({
        kind: "error",
        message: fa
          ? "یک تصویر غیرخالی با حجم حداکثر ۲۰ مگابایت انتخاب کنید."
          : "Choose a non-empty image no larger than 20 MB.",
      });
      return;
    }

    data.set("kind", "media");
    data.set("mediaKey", mediaKey);
    submitting.current = true;
    setPending(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/files/upload", { method: "POST", body: data });
      const body: unknown = await response.json();
      if (!response.ok) {
        const code = responseErrorCode(body) ?? "upload_failed";
        setFeedback({
          kind: "error",
          message:
            uploadErrors[code]?.[locale] ??
            (fa
              ? "رسانه ذخیره نشد؛ کلید را بررسی و دوباره تلاش کنید."
              : "The media was not stored. Check the key and try again."),
        });
        return;
      }

      formRef.current?.reset();
      setFeedback({
        kind: "success",
        message: fa
          ? "رسانه در قرنطینه ذخیره شد. پس از اسکن پاک، در انتخاب تصویر شاخص ظاهر می‌شود."
          : "The media is quarantined. It becomes available as featured media after a clean scan.",
      });
      router.refresh();
    } catch {
      setFeedback({
        kind: "error",
        message: fa
          ? "ارتباط هنگام ارسال رسانه قطع شد؛ دوباره تلاش کنید."
          : "The media upload connection failed. Please try again.",
      });
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  return (
    <div className="mt-8">
      <ActionPanel
        title={fa ? "افزودن رسانهٔ CMS" : "Add CMS media"}
        description={
          fa
            ? "تصویر با کلید پایدار ذخیره می‌شود و تا پاسخ پاک ClamAV در قرنطینه می‌ماند."
            : "The image receives a stable key and remains quarantined until ClamAV returns a clean verdict."
        }
      >
        <form ref={formRef} onSubmit={submit} className="space-y-4">
          <fieldset disabled={pending} className="space-y-4">
            <label className="block text-xs font-semibold text-muted-foreground">
              {fa ? "کلید پایدار رسانه" : "Stable media key"}
              <input
                className={fieldClass}
                name="mediaKey"
                required
                minLength={2}
                maxLength={180}
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                placeholder="article-platform-architecture"
                dir="ltr"
                autoComplete="off"
              />
            </label>
            <label className="block text-xs font-semibold text-muted-foreground">
              {fa ? "فایل تصویر" : "Image file"}
              <input
                className={`${fieldClass} py-2`}
                name="file"
                type="file"
                accept=".png,.jpg,.jpeg,.gif,.webp,image/png,image/jpeg,image/gif,image/webp"
                required
              />
            </label>
            <p className="text-xs leading-6 text-muted-foreground">
              {fa
                ? "حداکثر ۲۰ مگابایت. پسوند، MIME و امضای واقعی فایل در سرور بررسی می‌شود."
                : "Maximum 20 MB. Extension, MIME type, and the real file signature are verified server-side."}
            </p>
            <button type="submit" disabled={pending} className={primaryButtonClass}>
              {pending && <LoaderCircle aria-hidden className="size-4 animate-spin" />}
              {pending
                ? fa
                  ? "در حال ارسال…"
                  : "Uploading…"
                : fa
                  ? "ارسال به قرنطینه"
                  : "Upload to quarantine"}
            </button>
          </fieldset>
          <ActionFeedback feedback={feedback} />
        </form>
      </ActionPanel>
    </div>
  );
}
