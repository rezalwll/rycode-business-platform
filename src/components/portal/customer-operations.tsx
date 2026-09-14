"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition, type ButtonHTMLAttributes, type FormEvent } from "react";

import { primaryButtonClass, secondaryButtonClass } from "@/components/portal/action-ui";
import {
  approveMilestoneAction,
  createTicketAction,
  markAllNotificationsReadAction,
  markNotificationReadAction,
  replyToTicketAction,
  resolveTicketAction,
  updateProfileAction,
} from "@/features/business/actions";
import type { ActionResult, ServiceErrorCode } from "@/server/services/errors";

type CustomerLocale = "fa" | "en";
type Feedback = { tone: "success" | "error"; message: string } | null;
type CustomerOperation = () => Promise<ActionResult<unknown>>;

const inputClass =
  "mt-2 min-h-11 w-full rounded-[6px] border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/15 disabled:cursor-not-allowed disabled:opacity-60";
const labelClass = "block text-xs font-semibold text-muted-foreground";

function Button({
  variant,
  size,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "outline"; size?: "sm" }) {
  return (
    <button
      {...props}
      className={`${variant === "outline" ? secondaryButtonClass : primaryButtonClass} ${size === "sm" ? "min-h-9" : ""} ${className}`}
    />
  );
}

const englishErrors: Record<ServiceErrorCode, string> = {
  AUTHENTICATION_REQUIRED: "Please sign in before trying again.",
  FORBIDDEN: "You do not have permission to perform this action.",
  INVALID_INPUT: "Please review the form fields and try again.",
  NOT_FOUND: "This item no longer exists or is not available to you.",
  CONFLICT: "This change conflicts with the current data. Refresh and try again.",
  INVALID_STATE: "This action is not available in the current state.",
  INTERNAL_ERROR: "The request could not be completed. Please try again.",
};

function errorMessage(
  locale: CustomerLocale,
  result: Extract<ActionResult<unknown>, { ok: false }>,
) {
  if (locale === "fa") return result.error.message;
  return englishErrors[result.error.code];
}

function useCustomerOperation(locale: CustomerLocale) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const submitting = useRef(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  function run(operation: CustomerOperation, successMessage: string, afterSuccess?: () => void) {
    if (submitting.current) return;
    submitting.current = true;
    setFeedback(null);
    startTransition(async () => {
      try {
        const result = await operation();
        if (!result.ok) {
          setFeedback({ tone: "error", message: errorMessage(locale, result) });
          return;
        }
        afterSuccess?.();
        setFeedback({ tone: "success", message: successMessage });
        router.refresh();
      } catch {
        setFeedback({
          tone: "error",
          message:
            locale === "fa"
              ? "ارتباط با سرور برقرار نشد؛ دوباره تلاش کنید."
              : "The server could not be reached. Please try again.",
        });
      } finally {
        submitting.current = false;
      }
    });
  }

  return { feedback, pending, run };
}

type UploadTarget =
  | { kind: "project"; projects: readonly { id: string; name: string }[]; projectId?: string }
  | { kind: "ticketMessage"; messageId: string };

const uploadErrorMessages: Record<string, { fa: string; en: string }> = {
  file_too_large: {
    fa: "حجم فایل باید حداکثر ۲۰ مگابایت باشد.",
    en: "The file must be no larger than 20 MB.",
  },
  empty_file: { fa: "فایل خالی قابل ارسال نیست.", en: "An empty file cannot be uploaded." },
  forbidden: {
    fa: "دسترسی ارسال فایل به این مورد را ندارید.",
    en: "You cannot attach a file to this record.",
  },
  authentication_required: {
    fa: "برای ارسال فایل دوباره وارد حساب شوید.",
    en: "Please sign in again to upload the file.",
  },
  unsupported_extension: {
    fa: "این نوع فایل پشتیبانی نمی‌شود.",
    en: "This file type is not supported.",
  },
  mime_mismatch: {
    fa: "نوع فایل با محتوای آن تطابق ندارد.",
    en: "The file type does not match its contents.",
  },
  signature_mismatch: {
    fa: "محتوای فایل معتبر نیست.",
    en: "The file contents could not be validated.",
  },
};

