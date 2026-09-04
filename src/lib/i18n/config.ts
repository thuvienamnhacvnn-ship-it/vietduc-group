export const LOCALES = ["vi", "de", "en"] as const;
export type Locale = (typeof LOCALES)[number];

/** Vietnamese is the source language: every document was written in it. */
export const DEFAULT_LOCALE: Locale = "vi";

export const LOCALE_LABEL: Record<Locale, string> = {
  vi: "Tiếng Việt",
  de: "Deutsch",
  en: "English",
};

export const LOCALE_SHORT: Record<Locale, string> = { vi: "VI", de: "DE", en: "EN" };

/** BCP-47 tags for <html lang>, hreflang and Intl formatting. */
export const LOCALE_TAG: Record<Locale, string> = { vi: "vi-VN", de: "de-DE", en: "en" };

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

type Localised = { vi: string; de?: string; en?: string } | null | undefined;

/**
 * Reads a localised field. Falls back to Vietnamese rather than showing an
 * empty slot - an untranslated but true sentence beats a blank one.
 */
export function t(field: Localised, locale: Locale): string {
  if (!field) return "";
  const value = field[locale];
  if (typeof value === "string" && value.trim()) return value;
  return field.vi ?? "";
}

type LocalisedList = { vi: string[]; de?: string[]; en?: string[] } | null | undefined;

export function tList(field: LocalisedList, locale: Locale): string[] {
  if (!field) return [];
  const value = field[locale];
  if (Array.isArray(value) && value.length) return value;
  return field.vi ?? [];
}

/** True when the requested locale has no translation and `vi` is being shown. */
export function isFallback(field: Localised, locale: Locale): boolean {
  if (!field || locale === "vi") return false;
  const value = field[locale];
  return !(typeof value === "string" && value.trim());
}

export function localePath(locale: Locale, pathname = "/"): string {
  const clean = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}
