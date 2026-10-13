"use client";
import { BrandText } from "@/components/site/brand-text";

import { useReferenceLocale } from "./reference-locale";
import { Quote } from "lucide-react";
const reviews = [
  {
    name: "RYCODE / clarity",
    role: "Our working principles",
    slug: "mia",
    text: "We explain what will be built, why a decision matters and what comes next.",
  },
  {
    name: "RYCODE / ownership",
    role: "Our working principles",
    slug: "sofia",
    text: "Ownership of code, data and access is clear from the start.",
  },
  {
    name: "RYCODE / delivery",
    role: "Our working principles",
    slug: "alex",
    text: "A working version is better than a vague progress report.",
  },
  {
    name: "RYCODE / continuity",
    role: "Our working principles",
    slug: "sara",
    text: "Your product should be understandable and maintainable by the next team.",
  },
  {
    name: "RYCODE / decisions",
    role: "Our working principles",
    slug: "lucas",
    text: "Tools follow the problem, not the other way around.",
  },
];
export default function Testimonials() {
  const { copyText, href } = useReferenceLocale();
  return (
    <BrandText><section
      id="testimonials"
      className="testimonials-section"
      aria-labelledby="testimonials-title"
    >
      <div className="page-container testimonials-heading">
        <h2 id="testimonials-title" className="page-section-heading">
          {copyText("Our ")}
          <mark>{copyText("working principles")}</mark>
          <br />
          {copyText("not customer testimonials")}
        </h2>
      </div>
      <div
        className="testimonials-ticker"
        tabIndex={0}
        aria-label="Working principles. Focus or hover to pause."
      >
        <div className="testimonials-track">
          {copyText(
            [0, 1].map((copy) => (
              <div className="testimonials-group" key={copy} aria-hidden={copy === 1 || undefined}>
                {copyText(
                  reviews.map((review) => (
                    <figure className="testimonial-card" key={review.slug}>
                      <div>
                        <Quote size={24} strokeWidth={1.5} aria-hidden="true" />
                        <blockquote>
                          {copyText('"')}
                          {copyText(review.text)}
                          {copyText('"')}
                        </blockquote>
                      </div>
                      <figcaption>
                        <img
                          src={`/coorda-template/review-${review.slug}.png`}
                          alt=""
                          width={85}
                          height={50}
                          loading="lazy"
                        />
                        <div>
                          <p>{copyText(review.name)}</p>
                          <p>{copyText(review.role)}</p>
                        </div>
                      </figcaption>
                    </figure>
                  )),
                )}
              </div>
            )),
          )}
        </div>
      </div>
      <div className="page-container testimonials-founder">
        <figure>
          <blockquote>
            {copyText(
              "Your product should work for your business today and remain understandable tomorrow. That is why we start with the problem, make decisions together and hand over a clear foundation.",
            )}
          </blockquote>
          <figcaption>
            <img
              src="/coorda-template/about-founder.png"
              alt=""
              width={85}
              height={50}
              loading="lazy"
            />
            <div>
              <p>{copyText("RYCODE")}</p>
              <p>{copyText("Our way of working")}</p>
            </div>
          </figcaption>
        </figure>
        <a href={href("/about")} className="hero-cta">
          {copyText("About RYCODE")}
        </a>
      </div>
    </section></BrandText>
  );
}
