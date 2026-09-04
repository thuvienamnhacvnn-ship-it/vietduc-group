"use client";

import { useState } from "react";
import { getDictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/config";
import styles from "./NewsletterForm.module.css";

/**
 * Double opt-in by design: the server stores the address unconfirmed and only a
 * confirmation click activates it. When no mail service is configured the form
 * says exactly that instead of claiming an email was sent.
 */
export function NewsletterForm({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "pending" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!consent || state === "sending") return;
    setState("sending");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, locale, consentText: dict.newsletter.consent }),
      });
      const data = (await response.json()) as { ok?: boolean; emailSent?: boolean; message?: string };
      if (!response.ok || !data.ok) {
        setState("error");
        setMessage(dict.newsletter.failed);
        return;
      }
      setState(data.emailSent ? "sent" : "pending");
      setMessage(data.emailSent ? dict.newsletter.success : dict.newsletter.pending);
      setEmail("");
      setConsent(false);
    } catch {
      setState("error");
      setMessage(dict.newsletter.failed);
    }
  }

  if (state === "sent" || state === "pending") {
    return (
      <p className={styles.done} role="status">
        {message}
      </p>
    );
  }

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <div className={styles.row}>
        <label htmlFor="newsletter-email" className="visually-hidden">
          {dict.newsletter.placeholder}
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={dict.newsletter.placeholder}
          className={styles.input}
          autoComplete="email"
        />
        <button type="submit" className={styles.button} disabled={!consent || state === "sending"}>
          {state === "sending" ? dict.common.loading : dict.newsletter.subscribe}
        </button>
      </div>

      <label className={styles.consent}>
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          required
        />
        <span>{dict.newsletter.consent}</span>
      </label>

      {state === "error" ? (
        <p className={styles.error} role="alert">
          {message}
        </p>
      ) : null}
    </form>
  );
}
