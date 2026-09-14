"use client";

import { saveSiteSettingAction } from "@/features/settings/actions";
import { saveSiteSettingSchema } from "@/features/settings/schemas";
import type { Locale } from "@/i18n/routing";

import { AdminField, AdminForm, AdminSelect, AdminText, label, textValue } from "./admin-form";

type SettingItem = { key: string; value: unknown; visibility: string };

function parsedJson(data: FormData): unknown {
  try {
    const value: unknown = JSON.parse(textValue(data, "value"));
    return value;
  } catch {
    return undefined;
  }
}

export function AdminSettingForm({ locale, item }: { locale: Locale; item?: SettingItem }) {
  return (
    <AdminForm
      locale={locale}
      title={
        item
          ? label(locale, `ویرایش ${item.key}`, `Edit ${item.key}`)
          : label(locale, "تنظیم جدید", "New setting")
      }
      description={label(
        locale,
        "مقدار باید JSON معتبر باشد. Secretها از این پنل قابل مشاهده یا تغییر نیستند.",
        "The value must be valid JSON. Secrets cannot be viewed or changed here.",
      )}
      action={saveSiteSettingAction}
      schema={saveSiteSettingSchema}
      build={(data) => ({
        ...(item ? { originalKey: item.key } : {}),
        key: textValue(data, "key"),
        value: parsedJson(data),
        visibility: textValue(data, "visibility"),
      })}
      submit={label(
        locale,
        item ? "ذخیره تنظیم" : "ساخت تنظیم",
        item ? "Save setting" : "Create setting",
      )}
    >
      <AdminField
        name="key"
        title={label(locale, "کلید", "Key")}
        defaultValue={item?.key ?? ""}
        maxLength={120}
        pattern="[a-z0-9]+(?:[._-][a-z0-9]+)*"
        required
        dir="ltr"
      />
      <AdminSelect
        name="visibility"
        title={label(locale, "سطح نمایش", "Visibility")}
        defaultValue={item?.visibility ?? "PRIVATE"}
        options={[
          { value: "PRIVATE", label: "PRIVATE" },
          { value: "PUBLIC", label: "PUBLIC" },
        ]}
      />
      <AdminText
        name="value"
        title={label(locale, "مقدار JSON", "JSON value")}
        defaultValue={item ? JSON.stringify(item.value, null, 2) : "{}"}
        maxLength={100_000}
        required
      />
    </AdminForm>
  );
}
