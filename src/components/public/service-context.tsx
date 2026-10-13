import Link from "next/link";
import { BrandText } from "@/components/site/brand-text";
import type { Locale } from "@/i18n/routing";
import { catalogPath, localize, type CatalogEntry } from "@/content/catalog";
import type { PublicCatalogEntry } from "@/server/queries/public-content";
import ReferenceFAQ from "@/components/template/reference-faq";
import { localizedHref } from "./shared";

function EntrySections({ entry, locale }: { entry: CatalogEntry; locale: Locale }) {
  return <BrandText><div className="reference-context-answer">
    <p>{localize(entry.summary, locale)}</p>
    {entry.sections.map((section,index) => <section key={`${entry.slug}-${index}`}>
      <h4>{localize(section.title,locale)}</h4>
      {section.body && <p>{localize(section.body,locale)}</p>}
      {section.items && <ul>{section.items.map(item => <li key={localize(item,locale)}>{localize(item,locale)}</li>)}</ul>}
    </section>)}
    <Link href={localizedHref(locale,catalogPath(entry.kind,entry.slug))}>{locale === "fa" ? "دربارهٔ این مسیر بیشتر بخوان" : "Explore this path"}</Link>
  </div></BrandText>;
}
export function ServiceContext({locale,solutions,industries}:{
  locale: Locale; solutions:PublicCatalogEntry[]; industries:PublicCatalogEntry[];
}) {
  return <BrandText><>
    {solutions.length > 0 && <ReferenceFAQ id="solutions" heading={<>{locale === "fa" ? "چه سیستم‌هایی" : "What systems"}<br/><span>{locale === "fa" ? "می‌سازیم؟" : "can we build?"}</span></>} items={solutions.map(({entry})=>({question:localize(entry.title,locale),answer:<EntrySections entry={entry} locale={locale}/>}))}/>}
    {industries.length > 0 && <ReferenceFAQ id="industries" heading={<>{locale === "fa" ? "برای کسب‌وکار" : "For a business"}<br/><span>{locale === "fa" ? "تو" : "like yours"}</span></>} items={industries.map(({entry})=>({question:localize(entry.title,locale),answer:<EntrySections entry={entry} locale={locale}/>}))}/>}
  </></BrandText>;
}
