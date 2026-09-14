import type { Actor } from "@/server/auth/permissions";
import {
  canAccessClient,
  canAccessProject,
  canAccessTicket,
  canViewFinanceResource,
  hasPermission,
  isClientAdministrator,
} from "@/server/auth/permissions";

type FileVisibility = "INTERNAL" | "PROJECT_MEMBERS" | "CLIENT_MEMBERS";

export type FileAccessRecord = {
  status: "UPLOADING" | "QUARANTINED" | "READY" | "REJECTED" | "DELETED";
  uploadedById: string | null;
  projectLinks: readonly {
    visibility: FileVisibility;
    project: { id: string; clientId: string };
  }[];
  leadLinks: readonly {
    visibility: FileVisibility;
    lead: { submittedById: string | null; ownerId: string | null; clientId: string | null };
  }[];
  ticketMessageLinks: readonly {
    message: {
      visibility: "PUBLIC" | "INTERNAL";
      ticket: { openedById: string; clientId: string; projectId: string | null };
    };
  }[];
  invoiceLinks: readonly {
    invoice: { clientId: string; projectId: string | null };
  }[];
  paymentReceiptLinks: readonly {
    payment: { clientId: string };
  }[];
  media: { id: string } | null;
};

function hasProjectScope(actor: Actor, project: { id: string; clientId: string }): boolean {
  return canAccessProject(actor, project);
}

export function canReadFile(actor: Actor, file: FileAccessRecord): boolean {
  if (file.status === "DELETED" || file.status === "REJECTED" || file.status === "UPLOADING") {
    return false;
  }

  if (file.status !== "READY") return false;
  if (hasPermission(actor, "files.manage")) return true;
  if (hasPermission(actor, "files.read")) return true;

  if (
    hasPermission(actor, "files.read_own") &&
    file.projectLinks.some(({ visibility, project }) => {
      if (visibility === "INTERNAL") return false;
      if (visibility === "CLIENT_MEMBERS") return canAccessClient(actor, project.clientId);
      return hasProjectScope(actor, project);
    })
  ) {
    return true;
  }

  if (
    hasPermission(actor, "leads.read_own") &&
    file.leadLinks.some(
      ({ visibility, lead }) =>
        visibility !== "INTERNAL" &&
        ((lead.submittedById === actor.userId &&
          (lead.clientId === null || actor.clientIds.includes(lead.clientId))) ||
          (lead.clientId !== null && isClientAdministrator(actor, lead.clientId))),
    )
  ) {
    return true;
  }

  if (
    hasPermission(actor, "tickets.manage_own") &&
    file.ticketMessageLinks.some(
      ({ message }) => message.visibility === "PUBLIC" && canAccessTicket(actor, message.ticket),
    )
  ) {
    return true;
  }

  if (
    hasPermission(actor, "finance.read_own") &&
    (file.invoiceLinks.some(({ invoice }) => canViewFinanceResource(actor, invoice)) ||
      file.paymentReceiptLinks.some(({ payment }) =>
        canViewFinanceResource(actor, { clientId: payment.clientId, projectId: null }),
      ))
  ) {
    return true;
  }

  return file.media !== null && hasPermission(actor, "cms.read");
}
