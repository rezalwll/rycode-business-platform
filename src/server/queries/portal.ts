import "server-only";

import { db } from "@/db/client";
import type { Prisma } from "@/generated/prisma/client";
import {
  hasAnyPermission,
  hasPermission,
  requireAnyPermission,
  requirePermission,
  type Actor,
} from "@/server/auth/permissions";

const take = 100;

function clientIdsForRoles(actor: Actor, roles: readonly string[]): string[] {
  return actor.clientMemberships
    .filter((membership) => roles.includes(membership.role))
    .map((membership) => membership.clientId);
}

function projectScope(actor: Actor): Prisma.ProjectWhereInput {
  if (hasPermission(actor, "projects.read")) return {};
  const administrativeClientIds = clientIdsForRoles(actor, ["OWNER", "ADMIN"]);
  return {
    client: { isActive: true, archivedAt: null },
    OR: [{ clientId: { in: administrativeClientIds } }, { id: { in: [...actor.projectIds] } }],
  };
}

function leadScope(actor: Actor): Prisma.LeadWhereInput {
  if (hasPermission(actor, "leads.read")) return {};
  return {
    OR: [
      { submittedById: actor.userId },
      {
        clientId: { in: clientIdsForRoles(actor, ["OWNER", "ADMIN"]) },
        client: { isActive: true, archivedAt: null },
      },
    ],
  };
}

function ticketScope(actor: Actor): Prisma.TicketWhereInput {
  if (hasPermission(actor, "tickets.read")) return {};
  return {
    client: { isActive: true, archivedAt: null },
    OR: [
      { openedById: actor.userId, clientId: { in: [...actor.clientIds] } },
      { clientId: { in: clientIdsForRoles(actor, ["OWNER", "ADMIN"]) } },
      { projectId: { in: [...actor.projectIds] } },
    ],
  };
}

function financeScope(actor: Actor): Prisma.InvoiceWhereInput {
  if (hasPermission(actor, "finance.read")) return {};
  const financeProjectIds = actor.projectMemberships
    .filter((membership) => membership.canViewFinance)
    .map((membership) => membership.projectId);
  return {
    client: { isActive: true, archivedAt: null },
    OR: [
      { clientId: { in: clientIdsForRoles(actor, ["OWNER", "ADMIN", "BILLING"]) } },
      { projectId: { in: financeProjectIds } },
    ],
  };
}

export async function customerOverview(actor: Actor) {
  requirePermission(actor, "workspace.access");
  const scopedProjects = projectScope(actor);
  const canReadProjects = hasAnyPermission(actor, ["projects.read_own", "projects.read"]);
  const canReadTickets = hasAnyPermission(actor, [
    "tickets.manage_own",
    "tickets.read",
    "tickets.manage",
  ]);
  const canReadNotifications = hasAnyPermission(actor, [
    "notifications.read_own",
    "notifications.manage",
  ]);
  const canReadFinance = hasAnyPermission(actor, ["finance.read_own", "finance.read"]);
  const [projects, activeProjects, openTickets, unreadNotifications, outstandingInvoices] =
    await Promise.all([
      canReadProjects
        ? db.project.count({ where: { ...scopedProjects, archivedAt: null } })
        : Promise.resolve(null),
      canReadProjects
        ? db.project.count({ where: { ...scopedProjects, status: "ACTIVE", archivedAt: null } })
        : Promise.resolve(null),
      canReadTickets
        ? db.ticket.count({
            where: {
              ...ticketScope(actor),
              status: { in: ["OPEN", "WAITING_ON_CLIENT", "WAITING_ON_STAFF"] },
            },
          })
        : Promise.resolve(null),
      canReadNotifications
        ? db.notification.count({ where: { userId: actor.userId, readAt: null } })
        : Promise.resolve(null),
      canReadFinance
        ? db.invoice.findMany({
            where: {
              ...financeScope(actor),
              status: { in: ["ISSUED", "PARTIALLY_PAID", "OVERDUE"] },
            },
            select: {
              currency: true,
              totalAmount: true,
              allocations: {
                where: { payment: { status: "SUCCEEDED" } },
                select: { amount: true },
              },
            },
          })
        : Promise.resolve(null),
    ]);

  const outstandingByCurrency = outstandingInvoices
    ? Array.from(
        outstandingInvoices
          .reduce(
            (totals, invoice) => {
              const paidAmount = invoice.allocations.reduce(
                (sum, allocation) => sum + allocation.amount,
                0n,
              );
              const current = totals.get(invoice.currency) ?? {
                currency: invoice.currency,
                totalAmount: 0n,
                paidAmount: 0n,
                outstandingAmount: 0n,
              };
              current.totalAmount += invoice.totalAmount;
              current.paidAmount += paidAmount;
              current.outstandingAmount += invoice.totalAmount - paidAmount;
              totals.set(invoice.currency, current);
              return totals;
            },
            new Map<
              string,
              {
                currency: string;
                totalAmount: bigint;
                paidAmount: bigint;
                outstandingAmount: bigint;
              }
            >(),
          )
          .values(),
      ).sort((left, right) => left.currency.localeCompare(right.currency))
    : null;

  return {
    projects,
    activeProjects,
    openTickets,
    unreadNotifications,
    outstandingByCurrency,
  };
}

