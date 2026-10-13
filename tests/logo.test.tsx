import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import type { ImgHTMLAttributes } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));
import { Logo, LogoMark, LOGO_MARK_SRC, LOGO_MARK_LIGHT_SRC } from "@/components/site/logo";

describe("blue and black RYCODE logo", () => {
  const blueAsset = readFileSync(new URL("../public/brand/rycode-logo-blue.svg", import.meta.url), "utf8");
  const whiteAsset = readFileSync(new URL("../public/brand/rycode-logo-white.svg", import.meta.url), "utf8");
  it("keeps the original artwork intact and embeds the same silhouette in a standalone blue file", () => {
    expect(LOGO_MARK_SRC).toBe("/brand/rycode-logo-blue.svg");
    const bytes = readFileSync(new URL("../public/brand/rycode-logo-orange.jpg", import.meta.url));
    expect(createHash("sha256").update(bytes).digest("hex")).toBe(
      "a9c89435033a2367008de2367e2dd186395ac291bd12ea2c16609a6d07c5b99f",
    );
    for (const asset of [blueAsset, whiteAsset]) {
      const embedded = asset.match(/href="data:image\/jpeg;base64,([^"]+)"/)![1]!;
      expect(Buffer.from(embedded, "base64")).toEqual(bytes);
    }
  });
  it("uses the blue file and unchanged lettering in every header mode", () => {
    for (const variant of ["default", "light", "adaptive"] as const) {
      const html = renderToStaticMarkup(<Logo variant={variant} />);
      expect(html).toContain(`src="${LOGO_MARK_LIGHT_SRC}"`);
      if (variant === "light") {
        expect(html).not.toContain(`src="${LOGO_MARK_SRC}"`);
      } else {
        expect(html).toContain(`src="${LOGO_MARK_SRC}"`);
        expect(html).toContain("block dark:hidden");
        expect(html).toContain("hidden dark:block");
      }
      expect(html).toContain("text-[var(--logo-color)]");
      expect(html).toContain('class="rycode-wordmark-prefix">RY</span>');
      expect(html).toContain('class="rycode-wordmark-suffix">CODE</span>');
      expect(html).toContain(`data-variant="${variant}"`);
      expect(html).not.toContain("brightness-0");
      expect(html).not.toContain("invert");
      expect(html).not.toContain("feColorMatrix");
      expect(html).not.toContain("filter:url(");
    }
  });
  it("uses the same self-contained blue file for standalone marks", () => {
    const html = renderToStaticMarkup(<LogoMark />);
    expect(html).toContain('alt="RYCODE"');
    expect(html).toContain(LOGO_MARK_SRC);
    expect(html).toContain(LOGO_MARK_LIGHT_SRC);
    const overlay = renderToStaticMarkup(<LogoMark variant="light" />);
    expect(overlay).toContain(LOGO_MARK_LIGHT_SRC);
    expect(overlay).not.toContain(`src="${LOGO_MARK_SRC}"`);
  });
  it("keeps standalone wordmark files black/blue or white/blue according to their surface", () => {
    for (const [variant, prefix] of [["black", "#171717"], ["white", "#fff"]]) {
      const svg = readFileSync(new URL(`../public/coorda-template/rycode-${variant}.svg`, import.meta.url), "utf8");
      expect(svg).toContain(`<tspan fill="${prefix}">RY</tspan>`);
      expect(svg).toContain('<tspan fill="#66C0FF">CODE</tspan>');
    }
  });
  it("colors the diagonal R leg and both chevrons black inside the actual shared logo file", () => {
    expect(blueAsset).toContain('id="rycode-contrast-details" clipPathUnits="userSpaceOnUse"');
    expect(blueAsset).toContain('<polygon points="523,616 755,616 1135,991 901,991"/>');
    expect(blueAsset).toContain('<rect x="0" y="350" width="240" height="380"/>');
    expect(blueAsset).toContain('<rect x="1200" y="350" width="248" height="380"/>');
    expect(blueAsset).toContain('<g clip-path="url(#rycode-contrast-details)">');
    expect(blueAsset).toContain('<use href="#rycode-artwork" filter="url(#rycode-black)"/>');
    expect(blueAsset).toContain('flood-color="#66C0FF"');
    expect(blueAsset).toContain('flood-color="#171717"');
    // Both colors remove white-background JPEG noise before applying solid ink.
    expect(blueAsset.match(/tableValues="0 0 1 1"/g)).toHaveLength(2);
    expect(blueAsset.match(/in2="clean-mask" operator="in"/g)).toHaveLength(2);
  });
  it("preserves the brand blue, black diagonal leg and white chevrons on dark backgrounds", () => {
    expect(LOGO_MARK_LIGHT_SRC).toBe("/brand/rycode-logo-white.svg");
    expect(whiteAsset).toContain('flood-color="#fff"');
    expect(whiteAsset).toContain('flood-color="#66C0FF"');
    expect(whiteAsset).toContain('flood-color="#171717"');
    expect(whiteAsset).toContain('<use href="#rycode-artwork" filter="url(#rycode-blue)"/>');
    expect(whiteAsset).toContain('<g clip-path="url(#rycode-contrast-details)">');
    for (const region of [
      '<polygon points="523,616 755,616 1135,991 901,991"/>',
      '<rect x="0" y="350" width="240" height="380"/>',
      '<rect x="1200" y="350" width="248" height="380"/>',
    ]) {
      expect(whiteAsset).toContain(region);
    }
    expect(whiteAsset).toContain('tableValues="0 0 1 1"');
    expect(whiteAsset).toContain('in2="clean-mask" operator="in"');
    expect(whiteAsset).toContain('<use href="#rycode-artwork" filter="url(#rycode-white)"/>');
    const arrows = whiteAsset.match(/<clipPath id="rycode-contrast-details"[^>]*>([\s\S]*?)<\/clipPath>/)![1]!;
    expect(arrows).not.toContain("polygon");
    const diagonal = whiteAsset.match(/<clipPath id="rycode-diagonal-leg"[^>]*>([\s\S]*?)<\/clipPath>/)![1]!;
    expect(diagonal).toContain('<polygon points="523,616 755,616 1135,991 901,991"/>');
    expect(whiteAsset).toContain('<g clip-path="url(#rycode-diagonal-leg)">');
    expect(whiteAsset).toContain('<use href="#rycode-artwork" filter="url(#rycode-black)"/>');
  });

  it("does not turn transparent image/filter padding into a black frame", () => {
    const matrix = blueAsset
      .match(/<feColorMatrix[^>]*values="([^"]+)"/)![1]!
      .trim()
      .split(/\s+/)
      .map(Number);
    expect(matrix).toHaveLength(20);
    const alphaRow = matrix.slice(15);
    const alpha = (rgba: number[]) =>
      alphaRow[4]! + rgba.reduce((sum, value, index) => sum + value * alphaRow[index]!, 0);
    expect(alpha([0, 0, 0, 0])).toBe(0); // Transparent filter padding.
    expect(alpha([1, 1, 1, 1])).toBe(0); // The original white JPEG background.
    expect(alpha([247 / 255, 119 / 255, 23 / 255, 1])).toBeGreaterThan(0.85); // Orange stays visible.
    expect(matrix.slice(0, 15)).toEqual([0, 0, 0, 0, 102 / 255, 0, 0, 0, 0, 192 / 255, 0, 0, 0, 0, 1]); // Exact #66C0FF.
    expect(blueAsset).toContain(
      'filterUnits="objectBoundingBox" x="0" y="0" width="100%" height="100%"',
    );
  });
});
