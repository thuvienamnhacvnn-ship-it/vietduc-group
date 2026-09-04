"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

/**
 * Per-visitor lists kept in the browser: saved programmes, the comparison
 * selection and recently viewed pages.
 *
 * These are conveniences, not records. Nothing here is sent to the server, so
 * the site needs no consent banner for them, and every access is wrapped
 * because private-mode browsers throw on `localStorage` rather than returning
 * null.
 *
 * Read through `useSyncExternalStore` so the value is consistent between the
 * server render and the first client paint, and so a change in one component
 * updates every other component reading the same key.
 */

const KEYS = {
  saved: "vdg_saved_programs",
  compare: "vdg_compare",
  recent: "vdg_recent_programs",
} as const;

const MAX_COMPARE = 3;
const MAX_RECENT = 8;
const EVENT = "vdg:store";

const EMPTY: string[] = [];

/**
 * `getSnapshot` must return a stable reference or React re-renders forever, so
 * the parsed array is cached against the exact raw string it came from.
 */
const cache = new Map<string, { raw: string | null; value: string[] }>();

function readRaw(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function snapshot(key: string): string[] {
  const raw = readRaw(key);
  const cached = cache.get(key);
  if (cached && cached.raw === raw) return cached.value;

  let value: string[] = EMPTY;
  if (raw) {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) value = parsed.filter((v): v is string => typeof v === "string");
    } catch {
      value = EMPTY;
    }
  }
  cache.set(key, { raw, value });
  return value;
}

function subscribe(callback: () => void): () => void {
  // `storage` covers other tabs; the custom event covers this one.
  window.addEventListener("storage", callback);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT, callback);
  };
}

function write(key: string, value: string[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable - nothing persists, but the page keeps working */
  }
  cache.delete(key);
  window.dispatchEvent(new CustomEvent(EVENT, { detail: key }));
}

/**
 * Applies a change to the stored list.
 *
 * The updater is given the value read from storage at call time, not the value
 * React last rendered. Several toggles fired in one tick - a visitor clicking
 * three compare buttons quickly - would otherwise all start from the same stale
 * array and only the last one would survive.
 */
function mutate(key: string, updater: (current: string[]) => string[]): void {
  write(key, updater(snapshot(key)));
}

function useStoredList(key: string): [string[], (updater: (current: string[]) => string[]) => void] {
  const items = useSyncExternalStore(
    subscribe,
    () => snapshot(key),
    // On the server there is no storage; an empty list keeps the markup stable.
    () => EMPTY,
  );
  const update = useCallback(
    (updater: (current: string[]) => string[]) => mutate(key, updater),
    [key],
  );
  return [items, update];
}

export function useSavedPrograms() {
  const [saved, setSaved] = useStoredList(KEYS.saved);

  const toggleSaved = useCallback(
    (slug: string) =>
      setSaved((current) =>
        current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug],
      ),
    [setSaved],
  );

  const isSaved = useCallback((slug: string) => saved.includes(slug), [saved]);

  return { saved, toggleSaved, isSaved, clearSaved: () => setSaved(() => []) };
}

export function useCompare() {
  const [compare, setCompare] = useStoredList(KEYS.compare);

  const toggleCompare = useCallback(
    (slug: string) =>
      setCompare((current) => {
        if (current.includes(slug)) return current.filter((s) => s !== slug);
        // The cap is enforced against the live list, so rapid clicks cannot
        // push a fourth programme past it.
        return current.length < MAX_COMPARE ? [...current, slug] : current;
      }),
    [setCompare],
  );

  return {
    compare,
    toggleCompare,
    isCompared: (slug: string) => compare.includes(slug),
    clearCompare: () => setCompare(() => []),
    full: compare.length >= MAX_COMPARE,
  };
}

/** Records a viewed programme, newest first, without duplicates. */
export function useRecordRecent(slug: string | null) {
  useEffect(() => {
    if (!slug) return;
    mutate(KEYS.recent, (current) =>
      [slug, ...current.filter((s) => s !== slug)].slice(0, MAX_RECENT),
    );
  }, [slug]);
}

export function useRecentPrograms() {
  const [recent] = useStoredList(KEYS.recent);
  return recent;
}
