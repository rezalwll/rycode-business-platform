import { describe, expect, it } from "vitest";

import { assertSuperAdminContinuity } from "@/features/access/policy";

describe("role assignment safety", () => {
  it("prevents removing the final super administrator", () => {
    expect(() =>
      assertSuperAdminContinuity({
        targetIsSuperAdmin: true,
        targetWillBeSuperAdmin: false,
        otherSuperAdminCount: 0,
      }),
    ).toThrow(/Super Admin/);
  });

  it("allows safe role changes", () => {
    expect(() =>
      assertSuperAdminContinuity({
        targetIsSuperAdmin: true,
        targetWillBeSuperAdmin: false,
        otherSuperAdminCount: 1,
      }),
    ).not.toThrow();
    expect(() =>
      assertSuperAdminContinuity({
        targetIsSuperAdmin: true,
        targetWillBeSuperAdmin: true,
        otherSuperAdminCount: 0,
      }),
    ).not.toThrow();
  });
});
