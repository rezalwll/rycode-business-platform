// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import type { AnchorHTMLAttributes, ImgHTMLAttributes } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
  default: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props} />,
}));
vi.mock("next/image", () => ({
  default: ({
    fill: _fill,
    preload: _preload,
    ...props
  }: ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; preload?: boolean }) => (
    <img alt="" {...props} />
  ),
}));
vi.mock("@/i18n/navigation", () => ({
  Link: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props} />,
}));

import { StudioHome } from "@/components/home/studio-home";
import { ServiceShowcase } from "@/components/home/service-showcase";
import { ProductScene, serviceSceneKind } from "@/components/site/product-scene";
import { PageHero } from "@/components/public/shared";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getCatalogEntries, getCatalogEntry } from "@/content/catalog";
import { serviceFAQs } from "@/content/service-model";
import { serviceCards } from "@/content/service-cards";
import postcss from "postcss";

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", class {
    observe() {} unobserve() {} disconnect() {}
  });
  vi.stubGlobal("matchMedia", () => ({matches:false, addListener:vi.fn(), removeListener:vi.fn(), addEventListener:vi.fn(), removeEventListener:vi.fn()}));
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  vi.stubGlobal("scrollTo", vi.fn());
});
afterEach(() => {cleanup(); vi.unstubAllGlobals(); vi.restoreAllMocks();});

