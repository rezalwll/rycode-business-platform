import { readFileSync } from "node:fs";
import postcss from "postcss";
import { describe, expect, it } from "vitest";

const css = postcss.parse(readFileSync(new URL("../../src/components/site/coorda-reference-overrides.css", import.meta.url), "utf8"));

function ruleFor(selector: string) {
  let found: postcss.Rule | undefined;
  css.walkRules(rule => { if (rule.selector === selector) found = rule; });
  return found;
}

function declarations(rule?: postcss.Rule) {
  const values: Record<string, string> = {};
  rule?.walkDecls(declaration => { values[declaration.prop] = declaration.value; });
  return values;
}

describe("restrained interface transitions", () => {
  it("keeps the service link compact and disables arrow movement in both language directions", () => {
    const link = declarations(ruleFor(".coorda-reference .capability-card .feature-card-actions .capability-card-link"));
    expect(link["text-decoration"]).toBe("none");
    expect(link["justify-content"]).toBe("space-between");
    expect(link["min-height"]).toBe("48px");
    const reduced = ruleFor(".coorda-reference .capability-card[dir] .capability-card-link:is(:hover, :focus-visible) .capability-card-link-arrow svg")!;
    expect((reduced.parent as postcss.AtRule).params).toBe("(prefers-reduced-motion: reduce)");
    expect(declarations(reduced).transform).toBe("none");
  });
  it("uses a shared short duration and non-bouncy ease", () => {
    const tokens = declarations(ruleFor(".rycode-coorda"));
    expect(tokens["--ui-duration"]).toBe("280ms");
    expect(tokens["--ui-ease"]).toBe("cubic-bezier(.22, 1, .36, 1)");
  });

  it("animates dropdown opacity and a six-pixel movement, not size or layout", () => {
    const open = declarations(ruleFor(".rycode-coorda .rycode-desktop-submenu"));
    const closed = declarations(ruleFor('.rycode-coorda .rycode-desktop-submenu[data-state="closed"]'));
    expect(open.opacity).toBe("1");
    expect(open.transition).toContain("opacity 200ms");
    expect(open.transition).not.toMatch(/all|height|width/);
    expect(closed.opacity).toBe("0");
    expect(closed.transform).toBe("translateY(-6px)");
    expect(closed["pointer-events"]).toBe("none");
    expect(closed.visibility).toBe("hidden");
  });

  it("disables both open and closed dropdown motion under reduced-motion preference", () => {
    const rule = ruleFor('.rycode-coorda :is(.rycode-desktop-submenu, .rycode-desktop-submenu[data-state="closed"])')!;
    expect(rule.parent?.type).toBe("atrule");
    expect((rule.parent as postcss.AtRule).params).toBe("(prefers-reduced-motion: reduce)");
    expect(declarations(rule).transition).toBe("none");
    expect(declarations(rule).transform).toBe("none");
  });

  it("limits hover transitions to visual properties instead of transition-all", () => {
    const controls: postcss.Rule[] = [];
    css.walkRules(rule => { if (rule.selector.includes(".rycode-primary-link,") && rule.selector.includes(".pn-btn")) controls.push(rule); });
    expect(controls).toHaveLength(1);
    expect(declarations(controls[0])["transition-property"]).toBe("background-color, border-color, color, box-shadow, transform");
    expect(declarations(controls[0])["transition-duration"]).toBe("var(--ui-duration)");
  });
});
