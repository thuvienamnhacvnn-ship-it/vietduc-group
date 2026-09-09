import { pick, type Locale, type L10nMap } from "./i18n/config";

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

/**
 * Một văn phòng của tập đoàn.
 *
 * Tập đoàn có hai nơi đặt văn phòng, nên `headquarters` một dòng không đủ. Địa
 * chỉ để song ngữ vì đây là thứ người đọc nước ngoài cần đọc được — nhưng chỉ
 * hai thứ tiếng: bản Việt để gửi thư trong nước, bản Anh cho mọi ngôn ngữ còn
 * lại. Dịch một địa chỉ sang tiếng Nhật hay tiếng Hàn không giúp ai gửi được
 * thư tới đó.
 */
export type VanPhong = {
  city: L10nMap;
  address: L10nMap;
};

export type ContactSettings = {
  organisationLegalName: string;
  /** Trụ sở chính, một dòng — dùng cho JSON-LD và ô nhập trong trang quản trị. */
  headquarters: string;
  /** Danh sách văn phòng đầy đủ; rỗng thì trang chỉ hiện `headquarters`. */
  offices?: VanPhong[];
  phone: string;
  /** E.164 for tel:/wa.me links, e.g. "+842431236868". Derived if empty. */
  phoneE164: string;
  email: string;
  website: string;
  admissionsPhone: string;
  officeHours: L10nMap | null;
  /** Google Maps embed URL. Left empty until someone supplies the real one. */
  mapEmbedUrl: string;
};

export type SocialSettings = Record<SocialKey, string>;

export type SeoSettings = {
  siteName: string;
  defaultTitle: L10nMap;
  defaultDescription: L10nMap;
  /** Absolute origin used for canonical URLs and sitemaps. */
  siteUrl: string;
  ogImage: string;
};

export type SiteSettings = {
  contact: ContactSettings;
  /** Kênh của mảng giáo dục — trang chính và toàn bộ khu Đào tạo. */
  social: SocialSettings;
  /**
   * Kênh của mảng khách sạn – du lịch – đầu tư.
   *
   * Hai mảng kinh doanh chạy hai bộ tài khoản riêng, nên chúng là hai ô cài đặt
   * riêng chứ không phải một. Dùng chung một bộ thì trang khách sạn dẫn khách
   * sang trang tuyển sinh, và ngược lại.
   */
  socialVenture: SocialSettings;
  seo: SeoSettings;
};

export const SETTINGS_KEYS = {
  contact: "contact",
  social: "social",
  socialVenture: "social-venture",
  seo: "seo",
} as const;

/**
 * Seed values. Contact details come from the previous official site
 * (vietducgroup.tatthanh.info, read 2026-09-01) - the only place they were
 * published. Social URLs start EMPTY: neither the PDFs nor the old site listed
 * a single social profile, and inventing one would be worse than showing none.
 *
 * Địa chỉ hai văn phòng do Việt Đức Group cung cấp ngày 09/09/2026, thay cho
 * "129 Trần Phú, Hà Nội" — địa chỉ ấy vốn chỉ có trên web cũ của Tất Thành và
 * đã được chính tập đoàn xác nhận là không đúng.
 */
export const DEFAULT_SETTINGS: SiteSettings = {
  contact: {
    organisationLegalName:
      "Công ty Cổ phần Tập đoàn Đầu tư và Giáo dục Quốc tế Việt Đức",
    headquarters:
      "Tầng 4, Toà nhà Rainbow, số 79 Đường 19/5, KĐTM Văn Quán, Phường Hà Đông, Thành phố Hà Nội, Việt Nam",
    offices: [
      {
        city: { vi: "Hà Nội", en: "Hanoi" },
        address: {
          vi: "Tầng 4, Toà nhà Rainbow, số 79 Đường 19/5, KĐTM Văn Quán, Phường Hà Đông, Thành phố Hà Nội, Việt Nam",
          en: "4th Floor, Rainbow Building, No. 79, 19/5 Street, Van Quan New Urban Area, Ha Dong Ward, Hanoi, Vietnam",
        },
      },
      {
        city: { vi: "Quảng Trị", en: "Quang Tri" },
        address: {
          vi: "Phường Đồng Thuận, Tỉnh Quảng Trị, Việt Nam",
          en: "Dong Thuan Ward, Quang Tri Province, Vietnam",
        },
      },
    ],
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
  socialVenture: {
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
      ja: "Viet Duc Group — 知を創り、未来を拓く",
      ko: "Viet Duc Group — 지식을 세우고 미래를 엽니다",
      "zh-TW": "Viet Duc Group — 創造知識，引領未來",
    },
    defaultDescription: {
      vi: "Hệ thống giáo dục nghề nghiệp Việt–Đức với sáu trường thành viên: đào tạo thực hành, gắn kết doanh nghiệp và hợp tác quốc tế.",
      de: "Vietnamesisch-deutsches Berufsbildungsnetzwerk mit sechs Mitgliedsschulen: praxisnahe Ausbildung, Unternehmensbindung und internationale Zusammenarbeit.",
      en: "A Vietnamese–German vocational education system of six member schools: practical training, employer partnerships and international cooperation.",
      ja: "六つの加盟校からなる越独技能教育の体系。実習中心の教育、企業との連携、そして国際協力。",
      ko: "여섯 개 회원 학교로 이루어진 베트남·독일 직업교육 체계. 실습 중심 교육, 기업 연계, 그리고 국제 협력.",
      "zh-TW":
        "由六所成員學校組成的越德技職教育體系：實作導向的訓練、與企業連結，以及國際合作。",
    },
    /* Tên miền chính thức, trỏ về VPS OVH từ 07/09/2026. */
    siteUrl: "https://vietducgroup.com.vn",
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
    title: pick(seo.defaultTitle, locale),
    description: pick(seo.defaultDescription, locale),
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
