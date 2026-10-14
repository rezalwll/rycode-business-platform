// @vitest-environment jsdom
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import type { ImgHTMLAttributes } from "react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({ default: (props: ImgHTMLAttributes<HTMLImageElement>) => <img {...props} /> }));
import { FeatureTicker } from "@/components/template/reference-features";
import { serviceCards } from "@/content/service-cards";
import { ReferenceLocale } from "@/components/template/reference-locale";

let frames: Map<number, FrameRequestCallback>;
let frameId: number;
let time: number;
let period: number;
let hidden: boolean;
function advance(count: number) {
  for (let index = 0; index < count; index++) act(() => {
    time += 1000 / 60;
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach(callback => callback(time));
  });
}
function offset(track: Element) {
  return Number((track as HTMLElement).style.transform.match(/-([\d.]+)px/)?.[1] ?? 0);
}
beforeEach(() => {
  frames = new Map(); frameId = 0; time = 0; period = serviceCards.length * 336; hidden = false;
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => { frames.set(++frameId, callback); return frameId; });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
  vi.stubGlobal("matchMedia", () => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
  vi.spyOn(document, "hidden", "get").mockImplementation(() => hidden);
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(() => ({ width: period, left: 0, right: period, height: 500, top: 0, bottom: 500, x: 0, y: 0, toJSON() {} }));
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe("services ticker integration", () => {
  it("renders equal back-to-back groups with useful links and no duplicate keyboard stops", () => {
    const { container } = render(<ReferenceLocale locale="en"><FeatureTicker visible reducedMotion={false} /></ReferenceLocale>);
    const groups = container.querySelectorAll(".features-ticker-group");
    expect(container.querySelector(".features-desktop")?.getAttribute("dir")).toBe("ltr");
    expect(groups).toHaveLength(2);
    expect(groups[0]!.querySelectorAll(".feature-card")).toHaveLength(serviceCards.length);
    expect([...groups[0]!.querySelectorAll(".feature-card")].map(card => card.getAttribute("data-card-id"))).toEqual([...groups[1]!.querySelectorAll(".feature-card")].map(card => card.getAttribute("data-card-id")));
    expect(groups[1]!.getAttribute("aria-hidden")).toBe("true");
    expect(groups[1]!.hasAttribute("inert")).toBe(false);
    for (const link of groups[1]!.querySelectorAll<HTMLAnchorElement>("a")) {
      expect(link.tabIndex).toBe(-1);
      expect(link.getAttribute("href")).toMatch(/^\/en\/services\//);
    }
    const css = readFileSync(resolve(process.cwd(), "src/components/site/coorda-reference-overrides.css"), "utf8");
    expect(css).toMatch(/\.features-expanded \.features-ticker\s*\{\s*animation: none;/);
    expect(css).toMatch(/\.features-expanded \.features-ticker-group\s*\{\s*gap: 16px;\s*padding-right: 16px;/);
  });
  it("keeps advancing on hover, then smoothly regains its normal speed", () => {
    const { container } = render(<FeatureTicker visible reducedMotion={false} />);
    const viewport = container.querySelector(".features-desktop")!;
    const track = container.querySelector(".features-ticker")!;
    advance(61);
    const normal = offset(track);
    expect(normal).toBeCloseTo(44, 5);
    fireEvent.mouseEnter(viewport);
    const initial = offset(track);
    expect(initial).toBe(normal);
    advance(180);
    const slowStart = offset(track);
    advance(60);
    expect(offset(track) - slowStart).toBeCloseTo(5, 3);
    fireEvent.mouseLeave(viewport);
    const resumeStart = offset(track);
    advance(60);
    expect(offset(track) - resumeStart).toBeGreaterThan(25);
    expect(offset(track) - resumeStart).toBeLessThan(44);
  });
  it("pauses offscreen, in a hidden tab and for keyboard reading, preserving the loop phase", () => {
    const { container, rerender } = render(<FeatureTicker visible reducedMotion={false} />);
    const track = container.querySelector(".features-ticker")!;
    advance(61);
    const initial = offset(track);
    rerender(<FeatureTicker visible={false} reducedMotion={false} />);
    expect(frames.size).toBe(0);
    advance(60);
    expect(offset(track)).toBe(initial);
    rerender(<FeatureTicker visible reducedMotion={false} />);
    hidden = true;
    fireEvent(document, new Event("visibilitychange"));
    expect(frames.size).toBe(0);
    hidden = false;
    fireEvent(document, new Event("visibilitychange"));
    advance(61);
    expect(offset(track)).toBeCloseTo(initial + 44);
    const link = container.querySelector("a")!;
    fireEvent.focus(link);
    expect(frames.size).toBe(0);
    fireEvent.blur(link, { relatedTarget: document.body });
    expect(frames.size).toBe(1);
  });
  it("wraps at the measured seam, remeasures on resize and cleans up animation frames", () => {
    period = 10;
    const { container, unmount } = render(<FeatureTicker visible reducedMotion={false} />);
    const track = container.querySelector(".features-ticker")!;
    advance(61);
    expect(offset(track)).toBeCloseTo(4);
    period = 20;
    fireEvent(window, new Event("resize"));
    expect(offset(track)).toBeCloseTo(4);
    advance(31);
    expect(offset(track)).toBeCloseTo(6);
    unmount();
    expect(frames.size).toBe(0);
  });
  it("does not animate for reduced motion or a mobile viewport", () => {
    const { container, rerender } = render(<FeatureTicker visible reducedMotion />);
    expect(frames.size).toBe(0);
    expect((container.querySelector(".features-ticker") as HTMLElement).style.transform).toBe("none");
    vi.stubGlobal("matchMedia", () => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
    rerender(<FeatureTicker visible reducedMotion={false} />);
    expect(frames.size).toBe(0);
  });
});
