import "server-only";

import { Prisma, type ContentKind } from "@/generated/prisma/client";

import type { Actor } from "@/server/auth/permissions";
import { hasPermission, requirePermission } from "@/server/auth/permissions";
import { writeAudit } from "@/server/repositories/audit";
import { inTransaction, type Transaction } from "@/server/repositories/database";
import { preserveContentSlugRedirects } from "@/server/repositories/redirects";
import { ServiceError } from "@/server/services/errors";

import {
  createContentSchema,
  publishContentSchema,
  saveAuthorSchema,
  saveCategorySchema,
  saveFaqSchema,
  saveMediaMetadataSchema,
  saveTranslationSchema,
  saveTagSchema,
  updateContentSchema,
  type ContentTranslationInput,
} from "./schemas";
import { assertContentTransition, normalizeContentSlug, publicationIssues } from "./state";

function translationData(translation: ContentTranslationInput) {
  return {
    locale: translation.locale,
    title: translation.title,
    state: translation.state,
    ...(translation.summary ? { summary: translation.summary } : {}),
    ...(translation.body !== undefined
      ? { body: translation.body === null ? Prisma.JsonNull : translation.body }
      : {}),
    ...(translation.bodyText ? { bodyText: translation.bodyText } : {}),
    ...(translation.seoTitle ? { seoTitle: translation.seoTitle } : {}),
    ...(translation.seoDescription ? { seoDescription: translation.seoDescription } : {}),
    ...(translation.canonicalUrl ? { canonicalUrl: translation.canonicalUrl } : {}),
    ...(translation.ogTitle ? { ogTitle: translation.ogTitle } : {}),
    ...(translation.ogDescription ? { ogDescription: translation.ogDescription } : {}),
  };
}

async function createKindRecord(
  transaction: Transaction,
  contentId: string,
  kind: ContentKind,
): Promise<void> {
  switch (kind) {
    case "ARTICLE":
      await transaction.article.create({ data: { contentId } });
      break;
    case "SERVICE":
      await transaction.service.create({ data: { contentId } });
      break;
    case "SOLUTION":
      await transaction.solution.create({ data: { contentId } });
      break;
    case "PROBLEM":
      await transaction.problem.create({ data: { contentId } });
      break;
    case "INDUSTRY":
      await transaction.industry.create({ data: { contentId } });
      break;
    case "INTEGRATION":
      await transaction.integration.create({ data: { contentId } });
      break;
    case "CASE_STUDY":
      await transaction.caseStudy.create({ data: { contentId } });
      break;
  }
}

export async function createContentDraft(actor: Actor, rawInput: unknown) {
  requirePermission(actor, "cms.manage");
  const input = createContentSchema.parse(rawInput);
  if (input.translations.some(({ state }) => state === "APPROVED")) {
    requirePermission(actor, "cms.publish");
  }
  const slug = normalizeContentSlug(input.slug);

  return inTransaction(async (transaction) => {
    const duplicate = await transaction.contentItem.findUnique({
      where: { kind_slug: { kind: input.kind, slug } },
      select: { id: true },
    });
    if (duplicate)
      throw new ServiceError("CONFLICT", "این اسلاگ برای نوع محتوا قبلاً استفاده شده است.");

    const content = await transaction.contentItem.create({
      data: {
        kind: input.kind,
        slug,
        status: "DRAFT",
        noIndex: input.noIndex,
        position: input.position,
        createdById: actor.userId,
        updatedById: actor.userId,
        ...(input.featuredMediaId ? { featuredMediaId: input.featuredMediaId } : {}),
        translations: { create: input.translations.map(translationData) },
      },
      select: { id: true, kind: true, slug: true, status: true },
    });
    await createKindRecord(transaction, content.id, content.kind);
    await writeAudit(transaction, {
      actorUserId: actor.userId,
      action: "content.created",
      entityType: "content",
      entityId: content.id,
      after: {
        kind: content.kind,
        slug: content.slug,
        status: content.status,
        locales: input.translations.map(({ locale }) => locale),
      },
    });
    return content;
  });
}

