"use client";
import { BrandText } from "@/components/site/brand-text";

import { useReferenceLocale } from "./reference-locale";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import {
  BatteryFull,
  CalendarDays,
  MapPin,
  MessagesSquare,
  Share2,
  Signal,
  UsersRound,
  Wifi,
} from "lucide-react";
function Cursor({ reverse = false }: { reverse?: boolean }) {
  return (
    <BrandText><svg viewBox="0 0 34 34" aria-hidden="true">
      <path
        d="M8 6v20c0 2 2 3 3 1l5-6 8-1c2 0 3-2 1-3L11 6c-1-1-3-1-3 0Z"
        fill="currentColor"
        transform={reverse ? "rotate(60 17 17)" : "rotate(-10 17 17)"}
      />
    </svg></BrandText>
  );
}
export default function Moments() {
  const { copyText } = useReferenceLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const firstLineX = useTransform(scrollYProgress, [0, 1], [-300, -850]);
  const secondLineX = useTransform(scrollYProgress, [0, 1], [300, 850]);
  return (
    <BrandText><section
      ref={sectionRef}
      id="moments"
      className="moments-section"
      aria-labelledby="moments-title"
    >
      <h2 id="moments-title" className="sr-only">
        {copyText("Your product\u2019s next chapter")}
      </h2>
      <div className="moments-text" aria-hidden="true">
        <motion.div className="moments-text-row" style={{ x: reduceMotion ? -550 : firstLineX }}>
          <p>{copyText("Design, engineering and growth for your business")}</p>
        </motion.div>
        <motion.div
          className="moments-text-row moments-text-row-reverse"
          style={{ x: reduceMotion ? 550 : secondLineX }}
        >
          <p>{copyText("From your first idea to your product\u2019s next chapter")}</p>
        </motion.div>
      </div>

      <div className="moments-stage">
        <motion.div
          className="moments-star"
          aria-hidden="true"
          drag
          dragConstraints={{ left: -120, right: 120, top: -80, bottom: 80 }}
          dragElastic={0.15}
          dragSnapToOrigin
        >
          <motion.svg
            viewBox="0 0 54 65"
            {...(reduceMotion ? {} : { animate: { rotate: [0, 25, 0] } })}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          >
            <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M25.437 6.09s-4.695 21.667 0 56M5.984 36.257c14.087-3 31.361 0 31.361 0M12.506 54.285c11.59-28.528 38.757-51.528 38.757-51.528M2.965 13.257c11.907 17.833 45.317 45.94 45.317 45.94" />
            </g>
          </motion.svg>
        </motion.div>

        <motion.div
          className="moments-notice moments-notice-in"
          aria-hidden="true"
          {...(reduceMotion ? {} : { animate: { y: [0, -6, 0] } })}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Cursor reverse />
          <span>{copyText("You're in")}</span>
        </motion.div>

        <motion.div
          className="moments-phone"
          role="img"
          aria-label="RYCODE mobile app preview: Your product’s next chapter. Support and continuous development for a product you can keep moving forward."
          {...(reduceMotion ? {} : { animate: { y: [0, -8, 0] } })}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <div aria-hidden="true">
            <span className="moments-side-button moments-side-silent" />
            <span className="moments-side-button moments-side-volume-one" />
            <span className="moments-side-button moments-side-volume-two" />
            <span className="moments-side-button moments-side-power" />
            <div className="moments-phone-screen">
              <div className="moments-status">
                <span>{copyText("9:41")}</span>
                <div>
                  <Signal size={14} fill="currentColor" />
                  <Wifi size={13} />
                  <BatteryFull size={20} fill="currentColor" />
                </div>
              </div>
              <div className="moments-island">
                <span />
              </div>
              <div className="moments-phone-content">
                <div className="moments-phone-top">
                  <img
                    src="/coorda-template/moment-profile.png"
                    width={30}
                    height={30}
                    alt=""
                    loading="lazy"
                  />
                  <div>
                    <span>
                      <MapPin size={16} strokeWidth={1.5} />
                    </span>
                    <span>
                      <Share2 size={16} strokeWidth={1.5} />
                    </span>
                  </div>
                </div>
                <div className="moments-phone-main">
                  <div className="moments-photos">
                    <img
                      className="moments-photo-city"
                      src="/coorda-template/moment-city.png"
                      width={130}
                      height={160}
                      alt=""
                      loading="lazy"
                    />
                    <img
                      className="moments-photo-trip"
                      src="/coorda-template/moment-trip.png"
                      width={130}
                      height={160}
                      alt=""
                      loading="lazy"
                    />
                    <img
                      className="moments-photo-friends"
                      src="/coorda-template/moment-friends.png"
                      width={131}
                      height={160}
                      alt=""
                      loading="lazy"
                    />
                  </div>
                  <div className="moments-phone-copy">
                    <p className="moments-phone-heading">
                      {copyText("Your product\u2019s next chapter")}
                    </p>
                    <p>
                      {copyText(
                        "Support and continuous development for a product you can keep moving forward.",
                      )}
                    </p>
                  </div>
                </div>
                <div className="moments-phone-bottom">
                  <div className="moments-phone-tabs">
                    <span>
                      <UsersRound size={18} strokeWidth={1.5} />
                    </span>
                    <span>
                      <CalendarDays size={18} strokeWidth={1.5} />
                    </span>
                    <span>
                      <MessagesSquare size={18} strokeWidth={1.5} />
                    </span>
                  </div>
                  <span className="moments-home-indicator" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="moments-notice moments-notice-events"
          aria-hidden="true"
          {...(reduceMotion ? {} : { animate: { y: [0, 6, 0] } })}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Cursor />
          <span>{copyText("2 new events")}</span>
        </motion.div>

        <motion.div
          className="moments-eyes"
          aria-hidden="true"
          drag
          dragConstraints={{ left: -120, right: 120, top: -80, bottom: 80 }}
          dragElastic={0.15}
          dragSnapToOrigin
        >
          {copyText(
            [0, 1].map((eye) => (
              <span key={eye} className="moments-eye">
                <motion.span
                  {...(reduceMotion ? {} : { animate: { rotate: [0, 360] } })}
                  transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                >
                  <i />
                </motion.span>
              </span>
            )),
          )}
        </motion.div>
      </div>
    </section></BrandText>
  );
}
