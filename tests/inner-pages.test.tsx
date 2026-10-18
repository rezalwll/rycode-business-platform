// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { AnchorHTMLAttributes, ImgHTMLAttributes } from "react";
import postcss from "postcss";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
  default: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props} />,
}));
vi.mock("next/image", () => ({
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));
vi.mock("@/server/queries/public-content", () => ({ listPublicFaqs: async () => [] }));
vi.mock("@/components/public/lead-form", () => ({
  LeadForm: ({ kind, sourcePath }: { kind: string; sourcePath: string }) => (
    <form data-kind={kind} data-source={sourcePath} />
  ),
}));

import { InnerHero, InnerLink, servicePageImage } from "@/components/public/inner-ui";
import { InnerHelp } from "@/components/public/inner-help";
import { PublicCatalogHub } from "@/components/public/cms-catalog";
import { CompanyPage, PublicLeadPage } from "@/components/public/marketing-pages";
import { CatalogDetail } from "@/components/public/catalog-pages";
import { allCatalogEntries, catalogPath, getCatalogEntries } from "@/content/catalog";
import { serviceFamilies } from "@/content/service-model";
import { localizedHref } from "@/i18n/public-href";
import type { Locale } from "@/i18n/routing";

afterEach(cleanup);
const documentOf = (html: string) => new DOMParser().parseFromString(html, "text/html");

describe("Paknevis internal layout adaptation", () => {
  it.each(["fa", "en"] as const)(
    "uses distinct layouts with one localized heading for %s",
    async (locale) => {
      const services = documentOf(
        renderToStaticMarkup(
          <PublicCatalogHub
            locale={locale}
            kind="services"
            entries={getCatalogEntries("services").map((entry) => ({
              source: "static" as const,
              entry,
              cms: null,
            }))}
          />,
        ),
      );
      expect(services.querySelectorAll("h1")).toHaveLength(1);
      expect(services.querySelector(".inner-hero-split")).toBeTruthy();
      for (const family of serviceFamilies) {
        const block = services.getElementById(family.id)!;
        expect(block.querySelector(".inner-family-image")).toBeTruthy();
        expect(block.textContent).toContain(family.scope[locale]);
        for (const slug of family.slugs)
          expect(
            block.querySelector(`a[href="${localizedHref(locale, `/services/${slug}`)}"]`),
          ).toBeTruthy();
      }
      const about = documentOf(renderToStaticMarkup(await CompanyPage({ locale, slug: "about" })));
      expect(about.querySelector(".inner-story")).toBeTruthy();
      expect(about.querySelectorAll("#process .inner-timeline > li")).toHaveLength(4);
      expect(about.querySelector("#approach .inner-values")).toBeTruthy();
      expect(about.querySelector("#technology .inner-values")).toBeTruthy();
      expect(about.querySelectorAll("h1")).toHaveLength(1);
      const terms = documentOf(renderToStaticMarkup(await CompanyPage({ locale, slug: "terms" })));
      expect(terms.querySelector(".inner-hero-document")).toBeTruthy();
      const chapters = [...terms.querySelectorAll(".inner-document > section")];
      expect(chapters.length).toBeGreaterThanOrEqual(5);
      for (const section of chapters)
        expect(terms.querySelector(`.inner-toc a[href="#${section.id}"]`)).toBeTruthy();
      const projects = documentOf(
        renderToStaticMarkup(
          <PublicCatalogHub
            locale={locale}
            kind="projects"
            entries={getCatalogEntries("projects").map((entry) => ({
              source: "static" as const,
              entry,
              cms: null,
            }))}
          />,
        ),
      );
      expect(projects.querySelector(".inner-hero-center")).toBeTruthy();
      expect(projects.querySelector(".inner-work-grid")).toBeTruthy();
      expect(projects.querySelectorAll(".inner-catalog-card")).toHaveLength(
        getCatalogEntries("projects").length,
      );
    },
  );

  it("retains every catalog chapter, item and enquiry destination without treating studies as client work", () => {
    for (const locale of ["fa", "en"] as const)
      for (const entry of allCatalogEntries().filter((item) => item.kind !== "blog")) {
        const doc = documentOf(
          renderToStaticMarkup(<CatalogDetail locale={locale} entry={entry} />),
        );
        expect(doc.querySelectorAll("h1")).toHaveLength(1);
        expect(doc.querySelectorAll(".reference-content-section")).toHaveLength(
          entry.sections.length,
        );
        expect(doc.querySelector(".inner-hero-media img")).toBeTruthy();
        expect(
          doc.querySelector(
            entry.kind === "projects" ? ".inner-project-sections" : ".inner-detail-grid",
          ),
        ).toBeTruthy();
        for (const section of entry.sections) {
          expect(doc.body.textContent).toContain(section.title[locale]);
          if (section.body) expect(doc.body.textContent).toContain(section.body[locale]);
          for (const item of section.items ?? [])
            expect(doc.body.textContent).toContain(item[locale]);
        }
        if (entry.conceptual)
          expect(doc.querySelector(".inner-disclosure")?.textContent).toContain(
            locale === "fa" ? "نه پروژهٔ واقعی" : "not client work",
          );
        for (const link of doc.querySelectorAll<HTMLAnchorElement>("a[href^='#']"))
          expect(doc.getElementById(link.getAttribute("href")!.slice(1))).toBeTruthy();
        expect(
          doc.querySelector(`a[href="${localizedHref(locale, "/start-project")}"]`),
        ).toBeTruthy();
      }
  });

  it.each(["fa", "en"] as const)(
    "keeps all form kinds, source paths and topic navigation for %s",
    (locale) => {
      const routes = {
        contact: "/contact",
        project: "/start-project",
        technical_review: "/technical-review",
        seo_audit: "/seo-audit",
      } as const;
      for (const [kind, path] of Object.entries(routes)) {
        const doc = documentOf(
          renderToStaticMarkup(
            <PublicLeadPage locale={locale} kind={kind as keyof typeof routes} sourcePath={path} />,
          ),
        );
        expect(doc.querySelector(".inner-contact-grid")).toBeTruthy();
        expect(doc.querySelectorAll("h1")).toHaveLength(1);
        expect(doc.querySelector("form")?.getAttribute("data-kind")).toBe(kind);
        expect(doc.querySelector("form")?.getAttribute("data-source")).toBe(path);
        expect(doc.querySelector('[aria-current="page"]')?.getAttribute("href")).toBe(
          localizedHref(locale, path),
        );
        expect(doc.querySelector(".inner-contact-copy img")).toBeNull();
        expect(doc.querySelector(".inner-contact-note")).toBeTruthy();
      }
    },
  );

  it("filters managed FAQ titles, answers and Persian letter variants, and toggles accessible answers", () => {
    render(
      <div className="rycode-inner">
        <InnerHelp
          locale="fa"
          title="پرسش‌ها"
          lead="راهنما"
          items={[
            { title: "پشتیبانی چگونه است؟", body: "نگهداری بعد از انتشار" },
            { title: "كی شروع کنیم؟", body: "پس از برآورد هزینه" },
            { title: "کد برای خودمان می‌ماند؟", body: "مالکیت کد مشخص می‌شود" },
          ]}
        />
      </div>,
    );
    const search = screen.getByRole("searchbox");
    fireEvent.change(search, { target: { value: "هزینه" } });
    expect(screen.getByRole("button", { name: "كی شروع کنیم؟" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "پشتیبانی چگونه است؟" })).toBeNull();
    fireEvent.change(search, { target: { value: "کی" } });
    const question = screen.getByRole("button", { name: "كی شروع کنیم؟" });
    fireEvent.click(question);
    expect(question.getAttribute("aria-expanded")).toBe("true");
    const answer = document.getElementById(question.getAttribute("aria-controls")!)!;
    expect(answer.getAttribute("aria-hidden")).toBe("false");
    expect(answer.hasAttribute("inert")).toBe(false);
    fireEvent.click(question);
    expect(answer.getAttribute("aria-hidden")).toBe("true");
    expect(answer.hasAttribute("inert")).toBe(true);
    fireEvent.change(search, { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: /^پشتیبانی$/ }));
    expect(screen.getByRole("button", { name: "پشتیبانی چگونه است؟" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "كی شروع کنیم؟" })).toBeNull();
    fireEvent.change(search, { target: { value: "ناموجود" } });
    expect(screen.getByRole("link", { name: "از ما بپرس" }).getAttribute("href")).toBe("/contact");
  });

  it("keeps English FAQ controls localized and matches answer text", () => {
    render(
      <InnerHelp
        locale="en"
        title="Questions"
        lead="Help"
        items={[{ title: "When can we start?", body: "After a scope review" }]}
      />,
    );
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "SCOPE" } });
    expect(screen.getByRole("button", { name: "When can we start?" })).toBeTruthy();
    expect(screen.getByRole("group", { name: "Question topics" })).toBeTruthy();
  });

  it("preserves local section links and localizes full destinations", () => {
    for (const locale of ["fa", "en"] as Locale[]) {
      const doc = documentOf(
        renderToStaticMarkup(
          <>
            <InnerLink locale={locale} href="#process">
              Process
            </InnerLink>
            <InnerLink locale={locale} href="/contact">
              Contact
            </InnerLink>
          </>,
        ),
      );
      expect(doc.querySelectorAll("a")[0]?.getAttribute("href")).toBe("#process");
      expect(doc.querySelectorAll("a")[1]?.getAttribute("href")).toBe(
        localizedHref(locale, "/contact"),
      );
    }
    render(<InnerHero locale="fa" eyebrow="خدمات" title="عنوان." lead="توضیح" layout="center" />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("عنوان");
  });

  it("uses existing service-specific images with mobile-friendly scoped layout rules", () => {
    const images = getCatalogEntries("services").map((entry) => servicePageImage(entry.slug));
    expect(new Set(images).size).toBeGreaterThanOrEqual(8);
    for (const image of images)
      expect(existsSync(resolve(process.cwd(), `public${image}`))).toBe(true);
    const styles = postcss.parse(
      readFileSync(resolve(process.cwd(), "src/components/public/inner-pages.css"), "utf8"),
    );
    styles.walkRules((rule) => {
      for (const selector of rule.selectors) expect(selector).toContain(".rycode-inner");
    });
    let mobile = false;
    let reducedMotion = false;
    styles.walkAtRules("media", (rule) => {
      if (rule.params.includes("max-width: 767px"))
        mobile = rule.toString().includes("grid-template-columns: minmax(0, 1fr)");
      if (rule.params.includes("prefers-reduced-motion"))
        reducedMotion = rule.toString().includes("transition: none");
    });
    expect(mobile).toBe(true);
    expect(reducedMotion).toBe(true);
    const tokens: Record<string, string> = {};
    styles.walkRules(".coorda-reference .rycode-inner", (rule) =>
      rule.walkDecls((decl) => {
        tokens[decl.prop] = decl.value;
      }),
    );
    expect(tokens["--foreground"]).toBe("var(--inner-ink)");
    expect(tokens["--surface"]).toBe("var(--inner-surface)");
    expect(tokens["--muted-foreground"]).toBe("var(--inner-muted)");
    expect(tokens["--brand"]).toBe("var(--inner-brand)");
    const source = readFileSync(
      resolve(process.cwd(), "src/components/public/marketing-pages.tsx"),
      "utf8",
    );
    expect(source).not.toContain("team-claire");
    expect(source).not.toContain("ReferenceAboutContent");
  });
});
