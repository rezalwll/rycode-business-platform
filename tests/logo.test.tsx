import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import type { ImgHTMLAttributes } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));
import { Logo, LogoMark, LOGO_MARK_SRC, LOGO_MARK_LIGHT_SRC } from "@/components/site/logo";
import { BRAND_APPLE_ICON_SRC, BRAND_ICON_SRC, BRAND_MARK_HEIGHT, BRAND_MARK_SRC, BRAND_MARK_WIDTH } from "@/lib/brand";
import { createBrandIcon } from "@/lib/brand-icon";
import manifest from "@/app/manifest";

describe("the owner's supplied rounded blue chevron", () => {
  it("preserves the exact supplied PNG, its transparency and portrait aspect ratio", () => {
    const bytes = readFileSync(new URL("../public/brand/rycode-chevron.png", import.meta.url));
    expect(createHash("sha256").update(bytes).digest("hex")).toBe("5512e30e034faa4d79e0bd0a941e54e5075c4680d81b46f54a3c2963899215a7");
    expect(bytes.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
    expect(bytes.readUInt32BE(16)).toBe(BRAND_MARK_WIDTH);
    expect(bytes.readUInt32BE(20)).toBe(BRAND_MARK_HEIGHT);
    expect(bytes[25]).toBe(6); // RGBA, not an opaque black background.
    expect(LOGO_MARK_SRC).toBe("/brand/rycode-chevron.png");
    expect(LOGO_MARK_LIGHT_SRC).toBe(LOGO_MARK_SRC);
  });

  it("uses one unchanged mark in every header/theme variant and preserves the wordmark", () => {
    for (const variant of ["default", "light", "adaptive"] as const) {
      const html = renderToStaticMarkup(<Logo variant={variant} />);
      expect(html.match(/<img /g)).toHaveLength(1);
      expect(html).toContain(`src="${BRAND_MARK_SRC}"`);
      expect(html).toContain('class="rycode-wordmark-prefix">RY</span>');
      expect(html).toContain('class="rycode-wordmark-suffix">CODE</span>');
      expect(html).toContain(`data-variant="${variant}"`);
      expect(html).not.toMatch(/brightness-0|invert|feColorMatrix|dark:hidden|hidden dark:block/);
    }
  });

  it("uses the same new mark for standalone and decorative logos", () => {
    for (const variant of ["default", "light", "adaptive"] as const) {
      const html = renderToStaticMarkup(<LogoMark variant={variant} />);
      expect(html).toContain('alt="RYCODE"');
      expect(html).toContain(`src="${BRAND_MARK_SRC}"`);
      expect(html).toContain('width="1109"');
      expect(html).toContain('height="1418"');
      expect(html).toContain("object-contain");
    }
    expect(renderToStaticMarkup(<LogoMark alt="" />)).toContain('alt=""');
  });

  it("removes old logo and favicon references from every active brand consumer", () => {
    for (const file of [
      "src/components/site/logo.tsx", "src/components/site/footer.tsx",
      "src/components/portal/portal-shell.tsx", "src/components/template/reference-impact.tsx",
      "src/components/template/reference-desktop-app.tsx", "src/components/template/reference-insights.tsx",
      "src/components/public/catalog-pages.tsx", "src/components/public/cms-catalog.tsx",
      "src/app/[locale]/layout.tsx", "src/app/manifest.ts", "src/routes/__root.tsx",
    ]) {
      const source = readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
      expect(source).not.toMatch(/rycode-logo-blue\.svg|rycode-logo-white\.svg|rycode-black\.svg|rycode-white\.svg|rycode-favicon\.png/);
    }
    const footer = readFileSync(new URL("../src/components/site/footer.tsx", import.meta.url), "utf8");
    expect(footer).toContain('<LogoMark className="coorda-footer-mark"');
    const portal = readFileSync(new URL("../src/components/portal/portal-shell.tsx", import.meta.url), "utf8");
    expect(portal).toContain('<Logo variant="light"');
  });

  it("uses the new square icon in the app manifest and mobile metadata", () => {
    expect(manifest().icons).toEqual([{ src: BRAND_ICON_SRC, sizes: "512x512", type: "image/png", purpose: "any" }]);
    expect(BRAND_APPLE_ICON_SRC).toBe("/apple-icon");
    const layout = readFileSync(new URL("../src/app/[locale]/layout.tsx", import.meta.url), "utf8");
    expect(layout).toContain("url: BRAND_APPLE_ICON_SRC");
    const css = readFileSync(new URL("../src/components/site/footer-fluid.css", import.meta.url), "utf8");
    expect(css).toContain(".coorda-footer-mark");
    expect(css).toContain("object-fit: contain");
  });

  it("keeps the English footer wordmark on the left and its separate mark on the right", () => {
    const css = readFileSync(new URL("../src/components/site/footer-fluid.css", import.meta.url), "utf8");
    expect(css).toMatch(/\.coorda-footer-brand\s*\{[^}]*grid-template-columns: minmax\(0, 1fr\) auto;/);
    expect(css).toMatch(/\.coorda-footer-wordmark\s*\{[^}]*justify-self: start;/);
    expect(css).toMatch(/\.coorda-footer-identity\s*\{[^}]*justify-self: end;/);
    const footer = readFileSync(new URL("../src/components/site/footer.tsx", import.meta.url), "utf8");
    expect(footer).toContain('className="coorda-footer-brand" dir="ltr"');
    expect(footer).toContain("<LogoWordmark />");
    expect(footer.indexOf('className="coorda-footer-wordmark"')).toBeLessThan(footer.indexOf('className="coorda-footer-identity"'));
    expect(footer).not.toMatch(/className="coorda-footer-wordmark">\s*<LogoMark/);
  });

  it.each([180, 512])("renders a valid %i-pixel square PNG without stretching the mark", async size => {
    const response = await createBrandIcon(size);
    const bytes = Buffer.from(await response.arrayBuffer());
    expect(response.headers.get("content-type")).toContain("image/png");
    expect(bytes.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
    expect(bytes.readUInt32BE(16)).toBe(size);
    expect(bytes.readUInt32BE(20)).toBe(size);
  });
});
