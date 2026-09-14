import "server-only";

import { z } from "zod";

const optionalUrl = z.string().url().optional();
const optionalText = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().min(1).optional(),
);

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: optionalUrl.default("http://localhost:3000"),
  DATABASE_URL: z
    .string()
    .min(1)
    .default("postgresql://rycode:rycode_dev_only@localhost:5432/rycode"),
  BETTER_AUTH_URL: optionalUrl.default("http://localhost:3000"),
  BETTER_AUTH_SECRET: z
    .string()
    .min(32)
    .default("development-only-secret-change-before-production"),
  AUTH_EMAIL_MODE: z.enum(["smtp", "console", "disabled"]).default("console"),
  SMTP_HOST: optionalText,
  SMTP_PORT: z.coerce.number().int().min(1).max(65_535).default(587),
  SMTP_SECURE: z.enum(["true", "false"]).default("false"),
  SMTP_USER: optionalText,
  SMTP_PASS: optionalText,
  SMTP_FROM: optionalText,
  CLAMAV_HOST: optionalText,
  CLAMAV_PORT: z.coerce.number().int().min(1).max(65_535).default(3310),
  PRIVATE_STORAGE_ROOT: z.string().min(1).default("./storage/private"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(
    `Invalid server configuration: ${parsed.error.issues.map((issue) => issue.path.join(".")).join(", ")}`,
  );
}

if (
  parsed.data.NODE_ENV === "production" &&
  process.env.NEXT_PHASE !== "phase-production-build" &&
  parsed.data.BETTER_AUTH_SECRET === "development-only-secret-change-before-production"
) {
  throw new Error("BETTER_AUTH_SECRET must be replaced in production.");
}

const isProductionRuntime =
  parsed.data.NODE_ENV === "production" && process.env.NEXT_PHASE !== "phase-production-build";

if (isProductionRuntime && parsed.data.AUTH_EMAIL_MODE !== "smtp") {
  throw new Error("AUTH_EMAIL_MODE must be smtp in production.");
}

if (isProductionRuntime && !parsed.data.CLAMAV_HOST) {
  throw new Error("CLAMAV_HOST is required in production.");
}

if (parsed.data.AUTH_EMAIL_MODE === "smtp" && (!parsed.data.SMTP_HOST || !parsed.data.SMTP_FROM)) {
  throw new Error("SMTP_HOST and SMTP_FROM are required when AUTH_EMAIL_MODE=smtp.");
}

if (Boolean(parsed.data.SMTP_USER) !== Boolean(parsed.data.SMTP_PASS)) {
  throw new Error("SMTP_USER and SMTP_PASS must either both be set or both be omitted.");
}

export const env = parsed.data;