describe("Coorda-inspired public experience with RYCODE content", () => {
  it("gives every service card useful copy and makes app, data and project rescue reachable", () => {
    for (const locale of ["fa", "en"] as const) {
      const { container, unmount } = render(<StudioHome locale={locale} />);
      for (const id of ["stories", "pricing", "testimonials"]) expect(container.querySelector(`#${id}`)).toBeNull();
      expect(container.querySelector(".impact-testimonials-link")?.getAttribute("href")).toBe(`${locale === "en" ? "/en" : ""}/about#approach`);
      const cards = container.querySelectorAll(".features-ticker-group:first-child .feature-card");
      expect(cards).toHaveLength(serviceCards.length);
      cards.forEach((card, index) => {
        const service = serviceCards[index]!;
        expect(card.querySelector("h3")?.textContent).toBe(service.title[locale]);
        expect(card.querySelector(".feature-card-summary")?.textContent).toBe(service.summary[locale]);
        expect(card.querySelector(".feature-card-tag")?.textContent).toBe(service.tag);
        expect(card.querySelector(".capability-card-image img")).toBeTruthy();
        expect(card.querySelector(".capability-card-image > span")).toBeNull();
        expect(card.querySelectorAll(".feature-card-preview a, .feature-card-preview button")).toHaveLength(0);
        expect(card.querySelector(`a[href="${locale === "en" ? "/en" : ""}/services/${service.slug}"]`)).toBeTruthy();
        const detailLink = card.querySelector(".capability-card-link")!;
        expect(detailLink.getAttribute("href")).toBe(`${locale === "en" ? "/en" : ""}/services/${service.slug}`);
        expect(detailLink.getAttribute("aria-label")).toBe(`${locale === "en" ? "More about" : "بیشتر دربارهٔ"} ${service.categoryTitle[locale]}`);
        expect(detailLink.querySelector("strong")?.textContent).toBe(service.linkTitle[locale]);
        expect(detailLink.querySelector(".capability-card-link-arrow svg")).toBeTruthy();
        expect(detailLink.textContent).not.toContain("جزئیات خدمت");
      });
      const faq = container.querySelector("#faq")!;
      for (const item of serviceFAQs) {
        expect(faq.textContent).toContain(item.question[locale]);
        expect(faq.textContent).toContain(item.answer[locale]);
      }
      unmount();
    }
  });
  it("keeps the visible homepage sections in order and omits the three temporarily hidden sections", () => {
    const {container} = render(<StudioHome locale="fa"/>);
    expect(screen.getAllByRole("heading",{level:1})).toHaveLength(1);
    expect(screen.getByRole("heading",{level:1}).getAttribute("aria-label")).toBe("ایده‌ها، از دل سکوت به واقعیت می‌رسند");
    expect(container.querySelector(".hero-video")?.getAttribute("src")).toBe("/videos/rycode-hero.mp4");
    expect([...container.querySelectorAll(".coorda-home > section")].map(section => section.classList[0])).toEqual([
      "hero", "features", "app-showcase", "impact", "community-cta", "desktop-app-section", "native-features", "faq-section", "insights-section", "moments-section"
    ]);
    expect(container.querySelectorAll(".hero-brands-group")).toHaveLength(0);
    expect(container.querySelectorAll(".features-ticker-group .feature-card")).toHaveLength(serviceCards.length * 2);
    expect(container.querySelectorAll(".features-slider .feature-card")).toHaveLength(serviceCards.length);
    expect(container.querySelectorAll(".showcase-screen")).toHaveLength(4);
    expect(container.querySelectorAll(".impact-topic-group")).toHaveLength(4);
    expect(container.querySelectorAll(".native-card")).toHaveLength(4);
    expect(container.querySelectorAll(".pricing-card")).toHaveLength(0);
    expect(container.querySelectorAll(".testimonial-card")).toHaveLength(0);
    for (const id of ["stories", "pricing", "testimonials"]) expect(container.querySelector(`#${id}`)).toBeNull();
    expect(container.querySelectorAll(".insight-card")).toHaveLength(3);
    expect(container.querySelector(".expertise-selector")).toBeNull();
  });

  it("preserves service destinations and links principles to the visible about page", () => {
    const {container}=render(<StudioHome locale="fa"/>);
    const links=[...container.querySelectorAll<HTMLAnchorElement>('a[href^="/services/"]')];
    expect(links.length).toBeGreaterThanOrEqual(6);
    for(const link of links)expect(getCatalogEntry("services",link.getAttribute("href")!.split("/")[2]!)).toBeTruthy();
    expect(container.textContent).not.toContain("چیزی که می‌شود ساخت");
    expect(container.textContent).not.toContain("مسیرت را پیدا کن");
    expect(container.textContent).not.toContain("نه نقل‌قول مشتریان");
    expect(container.querySelector(".impact-testimonials-link")?.getAttribute("href")).toBe("/about#approach");
    expect(container.querySelector('a[href="#testimonials"]')).toBeNull();
    expect(container.textContent).not.toContain("50K+");
    expect(container.textContent).not.toContain("960+");
  });

  it("restores the confirmed original video-hero headline and typography from f714d15", () => {
    const { container } = render(<StudioHome locale="fa" />);
    const title = container.querySelector(".hero-title")!;
    const composition = title.querySelector(".hero-title-desktop")!;
    expect(title.classList.contains("rycode-hero-title")).toBe(true);
    expect(composition.querySelector(".hero-thumb-wrap")).toBeNull();
    expect(composition.querySelector(".hero-message-wrap")).toBeNull();
    expect([...composition.querySelectorAll(".hero-title-line")].map(line => line.textContent)).toEqual(["ایده‌ها، از دل سکوت", "به واقعیت می‌رسند"]);
    expect(composition.querySelector(".hero-title-accent")?.textContent).toBe("واقعیت");
    expect([...composition.querySelectorAll(".hero-title-soft")].map(span => span.textContent)).toEqual(["از دل سکوت", "به "]);
    expect(title.querySelector(".hero-title-mobile")).toBeNull();
    expect(composition.textContent).not.toContain("شکل می‌گیرند");
    expect(composition.textContent).toContain("می‌رسند");
    const overrides = readFileSync(resolve(process.cwd(), "src/components/site/coorda-reference-overrides.css"), "utf8");
    expect(overrides).toMatch(/\.rycode-hero-title \.hero-title-accent\s*\{\s*color: var\(--accent-blue\);/);
    expect(overrides).toContain("font-size: clamp(2.15rem, 5vw, 4.9rem)");
    expect(overrides).toContain("line-height: 1.22");
    expect(overrides).toContain("color: rgb(255 255 255 / 48%)");
    expect(overrides).toContain("font-weight: 300");
  });

  it("localises every English navigation destination", () => {
    const {container}=render(<StudioHome locale="en"/>);
    expect(screen.getByRole("heading",{level:1}).getAttribute("aria-label")).toBe("Ideas born in silence become reality");
    const links=[...container.querySelectorAll<HTMLAnchorElement>('a[href^="/"]')];
    expect(links.length).toBeGreaterThan(20);
    for(const link of links)expect(link.getAttribute("href")).toMatch(/^\/en(?:\/|$)/);
    expect(container.textContent).toContain("Concept interface preview");
  });

  it("retains the original mobile feature carousel and hides inactive cards from interaction", () => {
    const {container}=render(<StudioHome locale="fa"/>);
    const carousel=container.querySelector(".features-slider")! as HTMLElement;
    const slides=carousel.querySelectorAll(".feature-slide");
    expect(slides[0]!.getAttribute("aria-hidden")).toBe("false");
    fireEvent.click(within(carousel).getByRole("button",{name:"خدمت بعدی"}));
    expect(slides[0]!.getAttribute("aria-hidden")).toBe("true");
    expect(slides[1]!.getAttribute("aria-hidden")).toBe("false");
    expect(slides[0]!.hasAttribute("inert")).toBe(true);
    fireEvent.keyDown(carousel,{key:"ArrowLeft"});
    expect(slides[0]!.getAttribute("aria-hidden")).toBe("false");
  });

  it("opens the supplied FAQ with labelled disclosure controls and no nested interactive elements", () => {
    const {container}=render(<StudioHome locale="fa"/>);
    const faq=container.querySelector("#faq")! as HTMLElement;
    const buttons=within(faq).getAllByRole("button");
    expect(buttons).toHaveLength(8);
    expect(buttons[0]!.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(buttons[0]!);
    expect(buttons[0]!.getAttribute("aria-expanded")).toBe("true");
    expect(document.getElementById(buttons[0]!.getAttribute("aria-controls")!)!.getAttribute("aria-hidden")).toBe("false");
    fireEvent.click(buttons[1]!);
    expect(buttons[0]!.getAttribute("aria-expanded")).toBe("false");
    expect(buttons[1]!.getAttribute("aria-expanded")).toBe("true");
    expect(container.querySelectorAll("button button, button a")).toHaveLength(0);
  });

  it("right-aligns Persian FAQs and puts toggles at the logical end without breaking English", () => {
    for (const locale of ["fa", "en"] as const) {
      const { container, unmount } = render(<StudioHome locale={locale} />);
      const faq = container.querySelector("#faq")!;
      expect(faq.getAttribute("dir")).toBe(locale === "fa" ? "rtl" : "ltr");
      const button = within(faq as HTMLElement).getAllByRole("button")[0]!;
      expect(button.querySelector(".faq-toggle")?.getAttribute("aria-hidden")).toBe("true");
      fireEvent.click(button);
      expect(faq.querySelector(".faq-answer")?.textContent).toBe(serviceFAQs[0]!.answer[locale]);
      fireEvent.click(button);
      expect(button.getAttribute("aria-expanded")).toBe("false");
      unmount();
    }
    const css = postcss.parse(readFileSync(resolve(process.cwd(), "src/components/site/coorda-reference.css"), "utf8"));
    const declarations = (selector: string) => {
      const values: Record<string, string> = {};
      css.walkRules(selector, rule => { rule.walkDecls(decl => { values[decl.prop] = decl.value; }); });
      return values;
    };
    expect(declarations('.coorda-reference .faq-section[dir="rtl"] .faq-container h2')["text-align"]).toBe("start");
    expect(declarations(".coorda-reference .faq-question")["text-align"]).toBe("start");
    expect(declarations(".coorda-reference .faq-question")["padding-inline-end"]).toBe("78px");
    expect(declarations(".coorda-reference .faq-toggle")["inset-inline-end"]).toBe("0");
    expect(declarations(".coorda-reference .faq-toggle").right).toBeUndefined();
    expect(declarations(".coorda-reference .faq-answer")["text-align"]).toBe("start");
  });

  it("keeps published catalog entries and summaries intact in the showcase", () => {
    const entries = getCatalogEntries("services");
    const { container } = render(<ServiceShowcase entries={entries} locale="fa" />);
    expect(container.querySelectorAll(".service-bento-card")).toHaveLength(entries.length);
    for (const entry of entries) expect(screen.getByText(entry.summary.fa)).toBeTruthy();
  });

  it("keeps illustrative UI out of the accessibility tree and contains no fake controls", () => {
    const { container } = render(<ProductScene kind="software" locale="fa" hero />);
    expect(container.querySelector(".product-scene")?.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelectorAll("button, input, a")).toHaveLength(0);
    expect(container.textContent).toContain("نمای مفهومی");
  });

  it("maps service illustrations and strips trailing periods from page headings", () => {
    expect(serviceSceneKind("web-development")).toBe("web");
    expect(serviceSceneKind("api-integration")).toBe("integration");
    expect(serviceSceneKind("seo-growth")).toBe("growth");
    expect(serviceSceneKind("ongoing-support")).toBe("support");
    expect(serviceSceneKind("mobile-app-development")).toBe("mobile");
    expect(serviceSceneKind("data-analytics")).toBe("data");
    render(
      <PageHero locale="fa" title="عنوان صفحه." eyebrow="خدمات" lead="توضیح" visualVariant="web" />,
    );
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("عنوان صفحه");
  });

  it("keeps the looping background video without a manual playback button in either language", () => {
    for (const locale of ["fa", "en"] as const) {
      const { container, unmount } = render(<StudioHome locale={locale} />);
      const hero = container.querySelector(".hero")! as HTMLElement;
      const subtitle = hero.querySelector(".rycode-hero-subtitle");
      expect(subtitle?.textContent).toBe(locale === "fa"
        ? "برای کسب‌وکارهایی که بزرگ فکر می‌کنند، فضای دیجیتال می‌سازیم؛ از سایت و فروشگاه تا نرم‌افزار اختصاصی با تمرکز، دقت و مهندسی."
        : "We build digital experiences for businesses that think big, from websites and stores to custom software with focus, care and engineering.");
      expect(hero.querySelector(".hero-content > .hero-cta")).toBeTruthy();
      const video = hero.querySelector("video")!;
      expect(video.autoplay).toBe(true);
      expect(video.loop).toBe(true);
      expect(video.muted).toBe(true);
      expect(video.controls).toBe(false);
      expect(hero.querySelector(".reference-film-toggle")).toBeNull();
      expect(within(hero).queryAllByRole("button")).toHaveLength(0);
      expect(hero.querySelector(".hero-brands")).toBeNull();
      expect(hero.querySelector(".hero-brands-track")).toBeNull();
      expect(hero.querySelector(".reference-logo-note")).toBeNull();
      expect(hero.querySelector('img[src^="/coorda-template/logo-"]')).toBeNull();
      expect(hero.textContent).not.toContain("لوگوهای این نوار فعلاً نمایشی‌اند");
      expect(hero.textContent).not.toContain("These logos are placeholders");
      unmount();
    }
  });
});
