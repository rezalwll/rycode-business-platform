"use client";

import { useRef, useState } from "react";

import { secondaryButtonClass } from "@/components/portal/action-ui";
import {
  createInvoiceAction,
  recordPaymentAction,
  updatePaymentStatusAction,
  recalculateInvoiceAction,
} from "@/features/business/actions";
import {
  createInvoiceSchema,
  recordPaymentSchema,
  updatePaymentStatusSchema,
  recalculateInvoiceSchema,
} from "@/features/business/schemas";
import type { Locale } from "@/i18n/routing";

import {
  AdminField,
  AdminForm,
  AdminSelect,
  AdminText,
  label,
  optionalValue,
  statusOptions,
  textValue,
} from "./admin-form";

export function AdminCreateInvoice({
  locale,
  clients,
  projects,
}: {
  locale: Locale;
  clients: readonly { id: string; displayName: string }[];
  projects: readonly { id: string; name: string; clientId: string }[];
}) {
  const [clientId, setClientId] = useState("");
  const [items, setItems] = useState([0]);
  const [installments, setInstallments] = useState<number[]>([]);
  const nextRow = useRef(1);
  return (
    <div className="mt-8">
      <AdminForm
        locale={locale}
        title={label(locale, "صدور صورتحساب", "Issue an invoice")}
        description={label(
          locale,
          "مبالغ را به کوچک‌ترین واحد ارز انتخابی و بدون اعشار وارد کنید (ریال برای IRR). جمع اقساط باید با مبلغ نهایی برابر باشد.",
          "Use whole minor currency units (rials for IRR; cents for USD). Installments must equal the final total.",
        )}
        action={createInvoiceAction}
        schema={createInvoiceSchema}
        submit={label(locale, "صدور صورتحساب", "Issue invoice")}
        build={(data) => ({
          clientId: textValue(data, "clientId"),
          projectId: optionalValue(data, "projectId"),
          number: textValue(data, "number"),
          title: textValue(data, "title"),
          currency: textValue(data, "currency"),
          discountAmount: textValue(data, "discountAmount"),
          taxAmount: textValue(data, "taxAmount"),
          dueDate: optionalValue(data, "dueDate"),
          notes: optionalValue(data, "notes"),
          issueNow: true,
          items: items.map((row) => ({
            description: textValue(data, `itemDescription${row}`),
            quantity: textValue(data, `itemQuantity${row}`),
            unitAmount: textValue(data, `itemAmount${row}`),
          })),
          installments: installments.map((row) => ({
            label: textValue(data, `installmentLabel${row}`),
            amount: textValue(data, `installmentAmount${row}`),
            dueDate: optionalValue(data, `installmentDue${row}`),
          })),
        })}
      >
        <AdminSelect
          name="clientId"
          title={label(locale, "مشتری", "Client")}
          required
          onChange={setClientId}
          options={[
            { value: "", label: label(locale, "انتخاب مشتری", "Select a client") },
            ...clients.map((client) => ({ value: client.id, label: client.displayName })),
          ]}
        />
        <AdminSelect
          key={clientId}
          name="projectId"
          title={label(locale, "پروژه (اختیاری)", "Project (optional)")}
          options={[
            { value: "", label: label(locale, "بدون پروژه", "No project") },
            ...projects
              .filter((project) => project.clientId === clientId)
              .map((project) => ({ value: project.id, label: project.name })),
          ]}
        />
        <AdminField
          name="number"
          title={label(locale, "شماره یکتا", "Unique invoice number")}
          required
          minLength={2}
          maxLength={64}
          dir="ltr"
        />
        <AdminField
          name="title"
          title={label(locale, "عنوان", "Title")}
          required
          minLength={2}
          maxLength={240}
        />
        <AdminSelect
          name="currency"
          title={label(locale, "ارز", "Currency")}
          defaultValue="IRR"
          options={statusOptions(["IRR", "USD", "EUR", "GBP", "AED"])}
        />
        <AdminField name="dueDate" title={label(locale, "سررسید", "Due date")} type="date" />
        <AdminField
          name="discountAmount"
          title={label(locale, "تخفیف", "Discount")}
          inputMode="numeric"
          pattern="[0-9]+"
          defaultValue="0"
          required
        />
        <AdminField
          name="taxAmount"
          title={label(locale, "مالیات", "Tax")}
          inputMode="numeric"
          pattern="[0-9]+"
          defaultValue="0"
          required
        />
        <div className="space-y-4 sm:col-span-2">
          <h3 className="font-bold">{label(locale, "ردیف‌های صورتحساب", "Invoice items")}</h3>
          {items.map((row, index) => (
            <div
              key={row}
              className="grid gap-3 rounded-[5px] border border-border p-4 sm:grid-cols-3"
            >
              <AdminField
                name={`itemDescription${row}`}
                title={`${label(locale, "شرح ردیف", "Item description")} ${index + 1}`}
                required
                maxLength={2_000}
              />
              <AdminField
                name={`itemQuantity${row}`}
                title={label(locale, "تعداد", "Quantity")}
                inputMode="decimal"
                pattern="[0-9]+([.][0-9]{1,4})?"
                defaultValue="1"
                required
              />
              <AdminField
                name={`itemAmount${row}`}
                title={label(locale, "مبلغ واحد", "Unit amount")}
                inputMode="numeric"
                pattern="[0-9]+"
                required
              />
              {items.length > 1 && (
                <button
                  type="button"
                  className={secondaryButtonClass}
                  onClick={() => setItems((rows) => rows.filter((item) => item !== row))}
                >
                  {label(locale, "حذف ردیف", "Remove item")}
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className={secondaryButtonClass}
            disabled={items.length >= 200}
            onClick={() => setItems((rows) => [...rows, nextRow.current++])}
          >
            {label(locale, "افزودن ردیف", "Add item")}
          </button>
          <h3 className="pt-3 font-bold">
            {label(locale, "اقساط (اختیاری)", "Installments (optional)")}
          </h3>
          {installments.map((row) => (
            <div
              key={row}
              className="grid gap-3 rounded-[5px] border border-border p-4 sm:grid-cols-3"
            >
              <AdminField
                name={`installmentLabel${row}`}
                title={label(locale, "عنوان قسط", "Installment label")}
                required
                maxLength={160}
              />
              <AdminField
                name={`installmentAmount${row}`}
                title={label(locale, "مبلغ", "Amount")}
                inputMode="numeric"
                pattern="[0-9]+"
                required
              />
              <AdminField
                name={`installmentDue${row}`}
                title={label(locale, "سررسید", "Due date")}
                type="date"
              />
              <button
                type="button"
                className={secondaryButtonClass}
                onClick={() => setInstallments((rows) => rows.filter((item) => item !== row))}
              >
                {label(locale, "حذف قسط", "Remove installment")}
              </button>
            </div>
          ))}
          <button
            type="button"
            className={secondaryButtonClass}
            disabled={installments.length >= 100}
            onClick={() => setInstallments((rows) => [...rows, nextRow.current++])}
          >
            {label(locale, "افزودن قسط", "Add installment")}
          </button>
        </div>
        <AdminText
          name="notes"
          title={label(locale, "یادداشت برای مشتری", "Notes for the client")}
        />
      </AdminForm>
    </div>
  );
}

export function AdminInvoiceOperations({
  locale,
  invoice,
  payments,
}: {
  locale: Locale;
  invoice: {
    id: string;
    clientId: string;
    currency: string;
    status: string;
    outstanding: string;
    installments: readonly { id: string; label: string; status: string }[];
  };
  payments: readonly { id: string; status: string; reference: string | null }[];
}) {
  const paymentKey = useRef("");
  const [version, setVersion] = useState(0);
  return (
    <div className="mt-8 space-y-4">
      {!["VOID", "DRAFT", "PAID", "CANCELLED"].includes(invoice.status) &&
        BigInt(invoice.outstanding) > 0n && (
          <AdminForm
            key={version}
            locale={locale}
            title={label(locale, "ثبت پرداخت دریافت‌شده", "Record a received payment")}
            description={label(
              locale,
              `مبلغ به واحد ${invoice.currency} ثبت می‌شود. در صورت خطای ارتباط، ارسال مجدد همین فرم پرداخت تکراری نمی‌سازد.`,
              `Record whole minor units of ${invoice.currency}. Retrying this form after a connection error will not duplicate the payment.`,
            )}
            action={recordPaymentAction}
            schema={recordPaymentSchema}
            submit={label(locale, "ثبت پرداخت", "Record payment")}
            build={(data) => {
              paymentKey.current ||= crypto.randomUUID();
              const amount = textValue(data, "amount");
              return {
                clientId: invoice.clientId,
                currency: invoice.currency,
                amount,
                method: textValue(data, "method"),
                providerReference: optionalValue(data, "reference"),
                idempotencyKey: paymentKey.current,
                allocations: [
                  {
                    invoiceId: invoice.id,
                    amount,
                    installmentId: optionalValue(data, "installmentId"),
                  },
                ],
              };
            }}
          >
            <AdminField
              name="amount"
              title={label(locale, "مبلغ پرداخت", "Payment amount")}
              inputMode="numeric"
              pattern="[0-9]+"
              required
              defaultValue={invoice.outstanding}
            />
            <AdminSelect
              name="method"
              title={label(locale, "روش پرداخت", "Payment method")}
              options={statusOptions(["BANK_TRANSFER", "CARD", "CASH", "CHEQUE", "OTHER"])}
              defaultValue="BANK_TRANSFER"
            />
            <AdminField
              name="reference"
              title={label(locale, "شماره پیگیری (اختیاری)", "Payment reference (optional)")}
              maxLength={255}
              dir="ltr"
            />
            <AdminSelect
              name="installmentId"
              title={label(locale, "تخصیص به قسط", "Allocate to installment")}
              options={[
                { value: "", label: label(locale, "کل صورتحساب", "Invoice balance") },
                ...invoice.installments
                  .filter((item) => item.status !== "PAID")
                  .map((item) => ({ value: item.id, label: item.label })),
              ]}
            />
            <p className="text-xs leading-6 text-muted-foreground sm:col-span-2">
              {label(
                locale,
                "برای ثبت پرداخت متفاوت پس از ثبت موفق قبلی، «پرداخت جدید» را بزنید.",
                "After a successful payment, use “New payment” to record a different receipt.",
              )}
            </p>
            <button
              type="button"
              className={secondaryButtonClass}
              onClick={() => {
                paymentKey.current = "";
                setVersion((value) => value + 1);
              }}
            >
              {label(locale, "پرداخت جدید", "New payment")}
            </button>
          </AdminForm>
        )}
      <AdminForm
        locale={locale}
        title={label(locale, "به‌روزرسانی مانده", "Refresh invoice balance")}
        description={label(
          locale,
          "وضعیت صورتحساب و اقساط را بر اساس پرداخت‌های ثبت‌شده محاسبه کنید.",
          "Recalculate the invoice and installment status from recorded payments.",
        )}
        action={recalculateInvoiceAction}
        schema={recalculateInvoiceSchema}
        build={() => ({ invoiceId: invoice.id })}
      >
        <p className="text-sm text-muted-foreground sm:col-span-2">
          {label(
            locale,
            "پرداخت موفق در مانده لحاظ می‌شود.",
            "Only successful payments count toward the balance.",
          )}
        </p>
      </AdminForm>
      <div className="grid items-start gap-4 xl:grid-cols-2">
        {payments.map((payment) => (
          <AdminForm
            key={payment.id}
            locale={locale}
            title={`${label(locale, "وضعیت پرداخت", "Payment status")} · ${payment.reference ?? payment.id.slice(0, 8)}`}
            description={label(
              locale,
              "ابطال یا استرداد، مانده صورتحساب را تغییر می‌دهد؛ این گزینه وجهی جابه‌جا نمی‌کند.",
              "Voiding or refunding changes the ledger balance; this control does not transfer funds.",
            )}
            action={updatePaymentStatusAction}
            schema={updatePaymentStatusSchema}
            build={(data) => ({ paymentId: payment.id, status: textValue(data, "status") })}
          >
            <AdminSelect
              name="status"
              title={label(locale, "وضعیت", "Status")}
              defaultValue={payment.status === "PENDING" ? "SUCCEEDED" : payment.status}
              options={statusOptions(["SUCCEEDED", "FAILED", "REFUNDED", "VOID"])}
            />
          </AdminForm>
        ))}
      </div>
    </div>
  );
}
