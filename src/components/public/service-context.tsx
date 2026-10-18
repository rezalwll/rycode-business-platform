import Link from "next/link";
import { BrandText } from "@/components/site/brand-text";
import type { Locale } from "@/i18n/routing";
import { catalogPath, localize, type CatalogEntry } from "@/content/catalog";
import type { PublicCatalogEntry } from "@/server/queries/public-content";
import { localizedHref } from "./shared";

function EntrySections({ entry, locale }: { entry: CatalogEntry; locale: Locale }) {
  return (
    <BrandText>
      <div className="reference-context-answer">
        <p>{localize(entry.summary, locale)}</p>
        {entry.sections.map((section, index) => (
          <section key={`${entry.slug}-${index}`}>
            <h4>{localize(section.title, locale)}</h4>
            {section.body && <p>{localize(section.body, locale)}</p>}
            {section.items && (
              <ul>
                {section.items.map((item) => (
                  <li key={localize(item, locale)}>{localize(item, locale)}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
        <Link href={localizedHref(locale, catalogPath(entry.kind, entry.slug))}>
          {locale === "fa" ? "دربارهٔ این مسیر بیشتر بخوان" : "Explore this path"}
        </Link>
      </div>
    </BrandText>
  );
}
export function ServiceContext({
  locale,
  solutions,
  industries,
}: {
  locale: Locale;
  solutions: PublicCatalogEntry[];
  industries: PublicCatalogEntry[];
}) {
  return (
    <BrandText>
      <>
        {[
          {
            id: "solutions",
            title: locale === "fa" ? "چه سیستم‌هایی می‌سازیم؟" : "What systems can we build?",
            entries: solutions,
          },
          {
            id: "industries",
            title: locale === "fa" ? "برای کسب‌وکار تو" : "For a business like yours",
            entries: industries,
          },
        ].map(
          (group) =>
            group.entries.length > 0 && (
              <section
                className="inner-section inner-container inner-context"
                id={group.id}
                key={group.id}
                aria-labelledby={`${group.id}-title`}
              >
                <div className="inner-section-heading">
                  <h2 id={`${group.id}-title`}>{group.title}</h2>
                </div>
                <div className="inner-context-grid">
                  {group.entries.map(({ entry }) => (
                    <details key={entry.slug}>
                      <summary>
                        {localize(entry.title, locale)}
                        <span aria-hidden>+</span>
                      </summary>
                      <EntrySections entry={entry} locale={locale} />
                    </details>
                  ))}
                </div>
              </section>
            ),
        )}
      </>
    </BrandText>
  );
}
