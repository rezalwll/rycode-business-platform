import { randomUUID } from "node:crypto";

import { beforeAll, describe, expect, it } from "vitest";

import { db } from "@/db/client";
import { acceptLead } from "@/features/leads/service";
import { hashAnalyticsIdentifier } from "@/server/analytics/hash";
import type { Actor } from "@/server/auth/permissions";
import { env } from "@/server/env";
import { searchPublicCatalog } from "@/server/queries/public-content";
import { createInvoice, recordPayment } from "@/server/services/finance";
import { approveMilestone } from "@/server/services/projects";
import { ServiceError } from "@/server/services/errors";

const fixture = {
  staffId: `integration-staff-${randomUUID()}`,
  customerId: `integration-customer-${randomUUID()}`,
  clientId: randomUUID(),
  otherClientId: randomUUID(),
  projectId: randomUUID(),
  milestoneId: randomUUID(),
  revokedMilestoneId: randomUUID(),
};

const financeActor: Actor = {
  userId: fixture.staffId,
  roles: ["finance"],
  permissions: ["finance.manage"],
  clientIds: [],
  projectIds: [],
  clientMemberships: [],
  projectMemberships: [],
};

const customerActor: Actor = {
  userId: fixture.customerId,
  roles: ["customer"],
  permissions: ["milestones.approve", "projects.read_own"],
  clientIds: [fixture.clientId],
  projectIds: [fixture.projectId],
  clientMemberships: [{ clientId: fixture.clientId, role: "MEMBER" }],
  projectMemberships: [
    { projectId: fixture.projectId, role: "CLIENT_APPROVER", canViewFinance: false },
  ],
};

beforeAll(async () => {
  await db.user.createMany({
    data: [
      {
        id: fixture.staffId,
        name: "Integration Staff",
        email: `${fixture.staffId}@example.test`,
        emailVerified: true,
      },
      {
        id: fixture.customerId,
        name: "Integration Customer",
        email: `${fixture.customerId}@example.test`,
        emailVerified: true,
      },
    ],
  });
  await db.client.createMany({
    data: [
      { id: fixture.clientId, displayName: "Integration Client" },
      { id: fixture.otherClientId, displayName: "Other Integration Client" },
    ],
  });
  await db.clientMember.create({
    data: { clientId: fixture.clientId, userId: fixture.customerId, role: "MEMBER" },
  });
  await db.project.create({
    data: {
      id: fixture.projectId,
      clientId: fixture.clientId,
      number: `INT-${randomUUID()}`,
      name: "Integration Project",
      status: "ACTIVE",
      members: {
        create: { userId: fixture.customerId, role: "CLIENT_APPROVER" },
      },
      milestones: {
        createMany: {
          data: [
            {
              id: fixture.milestoneId,
              title: "Approval one",
              position: 1,
              status: "AWAITING_APPROVAL",
              approvalRequired: true,
            },
            {
              id: fixture.revokedMilestoneId,
              title: "Approval two",
              position: 2,
              status: "AWAITING_APPROVAL",
              approvalRequired: true,
            },
          ],
        },
      },
    },
  });
});