export function CustomerFileUpload({
  locale,
  target,
}: {
  locale: CustomerLocale;
  target: UploadTarget;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const submitting = useRef(false);
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const fa = locale === "fa";
  if (target.kind === "project" && target.projects.length === 0) return null;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const data = new FormData(event.currentTarget);
    const file = data.get("file");
    if (!(file instanceof File) || file.size === 0 || file.size > 20 * 1024 * 1024) {
      setFeedback({
        tone: "error",
        message: fa
          ? "یک فایل غیرخالی با حجم حداکثر ۲۰ مگابایت انتخاب کنید."
          : "Choose a non-empty file no larger than 20 MB.",
      });
      return;
    }
    data.set("kind", target.kind);
    if (target.kind === "ticketMessage") data.set("messageId", target.messageId);
    else data.set("visibility", "PROJECT_MEMBERS");
    submitting.current = true;
    setPending(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/files/upload", { method: "POST", body: data });
      const result: unknown = await response.json();
      if (
        !response.ok ||
        typeof result !== "object" ||
        result === null ||
        !("ok" in result) ||
        result.ok !== true
      ) {
        let code = "upload_failed";
        if (
          typeof result === "object" &&
          result !== null &&
          "error" in result &&
          typeof result.error === "object" &&
          result.error !== null &&
          "code" in result.error &&
          typeof result.error.code === "string"
        )
          code = result.error.code;
        const message =
          uploadErrorMessages[code]?.[locale] ??
          (fa
            ? "ارسال فایل انجام نشد؛ دوباره تلاش کنید."
            : "The file could not be uploaded. Please try again.");
        setFeedback({ tone: "error", message });
        return;
      }
      formRef.current?.reset();
      setFeedback({
        tone: "success",
        message: fa
          ? "فایل ارسال شد و تا پایان بررسی امنیتی در قرنطینه است. پس از تأیید امکان دریافت فعال می‌شود."
          : "The file was uploaded and is quarantined for a security review. Download becomes available after approval.",
      });
      router.refresh();
    } catch {
      setFeedback({
        tone: "error",
        message: fa
          ? "ارتباط هنگام ارسال فایل قطع شد؛ دوباره تلاش کنید."
          : "The upload connection failed. Please try again.",
      });
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  return (
    <details className="mt-6 rounded-[6px] border border-border bg-surface p-5">
      <summary className="cursor-pointer font-bold text-brand">
        {fa ? "ارسال فایل" : "Upload a file"}
      </summary>
      <form ref={formRef} onSubmit={submit} className="mt-5 space-y-4">
        <fieldset disabled={pending} className="space-y-4">
          {target.kind === "project" && (
            <label className={labelClass}>
              {fa ? "پروژه" : "Project"}
              <select
                name="projectId"
                defaultValue={target.projectId ?? target.projects[0]?.id}
                className={inputClass}
                required
              >
                {target.projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label className={labelClass}>
            {fa ? "فایل" : "File"}
            <input
              name="file"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,.zip,.txt,.md,.csv"
              required
              className={inputClass}
            />
          </label>
          <p className="text-xs leading-6 text-muted-foreground">
            {fa
              ? "حداکثر ۲۰ مگابایت؛ PDF، تصویر، ZIP یا متن. فایل تا تأیید بررسی امنیتی قابل دریافت نیست."
              : "Up to 20 MB: PDF, images, ZIP or text. Downloads are held until the security review is approved."}
          </p>
          <Button type="submit">
            <PendingLabel pending={pending} idle={fa ? "ارسال فایل" : "Upload file"} />
          </Button>
        </fieldset>
        <ActionFeedback feedback={feedback} />
      </form>
    </details>
  );
}

function ActionFeedback({ feedback }: { feedback: Feedback }) {
  if (!feedback) return null;
  return (
    <p
      className={`mt-3 text-xs leading-6 ${
        feedback.tone === "error" ? "text-destructive" : "text-emerald-700 dark:text-emerald-400"
      }`}
      role={feedback.tone === "error" ? "alert" : "status"}
      aria-live="polite"
    >
      {feedback.message}
    </p>
  );
}

function PendingLabel({ pending, idle }: { pending: boolean; idle: string }) {
  return (
    <>
      {pending && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
      {pending ? "…" : idle}
    </>
  );
}

const milestoneDecisions = ["APPROVED", "CHANGES_REQUESTED", "REJECTED"] as const;
type MilestoneDecision = (typeof milestoneDecisions)[number];

function isMilestoneDecision(value: string): value is MilestoneDecision {
  return milestoneDecisions.some((decision) => decision === value);
}

export function CustomerMilestoneApproval({
  locale,
  milestoneId,
}: {
  locale: CustomerLocale;
  milestoneId: string;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { feedback, pending, run } = useCustomerOperation(locale);
  const fa = locale === "fa";

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const decision = String(formData.get("decision") ?? "");
    if (!isMilestoneDecision(decision)) return;
    const note = String(formData.get("note") ?? "").trim();
    run(
      () => approveMilestoneAction({ milestoneId, decision, ...(note ? { note } : {}) }),
      fa ? "نظر شما با موفقیت ثبت شد." : "Your decision was recorded.",
      () => {
        formRef.current?.reset();
        if (detailsRef.current) detailsRef.current.open = false;
      },
    );
  }

  return (
    <div className="min-w-52">
      <details ref={detailsRef}>
        <summary className="cursor-pointer font-bold text-brand marker:text-muted-foreground">
          {fa ? "ثبت نظر" : "Review"}
        </summary>
        <form ref={formRef} onSubmit={submit} className="mt-3 space-y-3" noValidate>
          <fieldset disabled={pending} className="space-y-3">
            <label className={labelClass}>
              {fa ? "تصمیم" : "Decision"}
              <select name="decision" defaultValue="APPROVED" className={inputClass} required>
                <option value="APPROVED">{fa ? "تأیید" : "Approve"}</option>
                <option value="CHANGES_REQUESTED">
                  {fa ? "نیازمند اصلاح" : "Request changes"}
                </option>
                <option value="REJECTED">{fa ? "رد" : "Reject"}</option>
              </select>
            </label>
            <label className={labelClass}>
              {fa ? "یادداشت (اختیاری)" : "Note (optional)"}
              <textarea name="note" rows={3} maxLength={5_000} className={inputClass} />
            </label>
            <Button type="submit" size="sm">
              <PendingLabel pending={pending} idle={fa ? "ثبت تصمیم" : "Submit decision"} />
            </Button>
          </fieldset>
        </form>
      </details>
      <ActionFeedback feedback={feedback} />
    </div>
  );
}

type TicketOption = { id: string; displayName: string };
type TicketProjectOption = { id: string; clientId: string; name: string };
const ticketCategories = ["GENERAL", "TECHNICAL", "BILLING", "PROJECT"] as const;
const ticketPriorities = ["LOW", "NORMAL", "HIGH", "URGENT"] as const;
type TicketCategory = (typeof ticketCategories)[number];
type TicketPriority = (typeof ticketPriorities)[number];

function isTicketCategory(value: string): value is TicketCategory {
  return ticketCategories.some((category) => category === value);
}

function isTicketPriority(value: string): value is TicketPriority {
  return ticketPriorities.some((priority) => priority === value);
}

export function CustomerTicketCreateForm({
  locale,
  clients,
  projects,
}: {
  locale: CustomerLocale;
  clients: readonly TicketOption[];
  projects: readonly TicketProjectOption[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [projectId, setProjectId] = useState("");
  const { feedback, pending, run } = useCustomerOperation(locale);
  const fa = locale === "fa";
  const availableProjects = projects.filter((project) => project.clientId === clientId);

  if (clients.length === 0) {
    return (
      <p className="mt-8 rounded-[6px] border border-dashed border-border p-5 text-sm text-muted-foreground">
        {fa
          ? "برای ثبت تیکت ابتدا باید عضویت فعال یک مجموعه داشته باشید."
          : "An active organisation membership is required before creating a ticket."}
      </p>
    );
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const category = String(formData.get("category") ?? "");
    const priority = String(formData.get("priority") ?? "");
    if (!isTicketCategory(category) || !isTicketPriority(priority)) return;
    const selectedProjectId = String(formData.get("projectId") ?? "");
    run(
      () =>
        createTicketAction({
          clientId,
          ...(selectedProjectId ? { projectId: selectedProjectId } : {}),
          subject: String(formData.get("subject") ?? ""),
          body: String(formData.get("body") ?? ""),
          category,
          priority,
        }),
      fa ? "تیکت پشتیبانی ثبت شد." : "Your support ticket was created.",
      () => {
        formRef.current?.reset();
        setClientId(clients[0]?.id ?? "");
        setProjectId("");
      },
    );
  }

  return (
    <details className="mt-8 rounded-[6px] border border-border bg-surface p-5">
      <summary className="cursor-pointer font-bold text-brand marker:text-muted-foreground">
        {fa ? "ثبت تیکت جدید" : "Create a new ticket"}
      </summary>
      <form ref={formRef} onSubmit={submit} className="mt-6" noValidate>
        <fieldset disabled={pending} className="grid gap-5 md:grid-cols-2">
          <label className={labelClass}>
            {fa ? "مجموعه" : "Organisation"}
            <select
              name="clientId"
              value={clientId}
              onChange={(event) => {
                setClientId(event.target.value);
                setProjectId("");
              }}
              className={inputClass}
              required
            >
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.displayName}
                </option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            {fa ? "پروژه (اختیاری)" : "Project (optional)"}
            <select
              name="projectId"
              value={projectId}
              onChange={(event) => setProjectId(event.target.value)}
              className={inputClass}
            >
              <option value="">{fa ? "بدون پروژه" : "No project"}</option>
              {availableProjects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>
          <label className={`${labelClass} md:col-span-2`}>
            {fa ? "موضوع" : "Subject"}
            <input name="subject" minLength={3} maxLength={240} className={inputClass} required />
          </label>
          <label className={labelClass}>
            {fa ? "دسته‌بندی" : "Category"}
            <select name="category" defaultValue="GENERAL" className={inputClass} required>
              <option value="GENERAL">{fa ? "عمومی" : "General"}</option>
              <option value="TECHNICAL">{fa ? "فنی" : "Technical"}</option>
              <option value="BILLING">{fa ? "مالی" : "Billing"}</option>
              <option value="PROJECT">{fa ? "پروژه" : "Project"}</option>
            </select>
          </label>
          <label className={labelClass}>
            {fa ? "اولویت" : "Priority"}
            <select name="priority" defaultValue="NORMAL" className={inputClass} required>
              <option value="LOW">{fa ? "کم" : "Low"}</option>
              <option value="NORMAL">{fa ? "عادی" : "Normal"}</option>
              <option value="HIGH">{fa ? "زیاد" : "High"}</option>
              <option value="URGENT">{fa ? "فوری" : "Urgent"}</option>
            </select>
          </label>
          <label className={`${labelClass} md:col-span-2`}>
            {fa ? "شرح درخواست" : "Request details"}
            <textarea
              name="body"
              rows={5}
              minLength={2}
              maxLength={30_000}
              className={inputClass}
              required
            />
          </label>
          <div className="md:col-span-2">
            <Button type="submit">
              <PendingLabel pending={pending} idle={fa ? "ثبت تیکت" : "Create ticket"} />
            </Button>
            <ActionFeedback feedback={feedback} />
          </div>
        </fieldset>
      </form>
    </details>
  );
}

export function CustomerTicketActions({
  locale,
  ticketId,
  status,
}: {
  locale: CustomerLocale;
  ticketId: string;
  status: string;
}) {
  const replyFormRef = useRef<HTMLFormElement>(null);
  const { feedback, pending, run } = useCustomerOperation(locale);
  const fa = locale === "fa";
  const closed = status === "CLOSED";
  const resolved = status === "RESOLVED";

  if (closed)
    return <span className="text-xs text-muted-foreground">{fa ? "بسته" : "Closed"}</span>;

  function submitReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    run(
      () =>
        replyToTicketAction({
          ticketId,
          body: String(formData.get("body") ?? ""),
          visibility: "PUBLIC",
        }),
      fa ? "پاسخ شما ارسال شد." : "Your reply was sent.",
      () => replyFormRef.current?.reset(),
    );
  }

  function resolve() {
    run(
      () => resolveTicketAction({ ticketId }),
      fa ? "تیکت به‌عنوان حل‌شده ثبت شد." : "The ticket was marked as resolved.",
    );
  }

  return (
    <div className="min-w-56">
      <details>
        <summary className="cursor-pointer font-bold text-brand marker:text-muted-foreground">
          {fa ? "پاسخ و عملیات" : "Reply and actions"}
        </summary>
        <form ref={replyFormRef} onSubmit={submitReply} className="mt-3 space-y-3" noValidate>
          <label className={labelClass}>
            {fa ? "پاسخ عمومی" : "Public reply"}
            <textarea
              name="body"
              rows={3}
              minLength={1}
              maxLength={30_000}
              className={inputClass}
              disabled={pending}
              required
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <Button type="submit" size="sm" disabled={pending}>
              <PendingLabel pending={pending} idle={fa ? "ارسال پاسخ" : "Send reply"} />
            </Button>
            {!resolved && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={pending}
                onClick={resolve}
              >
                {fa ? "علامت‌گذاری حل‌شده" : "Mark resolved"}
              </Button>
            )}
          </div>
        </form>
      </details>
      <ActionFeedback feedback={feedback} />
    </div>
  );
}

export function CustomerNotificationReadButton({
  locale,
  notificationId,
}: {
  locale: CustomerLocale;
  notificationId: string;
}) {
  const { feedback, pending, run } = useCustomerOperation(locale);
  const fa = locale === "fa";
  return (
    <div>
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() =>
          run(
            () => markNotificationReadAction({ notificationId }),
            fa ? "اعلان خوانده شد." : "Notification marked as read.",
          )
        }
      >
        <PendingLabel pending={pending} idle={fa ? "خواندم" : "Mark read"} />
      </Button>
      <ActionFeedback feedback={feedback} />
    </div>
  );
}

export function CustomerNotificationsToolbar({ locale }: { locale: CustomerLocale }) {
  const { feedback, pending, run } = useCustomerOperation(locale);
  const fa = locale === "fa";
  return (
    <div className="mt-6 flex flex-col items-start">
      <Button
        type="button"
        variant="outline"
        disabled={pending}
        onClick={() =>
          run(
            markAllNotificationsReadAction,
            fa ? "همه اعلان‌ها خوانده شدند." : "All notifications were marked as read.",
          )
        }
      >
        <PendingLabel pending={pending} idle={fa ? "خواندن همه" : "Mark all as read"} />
      </Button>
      <ActionFeedback feedback={feedback} />
    </div>
  );
}

export type CustomerProfileDefaults = {
  displayName: string;
  phone: string | null;
  company: string | null;
  locale: string;
  timezone: string;
  bio: string | null;
};

export function CustomerProfileForm({
  locale,
  defaults,
}: {
  locale: CustomerLocale;
  defaults: CustomerProfileDefaults;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const { feedback, pending, run } = useCustomerOperation(locale);
  const fa = locale === "fa";

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const profileLocale = String(formData.get("locale") ?? "");
    if (profileLocale !== "fa" && profileLocale !== "en") return;
    run(
      () =>
        updateProfileAction({
          displayName: String(formData.get("displayName") ?? ""),
          phone: String(formData.get("phone") ?? ""),
          company: String(formData.get("company") ?? ""),
          locale: profileLocale,
          timezone: String(formData.get("timezone") ?? ""),
          bio: String(formData.get("bio") ?? ""),
        }),
      fa ? "پروفایل شما به‌روزرسانی شد." : "Your profile was updated.",
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={submit}
      className="rounded-[6px] border border-border bg-surface p-6"
      noValidate
    >
      <fieldset disabled={pending} className="grid gap-5 sm:grid-cols-2">
        <label className={`${labelClass} sm:col-span-2`}>
          {fa ? "نام نمایشی" : "Display name"}
          <input
            name="displayName"
            defaultValue={defaults.displayName}
            minLength={2}
            maxLength={160}
            autoComplete="name"
            className={inputClass}
            required
          />
        </label>
        <label className={labelClass}>
          {fa ? "تلفن" : "Phone"}
          <input
            name="phone"
            type="tel"
            defaultValue={defaults.phone ?? ""}
            maxLength={32}
            autoComplete="tel"
            dir="ltr"
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          {fa ? "شرکت" : "Company"}
          <input
            name="company"
            defaultValue={defaults.company ?? ""}
            maxLength={200}
            autoComplete="organization"
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          {fa ? "زبان ترجیحی" : "Preferred language"}
          <select
            name="locale"
            defaultValue={defaults.locale === "en" ? "en" : "fa"}
            className={inputClass}
            required
          >
            <option value="fa">فارسی</option>
            <option value="en">English</option>
          </select>
        </label>
        <label className={labelClass}>
          {fa ? "منطقه زمانی" : "Time zone"}
          <input
            name="timezone"
            defaultValue={defaults.timezone || "Asia/Tehran"}
            minLength={1}
            maxLength={64}
            dir="ltr"
            className={inputClass}
            required
          />
        </label>
        <label className={`${labelClass} sm:col-span-2`}>
          {fa ? "درباره من" : "Bio"}
          <textarea
            name="bio"
            defaultValue={defaults.bio ?? ""}
            rows={5}
            maxLength={5_000}
            className={inputClass}
          />
        </label>
        <div className="sm:col-span-2">
          <Button type="submit">
            <PendingLabel pending={pending} idle={fa ? "ذخیره تغییرات" : "Save changes"} />
          </Button>
          <ActionFeedback feedback={feedback} />
        </div>
      </fieldset>
    </form>
  );
}
