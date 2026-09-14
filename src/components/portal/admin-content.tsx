"use client";

import {
  createContentDraftAction,
  saveContentTranslationAction,
  updateContentAction,
  publishContentAction,
} from "@/features/cms/actions";
import {
  createContentSchema,
  saveTranslationSchema,
  updateContentSchema,
  publishContentSchema,
  contentKinds,
} from "@/features/cms/schemas";
import type { Locale } from "@/i18n/routing";

import {
  AdminCheck,
  AdminField,
  AdminForm,
  AdminSelect,
  AdminText,
  label,
  optionalValue,
  statusOptions,
  textValue,
} from "./admin-form";
import { AdminRichText } from "./admin-rich-text";

type MediaOption = { id: string; key: string };
type TaxonomyOption = {
  id: string;
  slug: string;
  translations: readonly { locale: string; name: string }[];
};
type FaqOption = {
  id: string;
  status: string;
  translations: readonly { locale: string; question: string }[];
};
type Translation = {
  locale: string;
  title: string;
  summary: string | null;
  body: unknown;
  bodyText: string | null;
  state: string;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
};

function structuredBody(data: FormData): unknown {
  const rawBody = textValue(data, "body");
  if (!rawBody) return undefined;
  try {
    const parsedBody: unknown = JSON.parse(rawBody);
    return parsedBody;
  } catch {
    return undefined;
  }
}

