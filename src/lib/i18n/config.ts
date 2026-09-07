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
 * Một khối chữ nhiều ngôn ngữ: tiếng Việt bắt buộc, còn lại tuỳ có.
 *
 * Trước đây bảy chỗ trong mã nguồn tự khai báo `{ vi: string; en?: string;
 * de?: string }`. Thêm ngôn ngữ là cả bảy chỗ cùng báo lỗi, mà lỗi lại hiện ở
 * nơi dùng chứ không ở nơi khai báo. Gom về một kiểu thì thêm ngôn ngữ chỉ sửa
 * đúng dòng `LOCALES` ở đầu file này.
 */
export type L10nMap<T extends string | string[] = string> = Partial<Record<Locale, T>> & { vi: T };

/**
 * Chọn bản dịch theo ngôn ngữ, thiếu thì lùi về tiếng Việt.
 *
 * Dùng cho những đoạn chữ viết thẳng trong mã nguồn. Trước đây chúng viết là
 * `pick({ vi: "…", en: "…", de: "…" }, locale)`, mà cách đó buộc MỌI khối phải liệt
 * kê đủ mọi ngôn ngữ — thêm một ngôn ngữ là 491 chỗ gãy cùng lúc. Ở đây thiếu
 * ngôn ngữ nào thì trả về tiếng Việt, nên thêm ngôn ngữ không làm vỡ gì, và
 * bản dịch điền dần được.
 */
export function pick<T extends string | string[]>(map: L10nMap<T>, locale: Locale): T {
  const ra = map[locale] ?? map.vi;
  /* Giữ tên riêng liền một mạch, xem `giuLien`. Mảng thì xử từng dòng. */
  if (typeof ra === "string") return giuLien(ra) as T;
  if (Array.isArray(ra)) return ra.map(giuLien) as T;
  return ra;
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

type Localised =
  | { vi: string; de?: string; en?: string; ja?: string; ko?: string; "zh-TW"?: string }
  | null
  | undefined;

/**
 * Tên riêng không được rơi xuống dòng giữa chừng.
 *
 * Trên điện thoại, dòng chữ hẹp nên "Việt Đức Group" hay bị cắt thành "Việt"
 * cuối dòng này và "Đức Group" đầu dòng sau. Đọc lên thì thành hai thứ khác
 * nhau — mà đây là tên doanh nghiệp, không phải một cụm từ thường.
 *
 * Cách chữa: thay dấu cách bên trong tên riêng bằng dấu cách không ngắt
 * (U+00A0). Trình duyệt sẽ đẩy cả cụm xuống dòng dưới thay vì xé đôi nó. Danh
 * sách xếp từ dài đến ngắn để "Việt Đức Group" khớp trước "Việt Đức".
 */
const TEN_RIENG = [
  "Việt Đức Group",
  "Viet Duc Group",
  "NIBELC Group",
  "ITW Berlin",
  "CHLB Đức",
  "Việt Nam",
  "Việt Đức",
];

const NBSP = " ";

export function giuLien(s: string): string {
  let ra = s;
  for (const ten of TEN_RIENG) {
    if (!ten.includes(" ")) continue;
    ra = ra.split(ten).join(ten.split(" ").join(NBSP));
  }
  return ra;
}

/**
 * Reads a localised field. Falls back to Vietnamese rather than showing an
 * empty slot - an untranslated but true sentence beats a blank one.
 */
export function t(field: Localised, locale: Locale): string {
  if (!field) return "";
  const value = field[locale];
  if (typeof value === "string" && value.trim()) return giuLien(value);
  return giuLien(field.vi ?? "");
}

type LocalisedList =
  | { vi: string[]; de?: string[]; en?: string[]; ja?: string[]; ko?: string[]; "zh-TW"?: string[] }
  | null
  | undefined;

export function tList(field: LocalisedList, locale: Locale): string[] {
  if (!field) return [];
  const value = field[locale];
  if (Array.isArray(value) && value.length) return value.map(giuLien);
  return (field.vi ?? []).map(giuLien);
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
