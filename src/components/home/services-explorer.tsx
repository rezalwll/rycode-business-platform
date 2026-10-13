"use client";

import { useId, useRef, useState, type ReactNode, type CSSProperties } from "react";
import {
  ArrowUpLeft,
  ArrowUpRight,
  Blocks,
  ChartNoAxesCombined,
  Headphones,
  Waypoints,
} from "lucide-react";
import type { Locale } from "@/i18n/routing";

type Group = {
  id: string;
  title: string;
  description: string;
  tagline: string;
  accent: string;
  count: number;
};
const icons = [Blocks, Waypoints, ChartNoAxesCombined, Headphones];

export function ServicesExplorer({
  groups,
  panels,
  locale,
}: {
  groups: Group[];
  panels: ReactNode[];
  locale: Locale;
}) {
  const [active, setActive] = useState(0);
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const Arrow = locale === "fa" ? ArrowUpLeft : ArrowUpRight;
  return (
    <div className="expertise-workspace">
      <div
        className="expertise-selector"
        role="tablist"
        aria-label={locale === "fa" ? "حوزه‌های خدمات رایکد" : "RYCODE service areas"}
      >
        {groups.map((group, index) => {
          const Icon = icons[index % icons.length]!;
          return (
            <button
              type="button"
              role="tab"
              key={group.id}
              id={`${id}-tab-${group.id}`}
              aria-controls={`${id}-panel-${group.id}`}
              aria-selected={index === active}
              tabIndex={index === active ? 0 : -1}
              ref={(element) => {
                refs.current[index] = element;
              }}
              style={{ "--family-accent": group.accent } as CSSProperties}
              onClick={() => setActive(index)}
              onKeyDown={(event) => {
                let next: number;
                if (event.key === "Home") next = 0;
                else if (event.key === "End") next = groups.length - 1;
                else if (event.key === "ArrowDown" || event.key === "ArrowUp")
                  next =
                    (index + (event.key === "ArrowDown" ? 1 : -1) + groups.length) % groups.length;
                else if (event.key === "ArrowRight" || event.key === "ArrowLeft")
                  next =
                    (index +
                      (event.key === (locale === "fa" ? "ArrowLeft" : "ArrowRight") ? 1 : -1) +
                      groups.length) %
                    groups.length;
                else return;
                event.preventDefault();
                setActive(next);
                refs.current[next]?.focus();
              }}
            >
              <span className="expertise-selector-icon">
                <Icon aria-hidden />
              </span>
              <span>
                <strong>{group.title}</strong>
                <small>{group.tagline}</small>
              </span>
              <Arrow className="expertise-selector-arrow" aria-hidden />
            </button>
          );
        })}
        <div className="expertise-selector-note">
          <span dir="ltr">DESIGN · BUILD · CONNECT · GROW</span>
          <p>
            {locale === "fa"
              ? "هر مسیر مستقل است؛ ترکیب درستشان یک محصول کامل می‌سازد"
              : "Independent capabilities, connected into one useful product."}
          </p>
        </div>
      </div>
      <div className="expertise-panels">
        {groups.map((group, index) => (
          <div
            key={group.id}
            id={`${id}-panel-${group.id}`}
            role="tabpanel"
            aria-labelledby={`${id}-tab-${group.id}`}
            hidden={active !== index}
            tabIndex={0}
            style={{ "--family-accent": group.accent } as CSSProperties}
          >
            <div className="expertise-panel-intro">
              <p>{group.description}</p>
              <span>
                {locale === "fa"
                  ? `${new Intl.NumberFormat("fa").format(group.count)} خدمت`
                  : `${group.count} ${group.count === 1 ? "service" : "services"}`}
              </span>
            </div>
            {panels[index]}
          </div>
        ))}
      </div>
    </div>
  );
}
