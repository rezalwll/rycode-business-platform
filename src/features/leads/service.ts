import "server-only";

import { randomUUID } from "node:crypto";

import { getLeadRepository, type NewLeadRecord } from "./repository";
import type { LeadRequest } from "./schema";

export type AcceptLeadResult =
  { status: "created"; id: string } | { status: "unavailable" } | { status: "failed" };

export async function acceptLead(input: LeadRequest): Promise<AcceptLeadResult> {
  const repository = getLeadRepository();
  if (!repository) return { status: "unavailable" };

  const record: NewLeadRecord = {
    id: randomUUID(),
    kind: input.kind,
    fullName: input.fullName,
    message: input.message,
    locale: input.locale,
    sourcePath: input.sourcePath,
    submittedAt: new Date(),
    ...(input.email ? { email: input.email } : {}),
    ...(input.phone ? { phone: input.phone } : {}),
    ...(input.company ? { company: input.company } : {}),
    ...(input.websiteUrl ? { websiteUrl: input.websiteUrl } : {}),
    ...(input.projectType ? { projectType: input.projectType } : {}),
    ...(input.budget ? { budget: input.budget } : {}),
    ...(input.timeline ? { timeline: input.timeline } : {}),
    ...(input.analyticsAnonymousId ? { analyticsAnonymousId: input.analyticsAnonymousId } : {}),
    ...(input.analyticsSessionKey ? { analyticsSessionKey: input.analyticsSessionKey } : {}),
  };

  try {
    const created = await repository.create(record);
    return { status: "created", id: created.id };
  } catch (error) {
    console.error("Lead persistence failed", {
      cause: error instanceof Error ? error.name : "UnknownError",
      leadId: record.id,
    });
    return { status: "failed" };
  }
}
