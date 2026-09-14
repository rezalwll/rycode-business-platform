import { createHmac } from "node:crypto";

export type AnalyticsIdentifierKind = "anonymous" | "session" | "user-agent" | "client";

export function hashAnalyticsIdentifier(
  secret: string,
  kind: AnalyticsIdentifierKind,
  rawValue: string,
): string {
  return createHmac("sha256", secret)
    .update(`rycode-analytics-v1:${kind}:`, "utf8")
    .update(rawValue, "utf8")
    .digest("hex");
}
