import { z } from "zod";

const uuid = z.string().uuid();
const userId = z.string().trim().min(1).max(191);
const optionalDate = z.coerce.date().optional();
const optionalText = (maximum: number) =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().trim().max(maximum).optional(),
  );

export const saveClientSchema = z.object({
  clientId: uuid.optional(),
  kind: z.enum(["INDIVIDUAL", "ORGANIZATION"]),
  displayName: z.string().trim().min(2).max(200),
  legalName: optionalText(240),
  email: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().trim().email().max(320).optional(),
  ),
  phone: optionalText(32),
  taxId: optionalText(64),
  billingAddress: z.json().nullable(),
  isActive: z.boolean(),
});

export const setClientMembersSchema = z
  .object({
    clientId: uuid,
    members: z
      .array(
        z.object({
          userId,
          role: z.enum(["OWNER", "ADMIN", "MEMBER", "BILLING", "VIEWER"]),
          isPrimary: z.boolean(),
        }),
      )
      .max(500),
  })
  .superRefine((value, context) => {
    const userIds = value.members.map(({ userId: memberUserId }) => memberUserId);
    if (new Set(userIds).size !== userIds.length) {
      context.addIssue({
        code: "custom",
        path: ["members"],
        message: "Duplicate users are not allowed.",
      });
    }
    if (value.members.filter(({ isPrimary }) => isPrimary).length > 1) {
      context.addIssue({
        code: "custom",
        path: ["members"],
        message: "Only one primary member is allowed.",
      });
    }
  });

export const leadStatuses = [
  "NEW",
  "QUALIFIED",
  "CONTACTED",
  "PROPOSAL",
  "WON",
  "LOST",
  "SPAM",
  "ARCHIVED",
] as const;

export const updateLeadStatusSchema = z.object({
  leadId: uuid,
  status: z.enum(leadStatuses),
  note: optionalText(5_000),
});

export const addLeadNoteSchema = z.object({
  leadId: uuid,
  note: z.string().trim().min(1).max(5_000),
});

export const assignLeadSchema = z.object({
  leadId: uuid,
  ownerId: userId.nullable(),
});

const newClientSchema = z.object({
  displayName: z.string().trim().min(2).max(200),
  legalName: optionalText(240),
  email: z.string().trim().email().max(320).optional(),
  phone: optionalText(32),
  memberUserId: userId.optional(),
});

export const convertLeadSchema = z
  .object({
    leadId: uuid,
    clientId: uuid.optional(),
    client: newClientSchema.optional(),
    project: z.object({
      name: z.string().trim().min(2).max(220),
      number: z.string().trim().min(2).max(48).optional(),
      slug: optionalText(180),
      scope: optionalText(20_000),
      status: z.enum(["DRAFT", "PLANNED", "ACTIVE"]).default("PLANNED"),
      startDate: optionalDate,
      expectedEndDate: optionalDate,
    }),
  })
  .refine((value) => !(value.clientId && value.client), {
    message: "Choose an existing client or provide a new client, not both.",
    path: ["clientId"],
  });

export const projectStatuses = [
  "DRAFT",
  "PLANNED",
  "ACTIVE",
  "ON_HOLD",
  "COMPLETED",
  "CANCELLED",
  "ARCHIVED",
] as const;

export const createProjectSchema = z
  .object({
    clientId: uuid,
    name: z.string().trim().min(2).max(220),
    number: z.string().trim().min(2).max(48).optional(),
    slug: optionalText(180),
    scope: optionalText(20_000),
    status: z.enum(projectStatuses).default("DRAFT"),
    progress: z.number().int().min(0).max(100).default(0),
    startDate: optionalDate,
    expectedEndDate: optionalDate,
  })
  .refine(
    (value) =>
      !value.startDate || !value.expectedEndDate || value.startDate <= value.expectedEndDate,
    { message: "Expected end date must not precede the start date.", path: ["expectedEndDate"] },
  );

export const updateProjectSchema = z
  .object({
    projectId: uuid,
    name: z.string().trim().min(2).max(220).optional(),
    slug: optionalText(180),
    scope: optionalText(20_000),
    status: z.enum(projectStatuses).optional(),
    progress: z.number().int().min(0).max(100).optional(),
    startDate: z.coerce.date().nullable().optional(),
    expectedEndDate: z.coerce.date().nullable().optional(),
    latestUpdate: optionalText(10_000),
    clientAction: optionalText(5_000),
    internalNote: optionalText(10_000),
  })
  .refine((value) => Object.keys(value).some((key) => key !== "projectId"), {
    message: "At least one project field must be changed.",
  });

export const milestoneStatuses = [
  "PENDING",
  "IN_PROGRESS",
  "AWAITING_APPROVAL",
  "CHANGES_REQUESTED",
  "APPROVED",
  "COMPLETED",
  "BLOCKED",
  "CANCELLED",
] as const;

