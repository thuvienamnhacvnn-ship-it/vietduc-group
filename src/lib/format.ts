import type { L10n } from "./db/schema";
import { pick, t, type Locale } from "./i18n/config";

/** Shared vocabulary for programme facets, used by cards, filters and schema.org. */

export const LEVELS = ["cao_dang", "trung_cap", "so_cap", "lien_ket"] as const;
export type Level = (typeof LEVELS)[number];

export const LEVEL_LABEL: Record<string, L10n> = {
  cao_dang: { vi: "Cao đẳng", en: "College", de: "College" },
  trung_cap: { vi: "Trung cấp", en: "Intermediate", de: "Fachschule" },
  so_cap: { vi: "Sơ cấp", en: "Elementary", de: "Grundstufe" },
  lien_ket: { vi: "Liên kết quốc tế", en: "International partnership", de: "Internationale Kooperation" },
};

export const MODES = ["offline", "blended", "online", "abroad"] as const;
export type Mode = (typeof MODES)[number];

export const MODE_LABEL: Record<string, L10n> = {
  offline: { vi: "Học tại trường", en: "On campus", de: "Präsenz" },
  blended: { vi: "Kết hợp", en: "Blended", de: "Kombiniert" },
  online: { vi: "Trực tuyến", en: "Online", de: "Online" },
  abroad: { vi: "Có giai đoạn ở nước ngoài", en: "Includes a phase abroad", de: "Mit Auslandsphase" },
};

export const LANGUAGE_LABEL: Record<string, L10n> = {
  vi: { vi: "Tiếng Việt", en: "Vietnamese", de: "Vietnamesisch" },
  de: { vi: "Tiếng Đức", en: "German", de: "Deutsch" },
  en: { vi: "Tiếng Anh", en: "English", de: "Englisch" },
  ko: { vi: "Tiếng Hàn", en: "Korean", de: "Koreanisch" },
  ja: { vi: "Tiếng Nhật", en: "Japanese", de: "Japanisch" },
  zh: { vi: "Tiếng Trung", en: "Chinese", de: "Chinesisch" },
};

export function levelLabel(level: string, locale: Locale): string {
  return t(LEVEL_LABEL[level] ?? { vi: level }, locale);
}

export function modeLabel(mode: string | null, locale: Locale): string {
  if (!mode) return "";
  return t(MODE_LABEL[mode] ?? { vi: mode }, locale);
}

export function languageLabel(code: string, locale: Locale): string {
  return t(LANGUAGE_LABEL[code] ?? { vi: code.toUpperCase() }, locale);
}

/** Orders levels the way a prospectus does, highest first. */
export const LEVEL_ORDER: Record<string, number> = {
  cao_dang: 0,
  trung_cap: 1,
  so_cap: 2,
  lien_ket: 3,
};

export function formatDate(value: string | Date | null | undefined, locale: Locale): string {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return typeof value === "string" ? value : "";
  const tag = pick({ vi: "vi-VN", de: "de-DE", en: "en-GB", ja: "ja-JP", ko: "ko-KR", "zh-TW": "zh-TW" }, locale);
  return new Intl.DateTimeFormat(tag, { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

export function formatNumber(value: number, locale: Locale): string {
  const tag = pick({ vi: "vi-VN", de: "de-DE", en: "en-GB", ja: "ja-JP", ko: "ko-KR", "zh-TW": "zh-TW" }, locale);
  return new Intl.NumberFormat(tag).format(value);
}
