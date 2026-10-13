"use client";
import { BrandText } from "@/components/site/brand-text";

import { useReferenceLocale } from "./reference-locale";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
export default function CommunityCTA() {
  const { copyText, href } = useReferenceLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  // The photograph is 5% taller than its frame, keeping the parallax crop covered.
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-4.75%"]);
  return (
    <BrandText><section
      ref={sectionRef}
      id="cta"
      className="community-cta"
      aria-labelledby="community-cta-title"
    >
      <motion.img
        className="community-cta-photo"
        src="/coorda-template/cta-skier.png"
        width={2400}
        height={1350}
        alt="Young skier smiling on a snowy mountain slope"
        loading="lazy"
        draggable={false}
        style={{ y: reduceMotion ? 0 : y }}
      />
      <motion.div
        className="community-cta-content"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.65 }}
      >
        <h2 id="community-cta-title">{copyText("Build something useful")}</h2>
        <a href={href("/download")} className="hero-cta">
          <span className="hero-cta-label">{copyText("Start a conversation")}</span>
          <span className="hero-cta-label hero-cta-label-copy" aria-hidden="true">
            {copyText("Start a conversation")}
          </span>
        </a>
      </motion.div>
    </section></BrandText>
  );
}
