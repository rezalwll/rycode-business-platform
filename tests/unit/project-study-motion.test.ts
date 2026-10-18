import { spring } from "motion";
import { describe, expect, it } from "vitest";
import { projectStudyGap, projectStudyPhase, projectStudySpring } from "@/components/template/project-study-motion";

describe("reference-aligned project study motion", () => {
  it.each([[720, 600], [900, 600], [844, 450], [568, 450], [600, 700]])(
    "uses actual card and viewport landmarks at %ipx viewport / %ipx card", (viewport, height) => {
      const progressAtTop = (top: number) => (viewport - top) / (viewport + height);
      expect(projectStudyPhase(progressAtTop(viewport), viewport, height)).toBe(-1);
      expect(projectStudyPhase(progressAtTop(viewport - height), viewport, height)).toBeCloseTo(0, 10);
      // The exact reference exit is reached if the following card's bottom
      // reaches viewport bottom before this card is completely off-screen.
      const exitTop = viewport - height * 2 - projectStudyGap;
      if (exitTop >= -height) expect(projectStudyPhase(progressAtTop(exitTop), viewport, height)).toBeCloseTo(1, 10);
      const middle = progressAtTop(viewport - height / 2);
      expect(projectStudyPhase(middle, viewport, height)).toBeCloseTo(-.5, 10);
    },
  );

  it("matches the settled rotation and scale sampled from the original, rather than centering too late", () => {
    const viewport = 720, height = 600;
    const progress = (viewport - 327.15625) / (viewport + height);
    const phase = projectStudyPhase(progress, viewport, height);
    expect(phase * 50).toBeCloseTo(-17.1667, 0);
    expect(1 - Math.abs(phase) * .2).toBeCloseTo(.931333, 2);
    expect(projectStudyPhase(height / (height + viewport), viewport, height)).toBe(0);
    expect(projectStudyPhase(.5, viewport, height)).toBeGreaterThan(0);
  });

  it("keeps neighboring cards in sequence and handles reverse scrolling deterministically", () => {
    for (let top = 720; top >= -600; top -= 8) {
      const phase = projectStudyPhase((720 - top) / 1320, 720, 600);
      const next = projectStudyPhase((720 - (top + 600 + projectStudyGap)) / 1320, 720, 600);
      expect(next).toBeLessThanOrEqual(phase);
      expect(phase).toBeGreaterThanOrEqual(-1);
      expect(phase).toBeLessThanOrEqual(1);
      expect(projectStudyPhase((720 - top) / 1320, 720, 600)).toBe(phase);
    }
  });

  it("filters sudden wheel steps without overshooting in either direction", () => {
    expect(projectStudySpring.damping ** 2).toBeGreaterThan(4 * projectStudySpring.stiffness * projectStudySpring.mass);
    for (const [from, to] of [[0, 1], [1, 0]]) {
      const animation = spring({ keyframes: [from!, to!], ...projectStudySpring });
      let previous = from!;
      for (let ms = 0; ms <= 2000; ms += 16) {
        const value = animation.next(ms).value;
        expect(value).toBeGreaterThanOrEqual(-.00001);
        expect(value).toBeLessThanOrEqual(1.00001);
        expect(to! > from! ? value >= previous - .00001 : value <= previous + .00001).toBe(true);
        previous = value;
      }
      expect(previous).toBeCloseTo(to!, 3);
    }
    const response = spring({ keyframes: [0, 1], ...projectStudySpring });
    expect(response.next(16).value).toBeLessThan(.05);
    expect(response.next(500).value).toBeGreaterThan(.85);
  });

  it("avoids invalid transforms during initial layout and resize", () => {
    for (const args of [[0, 0, 0], [.5, 720, 0], [NaN, 720, 600], [.5, Infinity, 600]])
      expect(projectStudyPhase(args[0]!, args[1]!, args[2]!)).toBe(0);
    expect(projectStudyPhase(-1, 720, 600)).toBe(-1);
    expect(projectStudyPhase(2, 720, 600)).toBe(1);
  });
});
