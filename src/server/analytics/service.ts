import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/db/client";
import { hashAnalyticsIdentifier } from "@/server/analytics/hash";
import {
  sanitizeAnalyticsMetadata,
  sanitizeReferrer,
  type AnalyticsEventInput,
} from "@/server/analytics/validation";
import { env } from "@/server/env";

const eventNameMap = {
  page_view: "PAGE_VIEW",
  cta_click: "CTA_CLICK",
  form_started: "FORM_STARTED",
  form_submitted: "FORM_SUBMITTED",
  search: "SEARCH",
  download: "DOWNLOAD",
  login: "LOGIN",
} as const;

const pageTypeMap = {
  marketing: "MARKETING",
  article: "ARTICLE",
  service: "SERVICE",
  portal: "PORTAL",
  admin: "ADMIN",
  other: "OTHER",
} as const;

function optionalFields(input: AnalyticsEventInput): Partial<Prisma.AnalyticsSessionCreateInput> {
  const referrer = sanitizeReferrer(input.referrer);
  return {
    ...(input.locale ? { locale: input.locale } : {}),
    ...(referrer ? { referrer } : {}),
    ...(input.utmSource ? { utmSource: input.utmSource } : {}),
    ...(input.utmMedium ? { utmMedium: input.utmMedium } : {}),
    ...(input.utmCampaign ? { utmCampaign: input.utmCampaign } : {}),
  };
}

export async function recordAnalyticsEvent(
  input: AnalyticsEventInput,
  context: { userId?: string; userAgent?: string },
): Promise<{ recorded: boolean }> {
  if (input.consent !== "granted") return { recorded: false };

  const metadata = sanitizeAnalyticsMetadata(input.metadata);
  const sessionKeyHash = hashAnalyticsIdentifier(
    env.BETTER_AUTH_SECRET,
    "session",
    input.sessionKey,
  );
  const anonymousIdHash = hashAnalyticsIdentifier(
    env.BETTER_AUTH_SECRET,
    "anonymous",
    input.anonymousId,
  );
  const userAgentHash = context.userAgent
    ? hashAnalyticsIdentifier(
        env.BETTER_AUTH_SECRET,
        "user-agent",
        context.userAgent.slice(0, 1024),
      )
    : undefined;
  const now = new Date();

  const session = await db.analyticsSession.upsert({
    where: { sessionKeyHash },
    create: {
      sessionKeyHash,
      anonymousIdHash,
      consent: "GRANTED",
      landingPath: input.path,
      ...optionalFields(input),
      ...(context.userId ? { user: { connect: { id: context.userId } } } : {}),
      ...(userAgentHash ? { userAgentHash } : {}),
      firstSeenAt: now,
      lastSeenAt: now,
    },
    update: {
      consent: "GRANTED",
      lastSeenAt: now,
      ...(input.locale ? { locale: input.locale } : {}),
      ...(context.userId ? { user: { connect: { id: context.userId } } } : {}),
      ...(userAgentHash ? { userAgentHash } : {}),
    },
    select: { id: true },
  });

  await db.analyticsEvent.create({
    data: {
      session: { connect: { id: session.id } },
      ...(context.userId ? { user: { connect: { id: context.userId } } } : {}),
      name: eventNameMap[input.name],
      path: input.path,
      ...(input.pageType ? { pageType: pageTypeMap[input.pageType] } : {}),
      ...(input.entityType ? { entityType: input.entityType } : {}),
      ...(input.entityId ? { entityId: input.entityId } : {}),
      ...(input.label ? { label: input.label } : {}),
      ...(input.value !== undefined ? { value: input.value } : {}),
      ...(metadata ? { metadata: metadata as Prisma.InputJsonValue } : {}),
    },
  });

  return { recorded: true };
}
