import { describe, expect, it } from "vitest";

import {
  allCatalogEntries,
  catalogKinds,
  catalogPath,
  getCatalogEntries,
  getCatalogEntry,
  isCatalogKind,
  localize,
  resolveCatalogDetail,
} from "@/content/catalog";

describe("public catalog", () => {
  it("uses unique kind/slug pairs", () => {
    const keys = allCatalogEntries().map((entry) => `${entry.kind}/${entry.slug}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("provides non-empty Persian and English copy", () => {
    for (const entry of allCatalogEntries()) {
      expect(localize(entry.title, "fa").trim()).not.toBe("");
      expect(localize(entry.title, "en").trim()).not.toBe("");
      expect(localize(entry.summary, "fa").trim()).not.toBe("");
      expect(localize(entry.summary, "en").trim()).not.toBe("");
    }
  });

  it("keeps every project explicitly conceptual", () => {
    const projects = getCatalogEntries("projects");
    expect(projects.length).toBeGreaterThan(0);
    expect(projects.every((entry) => entry.conceptual === true)).toBe(true);
    expect(projects.every((entry) => entry.eyebrow.en.toLowerCase().includes("concept"))).toBe(
      true,
    );
  });

  it("resolves known routes and rejects unknown kinds", () => {
    expect(isCatalogKind("services")).toBe(true);
    expect(isCatalogKind("customers")).toBe(false);
    expect(getCatalogEntry("services", "web-development")?.kind).toBe("services");
    expect(getCatalogEntry("services", "missing")).toBeUndefined();
    expect(catalogKinds).toContain("blog");
  });

  it("keeps every catalog detail reachable after moving business content into services", () => {
    for (const entry of allCatalogEntries()) {
      const path = catalogPath(entry.kind, entry.slug);
      expect(resolveCatalogDetail(path.slice(1).split("/"))).toEqual({
        kind: entry.kind,
        slug: entry.slug,
      });
      if (entry.kind === "solutions" || entry.kind === "industries") {
        expect(path.startsWith(`/services/${entry.kind}/`)).toBe(true);
      }
    }
    expect(catalogPath("solutions")).toBe("/services#solutions");
    expect(catalogPath("industries")).toBe("/services#industries");
    expect(resolveCatalogDetail(["services", "blog", "crm"])).toBeNull();
    expect(resolveCatalogDetail(["services", "solutions", "crm", "extra"])).toBeNull();
  });
});
