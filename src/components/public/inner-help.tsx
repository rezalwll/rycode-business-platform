"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { InnerLink } from "./inner-ui";

type Question = { title: string; body: string; items?: string[] };
const normalize = (value: string) =>
  value
    .toLocaleLowerCase()
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[\u200c\s]+/g, " ")
    .trim();
function topicFor(question: Question): "start" | "delivery" | "support" {
  const value = normalize(`${question.title} ${question.body}`);
  if (/پشتیبان|نگهداری|بعد از|support|maintenance|after launch/.test(value)) return "support";
  if (/مالکیت|دسترسی|تحویل|کد|ownership|delivery|code|access/.test(value)) return "delivery";
  return "start";
}

export function InnerHelp({
  locale,
  title,
  lead,
  items,
}: {
  locale: Locale;
  title: string;
  lead: string;
  items: Question[];
}) {
  const fa = locale === "fa";
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("all");
  const [open, setOpen] = useState<number | null>(null);
  const topics = [
    { id: "all", title: fa ? "همهٔ پرسش‌ها" : "All questions" },
    { id: "start", title: fa ? "شروع و برآورد" : "Getting started" },
    { id: "delivery", title: fa ? "ساخت و تحویل" : "Build & handover" },
    { id: "support", title: fa ? "پشتیبانی" : "Ongoing support" },
  ];
  const needle = normalize(query);
  const visible = items
    .map((item, index) => ({ item, index }))
    .filter(
      ({ item }) =>
        (topic === "all" || topicFor(item) === topic) &&
        normalize(`${item.title} ${item.body} ${(item.items ?? []).join(" ")}`).includes(needle),
    );
  return (
    <section className="inner-help inner-container" dir={fa ? "rtl" : "ltr"}>
      <header className="inner-help-header">
        <p className="inner-eyebrow">{fa ? "راهنمای همکاری" : "WORKING TOGETHER"}</p>
        <h1>{title}</h1>
        <p>{lead}</p>
        <label className="inner-help-search">
          <Search size={20} aria-hidden />
          <span className="sr-only">{fa ? "جست‌وجوی پرسش‌ها" : "Search questions"}</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            maxLength={200}
            placeholder={fa ? "دنبال چه پاسخی می‌گردی؟" : "What would you like to know?"}
          />
        </label>
      </header>
      <div
        className="inner-help-topics"
        role="group"
        aria-label={fa ? "موضوع پرسش‌ها" : "Question topics"}
      >
        {topics.map((item) => (
          <button
            type="button"
            key={item.id}
            aria-pressed={topic === item.id}
            onClick={() => {
              setTopic(item.id);
              setOpen(null);
            }}
          >
            {item.title}
          </button>
        ))}
      </div>
      <p className="sr-only" role="status">
        {fa ? `${visible.length} پرسش` : `${visible.length} questions`}
      </p>
      <div className="inner-help-list">
        {visible.map(({ item, index }) => (
          <div key={index} className="inner-help-card" data-open={open === index}>
            <h2>
              <button
                className="inner-help-question"
                type="button"
                id={`faq-question-${index}`}
                aria-expanded={open === index}
                aria-controls={`faq-answer-${index}`}
                onClick={() => setOpen(open === index ? null : index)}
              >
                <span>{item.title}</span>
                <Plus size={18} aria-hidden />
              </button>
            </h2>
            <div
              id={`faq-answer-${index}`}
              role="region"
              aria-labelledby={`faq-question-${index}`}
              aria-hidden={open !== index}
              className="inner-help-answer"
              data-open={open === index}
              inert={open !== index}
            >
              <div>
                <p>{item.body}</p>
                {item.items && (
                  <ul className="inner-list">
                    {item.items.map((value) => (
                      <li key={value}>{value}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ))}
        {!visible.length && (
          <div className="inner-help-empty">
            <p>
              {fa
                ? "پاسخی با این عبارت پیدا نشد؛ موضوع دیگری را امتحان کن یا از ما بپرس"
                : "No matching answer. Try another topic or ask us directly."}
            </p>
            <InnerLink locale={locale} href="/contact">
              {fa ? "از ما بپرس" : "Ask us"}
            </InnerLink>
          </div>
        )}
      </div>
    </section>
  );
}