function AdminTaxonomyChoices({
  locale,
  name,
  title,
  options,
  selectedIds,
}: {
  locale: Locale;
  name: "categoryIds" | "tagIds" | "authorIds";
  title: string;
  options: readonly TaxonomyOption[];
  selectedIds: ReadonlySet<string>;
}) {
  return (
    <fieldset className="sm:col-span-2">
      <legend className="text-xs font-semibold">{title}</legend>
      {options.length ? (
        <div className="mt-2 grid gap-2 rounded-[5px] border border-input p-3 sm:grid-cols-2">
          {options.map((option) => (
            <label key={option.id} className="flex min-h-9 items-center gap-2 text-sm">
              <input
                type="checkbox"
                name={name}
                value={option.id}
                defaultChecked={selectedIds.has(option.id)}
                className="size-4 accent-[var(--brand)]"
              />
              <span>
                {option.translations.find((item) => item.locale === locale)?.name ?? option.slug}
              </span>
            </label>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-xs text-muted-foreground">
          {label(locale, "هنوز گزینه‌ای ساخته نشده است.", "No options have been created yet.")}
        </p>
      )}
    </fieldset>
  );
}

function AdminFaqChoices({
  locale,
  options,
  selectedIds,
}: {
  locale: Locale;
  options: readonly FaqOption[];
  selectedIds: ReadonlySet<string>;
}) {
  return (
    <fieldset className="sm:col-span-2">
      <legend className="text-xs font-semibold">
        {label(locale, "پرسش‌های مرتبط", "Related FAQs")}
      </legend>
      {options.length ? (
        <div className="mt-2 grid gap-2 rounded-[5px] border border-input p-3 sm:grid-cols-2">
          {options.map((option) => (
            <label key={option.id} className="flex min-h-9 items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="faqIds"
                value={option.id}
                defaultChecked={selectedIds.has(option.id)}
                className="size-4 accent-[var(--brand)]"
              />
              <span>
                {option.translations.find((item) => item.locale === locale)?.question ?? option.id}
                <small className="ms-2 text-muted-foreground">({option.status})</small>
              </span>
            </label>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-xs text-muted-foreground">
          {label(locale, "هنوز پرسشی ساخته نشده است.", "No FAQs have been created yet.")}
        </p>
      )}
    </fieldset>
  );
}

export function AdminCreateContent({ locale }: { locale: Locale }) {
  return (
    <div className="mt-8">
      <AdminForm
        locale={locale}
        title={label(locale, "پیش‌نویس جدید", "New content draft")}
        description={label(
          locale,
          "ابتدا پیش‌نویس بسازید؛ سپس هر دو ترجمه را کامل کنید و برای بازبینی بفرستید.",
          "Create a draft, complete both translations, then submit it for review.",
        )}
        action={createContentDraftAction}
        schema={createContentSchema}
        submit={label(locale, "ساخت پیش‌نویس", "Create draft")}
        build={(data) => ({
          kind: textValue(data, "kind"),
          slug: textValue(data, "slug"),
          noIndex: data.has("noIndex"),
          translations: [
            {
              locale: textValue(data, "locale"),
              title: textValue(data, "title"),
              summary: optionalValue(data, "summary"),
              body: structuredBody(data),
              bodyText: optionalValue(data, "bodyText"),
              state: "DRAFT",
            },
          ],
        })}
      >
        <AdminSelect
          name="kind"
          title={label(locale, "نوع محتوا", "Content type")}
          options={statusOptions(contentKinds)}
          defaultValue="ARTICLE"
        />
        <AdminField
          name="slug"
          title={label(locale, "نام مسیر (Slug)", "URL slug")}
          maxLength={200}
          required
          dir="auto"
        />
        <AdminSelect
          name="locale"
          title={label(locale, "زبان پیش‌نویس", "Draft language")}
          options={[
            { value: "fa", label: "فارسی" },
            { value: "en", label: "English" },
          ]}
          defaultValue={locale}
        />
        <AdminField name="title" title={label(locale, "عنوان", "Title")} maxLength={240} required />
        <AdminText name="summary" title={label(locale, "خلاصه", "Summary")} maxLength={2_000} />
        <AdminRichText locale={locale} title={label(locale, "متن محتوا", "Content body")} />
        <AdminCheck
          name="noIndex"
          title={label(
            locale,
            "عدم نمایش در موتورهای جست‌وجو",
            "Exclude from search engine indexing",
          )}
        />
      </AdminForm>
    </div>
  );
}

export function AdminContentOperations({
  locale,
  content,
  media,
  categories,
  tags,
  authors,
  faqs,
  canManage,
  canPublish,
}: {
  locale: Locale;
  content: {
    id: string;
    slug: string;
    kind: string;
    status: string;
    noIndex: boolean;
    position: number;
    featuredMediaId: string | null;
    categories: readonly { categoryId: string }[];
    tags: readonly { tagId: string }[];
    authors: readonly { authorId: string }[];
    faqs: readonly { faqId: string }[];
    translations: readonly Translation[];
  };
  media: readonly MediaOption[];
  categories: readonly TaxonomyOption[];
  tags: readonly TaxonomyOption[];
  authors: readonly TaxonomyOption[];
  faqs: readonly FaqOption[];
  canManage: boolean;
  canPublish: boolean;
}) {
  const editable =
    canManage && (canPublish || !["PUBLISHED", "SCHEDULED"].includes(content.status));
  return (
    <div className="mt-8 space-y-4">
      {editable && (
        <>
          <AdminForm
            locale={locale}
            title={label(locale, "مشخصات و وضعیت محتوا", "Content settings and workflow")}
            description={label(
              locale,
              "تغییر مسیر، ترجمه‌ها را حفظ می‌کند و برای نشانی قبلی تغییرمسیر ایجاد می‌شود.",
              "Changing the slug preserves translations and creates redirects from the previous URL.",
            )}
            action={updateContentAction}
            schema={updateContentSchema}
            build={(data) => ({
              contentId: content.id,
              slug: textValue(data, "slug"),
              noIndex: data.has("noIndex"),
              position: Number(textValue(data, "position")),
              featuredMediaId: optionalValue(data, "featuredMediaId") ?? null,
              categoryIds: data.getAll("categoryIds").map(String),
              tagIds: data.getAll("tagIds").map(String),
              authorIds: data.getAll("authorIds").map(String),
              faqIds: data.getAll("faqIds").map(String),
              ...(optionalValue(data, "status") ? { status: textValue(data, "status") } : {}),
            })}
          >
            <AdminField
              name="slug"
              title={label(locale, "نام مسیر", "URL slug")}
              defaultValue={content.slug}
              maxLength={200}
              required
            />
            <AdminSelect
              name="status"
              title={label(locale, "وضعیت گردش کار", "Workflow status")}
              options={[
                {
                  value: "",
                  label: `${label(locale, "حفظ وضعیت فعلی", "Keep current status")} (${content.status})`,
                },
                ...statusOptions(["DRAFT", "REVIEW", "ARCHIVED"]),
              ]}
            />
            <AdminField
              name="position"
              title={label(locale, "ترتیب نمایش", "Display position")}
              type="number"
              step={1}
              min={-100_000}
              max={100_000}
              defaultValue={content.position}
              required
            />
            <AdminSelect
              name="featuredMediaId"
              title={label(locale, "تصویر شاخص", "Featured image")}
              defaultValue={content.featuredMediaId ?? ""}
              options={[
                { value: "", label: label(locale, "بدون تصویر", "No image") },
                ...media.map((item) => ({ value: item.id, label: item.key })),
              ]}
            />
            <AdminCheck
              name="noIndex"
              title={label(
                locale,
                "عدم نمایش در موتورهای جست‌وجو",
                "Exclude from search engine indexing",
              )}
              defaultChecked={content.noIndex}
            />
            <AdminTaxonomyChoices
              locale={locale}
              name="categoryIds"
              title={label(locale, "دسته‌بندی‌ها", "Categories")}
              options={categories}
              selectedIds={new Set(content.categories.map(({ categoryId }) => categoryId))}
            />
            <AdminTaxonomyChoices
              locale={locale}
              name="tagIds"
              title={label(locale, "برچسب‌ها", "Tags")}
              options={tags}
              selectedIds={new Set(content.tags.map(({ tagId }) => tagId))}
            />
            <AdminTaxonomyChoices
              locale={locale}
              name="authorIds"
              title={label(locale, "نویسندگان", "Authors")}
              options={authors}
              selectedIds={new Set(content.authors.map(({ authorId }) => authorId))}
            />
            <AdminFaqChoices
              locale={locale}
              options={faqs}
              selectedIds={new Set(content.faqs.map(({ faqId }) => faqId))}
            />
          </AdminForm>
          <div className="grid items-start gap-4 xl:grid-cols-2">
            {(["fa", "en"] as const).map((translationLocale) => {
              const translation = content.translations.find(
                (item) => item.locale === translationLocale,
              );
              return (
                <AdminForm
                  key={`${content.id}:${translationLocale}:${translation?.state ?? "new"}`}
                  locale={locale}
                  title={translationLocale === "fa" ? "نسخه فارسی" : "English version"}
                  description={label(
                    locale,
                    "عنوان، خلاصه و متن را کامل کنید. تأیید ترجمه به مجوز انتشار نیاز دارد.",
                    "Complete the title, summary and body. Approving a translation requires publishing permission.",
                  )}
                  action={saveContentTranslationAction}
                  schema={saveTranslationSchema}
                  build={(data) => ({
                    contentId: content.id,
                    locale: translationLocale,
                    title: textValue(data, "title"),
                    summary: optionalValue(data, "summary"),
                    body: structuredBody(data),
                    bodyText: optionalValue(data, "bodyText"),
                    state: textValue(data, "state"),
                    seoTitle: optionalValue(data, "seoTitle"),
                    seoDescription: optionalValue(data, "seoDescription"),
                    canonicalUrl: optionalValue(data, "canonicalUrl"),
                    ogTitle: optionalValue(data, "ogTitle"),
                    ogDescription: optionalValue(data, "ogDescription"),
                  })}
                >
                  <AdminField
                    name="title"
                    title={label(locale, "عنوان", "Title")}
                    required
                    maxLength={240}
                    defaultValue={translation?.title ?? ""}
                    dir={translationLocale === "fa" ? "rtl" : "ltr"}
                    wide
                  />
                  <AdminSelect
                    name="state"
                    title={label(locale, "وضعیت ترجمه", "Translation status")}
                    defaultValue={translation?.state ?? "DRAFT"}
                    options={statusOptions(
                      canPublish ? ["DRAFT", "REVIEWED", "APPROVED"] : ["DRAFT", "REVIEWED"],
                    )}
                  />
                  <AdminText
                    name="summary"
                    title={label(locale, "خلاصه", "Summary")}
                    defaultValue={translation?.summary ?? ""}
                    maxLength={2_000}
                    required
                  />
                  <AdminRichText
                    locale={locale}
                    title={label(locale, "متن محتوا", "Content body")}
                    defaultDocument={translation?.body}
                    defaultText={translation?.bodyText ?? null}
                  />
                  <AdminField
                    name="seoTitle"
                    title={label(locale, "عنوان موتور جست‌وجو", "SEO title")}
                    defaultValue={translation?.seoTitle ?? ""}
                    maxLength={240}
                    wide
                  />
                  <AdminText
                    name="seoDescription"
                    title={label(locale, "توضیح موتور جست‌وجو", "SEO description")}
                    defaultValue={translation?.seoDescription ?? ""}
                    maxLength={1_000}
                  />
                  <AdminField
                    name="canonicalUrl"
                    title={label(locale, "نشانی اصلی (اختیاری)", "Canonical URL (optional)")}
                    defaultValue={translation?.canonicalUrl ?? ""}
                    type="url"
                    maxLength={2_000}
                    dir="ltr"
                    wide
                  />
                  <AdminField
                    name="ogTitle"
                    title={label(locale, "عنوان اشتراک‌گذاری", "Social sharing title")}
                    defaultValue={translation?.ogTitle ?? ""}
                    maxLength={240}
                    wide
                  />
                  <AdminText
                    name="ogDescription"
                    title={label(locale, "توضیح اشتراک‌گذاری", "Social sharing description")}
                    defaultValue={translation?.ogDescription ?? ""}
                    maxLength={1_000}
                  />
                </AdminForm>
              );
            })}
          </div>
        </>
      )}
      {canPublish && ["REVIEW", "SCHEDULED"].includes(content.status) && (
        <AdminForm
          locale={locale}
          title={label(locale, "انتشار محتوا", "Publish content")}
          description={label(
            locale,
            "هر دو ترجمه باید تأیید شده و دارای خلاصه باشند. مقاله و مطالعه موردی به تصویر شاخص نیز نیاز دارند.",
            "Both translations must be approved and have summaries. Articles and case studies also require a featured image.",
          )}
          action={publishContentAction}
          schema={publishContentSchema}
          build={(data) => ({ contentId: content.id, publishAt: optionalValue(data, "publishAt") })}
          submit={label(locale, "انتشار / زمان‌بندی", "Publish / schedule")}
        >
          <AdminField
            name="publishAt"
            title={label(
              locale,
              "زمان انتشار (خالی = همین حالا)",
              "Publish at (leave blank for now)",
            )}
            type="datetime-local"
          />
        </AdminForm>
      )}
      {!editable && (
        <p className="rounded-[5px] border border-border p-4 text-sm leading-7 text-muted-foreground">
          {label(
            locale,
            "ویرایش این محتوا به مجوز مدیریت و در وضعیت منتشرشده به مجوز انتشار نیاز دارد.",
            "Editing requires content management permission and, for published content, publishing permission.",
          )}
        </p>
      )}
    </div>
  );
}
