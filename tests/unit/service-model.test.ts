import { describe, expect, it } from "vitest";
import { getCatalogEntries, getCatalogEntry } from "@/content/catalog";
import { familyForService, serviceFamilies, serviceExampleEntries, serviceHighlights, serviceFAQs, serviceEnquiry } from "@/content/service-model";
import { getPrimaryNav, getServiceGroups, getFooterNav } from "@/lib/nav-content";

describe("public service architecture", () => {
  it("covers every service once through the owner's seven ordered categories", () => {
    expect(serviceHighlights).toHaveLength(7);
    expect(serviceHighlights.map(service => service.tag)).toEqual(["WEB / ECOMMERCE", "SEO / GROWTH", "CUSTOM SOFTWARE", "BUG FIX / PROJECT RESCUE", "BOTS / AUTOMATION / API", "EXCEL / DATA / BUSINESS TOOLS", "SUPPORT / MAINTENANCE"]);
    const slugs = serviceHighlights.flatMap(service => [...service.coveredSlugs]);
    expect(new Set(slugs).size).toBe(9);
    expect([...slugs].sort()).toEqual(getCatalogEntries("services").map(entry => entry.slug).sort());
    for (const service of serviceHighlights) {
      expect(service.coveredSlugs).toContain(service.slug);
      for (const related of service.related) {
        expect(service.coveredSlugs).toContain(related.slug);
        expect(getCatalogEntry("services", related.slug)).toBeTruthy();
      }
      for (const locale of ["fa", "en"] as const) {
        expect(service.summary[locale].length).toBeGreaterThan(30);
        expect(service.title[locale]).not.toMatch(/[.。]$/);
      }
    }
  });
  it("uses the same bilingual service families in the menu and footer", () => {
    for (const locale of ["fa", "en"] as const) {
      expect(getFooterNav(locale)[1]?.items).toEqual(serviceFamilies.map(family => ({ label: family.title[locale], href: `/services#${family.id}` })));
      const menu = getPrimaryNav(locale)[0]?.menu?.at(-1);
      expect(menu?.items.map(item => item.href)).toContain("/services#solutions");
      expect(menu?.items.map(item => item.href)).toContain("/services#industries");
      expect(getPrimaryNav(locale).find(item => item.href === "/blog")?.label).toBe(locale === "fa" ? "بلاگ" : "Blog");
    }
  });
  it("answers practical questions without promising rankings and routes enquiries to the right form", () => {
    expect(serviceFAQs).toHaveLength(8);
    expect(serviceFAQs.at(-1)?.answer.en).toMatch(/^No\./);
    expect(serviceEnquiry("seo-growth").href).toBe("/seo-audit");
    expect(serviceEnquiry("project-rescue").href).toBe("/technical-review");
    expect(serviceEnquiry("ongoing-support").href).toBe("/contact");
    expect(serviceEnquiry("web-development").href).toBe("/start-project");
  });
  it("assigns all nine detail services to exactly one of seven families", () => {
    const slugs = serviceFamilies.flatMap((family) => [...family.slugs]);
    expect(serviceFamilies).toHaveLength(7);
    expect(new Set(slugs).size).toBe(9);
    expect(slugs.sort()).toEqual(
      getCatalogEntries("services")
        .map((entry) => entry.slug)
        .sort(),
    );
    for (const slug of slugs) expect(familyForService(slug)).toBeTruthy();
    expect(familyForService("missing")).toBeUndefined();
  });
  it("gives each service a specific brief without inventing guarantees", () => {
    for (const entry of getCatalogEntries("services")) {
      expect(entry.sections[0]?.title.en).toBe("Who is this for?");
      expect(entry.sections[1]?.items).toHaveLength(3);
      expect(entry.sections.at(-2)?.title.en).toBe("What affects cost and timing?");
      expect(entry.sections.at(-1)?.title.en).toBe("Handover and ongoing care");
    }
    expect(getCatalogEntry("services", "mobile-app-development")?.summary.fa).toContain(
      "اپلیکیشنی",
    );
    for (const service of serviceHighlights) {
      const detail = getCatalogEntry("services", service.slug)!;
      expect(detail.summary).toEqual(service.summary);
      expect(detail.sections.some(section => section.body?.fa === service.scope.fa)).toBe(true);
    }
  });
  it("keeps the menu short and localizes all nine service names", () => {
    for (const locale of ["fa", "en"] as const) {
      const nav = getPrimaryNav(locale);
      expect(nav.filter((item) => !item.emphasis).map((item) => item.href)).toEqual([
        "/services",
        "/projects",
        "/about",
        "/blog",
        "/contact",
      ]);
      const links = getServiceGroups(locale).flatMap((group) => group.items);
      expect(links).toHaveLength(9);
      for (const link of links)
        expect(link.label).toBe(
          getCatalogEntry("services", link.href.split("/")[2]!)?.title[locale],
        );
      expect(nav.find(item => item.href === "/about")?.menu?.[0]?.items.map((link) => link.href)).toContain("/about#process");
    }
  });
  it("maps only available examples to relevant services and retains concept status", () => {
    const examples = serviceExampleEntries(getCatalogEntries("projects"));
    expect(examples.ecommerce).toHaveLength(1);
    expect(examples["custom-software"]).toHaveLength(2);
    expect(
      Object.values(examples)
        .flat()
        .every((project) => project?.conceptual),
    ).toBe(true);
    expect(serviceExampleEntries([]).ecommerce).toEqual([]);
  });
});