describe("business services against PostgreSQL", () => {
  it("persists invoice/payment allocation atomically and enforces tenant/currency scope", async () => {
    const invoice = await createInvoice(financeActor, {
      clientId: fixture.clientId,
      projectId: fixture.projectId,
      number: `INV-${randomUUID()}`,
      title: "Integration invoice",
      currency: "IRR",
      issueNow: true,
      items: [{ description: "Delivery", quantity: "1", unitAmount: "1000" }],
      installments: [],
    });

    const payment = await recordPayment(financeActor, {
      clientId: fixture.clientId,
      method: "BANK_TRANSFER",
      amount: "400",
      currency: "IRR",
      idempotencyKey: `integration-${randomUUID()}`,
      allocations: [{ invoiceId: invoice.id, amount: "400" }],
    });
    expect(payment.invoices).toEqual([
      expect.objectContaining({ id: invoice.id, status: "PARTIALLY_PAID", paidAmount: "400" }),
    ]);
    await expect(
      recordPayment(financeActor, {
        clientId: fixture.otherClientId,
        method: "BANK_TRANSFER",
        amount: "100",
        currency: "IRR",
        idempotencyKey: `integration-${randomUUID()}`,
        allocations: [{ invoiceId: invoice.id, amount: "100" }],
      }),
    ).rejects.toMatchObject({ code: "INVALID_STATE" });
  });

  it("accepts a current client approver and rejects the same stale actor after membership revocation", async () => {
    await expect(
      approveMilestone(customerActor, { milestoneId: fixture.milestoneId, decision: "APPROVED" }),
    ).resolves.toMatchObject({ id: fixture.milestoneId, status: "APPROVED" });

    await db.clientMember.delete({
      where: { clientId_userId: { clientId: fixture.clientId, userId: fixture.customerId } },
    });
    await expect(
      approveMilestone(customerActor, {
        milestoneId: fixture.revokedMilestoneId,
        decision: "APPROVED",
      }),
    ).rejects.toSatisfy(
      (error: unknown) => error instanceof ServiceError && error.code === "FORBIDDEN",
    );
  });

  it("enforces database check constraints independently of service validation", async () => {
    await expect(
      db.invoice.create({
        data: {
          clientId: fixture.clientId,
          number: `NEG-${randomUUID()}`,
          title: "Invalid negative invoice",
          currency: "IRR",
          subtotalAmount: -1n,
          totalAmount: -1n,
        },
      }),
    ).rejects.toThrow();
  });

  it("uses the PostgreSQL search indexes while excluding future scheduled content", async () => {
    const marker = `nexoryx${randomUUID().replaceAll("-", "")}`;
    const publishedSlug = `integration-published-${randomUUID()}`;
    const futureSlug = `integration-future-${randomUUID()}`;

    await db.contentItem.createMany({
      data: [
        {
          kind: "ARTICLE",
          slug: publishedSlug,
          status: "PUBLISHED",
          publishedAt: new Date(),
        },
        {
          kind: "ARTICLE",
          slug: futureSlug,
          status: "SCHEDULED",
          scheduledAt: new Date(Date.now() + 86_400_000),
        },
      ],
    });
    const content = await db.contentItem.findMany({
      where: { slug: { in: [publishedSlug, futureSlug] } },
      select: { id: true, slug: true },
    });
    await db.contentTranslation.createMany({
      data: content.map((item) => ({
        contentId: item.id,
        locale: "en",
        title: `${marker} ${item.slug}`,
        summary: "A unique integration search marker",
        bodyText: "PostgreSQL full-text search verification",
        state: "APPROVED",
      })),
    });

    const results = await searchPublicCatalog(marker, "en");
    expect(results.map((result) => result.entry.slug)).toContain(publishedSlug);
    expect(results.map((result) => result.entry.slug)).not.toContain(futureSlug);
  });

  it("attributes leads only to a matching consent-granted analytics session", async () => {
    const anonymousId = randomUUID();
    const sessionKey = randomUUID();
    const analyticsSession = await db.analyticsSession.create({
      data: {
        anonymousIdHash: hashAnalyticsIdentifier(env.BETTER_AUTH_SECRET, "anonymous", anonymousId),
        sessionKeyHash: hashAnalyticsIdentifier(env.BETTER_AUTH_SECRET, "session", sessionKey),
        consent: "GRANTED",
        landingPath: "/en/services",
        utmSource: "integration-suite",
      },
    });

    const attributed = await acceptLead({
      kind: "contact",
      locale: "en",
      fullName: "Attributed Integration Lead",
      email: `attributed-${randomUUID()}@example.test`,
      message: "This verifies consent-aware lead attribution.",
      consent: true,
      sourcePath: "/en/services",
      startedAt: Date.now() - 2_000,
      website: "",
      analyticsAnonymousId: anonymousId,
      analyticsSessionKey: sessionKey,
    });
    expect(attributed.status).toBe("created");
    if (attributed.status !== "created") throw new Error("Expected the lead to be persisted");
    await expect(
      db.lead.findUnique({ where: { id: attributed.id }, select: { analyticsSessionId: true } }),
    ).resolves.toEqual({ analyticsSessionId: analyticsSession.id });

    const deniedAnonymousId = randomUUID();
    const deniedSessionKey = randomUUID();
    await db.analyticsSession.create({
      data: {
        anonymousIdHash: hashAnalyticsIdentifier(
          env.BETTER_AUTH_SECRET,
          "anonymous",
          deniedAnonymousId,
        ),
        sessionKeyHash: hashAnalyticsIdentifier(
          env.BETTER_AUTH_SECRET,
          "session",
          deniedSessionKey,
        ),
        consent: "DENIED",
      },
    });
    const unattributed = await acceptLead({
      kind: "contact",
      locale: "en",
      fullName: "Unattributed Integration Lead",
      email: `unattributed-${randomUUID()}@example.test`,
      message: "This verifies that denied sessions are never linked.",
      consent: true,
      sourcePath: "/en/contact",
      startedAt: Date.now() - 2_000,
      website: "",
      analyticsAnonymousId: deniedAnonymousId,
      analyticsSessionKey: deniedSessionKey,
    });
    expect(unattributed.status).toBe("created");
    if (unattributed.status !== "created") throw new Error("Expected the lead to be persisted");
    await expect(
      db.lead.findUnique({ where: { id: unattributed.id }, select: { analyticsSessionId: true } }),
    ).resolves.toEqual({ analyticsSessionId: null });
  });
});
