"use client";

import { saveRedirectAction } from "@/features/redirects/actions";
import { saveRedirectSchema } from "@/features/redirects/schemas";
import type { Locale } from "@/i18n/routing";

import { AdminCheck, AdminField, AdminForm, AdminSelect, label, textValue } from "./admin-form";

type RedirectItem = {
  id: string;
  sourcePath: string;
  destination: string;
  statusCode: number;
  preserveQuery: boolean;
  isActive: boolean;
};

export function AdminRedirectForm({ locale, item }: { locale: Locale; item?: RedirectItem }) {
  return (
    <AdminForm
      locale={locale}
      title={
        item
          ? label(locale, `ویرایش ${item.sourcePath}`, `Edit ${item.sourcePath}`)
          : label(locale, "تغییرمسیر جدید", "New redirect")
      }
      description={label(
        locale,
        "فقط مسیرهای داخلی پذیرفته می‌شوند؛ چرخه و زنجیره‌های بیش از حد بلند رد می‌شوند.",
        "Only internal paths are accepted; cycles and excessively long chains are rejected.",
      )}
      action={saveRedirectAction}
      schema={saveRedirectSchema}
      build={(data) => ({
        ...(item ? { id: item.id } : {}),
        sourcePath: textValue(data, "sourcePath"),
        destination: textValue(data, "destination"),
        statusCode: Number(textValue(data, "statusCode")),
        preserveQuery: data.has("preserveQuery"),
        isActive: data.has("isActive"),
      })}
      submit={label(
        locale,
        item ? "ذخیره تغییرمسیر" : "ساخت تغییرمسیر",
        item ? "Save redirect" : "Create redirect",
      )}
    >
      <AdminField
        name="sourcePath"
        title={label(locale, "مسیر مبدا", "Source path")}
        defaultValue={item?.sourcePath ?? ""}
        placeholder="/old-path"
        maxLength={500}
        required
        dir="ltr"
      />
      <AdminField
        name="destination"
        title={label(locale, "مسیر مقصد", "Destination path")}
        defaultValue={item?.destination ?? ""}
        placeholder="/new-path"
        maxLength={1_000}
        required
        dir="ltr"
      />
      <AdminSelect
        name="statusCode"
        title={label(locale, "کد HTTP", "HTTP status")}
        defaultValue={String(item?.statusCode ?? 308)}
        options={[301, 302, 307, 308].map((value) => ({
          value: String(value),
          label: String(value),
        }))}
      />
      <span aria-hidden="true" />
      <AdminCheck
        name="preserveQuery"
        title={label(locale, "حفظ Query String", "Preserve query string")}
        defaultChecked={item?.preserveQuery ?? true}
      />
      <AdminCheck
        name="isActive"
        title={label(locale, "فعال", "Active")}
        defaultChecked={item?.isActive ?? true}
      />
    </AdminForm>
  );
}
