"use client";
import { BrandText } from "@/components/site/brand-text";

import { useReferenceLocale } from "./reference-locale";
import { useState } from "react";
import { CheckCircle2, MapPin, UsersRound, CalendarDays, Activity, Laptop } from "lucide-react";
const plans = [
  {
    name: "Build a new product",
    slug: "free",
    monthly: 0,
    yearly: 0,
    alt: "Illustrative landscape",
    features: [
      "Websites and ecommerce",
      "Software and mobile apps",
      "A defined first version",
      "Reviewable deliverables",
      "Clear handover",
    ],
  },
  {
    name: "Continue an existing project",
    slug: "pro",
    monthly: 0,
    yearly: 0,
    alt: "Illustrative landscape",
    features: [
      "Code and infrastructure review",
      "Prioritised repairs",
      "Keep what can be saved",
      "A practical next step",
      "Agreed support scope",
    ],
  },
  {
    name: "Get found in search",
    slug: "team",
    monthly: 0,
    yearly: 0,
    alt: "Illustrative landscape",
    features: [
      "Technical SEO review",
      "Content strategy",
      "Prioritised improvements",
      "Measurement and reporting",
      "No ranking guarantees",
    ],
  },
];
const freeIcons = [MapPin, UsersRound, CalendarDays, Activity, Laptop];
export default function Pricing() {
  const { copyText, href } = useReferenceLocale();
  const [yearly, setYearly] = useState(true);
  return (
    <BrandText><section id="pricing" className="pricing-section section-space" aria-labelledby="pricing-title">
      <div className="page-container">
        <div className="pricing-heading">
          <h2 id="pricing-title" className="page-section-heading">
            {copyText("Choose a path")}
            <br />
            {copyText("that fits ")}
            <mark>{copyText("your need")}</mark>
          </h2>
          <div className="pricing-billing">
            <button className={!yearly ? "is-selected" : ""} onClick={() => setYearly(false)}>
              {copyText("Defined phases")}
            </button>
            <button
              className="pricing-switch"
              role="switch"
              aria-label="Staged payment view"
              aria-checked={yearly}
              onClick={() => setYearly((value) => !value)}
            >
              <span />
            </button>
            <button className={yearly ? "is-selected" : ""} onClick={() => setYearly(true)}>
              {copyText("Staged payment")}
            </button>
          </div>
        </div>
        <div className="pricing-grid">
          {copyText(
            plans.map((plan, index) => (
              <article
                className="pricing-card"
                key={plan.slug}
                aria-labelledby={`plan-${plan.slug}`}
              >
                <div className="pricing-photo">
                  <img
                    src={`/coorda-template/pricing-${plan.slug}.png`}
                    alt={plan.alt}
                    width={1024}
                    height={576}
                    loading="lazy"
                  />
                  <div>
                    <p>{copyText(`0${index + 1}`)}</p>
                    <h3 id={`plan-${plan.slug}`}>{copyText(plan.name)}</h3>
                  </div>
                </div>
                <div className="pricing-card-content">
                  <p className="pricing-price" aria-live="polite">
                    <span>{copyText("By scope")}</span>
                    <span>{copyText(yearly ? "Staged payment" : "Defined phases")}</span>
                  </p>
                  <ul>
                    {copyText(
                      plan.features.map((feature, featureIndex) => {
                        const Icon = index === 0 ? freeIcons[featureIndex]! : CheckCircle2;
                        return (
                          <li key={feature}>
                            <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
                            <span>{copyText(feature)}</span>
                          </li>
                        );
                      }),
                    )}
                  </ul>
                  <a href={href("/download")} className="pricing-cta">
                    {copyText("Request a proposal")}
                  </a>
                </div>
              </article>
            )),
          )}
        </div>
      </div>
    </section></BrandText>
  );
}
