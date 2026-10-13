"use client";
import { BrandText } from "@/components/site/brand-text";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpLeft, ArrowUpRight } from "lucide-react";
import { useId, useRef, useState } from "react";
import type { Locale } from "@/i18n/routing";

export type ServiceExample = {
  href: string;
  title: string;
  src: string;
  alt: string;
  conceptual: boolean;
};

export function ServiceExamples({
  examples,
  locale,
  serviceTitle,
}: {
  examples: ServiceExample[];
  locale: Locale;
  serviceTitle: string;
}) {
  const [selected, setSelected] = useState(0);
  const id = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const example = examples[selected];
  const Arrow = locale === "fa" ? ArrowUpLeft : ArrowUpRight;
  if (!example) return null;

  return (
    <BrandText><div className="service-examples">
      {examples.length > 1 && (
        <div
          role="tablist"
          aria-label={locale === "fa" ? `نمونه‌های ${serviceTitle}` : `${serviceTitle} examples`}
          className="service-example-tabs"
        >
          {examples.map((item, index) => (
            <button
              key={item.href}
              ref={(element) => {
                tabs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${index}`}
              aria-controls={`${id}-panel`}
              aria-selected={selected === index}
              tabIndex={selected === index ? 0 : -1}
              title={item.title}
              onClick={() => setSelected(index)}
              onKeyDown={(event) => {
                let next: number;
                if (event.key === "Home") next = 0;
                else if (event.key === "End") next = examples.length - 1;
                else if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                  const forward = event.key === (locale === "fa" ? "ArrowLeft" : "ArrowRight");
                  next = (index + (forward ? 1 : -1) + examples.length) % examples.length;
                } else return;
                event.preventDefault();
                setSelected(next);
                tabs.current[next]?.focus();
              }}
            >
              {item.title}
            </button>
          ))}
        </div>
      )}
      <div
        id={`${id}-panel`}
        role={examples.length > 1 ? "tabpanel" : undefined}
        aria-labelledby={examples.length > 1 ? `${id}-tab-${selected}` : undefined}
        className="service-example-panel"
      >
        <Link
          href={example.href}
          className="service-example-image"
          aria-label={locale === "fa" ? `مشاهده ${example.title}` : `Explore ${example.title}`}
        >
          <Image
            src={example.src}
            alt={example.alt}
            fill
            sizes="(min-width: 1280px) 380px, (min-width: 768px) 45vw, 90vw"
            className="object-cover"
          />
        </Link>
        <div className="service-example-caption">
          <div>
            {example.conceptual && (
              <span className="service-example-label">
                {locale === "fa" ? "مطالعهٔ مفهومی" : "Concept study"}
              </span>
            )}
            <Link href={example.href} className="service-example-title">
              {example.title}
            </Link>
          </div>
          <Link
            href={example.href}
            aria-label={locale === "fa" ? `جزئیات ${example.title}` : `${example.title} details`}
            className="service-example-action"
          >
            <Arrow className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </div></BrandText>
  );
}
