// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import type { AnchorHTMLAttributes, ImgHTMLAttributes } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const settings = vi.hoisted(() => ({ pathname: "/", reduce: false }));
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
vi.mock("next/navigation", () => ({ usePathname: () => settings.pathname }));
vi.mock("@/i18n/navigation", () => ({
  usePathname: () => settings.pathname,
  Link: ({
    locale: _locale,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { locale?: string }) => <a {...props} />,
}));
vi.mock("@/server/queries/public-content", () => ({ listPublicFaqs: async () => [] }));
vi.mock("@/components/public/lead-form", () => ({
  LeadForm: ({ kind, sourcePath }: { kind: string; sourcePath: string }) => (
    <form data-kind={kind} data-source={sourcePath} aria-label="Retained lead form" />
  ),
}));
vi.mock("@/components/auth/auth-card", () => ({
  AuthCard: ({ mode }: { mode: string }) => (
    <section data-mode={mode}>
      <h1>Account</h1>
    </section>
  ),
}));

import { HeroFilm } from "@/components/home/hero-film";
import { CollaborationSteps } from "@/components/home/collaboration-steps";
import { SiteShell } from "@/components/site/site-shell";
import { CatalogDetail } from "@/components/public/catalog-pages";
import { CompanyPage, PublicLeadPage, InstallmentPage } from "@/components/public/marketing-pages";
import { PublicFailurePage } from "@/components/public/failure-page";
import { allCatalogEntries, catalogPath } from "@/content/catalog";
import { AuthPage } from "@/components/auth/auth-page";

beforeEach(() => {
  settings.pathname = "/";
  settings.reduce = false;
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: query.includes("reduced-motion") && settings.reduce,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  vi.spyOn(document, "hidden", "get").mockReturnValue(false);
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("Coorda adaptation invariants", () => {
  it("uses the original hero film and allows pausing and resuming it", () => {
    const { container } = render(<HeroFilm locale="fa" />);
    expect(container.querySelector("source")?.getAttribute("src")).toBe("/videos/rycode-hero.mp4");
    expect(container.querySelector("video")?.getAttribute("poster")).toBe(
      "/images/editorial/rycode-hero-poster.jpg",
    );
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "توقف ویدیوی پس‌زمینه" }));
    expect(
      screen.getByRole("button", { name: "پخش ویدیوی پس‌زمینه" }).getAttribute("aria-pressed"),
    ).toBe("true");
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "پخش ویدیوی پس‌زمینه" }));
    expect(
      screen.getByRole("button", { name: "توقف ویدیوی پس‌زمینه" }).getAttribute("aria-pressed"),
    ).toBe("false");
  });
  it("does not play the background when reduced motion is requested", () => {
    settings.reduce = true;
    render(<HeroFilm locale="en" />);
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  });
  it("adapts expanding native cards to collaboration steps, with real disclosure controls", () => {
    render(<CollaborationSteps locale="fa" />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(4);
    expect(buttons[0]?.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(buttons[2]!);
    expect(buttons[0]?.getAttribute("aria-expanded")).toBe("false");
    expect(buttons[2]?.getAttribute("aria-expanded")).toBe("true");
    expect(document.getElementById(buttons[2]!.getAttribute("aria-controls")!)?.hidden).toBe(false);
    expect(document.getElementById(buttons[0]!.getAttribute("aria-controls")!)?.hidden).toBe(true);
  });
  it("retains the three-part glass header and restores the large RYCODE footer", () => {
    const { container } = render(
      <SiteShell locale="fa">
        <h1>Test page</h1>
      </SiteShell>,
    );
    expect(container.querySelector(".rycode-coorda")).toBeTruthy();
    expect(container.querySelector("header")?.className).toContain("backdrop-blur-xl");
    expect(container.querySelector("header > div")?.className).toContain(
      "grid-cols-[1fr_auto_1fr]",
    );
    expect(container.querySelector(".coorda-footer-wordmark")?.textContent).toBe("RYCODE");
    expect(container.querySelector(".coorda-footer-wordmark img")).toBeNull();
    expect(container.querySelector(".coorda-footer-identity .coorda-footer-mark")).toBeTruthy();
    expect(container.querySelector("footer .coorda-footer-wordmark")?.getAttribute("class")).toBe(
      "coorda-footer-wordmark",
    );
  });
  it("keeps all catalog content in the new detail layout in both languages", () => {
    for (const locale of ["fa", "en"] as const)
      for (const entry of allCatalogEntries()) {
        const html = renderToStaticMarkup(<CatalogDetail locale={locale} entry={entry} />);
        const document = new DOMParser().parseFromString(html, "text/html");
        expect(document.querySelectorAll(".reference-content-section")).toHaveLength(
          entry.sections.length,
        );
        expect(document.querySelector("h1")?.textContent).toBe(entry.title[locale]);
        expect(document.body.textContent).toContain(entry.summary[locale]);
        for (const section of entry.sections) {
          expect(document.body.textContent).toContain(section.title[locale]);
          if (section.body) expect(document.body.textContent).toContain(section.body[locale]);
          for (const item of section.items ?? [])
            expect(document.body.textContent).toContain(item[locale]);
        }
        expect(catalogPath(entry.kind, entry.slug)).toBeTruthy();
      }
  });
  it("uses the new legal and FAQ structures without losing their sections or schema", async () => {
    for (const locale of ["fa", "en"] as const) {
      for (const slug of ["privacy", "terms"] as const) {
        const html = renderToStaticMarkup(await CompanyPage({ locale, slug }));
        expect(html).toContain("inner-document-grid");
        expect(html).toContain("inner-hero-document");
        expect(
          new DOMParser()
            .parseFromString(html, "text/html")
            .querySelectorAll(".inner-document > section").length,
        ).toBeGreaterThanOrEqual(5);
      }
      const html = renderToStaticMarkup(await CompanyPage({ locale, slug: "faq" }));
      expect(html).toContain('class="inner-help-card"');
      expect(html).toContain('aria-controls="faq-answer-0"');
      expect(html).toContain('"@type":"FAQPage"');
    }
  });
  it("transplants the contact split while retaining form kinds and source attribution", () => {
    const paths = {
      project: "/start-project",
      contact: "/contact",
      technical_review: "/technical-review",
      seo_audit: "/seo-audit",
    } as const;
    for (const [kind, path] of Object.entries(paths)) {
      const html = renderToStaticMarkup(
        <PublicLeadPage locale="en" kind={kind as keyof typeof paths} sourcePath={path} />,
      );
      const doc = new DOMParser().parseFromString(html, "text/html");
      expect(doc.querySelectorAll("h1")).toHaveLength(1);
      expect(doc.querySelector(".inner-contact-copy")).toBeTruthy();
      expect(doc.querySelector(".inner-contact-form")).toBeTruthy();
      expect(doc.querySelector(".inner-contact-copy img")).toBeNull();
      expect(doc.querySelector("form")?.getAttribute("data-kind")).toBe(kind);
      expect(doc.querySelector("form")?.getAttribute("data-source")).toBe(path);
      expect(doc.querySelector('[aria-current="page"]')?.getAttribute("href")).toBe(`/en${path}`);
    }
  });
  it("adapts staged payment and account entry pages without replacing their workflows", () => {
    const payment = renderToStaticMarkup(<InstallmentPage locale="fa" />);
    expect(
      new DOMParser()
        .parseFromString(payment, "text/html")
        .querySelectorAll(".coorda-installment-card"),
    ).toHaveLength(3);
    for (const mode of ["login", "register", "forgot", "reset"] as const) {
      expect(renderToStaticMarkup(<AuthPage locale="fa" mode={mode} />)).toContain(
        `data-mode="${mode}"`,
      );
    }
  });
  it("localizes the error recovery path and keeps the shared public shell", () => {
    settings.pathname = "/en/missing";
    const { container } = render(<PublicFailurePage kind="not-found" />);
    expect(screen.getByRole("heading", { name: "This page is not here" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Back to home" }).getAttribute("href")).toBe("/en");
    expect(container.querySelector(".coorda-footer-wordmark")).toBeTruthy();
  });
});
