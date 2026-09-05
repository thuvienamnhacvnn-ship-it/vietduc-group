export const LOCALES = ["vi", "de", "en", "ja", "ko", "zh-TW"] as const;
export type Locale = (typeof LOCALES)[number];

/** Vietnamese is the source language: every document was written in it. */
export const DEFAULT_LOCALE: Locale = "vi";

export const LOCALE_LABEL: Record<Locale, string> = {
  vi: "Tiếng Việt",
  de: "Deutsch",
  en: "English",
  ja: "日本語",
  ko: "한국어",
  "zh-TW": "繁體中文",
};

export const LOCALE_SHORT: Record<Locale, string> = {
  vi: "VI",
  de: "DE",
  en: "EN",
  ja: "JA",
  ko: "KO",
  "zh-TW": "TW",
};

/** BCP-47 tags for <html lang>, hreflang and Intl formatting. */
export const LOCALE_TAG: Record<Locale, string> = {
  vi: "vi-VN",
  de: "de-DE",
  en: "en",
  ja: "ja-JP",
  ko: "ko-KR",
  /* Đài Loan dùng chữ Hán phồn thể; zh-TW là mã đúng, không phải zh. */
  "zh-TW": "zh-TW",
};

/**
 * Chọn bản dịch theo ngôn ngữ, thiếu thì lùi về tiếng Việt.
 *
 * Dùng cho những đoạn chữ viết thẳng trong mã nguồn. Trước đây chúng viết là
 * `pick({ vi: "…", en: "…", de: "…" }, locale)`, mà cách đó buộc MỌI khối phải liệt
 * kê đủ mọi ngôn ngữ — thêm một ngôn ngữ là 491 chỗ gãy cùng lúc. Ở đây thiếu
 * ngôn ngữ nào thì trả về tiếng Việt, nên thêm ngôn ngữ không làm vỡ gì, và
 * bản dịch điền dần được.
 */
export function pick<T extends string | string[]>(
  map: Partial<Record<Locale, T>> & { vi: T },
  locale: Locale,
): T {
  return map[locale] ?? map.vi;
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

type Localised =
  | { vi: string; de?: string; en?: string; ja?: string; ko?: string; "zh-TW"?: string }
  | null
  | undefined;

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

type LocalisedList =
  | { vi: string[]; de?: string[]; en?: string[]; ja?: string[]; ko?: string[]; "zh-TW"?: string[] }
  | null
  | undefined;

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
