"use client";

import { Check, ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import {
  readAnalyticsAttribution,
  subscribeAnalyticsAttribution,
  trackAnalyticsEvent,
  type AnalyticsAttribution,
} from "@/components/analytics/analytics-provider";
import { submitLeadAction, type LeadActionState } from "@/features/leads/actions";
import type { LeadKind } from "@/features/leads/schema";
import type { Locale } from "@/i18n/routing";

const initialState: LeadActionState = { status: "idle", message: "" };

type Copy = {
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
  consent: string;
  submit: string;
  sending: string;
  optional: string;
  choose: string;
  contactHint: string;
  stepOne: string;
  stepTwo: string;
  stepThree: string;
  next: string;
  back: string;
  identityHint: string;
  scopeHint: string;
  finalHint: string;
};

const copy: Record<Locale, Copy> = {
  fa: {
    name: "نام و نام خانوادگی",
    email: "ایمیل",
    phone: "شماره تماس",
    company: "اسم شرکت یا مجموعه",
    website: "آدرس سایت",
    projectType: "پروژه‌تان درباره چیست؟",
    budget: "حدود بودجه‌ای که در نظر دارید",
    timeline: "دوست دارید از چه زمانی شروع کنیم؟",
    message: "کمی از وضعیت فعلی و چیزی که می‌خواهید برایمان بگویید",
    consent: "موافقم رای‌کد فقط برای پیگیری همین درخواست با من تماس بگیرد.",
    submit: "ارسال درخواست",
    sending: "دارد ارسال می‌شود…",
    optional: "اختیاری",
    choose: "یکی را انتخاب کنید",
    contactHint: "ایمیل یا شماره تماس؛ هر کدام برایتان راحت‌تر است.",
    stepOne: "آشنایی",
    stepTwo: "پروژه",
    stepThree: "حرف آخر",
    next: "بریم مرحله بعد",
    back: "برگردیم",
    identityHint: "اول کوتاه با شما و مجموعه‌تان آشنا شویم.",
    scopeHint: "چند خط درباره وضعیت فعلی کمک می‌کند مستقیم برویم سر اصل مطلب.",
    finalHint: "هر چیزی فکر می‌کنید به فهم بهتر موضوع کمک می‌کند، اینجا بنویسید.",
  },
  en: {
    name: "Full name",
    email: "Email",
    phone: "Phone",
    company: "Company or organisation",
    website: "Website URL",
    projectType: "Project type or current technology",
    budget: "Indicative budget",
    timeline: "Preferred start",
    message: "The problem, current state and outcome you need",
    consent: "I agree that RYCODE may contact me solely to follow up this request.",
    submit: "Submit request securely",
    sending: "Submitting…",
    optional: "Optional",
    choose: "Choose one",
    contactHint: "At least one of email or phone is required.",
    stepOne: "Context",
    stepTwo: "Scope",
    stepThree: "Conversation",
    next: "Continue",
    back: "Back",
    identityHint: "Start with who we are speaking with and the organisation involved.",
    scopeHint: "A few signals about the current state make the first conversation useful.",
    finalHint: "Add the final context so the RYCODE team can respond with substance.",
  },
};

const budgetOptions: Record<Locale, string[]> = {
  fa: [
    "هنوز نمی‌دانم؛ راهنمایی می‌خواهم",
    "کمتر از ۱۰۰ میلیون تومان",
    "۱۰۰ تا ۳۰۰ میلیون تومان",
    "۳۰۰ تا ۷۰۰ میلیون تومان",
    "بیشتر از ۷۰۰ میلیون تومان",
  ],
  en: [
    "Needs assessment",
    "Small engagement",
    "Mid-size engagement",
    "Large engagement",
    "Enterprise / phased programme",
  ],
};

const timelineOptions: Record<Locale, string[]> = {
  fa: ["هرچه زودتر", "تا یک ماه آینده", "یک تا سه ماه آینده", "عجله‌ای ندارم"],
  en: [
    "Urgent, subject to risk review",
    "Within one month",
    "Within one to three months",
    "Flexible",
  ],
};

function FieldError({ state, name }: { state: LeadActionState; name: string }) {
  const error = state.fieldErrors?.[name]?.[0];
  if (!error) return null;
  return (
    <span id={`${name}-error`} className="mt-2 block text-xs font-semibold text-destructive">
      {error}
    </span>
  );
}

function SubmitButton({ locale }: { locale: Locale }) {
  const { pending } = useFormStatus();
  const text = copy[locale];
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-12 items-center justify-center gap-3 rounded-[6px] bg-brand px-7 text-sm font-bold text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-wait disabled:opacity-70"
    >
      {pending && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
      {pending ? text.sending : text.submit}
    </button>
  );
}

const inputClass =
  "mt-2 min-h-12 w-full rounded-[6px] border border-input bg-background px-4 text-base outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-brand focus:ring-2 focus:ring-brand/20";

function labelText(label: string, optional: string, isOptional = false) {
  return (
    <>
      {label}
      {isOptional && (
        <span className="ms-2 text-xs font-normal text-muted-foreground">({optional})</span>
      )}
    </>
  );
}

export function LeadForm({
  locale,
  kind,
  sourcePath,
}: {
  locale: Locale;
  kind: LeadKind;
  sourcePath: string;
}) {
  const [startedAt] = useState(() => Date.now());
  const [attribution, setAttribution] = useState<AnalyticsAttribution | null>(null);
  const [state, formAction] = useActionState(submitLeadAction, initialState);
  const [step, setStep] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const text = copy[locale];
  const detailed = kind !== "contact";
  const needsWebsite = kind === "technical_review" || kind === "seo_audit";
  const lastStep = detailed ? 2 : 1;
  const stepLabels = detailed
    ? [text.stepOne, text.stepTwo, text.stepThree]
    : [text.stepOne, text.stepThree];

  useEffect(() => {
    const syncAttribution = () => setAttribution(readAnalyticsAttribution());
    syncAttribution();
    return subscribeAnalyticsAttribution(syncAttribution);
  }, []);

  useEffect(() => {
    if (state.status !== "success") return;
    trackAnalyticsEvent({
      name: "form_submitted",
      path: window.location.pathname,
      label: `lead:${kind}`,
    });
  }, [kind, state.status]);

  function nextStep() {
    if (formRef.current?.reportValidity()) setStep((current) => Math.min(lastStep, current + 1));
  }

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-[6px] border border-brand/35 bg-brand-soft p-8 sm:p-10">
        <span className="grid size-11 place-items-center rounded-full bg-brand text-brand-foreground">
          <Check className="size-5" aria-hidden />
        </span>
        <h2 className="mt-6 text-xl font-bold">
          {locale === "fa" ? "رسید دستمان 🙌" : "Request submitted"}
        </h2>
        <p className="mt-3 max-w-xl leading-8 text-muted-foreground">{state.message}</p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-7" noValidate>
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="sourcePath" value={sourcePath} />
      <input type="hidden" name="startedAt" value={startedAt} />
      {attribution && (
        <>
          <input type="hidden" name="analyticsAnonymousId" value={attribution.anonymousId} />
          <input type="hidden" name="analyticsSessionKey" value={attribution.sessionKey} />
        </>
      )}

      <div
        className="flex items-center gap-2 border-b border-hairline pb-5"
        aria-label="Form progress"
      >
        {stepLabels.map((label, index) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <span
              className={`grid size-8 shrink-0 place-items-center rounded-full border text-xs font-bold transition-colors ${
                index <= step
                  ? "border-brand bg-brand text-brand-foreground"
                  : "border-border text-muted-foreground"
              }`}
            >
              {index + 1}
            </span>
            <span
              className={`hidden text-xs font-semibold sm:inline ${index === step ? "text-foreground" : "text-muted-foreground"}`}
            >
              {label}
            </span>
            {index < stepLabels.length - 1 && <span className="h-px flex-1 bg-border" />}
          </div>
        ))}
      </div>

      <div className="absolute -start-[10000px] top-auto size-px overflow-hidden" aria-hidden>
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && (
        <div
          role="alert"
          className="rounded-[6px] border border-destructive/40 bg-destructive/5 p-4 text-sm leading-7 text-destructive"
        >
          {state.message}
        </div>
      )}

      <fieldset hidden={step !== 0} className="space-y-6">
        <legend className="text-lg font-bold">{text.stepOne}</legend>
        <p className="text-sm leading-7 text-muted-foreground">{text.identityHint}</p>
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            {text.name}
            <input
              name="fullName"
              type="text"
              required={step === 0}
              minLength={2}
              maxLength={120}
              autoComplete="name"
              aria-invalid={Boolean(state.fieldErrors?.fullName)}
              className={inputClass}
            />
            <FieldError state={state} name="fullName" />
          </label>
          <label className="text-sm font-semibold">
            {labelText(text.company, text.optional, true)}
            <input
              name="company"
              type="text"
              maxLength={160}
              autoComplete="organization"
              className={inputClass}
            />
            <FieldError state={state} name="company" />
          </label>
        </div>
      </fieldset>

      {detailed && (
        <fieldset hidden={step !== 1} className="space-y-6">
          <legend className="text-lg font-bold">{text.stepTwo}</legend>
          <p className="text-sm leading-7 text-muted-foreground">{text.scopeHint}</p>
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="text-sm font-semibold">
              {labelText(text.website, text.optional, !needsWebsite)}
              <input
                name="websiteUrl"
                type="url"
                inputMode="url"
                maxLength={500}
                required={needsWebsite && step === 1}
                placeholder="https://"
                dir="ltr"
                aria-invalid={Boolean(state.fieldErrors?.websiteUrl)}
                className={inputClass}
              />
              <FieldError state={state} name="websiteUrl" />
            </label>
            <label className="text-sm font-semibold">
              {labelText(text.projectType, text.optional, true)}
              <input name="projectType" type="text" maxLength={160} className={inputClass} />
              <FieldError state={state} name="projectType" />
            </label>
          </div>
          {kind === "project" && (
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                {labelText(text.budget, text.optional, true)}
                <select name="budget" className={inputClass} defaultValue="">
                  <option value="">{text.choose}</option>
                  {budgetOptions[locale].map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-semibold">
                {labelText(text.timeline, text.optional, true)}
                <select name="timeline" className={inputClass} defaultValue="">
                  <option value="">{text.choose}</option>
                  {timelineOptions[locale].map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
            </div>
          )}
        </fieldset>
      )}

      <fieldset hidden={step !== lastStep} className="space-y-6">
        <legend className="text-lg font-bold">{detailed ? text.stepThree : text.stepThree}</legend>
        <p className="text-sm leading-7 text-muted-foreground">{text.finalHint}</p>
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            {text.email}
            <input
              name="email"
              type="email"
              inputMode="email"
              maxLength={254}
              autoComplete="email"
              dir="ltr"
              aria-invalid={Boolean(state.fieldErrors?.email)}
              className={inputClass}
            />
            <FieldError state={state} name="email" />
          </label>
          <label className="text-sm font-semibold">
            {text.phone}
            <input
              name="phone"
              type="tel"
              inputMode="tel"
              maxLength={32}
              autoComplete="tel"
              dir="ltr"
              aria-invalid={Boolean(state.fieldErrors?.phone)}
              className={inputClass}
            />
            <FieldError state={state} name="phone" />
          </label>
        </div>
        <p className="text-xs text-muted-foreground">{text.contactHint}</p>
        <label className="block text-sm font-semibold">
          {text.message}
          <textarea
            name="message"
            required={step === lastStep}
            minLength={10}
            maxLength={5_000}
            rows={7}
            aria-invalid={Boolean(state.fieldErrors?.message)}
            className={`${inputClass} resize-y py-3`}
          />
          <FieldError state={state} name="message" />
        </label>
        <label className="flex cursor-pointer items-start gap-3 border-t border-hairline pt-6 text-sm leading-7 text-muted-foreground">
          <input
            name="consent"
            type="checkbox"
            required={step === lastStep}
            className="mt-1 size-4 accent-[var(--color-brand)]"
            aria-invalid={Boolean(state.fieldErrors?.consent)}
          />
          <span>{text.consent}</span>
        </label>
        <FieldError state={state} name="consent" />
      </fieldset>

      <div className="flex flex-wrap items-center gap-3 border-t border-hairline pt-6">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((current) => Math.max(0, current - 1))}
            className="inline-flex min-h-12 items-center gap-2 rounded-[6px] border border-border px-5 text-sm font-bold transition-colors hover:border-brand/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {locale === "fa" ? (
              <ChevronRight className="size-4" aria-hidden />
            ) : (
              <ChevronLeft className="size-4" aria-hidden />
            )}
            {text.back}
          </button>
        )}
        {step < lastStep ? (
          <button
            type="button"
            onClick={nextStep}
            className="inline-flex min-h-12 items-center gap-2 rounded-[6px] bg-brand px-7 text-sm font-bold text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {text.next}
            {locale === "fa" ? (
              <ChevronLeft className="size-4" aria-hidden />
            ) : (
              <ChevronRight className="size-4" aria-hidden />
            )}
          </button>
        ) : (
          <SubmitButton locale={locale} />
        )}
      </div>
      <p className="text-xs leading-6 text-muted-foreground">
        {locale === "fa"
          ? "اطلاعات فقط برای بررسی همین درخواست در سامانه داخلی رای‌کد ذخیره می‌شود."
          : "Your information is stored in RYCODE's internal system only for reviewing this request."}
      </p>
    </form>
  );
}
