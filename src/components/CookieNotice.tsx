"use client";

import { useCallback, useSyncExternalStore } from "react";
import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import styles from "./CookieNotice.module.css";

const KEY = "vdg_cookie_notice";
const EVENT = "vdg:cookie-notice";

function read(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    // Private mode or blocked storage: behave as if it were already dismissed
    // rather than nagging on every page view.
    return "unavailable";
  }
}

function subscribe(callback: () => void): () => void {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}

/**
 * A notice, not a consent gate.
 *
 * This site loads no analytics, no advertising and no third-party scripts, so
 * there is nothing to withhold pending consent - blocking the page would be
 * theatre. The moment a tracking tool is added, this component has to become a
 * real consent dialog and the cookie policy has to change with it.
 */
export function CookieNotice({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  // The server has no storage, so the notice is absent from the server markup
  // and appears on hydration - never a flash of a notice already dismissed.
  const dismissed = useSyncExternalStore(subscribe, read, () => "server");

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(KEY, new Date().toISOString());
    } catch {
      /* nothing to persist to; the notice still closes for this visit */
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  if (dismissed) return null;

  return (
    <div className={styles.wrap} role="region" aria-label={dict.cookies.title}>
      <div className={styles.card}>
        <div>
          <p className={styles.title}>{dict.cookies.title}</p>
          <p className={styles.body}>
            {dict.cookies.body}{" "}
            <Link href={localePath(locale, "/chinh-sach-cookie")}>{dict.cookies.policy}</Link>
          </p>
        </div>
        <button type="button" className={styles.accept} onClick={dismiss}>
          {dict.cookies.accept}
        </button>
      </div>
    </div>
  );
}
