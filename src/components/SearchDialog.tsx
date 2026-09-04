"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/config";
import styles from "./SearchDialog.module.css";

export type SearchHit = {
  kind: "program" | "school" | "post" | "faq" | "document" | "page";
  title: string;
  excerpt: string;
  href: string;
  meta?: string;
};

type Props = {
  locale: Locale;
  open: boolean;
  onClose: () => void;
};

const GROUP_ORDER: SearchHit["kind"][] = ["program", "school", "faq", "post", "document", "page"];

export function SearchDialog({ locale, open, onClose }: Props) {
  const dict = getDictionary(locale);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const groupLabel: Record<SearchHit["kind"], string> = {
    program: dict.search.inPrograms,
    school: dict.search.inSchools,
    post: dict.search.inPosts,
    document: dict.search.inDocuments,
    faq: dict.search.inFaqs,
    page: dict.nav.about,
  };

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const run = useCallback(
    async (value: string, signal: AbortSignal) => {
      if (value.trim().length < 2) {
        setHits([]);
        setState("idle");
        return;
      }
      setState("loading");
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(value)}&locale=${locale}`,
          { signal },
        );
        if (!response.ok) throw new Error(String(response.status));
        const data = (await response.json()) as { hits: SearchHit[] };
        setHits(data.hits);
        setState("done");
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        setState("error");
      }
    },
    [locale],
  );

  // Debounced so typing does not fire a request per keystroke; the controller
  // cancels the in-flight request so results cannot arrive out of order.
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => void run(query, controller.signal), 220);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, run]);

  if (!open) return null;

  const grouped = GROUP_ORDER.map((kind) => ({
    kind,
    items: hits.filter((hit) => hit.kind === kind),
  })).filter((group) => group.items.length);

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={dict.search.title}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={styles.dialog} ref={dialogRef}>
        <div className={styles.field}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.6-3.6" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            className={styles.input}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={dict.search.placeholder}
            aria-label={dict.search.title}
            autoComplete="off"
          />
          <button type="button" className={styles.close} onClick={onClose}>
            {dict.common.close}
          </button>
        </div>

        <div className={styles.results}>
          {query.trim().length < 2 ? (
            <p className={styles.hint}>{dict.search.hint}</p>
          ) : state === "loading" && !hits.length ? (
            <p className={styles.hint}>{dict.common.loading}</p>
          ) : state === "error" ? (
            <p className={styles.hint}>{dict.common.error}</p>
          ) : !grouped.length ? (
            <p className={styles.hint}>{dict.common.noResults}</p>
          ) : (
            grouped.map((group) => (
              <section key={group.kind} className={styles.group}>
                <h2 className={styles.groupTitle}>{groupLabel[group.kind]}</h2>
                <ul>
                  {group.items.map((hit) => (
                    <li key={`${hit.kind}-${hit.href}`}>
                      <Link href={hit.href} onClick={onClose} className={styles.hit}>
                        <span className={styles.hitTitle}>{hit.title}</span>
                        {hit.meta ? <span className={styles.hitMeta}>{hit.meta}</span> : null}
                        <span className={styles.hitExcerpt}>{hit.excerpt}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
