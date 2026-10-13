"use client";
import { BrandText } from "@/components/site/brand-text";

import { useReferenceLocale } from "./reference-locale";
import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { Quote } from "lucide-react";
const members = [["Product design", "Design and user experience", "claire"], ["Engineering", "Web and custom software", "sofia"], ["Mobile development", "Android and iOS apps", "priya"], ["Integration", "Systems and data", "zara"], ["Search and content", "SEO and content strategy", "marco"], ["Continuous care", "Support and further development", "mina"]];
function AboutStat({ value, suffix, label, decimal = false }: {
    value: number;
    suffix: string;
    label: string;
    decimal?: boolean;
}) {
    const { copyText } = useReferenceLocale();
    const ref = useRef<HTMLDivElement>(null);
    const visible = useInView(ref, { once: true, amount: .3 });
    const reduceMotion = useReducedMotion();
    const count = useMotionValue(0);
    const formatted = useTransform(count, (current) => decimal ? current.toFixed(1) : Math.round(current).toString());
    useEffect(() => {
        if (!visible)
            return;
        const animation = animate(count, value, { duration: reduceMotion ? 0 : 1.5, ease: "easeOut" });
        return () => animation.stop();
    }, [visible, count, value, reduceMotion]);
    return <BrandText><div ref={ref} className="about-stat"><p className="about-stat-value" aria-label={`${value}${suffix}`}><motion.span aria-hidden="true">{copyText(formatted)}</motion.span><span aria-hidden="true">{copyText(suffix)}</span></p><div /><p className="about-stat-label">{copyText(label)}</p></div></BrandText>;
}
export default function AboutContent() {
    const { copyText } = useReferenceLocale();
    const reduceMotion = useReducedMotion();
    const reveal = { initial: reduceMotion ? false as const : { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: .15 }, transition: { duration: .65 } };
    return <BrandText><>
    <section className="about-story section-space" aria-labelledby="about-story-title"><div className="page-container"><motion.h2 id="about-story-title" {...reveal}>{copyText("Technology should ")}<mark>{copyText("make work easier")}</mark>{copyText(" and the customer experience better \u2014 so we start with the ")}<mark>{copyText("problem")}</mark>{copyText(", not a tool.")}</motion.h2><div className="about-stats"><AboutStat value={9} suffix="" label="Services you can combine"/><AboutStat value={4} suffix="" label="Connected service areas"/><AboutStat value={2} suffix="" label="Site languages"/><AboutStat value={4} suffix="" label="Stages with clear deliverables"/></div></div></section>
    <section className="about-toast" aria-label="Friends gathering outdoors"><img src="/coorda-template/about-toast.png" width={2048} height={1152} alt="Illustrative outdoor photograph" loading="lazy"/></section>
    <section className="about-team section-space" aria-labelledby="about-team-title"><div className="page-container"><motion.h2 id="about-team-title" className="page-section-heading" {...reveal}>{copyText("The roles behind")}<br /><mark>{copyText("your")}</mark>{copyText(" next product")}</motion.h2><p className="reference-placeholder-note">{copyText("Project roles with illustrative portraits, not staff profiles")}</p><div className="about-team-grid">{copyText(members.map(([name, role, slug]) => <motion.article className="about-team-card" key={slug} {...reveal}><div className="about-team-photo"><img src={`/coorda-template/team-${slug}.png`} width={1024} height={853} alt="" loading="lazy"/></div><div className="about-team-info"><h3>{copyText(name)}</h3><p>{copyText(role)}</p></div></motion.article>))}</div></div></section>
    <section className="about-culture section-space" aria-labelledby="about-culture-title"><div className="page-container about-culture-grid"><motion.img className="about-culture-photo" src="/coorda-template/about-culture.png" width={853} height={1024} alt="Illustrative city photograph" loading="lazy" {...reveal}/><div className="about-culture-content"><motion.div className="about-culture-intro" {...reveal}><h2 id="about-culture-title" className="page-section-heading">{copyText("We build for the")}{copyText(" ")}<br /><mark>{copyText("people")}</mark>{copyText(" behind")}{copyText(" ")}<br />{copyText("your business")}</h2><p>{copyText("We clarify the scope and responsibilities from the start, build in reviewable stages and leave a foundation your next team can continue.")}</p></motion.div><motion.figure className="about-founder-quote" {...reveal}><Quote size={24} strokeWidth={1.5} aria-hidden="true"/><blockquote>{copyText("The best technical decision is understandable to the business, maintainable by the team and useful to the customer.")}</blockquote><figcaption><img src="/coorda-template/about-founder.png" width={85} height={50} alt="" loading="lazy"/><div><p>{copyText("RYCODE")}</p><p>{copyText("Our working principles")}</p></div></figcaption></motion.figure></div></div></section>
  </></BrandText>;
}
