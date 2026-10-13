"use client";

import { ArrowUpLeft, ArrowUpRight, Compass, Layers3, Rocket, ScanEye } from "lucide-react";
import { useId, useState } from "react";
import type { Locale } from "@/i18n/routing";

const steps = [
  {
    icon: Compass,
    fa: "شناخت مسئله",
    en: "Understand the need",
    bodyFa: "اول از تو، مشتری‌ها و چیزی که قرار است بهتر شود می‌شنویم؛ بدون نسخهٔ از پیش آماده",
    bodyEn:
      "We listen to you, your customers and what needs to improve, without a predetermined solution.",
  },
  {
    icon: Layers3,
    fa: "طراحی مسیر",
    en: "Shape the path",
    bodyFa: "نسخهٔ اول، اولویت‌ها، زمان و خروجی هر مرحله را با هم روشن می‌کنیم",
    bodyEn:
      "Together we define the first version, priorities, timing and deliverables for each phase.",
  },
  {
    icon: ScanEye,
    fa: "ساخت و بازبینی",
    en: "Build & review",
    bodyFa: "نسخه‌های قابل‌استفاده را می‌بینی، امتحان می‌کنی و بازخوردت همان‌جا وارد کار می‌شود",
    bodyEn:
      "See working versions, try them and give feedback while there is still time to act on it.",
  },
  {
    icon: Rocket,
    fa: "انتشار و ادامه",
    en: "Launch & continue",
    bodyFa:
      "کد، دسترسی‌ها و راهنمای کار را تحویل می‌گیری؛ برای پشتیبانی و قدم بعدی هم می‌توانیم کنارت بمانیم",
    bodyEn:
      "Receive the code, access and operating guidance. We can stay alongside you for maintenance and the next chapter.",
  },
];

/** Coorda's expanding capability cards, adapted to RYCODE's engagement stages. */
export function CollaborationSteps({ locale }: { locale: Locale }) {
  const [active, setActive] = useState(0);
  const id = useId();
  const fa = locale === "fa";
  const Arrow = fa ? ArrowUpLeft : ArrowUpRight;
  return (
    <div className="coorda-step-cards">
      {steps.map((step, index) => (
        <button
          key={step.en}
          type="button"
          className={`coorda-step-card${active === index ? " is-active" : ""}`}
          aria-expanded={active === index}
          aria-controls={`${id}-description-${index}`}
          onClick={() => setActive(index)}
        >
          <span className="coorda-step-icon">
            <step.icon aria-hidden />
          </span>
          <span className="coorda-step-index" dir="ltr">
            0{index + 1}
          </span>
          <span className="coorda-step-title">{fa ? step.fa : step.en}</span>
          <span
            id={`${id}-description-${index}`}
            className="coorda-step-description"
            hidden={active !== index}
          >
            {fa ? step.bodyFa : step.bodyEn}
          </span>
          <Arrow className="coorda-step-arrow" aria-hidden />
        </button>
      ))}
    </div>
  );
}
