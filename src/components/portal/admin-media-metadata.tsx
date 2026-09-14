"use client";

import { saveMediaMetadataAction } from "@/features/cms/actions";
import { saveMediaMetadataSchema } from "@/features/cms/schemas";
import type { Locale } from "@/i18n/routing";

import { AdminField, AdminForm, AdminText, label, optionalValue, textValue } from "./admin-form";

type MediaItem = {
  id: string;
  key: string;
  focalPointX: number | null;
  focalPointY: number | null;
  translations: readonly {
    locale: string;
    altText: string;
    caption: string | null;
  }[];
};

const decimalValue = (data: FormData, name: string): number | null => {
  const value = optionalValue(data, name);
  return value === undefined ? null : Number(value);
};

export function AdminMediaMetadataForm({ locale, media }: { locale: Locale; media: MediaItem }) {
  const fa = media.translations.find(({ locale: itemLocale }) => itemLocale === "fa");
  const en = media.translations.find(({ locale: itemLocale }) => itemLocale === "en");
  return (
    <AdminForm
      locale={locale}
      title={label(locale, `اطلاعات رسانه «${media.key}»`, `Metadata for “${media.key}”`)}
      description={label(
        locale,
        "متن جایگزین هر دو زبان الزامی است. نقطه کانونی بین صفر و یک وارد می‌شود.",
        "Alt text is required in both languages. Focal coordinates range from zero to one.",
      )}
      action={saveMediaMetadataAction}
      schema={saveMediaMetadataSchema}
      build={(data) => ({
        mediaId: media.id,
        focalPointX: decimalValue(data, "focalPointX"),
        focalPointY: decimalValue(data, "focalPointY"),
        translations: [
          {
            locale: "fa",
            altText: textValue(data, "faAltText"),
            caption: optionalValue(data, "faCaption"),
          },
          {
            locale: "en",
            altText: textValue(data, "enAltText"),
            caption: optionalValue(data, "enCaption"),
          },
        ],
      })}
      submit={label(locale, "ذخیره اطلاعات رسانه", "Save media metadata")}
    >
      <AdminField
        name="focalPointX"
        title={label(locale, "نقطه کانونی افقی", "Horizontal focal point")}
        type="number"
        min={0}
        max={1}
        step={0.01}
        defaultValue={media.focalPointX ?? ""}
      />
      <AdminField
        name="focalPointY"
        title={label(locale, "نقطه کانونی عمودی", "Vertical focal point")}
        type="number"
        min={0}
        max={1}
        step={0.01}
        defaultValue={media.focalPointY ?? ""}
      />
      <AdminField
        name="faAltText"
        title="متن جایگزین فارسی"
        defaultValue={fa?.altText ?? ""}
        maxLength={1_000}
        required
        dir="rtl"
      />
      <AdminField
        name="enAltText"
        title="English alt text"
        defaultValue={en?.altText ?? ""}
        maxLength={1_000}
        required
        dir="ltr"
      />
      <AdminText
        name="faCaption"
        title="توضیح فارسی"
        defaultValue={fa?.caption ?? null}
        maxLength={2_000}
      />
      <AdminText
        name="enCaption"
        title="English caption"
        defaultValue={en?.caption ?? null}
        maxLength={2_000}
      />
    </AdminForm>
  );
}
