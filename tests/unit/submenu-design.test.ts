import { readFileSync } from "node:fs";
import postcss from "postcss";
import { describe, expect, it } from "vitest";

const css = postcss.parse(readFileSync(new URL("../../src/components/site/coorda-reference-overrides.css", import.meta.url), "utf8"));
function declarations(selector: string) {
  const result: Record<string, string> = {};
  css.walkRules(selector, rule => { rule.walkDecls(decl => { result[decl.prop] = decl.value; }); });
  return result;
}

describe("compact branded navigation dropdowns", () => {
  it("uses an opaque theme-aware surface and bounded scroll, not a full-width mega menu", () => {
    const panel = declarations(".rycode-coorda .rycode-submenu-surface");
    expect(panel.background).toBe("var(--surface)");
    expect(panel["border-radius"]).toBe("20px");
    expect(panel["max-height"]).toBe("min(70vh, 560px)");
    expect(panel["overflow-y"]).toBe("auto");
    expect(declarations(".rycode-coorda .rycode-services-menu-mobile")["max-height"]).toBe("none");
    expect(declarations(".dark .rycode-coorda :is(.rycode-submenu-surface, .rycode-mobile-submenu)")["--submenu-accent"]).toBe("var(--accent-blue)");
  });

  it("reserves space for icons and wraps long service titles instead of clipping them", () => {
    const link = declarations(".rycode-coorda .rycode-submenu-link");
    expect(link.display).toBe("flex");
    expect(link["min-height"]).toBe("52px");
    expect(link["text-align"]).toBe("start");
    expect(declarations(".rycode-coorda .rycode-submenu-label")["min-width"]).toBe("0");
    expect(declarations(".rycode-coorda .rycode-submenu-label")["overflow-wrap"]).toBe("anywhere");
    expect(declarations(".rycode-coorda .rycode-submenu-icon").flex).toBe("0 0 34px");
  });

  it("orients arrows by resolved direction even in nested mobile RTL/LTR containers", () => {
    expect(declarations(".rycode-coorda .rycode-submenu-link:dir(rtl) .rycode-submenu-arrow").rotate).toBe("180deg");
    expect(declarations('.rycode-coorda .rycode-submenu-link:dir(ltr)[aria-current="page"]')["box-shadow"]).toBe("inset 2px 0 var(--submenu-accent)");
    expect(declarations(".rycode-coorda .rycode-submenu-link:focus-visible").outline).toBe("2px solid var(--submenu-accent)");
    const reduced = css.nodes.filter(node => node.type === "atrule" && node.params === "(prefers-reduced-motion: reduce)");
    expect(reduced.some(node => node.toString().includes(".rycode-submenu-arrow { transition: none; }"))).toBe(true);
  });
});
