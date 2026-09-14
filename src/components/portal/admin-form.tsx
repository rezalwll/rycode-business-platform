"use client";

import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import type { z } from "zod";

import {
  ActionFeedback,
  ActionPanel,
  fieldClass,
  SubmitButton,
  textAreaClass,
  usePortalMutation,
  type PortalAction,
} from "@/components/portal/action-ui";
import type { Locale } from "@/i18n/routing";
import type { ServiceErrorCode } from "@/server/services/errors";

const errors: Record<ServiceErrorCode, string> = {
  AUTHENTICATION_REQUIRED: "Please sign in to continue.",
  FORBIDDEN: "You do not have permission to make this change.",
  INVALID_INPUT: "Review the form fields and try again.",
  NOT_FOUND: "This record is no longer available.",
  CONFLICT: "This conflicts with an existing record or another change. Refresh and try again.",
  INVALID_STATE:
    "This operation is not available in the current state. Check the workflow requirements.",
  INTERNAL_ERROR: "The change could not be saved. Please try again.",
};

export const label = (locale: Locale, fa: string, en: string) => (locale === "fa" ? fa : en);
export const textValue = (data: FormData, name: string) => String(data.get(name) ?? "").trim();
export const optionalValue = (data: FormData, name: string) => textValue(data, name) || undefined;
export type Option = { value: string; label: string };
export const statusOptions = (values: readonly string[]): Option[] =>
  values.map((value) => ({ value, label: value.replaceAll("_", " ") }));

export function AdminForm({
  locale,
  title,
  description,
  action,
  schema,
  build,
  children,
  submit,
  open = false,
}: {
  locale: Locale;
  title: string;
  description: string;
  action: PortalAction;
  schema: z.ZodType;
  build: (data: FormData) => unknown;
  children: ReactNode;
  submit?: string;
  open?: boolean;
}) {
  const operation = usePortalMutation(locale);
  const [validation, setValidation] = useState<string | null>(null);

  return (
    <ActionPanel title={title} description={description} open={open}>
      <form
        className="space-y-5"
        onSubmit={async (event) => {
          event.preventDefault();
          if (operation.pending) return;
          setValidation(null);
          operation.clearFeedback();
          const parsed = schema.safeParse(build(new FormData(event.currentTarget)));
          if (!parsed.success) {
            setValidation(
              label(locale, "لطفاً اطلاعات فرم را بررسی کنید.", "Please check the form fields.") +
                " " +
                parsed.error.issues
                  .slice(0, 3)
                  .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
                  .join(" · "),
            );
            return;
          }
          await operation.execute(async (input) => {
            const result = await action(input);
            if (result.ok || locale === "fa") return result;
            return { ...result, error: { ...result.error, message: errors[result.error.code] } };
          }, parsed.data);
        }}
      >
        <fieldset
          disabled={operation.pending}
          className="grid gap-4 border-0 p-0 sm:grid-cols-2 disabled:opacity-70"
        >
          {children}
        </fieldset>
        {validation && (
          <p role="alert" className="text-sm leading-7 text-destructive">
            {validation}
          </p>
        )}
        <ActionFeedback feedback={operation.feedback} />
        <SubmitButton pending={operation.pending}>
          {submit ?? label(locale, "ذخیره", "Save")}
        </SubmitButton>
      </form>
    </ActionPanel>
  );
}

export function AdminField({
  title,
  wide = false,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { title: string; wide?: boolean }) {
  return (
    <label className={`block text-xs font-semibold ${wide ? "sm:col-span-2" : ""}`}>
      {title}
      <input {...props} className={fieldClass} />
    </label>
  );
}

export function AdminText({
  title,
  name,
  defaultValue,
  required,
  maxLength = 20_000,
}: {
  title: string;
  name: string;
  defaultValue?: string | null;
  required?: boolean;
  maxLength?: number;
}) {
  return (
    <label className="block text-xs font-semibold sm:col-span-2">
      {title}
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        maxLength={maxLength}
        className={textAreaClass}
      />
    </label>
  );
}

export function AdminSelect({
  title,
  name,
  options,
  defaultValue = "",
  required = false,
  onChange,
}: {
  title: string;
  name: string;
  options: readonly Option[];
  defaultValue?: string;
  required?: boolean;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="block text-xs font-semibold">
      {title}
      <select
        name={name}
        defaultValue={defaultValue}
        required={required}
        className={fieldClass}
        onChange={(event) => onChange?.(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function AdminCheck({
  title,
  name,
  defaultChecked = false,
}: {
  title: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex min-h-11 items-center gap-3 text-sm">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="size-4 accent-[var(--brand)]"
      />
      {title}
    </label>
  );
}