export async function updateContent(actor: Actor, rawInput: unknown) {
  requirePermission(actor, "cms.manage");
  const input = updateContentSchema.parse(rawInput);

  return inTransaction(async (transaction) => {
    const current = await transaction.contentItem.findUnique({
      where: { id: input.contentId },
      select: {
        id: true,
        kind: true,
        slug: true,
        status: true,
        noIndex: true,
        position: true,
        featuredMediaId: true,
      },
    });
    if (!current) throw new ServiceError("NOT_FOUND");
    if (input.status) assertContentTransition(current.status, input.status);
    if (
      ["PUBLISHED", "SCHEDULED"].includes(current.status) &&
      !hasPermission(actor, "cms.publish")
    ) {
      throw new ServiceError("FORBIDDEN");
    }

    const slug = input.slug ? normalizeContentSlug(input.slug) : current.slug;
    if (slug !== current.slug) {
      const duplicate = await transaction.contentItem.findUnique({
        where: { kind_slug: { kind: current.kind, slug } },
        select: { id: true },
      });
      if (duplicate && duplicate.id !== current.id) {
        throw new ServiceError("CONFLICT", "این اسلاگ برای نوع محتوا قبلاً استفاده شده است.");
      }
      await preserveContentSlugRedirects(transaction, {
        kind: current.kind,
        oldSlug: current.slug,
        newSlug: slug,
      });
    }

    const status = input.status ?? current.status;
    const updated = await transaction.contentItem.update({
      where: { id: current.id },
      data: {
        slug,
        updatedById: actor.userId,
        ...(input.status !== undefined ? { status: input.status } : {}),
        ...(input.noIndex !== undefined ? { noIndex: input.noIndex } : {}),
        ...(input.position !== undefined ? { position: input.position } : {}),
        ...(input.featuredMediaId !== undefined ? { featuredMediaId: input.featuredMediaId } : {}),
        ...(input.categoryIds !== undefined
          ? {
              categories: {
                deleteMany: {},
                create: input.categoryIds.map((categoryId, position) => ({ categoryId, position })),
              },
            }
          : {}),
        ...(input.tagIds !== undefined
          ? {
              tags: {
                deleteMany: {},
                create: input.tagIds.map((tagId) => ({ tagId })),
              },
            }
          : {}),
        ...(input.authorIds !== undefined
          ? {
              authors: {
                deleteMany: {},
                create: input.authorIds.map((authorId, position) => ({ authorId, position })),
              },
            }
          : {}),
        ...(input.faqIds !== undefined
          ? {
              faqs: {
                deleteMany: {},
                create: input.faqIds.map((faqId, position) => ({ faqId, position })),
              },
            }
          : {}),
        ...(status === "ARCHIVED"
          ? { archivedAt: new Date() }
          : current.status === "ARCHIVED"
            ? { archivedAt: null }
            : {}),
        ...(status === "DRAFT" && ["PUBLISHED", "SCHEDULED"].includes(current.status)
          ? { publishedAt: null, scheduledAt: null }
          : {}),
      },
      select: { id: true, kind: true, slug: true, status: true, updatedAt: true },
    });
    await writeAudit(transaction, {
      actorUserId: actor.userId,
      action: "content.updated",
      entityType: "content",
      entityId: current.id,
      before: {
        slug: current.slug,
        status: current.status,
        noIndex: current.noIndex,
        position: current.position,
        featuredMediaId: current.featuredMediaId,
      },
      after: { slug: updated.slug, status: updated.status },
    });
    return updated;
  });
}

