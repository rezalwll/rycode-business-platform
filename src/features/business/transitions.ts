import type {
  InvoiceStatus,
  InstallmentStatus,
  LeadStatus,
  MilestoneApprovalDecision,
  MilestoneStatus,
  ProjectStatus,
  TicketStatus,
} from "@/generated/prisma/client";

import { ServiceError } from "@/server/services/errors";

const leadTransitions: Readonly<Record<LeadStatus, ReadonlySet<LeadStatus>>> = {
  NEW: new Set(["QUALIFIED", "CONTACTED", "LOST", "SPAM", "ARCHIVED"]),
  QUALIFIED: new Set(["CONTACTED", "PROPOSAL", "LOST", "ARCHIVED"]),
  CONTACTED: new Set(["QUALIFIED", "PROPOSAL", "LOST", "ARCHIVED"]),
  PROPOSAL: new Set(["CONTACTED", "WON", "LOST", "ARCHIVED"]),
  WON: new Set(["ARCHIVED"]),
  LOST: new Set(["QUALIFIED", "ARCHIVED"]),
  SPAM: new Set(["ARCHIVED"]),
  ARCHIVED: new Set(),
};

const projectTransitions: Readonly<Record<ProjectStatus, ReadonlySet<ProjectStatus>>> = {
  DRAFT: new Set(["PLANNED", "ACTIVE", "CANCELLED", "ARCHIVED"]),
  PLANNED: new Set(["DRAFT", "ACTIVE", "ON_HOLD", "CANCELLED", "ARCHIVED"]),
  ACTIVE: new Set(["ON_HOLD", "COMPLETED", "CANCELLED", "ARCHIVED"]),
  ON_HOLD: new Set(["ACTIVE", "CANCELLED", "ARCHIVED"]),
  COMPLETED: new Set(["ACTIVE", "ARCHIVED"]),
  CANCELLED: new Set(["DRAFT", "ARCHIVED"]),
  ARCHIVED: new Set(),
};

const milestoneTransitions: Readonly<Record<MilestoneStatus, ReadonlySet<MilestoneStatus>>> = {
  PENDING: new Set(["IN_PROGRESS", "BLOCKED", "CANCELLED"]),
  IN_PROGRESS: new Set(["AWAITING_APPROVAL", "COMPLETED", "BLOCKED", "CANCELLED"]),
  AWAITING_APPROVAL: new Set(["APPROVED", "CHANGES_REQUESTED", "BLOCKED", "CANCELLED"]),
  CHANGES_REQUESTED: new Set(["IN_PROGRESS", "AWAITING_APPROVAL", "CANCELLED"]),
  APPROVED: new Set(["COMPLETED", "IN_PROGRESS"]),
  COMPLETED: new Set(["IN_PROGRESS"]),
  BLOCKED: new Set(["IN_PROGRESS", "CANCELLED"]),
  CANCELLED: new Set(["PENDING"]),
};

function assertTransition<T extends string>(
  transitions: Readonly<Record<T, ReadonlySet<T>>>,
  from: T,
  to: T,
  entityName: string,
): void {
  if (from === to) return;
  if (!transitions[from].has(to)) {
    throw new ServiceError(
      "INVALID_STATE",
      `تغییر وضعیت ${entityName} از ${from} به ${to} مجاز نیست.`,
    );
  }
}

export function assertLeadTransition(from: LeadStatus, to: LeadStatus): void {
  assertTransition(leadTransitions, from, to, "لید");
}

export function assertProjectTransition(from: ProjectStatus, to: ProjectStatus): void {
  assertTransition(projectTransitions, from, to, "پروژه");
}

export function assertMilestoneTransition(from: MilestoneStatus, to: MilestoneStatus): void {
  assertTransition(milestoneTransitions, from, to, "مایلستون");
}

export function milestoneStatusForDecision(decision: MilestoneApprovalDecision): MilestoneStatus {
  return decision === "APPROVED" ? "APPROVED" : "CHANGES_REQUESTED";
}

export function ticketStatusAfterReply(isStaffReply: boolean): TicketStatus {
  return isStaffReply ? "WAITING_ON_CLIENT" : "WAITING_ON_STAFF";
}

export function quantityScale(quantity: string): bigint {
  const [whole = "0", fraction = ""] = quantity.split(".");
  return BigInt(whole) * 10_000n + BigInt(fraction.padEnd(4, "0"));
}

export function calculateLineTotal(quantity: string, unitAmount: bigint): bigint {
  const scaled = unitAmount * quantityScale(quantity);
  return (scaled + 5_000n) / 10_000n;
}

export function calculateInvoiceTotal(input: {
  items: readonly { quantity: string; unitAmount: bigint }[];
  discountAmount: bigint;
  taxAmount: bigint;
}): { subtotalAmount: bigint; totalAmount: bigint; lineTotals: bigint[] } {
  const lineTotals = input.items.map((item) => calculateLineTotal(item.quantity, item.unitAmount));
  const subtotalAmount = lineTotals.reduce((total, amount) => total + amount, 0n);
  const totalAmount = subtotalAmount - input.discountAmount + input.taxAmount;
  if (totalAmount < 0n) {
    throw new ServiceError("INVALID_INPUT", "مبلغ نهایی فاکتور نمی‌تواند منفی باشد.");
  }
  return { subtotalAmount, totalAmount, lineTotals };
}

function isPastDue(dueDate: Date | null | undefined, now: Date): boolean {
  if (!dueDate) return false;
  const due = Date.UTC(dueDate.getUTCFullYear(), dueDate.getUTCMonth(), dueDate.getUTCDate());
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return due < today;
}

export function deriveInvoiceStatus(input: {
  currentStatus: InvoiceStatus;
  totalAmount: bigint;
  paidAmount: bigint;
  dueDate?: Date | null;
  issuedAt?: Date | null;
  now: Date;
}): InvoiceStatus {
  if (input.currentStatus === "VOID") return "VOID";
  if (input.paidAmount >= input.totalAmount && input.totalAmount > 0n) return "PAID";
  if (input.paidAmount > 0n) return "PARTIALLY_PAID";
  if (!input.issuedAt && input.currentStatus === "DRAFT") return "DRAFT";
  return isPastDue(input.dueDate, input.now) ? "OVERDUE" : "ISSUED";
}

export function deriveInstallmentStatus(input: {
  currentStatus: InstallmentStatus;
  amount: bigint;
  paidAmount: bigint;
  dueDate?: Date | null;
  now: Date;
}): InstallmentStatus {
  if (input.currentStatus === "WAIVED") return "WAIVED";
  if (input.paidAmount >= input.amount && input.amount > 0n) return "PAID";
  if (input.paidAmount > 0n) return "PARTIALLY_PAID";
  return isPastDue(input.dueDate, input.now) ? "OVERDUE" : "PENDING";
}
