"use client";

import { saveAuthorAction, saveCategoryAction, saveTagAction } from "@/features/cms/actions";
import { saveAuthorSchema, saveCategorySchema, saveTagSchema } from "@/features/cms/schemas";
import type { Locale } from "@/i18n/routing";

import {
  AdminField,
  AdminForm,
  AdminSelect,
  AdminText,
  label,
  optionalValue,
  textValue,
} from "./admin-form";

type TaxonomyTranslation = {
  locale: string;
  name: string;
  description?: string | null;
};

type TaxonomyItem = {
  id: string;
  slug: string;
  translations: readonly TaxonomyTranslation[];
};

const translation = (item: TaxonomyItem | undefined, locale: "fa" | "en") =>
  item?.translations.find((candidate) => candidate.locale === locale);

export function AdminCategoryForm({ locale, item }: { locale: Locale; item?: TaxonomyItem }) {
  const fa = translation(item, "fa");
  const en = translation(item, "en");
  return (
    <AdminForm
      locale={locale}
      title={
        item
          ? label(
              locale,
              `ویرایش دسته «${fa?.name ?? item.slug}»`,
              `Edit “${en?.name ?? item.slug}”`,
            )
          : label(locale, "دسته‌بندی جدید", "New category")
      }
      description={label(
        locale,
        "نام فارسی و انگلیسی برای نمایش عمومی الزامی است.",
        "Persian and English names are required for public presentation.",
      )}
      action={saveCategoryAction}
      schema={saveCategorySchema}
      build={(data) => ({
        ...(item ? { id: item.id } : {}),
        slug: textValue(data, "slug"),
        translations: [
          {
            locale: "fa",
            name: textValue(data, "faName"),
            description: optionalValue(data, "faDescription"),
          },
          {
            locale: "en",
            name: textValue(data, "enName"),
            description: optionalValue(data, "enDescription"),
          },
        ],
      })}
      submit={label(
        locale,
        item ? "ذخیره دسته" : "ساخت دسته",
        item ? "Save category" : "Create category",
      )}
    >
      <AdminField
        name="slug"
        title="Slug"
        defaultValue={item?.slug ?? ""}
        maxLength={160}
        required
        wide
      />
      <AdminField
        name="faName"
        title="نام فارسی"
        defaultValue={fa?.name ?? ""}
        maxLength={180}
        required
        dir="rtl"
      />
      <AdminField
        name="enName"
        title="English name"
        defaultValue={en?.name ?? ""}
        maxLength={180}
        required
        dir="ltr"
      />
      <AdminText
        name="faDescription"
        title="توضیح فارسی"
        defaultValue={fa?.description ?? null}
        maxLength={2_000}
      />
      <AdminText
        name="enDescription"
        title="English description"
        defaultValue={en?.description ?? null}
        maxLength={2_000}
      />
    </AdminForm>
  );
}

export function AdminTagForm({ locale, item }: { locale: Locale; item?: TaxonomyItem }) {
  const fa = translation(item, "fa");
  const en = translation(item, "en");
  return (
    <AdminForm
      locale={locale}
      title={
        item
          ? label(
              locale,
              `ویرایش برچسب «${fa?.name ?? item.slug}»`,
              `Edit “${en?.name ?? item.slug}”`,
            )
          : label(locale, "برچسب جدید", "New tag")
      }
      description={label(
        locale,
        "برچسب دوزبانه و قابل استفاده در محتوا.",
        "A bilingual tag for content classification.",
      )}
      action={saveTagAction}
      schema={saveTagSchema}
      build={(data) => ({
        ...(item ? { id: item.id } : {}),
        slug: textValue(data, "slug"),
        translations: [
          { locale: "fa", name: textValue(data, "faName") },
          { locale: "en", name: textValue(data, "enName") },
        ],
      })}
      submit={label(locale, item ? "ذخیره برچسب" : "ساخت برچسب", item ? "Save tag" : "Create tag")}
    >
      <AdminField
        name="slug"
        title="Slug"
        defaultValue={item?.slug ?? ""}
        maxLength={160}
        required
        wide
      />
      <AdminField
        name="faName"
        title="نام فارسی"
        defaultValue={fa?.name ?? ""}
        maxLength={180}
        required
        dir="rtl"
      />
      <AdminField
        name="enName"
        title="English name"
        defaultValue={en?.name ?? ""}
        maxLength={180}
        required
        dir="ltr"
      />
    </AdminForm>
  );
}

type AuthorItem = {
  id: string;
  slug: string;
  avatarMediaId: string | null;
  translations: readonly { locale: string; name: string; bio: string | null }[];
};

export function AdminAuthorForm({
  locale,
  item,
  media,
}: {
  locale: Locale;
  item?: AuthorItem;
  media: readonly { id: string; key: string }[];
}) {
  const fa = item?.translations.find(({ locale: itemLocale }) => itemLocale === "fa");
  const en = item?.translations.find(({ locale: itemLocale }) => itemLocale === "en");
  return (
    <AdminForm
      locale={locale}
      title={
        item
          ? label(
              locale,
              `ویرایش نویسنده «${fa?.name ?? item.slug}»`,
              `Edit “${en?.name ?? item.slug}”`,
            )
          : label(locale, "نویسنده جدید", "New author")
      }
      description={label(
        locale,
        "هویت تحریریه‌ای دوزبانه؛ تصویر فقط از رسانه‌های اسکن‌شده انتخاب می‌شود.",
        "A bilingual editorial identity; avatars come only from scanned media.",
      )}
      action={saveAuthorAction}
      schema={saveAuthorSchema}
      build={(data) => ({
        ...(item ? { id: item.id } : {}),
        slug: textValue(data, "slug"),
        avatarMediaId: optionalValue(data, "avatarMediaId") ?? null,
        translations: [
          { locale: "fa", name: textValue(data, "faName"), bio: optionalValue(data, "faBio") },
          { locale: "en", name: textValue(data, "enName"), bio: optionalValue(data, "enBio") },
        ],
      })}
      submit={label(
        locale,
        item ? "ذخیره نویسنده" : "ساخت نویسنده",
        item ? "Save author" : "Create author",
      )}
    >
      <AdminField
        name="slug"
        title="Slug"
        defaultValue={item?.slug ?? ""}
        maxLength={160}
        required
        wide
      />
      <AdminSelect
        name="avatarMediaId"
        title={label(locale, "تصویر نویسنده", "Author image")}
        defaultValue={item?.avatarMediaId ?? ""}
        options={[
          { value: "", label: label(locale, "بدون تصویر", "No image") },
          ...media.map(({ id, key }) => ({ value: id, label: key })),
        ]}
      />
      <span aria-hidden="true" />
      <AdminField
        name="faName"
        title="نام فارسی"
        defaultValue={fa?.name ?? ""}
        maxLength={180}
        required
        dir="rtl"
      />
      <AdminField
        name="enName"
        title="English name"
        defaultValue={en?.name ?? ""}
        maxLength={180}
        required
        dir="ltr"
      />
      <AdminText
        name="faBio"
        title="زندگی‌نامه فارسی"
        defaultValue={fa?.bio ?? null}
        maxLength={10_000}
      />
      <AdminText
        name="enBio"
        title="English biography"
        defaultValue={en?.bio ?? null}
        maxLength={10_000}
      />
    </AdminForm>
  );
}