export async function saveContentTranslation(actor: Actor, rawInput: unknown) {
  requirePermission(actor, "cms.manage");
  const input = saveTranslationSchema.parse(rawInput);
  if (input.state === "APPROVED") requirePermission(actor, "cms.publish");

  return inTransaction(async (transaction) => {
    const content = await transaction.contentItem.findUnique({
      where: { id: input.contentId },
      select: { id: true, status: true },
    });
    if (!content) throw new ServiceError("NOT_FOUND");
    if (["PUBLISHED", "SCHEDULED"].includes(content.status)) {
      requirePermission(actor, "cms.publish");
      if (input.state !== "APPROVED") {
        throw new ServiceError(
          "INVALID_STATE",
          "ترجمهٔ محتوای منتشرشده باید در وضعیت تأییدشده باقی بماند.",
        );
      }
    }

    const previous = await transaction.contentTranslation.findUnique({
      where: { contentId_locale: { contentId: content.id, locale: input.locale } },
      select: { title: true, state: true },
    });
    const data = translationData(input);
    const translation = await transaction.contentTranslation.upsert({
      where: { contentId_locale: { contentId: content.id, locale: input.locale } },
      create: { contentId: content.id, ...data },
      update: {
        title: data.title,
        state: data.state,
        summary: input.summary ?? null,
        ...(input.body !== undefined
          ? { body: input.body === null ? Prisma.JsonNull : input.body }
          : {}),
        bodyText: input.bodyText ?? null,
        seoTitle: input.seoTitle ?? null,
        seoDescription: input.seoDescription ?? null,
        canonicalUrl: input.canonicalUrl ?? null,
        ogTitle: input.ogTitle ?? null,
        ogDescription: input.ogDescription ?? null,
      },
      select: { contentId: true, locale: true, title: true, state: true, updatedAt: true },
    });
    await transaction.contentItem.update({
      where: { id: content.id },
      data: { updatedById: actor.userId },
    });
    await writeAudit(transaction, {
      actorUserId: actor.userId,
      action: "content.translation_saved",
      entityType: "content",
      entityId: content.id,
      before: previous
        ? { locale: input.locale, title: previous.title, state: previous.state }
        : {},
      after: { locale: input.locale, title: translation.title, state: translation.state },
    });
    return translation;
  });
}

export async function publishContent(actor: Actor, rawInput: unknown) {
  requirePermission(actor, "cms.publish");
  const input = publishContentSchema.parse(rawInput);

  return inTransaction(async (transaction) => {
    const content = await transaction.contentItem.findUnique({
      where: { id: input.contentId },
      include: { translations: true },
    });
    if (!content) throw new ServiceError("NOT_FOUND");
    if (content.status === "PUBLISHED" && !input.publishAt) {
      return {
        id: content.id,
        slug: content.slug,
        kind: content.kind,
        status: content.status,
        scheduledAt: content.scheduledAt,
        publishedAt: content.publishedAt,
      };
    }
    if (!content.featuredMediaId && ["ARTICLE", "CASE_STUDY"].includes(content.kind)) {
      throw new ServiceError(
        "INVALID_STATE",
        "مقاله و مطالعه موردی برای انتشار به تصویر شاخص نیاز دارند.",
      );
    }
    const issues = publicationIssues(content.kind, content.translations);
    if (issues.length > 0) {
      throw new ServiceError("INVALID_STATE", `محتوا هنوز آماده انتشار نیست: ${issues.join(", ")}`);
    }
    if (!(["REVIEW", "SCHEDULED"] as const).some((status) => status === content.status)) {
      throw new ServiceError("INVALID_STATE", "محتوا باید پیش از انتشار در وضعیت بازبینی باشد.");
    }

    const now = new Date();
    const scheduled = Boolean(input.publishAt && input.publishAt > now);
    const status = scheduled ? "SCHEDULED" : "PUBLISHED";
    assertContentTransition(content.status, status);
    const updated = await transaction.contentItem.update({
      where: { id: content.id },
      data: {
        status,
        updatedById: actor.userId,
        archivedAt: null,
        scheduledAt: scheduled ? (input.publishAt ?? null) : null,
        publishedAt: scheduled ? null : now,
      },
      select: {
        id: true,
        slug: true,
        kind: true,
        status: true,
        scheduledAt: true,
        publishedAt: true,
      },
    });
    await writeAudit(transaction, {
      actorUserId: actor.userId,
      action: scheduled ? "content.scheduled" : "content.published",
      entityType: "content",
      entityId: content.id,
      before: { status: content.status },
      after: {
        status: updated.status,
        scheduledAt: updated.scheduledAt?.toISOString() ?? null,
        publishedAt: updated.publishedAt?.toISOString() ?? null,
      },
    });
    return updated;
  });
}

