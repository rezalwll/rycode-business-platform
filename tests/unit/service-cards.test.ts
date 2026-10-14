import { describe, expect, it } from "vitest";
import { getCatalogEntry } from "@/content/catalog";
import { serviceCards } from "@/content/service-cards";
import { serviceHighlights } from "@/content/service-offerings";
import { advanceFeatureMarquee, FEATURE_HOVER_SPEED, FEATURE_SPEED } from "@/components/template/feature-marquee-motion";

describe("meaningful homepage capabilities", () => {
  it("keeps a concise selection from all seven categories without redundant cards", () => {
    expect(serviceCards).toHaveLength(15);
    expect(serviceCards.find(card => card.id === "crm")?.title.fa).toBe("سیستم مدیریت مشتریان (CRM)");
    expect(serviceHighlights).toHaveLength(7);
    expect(new Set(serviceCards.map(card => card.id)).size).toBe(15);
    expect(serviceCards.slice(0, 7).map(card => card.categoryId)).toEqual(serviceHighlights.map(category => category.id));
    for (const locale of ["fa", "en"] as const) {
      expect(new Set(serviceCards.map(card => card.title[locale])).size).toBe(15);
      expect(new Set(serviceCards.map(card => card.summary[locale])).size).toBe(15);
      for (const card of serviceCards) {
        expect(card.title[locale]).not.toMatch(/[.。]$/);
        expect(card.summary[locale].length).toBeGreaterThan(35);
      }
    }
  });
  it("links every capability to one of its seven parent service pages", () => {
    expect([...new Set(serviceCards.map(card => card.slug))]).toEqual(serviceHighlights.map(category => category.slug));
    for (const card of serviceCards) {
      expect(card.slug).toBe(serviceHighlights.find(category => category.id === card.categoryId)!.slug);
      expect(getCatalogEntry("services", card.slug)).toBeTruthy();
      expect(card.linkTitle.fa).toBeTruthy();
      expect(card.linkTitle.en).toBeTruthy();
    }
    for (const id of ["business-site", "online-store", "landing-redesign", "technical-seo", "content-work", "web-platform", "crm", "android-app", "bug-fixes", "stalled-project", "telegram-order-bot", "workflow-automation", "custom-excel", "reporting-dashboard", "website-support"]) {
      expect(serviceCards.some(card => card.id === id)).toBe(true);
    }
    for (const id of ["personal-site", "medical-site", "local-seo", "keyword-research", "internal-links", "indexing", "payment-sms", "data-import-export", "store-support", "software-support"]) {
      expect(serviceCards.some(card => card.id === id)).toBe(false);
    }
  });
});

describe("distance-based continuous ticker", () => {
  it("slows smoothly on hover without stopping or jumping to another phase", () => {
    let state = { offset: 200, speed: FEATURE_SPEED };
    const first = advanceFeatureMarquee(state, 16, 2000, true);
    expect(first.speed).toBeLessThan(FEATURE_SPEED);
    expect(first.speed).toBeGreaterThan(FEATURE_HOVER_SPEED);
    expect(first.offset).toBeGreaterThan(200);
    expect(first.offset - 200).toBeLessThan(1);
    state = first;
    for (let frame = 0; frame < 180; frame++) state = advanceFeatureMarquee(state, 1000 / 60, 2000, true);
    expect(state.speed).toBeCloseTo(5, 3);
    const next = advanceFeatureMarquee(state, 16, 2000, true);
    expect(next.offset).toBeGreaterThan(state.offset);
    const resumed = advanceFeatureMarquee(next, 16, 2000, false);
    expect(resumed.speed).toBeGreaterThan(next.speed);
    expect(resumed.speed).toBeLessThan(FEATURE_SPEED);
    expect(resumed.offset - next.offset).toBeLessThan(1);
  });
  it("is frame-rate independent and keeps normal speed independent of card count", () => {
    const simulate = (frames: number, period: number) => {
      let state = { offset: 0, speed: FEATURE_SPEED };
      for (let frame = 0; frame < frames; frame++) state = advanceFeatureMarquee(state, 1000 / frames, period, true);
      return state;
    };
    expect(simulate(60, 2000).offset).toBeCloseTo(simulate(120, 2000).offset, 8);
    expect(simulate(60, 2000).offset).toBeCloseTo(simulate(60, 20000).offset, 8);
    expect(advanceFeatureMarquee({ offset: 0, speed: 44 }, 50, 2000, false).offset).toBeCloseTo(2.2);
  });
  it("wraps at the exact duplicated-group boundary with no empty interval", () => {
    const state = advanceFeatureMarquee({ offset: 999.5, speed: FEATURE_SPEED }, 50, 1000, false);
    expect(state.offset).toBeCloseTo(1.7);
    // The identical next sequence covers the viewport at either side of the seam.
    const viewport = 800;
    for (const offset of [0, 500, 999.99, state.offset]) expect(2000 - offset).toBeGreaterThan(viewport);
  });
  it("guards unmeasured geometry and caps long background frame gaps", () => {
    const state = { offset: 100, speed: FEATURE_SPEED };
    expect(advanceFeatureMarquee(state, 16, 0, false)).toBe(state);
    expect(advanceFeatureMarquee(state, 16, NaN, false)).toBe(state);
    expect(advanceFeatureMarquee(state, -10, 2000, false)).toEqual(state);
    expect(advanceFeatureMarquee(state, 60000, 2000, false).offset - 100).toBeCloseTo(44 * .064);
  });
});