const milestoneFields = {
  kind: z
    .enum(["DISCOVERY", "DESIGN", "DEVELOPMENT", "REVIEW", "DELIVERY", "CUSTOM"])
    .default("CUSTOM"),
  title: z.string().trim().min(2).max(220),
  description: optionalText(20_000),
  status: z.enum(milestoneStatuses).default("PENDING"),
  position: z.number().int().min(0).max(10_000),
  progress: z.number().int().min(0).max(100).default(0),
  startDate: optionalDate,
  expectedEndDate: optionalDate,
  approvalRequired: z.boolean().default(false),
};

export const createMilestoneSchema = z.object({ projectId: uuid, ...milestoneFields });

export const updateMilestoneSchema = z
  .object({
    milestoneId: uuid,
    kind: milestoneFields.kind.optional(),
    title: milestoneFields.title.optional(),
    description: optionalText(20_000),
    status: z.enum(milestoneStatuses).optional(),
    position: milestoneFields.position.optional(),
    progress: milestoneFields.progress.optional(),
    startDate: z.coerce.date().nullable().optional(),
    expectedEndDate: z.coerce.date().nullable().optional(),
    approvalRequired: z.boolean().optional(),
  })
  .refine((value) => Object.keys(value).some((key) => key !== "milestoneId"), {
    message: "At least one milestone field must be changed.",
  });

export const approveMilestoneSchema = z.object({
  milestoneId: uuid,
  decision: z.enum(["APPROVED", "REJECTED", "CHANGES_REQUESTED"]),
  note: optionalText(5_000),
});

export const createTicketSchema = z.object({
  clientId: uuid,
  projectId: uuid.optional(),
  subject: z.string().trim().min(3).max(240),
  body: z.string().trim().min(2).max(30_000),
  category: z.enum(["GENERAL", "TECHNICAL", "BILLING", "PROJECT"]).default("GENERAL"),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).default("NORMAL"),
});

export const replyTicketSchema = z.object({
  ticketId: uuid,
  body: z.string().trim().min(1).max(30_000),
  visibility: z.enum(["PUBLIC", "INTERNAL"]).default("PUBLIC"),
});

export const resolveTicketSchema = z.object({
  ticketId: uuid,
  note: optionalText(5_000),
});

const integerMoney = z
  .union([
    z.string().regex(/^\d+$/),
    z.number().safe().int().nonnegative(),
    z.bigint().nonnegative(),
  ])
  .transform((value) => BigInt(value));

const currency = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{3}$/);

export const createInvoiceSchema = z
  .object({
    clientId: uuid,
    projectId: uuid.optional(),
    number: z.string().trim().min(2).max(64),
    title: z.string().trim().min(2).max(240),
    currency,
    discountAmount: integerMoney.default(0n),
    taxAmount: integerMoney.default(0n),
    dueDate: optionalDate,
    issueNow: z.boolean().default(false),
    notes: optionalText(20_000),
    items: z
      .array(
        z.object({
          description: z.string().trim().min(1).max(2_000),
          quantity: z.string().regex(/^\d+(?:\.\d{1,4})?$/),
          unitAmount: integerMoney,
        }),
      )
      .min(1)
      .max(200),
    installments: z
      .array(
        z.object({
          label: z.string().trim().min(1).max(160),
          amount: integerMoney,
          dueDate: optionalDate,
        }),
      )
      .max(100)
      .default([]),
  })
  .superRefine((value, context) => {
    if (value.projectId && !value.clientId) {
      context.addIssue({ code: "custom", message: "A project invoice requires a client." });
    }
  });

export const recordPaymentSchema = z.object({
  clientId: uuid,
  method: z.enum(["BANK_TRANSFER", "CARD", "CASH", "CHEQUE", "GATEWAY", "OTHER"]),
  amount: integerMoney.refine((value) => value > 0n, "Payment amount must be positive."),
  currency,
  idempotencyKey: z.string().trim().min(8).max(180),
  provider: optionalText(120),
  providerReference: optionalText(255),
  paidAt: z.coerce.date().default(() => new Date()),
  allocations: z
    .array(
      z.object({
        invoiceId: uuid,
        installmentId: uuid.optional(),
        amount: integerMoney.refine((value) => value > 0n, "Allocation must be positive."),
      }),
    )
    .min(1)
    .max(200),
});

export const updatePaymentStatusSchema = z.object({
  paymentId: uuid,
  status: z.enum(["SUCCEEDED", "FAILED", "REFUNDED", "VOID"]),
});

export const recalculateInvoiceSchema = z.object({ invoiceId: uuid });

export const markNotificationReadSchema = z.object({ notificationId: uuid });

export const updateProfileSchema = z.object({
  displayName: z.string().trim().min(2).max(160),
  phone: optionalText(32),
  company: optionalText(200),
  locale: z.enum(["fa", "en"]),
  timezone: z.string().trim().min(1).max(64),
  bio: optionalText(5_000),
});

export type ConvertLeadInput = z.infer<typeof convertLeadSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type CreateMilestoneInput = z.infer<typeof createMilestoneSchema>;
export type UpdateMilestoneInput = z.infer<typeof updateMilestoneSchema>;
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>;