function normalizeTaxonomySlug(rawSlug: string): string {
  const slug = normalizeContentSlug(rawSlug);
  if (slug.length > 160) {
    throw new ServiceError("INVALID_INPUT", "اسلاگ دسته‌بندی یا برچسب بیش از حد طولانی است.");
  }
  return slug;
}

export async function saveCategory(actor: Actor, rawInput: unknown) {
  requirePermission(actor, "cms.manage");
  const input = saveCategorySchema.parse(rawInput);
  const slug = normalizeTaxonomySlug(input.slug);
  const translations = input.translations.map((translation) => ({
    locale: translation.locale,
    name: translation.name,
    description: translation.description ?? null,
  }));

  return inTransaction(async (transaction) => {
    const previous = input.id
      ? await transaction.category.findUnique({ where: { id: input.id }, select: { slug: true } })
      : null;
    if (input.id && !previous) throw new ServiceError("NOT_FOUND");

    const category = input.id
      ? await transaction.category.update({
          where: { id: input.id },
          data: {
            slug,
            translations: {
              upsert: translations.map((translation) => ({
                where: { categoryId_locale: { categoryId: input.id!, locale: translation.locale } },
                create: translation,
                update: { name: translation.name, description: translation.description ?? null },
              })),
            },
          },
          select: { id: true, slug: true, updatedAt: true },
        })
      : await transaction.category.create({
          data: { slug, translations: { create: translations } },
          select: { id: true, slug: true, updatedAt: true },
        });
    await writeAudit(transaction, {
      actorUserId: actor.userId,
      action: previous ? "category.updated" : "category.created",
      entityType: "category",
      entityId: category.id,
      before: previous ? { slug: previous.slug } : {},
      after: { slug: category.slug },
    });
    return category;
  });
}

export async function saveAuthor(actor: Actor, rawInput: unknown) {
  requirePermission(actor, "cms.manage");
  const input = saveAuthorSchema.parse(rawInput);
  const slug = normalizeTaxonomySlug(input.slug);
  const translations = input.translations.map((translation) => ({
    locale: translation.locale,
    name: translation.name,
    bio: translation.bio ?? null,
  }));

  return inTransaction(async (transaction) => {
    const previous = input.id
      ? await transaction.author.findUnique({ where: { id: input.id }, select: { slug: true } })
      : null;
    if (input.id && !previous) throw new ServiceError("NOT_FOUND");

    const author = input.id
      ? await transaction.author.update({
          where: { id: input.id },
          data: {
            slug,
            ...(input.avatarMediaId !== undefined ? { avatarMediaId: input.avatarMediaId } : {}),
            translations: {
              upsert: translations.map((translation) => ({
                where: { authorId_locale: { authorId: input.id!, locale: translation.locale } },
                create: translation,
                update: { name: translation.name, bio: translation.bio },
              })),
            },
          },
          select: { id: true, slug: true, updatedAt: true },
        })
      : await transaction.author.create({
          data: {
            slug,
            ...(input.avatarMediaId ? { avatarMediaId: input.avatarMediaId } : {}),
            translations: { create: translations },
          },
          select: { id: true, slug: true, updatedAt: true },
        });
    await writeAudit(transaction, {
      actorUserId: actor.userId,
      action: previous ? "author.updated" : "author.created",
      entityType: "author",
      entityId: author.id,
      before: previous ? { slug: previous.slug } : {},
      after: { slug: author.slug },
    });
    return author;
  });
}

