// @vitest-environment jsdom
import { act, cleanup, render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FooterFluid } from "@/components/site/footer-fluid";

const engine = vi.hoisted(() => ({
  start: vi.fn(),
  pause: vi.fn(),
  resume: vi.fn(),
  dispose: vi.fn(),
}));
vi.mock("@/components/site/footer-fluid-engine", () => ({ startFluidSimulation: engine.start }));
let intersect: IntersectionObserverCallback;
let reduced = false;
let fine = true;
let changeMotion: (() => void) | undefined;
let hidden = false;
const disconnect = vi.fn();
beforeEach(() => {
  reduced = false;
  fine = true;
  hidden = false;
  engine.start
    .mockReset()
    .mockReturnValue({ pause: engine.pause, resume: engine.resume, dispose: engine.dispose });
  engine.pause.mockReset();
  engine.resume.mockReset();
  engine.dispose.mockReset();
  disconnect.mockReset();
  vi.spyOn(document, "hidden", "get").mockImplementation(() => hidden);
  vi.stubGlobal("matchMedia", (query: string) => ({
    get matches() {
      return query.includes("reduced-motion") ? reduced : fine;
    },
    addEventListener: vi.fn((_type, callback) => {
      if (query.includes("reduced-motion")) changeMotion = callback;
    }),
    removeEventListener: vi.fn(),
  }));
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        intersect = callback;
      }
      observe = vi.fn();
      disconnect = disconnect;
    },
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
const visible = async (isIntersecting: boolean) => {
  await act(async () => {
    intersect([{ isIntersecting } as IntersectionObserverEntry], {} as IntersectionObserver);
  });
};

describe("footer-only fluid lifecycle", () => {
  it("loads the reference effect only in view, keeps decoration non-interactive and disposes on unmount", async () => {
    const { container, unmount } = render(
      <footer>
        <FooterFluid />
        <a href="/contact">Contact</a>
      </footer>,
    );
    expect(engine.start).not.toHaveBeenCalled();
    const canvas = container.querySelector("canvas")!;
    expect(canvas.getAttribute("aria-hidden")).toBe("true");
    expect(canvas.tabIndex).toBe(-1);
    await visible(true);
    expect(engine.start).toHaveBeenCalledWith(
      canvas,
      container.querySelector("footer"),
      expect.arrayContaining([{ r: 102 / 255, g: 192 / 255, b: 1 }]),
    );
    expect(engine.resume).toHaveBeenCalled();
    await visible(false);
    expect(engine.pause).toHaveBeenCalled();
    unmount();
    expect(engine.dispose).toHaveBeenCalledOnce();
    expect(disconnect).toHaveBeenCalledOnce();
  });
  it("does not initialize for reduced motion or touch-only devices", async () => {
    reduced = true;
    render(
      <footer>
        <FooterFluid />
      </footer>,
    );
    await visible(true);
    expect(engine.start).not.toHaveBeenCalled();
    cleanup();
    reduced = false;
    fine = false;
    render(
      <footer>
        <FooterFluid />
      </footer>,
    );
    await visible(true);
    expect(engine.start).not.toHaveBeenCalled();
  });
  it("pauses hidden tabs and preference changes, then resumes without a second engine", async () => {
    render(
      <footer>
        <FooterFluid />
      </footer>,
    );
    await visible(true);
    hidden = true;
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    expect(engine.pause).toHaveBeenCalled();
    hidden = false;
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    reduced = true;
    act(() => changeMotion?.());
    expect(engine.pause).toHaveBeenCalledTimes(2);
    expect(engine.start).toHaveBeenCalledOnce();
  });
  it("retains a white footer and readable ink in either theme without stealing pointer events", () => {
    const css = readFileSync(resolve("src/components/site/footer-fluid.css"), "utf8");
    expect(css).toContain(".dark .rycode-coorda footer.coorda-legacy-footer");
    expect(css).toMatch(/background:\s*#fff/);
    expect(css).toMatch(/color:\s*#1a1a1a/);
    expect(css).toMatch(/pointer-events:\s*none/);
    expect(css).toContain(".coorda-footer-content");
  });
});
