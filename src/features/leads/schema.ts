import { z } from "zod";

export const leadKinds = ["project", "technical_review", "seo_audit", "contact"] as const;
export type LeadKind = (typeof leadKinds)[number];

const optionalShortText = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().max(160).optional(),
);

const optionalUrl = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().max(500).url().optional(),
);

const optionalEmail = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().max(254).email().optional(),
);

const optionalPhone = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z
    .string()
    .trim()
    .min(7)
    .max(32)
    .regex(/^[+0-9()\-\s]+$/u, "Invalid phone number")
    .optional(),
);

export const leadRequestSchema = z
  .object({
    kind: z.enum(leadKinds),
    locale: z.enum(["fa", "en"]),
    fullName: z.string().trim().min(2).max(120),
    email: optionalEmail,
    phone: optionalPhone,
    company: optionalShortText,
    websiteUrl: optionalUrl,
    projectType: optionalShortText,
    budget: optionalShortText,
    timeline: optionalShortText,
    message: z.string().trim().min(10).max(5_000),
    consent: z.literal(true),
    sourcePath: z.string().trim().startsWith("/").max(300),
    startedAt: z.coerce.number().int().positive(),
    website: z.string().max(0),
    analyticsAnonymousId: z.string().uuid().optional(),
    analyticsSessionKey: z.string().uuid().optional(),
  })
  .superRefine((value, context) => {
    if (Boolean(value.analyticsAnonymousId) !== Boolean(value.analyticsSessionKey)) {
      context.addIssue({
        code: "custom",
        path: ["analyticsSessionKey"],
        message: "Analytics attribution identifiers must be provided together",
      });
    }
    if (!value.email && !value.phone) {
      context.addIssue({
        code: "custom",
        path: ["email"],
        message: "Provide an email address or phone number",
      });
      context.addIssue({
        code: "custom",
        path: ["phone"],
        message: "Provide an email address or phone number",
      });
    }

    if ((value.kind === "technical_review" || value.kind === "seo_audit") && !value.websiteUrl) {
      context.addIssue({
        code: "custom",
        path: ["websiteUrl"],
        message: "Website URL is required for this request",
      });
    }
  });

export type LeadRequest = z.infer<typeof leadRequestSchema>;

export const MINIMUM_FORM_FILL_MS = 1_800;
export const MAXIMUM_FORM_AGE_MS = 24 * 60 * 60 * 1_000;

export type LeadValidationResult =
  | { status: "valid"; data: LeadRequest }
  | { status: "spam" }
  | { status: "invalid"; fieldErrors: Record<string, string[]> };

export function validateLeadSubmission(input: unknown, now = Date.now()): LeadValidationResult {
  if (
    typeof input === "object" &&
    input !== null &&
    "website" in input &&
    typeof input.website === "string" &&
    input.website.length > 0
  ) {
    return { status: "spam" };
  }

  const parsed = leadRequestSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "invalid", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const elapsed = now - parsed.data.startedAt;
  if (elapsed < MINIMUM_FORM_FILL_MS || elapsed > MAXIMUM_FORM_AGE_MS) {
    return {
      status: "invalid",
      fieldErrors: { startedAt: ["The form session is no longer valid"] },
    };
  }

  return { status: "valid", data: parsed.data };
}

function formString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export function leadInputFromFormData(formData: FormData) {
  return {
    kind: formString(formData, "kind"),
    locale: formString(formData, "locale"),
    fullName: formString(formData, "fullName"),
    email: formString(formData, "email"),
    phone: formString(formData, "phone"),
    company: formString(formData, "company"),
    websiteUrl: formString(formData, "websiteUrl"),
    projectType: formString(formData, "projectType"),
    budget: formString(formData, "budget"),
    timeline: formString(formData, "timeline"),
    message: formString(formData, "message"),
    consent: formData.get("consent") === "on",
    sourcePath: formString(formData, "sourcePath"),
    startedAt: formString(formData, "startedAt"),
    website: formString(formData, "website"),
    analyticsAnonymousId: formString(formData, "analyticsAnonymousId") || undefined,
    analyticsSessionKey: formString(formData, "analyticsSessionKey") || undefined,
  };
}
