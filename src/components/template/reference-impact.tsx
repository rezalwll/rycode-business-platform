"use client";
import { BrandText } from "@/components/site/brand-text";
import { LogoMark } from "@/components/site/logo";

import { useReferenceLocale } from "./reference-locale";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Plus, TrendingUp, UsersRound } from "lucide-react";
const topicRows = [
  ["Web design", "Ecommerce", "Mobile apps", "Custom software", "Data"],
  ["SEO & content", "API integration", "Project rescue", "Support", "Automation"],
];
function TopicTicker({ labels, reverse }: { labels: string[]; reverse?: boolean }) {
  const { copyText, locale } = useReferenceLocale();
  const viewportRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    // Each repeated group must cover the viewport, including after a resize or
    // font change; translating by one group can then never expose a blank end.
    const measure = () =>
      viewport.style.setProperty("--impact-topic-viewport", `${viewport.clientWidth}px`);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    observer?.observe(viewport);
    window.addEventListener("resize", measure);
    measure();
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);
  return (
    <BrandText>
      <div
        ref={viewportRef}
        dir="ltr"
        className={`impact-topic-row${reverse ? " impact-topic-row-reverse" : ""}`}
      >
        <div className="impact-topic-track">
          {copyText(
            [0, 1].map((copy) => (
              <ul
                className="impact-topic-group"
                key={copy}
                {...(copy === 1 ? { "aria-hidden": true } : {})}
              >
                {copyText(
                  labels.map((label) => (
                    <li key={label}>
                      <span dir={locale === "fa" ? "rtl" : "ltr"}>{copyText(label)}</span>
                      <span className="impact-topic-plus" aria-hidden="true">
                        <Plus size={20} strokeWidth={1} />
                      </span>
                    </li>
                  )),
                )}
              </ul>
            )),
          )}
        </div>
      </div>
    </BrandText>
  );
}
export default function Impact() {
  const { copyText, href } = useReferenceLocale();
  const reduceMotion = useReducedMotion();
  const reveal = {
    initial: reduceMotion ? (false as const) : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.65 },
  };
  return (
    <BrandText>
      <section id="impact" className="impact" aria-labelledby="impact-title">
        <div className="impact-container">
          <motion.div className="impact-heading" {...reveal}>
            <h2 id="impact-title">
              {copyText("A technical partner,")}
              <br />
              <mark>{copyText("not just")}</mark>
              {copyText(" a supplier")}
            </h2>
            <a href={href("/about#approach")} className="impact-insights">
              {copyText("Our way of working")}
            </a>
          </motion.div>

          <div className="impact-cards">
            <div className="impact-left">
              <motion.article
                className="impact-members-card"
                {...reveal}
                aria-label="Nine service capabilities"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="impact-member-photo"
                  src="/coorda-template/impact-member.png"
                  alt="Community member outdoors in a green landscape"
                  loading="lazy"
                />
                <div className="impact-member-top">
                  <LogoMark variant="light" className="impact-brand-logo" />
                  <span className="impact-icon impact-icon-white" aria-hidden="true">
                    <UsersRound size={20} strokeWidth={1.5} />
                  </span>
                </div>
                <div className="impact-member-stat">
                  <p className="impact-member-number">{copyText("9")}</p>
                  <p>{copyText("Services you can combine")}</p>
                </div>
              </motion.article>

              <motion.article className="impact-testimonial-card" {...reveal}>
                <div className="impact-testimonial-content">
                  <h3>{copyText("Clarity before code")}</h3>
                  <blockquote>
                    {copyText(
                      "We understand the need before choosing tools, and make scope, decisions and deliverables visible.",
                    )}
                  </blockquote>
                  <div className="impact-author">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/coorda-template/impact-jake.png"
                      width={46}
                      height={46}
                      alt=""
                      loading="lazy"
                    />
                    <div>
                      <p>{copyText("RYCODE")}</p>
                      <p>{copyText("Our working principles")}</p>
                    </div>
                  </div>
                </div>
                <a className="impact-testimonials-link" href={href("/about#approach")}>
                  {copyText("Our working principles ")}
                  <ArrowRight size={18} strokeWidth={1.5} />
                </a>
              </motion.article>
            </div>

            <div className="impact-right">
              <motion.article className="impact-events-card" {...reveal}>
                <div className="impact-events-heading">
                  <div className="impact-events-label">
                    <span className="impact-icon" aria-hidden="true">
                      <TrendingUp size={20} strokeWidth={1.5} />
                    </span>
                    <h3>{copyText("Clear stages of collaboration")}</h3>
                  </div>
                  <p className="impact-events-number">{copyText("4")}</p>
                </div>
                <p className="impact-events-description">
                  {copyText("Understand, plan, build, then launch and continue.")}
                </p>
              </motion.article>
              <motion.div
                className="impact-topics-card"
                {...reveal}
                aria-label="RYCODE capabilities"
              >
                <div className="impact-topic-tickers">
                  {copyText(
                    topicRows.map((labels, index) => (
                      <TopicTicker key={index} labels={labels} reverse={index === 1} />
                    )),
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </BrandText>
  );
}
