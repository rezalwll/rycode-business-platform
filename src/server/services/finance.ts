import "server-only";

import type { InvoiceStatus, PaymentStatus } from "@/generated/prisma/client";

import type { Actor } from "@/server/auth/permissions";
import { requirePermission } from "@/server/auth/permissions";
import { writeAudit } from "@/server/repositories/audit";
import { inTransaction, type Transaction } from "@/server/repositories/database";
import { lockIdempotencyKey } from "@/server/repositories/locks";
import { ServiceError } from "@/server/services/errors";

import {
  createInvoiceSchema,
  recalculateInvoiceSchema,
  recordPaymentSchema,
  updatePaymentStatusSchema,
} from "@/features/business/schemas";
import {
  calculateInvoiceTotal,
  deriveInstallmentStatus,
  deriveInvoiceStatus,
} from "@/features/business/transitions";

type RecalculatedInvoice = {
  id: string;
  status: InvoiceStatus;
  paidAmount: bigint;
};

function sumMoney(values: readonly bigint[]): bigint {
  return values.reduce((total, amount) => total + amount, 0n);
}

async function recalculateInvoices(
  transaction: Transaction,
  invoiceIds: readonly string[],
  now: Date,
): Promise<RecalculatedInvoice[]> {
  const uniqueInvoiceIds = [...new Set(invoiceIds)];
  const invoices = await transaction.invoice.findMany({
    where: { id: { in: uniqueInvoiceIds } },
    include: {
      allocations: {
        where: { payment: { status: "SUCCEEDED" } },
        select: { amount: true },
      },
      installments: {
        include: {
          allocations: {
            where: { payment: { status: "SUCCEEDED" } },
            select: { amount: true },
          },
        },
      },
    },
  });

  const results: RecalculatedInvoice[] = [];
  for (const invoice of invoices) {
    for (const installment of invoice.installments) {
      const paidAmount = sumMoney(installment.allocations.map(({ amount }) => amount));
      const status = deriveInstallmentStatus({
        currentStatus: installment.status,
        amount: installment.amount,
        paidAmount,
        dueDate: installment.dueDate,
        now,
      });
      if (status !== installment.status || (status === "PAID") !== Boolean(installment.paidAt)) {
        await transaction.installment.update({
          where: { id: installment.id },
          data: {
            status,
            paidAt: status === "PAID" ? (installment.paidAt ?? now) : null,
          },
        });
      }
    }

    const paidAmount = sumMoney(invoice.allocations.map(({ amount }) => amount));
    const status = deriveInvoiceStatus({
      currentStatus: invoice.status,
      totalAmount: invoice.totalAmount,
      paidAmount,
      dueDate: invoice.dueDate,
      issuedAt: invoice.issuedAt,
      now,
    });
    if (status !== invoice.status) {
      await transaction.invoice.update({ where: { id: invoice.id }, data: { status } });
    }
    results.push({ id: invoice.id, status, paidAmount });
  }
  return results;
}

export async function createInvoice(actor: Actor, rawInput: unknown) {
  requirePermission(actor, "finance.manage");
  const input = createInvoiceSchema.parse(rawInput);
  const totals = calculateInvoiceTotal(input);
  if (totals.totalAmount === 0n) {
    throw new ServiceError("INVALID_INPUT", "مبلغ نهایی فاکتور باید بیشتر از صفر باشد.");
  }
  const installmentTotal = sumMoney(input.installments.map(({ amount }) => amount));
  if (input.installments.some(({ amount }) => amount <= 0n)) {
    throw new ServiceError("INVALID_INPUT", "مبلغ هر قسط باید بیشتر از صفر باشد.");
  }
  if (input.installments.length > 0 && installmentTotal !== totals.totalAmount) {
    throw new ServiceError(
      "INVALID_INPUT",
      "جمع اقساط باید دقیقاً با مبلغ نهایی فاکتور برابر باشد.",
    );
  }

  return inTransaction(async (transaction) => {
    const client = await transaction.client.findFirst({
      where: { id: input.clientId, isActive: true, archivedAt: null },
      select: { id: true },
    });
    if (!client) throw new ServiceError("NOT_FOUND");
    if (input.projectId) {
      const project = await transaction.project.findFirst({
        where: { id: input.projectId, clientId: client.id, archivedAt: null },
        select: { id: true },
      });
      if (!project) throw new ServiceError("NOT_FOUND");
    }
    const duplicate = await transaction.invoice.findUnique({
      where: { number: input.number },
      select: { id: true },
    });
    if (duplicate) throw new ServiceError("CONFLICT", "شماره فاکتور قبلاً استفاده شده است.");

    const now = new Date();
    const invoice = await transaction.invoice.create({
      data: {
        clientId: client.id,
        ...(input.projectId ? { projectId: input.projectId } : {}),
        number: input.number,
        title: input.title,
        currency: input.currency,
        subtotalAmount: totals.subtotalAmount,
        discountAmount: input.discountAmount,
        taxAmount: input.taxAmount,
        totalAmount: totals.totalAmount,
        status: input.issueNow ? "ISSUED" : "DRAFT",
        ...(input.issueNow ? { issuedAt: now } : {}),
        ...(input.dueDate ? { dueDate: input.dueDate } : {}),
        ...(input.notes ? { notes: input.notes } : {}),
        items: {
          create: input.items.map((item, position) => ({
            description: item.description,
            quantity: item.quantity,
            unitAmount: item.unitAmount,
            totalAmount: totals.lineTotals[position] ?? 0n,
            position,
          })),
        },
        ...(input.installments.length > 0
          ? {
              installments: {
                create: input.installments.map((installment, position) => ({
                  label: installment.label,
                  amount: installment.amount,
                  position,
                  ...(installment.dueDate ? { dueDate: installment.dueDate } : {}),
                })),
              },
            }
          : {}),
      },
      select: { id: true, number: true, status: true, totalAmount: true, currency: true },
    });
    const [recalculated] = await recalculateInvoices(transaction, [invoice.id], now);
    await writeAudit(transaction, {
      actorUserId: actor.userId,
      action: "invoice.created",
      entityType: "invoice",
      entityId: invoice.id,
      after: {
        number: invoice.number,
        status: recalculated?.status ?? invoice.status,
        totalAmount: invoice.totalAmount.toString(),
        currency: invoice.currency,
      },
    });
    return {
      id: invoice.id,
      number: invoice.number,
      status: recalculated?.status ?? invoice.status,
      totalAmount: invoice.totalAmount.toString(),
      currency: invoice.currency,
    };
  });
}

