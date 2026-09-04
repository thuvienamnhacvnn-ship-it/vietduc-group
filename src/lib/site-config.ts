import type { Locale } from "./i18n/config";

/**
 * Shape of the editable site configuration. Values live in the `settings`
 * table so an editor can change them without a deploy; this file only defines
 * the contract and the starting values.
 *
 * Rule for every field here: an empty string means "not configured", and the UI
 * must then render nothing at all rather than a placeholder or a guessed URL.
 */

export type SocialKey =
  | "facebook"
  | "instagram"
  | "tiktok"
  | "youtube"
  | "linkedin"
  | "zalo"
  | "whatsapp";

export const SOCIAL_KEYS: SocialKey[] = [
  "facebook",
  "instagram",
  "tiktok",
  "youtube",
  "linkedin",
  "zalo",
  "whatsapp",
];

export const SOCIAL_LABEL: Record<SocialKey, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  zalo: "Zalo",
  whatsapp: "WhatsApp",
};

/** Channels shown in the slim top bar. The rest appear in the footer only. */
export const PRIMARY_SOCIAL: SocialKey[] = ["facebook", "youtube", "zalo"];

export type ContactSettings = {
  organisationLegalName: string;
  headquarters: string;
  phone: string;
  /** E.164 for tel:/wa.me links, e.g. "+842431236868". Derived if empty. */
  phoneE164: string;
  email: string;
  website: string;
  admissionsPhone: string;
  officeHours: { vi: string; de?: string; en?: string } | null;
  /** Google Maps embed URL. Left empty until someone supplies the real one. */
  mapEmbedUrl: string;
};

export type SocialSettings = Record<SocialKey, string>;

export type SeoSettings = {
  siteName: string;
  defaultTitle: { vi: string; de?: string; en?: string };
  defaultDescription: { vi: string; de?: string; en?: string };
  /** Absolute origin used for canonical URLs and sitemaps. */
  siteUrl: string;
  ogImage: string;
};

export type SiteSettings = {
  contact: ContactSettings;
  social: SocialSettings;
  seo: SeoSettings;
};

export const SETTINGS_KEYS = {
  contact: "contact",
  social: "social",
  seo: "seo",
} as const;

/**
 * Seed values. Contact details come from the previous official site
 * (vietducgroup.tatthanh.info, read 2026-09-01) - the only place they were
 * published. Social URLs start EMPTY: neither the PDFs nor the old site listed
 * a single social profile, and inventing one would be worse than showing none.
 */
export const DEFAULT_SETTINGS: SiteSettings = {
  contact: {
    organisationLegalName: "Công ty Cổ phần Tập đoàn Đầu tư và Giáo dục Quốc tế Việt Đức",
    headquarters: "Tòa nhà Việt Đức Group, 129 Trần Phú, Hà Nội",
    phone: "024 3 123 6868",
    phoneE164: "+842431236868",
    email: "info@vietducgroup.com.vn",
    website: "https://www.vietducgroup.com.vn",
    admissionsPhone: "024 3 123 6868",
    officeHours: null,
    mapEmbedUrl: "",
  },
  social: {
    facebook: "",
    instagram: "",
    tiktok: "",
    youtube: "",
    linkedin: "",
    zalo: "",
    whatsapp: "",
  },
  seo: {
    siteName: "Việt Đức Group",
    defaultTitle: {
      vi: "Việt Đức Group – Kiến tạo tri thức, dẫn lối tương lai",
      de: "Viet Duc Group – Wissen schaffen, die Zukunft weisen",
      en: "Viet Duc Group – Creating knowledge, shaping the future",
    },
    defaultDescription: {
      vi: "Hệ thống giáo dục nghề nghiệp Việt – Đức với sáu trường thành viên: đào tạo thực hành, gắn kết doanh nghiệp và hợp tác quốc tế.",
      de: "Vietnamesisch-deutsches Berufsbildungsnetzwerk mit sechs Mitgliedsschulen: praxisnahe Ausbildung, Unternehmensbindung und internationale Zusammenarbeit.",
      en: "A Vietnamese–German vocational education system of six member schools: practical training, employer partnerships and international cooperation.",
    },
    siteUrl: "",
    ogImage: "/brand/og-default.png",
  },
};

/** Builds the outbound href for a channel, or null when not configured. */
export function socialHref(key: SocialKey, value: string): string | null {
  const raw = value.trim();
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  if (key === "whatsapp") return `https://wa.me/${raw.replace(/[^\d]/g, "")}`;
  if (key === "zalo") return `https://zalo.me/${raw.replace(/[^\d]/g, "")}`;
  return `https://${raw}`;
}

export function telHref(phone: string): string | null {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : null;
}

export function localisedSeo(seo: SeoSettings, locale: Locale) {
  return {
    title: seo.defaultTitle[locale] ?? seo.defaultTitle.vi,
    description: seo.defaultDescription[locale] ?? seo.defaultDescription.vi,
  };
}

/**
 * Absolute site origin for canonical URLs. Falls back to the dev origin so a
 * local build still produces valid absolute URLs rather than throwing.
 */
export function resolveSiteUrl(configured: string): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const chosen = configured.trim() || fromEnv || "http://localhost:3025";
  return chosen.replace(/\/+$/, "");
}
