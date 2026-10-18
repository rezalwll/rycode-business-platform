// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import type { ImgHTMLAttributes } from "react";
import postcss from "postcss";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AppShowcase from "@/components/template/reference-app-showcase";
import { ReferenceLocale } from "@/components/template/reference-locale";
import { getCatalogEntries, getCatalogVisual } from "@/content/catalog";

vi.mock("next/image", () => ({
  default: ({ fill: _fill, ...props }: ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) => <img {...props} />,
}));
beforeEach(() => {
  vi.stubGlobal("matchMedia", () => ({ matches: true, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} }));
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

const css = postcss.parse(readFileSync(resolve(process.cwd(), "src/components/template/project-studies.css"), "utf8"));
function declarations(selector: string, media?: string) {
  const values: Record<string, string> = {};
  css.walkRules(selector, rule => {
    const parent = rule.parent;
    if (media ? parent?.type === "atrule" && parent.params === media : parent?.type === "root") {
      rule.walkDecls(decl => { values[decl.prop] = decl.value; });
    }
  });
  return values;
}

describe("ImpactFlow-inspired RYCODE project studies", () => {
  it.each(["fa", "en"] as const)("shows existing project visuals and working localized study links for %s", locale => {
    const { container } = render(<ReferenceLocale locale={locale}><AppShowcase /></ReferenceLocale>);
    const section = container.querySelector("#app-showcase")!;
    expect(section.getAttribute("dir")).toBe(locale === "fa" ? "rtl" : "ltr");
    expect(section.classList.contains("app-showcase")).toBe(false);
    expect(section.querySelector(".showcase-sticky, .showcase-navigation, .showcase-screen")).toBeNull();
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(locale === "fa" ? "از یک نیاز واقعیتا یک محصول کاربردی" : "From a real needto a useful product");
    const cards = [...section.querySelectorAll<HTMLAnchorElement>(".project-study-card")];
    const projects = getCatalogEntries("projects");
    expect(cards).toHaveLength(projects.length);
    cards.forEach((card, index) => {
      const project = projects[index]!;
      const visual = getCatalogVisual(project)!;
      expect(card.getAttribute("href")).toBe(`${locale === "en" ? "/en" : ""}/projects/${project.slug}`);
      expect(within(card).getByRole("heading", { level: 3 }).textContent).toBe(project.title[locale]);
      expect(card.textContent).toContain(project.summary[locale]);
      expect(card.querySelector("img")?.getAttribute("src")).toBe(visual.src);
      expect(card.querySelector("img")?.alt).toBe(visual.alt[locale]);
      expect(existsSync(resolve(process.cwd(), "public", visual.src.slice(1)))).toBe(true);
      expect(document.getElementById(card.getAttribute("aria-describedby")!)?.textContent).toBe(project.summary[locale]);
      expect(card.querySelector("a, button")).toBeNull();
      expect(card.parentElement?.parentElement?.className).toBe("project-study-item");
      expect((card.parentElement as HTMLElement).style.getPropertyValue("--case-edge")).toBe("0");
    });
    expect(section.querySelector("small")?.textContent).toContain(locale === "fa" ? "مطالعات مفهومی" : "concept studies");
    expect(section.querySelector(".project-studies-all")?.getAttribute("href")).toBe(locale === "fa" ? "/projects" : "/en/projects");
    expect(section.textContent).not.toMatch(/Radiance|UrbanFit|Brew House|\+\d+%/);
  });

  it("uses the original full-width 2:1 cards, 1200px composition and white RYCODE canvas", () => {
    expect(declarations(".coorda-reference .project-studies").background).toBe("#fff");
    expect(declarations(".coorda-reference .project-studies-container")["max-width"]).toBe("1200px");
    expect(declarations(".coorda-reference .project-studies-list").gap).toBe("20px");
    const card = declarations(".coorda-reference .project-study-card");
    expect(card["aspect-ratio"]).toBe("2 / 1");
    expect(card["border-radius"]).toBe("24px");
    expect(card.overflow).toBe("clip");
    expect(declarations(".coorda-reference .project-study-image")["object-fit"]).toBe("cover");
    expect(declarations(".coorda-reference .project-study-content")["padding-inline-end"]).toBe("104px");
  });

  it("implements both halves of the reference perspective effect, with gentler mobile motion and a static reduced-motion mode", () => {
    const motion = declarations(".coorda-reference .project-study-motion");
    expect(motion.transform).toContain("perspective(2000px)");
    expect(motion["--case-tilt"]).toBe("50deg");
    expect(motion["--case-shrink"]).toBe(".2");
    const mobile = declarations(".coorda-reference .project-study-motion", "(max-width: 809px)");
    expect(mobile["--case-tilt"]).toBe("30deg");
    expect(mobile["--case-shrink"]).toBe(".1");
    expect(declarations(".coorda-reference .project-study-card", "(max-width: 809px)").height).toBe("450px");
    expect(declarations(".coorda-reference .project-study-card", "(max-width: 809px)")["aspect-ratio"]).toBe("auto");
    expect(declarations(".coorda-reference .project-study-motion", "(prefers-reduced-motion: reduce)").transform).toBe("none");
    const source = readFileSync(resolve(process.cwd(), "src/components/template/reference-app-showcase.tsx"), "utf8");
    expect(source).toContain('offset: ["start end", "end start"]');
    expect(source).toContain("[0, .5, 1], [-1, 0, 1]");
    expect(source).toContain("[0, .5, 1], [1, 0, 1]");
    expect(source).not.toContain("scrollTo(");
  });
});
