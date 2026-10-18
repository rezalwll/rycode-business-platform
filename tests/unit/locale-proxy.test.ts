import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import proxy from "@/proxy";

describe("global brand icons and locale routing", () => {
  it.each(["/icon", "/icon?v=new", "/apple-icon", "/apple-icon?v=new"])("does not rewrite %s into a Persian HTML page", path => {
    const response = proxy(new NextRequest(`https://rycode.ir${path}`));
    expect(response.headers.get("x-middleware-next")).toBe("1");
    expect(response.headers.has("x-middleware-rewrite")).toBe(false);
  });
  it("retains canonical Persian and English public routing", () => {
    const fa = proxy(new NextRequest("https://rycode.ir/services"));
    expect(fa.headers.get("x-middleware-rewrite")).toBe("https://rycode.ir/fa/services");
    const en = proxy(new NextRequest("https://rycode.ir/en/services"));
    expect(en.headers.get("x-middleware-next")).toBe("1");
    const canonical = proxy(new NextRequest("https://rycode.ir/fa/services"));
    expect(canonical.status).toBe(308);
    expect(canonical.headers.get("location")).toBe("https://rycode.ir/services");
  });
});
