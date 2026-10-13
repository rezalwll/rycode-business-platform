"use client";
import { BrandText } from "@/components/site/brand-text";

import { useReferenceLocale } from "./reference-locale";
import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { serviceFAQs } from "@/content/service-model";

export default function FAQ({ items, heading, id = "faq" }: {
  items?: readonly { question: string; answer: ReactNode }[];
  heading?: ReactNode;
  id?: string;
}) {
  const { copyText, locale } = useReferenceLocale();
  const questions = items ?? serviceFAQs.map(item => ({ question: item.question[locale], answer: item.answer[locale] }));
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();
  return (
    <BrandText><section id={id} className="faq-section" aria-labelledby={`${id}-title`}>
      <div className="faq-container">
        <motion.h2
          id={`${id}-title`}
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          {heading ?? <>{copyText("Frequently")}
          <br />
          {copyText("asked ")}
          <span>{copyText("questions")}</span></>}
        </motion.h2>
        <motion.div
          className="faq-list"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {copyText(
            questions.map(({ question, answer }, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={question} className="faq-card" data-open={isOpen}>
                  <h3>
                    <button
                      type="button"
                      id={`${id}-question-${index}`}
                      className="faq-question"
                      aria-expanded={isOpen}
                      aria-controls={`${id}-answer-${index}`}
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                    >
                      <span>{copyText(question)}</span>
                      <span className="faq-toggle" aria-hidden="true">
                        <span className="faq-toggle-horizontal" />
                        <span className="faq-toggle-vertical" />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`${id}-answer-${index}`}
                    role="region"
                    aria-labelledby={`${id}-question-${index}`}
                    aria-hidden={!isOpen}
                  >
                    {!isOpen && <div hidden>{typeof answer === "string" ? <p>{copyText(answer)}</p> : answer}</div>}
                    <AnimatePresence initial={false}>
                      {copyText(
                        isOpen && (
                          <motion.div
                            className="faq-answer"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              duration: reduceMotion ? 0 : 0.3,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                          >
                            {typeof answer === "string" ? <p>{copyText(answer)}</p> : answer}
                          </motion.div>
                        ),
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            }),
          )}
        </motion.div>
      </div>
    </section></BrandText>
  );
}
