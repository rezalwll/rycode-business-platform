import { describe, expect, it } from "vitest";

import {
  assertLeadTransition,
  assertMilestoneTransition,
  assertProjectTransition,
  calculateInvoiceTotal,
  calculateLineTotal,
  deriveInstallmentStatus,
  deriveInvoiceStatus,
  milestoneStatusForDecision,
  ticketStatusAfterReply,
} from "@/features/business/transitions";
import { toActionError } from "@/server/services/errors";

describe("business state machines", () => {
  it("accepts explicit lifecycle transitions and rejects unsafe jumps", () => {
    expect(() => assertLeadTransition("NEW", "QUALIFIED")).not.toThrow();
    expect(() => assertLeadTransition("QUALIFIED", "QUALIFIED")).not.toThrow();
    expect(() => assertLeadTransition("ARCHIVED", "NEW")).toThrow(/مجاز نیست/);

    expect(() => assertProjectTransition("PLANNED", "ACTIVE")).not.toThrow();
    expect(() => assertProjectTransition("ARCHIVED", "ACTIVE")).toThrow(/مجاز نیست/);

    expect(() => assertMilestoneTransition("IN_PROGRESS", "AWAITING_APPROVAL")).not.toThrow();
    expect(() => assertMilestoneTransition("PENDING", "APPROVED")).toThrow(/مجاز نیست/);
  });

  it("maps approvals and replies to deterministic states", () => {
    expect(milestoneStatusForDecision("APPROVED")).toBe("APPROVED");
    expect(milestoneStatusForDecision("REJECTED")).toBe("CHANGES_REQUESTED");
    expect(milestoneStatusForDecision("CHANGES_REQUESTED")).toBe("CHANGES_REQUESTED");
    expect(ticketStatusAfterReply(true)).toBe("WAITING_ON_CLIENT");
    expect(ticketStatusAfterReply(false)).toBe("WAITING_ON_STAFF");
  });
});

describe("financial state derivation", () => {
  const now = new Date("2026-09-08T12:00:00.000Z");

  it("calculates fractional quantities with integer half-up rounding", () => {
    expect(calculateLineTotal("1.2500", 1_000n)).toBe(1_250n);
    expect(calculateLineTotal("0.3333", 100n)).toBe(33n);

    expect(
      calculateInvoiceTotal({
        items: [
          { quantity: "2", unitAmount: 2_500n },
          { quantity: "0.5", unitAmount: 1_000n },
        ],
        discountAmount: 500n,
        taxAmount: 250n,
      }),
    ).toEqual({ subtotalAmount: 5_500n, totalAmount: 5_250n, lineTotals: [5_000n, 500n] });
  });

  it("refuses a negative invoice total", () => {
    expect(() =>
      calculateInvoiceTotal({
        items: [{ quantity: "1", unitAmount: 100n }],
        discountAmount: 101n,
        taxAmount: 0n,
      }),
    ).toThrow(/منفی/);
  });

  it("derives invoice states from successful allocated money and due date", () => {
    expect(
      deriveInvoiceStatus({
        currentStatus: "ISSUED",
        totalAmount: 10_000n,
        paidAmount: 10_000n,
        dueDate: new Date("2026-09-01T00:00:00.000Z"),
        issuedAt: new Date("2026-08-01T00:00:00.000Z"),
        now,
      }),
    ).toBe("PAID");
    expect(
      deriveInvoiceStatus({
        currentStatus: "ISSUED",
        totalAmount: 10_000n,
        paidAmount: 2_000n,
        issuedAt: new Date("2026-08-01T00:00:00.000Z"),
        now,
      }),
    ).toBe("PARTIALLY_PAID");
    expect(
      deriveInvoiceStatus({
        currentStatus: "ISSUED",
        totalAmount: 10_000n,
        paidAmount: 0n,
        dueDate: new Date("2026-09-07T00:00:00.000Z"),
        issuedAt: new Date("2026-08-01T00:00:00.000Z"),
        now,
      }),
    ).toBe("OVERDUE");
    expect(
      deriveInvoiceStatus({
        currentStatus: "VOID",
        totalAmount: 10_000n,
        paidAmount: 10_000n,
        now,
      }),
    ).toBe("VOID");
  });

  it("preserves waived installments and marks paid installments", () => {
    expect(
      deriveInstallmentStatus({
        currentStatus: "WAIVED",
        amount: 1_000n,
        paidAmount: 1_000n,
        now,
      }),
    ).toBe("WAIVED");
    expect(
      deriveInstallmentStatus({
        currentStatus: "PENDING",
        amount: 1_000n,
        paidAmount: 1_000n,
        now,
      }),
    ).toBe("PAID");
  });
});

describe("public action errors", () => {
  it("does not expose unexpected database errors", () => {
    const result = toActionError(new Error("postgres password=secret"));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("INTERNAL_ERROR");
      expect(result.error.message).not.toContain("secret");
      expect(result.error.message).not.toContain("postgres");
    }
  });
});