export async function saveTag(actor: Actor, rawInput: unknown) {
  requirePermission(actor, "cms.manage");
  const input = saveTagSchema.parse(rawInput);
  const slug = normalizeTaxonomySlug(input.slug);

  return inTransaction(async (transaction) => {
    const previous = input.id
      ? await transaction.tag.findUnique({ where: { id: input.id }, select: { slug: true } })
      : null;
    if (input.id && !previous) throw new ServiceError("NOT_FOUND");

    const tag = input.id
      ? await transaction.tag.update({
          where: { id: input.id },
          data: {
            slug,
            translations: {
              upsert: input.translations.map((translation) => ({
                where: { tagId_locale: { tagId: input.id!, locale: translation.locale } },
                create: translation,
                update: { name: translation.name },
              })),
            },
          },
          select: { id: true, slug: true, updatedAt: true },
        })
      : await transaction.tag.create({
          data: { slug, translations: { create: input.translations } },
          select: { id: true, slug: true, updatedAt: true },
        });
    await writeAudit(transaction, {
      actorUserId: actor.userId,
      action: previous ? "tag.updated" : "tag.created",
      entityType: "tag",
      entityId: tag.id,
      before: previous ? { slug: previous.slug } : {},
      after: { slug: tag.slug },
    });
    return tag;
  });
}

export async function saveFaq(actor: Actor, rawInput: unknown) {
  requirePermission(actor, "cms.manage");
  const input = saveFaqSchema.parse(rawInput);
  if (input.status === "PUBLISHED") requirePermission(actor, "cms.publish");

  return inTransaction(async (transaction) => {
    const previous = input.id
      ? await transaction.faq.findUnique({ where: { id: input.id }, select: { status: true } })
      : null;
    if (input.id && !previous) throw new ServiceError("NOT_FOUND");
    if (previous?.status === "PUBLISHED") requirePermission(actor, "cms.publish");

    const translations = input.translations.map(({ locale, question, answer }) => ({
      locale,
      question,
      answer,
    }));
    const faq = input.id
      ? await transaction.faq.update({
          where: { id: input.id },
          data: {
            status: input.status,
            translations: {
              upsert: translations.map((translation) => ({
                where: { faqId_locale: { faqId: input.id!, locale: translation.locale } },
                create: translation,
                update: { question: translation.question, answer: translation.answer },
              })),
            },
          },
          select: { id: true, status: true, updatedAt: true },
        })
      : await transaction.faq.create({
          data: { status: input.status, translations: { create: translations } },
          select: { id: true, status: true, updatedAt: true },
        });
    await writeAudit(transaction, {
      actorUserId: actor.userId,
      action: previous ? "faq.updated" : "faq.created",
      entityType: "faq",
      entityId: faq.id,
      before: previous ? { status: previous.status } : {},
      after: { status: faq.status },
    });
    return faq;
  });
}

export async function saveMediaMetadata(actor: Actor, rawInput: unknown) {
  requirePermission(actor, "cms.manage");
  const input = saveMediaMetadataSchema.parse(rawInput);

  return inTransaction(async (transaction) => {
    const previous = await transaction.media.findUnique({
      where: { id: input.mediaId },
      select: {
        key: true,
        focalPointX: true,
        focalPointY: true,
        translations: { select: { locale: true, altText: true, caption: true } },
      },
    });
    if (!previous) throw new ServiceError("NOT_FOUND");
    const media = await transaction.media.update({
      where: { id: input.mediaId },
      data: {
        focalPointX: input.focalPointX,
        focalPointY: input.focalPointY,
        translations: {
          upsert: input.translations.map((translation) => ({
            where: { mediaId_locale: { mediaId: input.mediaId, locale: translation.locale } },
            create: {
              locale: translation.locale,
              altText: translation.altText,
              caption: translation.caption ?? null,
            },
            update: { altText: translation.altText, caption: translation.caption ?? null },
          })),
        },
      },
      select: { id: true, key: true, updatedAt: true },
    });
    await writeAudit(transaction, {
      actorUserId: actor.userId,
      action: "media.metadata_updated",
      entityType: "media",
      entityId: media.id,
      before: {
        key: previous.key,
        focalPointX: previous.focalPointX?.toString() ?? null,
        focalPointY: previous.focalPointY?.toString() ?? null,
        translations: previous.translations,
      },
      after: {
        key: media.key,
        focalPointX: input.focalPointX,
        focalPointY: input.focalPointY,
        translations: input.translations,
      },
    });
    return media;
  });
}
