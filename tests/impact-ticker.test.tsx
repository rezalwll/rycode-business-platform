// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { ImgHTMLAttributes } from "react";
import postcss from "postcss";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Impact from "@/components/template/reference-impact";
import { ReferenceLocale } from "@/components/template/reference-locale";

vi.mock("next/image", () => ({
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

let width = 480;
const resizeCallbacks = new Set<ResizeObserverCallback>();
const disconnected = vi.fn();
beforeEach(() => {
  width = 480;
  resizeCallbacks.clear();
  disconnected.mockClear();
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(() => width);
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(callback: ResizeObserverCallback) {
        resizeCallbacks.add(callback);
      }
      observe() {}
      disconnect() {
        disconnected();
      }
    },
  );
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  vi.stubGlobal("matchMedia", () => ({
    matches: true,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
  }));
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const css = postcss.parse(
  readFileSync(resolve(process.cwd(), "src/components/site/coorda-reference.css"), "utf8"),
);
function declarations(selector: string) {
  const result: Record<string, string> = {};
  css.walkRules(selector, (rule) => {
    if (rule.parent?.type === "root")
      rule.walkDecls((decl) => {
        result[decl.prop] = decl.value;
      });
  });
  return result;
}

describe("impact topic strips do not animate into an empty white card", () => {
  it.each(["fa", "en"] as const)(
    "uses a physical LTR viewport and localized labels for %s",
    (locale) => {
      const { container } = render(
        <div dir={locale === "fa" ? "rtl" : "ltr"}>
          <ReferenceLocale locale={locale}>
            <Impact />
          </ReferenceLocale>
        </div>,
      );
      const rows = container.querySelectorAll<HTMLElement>(".impact-topic-row");
      expect(rows).toHaveLength(2);
      for (const row of rows) {
        expect(row.getAttribute("dir")).toBe("ltr");
        expect(row.style.getPropertyValue("--impact-topic-viewport")).toBe("480px");
        const groups = row.querySelectorAll(".impact-topic-group");
        expect(groups).toHaveLength(2);
        expect(groups[0]?.textContent).toBe(groups[1]?.textContent);
        expect(groups[1]?.getAttribute("aria-hidden")).toBe("true");
        expect(groups[0]?.querySelector("li > span")?.getAttribute("dir")).toBe(
          locale === "fa" ? "rtl" : "ltr",
        );
        expect(groups[0]?.querySelectorAll("li")).toHaveLength(5);
      }
      expect(rows[1]?.classList.contains("impact-topic-row-reverse")).toBe(true);
      expect(rows[0]?.textContent).toContain(locale === "fa" ? "طراحی وب" : "Web design");
    },
  );

  it("tracks viewport changes and cleans up measurement observers", () => {
    const { container, unmount } = render(<Impact />);
    width = 769;
    window.dispatchEvent(new Event("resize"));
    for (const row of container.querySelectorAll<HTMLElement>(".impact-topic-row"))
      expect(row.style.getPropertyValue("--impact-topic-viewport")).toBe("769px");
    width = 320;
    for (const callback of resizeCallbacks) callback([], {} as ResizeObserver);
    for (const row of container.querySelectorAll<HTMLElement>(".impact-topic-row"))
      expect(row.style.getPropertyValue("--impact-topic-viewport")).toBe("320px");
    unmount();
    expect(disconnected).toHaveBeenCalledTimes(2);
  });

  it("keeps the card in normal flow and prevents group shrinkage or a short loop period", () => {
    const base = ".coorda-reference";
    expect(declarations(`${base} .impact-topics-card`).display).toBe("flex");
    expect(declarations(`${base} .impact-topics-card`)["min-height"]).toBe("148px");
    expect(declarations(`${base} .impact-topics-card`).background).toBe("#fff");
    expect(declarations(`${base} .impact-topic-tickers`).position).not.toBe("absolute");
    expect(declarations(`${base} .impact-topic-tickers`).transform).toBeUndefined();
    expect(declarations(`${base} .impact-topic-row`).direction).toBe("ltr");
    expect(declarations(`${base} .impact-topic-row`).display).toBe("flex");
    expect(declarations(`${base} .impact-topic-track`).flex).toBe("0 0 auto");
    expect(declarations(`${base} .impact-topic-group`).flex).toBe("0 0 auto");
    expect(declarations(`${base} .impact-topic-group`)["min-width"]).toBe(
      "var(--impact-topic-viewport, 0px)",
    );
    expect(
      declarations(`${base} .impact-topic-row-reverse .impact-topic-track`)["animation-direction"],
    ).toBe("reverse");
    for (const viewport of [320, 480, 769])
      for (const naturalGroup of [200, 600, 1100]) {
        const period = Math.max(viewport, naturalGroup);
        for (const phase of [0, 0.25, 0.5, 0.75, 0.999, 1]) {
          // Two identical groups translated by one period cover the frame at
          // every phase, for either animation direction (including the seam).
          expect(-period * phase).toBeLessThanOrEqual(0);
          expect(2 * period - period * phase).toBeGreaterThanOrEqual(viewport);
        }
      }
  });
});
