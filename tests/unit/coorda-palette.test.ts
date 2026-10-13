import { readFileSync } from "node:fs";
import postcss from "postcss";
import { describe, expect, it } from "vitest";
import { serviceFamilies } from "@/content/service-model";

const reference = postcss.parse(
  readFileSync(new URL("../../src/components/site/coorda-reference.css", import.meta.url), "utf8"),
);
const palette = postcss.parse(
  readFileSync(new URL("../../src/components/site/coorda-palette.css", import.meta.url), "utf8"),
);
const globalTheme = postcss.parse(
  readFileSync(new URL("../../src/styles.css", import.meta.url), "utf8"),
);

function declarations(root: postcss.Root, selector: string): Record<string, string> {
  const values: Record<string, string> = {};
  root.walkRules((rule) => {
    if (
      !rule.selector
        .split(/,(?![^()]*\))/)
        .map((value) => value.trim().replace(/\s+/g, " "))
        .includes(selector)
    )
      return;
    rule.walkDecls((declaration) => {
      values[declaration.prop] = declaration.value;
    });
  });
  return values;
}

describe("restored supplied Coorda visual system", () => {
  it("shows charcoal beneath rounded paper corners only when the next section is charcoal", () => {
    const overrides = postcss.parse(
      readFileSync(new URL("../../src/components/site/coorda-reference-overrides.css", import.meta.url), "utf8"),
    );
    const rounded = [
      ".features", ".desktop-app-section", ".insights-section", ".pricing-section",
      ".about-team", ".download-section", ".insights-archive", ".article-related",
      ".contact-section", ".legal-content",
    ];
    const panels = `.coorda-reference :is( ${rounded.join(", ")} )`;
    expect(declarations(overrides, panels).background).toBe("transparent");
    const darkNext = ":has(+ :is(.app-showcase, .native-features, .moments-section, .testimonials-section, .about-culture))";
    expect(declarations(overrides, panels + darkNext).background).toBe("#1a1a1a");
    for (const section of rounded) {
      expect(declarations(reference, `.coorda-reference ${section}::before`)["border-radius"]).toBe("0 0 42px 42px");
    }
  });
  it("keeps the hero video sharp while preserving its existing text-readability dimming", () => {
    const overrides = postcss.parse(
      readFileSync(
        new URL("../../src/components/site/coorda-reference-overrides.css", import.meta.url),
        "utf8",
      ),
    );
    const scene = declarations(overrides, ".coorda-reference .hero-scene");
    expect(scene.filter).toBe("brightness(.6)");
    expect(scene.filter).not.toContain("blur");
  });

  it("retains the supplied light paper, white cards and charcoal bands", () => {
    expect(declarations(reference, ".coorda-reference").background).toBe("#f2f2f2");
    for (const section of [
      ".app-showcase",
      ".native-features",
      ".testimonials-section",
      ".moments-section",
    ]) {
      expect(declarations(reference, `.coorda-reference ${section}`).background).toBe("#1a1a1a");
      expect(declarations(reference, `.coorda-reference ${section}`).color).toBe("#fff");
    }
    for (const section of [".impact", ".stories-section", ".faq-section"]) {
      expect(declarations(reference, `.coorda-reference ${section}`).background).toBe("#f2f2f2");
    }
    for (const card of [".feature-card", ".faq-card", ".impact-topics-card"]) {
      expect(declarations(reference, `.coorda-reference ${card}`).background).toBe("#fff");
    }
  });
  it("does not override the source section backgrounds or cycle per-section/card colors", () => {
    palette.walkRules((rule) => {
      expect(rule.selector).toContain(".rycode-coorda");
      expect(rule.selector).not.toContain("nth-child");
      expect(rule.selector).not.toContain(".legal-abstract");
      if (
        !rule.nodes.some(
          (node) => node.type === "decl" && /^(background|background-color)$/.test(node.prop),
        )
      )
        return;
      const targets = rule.selector.split(/,(?![^()]*\))/).map((value) => value.trim());
      // Color may be added to descendants, never to section/card background fields.
      for (const target of targets) {
        expect(target).toMatch(
          /coorda-footer-wash|coorda-auth-card|coorda-search (?:form|input)|hero-cta|pricing-cta|coorda-button|button\.bg-brand|header a\.bg-brand|header nav a::after|faq-toggle/,
        );
      }
    });
    palette.walkDecls((declaration) => {
      expect(declaration.prop).not.toBe("--section-background");
      expect(declaration.value).not.toContain("gradient(");
    });
  });
  it("makes shell chrome neutral while allowing the existing theme switch", () => {
    const light = declarations(palette, ".rycode-coorda");
    const dark = declarations(palette, ".dark .rycode-coorda");
    expect(light["--background"]).toBe("#f2f2f2");
    expect(light["--foreground"]).toBe("#1a1a1a");
    expect(light["--brand"]).toBe("#1a1a1a");
    expect(dark["--background"]).toBe("#1a1a1a");
    expect(dark["--foreground"]).toBe("#fff");
    expect(declarations(palette, ".rycode-coorda .coorda-footer-wash").background).toBe("none");
  });
  it("keeps photographic banners and the original abstract hero rather than tinting them", () => {
    expect(declarations(reference, ".coorda-reference .community-cta").color).toBe("#fff");
    expect(declarations(reference, ".coorda-reference .photo-hero-image").filter).toBe(
      "brightness(.42)",
    );
    expect(declarations(reference, ".coorda-reference .legal-abstract").background).toBe("#171717");
  });
  it("uses black RY and blue CODE, while keeping ordinary brand mentions blue", () => {
    expect(declarations(palette, ".rycode-coorda .rycode-wordmark-suffix").color).toBe(
      "var(--logo-color)",
    );
    expect(declarations(globalTheme, ".rycode-wordmark .rycode-wordmark-prefix").color).toBe(
      "#171717",
    );
    for (const selector of [
      ".dark .rycode-wordmark .rycode-wordmark-prefix",
      '.rycode-logo[data-variant="light"] .rycode-wordmark .rycode-wordmark-prefix',
    ]) {
      expect(declarations(globalTheme, selector).color).toBe("#fff");
      expect(declarations(globalTheme, selector)["-webkit-text-fill-color"]).toBe("#fff");
    }
    expect(declarations(globalTheme, ".rycode-wordmark .rycode-wordmark-suffix").color).toBe(
      "var(--logo-color, #66C0FF)",
    );
    expect(declarations(globalTheme, ".rycode-brand-name").color).toBe(
      "var(--logo-color, #66C0FF)",
    );
    for (const selector of [":root", ".dark"]) {
      expect(declarations(globalTheme, selector)["--logo-color"]).toBe("var(--accent-blue)");
    }
  });
  it("uses neutral navigation ink while keeping the site's blue brand unchanged", () => {
    for (const selector of [
      ".rycode-coorda header nav :is(a, button)",
      ".rycode-coorda #site-mobile-menu nav :is(a, button)",
      '.rycode-coorda header.reference-overlay-header nav [role="region"] :is(a, button)',
    ]) {
      expect(declarations(palette, selector).color).toBe("var(--foreground)");
    }
    for (const selector of [
      ".rycode-coorda header.reference-overlay-header nav :is(a, button)",
    ]) {
      expect(declarations(palette, selector).color).toBe("#fff");
    }
    expect(declarations(palette, ".rycode-coorda header nav a::after")["background-color"]).toBe("currentColor");
    expect(declarations(palette, '.rycode-coorda header button[aria-controls="site-mobile-menu"]').color).toBe("var(--foreground)");
  });
  it("restricts the capability card hover to a colored bottom rail", () => {
    const hover = declarations(palette, ".rycode-coorda .coorda-reference .feature-card:hover");
    expect(hover["box-shadow"]).toBe("inset 0 -3px 0 var(--feature-accent)");
    expect(hover["background"]).toBeUndefined();
    expect(hover["background-color"]).toBeUndefined();
  });
  it("does not change source geometry or animations in the integration palette", () => {
    const colors = new Set([
      "color",
      "background",
      "background-color",
      "border-color",
      "box-shadow",
    ]);
    palette.walkDecls((declaration) => {
      expect(declaration.prop.startsWith("--") || colors.has(declaration.prop)).toBe(true);
    });
  });

  it("uses the three accent families for text and controls without cycling whole sections", () => {
    const accents = declarations(palette, ".rycode-coorda");
    expect(accents["--detail-blue"]).toBe("color-mix(in srgb, var(--accent-blue) 50%, #1a1a1a)");
    expect(accents["--detail-purple"]).toBe("#6d4cdb");
    const cta = declarations(
      palette,
      ".rycode-coorda .coorda-reference :is(.hero-cta, .pricing-cta)",
    );
    expect(cta["background-color"]).toBe("var(--action)");
    expect(cta.color).toBe("var(--action-foreground)");
    expect(
      declarations(palette, ".rycode-coorda .coorda-reference .faq-toggle")["background-color"],
    ).toBe("var(--detail-purple)");
    expect(declarations(palette, ".rycode-coorda .coorda-footer-body nav a:hover").color).toBe(
      "var(--detail-blue)",
    );
  });

  it("makes only the opening hero button blue with readable dark text", () => {
    const selector = ".rycode-coorda .coorda-reference .hero .hero-cta";
    const button = declarations(palette, selector);
    expect(button["background-color"]).toBe("var(--accent-blue)");
    expect(button["border-color"]).toBe("var(--accent-blue)");
    expect(button.color).toBe("#1a1a1a");
    const hover = declarations(palette, `${selector}:hover`);
    expect(hover["background-color"]).toBe("color-mix(in srgb, var(--accent-blue) 90%, #fff)");
    expect(hover["border-color"]).toBe(hover["background-color"]);
  });

  it("keeps accent text readable on the actual source light and charcoal surfaces", () => {
    function luminance(hex: string) {
      const channels = [1, 3, 5]
        .map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255)
        .map((value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
      return channels[0]! * 0.2126 + channels[1]! * 0.7152 + channels[2]! * 0.0722;
    }
    function contrast(first: string, second: string) {
      const [a, b] = [luminance(first), luminance(second)].sort((a, b) => b - a);
      return (a! + 0.05) / (b! + 0.05);
    }
    const accents = declarations(palette, ".rycode-coorda");
    const projectBlue = declarations(globalTheme, ":root")["--accent-blue"]!;
    expect(
      contrast(projectBlue, declarations(palette, ".rycode-coorda .coorda-reference .hero .hero-cta").color!),
    ).toBeGreaterThanOrEqual(4.5);
    // Resolve the exact 50/50 sRGB ink mix, keeping the light-background contrast test.
    const blueInk =
      "#" +
      [1, 3, 5]
        .map((offset) =>
          Math.round((parseInt(projectBlue.slice(offset, offset + 2), 16) + 26) / 2)
            .toString(16)
            .padStart(2, "0"),
        )
        .join("");
    for (const tone of ["blue", "purple"]) {
      for (const surface of ["#ffffff", "#f2f2f2"]) {
        expect(
          contrast(tone === "blue" ? blueInk : accents[`--detail-${tone}`]!, surface),
        ).toBeGreaterThanOrEqual(4.5);
      }
      expect(
        contrast(tone === "blue" ? projectBlue : accents[`--detail-${tone}-on-dark`]!, "#1a1a1a"),
      ).toBeGreaterThanOrEqual(4.5);
    }
    for (const selector of [":root", ".dark"]) {
      const colors = declarations(globalTheme, selector);
      expect(contrast(colors["--action"]!, colors["--action-foreground"]!)).toBeGreaterThanOrEqual(
        4.5,
      );
    }
  });
  it("uses the requested #66C0FF blue as the single source for both themes and service accents", () => {
    for (const selector of [":root", ".dark"]) {
      const colors = declarations(globalTheme, selector);
      expect(colors["--accent-blue"]).toBe("#66C0FF");
      expect(colors["--chart-2"]).toBe("var(--accent-blue)");
    }
    expect(declarations(palette, ".rycode-coorda")["--detail-blue-on-dark"]).toBe(
      "var(--accent-blue)",
    );
    expect(serviceFamilies.find((family) => family.id === "connect")?.accent).toBe(
      "var(--accent-blue)",
    );
  });
});
