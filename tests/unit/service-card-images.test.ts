import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { serviceCards } from "@/content/service-cards";

describe("dedicated service photography", () => {
  it("gives all fifteen cards their own locally saved, wide image", () => {
    expect(new Set(serviceCards.map(card => card.image)).size).toBe(15);
    const hashes = serviceCards.map(card => {
      expect(card.image).toBe(`/images/services/${card.id}.png`);
      const bytes = readFileSync(resolve(process.cwd(), "public", card.image.slice(1)));
      expect(bytes.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
      const width = bytes.readUInt32BE(16);
      const height = bytes.readUInt32BE(20);
      expect(width).toBeGreaterThanOrEqual(1000);
      expect(height).toBeGreaterThanOrEqual(500);
      expect(width / height).toBeGreaterThan(1.6);
      expect(width / height).toBeLessThan(1.95);
      return createHash("sha256").update(bytes).digest("hex");
    });
    expect(new Set(hashes).size).toBe(15);
  });
  it("retains the prompt and generation provenance for every final asset", () => {
    const notes = JSON.parse(readFileSync(resolve(process.cwd(), "docs/design/service-card-image-prompts.json"), "utf8"));
    expect(notes.mode).toBe("Built-in image_gen");
    expect(notes.assets).toHaveLength(15);
    for (const card of serviceCards) {
      const asset = notes.assets.find((item: { id: string }) => item.id === card.id);
      expect(asset.path).toBe(`public${card.image}`);
      expect(asset.prompt).toContain("photorealistic-natural");
      expect(asset.prompt).toContain("no fake client identity");
    }
  });
});
