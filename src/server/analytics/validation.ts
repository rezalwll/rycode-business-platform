import { z } from "zod";

export const analyticsEventNames = [
  "page_view",
  "cta_click",
  "form_started",
  "form_submitted",
  "search",
  "download",
  "login",
] as const;

export const analyticsPageTypes = [
  "marketing",
  "article",
  "service",
  "portal",
  "admin",
  "other",
] as const;

const optionalBoundedString = (maximum: number) => z.string().trim().min(1).max(maximum).optional();

export const analyticsEventSchema = z
  .object({
    anonymousId: z.string().uuid(),
    sessionKey: z.string().uuid(),
    consent: z.enum(["granted", "denied", "unknown"]),
    name: z.enum(analyticsEventNames),
    path: z
      .string()
      .trim()
      .min(1)
      .max(2048)
      .refine((value) => value.startsWith("/") && !value.startsWith("//"), "Invalid page path"),
    pageType: z.enum(analyticsPageTypes).optional(),
    entityType: optionalBoundedString(80),
    entityId: optionalBoundedString(128),
    label: optionalBoundedString(240),
    value: z.number().finite().min(-1_000_000_000_000).max(1_000_000_000_000).optional(),
    locale: z
      .string()
      .trim()
      .min(2)
      .max(10)
      .regex(/^[a-z]{2}(?:-[A-Z]{2})?$/)
      .optional(),
    referrer: optionalBoundedString(2048),
    utmSource: optionalBoundedString(255),
    utmMedium: optionalBoundedString(255),
    utmCampaign: optionalBoundedString(255),
    metadata: z.unknown().optional(),
  })
  .strict();

export type AnalyticsEventInput = z.infer<typeof analyticsEventSchema>;

export type AnalyticsMetadataValue =
  | string
  | number
  | boolean
  | null
  | AnalyticsMetadataValue[]
  | { [key: string]: AnalyticsMetadataValue };

export type AnalyticsMetadata = Record<string, AnalyticsMetadataValue>;

export class AnalyticsMetadataError extends Error {
  override readonly name = "AnalyticsMetadataError";
}

const FORBIDDEN_KEYS = new Set(["__proto__", "constructor", "prototype"]);
const MAX_METADATA_KEYS = 20;
const MAX_ARRAY_ITEMS = 10;
const MAX_STRING_LENGTH = 256;
const MAX_DEPTH = 2;
const MAX_SERIALIZED_BYTES = 4096;

function sanitizeValue(value: unknown, depth: number): AnalyticsMetadataValue {
  if (value === null || typeof value === "boolean") return value;
  if (typeof value === "number") {
    if (!Number.isFinite(value))
      throw new AnalyticsMetadataError("Metadata numbers must be finite.");
    return value;
  }
  if (typeof value === "string") return value.slice(0, MAX_STRING_LENGTH);
  if (depth >= MAX_DEPTH)
    throw new AnalyticsMetadataError("Analytics metadata is too deeply nested.");

  if (Array.isArray(value)) {
    if (value.length > MAX_ARRAY_ITEMS) {
      throw new AnalyticsMetadataError("Analytics metadata arrays are too large.");
    }
    return value.map((item) => sanitizeValue(item, depth + 1));
  }

  if (typeof value === "object") {
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) {
      throw new AnalyticsMetadataError("Analytics metadata must be plain JSON.");
    }
    const entries = Object.entries(value);
    if (entries.length > MAX_METADATA_KEYS) {
      throw new AnalyticsMetadataError("Analytics metadata has too many keys.");
    }
    const result: Record<string, AnalyticsMetadataValue> = Object.create(null) as Record<
      string,
      AnalyticsMetadataValue
    >;
    for (const [key, nestedValue] of entries) {
      if (key.length === 0 || key.length > 64 || FORBIDDEN_KEYS.has(key)) {
        throw new AnalyticsMetadataError("Analytics metadata contains an invalid key.");
      }
      result[key] = sanitizeValue(nestedValue, depth + 1);
    }
    return result;
  }

  throw new AnalyticsMetadataError("Analytics metadata contains a non-JSON value.");
}

export function sanitizeAnalyticsMetadata(value: unknown): AnalyticsMetadata | undefined {
  if (value === undefined) return undefined;
  if (value === null || Array.isArray(value) || typeof value !== "object") {
    throw new AnalyticsMetadataError("Analytics metadata must be an object.");
  }

  const sanitized = sanitizeValue(value, 0) as AnalyticsMetadata;
  if (new TextEncoder().encode(JSON.stringify(sanitized)).byteLength > MAX_SERIALIZED_BYTES) {
    throw new AnalyticsMetadataError("Analytics metadata exceeds the size limit.");
  }
  return sanitized;
}

export function sanitizeReferrer(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return undefined;
    return `${parsed.origin}${parsed.pathname}`.slice(0, 2048);
  } catch {
    return undefined;
  }
}
