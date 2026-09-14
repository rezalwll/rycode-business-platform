"use server";

import { revalidatePath } from "next/cache";

import { asActionResult, type ActionResult } from "@/server/services/errors";
import { requireCurrentIdentity } from "@/server/services/identity";

import {
  createContentDraft,
  publishContent,
  saveAuthor,
  saveCategory,
  saveContentTranslation,
  saveFaq,
  saveMediaMetadata,
  saveTag,
  updateContent,
} from "./service";

function refreshContent(): void {
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
  revalidatePath("/en", "layout");
  revalidatePath("/en/admin", "layout");
}

export async function createContentDraftAction(input: unknown): Promise<ActionResult<unknown>> {
  return asActionResult(async () => {
    const identity = await requireCurrentIdentity();
    const result = await createContentDraft(identity.actor, input);
    refreshContent();
    return result;
  });
}

export async function updateContentAction(input: unknown): Promise<ActionResult<unknown>> {
  return asActionResult(async () => {
    const identity = await requireCurrentIdentity();
    const result = await updateContent(identity.actor, input);
    refreshContent();
    return { ...result, updatedAt: result.updatedAt.toISOString() };
  });
}

export async function saveContentTranslationAction(input: unknown): Promise<ActionResult<unknown>> {
  return asActionResult(async () => {
    const identity = await requireCurrentIdentity();
    const result = await saveContentTranslation(identity.actor, input);
    refreshContent();
    return { ...result, updatedAt: result.updatedAt.toISOString() };
  });
}

export async function publishContentAction(input: unknown): Promise<ActionResult<unknown>> {
  return asActionResult(async () => {
    const identity = await requireCurrentIdentity();
    const result = await publishContent(identity.actor, input);
    refreshContent();
    return {
      ...result,
      scheduledAt: result.scheduledAt?.toISOString() ?? null,
      publishedAt: result.publishedAt?.toISOString() ?? null,
    };
  });
}

export async function saveCategoryAction(input: unknown): Promise<ActionResult<unknown>> {
  return asActionResult(async () => {
    const identity = await requireCurrentIdentity();
    const result = await saveCategory(identity.actor, input);
    refreshContent();
    return { ...result, updatedAt: result.updatedAt.toISOString() };
  });
}

export async function saveAuthorAction(input: unknown): Promise<ActionResult<unknown>> {
  return asActionResult(async () => {
    const identity = await requireCurrentIdentity();
    const result = await saveAuthor(identity.actor, input);
    refreshContent();
    return { ...result, updatedAt: result.updatedAt.toISOString() };
  });
}

export async function saveTagAction(input: unknown): Promise<ActionResult<unknown>> {
  return asActionResult(async () => {
    const identity = await requireCurrentIdentity();
    const result = await saveTag(identity.actor, input);
    refreshContent();
    return { ...result, updatedAt: result.updatedAt.toISOString() };
  });
}

export async function saveFaqAction(input: unknown): Promise<ActionResult<unknown>> {
  return asActionResult(async () => {
    const identity = await requireCurrentIdentity();
    const result = await saveFaq(identity.actor, input);
    refreshContent();
    return { ...result, updatedAt: result.updatedAt.toISOString() };
  });
}

export async function saveMediaMetadataAction(input: unknown): Promise<ActionResult<unknown>> {
  return asActionResult(async () => {
    const identity = await requireCurrentIdentity();
    const result = await saveMediaMetadata(identity.actor, input);
    refreshContent();
    return { ...result, updatedAt: result.updatedAt.toISOString() };
  });
}