export async function recordPayment(actor: Actor, rawInput: unknown) {
  requirePermission(actor, "finance.manage");
  const input = recordPaymentSchema.parse(rawInput);
  if (sumMoney(input.allocations.map(({ amount }) => amount)) !== input.amount) {
    throw new ServiceError("INVALID_INPUT", "جمع تخصیص‌ها باید با مبلغ پرداخت برابر باشد.");
  }
  const allocationKeys = input.allocations.map(
    ({ invoiceId, installmentId }) => `${invoiceId}:${installmentId ?? "invoice"}`,
  );
  if (new Set(allocationKeys).size !== allocationKeys.length) {
    throw new ServiceError("INVALID_INPUT", "یک تخصیص مالی تکراری ارسال شده است.");
  }

  return inTransaction(async (transaction) => {
    await lockIdempotencyKey(transaction, input.idempotencyKey);
    const existing = await transaction.payment.findUnique({
      where: { idempotencyKey: input.idempotencyKey },
      select: { id: true, clientId: true, amount: true, currency: true, status: true },
    });
    if (existing) {
      if (
        existing.clientId !== input.clientId ||
        existing.amount !== input.amount ||
        existing.currency !== input.currency
      ) {
        throw new ServiceError("CONFLICT", "کلید تکرار با یک پرداخت متفاوت ثبت شده است.");
      }
      return {
        id: existing.id,
        status: existing.status,
        amount: existing.amount.toString(),
        currency: existing.currency,
        reused: true,
      };
    }

    const invoiceIds = [...new Set(input.allocations.map(({ invoiceId }) => invoiceId))];
    const invoices = await transaction.invoice.findMany({
      where: { id: { in: invoiceIds } },
      include: {
        allocations: {
          where: { payment: { status: "SUCCEEDED" } },
          select: { amount: true },
        },
        installments: {
          include: {
            allocations: {
              where: { payment: { status: "SUCCEEDED" } },
              select: { amount: true },
            },
          },
        },
      },
    });
    if (invoices.length !== invoiceIds.length) throw new ServiceError("NOT_FOUND");

    for (const invoice of invoices) {
      if (
        invoice.clientId !== input.clientId ||
        invoice.currency !== input.currency ||
        invoice.status === "VOID"
      ) {
        throw new ServiceError("INVALID_STATE", "پرداخت با فاکتور انتخاب‌شده سازگار نیست.");
      }
      const addedToInvoice = sumMoney(
        input.allocations
          .filter(({ invoiceId }) => invoiceId === invoice.id)
          .map(({ amount }) => amount),
      );
      const currentlyPaid = sumMoney(invoice.allocations.map(({ amount }) => amount));
      if (currentlyPaid + addedToInvoice > invoice.totalAmount) {
        throw new ServiceError("INVALID_INPUT", "تخصیص پرداخت از مانده فاکتور بیشتر است.");
      }

      for (const allocation of input.allocations.filter(
        ({ invoiceId, installmentId }) => invoiceId === invoice.id && installmentId,
      )) {
        const installment = invoice.installments.find(({ id }) => id === allocation.installmentId);
        if (!installment || installment.status === "WAIVED") {
          throw new ServiceError("INVALID_INPUT", "قسط انتخاب‌شده متعلق به فاکتور نیست.");
        }
        const installmentPaid = sumMoney(installment.allocations.map(({ amount }) => amount));
        if (installmentPaid + allocation.amount > installment.amount) {
          throw new ServiceError("INVALID_INPUT", "تخصیص پرداخت از مانده قسط بیشتر است.");
        }
      }
    }

    if (input.providerReference) {
      const duplicateReference = await transaction.payment.findUnique({
        where: { providerReference: input.providerReference },
        select: { id: true },
      });
      if (duplicateReference) {
        throw new ServiceError("CONFLICT", "شناسه پرداخت درگاه قبلاً ثبت شده است.");
      }
    }

    const payment = await transaction.payment.create({
      data: {
        clientId: input.clientId,
        recordedById: actor.userId,
        status: "SUCCEEDED",
        method: input.method,
        amount: input.amount,
        currency: input.currency,
        idempotencyKey: input.idempotencyKey,
        paidAt: input.paidAt,
        ...(input.provider ? { provider: input.provider } : {}),
        ...(input.providerReference ? { providerReference: input.providerReference } : {}),
        allocations: {
          create: input.allocations.map((allocation) => ({
            invoiceId: allocation.invoiceId,
            ...(allocation.installmentId ? { installmentId: allocation.installmentId } : {}),
            amount: allocation.amount,
          })),
        },
      },
      select: { id: true, status: true, amount: true, currency: true },
    });
    const invoiceStates = await recalculateInvoices(transaction, invoiceIds, input.paidAt);
    await writeAudit(transaction, {
      actorUserId: actor.userId,
      action: "payment.recorded",
      entityType: "payment",
      entityId: payment.id,
      after: {
        status: payment.status,
        amount: payment.amount.toString(),
        currency: payment.currency,
        invoiceIds,
      },
    });
    return {
      id: payment.id,
      status: payment.status,
      amount: payment.amount.toString(),
      currency: payment.currency,
      invoices: invoiceStates.map((invoice) => ({
        ...invoice,
        paidAmount: invoice.paidAmount.toString(),
      })),
      reused: false,
    };
  });
}