export async function customerLeads(actor: Actor) {
  requireAnyPermission(actor, ["leads.read_own", "leads.read"]);
  return db.lead.findMany({
    where: {
      archivedAt: null,
      ...leadScope(actor),
    },
    select: { id: true, type: true, status: true, service: true, summary: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function customerProjects(actor: Actor) {
  requireAnyPermission(actor, ["projects.read_own", "projects.read"]);
  return db.project.findMany({
    where: { ...projectScope(actor), archivedAt: null },
    select: {
      id: true,
      clientId: true,
      number: true,
      name: true,
      status: true,
      progress: true,
      latestUpdate: true,
      clientAction: true,
      updatedAt: true,
      client: { select: { displayName: true } },
      _count: { select: { milestones: true, files: true, tickets: true } },
    },
    orderBy: { updatedAt: "desc" },
    take,
  });
}

export async function customerProject(actor: Actor, projectId: string) {
  requireAnyPermission(actor, ["projects.read_own", "projects.read"]);
  return db.project.findFirst({
    where: { id: projectId, ...projectScope(actor), archivedAt: null },
    include: {
      client: { select: { displayName: true } },
      milestones: {
        orderBy: { position: "asc" },
        include: { approvals: { orderBy: { createdAt: "desc" }, take: 1 } },
      },
      activities: { where: { visibility: "CLIENT" }, orderBy: { createdAt: "desc" }, take: 50 },
      files: {
        where: {
          visibility: { not: "INTERNAL" },
          file: { status: "READY", deletedAt: null },
        },
        select: {
          id: true,
          label: true,
          createdAt: true,
          file: { select: { id: true, originalName: true, mimeType: true, sizeBytes: true } },
        },
        orderBy: { createdAt: "desc" },
        take: hasAnyPermission(actor, ["files.read_own", "files.read"]) ? 50 : 0,
      },
      tickets: {
        where: ticketScope(actor),
        select: { id: true, number: true, subject: true, status: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
        take: hasAnyPermission(actor, ["tickets.manage_own", "tickets.read", "tickets.manage"])
          ? 20
          : 0,
      },
    },
  });
}

export async function customerFiles(actor: Actor) {
  requireAnyPermission(actor, ["files.read_own", "files.read"]);
  return db.projectFile.findMany({
    where: {
      project: { ...projectScope(actor), archivedAt: null },
      visibility: { not: "INTERNAL" },
      file: { status: "READY", deletedAt: null },
    },
    select: {
      label: true,
      createdAt: true,
      project: { select: { id: true, name: true } },
      file: { select: { id: true, originalName: true, mimeType: true, sizeBytes: true } },
    },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function customerFinance(actor: Actor) {
  requireAnyPermission(actor, ["finance.read_own", "finance.read"]);
  return db.invoice.findMany({
    where: { ...financeScope(actor), status: { not: "DRAFT" } },
    select: {
      id: true,
      number: true,
      title: true,
      currency: true,
      totalAmount: true,
      status: true,
      issuedAt: true,
      dueDate: true,
      allocations: {
        where: { payment: { status: "SUCCEEDED" } },
        select: { amount: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function customerTickets(actor: Actor) {
  requireAnyPermission(actor, ["tickets.manage_own", "tickets.read", "tickets.manage"]);
  return db.ticket.findMany({
    where: ticketScope(actor),
    select: {
      id: true,
      number: true,
      subject: true,
      status: true,
      priority: true,
      updatedAt: true,
      _count: { select: { messages: true } },
    },
    orderBy: { updatedAt: "desc" },
    take,
  });
}

export async function customerTicketOptions(actor: Actor) {
  requireAnyPermission(actor, ["tickets.manage_own", "tickets.manage"]);
  const staff = hasPermission(actor, "tickets.manage");
  const [clients, projects] = await Promise.all([
    db.client.findMany({
      where: {
        isActive: true,
        archivedAt: null,
        ...(staff ? {} : { members: { some: { userId: actor.userId } } }),
      },
      select: { id: true, displayName: true },
      orderBy: { displayName: "asc" },
      take,
    }),
    db.project.findMany({
      where: {
        ...projectScope(actor),
        archivedAt: null,
        client: { isActive: true, archivedAt: null },
      },
      select: { id: true, clientId: true, name: true },
      orderBy: { name: "asc" },
      take,
    }),
  ]);
  return { clients, projects };
}

export async function customerNotifications(actor: Actor) {
  requireAnyPermission(actor, ["notifications.read_own", "notifications.manage"]);
  return db.notification.findMany({
    where: { userId: actor.userId },
    select: {
      id: true,
      kind: true,
      title: true,
      body: true,
      link: true,
      readAt: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function customerProfile(actor: Actor) {
  requirePermission(actor, "profile.manage_own");
  return db.user.findUnique({
    where: { id: actor.userId },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      profile: true,
      clientMemberships: {
        where: { client: { isActive: true, archivedAt: null } },
        select: { role: true, client: { select: { id: true, displayName: true } } },
      },
    },
  });
}

export async function adminOverview(actor: Actor) {
  requireAnyPermission(actor, [
    "leads.read",
    "projects.read",
    "tickets.read",
    "finance.read",
    "users.read",
    "cms.read",
  ]);
  const [newLeads, activeProjects, openTickets, overdueInvoices, users, publishedContent] =
    await Promise.all([
      hasPermission(actor, "leads.read")
        ? db.lead.count({ where: { status: "NEW", archivedAt: null } })
        : Promise.resolve(null),
      hasPermission(actor, "projects.read")
        ? db.project.count({ where: { status: "ACTIVE", archivedAt: null } })
        : Promise.resolve(null),
      hasPermission(actor, "tickets.read")
        ? db.ticket.count({ where: { status: { in: ["OPEN", "WAITING_ON_STAFF"] } } })
        : Promise.resolve(null),
      hasPermission(actor, "finance.read")
        ? db.invoice.count({ where: { status: "OVERDUE" } })
        : Promise.resolve(null),
      hasPermission(actor, "users.read") ? db.user.count() : Promise.resolve(null),
      hasPermission(actor, "cms.read")
        ? db.contentItem.count({ where: { status: "PUBLISHED", noIndex: false } })
        : Promise.resolve(null),
    ]);
  return { newLeads, activeProjects, openTickets, overdueInvoices, users, publishedContent };
}

export async function adminLeads(actor: Actor) {
  requirePermission(actor, "leads.read");
  return db.lead.findMany({
    include: { owner: { select: { name: true } }, client: { select: { displayName: true } } },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function adminClients(actor: Actor) {
  requirePermission(actor, "clients.read");
  return db.client.findMany({
    include: {
      members: {
        include: { user: { select: { name: true, email: true } } },
        orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
      },
      _count: { select: { members: true, projects: true, invoices: true, tickets: true } },
    },
    orderBy: { updatedAt: "desc" },
    take,
  });
}

export async function adminProjects(actor: Actor) {
  requirePermission(actor, "projects.read");
  return db.project.findMany({
    include: {
      client: { select: { displayName: true } },
      _count: { select: { milestones: true, members: true, tickets: true } },
    },
    orderBy: { updatedAt: "desc" },
    take,
  });
}

export async function adminFinance(actor: Actor) {
  requirePermission(actor, "finance.read");
  return db.invoice.findMany({
    include: {
      client: { select: { displayName: true } },
      allocations: {
        where: { payment: { status: "SUCCEEDED" } },
        select: { amount: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function adminTickets(actor: Actor) {
  requirePermission(actor, "tickets.read");
  return db.ticket.findMany({
    include: {
      client: { select: { displayName: true } },
      assignedTo: { select: { name: true } },
      _count: { select: { messages: true } },
    },
    orderBy: { updatedAt: "desc" },
    take,
  });
}

export async function adminFiles(actor: Actor) {
  requirePermission(actor, "files.manage");
  return db.fileAsset.findMany({
    select: {
      id: true,
      originalName: true,
      category: true,
      status: true,
      scanStatus: true,
      sizeBytes: true,
      createdAt: true,
      uploadedBy: { select: { name: true, email: true } },
      media: {
        select: {
          id: true,
          key: true,
          focalPointX: true,
          focalPointY: true,
          translations: { select: { locale: true, altText: true, caption: true } },
        },
      },
    },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    take,
  });
}

export async function adminContent(actor: Actor) {
  requirePermission(actor, "cms.read");
  return db.contentItem.findMany({
    include: {
      translations: { select: { locale: true, title: true, state: true } },
      updatedBy: { select: { name: true } },
    },
    orderBy: { updatedAt: "desc" },
    take,
  });
}

export async function adminCategories(actor: Actor) {
  requirePermission(actor, "cms.read");
  return db.category.findMany({
    include: {
      translations: { orderBy: { locale: "asc" } },
      _count: { select: { content: true } },
    },
    orderBy: { updatedAt: "desc" },
    take,
  });
}

export async function adminAuthors(actor: Actor) {
  requirePermission(actor, "cms.read");
  return db.author.findMany({
    include: {
      translations: { orderBy: { locale: "asc" } },
      avatarMedia: { select: { key: true } },
      _count: { select: { content: true } },
    },
    orderBy: { updatedAt: "desc" },
    take,
  });
}

export async function adminTags(actor: Actor) {
  requirePermission(actor, "cms.read");
  return db.tag.findMany({
    include: {
      translations: { orderBy: { locale: "asc" } },
      _count: { select: { content: true } },
    },
    orderBy: { updatedAt: "desc" },
    take,
  });
}

export async function adminFaqs(actor: Actor) {
  requirePermission(actor, "cms.read");
  return db.faq.findMany({
    include: {
      translations: { orderBy: { locale: "asc" } },
      _count: { select: { content: true, pages: true } },
    },
    orderBy: { updatedAt: "desc" },
    take,
  });
}

export async function adminSeo(actor: Actor) {
  requirePermission(actor, "cms.read");
  const [redirects, noIndexCount, missingEnglish] = await Promise.all([
    db.redirect.findMany({ orderBy: { updatedAt: "desc" }, take }),
    db.contentItem.count({ where: { noIndex: true } }),
    db.contentItem.count({ where: { translations: { none: { locale: "en" } } } }),
  ]);
  return { redirects, noIndexCount, missingEnglish };
}

export async function adminAnalytics(actor: Actor) {
  requirePermission(actor, "analytics.read");
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1_000);
  const [
    sessions,
    pageViews,
    ctaClicks,
    formStarts,
    formSubmissions,
    searches,
    attributedLeads,
    topPages,
    campaignSessions,
  ] = await Promise.all([
    db.analyticsSession.count({ where: { firstSeenAt: { gte: since } } }),
    db.analyticsEvent.count({ where: { name: "PAGE_VIEW", createdAt: { gte: since } } }),
    db.analyticsEvent.count({ where: { name: "CTA_CLICK", createdAt: { gte: since } } }),
    db.analyticsEvent.count({ where: { name: "FORM_STARTED", createdAt: { gte: since } } }),
    db.analyticsEvent.count({ where: { name: "FORM_SUBMITTED", createdAt: { gte: since } } }),
    db.analyticsEvent.count({ where: { name: "SEARCH", createdAt: { gte: since } } }),
    db.lead.count({ where: { analyticsSessionId: { not: null }, createdAt: { gte: since } } }),
    db.analyticsEvent.groupBy({
      by: ["path"],
      where: { name: "PAGE_VIEW", createdAt: { gte: since }, path: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { path: "desc" } },
      take: 10,
    }),
    db.analyticsSession.findMany({
      where: {
        firstSeenAt: { gte: since },
        consent: "GRANTED",
        OR: [
          { utmSource: { not: null } },
          { utmMedium: { not: null } },
          { utmCampaign: { not: null } },
        ],
      },
      select: {
        utmSource: true,
        utmMedium: true,
        utmCampaign: true,
        _count: { select: { leads: true } },
      },
      orderBy: { firstSeenAt: "desc" },
      take: 5_000,
    }),
  ]);
  const campaignMap = new Map<
    string,
    { source: string; medium: string; campaign: string; sessions: number; leads: number }
  >();
  for (const row of campaignSessions) {
    const source = row.utmSource ?? "—";
    const medium = row.utmMedium ?? "—";
    const campaign = row.utmCampaign ?? "—";
    const key = `${source}\u0000${medium}\u0000${campaign}`;
    const current = campaignMap.get(key) ?? { source, medium, campaign, sessions: 0, leads: 0 };
    current.sessions += 1;
    current.leads += row._count.leads;
    campaignMap.set(key, current);
  }
  const campaigns = [...campaignMap.values()]
    .sort((left, right) => right.leads - left.leads || right.sessions - left.sessions)
    .slice(0, 20);
  return {
    sessions,
    pageViews,
    ctaClicks,
    formStarts,
    formSubmissions,
    searches,
    attributedLeads,
    topPages,
    campaigns,
  };
}

export async function adminUsers(actor: Actor) {
  requirePermission(actor, "users.read");
  return db.user.findMany({
    include: {
      roles: { include: { role: true } },
      _count: { select: { sessions: true, clientMemberships: true } },
    },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function adminRoles(actor: Actor) {
  requirePermission(actor, "roles.manage");
  return db.role.findMany({
    include: {
      permissions: { include: { permission: true } },
      _count: { select: { users: true } },
    },
    orderBy: { key: "asc" },
  });
}

export async function adminAuditLogs(actor: Actor) {
  requirePermission(actor, "audit.read");
  return db.auditLog.findMany({
    include: { actor: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function adminSettings(actor: Actor) {
  requirePermission(actor, "settings.manage");
  return db.siteSetting.findMany({
    where: { visibility: { not: "SECRET" } },
    orderBy: { key: "asc" },
    take,
  });
}
