import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import postcss from "postcss";
import { describe, expect, it } from "vitest";

const source = resolve(process.cwd(), "src");
function stylesheets(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? stylesheets(path) : entry.name.endsWith(".css") ? [path] : [];
  });
}
const globalSource = readFileSync(join(source, "styles.css"), "utf8");
const globalCss = postcss.parse(globalSource);

describe("IranYekan throughout the application", () => {
  it("defines one unrestricted local face with the actual static weight", () => {
    const faces: postcss.AtRule[] = [];
    for (const path of stylesheets(source))
      postcss.parse(readFileSync(path, "utf8")).walkAtRules("font-face", (face) => {
        faces.push(face);
      });
    expect(faces).toHaveLength(1);
    const face: Record<string, string> = {};
    faces[0]!.walkDecls((decl) => {
      face[decl.prop] = decl.value;
    });
    expect(face["font-family"]).toBe('"IRANYekan"');
    expect(face.src).toContain("/fonts/iranyekan/iranyekan.ttf");
    expect(face["font-weight"]).toBe("400");
    expect(face["font-display"]).toBe("swap");
    expect(face["unicode-range"]).toBeUndefined();
  });

  it("points display, Latin, logo and code utilities to the same family without language cycles", () => {
    const fonts: Record<string, string> = {};
    globalCss.walkAtRules("theme", (rule) =>
      rule.walkDecls(/^--font-/, (decl) => {
        fonts[decl.prop] = decl.value;
      }),
    );
    expect(fonts["--font-sans"]).toMatch(/^"IRANYekan",/);
    for (const name of ["display", "latin", "logo", "mono"])
      expect(fonts[`--font-${name}`]).toBe("var(--font-sans)");
    globalCss.walkDecls("--font-sans", (decl) => expect(decl.value).not.toBe("var(--font-latin)"));
    let controlsInherit = false;
    globalCss.walkRules((rule) => {
      if (
        ["button", "input", "textarea", "select", "option", "optgroup"].every((selector) =>
          rule.selectors.includes(selector),
        )
      ) {
        rule.walkDecls("font-family", (decl) => {
          controlsInherit = decl.value === "inherit";
        });
      }
    });
    expect(controlsInherit).toBe(true);
  });

  it("does not allow template, blog, English or inline rules to select another font", () => {
    for (const path of stylesheets(source)) {
      const css = postcss.parse(readFileSync(path, "utf8"));
      css.walkDecls("font-family", (decl) => {
        expect(decl.value, `${path}: ${decl.parent?.toString()}`).toMatch(
          /^(?:"IRANYekan"|var\(--(?:font-(?:sans|display|latin|logo|mono)|coorda-font)\)|inherit)$/,
        );
      });
      css.walkDecls("font", (decl) =>
        expect(decl.value).toMatch(/^(?:inherit|.*var\(--font-sans\))$/),
      );
    }
    const reference = readFileSync(
      join(source, "components/site/coorda-reference-overrides.css"),
      "utf8",
    );
    expect(reference).toContain("--coorda-font: var(--font-sans)");
    expect(globalSource).not.toMatch(/Space Grotesk|Open Runde|unicode-range/);
  });

  it("ships a valid font with Latin, digits and Persian glyphs and preloads it globally", () => {
    const font = readFileSync(resolve(process.cwd(), "public/fonts/iranyekan/iranyekan.ttf"));
    const tables = new Map<string, number>();
    for (let index = 0; index < font.readUInt16BE(4); index++) {
      const offset = 12 + index * 16;
      tables.set(font.toString("ascii", offset, offset + 4), font.readUInt32BE(offset + 8));
    }
    expect(tables.has("fvar")).toBe(false);
    expect(font.readUInt16BE(tables.get("OS/2")! + 4)).toBe(400);
    const cmap = tables.get("cmap")!;
    const covered = new Set<number>();
    const characters = [0x41, 0x61, 0x30, 0x631, 0x6cc];
    for (let map = 0; map < font.readUInt16BE(cmap + 2); map++) {
      const subtable = cmap + font.readUInt32BE(cmap + 8 + map * 8);
      if (font.readUInt16BE(subtable) !== 4) continue;
      const segments = font.readUInt16BE(subtable + 6) / 2;
      for (const code of characters)
        for (let segment = 0; segment < segments; segment++) {
          const end = font.readUInt16BE(subtable + 14 + segment * 2);
          const start = font.readUInt16BE(subtable + 16 + segments * 2 + segment * 2);
          if (code < start || code > end) continue;
          const delta = font.readInt16BE(subtable + 16 + segments * 4 + segment * 2);
          const rangePosition = subtable + 16 + segments * 6 + segment * 2;
          const range = font.readUInt16BE(rangePosition);
          const raw = range ? font.readUInt16BE(rangePosition + range + (code - start) * 2) : code;
          if (raw && (raw + delta) & 0xffff) covered.add(code);
          break;
        }
    }
    expect([...covered].sort()).toEqual([...characters].sort());
    const layout = readFileSync(join(source, "app/[locale]/layout.tsx"), "utf8");
    expect(layout).toMatch(
      /rel="preload"\s+href="\/fonts\/iranyekan\/iranyekan\.ttf"\s+as="font"\s+type="font\/ttf"\s+crossOrigin="anonymous"/,
    );
  });
});
