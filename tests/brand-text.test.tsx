import { createRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { BrandText, colorBrandText } from "@/components/site/brand-text";
import { ReferenceLocale } from "@/components/template/reference-locale";
import ReferenceFeatures from "@/components/template/reference-features";
import ReferencePhotoHero from "@/components/template/reference-photo-hero";

describe("blue brand names throughout public copy", () => {
  it("colors only the brand in Persian and English without changing the sentence", () => {
    const html = renderToStaticMarkup(
      <BrandText>
        <p>دربارهٔ رایکد، رای‌کد و رای کد — RYCODE / Rycode / rycode</p>
      </BrandText>,
    );
    expect(html.match(/class="rycode-brand-name"/g)).toHaveLength(6);
    expect(html.replace(/<[^>]+>/g, "")).toBe(
      "دربارهٔ رایکد، رای‌کد و رای کد — RYCODE / Rycode / rycode",
    );
    expect(html).toContain('دربارهٔ <span class="rycode-brand-name">رایکد</span>،');
  });

  it("does not match longer words or add a layout wrapper", () => {
    const node = <p>myrycode rycodes رایکدی</p>;
    expect(colorBrandText(node)).toBe(node);
    expect(
      renderToStaticMarkup(
        <BrandText>
          <h2>چرا رایکد</h2>
        </BrandText>,
      ),
    ).toBe('<h2>چرا <span class="rycode-brand-name">رایکد</span></h2>');
  });

  it("preserves link destinations, accessibility names, form values and structured data", () => {
    const html = renderToStaticMarkup(
      <BrandText>
        <a href="/about?brand=RYCODE" aria-label="About RYCODE">
          About RYCODE
        </a>
        <input defaultValue="RYCODE" placeholder="رایکد" />
        <textarea defaultValue="رایکد" />
        <select defaultValue="RYCODE">
          <option>RYCODE</option>
        </select>
        <script type="application/ld+json">{'{"name":"RYCODE"}'}</script>
        <div contentEditable suppressContentEditableWarning>
          رایکد
        </div>
      </BrandText>,
    );
    expect(html.match(/class="rycode-brand-name"/g)).toHaveLength(1);
    expect(html).toContain('aria-label="About RYCODE"');
    expect(html).toContain('href="/about?brand=RYCODE"');
    expect(html).toContain("<textarea>رایکد</textarea>");
    expect(html).toContain('<option selected="">RYCODE</option>');
    expect(html).toContain('{"name":"RYCODE"}');
  });

  it("preserves keyed elements and refs, and is idempotent", () => {
    const ref = createRef<HTMLHeadingElement>();
    const node = (
      <h2 key="title" ref={ref}>
        چرا رایکد
      </h2>
    );
    const styled = colorBrandText(node) as typeof node;
    expect(styled.key).toBe(node.key);
    expect(styled.props.ref).toBe(ref);
    expect(colorBrandText(styled)).toBe(styled);
  });

  it("covers translated home headings and dynamic public page titles on the server", () => {
    for (const locale of ["fa", "en"] as const) {
      const html = renderToStaticMarkup(
        <ReferenceLocale locale={locale}>
          <ReferenceFeatures />
        </ReferenceLocale>,
      );
      expect(html).toContain(
        `class="rycode-brand-name">${locale === "fa" ? "رایکد" : "RYCODE"}</span>`,
      );
    }
    const html = renderToStaticMarkup(
      <ReferencePhotoHero title="درباره رای‌کد" image="/photo.jpg" alt="رایکد" />,
    );
    expect(html).toContain('class="rycode-brand-name">رای‌کد</span>');
    expect(html).toContain('alt="رایکد"');
  });

  it("keeps the same blue token regardless of heading, hover or dark-mode text colors", () => {
    const css = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
    expect(css).toMatch(
      /\.rycode-brand-name\s*\{[^}]*color: var\(--logo-color, #66C0FF\) !important;/,
    );
    expect(css).toContain("-webkit-text-fill-color: var(--logo-color, #66C0FF)");
  });
});
