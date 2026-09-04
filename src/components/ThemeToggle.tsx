"use client";

import { useCallback, useSyncExternalStore } from "react";
import { getDictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/config";
import styles from "./ThemeToggle.module.css";

/**
 * Appearance control: system → light → dark → system.
 *
 * Three states rather than two, so "follow my device" stays reachable after the
 * reader has once chosen manually. The choice is a per-browser convenience in
 * `localStorage`; nothing is sent to the server and the cookie policy lists it.
 *
 * The value is read through `useSyncExternalStore` so the button, the document
 * attribute and any other tab stay in step, and so the server render is stable.
 */

export const THEME_KEY = "vdg_theme";
const EVENT = "vdg:theme";

export type ThemeChoice = "system" | "light" | "dark";
const ORDER: ThemeChoice[] = ["system", "light", "dark"];

function read(): ThemeChoice {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
}

function subscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT, callback);
  };
}

function apply(choice: ThemeChoice): void {
  const root = document.documentElement;
  // No attribute means "no explicit choice", which is what the
  // prefers-color-scheme media query in tokens.css keys off.
  if (choice === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", choice);

  try {
    if (choice === "system") localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, choice);
  } catch {
    /* storage blocked: the attribute still applies for this page view */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function ThemeToggle({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const choice = useSyncExternalStore(subscribe, read, () => "system" as ThemeChoice);

  const cycle = useCallback(() => {
    const nextIndex = (ORDER.indexOf(read()) + 1) % ORDER.length;
    apply(ORDER[nextIndex]);
  }, []);

  const label = {
    system: dict.theme.system,
    light: dict.theme.light,
    dark: dict.theme.dark,
  }[choice];

  return (
    <button
      type="button"
      className={styles.button}
      onClick={cycle}
      title={`${dict.theme.label}: ${label}`}
    >
      <span className={styles.icon} aria-hidden="true">
        {choice === "system" ? <SystemIcon /> : choice === "light" ? <SunIcon /> : <MoonIcon />}
      </span>
      {/*
        The accessible name states the current mode rather than the next one:
        a screen-reader user needs to know where they are before deciding to
        move. `aria-live` announces the change after each press.
      */}
      <span className="visually-hidden" aria-live="polite">
        {dict.theme.label}: {label}
      </span>
    </button>
  );
}

function SystemIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" strokeLinecap="round" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path
        d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" strokeLinejoin="round" />
    </svg>
  );
}
