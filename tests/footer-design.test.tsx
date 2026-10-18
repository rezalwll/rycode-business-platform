// @vitest-environment jsdom
import { cleanup, render, within } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { AnchorHTMLAttributes, ImgHTMLAttributes } from "react";
import postcss from "postcss";
import { afterEach, describe, expect, it, vi } from "vitest";
import { localizedHref } from "@/i18n/public-href";
import type { Locale } from "@/i18n/routing";

vi.mock("next/image", () => ({ default: (props: ImgHTMLAttributes<HTMLImageElement>) => <img {...props} /> }));
vi.mock("@/i18n/navigation", () => ({ Link: ({ locale = "fa", href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { locale?: Locale; href: string }) => <a {...props} href={localizedHref(locale, href)} /> }));
vi.mock("@/components/site/footer-fluid", () => ({ FooterFluid: () => <canvas className="coorda-footer-fluid" aria-hidden="true" /> }));
import { SiteFooter } from "@/components/site/footer";
import { getFooterNav } from "@/lib/nav-content";
import { BRAND_MARK_SRC } from "@/lib/brand";

const css = postcss.parse(readFileSync(resolve(process.cwd(), "src/components/site/footer-fluid.css"), "utf8"));
const base = ".rycode-coorda footer.coorda-legacy-footer";
function declarations(selector: string, media?: string) {
  const result: Record<string, string> = {};
  css.walkRules(rule => {
    const normalized = rule.selector.replace(/\s+/g, " ");
    const parentMedia = rule.parent?.type === "atrule" ? (rule.parent as postcss.AtRule).params : undefined;
    if (normalized === selector && parentMedia === media) rule.walkDecls(decl => { result[decl.prop] = decl.value; });
  });
  return result;
}
function contrast(a: string, b: string) {
  const luminance = (hex: string) => {
    const values = [1, 3, 5].map(offset => parseInt(hex.slice(offset, offset + 2), 16) / 255)
      .map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
    return values[0]! * .2126 + values[1]! * .7152 + values[2]! * .0722;
  };
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0]! + .05) / (values[1]! + .05);
}
afterEach(cleanup);

describe("balanced white footer", () => {
  it.each(["fa", "en"] as const)("preserves brand positions, content and localized destinations for %s", locale => {
    const { container } = render(<div className="dark"><div className="rycode-coorda"><SiteFooter locale={locale} /></div></div>);
    const footer = container.querySelector("footer")!;
    const brand = footer.querySelector(".coorda-footer-brand")!;
    expect(brand.getAttribute("dir")).toBe("ltr");
    expect(brand.children[0]?.className).toBe("coorda-footer-wordmark");
    expect(brand.children[0]?.textContent).toBe("RYCODE");
    expect(brand.children[0]?.querySelector("img")).toBeNull();
    expect(brand.querySelector(".coorda-footer-identity img")?.getAttribute("src")).toBe(BRAND_MARK_SRC);
    const body = footer.querySelector(".coorda-footer-body")!;
    expect(body.getAttribute("dir")).toBe(locale === "fa" ? "rtl" : "ltr");
    expect(body.querySelector(".coorda-footer-intro-copy h2")).toBeTruthy();
    expect(body.querySelector(".coorda-footer-intro > .coorda-footer-cta")?.getAttribute("href")).toBe(localizedHref(locale, "/start-project"));
    const groups = getFooterNav(locale);
    expect(body.querySelectorAll(".coorda-footer-nav-group")).toHaveLength(4);
    const nav = within(footer).getByRole("navigation");
    expect(within(nav).getAllByRole("link")).toHaveLength(groups.reduce((sum, group) => sum + group.items.length, 0));
    for (const group of groups) for (const item of group.items) {
      expect(within(nav).getByRole("link", { name: item.label }).getAttribute("href")).toBe(localizedHref(locale, item.href));
    }
    expect(footer.querySelector("canvas")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("owns footer colors locally in either theme, including a readable blue action", () => {
    const tokens = declarations(`${base}, .dark ${base}`);
    expect(tokens.background).toBe("#fff");
    expect(tokens["--background"]).toBe("#fff");
    expect(tokens["--foreground"]).toBe("#1a1a1a");
    expect(tokens["--brand"]).toBe("#66C0FF");
    expect(tokens["--brand-foreground"]).toBe("#1a1a1a");
    expect(contrast(tokens["--brand"]!, tokens["--brand-foreground"]!)).toBeGreaterThan(4.5);
    expect(contrast("#ffffff", declarations(`${base} .coorda-footer-body li a`).color!)).toBeGreaterThan(4.5);
    expect(contrast("#ffffff", tokens["--detail-blue"]!)).toBeGreaterThan(4.5);
    expect(declarations(`${base} .coorda-footer-body li a`).opacity).toBe("1");
  });

  it("separates the conversation row from a full-width navigation grid", () => {
    expect(declarations(`${base} .coorda-footer-brand`)["grid-template-columns"]).toBe("minmax(0, 1fr) auto");
    expect(declarations(`${base} .coorda-footer-wordmark`)["justify-self"]).toBe("start");
    expect(declarations(`${base} .coorda-footer-identity`)["justify-self"]).toBe("end");
    expect(declarations(`${base} .coorda-footer-body`)["grid-template-columns"]).toBe("minmax(0, 1fr)");
    expect(declarations(`${base} .coorda-footer-body nav`)["grid-template-columns"]!.match(/minmax/g)).toHaveLength(4);
    expect(declarations(`${base} .coorda-footer-body .coorda-footer-cta`)["min-height"]).toBe("48px");
    expect(declarations(`${base} .coorda-footer-mark`)["object-fit"]).toBe("contain");
  });

  it("adapts navigation and CTA without overflowing narrow screens", () => {
    expect(declarations(`${base} .coorda-footer-body nav`, "(max-width: 899px)")["grid-template-columns"]).toBe("repeat(2, minmax(0, 1fr))");
    expect(declarations(`${base} .coorda-footer-intro`, "(max-width: 639px)")["grid-template-columns"]).toBe("minmax(0, 1fr)");
    expect(declarations(`${base} .coorda-footer-body .coorda-footer-cta`, "(max-width: 639px)")["justify-self"]).toBe("start");
    expect(declarations(`${base} .coorda-footer-body nav`, "(max-width: 359px)")["grid-template-columns"]).toBe("minmax(0, 1fr)");
    expect(declarations(`${base} .coorda-footer-body li a`, "(prefers-reduced-motion: reduce)").transition).toBe("none");
    expect(declarations(".rycode-coorda .coorda-footer-fluid")["pointer-events"]).toBe("none");
    expect(Number(declarations(".rycode-coorda .coorda-footer-fluid").opacity)).toBeLessThan(.3);
  });
});
