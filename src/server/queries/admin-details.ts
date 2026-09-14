import "server-only";

import { z } from "zod";

import { db } from "@/db/client";
import { requirePermission, type Actor } from "@/server/auth/permissions";

const validId = (value: string) => z.string().uuid().safeParse(value).success;

export async function adminClientOptions(
  actor: Actor,
  permission: "clients.manage" | "projects.manage" | "finance.manage",
) {
  requirePermission(actor, permission);
  return db.client.findMany({
    where: { isActive: true, archivedAt: null },
    select: { id: true, displayName: true },
    orderBy: { displayName: "asc" },
    take: 500,
  });
}

export async function adminClientMemberOptions(actor: Actor) {
  requirePermission(actor, "clients.manage");
  return db.user.findMany({
    select: { id: true, name: true, email: true },
    orderBy: [{ name: "asc" }, { email: "asc" }],
    take: 500,
  });
}

export async function adminLeadDetail(actor: Actor, id: string) {
  requirePermission(actor, "leads.read");
  if (!validId(id)) return null;
  return db.lead.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      company: true,
      email: true,
      phone: true,
      summary: true,
      status: true,
      type: true,
      service: true,
      createdAt: true,
      ownerId: true,
      analyticsSession: {
        select: {
          landingPath: true,
          referrer: true,
          utmSource: true,
          utmMedium: true,
          utmCampaign: true,
          firstSeenAt: true,
        },
      },
      convertedProject: { select: { id: true, number: true, name: true } },
      activities: {
        select: {
          id: true,
          type: true,
          note: true,
          fromStatus: true,
          toStatus: true,
          createdAt: true,
          actor: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 100,
      },
    },
  });
}

export async function adminLeadOwnerOptions(actor: Actor) {
  requirePermission(actor, "leads.manage");
  return db.user.findMany({
    where: {
      roles: {
        some: { role: { key: { in: ["super_admin", "admin", "support", "project_manager"] } } },
      },
    },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
    take: 500,
  });
}

export async function adminProjectDetail(actor: Actor, id: string) {
  requirePermission(actor, "projects.read");
  if (!validId(id)) return null;
  return db.project.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      number: true,
      status: true,
      progress: true,
      scope: true,
      latestUpdate: true,
      clientAction: true,
      startDate: true,
      expectedEndDate: true,
      client: { select: { displayName: true } },
      milestones: {
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          progress: true,
          position: true,
          approvalRequired: true,
          expectedEndDate: true,
        },
        orderBy: { position: "asc" },
        take: 200,
      },
    },
  });
}

export async function adminInvoiceOptions(actor: Actor) {
  requirePermission(actor, "finance.manage");
  return db.project.findMany({
    where: { archivedAt: null, client: { isActive: true, archivedAt: null } },
    select: { id: true, name: true, clientId: true },
    orderBy: { name: "asc" },
    take: 500,
  });
}

export async function adminInvoiceDetail(actor: Actor, id: string) {
  requirePermission(actor, "finance.read");
  if (!validId(id)) return null;
  return db.invoice.findUnique({
    where: { id },
    select: {
      id: true,
      clientId: true,
      number: true,
      title: true,
      currency: true,
      status: true,
      totalAmount: true,
      discountAmount: true,
      taxAmount: true,
      dueDate: true,
      notes: true,
      client: { select: { displayName: true } },
      items: {
        select: {
          id: true,
          description: true,
          quantity: true,
          unitAmount: true,
          totalAmount: true,
        },
        orderBy: { position: "asc" },
      },
      installments: {
        select: { id: true, label: true, amount: true, status: true, dueDate: true },
        orderBy: { position: "asc" },
      },
      allocations: {
        select: {
          id: true,
          amount: true,
          installmentId: true,
          payment: {
            select: { id: true, status: true, method: true, providerReference: true, paidAt: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function adminTicketDetail(actor: Actor, id: string) {
  requirePermission(actor, "tickets.read");
  if (!validId(id)) return null;
  return db.ticket.findUnique({
    where: { id },
    select: {
      id: true,
      number: true,
      subject: true,
      status: true,
      priority: true,
      client: { select: { displayName: true } },
      messages: {
        select: {
          id: true,
          body: true,
          visibility: true,
          createdAt: true,
          author: { select: { name: true } },
        },
        orderBy: { createdAt: "asc" },
        take: 200,
      },
    },
  });
}

export async function adminContentDetail(actor: Actor, id: string) {
  requirePermission(actor, "cms.read");
  if (!validId(id)) return null;
  return db.contentItem.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      kind: true,
      status: true,
      noIndex: true,
      featuredMediaId: true,
      position: true,
      categories: { select: { categoryId: true }, orderBy: { position: "asc" } },
      tags: { select: { tagId: true } },
      authors: { select: { authorId: true }, orderBy: { position: "asc" } },
      faqs: { select: { faqId: true }, orderBy: { position: "asc" } },
      translations: {
        select: {
          locale: true,
          title: true,
          summary: true,
          body: true,
          bodyText: true,
          state: true,
          seoTitle: true,
          seoDescription: true,
          canonicalUrl: true,
          ogTitle: true,
          ogDescription: true,
        },
        orderBy: { locale: "asc" },
      },
    },
  });
}

export async function adminMediaOptions(actor: Actor) {
  requirePermission(actor, "cms.manage");
  return db.media.findMany({
    where: { file: { status: "READY", deletedAt: null, mimeType: { startsWith: "image/" } } },
    select: { id: true, key: true },
    orderBy: { createdAt: "desc" },
    take: 500,
  });
}

export async function adminTaxonomyOptions(actor: Actor) {
  requirePermission(actor, "cms.manage");
  const [categories, tags, authors, faqs] = await Promise.all([
    db.category.findMany({
      select: { id: true, slug: true, translations: { select: { locale: true, name: true } } },
      orderBy: { slug: "asc" },
      take: 500,
    }),
    db.tag.findMany({
      select: { id: true, slug: true, translations: { select: { locale: true, name: true } } },
      orderBy: { slug: "asc" },
      take: 500,
    }),
    db.author.findMany({
      select: { id: true, slug: true, translations: { select: { locale: true, name: true } } },
      orderBy: { slug: "asc" },
      take: 500,
    }),
    db.faq.findMany({
      where: { status: { not: "ARCHIVED" } },
      select: {
        id: true,
        status: true,
        translations: { select: { locale: true, question: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 500,
    }),
  ]);
  return { categories, tags, authors, faqs };
}
