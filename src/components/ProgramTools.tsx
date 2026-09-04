"use client";

import { useState, type ReactNode } from "react";
import { getDictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/config";
import { useCompare, useRecordRecent, useSavedPrograms } from "@/lib/client-store";
import styles from "./ProgramTools.module.css";

/**
 * Per-programme actions: save, compare, share, QR.
 *
 * Also the place that records the visit for "recently viewed" - doing it here
 * keeps the programme page itself a server component. The QR is rendered on the
 * server and passed in as a child, so no encoder ships to the browser.
 */
export function ProgramTools({
  locale,
  slug,
  title,
  url,
  qr,
}: {
  locale: Locale;
  slug: string;
  title: string;
  url: string;
  qr?: ReactNode;
}) {
  const dict = getDictionary(locale);
  const { toggleSaved, isSaved } = useSavedPrograms();
  const { toggleCompare, isCompared, compare } = useCompare();
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  useRecordRecent(slug);

  async function share() {
    // Native share sheet where the platform has one; clipboard everywhere else.
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* the visitor dismissed the sheet - fall through to copying */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard blocked: open the QR panel, which shows the link another way.
      setQrOpen(true);
    }
  }

  return (
    <div className={styles.tools}>
      <div className={styles.row}>
        <button
          type="button"
          onClick={() => toggleSaved(slug)}
          className={isSaved(slug) ? styles.buttonOn : styles.button}
          aria-pressed={isSaved(slug)}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill={isSaved(slug) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
            <path d="M6 4h12v17l-6-4.2L6 21V4Z" strokeLinejoin="round" />
          </svg>
          {isSaved(slug) ? dict.explorer.saved : dict.explorer.save}
        </button>

        <button
          type="button"
          onClick={() => toggleCompare(slug)}
          className={isCompared(slug) ? styles.buttonOn : styles.button}
          aria-pressed={isCompared(slug)}
          disabled={!isCompared(slug) && compare.length >= 3}
          title={!isCompared(slug) && compare.length >= 3 ? dict.explorer.compareFull : undefined}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
            <path d="M4 7h7M4 12h7M4 17h7M15 7h5M15 12h5M15 17h5" strokeLinecap="round" />
          </svg>
          {dict.explorer.compare}
        </button>
      </div>

      <div className={styles.row}>
        <button type="button" onClick={share} className={styles.button}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
            <path d="M12 15V4m0 0L8 8m4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" strokeLinecap="round" />
          </svg>
          {copied ? dict.common.copied : dict.common.share}
        </button>

        {qr ? (
          <button
            type="button"
            onClick={() => setQrOpen((value) => !value)}
            className={styles.button}
            aria-expanded={qrOpen}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <rect x="4" y="4" width="6" height="6" rx="1" />
              <rect x="14" y="4" width="6" height="6" rx="1" />
              <rect x="4" y="14" width="6" height="6" rx="1" />
              <path d="M14 14h3v3h-3zM19 19h1M17 20v-1" strokeLinecap="round" />
            </svg>
            QR
          </button>
        ) : null}
      </div>

      {qr ? (
        <figure className={styles.qr} hidden={!qrOpen}>
          {qr}
          <figcaption>{dict.program.qrTitle}</figcaption>
        </figure>
      ) : null}
    </div>
  );
}
