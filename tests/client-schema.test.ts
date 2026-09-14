import { describe, expect, it } from "vitest";

import { saveClientSchema, setClientMembersSchema } from "@/features/business/schemas";

const clientId = "11111111-1111-4111-8111-111111111111";

describe("client management validation", () => {
  it("accepts a client with structured billing data", () => {
    expect(
      saveClientSchema.safeParse({
        kind: "ORGANIZATION",
        displayName: "Example client",
        email: "billing@example.com",
        billingAddress: { city: "Tehran" },
        isActive: true,
      }).success,
    ).toBe(true);
  });

  it("rejects duplicate members and multiple primary contacts", () => {
    const member = { userId: "user-1", role: "OWNER", isPrimary: true };
    expect(setClientMembersSchema.safeParse({ clientId, members: [member, member] }).success).toBe(
      false,
    );
    expect(
      setClientMembersSchema.safeParse({
        clientId,
        members: [member, { userId: "user-2", role: "ADMIN", isPrimary: true }],
      }).success,
    ).toBe(false);
  });
});
