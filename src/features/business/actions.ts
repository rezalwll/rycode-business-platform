"use server";

import { revalidatePath } from "next/cache";

import {
  markAllNotificationsRead,
  markNotificationRead,
  updateOwnProfile,
} from "@/server/services/account";
import { asActionResult, type ActionResult } from "@/server/services/errors";
import {
  createInvoice,
  recalculateInvoiceState,
  recordPayment,
  updatePaymentStatus,
} from "@/server/services/finance";
import { requireCurrentIdentity } from "@/server/services/identity";
import {
  addLeadNote,
  assignLead,
  convertLeadToProject,
  updateLeadStatus,
} from "@/server/services/leads";
import {
  approveMilestone,
  createMilestone,
  createProject,
  updateMilestone,
  updateProject,
} from "@/server/services/projects";
import { createTicket, replyToTicket, resolveTicket } from "@/server/services/tickets";
import { saveClient, setClientMembers } from "@/server/services/clients";

function refreshAdminAndPortal(): void {
  revalidatePath("/admin", "layout");
  revalidatePath("/dashboard", "layout");
  revalidatePath("/en/admin", "layout");
  revalidatePath("/en/dashboard", "layout");
}

export async function saveClientAction(input: unknown): Promise<ActionResult<unknown>> {
  return asActionResult(async () => {
    const identity = await requireCurrentIdentity();
    const result = await saveClient(identity.actor, input);
    refreshAdminAndPortal();
    return { ...result, updatedAt: result.updatedAt.toISOString() };
  });
}

export async function setClientMembersAction(input: unknown): Promise<ActionResult<unknown>> {
  return asActionResult(async () => {
    const identity = await requireCurrentIdentity();
    const result = await setClientMembers(identity.actor, input);
    refreshAdminAndPortal();
    return result;
  });
}

export async function updateLeadStatusAction(input: unknown): Promise<ActionResult<unknown>> {
  return asActionResult(async () => {
    const identity = await requireCurrentIdentity();
    const result = await updateLeadStatus(identity.actor, input);
    refreshAdminAndPortal();
    return result;
  });
}

export async function addLeadNoteAction(input: unknown): Promise<ActionResult<unknown>> {
  return asActionResult(async () => {
    const identity = await requireCurrentIdentity();
    const result = await addLeadNote(identity.actor, input);
    refreshAdminAndPortal();
    return { ...result, createdAt: result.createdAt.toISOString() };
  });
}

export async function assignLeadAction(input: unknown): Promise<ActionResult<unknown>> {
  return asActionResult(async () => {
    const identity = await requireCurrentIdentity();
    const result = await assignLead(identity.actor, input);
    refreshAdminAndPortal();
    return result;
  });
}

export async function convertLeadAction(input: unknown): Promise<ActionResult<unknown>> {
  return asActionResult(async () => {
    const identity = await requireCurrentIdentity();
    const result = await convertLeadToProject(identity.actor, input);
    refreshAdminAndPortal();
    return result;
  });
}

export async function createProjectAction(input: unknown): Promise<ActionResult<unknown>> {
  return asActionResult(async () => {
    const identity = await requireCurrentIdentity();
    const result = await createProject(identity.actor, input);
    refreshAdminAndPortal();
    return result;
  });
}

export async function updateProjectAction(input: unknown): Promise<ActionResult<unknown>> {
  return asActionResult(async () => {
    const identity = await requireCurrentIdentity();
    const result = await updateProject(identity.actor, input);
    refreshAdminAndPortal();
    return { ...result, updatedAt: result.updatedAt.toISOString() };
  });
}

export async function createMilestoneAction(input: unknown): Promise<ActionResult<unknown>> {
  return asActionResult(async () => {
    const identity = await requireCurrentIdentity();
    const result = await createMilestone(identity.actor, input);
    refreshAdminAndPortal();
    return result;
  });
}

export async function updateMilestoneAction(input: unknown): Promise<ActionResult<unknown>> {
  return asActionResult(async () => {
    const identity = await requireCurrentIdentity();
    const result = await updateMilestone(identity.actor, input);
    refreshAdminAndPortal();
    return result;
  });
}

export async function approveMilestoneAction(input: unknown): Promise<ActionResult<unknown>> {
  return asActionResult(async () => {
    const identity = await requireCurrentIdentity();
    const result = await approveMilestone(identity.actor, input);
    refreshAdminAndPortal();
    return result;
  });
}

export async function createTicketAction(input: unknown): Promise<ActionResult<unknown>> {
  return asActionResult(async () => {
    const identity = await requireCurrentIdentity();
    const result = await createTicket(identity.actor, input);
    refreshAdminAndPortal();
    return result;
  });
}

export async function replyToTicketAction(input: unknown): Promise<ActionResult<unknown>> {
  return asActionResult(async () => {
    const identity = await requireCurrentIdentity();
    const result = await replyToTicket(identity.actor, input);
    refreshAdminAndPortal();
    return { ...result, createdAt: result.createdAt.toISOString() };
  });
}

export async function resolveTicketAction(input: unknown): Promise<ActionResult<unknown>> {
  return asActionResult(async () => {
    const identity = await requireCurrentIdentity();
    const result = await resolveTicket(identity.actor, input);
    refreshAdminAndPortal();
    return result;
  });
}

export async function createInvoiceAction(input: unknown): Promise<ActionResult<unknown>> {
  return asActionResult(async () => {
    const identity = await requireCurrentIdentity();
    const result = await createInvoice(identity.actor, input);
    refreshAdminAndPortal();
    return result;
  });
}

export async function recordPaymentAction(input: unknown): Promise<ActionResult<unknown>> {
  return asActionResult(async () => {
    const identity = await requireCurrentIdentity();
    const result = await recordPayment(identity.actor, input);
    refreshAdminAndPortal();
    return result;
  });
}

export async function updatePaymentStatusAction(input: unknown): Promise<ActionResult<unknown>> {
  return asActionResult(async () => {
    const identity = await requireCurrentIdentity();
    const result = await updatePaymentStatus(identity.actor, input);
    refreshAdminAndPortal();
    return result;
  });
}

export async function recalculateInvoiceAction(input: unknown): Promise<ActionResult<unknown>> {
  return asActionResult(async () => {
    const identity = await requireCurrentIdentity();
    const result = await recalculateInvoiceState(identity.actor, input);
    refreshAdminAndPortal();
    return result;
  });
}

export async function markNotificationReadAction(input: unknown): Promise<ActionResult<unknown>> {
  return asActionResult(async () => {
    const identity = await requireCurrentIdentity();
    const result = await markNotificationRead(identity.actor, input);
    revalidatePath("/dashboard", "layout");
    revalidatePath("/en/dashboard", "layout");
    return { ...result, readAt: result.readAt?.toISOString() ?? null };
  });
}

export async function markAllNotificationsReadAction(): Promise<ActionResult<unknown>> {
  return asActionResult(async () => {
    const identity = await requireCurrentIdentity();
    const result = await markAllNotificationsRead(identity.actor);
    revalidatePath("/dashboard", "layout");
    revalidatePath("/en/dashboard", "layout");
    return { ...result, readAt: result.readAt.toISOString() };
  });
}

export async function updateProfileAction(input: unknown): Promise<ActionResult<unknown>> {
  return asActionResult(async () => {
    const identity = await requireCurrentIdentity();
    const result = await updateOwnProfile(identity.actor, input);
    revalidatePath("/dashboard", "layout");
    revalidatePath("/en/dashboard", "layout");
    return { ...result, updatedAt: result.updatedAt.toISOString() };
  });
}
