"use client";
import { BrandText } from "@/components/site/brand-text";

import { useReferenceLocale } from "./reference-locale";
import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import {
  ArrowUpRight,
  BellRing,
  ChartNoAxesCombined,
  Laptop,
  MessagesSquare,
  Zap,
} from "lucide-react";
const capabilities = [
  {
    title: "Shared decisions",
    icon: Zap,
    description: "We clarify the problem, priorities and first deliverables before choosing tools.",
  },
  {
    title: "Clear ownership",
    icon: Laptop,
    description: "Code, access and handover responsibilities are agreed from the start.",
  },
  {
    title: "Reviewable delivery",
    icon: BellRing,
    description: "See working versions and give feedback while the project is taking shape.",
  },
  {
    title: "Continuous care",
    icon: MessagesSquare,
    description: "Maintenance and the next chapter can continue under an agreed support scope.",
  },
];
const metrics = [
  { value: 9, suffix: "", label: "Services to build and improve" },
  { value: 4, suffix: "", label: "Connected service areas" },
  { value: 2, suffix: "", label: "Site languages" },
  { value: 4, suffix: "", label: "Stages with clear deliverables" },
];
function Metric({ value, suffix, label }: (typeof metrics)[number]) {
  const { copyText } = useReferenceLocale();
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, amount: 0.3 });
  const reduceMotion = useReducedMotion();
  const count = useMotionValue(value);
  const rounded = useTransform(count, (current) => Math.round(current));
  useEffect(() => {
    if (!visible || reduceMotion) return;
    count.set(0);
    const animation = animate(count, value, { duration: 1.5, ease: "easeOut" });
    return () => animation.stop();
  }, [visible, reduceMotion, count, value]);
  return (
    <BrandText><div ref={ref} className="native-metric">
      <p className="native-metric-number" aria-label={`${value}${suffix}`}>
        <motion.span aria-hidden="true">{copyText(rounded)}</motion.span>
        <span aria-hidden="true">{copyText(suffix)}</span>
      </p>
      <div className="native-metric-divider" />
      <p className="native-metric-label">{copyText(label)}</p>
    </div></BrandText>
  );
}
export default function NativeFeatures() {
  const { copyText } = useReferenceLocale();
  const [active, setActive] = useState(0);
  return (
    <BrandText><section
      id="native-features"
      className="native-features section-space"
      aria-labelledby="native-title"
    >
      <div className="page-container">
        <h2 id="native-title" className="page-section-heading">
          {copyText("Build it right,")}
          <br />
          <mark>{copyText("continue")}</mark>
          {copyText(" with confidence")}
        </h2>
        <div className="native-cards">
          {copyText(
            capabilities.map(({ title, icon: Icon, description }, index) => (
              <button
                key={title}
                className={`native-card${active === index ? " is-active" : ""}`}
                onClick={() => setActive(index)}
                aria-expanded={active === index}
                aria-controls={`native-description-${index}`}
              >
                <span className="native-card-icon">
                  <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span className="native-card-title">{copyText(title)}</span>
                <span
                  id={`native-description-${index}`}
                  className="native-card-description"
                  hidden={active !== index}
                >
                  {copyText(description)}
                </span>
                <ArrowUpRight
                  className="native-card-arrow"
                  size={24}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </button>
            )),
          )}
        </div>
        <div className="native-metrics">
          <p className="native-metrics-heading">
            <ChartNoAxesCombined size={20} strokeWidth={1.5} aria-hidden="true" />
            {copyText("RYCODE / IN PRACTICE")}
          </p>
          <div className="native-metrics-grid">
            {copyText(metrics.map((metric) => <Metric key={metric.label} {...metric} />))}
          </div>
        </div>
      </div>
    </section></BrandText>
  );
}
