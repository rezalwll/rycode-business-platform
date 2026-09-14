"use client";

import { saveFaqAction } from "@/features/cms/actions";
import { saveFaqSchema } from "@/features/cms/schemas";
import type { Locale } from "@/i18n/routing";

import { AdminField, AdminForm, AdminSelect, label, statusOptions, textValue } from "./admin-form";
import { AdminRichText } from "./admin-rich-text";

type FaqItem = {
  id: string;
  status: string;
  translations: readonly { locale: string; question: string; answer: unknown }[];
};

function jsonValue(data: FormData, name: string): unknown {
  try {
    const value: unknown = JSON.parse(textValue(data, name));
    return value;
  } catch {
    return undefined;
  }
}

function documentText(value: unknown): string {
  if (typeof value !== "object" || value === null) return "";
  if ("text" in value && typeof value.text === "string") return value.text;
  if (!("content" in value) || !Array.isArray(value.content)) return "";
  return value.content.map(documentText).filter(Boolean).join("\n\n");
}

export function AdminFaqForm({
  locale,
  item,
  canPublish,
}: {
  locale: Locale;
  item?: FaqItem;
  canPublish: boolean;
}) {
  const fa = item?.translations.find(({ locale: itemLocale }) => itemLocale === "fa");
  const en = item?.translations.find(({ locale: itemLocale }) => itemLocale === "en");
  const statuses = canPublish
    ? ["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"]
    : ["DRAFT", "REVIEW", "ARCHIVED"];
  return (
    <AdminForm
      locale={locale}
      title={
        item
          ? label(
              locale,
              `ویرایش «${fa?.question ?? item.id}»`,
              `Edit “${en?.question ?? item.id}”`,
            )
          : label(locale, "پرسش جدید", "New FAQ")
      }
      description={label(
        locale,
        "پرسش و پاسخ هر دو زبان الزامی است؛ انتشار به مجوز مستقل نیاز دارد.",
        "Both language versions are required; publishing needs separate permission.",
      )}
      action={saveFaqAction}
      schema={saveFaqSchema}
      build={(data) => ({
        ...(item ? { id: item.id } : {}),
        status: textValue(data, "status"),
        translations: [
          {
            locale: "fa",
            question: textValue(data, "faQuestion"),
            answer: jsonValue(data, "faAnswer"),
            answerText: textValue(data, "faAnswerText"),
          },
          {
            locale: "en",
            question: textValue(data, "enQuestion"),
            answer: jsonValue(data, "enAnswer"),
            answerText: textValue(data, "enAnswerText"),
          },
        ],
      })}
      submit={label(locale, item ? "ذخیره پرسش" : "ساخت پرسش", item ? "Save FAQ" : "Create FAQ")}
    >
      <AdminSelect
        name="status"
        title={label(locale, "وضعیت", "Status")}
        defaultValue={item?.status ?? "DRAFT"}
        options={statusOptions(statuses)}
      />
      <span aria-hidden="true" />
      <AdminField
        name="faQuestion"
        title="پرسش فارسی"
        defaultValue={fa?.question ?? ""}
        maxLength={1_000}
        required
        dir="rtl"
        wide
      />
      <AdminRichText
        locale="fa"
        title="پاسخ فارسی"
        documentName="faAnswer"
        textName="faAnswerText"
        defaultDocument={fa?.answer}
        defaultText={documentText(fa?.answer)}
      />
      <AdminField
        name="enQuestion"
        title="English question"
        defaultValue={en?.question ?? ""}
        maxLength={1_000}
        required
        dir="ltr"
        wide
      />
      <AdminRichText
        locale="en"
        title="English answer"
        documentName="enAnswer"
        textName="enAnswerText"
        defaultDocument={en?.answer}
        defaultText={documentText(en?.answer)}
      />
    </AdminForm>
  );
}
