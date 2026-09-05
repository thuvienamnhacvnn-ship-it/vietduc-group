"use client";

import { useMemo, useState } from "react";
import { getDictionary } from "@/lib/i18n/dictionary";
import { fold } from "@/lib/text";
import { pick, type Locale } from "@/lib/i18n/config";
import styles from "./FaqList.module.css";

export type FaqItem = {
  id: number;
  topic: string;
  question: string;
  answer: string;
  source: string | null;
  page: number | null;
};

const TOPIC_LABEL: Record<string, { vi: string; en?: string; de?: string }> = {
  organisation: { vi: "Tổ chức", en: "The organisation", de: "Organisation" },
  admissions: { vi: "Tuyển sinh", en: "Admissions", de: "Zulassung" },
  programs: { vi: "Chương trình", en: "Programmes", de: "Programme" },
  international: { vi: "Quốc tế", en: "International", de: "International" },
  partners: { vi: "Đối tác", en: "Partners", de: "Partner" },
  general: { vi: "Chung", en: "General", de: "Allgemein" },
};

/** Instant client-side filter: the whole FAQ is small enough to ship at once. */
export function FaqList({ locale, items }: { locale: Locale; items: FaqItem[] }) {
  const dict = getDictionary(locale);
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("");

  const topics = useMemo(() => [...new Set(items.map((item) => item.topic))], [items]);

  const filtered = useMemo(() => {
    const needle = fold(query.trim());
    return items.filter((item) => {
      if (topic && item.topic !== topic) return false;
      if (!needle) return true;
      return fold(`${item.question} ${item.answer}`).includes(needle);
    });
  }, [items, query, topic]);

  return (
    <div>
      <div className={styles.controls}>
        <label className={styles.search}>
          <span className="visually-hidden">{dict.search.title}</span>
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.6-3.6" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={dict.search.placeholder}
          />
        </label>

        {topics.length > 1 ? (
          <div className={styles.topics} role="group" aria-label={dict.explorer.filters}>
            <button
              type="button"
              className={topic === "" ? styles.topicOn : styles.topic}
              onClick={() => setTopic("")}
              aria-pressed={topic === ""}
            >
              {dict.common.viewAll}
            </button>
            {topics.map((value) => (
              <button
                key={value}
                type="button"
                className={topic === value ? styles.topicOn : styles.topic}
                onClick={() => setTopic(value)}
                aria-pressed={topic === value}
              >
                {TOPIC_LABEL[value] ? pick(TOPIC_LABEL[value], locale) : value}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {!filtered.length ? (
        <p className={styles.none}>{dict.common.noResults}</p>
      ) : (
        <div className={styles.list}>
          {filtered.map((item) => (
            <details key={item.id} className={styles.item}>
              <summary>{item.question}</summary>
              <div className={styles.answer}>
                <p>{item.answer}</p>
                {item.source ? (
                  <p className={styles.source}>
                    {dict.common.source}: {item.source}
                    {item.page ? `, ${dict.common.page} ${item.page}` : ""}
                  </p>
                ) : null}
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
