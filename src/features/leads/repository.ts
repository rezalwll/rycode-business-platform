import "server-only";

import type { LeadKind } from "./schema";

export type NewLeadRecord = {
  id: string;
  kind: LeadKind;
  fullName: string;
  email?: string;
  phone?: string;
  company?: string;
  websiteUrl?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  message: string;
  locale: "fa" | "en";
  sourcePath: string;
  submittedAt: Date;
  analyticsAnonymousId?: string;
  analyticsSessionKey?: string;
};

export interface LeadRepository {
  create(input: NewLeadRecord): Promise<{ id: string }>;
}

const repositoryKey = Symbol.for("rycode.leadRepository");
type Registry = typeof globalThis & { [repositoryKey]?: LeadRepository };

const leadType = {
  project: "QUOTE",
  technical_review: "AUDIT",
  seo_audit: "AUDIT",
  contact: "CONTACT",
} as const;

const prismaLeadRepository: LeadRepository = {
  async create(input) {
    // Keep database initialization out of the render path. If configuration or
    // PostgreSQL is unavailable, the service catches the failure and tells the
    // visitor that nothing was recorded.
    const { db } = await import("@/db/client");
    const { hashAnalyticsIdentifier } = await import("@/server/analytics/hash");
    const { env } = await import("@/server/env");
    const analyticsSession =
      input.analyticsAnonymousId && input.analyticsSessionKey
        ? await db.analyticsSession.findFirst({
            where: {
              sessionKeyHash: hashAnalyticsIdentifier(
                env.BETTER_AUTH_SECRET,
                "session",
                input.analyticsSessionKey,
              ),
              anonymousIdHash: hashAnalyticsIdentifier(
                env.BETTER_AUTH_SECRET,
                "anonymous",
                input.analyticsAnonymousId,
              ),
              consent: "GRANTED",
            },
            select: { id: true },
          })
        : null;
    const lead = await db.lead.create({
      data: {
        id: input.id,
        type: leadType[input.kind],
        status: "NEW",
        name: input.fullName,
        source: "website",
        landingPath: input.sourcePath,
        summary: input.message,
        createdAt: input.submittedAt,
        ...(analyticsSession ? { analyticsSessionId: analyticsSession.id } : {}),
        ...(input.company ? { company: input.company } : {}),
        ...(input.email ? { email: input.email } : {}),
        ...(input.phone ? { phone: input.phone } : {}),
        ...(input.projectType ? { service: input.projectType } : {}),
        ...(input.budget ? { budget: input.budget } : {}),
        formPayload: {
          locale: input.locale,
          leadKind: input.kind,
          websiteUrl: input.websiteUrl ?? null,
          timeline: input.timeline ?? null,
        },
        activities: {
          create: {
            type: "CREATED",
            metadata: {
              source: "public_form",
              attributedAnalyticsSession: Boolean(analyticsSession),
            },
          },
        },
      },
      select: { id: true },
    });
    return lead;
  },
};

/**
 * Infrastructure registers the concrete Prisma adapter during server startup.
 * Keeping the public action behind this port makes a missing database fail closed
 * instead of pretending that a request was saved.
 */
export function registerLeadRepository(repository: LeadRepository): void {
  (globalThis as Registry)[repositoryKey] = repository;
}

export function getLeadRepository(): LeadRepository | undefined {
  return (globalThis as Registry)[repositoryKey] ?? prismaLeadRepository;
}
