"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { telHref, type ContactSettings } from "@/lib/site-config";
import styles from "./Advisor.module.css";

type Citation = { label: string; href?: string };

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  outcome?: string;
  pending?: boolean;
};

const SESSION_KEY = "vdg_advisor_session";
const MAX_CHARS = 600;

export function Advisor({
  locale,
  contact,
  suggestions,
}: {
  locale: Locale;
  contact: ContactSettings;
  suggestions: string[];
}) {
  const dict = getDictionary(locale);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const conversationId = useRef<string | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      conversationId.current = sessionStorage.getItem(SESSION_KEY);
    } catch {
      conversationId.current = null;
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = useCallback(
    async (question: string) => {
      const trimmed = question.trim().slice(0, MAX_CHARS);
      if (!trimmed || busy) return;

      setError(null);
      setInput("");
      setBusy(true);

      const userMessage: Message = { id: crypto.randomUUID(), role: "user", content: trimmed };
      const placeholder: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: dict.advisor.thinking,
        pending: true,
      };
      // Snapshot before the placeholder so the request carries real turns only.
      const history = [...messages, userMessage]
        .filter((m) => !m.pending)
        .slice(-8)
        .map((m) => ({ role: m.role, content: m.content }));

      setMessages((current) => [...current, userMessage, placeholder]);

      try {
        const response = await fetch("/api/advisor", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            question: trimmed,
            locale,
            history: history.slice(0, -1),
            conversationId: conversationId.current,
          }),
        });

        if (response.status === 429) {
          setMessages((current) => current.filter((m) => m.id !== placeholder.id));
          setError(dict.advisor.rateLimited);
          return;
        }

        const data = (await response.json()) as {
          answer?: string;
          citations?: Citation[];
          outcome?: string;
          conversationId?: string;
          error?: string;
        };

        if (!response.ok || !data.answer) {
          setMessages((current) => current.filter((m) => m.id !== placeholder.id));
          setError(dict.common.error);
          return;
        }

        if (data.conversationId) {
          conversationId.current = data.conversationId;
          try {
            sessionStorage.setItem(SESSION_KEY, data.conversationId);
          } catch {
            /* session storage unavailable; the id lives in memory for this tab */
          }
        }

        setMessages((current) =>
          current.map((message) =>
            message.id === placeholder.id
              ? {
                  ...message,
                  content: data.answer as string,
                  citations: data.citations ?? [],
                  outcome: data.outcome,
                  pending: false,
                }
              : message,
          ),
        );
      } catch {
        setMessages((current) => current.filter((m) => m.id !== placeholder.id));
        setError(dict.common.error);
      } finally {
        setBusy(false);
      }
    },
    [busy, dict, locale, messages],
  );

  const clear = () => {
    setMessages([]);
    setError(null);
    conversationId.current = null;
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* nothing stored */
    }
  };

  const tel = telHref(contact.phoneE164 || contact.admissionsPhone || contact.phone);
  const needsHandoff = messages.some(
    (m) => m.role === "assistant" && (m.outcome === "no_data" || m.outcome === "error"),
  );

  return (
    <>
      <button
        type="button"
        className={`${styles.launcher} no-print`}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? dict.advisor.close : dict.advisor.open}
      >
        {open ? <CloseIcon /> : <ChatIcon />}
        <span className={styles.launcherLabel}>{dict.advisor.title}</span>
      </button>

      <section
        className={`${styles.panel} no-print`}
        hidden={!open}
        aria-label={dict.advisor.title}
      >
        <header className={styles.header}>
          <div>
            <h2 className={styles.title}>{dict.advisor.title}</h2>
            <p className={styles.subtitle}>{dict.advisor.disclaimer}</p>
          </div>
          <button type="button" onClick={() => setOpen(false)} className={styles.close} aria-label={dict.common.close}>
            <CloseIcon />
          </button>
        </header>

        <div className={styles.log} ref={logRef} role="log" aria-live="polite">
          {!messages.length ? (
            <div className={styles.intro}>
              <p>{dict.advisor.emptyHistory}</p>
              <p className={styles.suggestTitle}>{dict.advisor.suggestions}</p>
              <ul className={styles.suggestions}>
                {suggestions.map((question) => (
                  <li key={question}>
                    <button type="button" onClick={() => void send(question)}>
                      {question}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            messages.map((message) => (
              <article
                key={message.id}
                className={message.role === "user" ? styles.userMessage : styles.botMessage}
              >
                <div className={message.pending ? styles.pending : undefined}>
                  {message.content.split("\n").map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
                {message.citations?.length ? (
                  <div className={styles.citations}>
                    <p>{dict.advisor.sources}</p>
                    <ol>
                      {message.citations.map((citation, index) => (
                        <li key={`${citation.label}-${index}`}>
                          {citation.href ? (
                            <Link href={citation.href} onClick={() => setOpen(false)}>
                              {citation.label}
                            </Link>
                          ) : (
                            citation.label
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : null}
              </article>
            ))
          )}

          {error ? (
            <p className={styles.error} role="alert">
              {error}
            </p>
          ) : null}
        </div>

        <div className={styles.actions}>
          <Link href={localePath(locale, "/dao-tao/dang-ky-tu-van")} className={styles.actionPrimary}>
            {dict.advisor.lead}
          </Link>
          {tel ? (
            <a href={tel} className={`${styles.actionSecondary} ${needsHandoff ? styles.actionUrgent : ""}`}>
              {dict.advisor.handoff}
            </a>
          ) : (
            <Link href={localePath(locale, "/lien-he")} className={styles.actionSecondary}>
              {dict.advisor.handoff}
            </Link>
          )}
          {messages.length ? (
            <button type="button" className={styles.actionGhost} onClick={clear}>
              {dict.advisor.clear}
            </button>
          ) : null}
        </div>

        <form
          className={styles.composer}
          onSubmit={(event) => {
            event.preventDefault();
            void send(input);
          }}
        >
          <label htmlFor="advisor-input" className="visually-hidden">
            {dict.advisor.placeholder}
          </label>
          <textarea
            id="advisor-input"
            ref={inputRef}
            className={styles.input}
            value={input}
            maxLength={MAX_CHARS}
            rows={1}
            placeholder={dict.advisor.placeholder}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void send(input);
              }
            }}
          />
          <button type="submit" className={styles.send} disabled={busy || !input.trim()}>
            <span className="visually-hidden">{dict.advisor.send}</span>
            <SendIcon />
          </button>
        </form>
      </section>
    </>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.3-.6L3 21l1.8-4.4A8.3 8.3 0 0 1 3 11.5C3 6.9 7 3.2 12 3.2s9 3.7 9 8.3Z" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M4.5 12h13M12 5.5 18.5 12 12 18.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