const paymentTransitions: Readonly<Record<PaymentStatus, ReadonlySet<PaymentStatus>>> = {
  PENDING: new Set(["SUCCEEDED", "FAILED", "VOID"]),
  SUCCEEDED: new Set(["REFUNDED"]),
  FAILED: new Set(["VOID"]),
  REFUNDED: new Set(),
  VOID: new Set(),
};

export async function updatePaymentStatus(actor: Actor, rawInput: unknown) {
  requirePermission(actor, "finance.manage");
  const input = updatePaymentStatusSchema.parse(rawInput);

  return inTransaction(async (transaction) => {
    const payment = await transaction.payment.findUnique({
      where: { id: input.paymentId },
      include: { allocations: { select: { invoiceId: true } } },
    });
    if (!payment) throw new ServiceError("NOT_FOUND");
    if (payment.status === input.status) {
      return { id: payment.id, status: payment.status, changed: false };
    }
    if (!paymentTransitions[payment.status].has(input.status)) {
      throw new ServiceError("INVALID_STATE", "تغییر وضعیت پرداخت مجاز نیست.");
    }

    await transaction.payment.update({
      where: { id: payment.id },
      data: {
        status: input.status,
        ...(input.status === "SUCCEEDED" ? { paidAt: payment.paidAt ?? new Date() } : {}),
      },
    });
    await recalculateInvoices(
      transaction,
      payment.allocations.map(({ invoiceId }) => invoiceId),
      new Date(),
    );
    await writeAudit(transaction, {
      actorUserId: actor.userId,
      action: "payment.status_changed",
      entityType: "payment",
      entityId: payment.id,
      before: { status: payment.status },
      after: { status: input.status },
    });
    return { id: payment.id, status: input.status, changed: true };
  });
}

export async function recalculateInvoiceState(actor: Actor, rawInput: unknown) {
  requirePermission(actor, "finance.manage");
  const input = recalculateInvoiceSchema.parse(rawInput);

  return inTransaction(async (transaction) => {
    const invoice = await transaction.invoice.findUnique({
      where: { id: input.invoiceId },
      select: { id: true },
    });
    if (!invoice) throw new ServiceError("NOT_FOUND");
    const [state] = await recalculateInvoices(transaction, [invoice.id], new Date());
    if (!state) throw new ServiceError("NOT_FOUND");
    await writeAudit(transaction, {
      actorUserId: actor.userId,
      action: "invoice.recalculated",
      entityType: "invoice",
      entityId: invoice.id,
      after: { status: state.status, paidAmount: state.paidAmount.toString() },
    });
    return { id: state.id, status: state.status, paidAmount: state.paidAmount.toString() };
  });
}
