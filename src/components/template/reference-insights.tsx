"use client";
import { BrandText } from "@/components/site/brand-text";

import { useReferenceLocale } from "./reference-locale";
import { motion, useReducedMotion } from "motion/react";
import { CalendarDays } from "lucide-react";
const articles = [
  {
    title: "How to audit a stalled software project",
    image: "insight-city.png",
    imageAlt: "Illustrative guide image",
    author: "RYCODE",
    avatar: "rycode-black.svg",
    date: "RYCODE guide",
    dateTime: "technical-review",
    slug: "technical-review",
    href: "/blog/how-to-audit-a-stalled-software-project",
  },
  {
    title: "When your project is stalled or unfinished",
    image: "insight-cafe.png",
    imageAlt: "Illustrative guide image",
    author: "RYCODE",
    avatar: "rycode-black.svg",
    date: "RYCODE guide",
    dateTime: "stalled-project",
    slug: "stalled-project",
    href: "/problems/stalled-project",
  },
  {
    title: "When your systems are disconnected",
    image: "insight-event.png",
    imageAlt: "Illustrative guide image",
    author: "RYCODE",
    avatar: "rycode-black.svg",
    date: "RYCODE guide",
    dateTime: "disconnected-systems",
    slug: "disconnected-systems",
    href: "/problems/disconnected-systems",
  },
];
export default function Insights() {
  const { copyText, href } = useReferenceLocale();
  const reduceMotion = useReducedMotion();
  const reveal = {
    initial: reduceMotion ? (false as const) : { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.6 },
  };
  return (
    <BrandText><section id="insights" className="insights-section" aria-labelledby="insights-title">
      <div className="insights-container">
        <motion.div className="insights-heading" {...reveal}>
          <h2 id="insights-title">
            {copyText("Notes for ")}
            <br className="insights-mobile-break" />
            <mark>{copyText("better decisions")}</mark>
          </h2>
          <a className="hero-cta" href={href("/insights")}>
            <span className="hero-cta-label">{copyText("Read our guides")}</span>
            <span className="hero-cta-label hero-cta-label-copy" aria-hidden="true">
              {copyText("Read our guides")}
            </span>
          </a>
        </motion.div>
        <div className="insights-grid">
          {copyText(
            articles.map((article) => (
              <motion.article key={article.slug} className="insight-article" {...reveal}>
                <a
                  className="insight-card"
                  href={href(article.href)}
                  aria-labelledby={`insight-title-${article.dateTime}`}
                >
                  <div className="insight-photo">
                    <img
                      src={`/coorda-template/${article.image}`}
                      width={1024}
                      height={683}
                      alt={article.imageAlt}
                      loading="lazy"
                    />
                  </div>
                  <div className="insight-content">
                    <h3 id={`insight-title-${article.dateTime}`}>{copyText(article.title)}</h3>
                    <div className="insight-meta">
                      <span className="insight-author">
                        <img
                          src={`/coorda-template/${article.avatar}`}
                          width={44}
                          height={28}
                          alt=""
                          loading="lazy"
                        />
                        <span>{copyText(article.author)}</span>
                      </span>
                      <span className="insight-divider" aria-hidden="true" />
                      <span className="insight-date">
                        <CalendarDays size={16} strokeWidth={1.25} aria-hidden="true" />
                        <span>{copyText(article.date)}</span>
                      </span>
                    </div>
                  </div>
                </a>
              </motion.article>
            )),
          )}
        </div>
      </div>
    </section></BrandText>
  );
}
