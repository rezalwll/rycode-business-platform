import { describe, expect, it } from "vitest";

import { saveSiteSettingSchema } from "@/features/settings/schemas";

describe("site setting validation", () => {
  it("accepts namespaced non-secret JSON settings", () => {
    expect(
      saveSiteSettingSchema.safeParse({
        key: "site.contact_email",
        value: { address: "hello@example.com" },
        visibility: "PUBLIC",
      }).success,
    ).toBe(true);
  });

  it.each(["Invalid Key", ".leading", "trailing.", "double..dot"])(
    "rejects unsafe setting keys: %s",
    (key) => {
      expect(
        saveSiteSettingSchema.safeParse({ key, value: {}, visibility: "PRIVATE" }).success,
      ).toBe(false);
    },
  );

  it("does not accept SECRET as a panel-managed visibility", () => {
    expect(
      saveSiteSettingSchema.safeParse({ key: "api.token", value: "hidden", visibility: "SECRET" })
        .success,
    ).toBe(false);
  });
});
