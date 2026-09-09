import type { L10n, L10nList, Provenance } from "@/lib/db/schema";

/**
 * Seed content is the machine-readable transcription of the official source
 * documents. Every record carries the document and page it came from, so an
 * editor can always check a claim against the original.
 *
 * Two rules hold everywhere in this folder:
 *  1. If a document does not state a value, the field is omitted - never
 *     invented, never rounded, never "estimated".
 *  2. Legal text (decision numbers, occupation codes, intake quotas, issuing
 *     bodies) is transcribed exactly as printed, including where it looks odd.
 */

export type SeedDocument = {
  slug: string;
  title: L10n;
  originalName: string;
  language: string;
  documentDate?: string;
  pageCount: number;
  /** True when the PDF carries no text layer and had to be read as images. */
  ocrUsed: boolean;
  note?: string;
};

export type SeedCategory = {
  slug: string;
  name: L10n;
  description?: L10n;
  order: number;
};

export type SeedSchool = {
  slug: string;
  order: number;
  name: L10n;
  shortName?: L10n;
  tagline?: L10n;
  summary?: L10n;
  legalNameEn?: string;
  city?: L10n;
  country?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logoPath?: string;
  coverPath?: string;
  highlights?: L10nList;
  legalRefs?: { label: L10n; number: string; date: string; issuer: L10n }[];
  stats?: { value: string; label: L10n }[];
  provenance: Provenance;
  /** Anything an editor must verify before this record is trusted publicly. */
  editorNote?: string;
};

export type SeedProgram = {
  slug: string;
  title: L10n;
  school: string;
  category: string;
  /** Mã ngành/nghề exactly as printed on the licence. */
  officialCode?: string;
  level: "cao_dang" | "trung_cap" | "so_cap" | "lien_ket";
  /** Quy mô tuyển sinh/năm from the licence. */
  intakeQuota?: number;
  overview?: L10n;
  audience?: L10nList;
  objectives?: L10nList;
  outcomes?: L10nList;
  modules?: { title: L10n; detail?: L10n }[];
  roadmap?: { title: L10n; detail?: L10n }[];
  careers?: L10nList;
  admissionFile?: L10nList;
  durationMonths?: number;
  durationLabel?: L10n;
  mode?: "offline" | "online" | "blended" | "abroad";
  languages?: string[];
  locationCity?: L10n;
  intakeSchedule?: L10n;
  tuition?: L10n;
  certificate?: L10n;
  featured?: boolean;
  coverPath?: string;
  provenance: Provenance;
  editorNote?: string;
};

export type SeedPartner = {
  slug: string;
  name: string;
  kind: "enterprise" | "institution" | "association" | "group";
  country?: string;
  region?: string;
  note?: L10n;
  order: number;
  provenance: Provenance;
};

export type SeedActivity = {
  slug: string;
  title: L10n;
  description?: L10n;
  kind:
    | "culture"
    | "sports"
    | "volunteer"
    | "soft_skills"
    | "career"
    | "international";
  coverPath?: string;
  order: number;
  provenance: Provenance;
};

export type SeedFaq = {
  question: L10n;
  answer: L10n;
  topic: string;
  order: number;
  provenance: Provenance;
};

/**
 * Một chức vụ tại một đơn vị.
 *
 * `school` là slug của trường trong hệ thống; để `null` khi chức vụ ở cấp tập
 * đoàn hoặc ở một pháp nhân khác (NIBELC Group, ITW Berlin) — khi ấy tên đơn vị
 * nằm ở `org`.
 */
export type SeedAppointment = {
  school: string | null;
  org?: L10n;
  body: "hdqt" | "dieuhanh" | "hdt" | "bks" | "bgh" | "khac";
  title: L10n;
  /** Chủ tịch 10, phó 20, thư ký 30, thành viên 40 — để xếp đúng thứ bậc. */
  rank: number;
  term?: string;
  decisionRef?: string;
};

export type SeedPerson = {
  slug: string;
  name: string;
  honorific?: string | null;
  birthYear?: number | null;
  headline: L10n;
  /** Trường mà người này gắn bó chính; `null` với cấp tập đoàn và ban kiểm soát. */
  schoolSlug?: string | null;
  order: number;
  bio?: L10n | null;
  quote?: L10n | null;
  overview?: L10nList;
  education?: { period?: string; text: L10n }[];
  competencies?: { title: L10n; text: L10n }[];
  career?: { time: string; role: L10n; org: L10n }[];
  highlights?: L10nList;
  focus?: L10nList;
  direction?: L10n | null;
  appointments: SeedAppointment[];
};

export type SeedPage = {
  slug: string;
  title: L10n;
  body: L10n;
  seoDescription?: L10n;
};

/** Import stamp shared by every seed record, so the date is written once. */
export const IMPORTED_AT = "2026-09-01";

export function fromProfileVi(page: number): Provenance {
  return {
    source: "profile-viet-duc-vi",
    sourceTitle: "PROFILE VIỆT ĐỨC GROUP (bản tiếng Việt)",
    page,
    importedAt: IMPORTED_AT,
    method: "pdf-ocr",
  };
}

export function fromProfileEn(page: number): Provenance {
  return {
    source: "profile-viet-duc-en",
    sourceTitle: "PROFILE VIET DUC GROUP (English edition)",
    page,
    importedAt: IMPORTED_AT,
    method: "pdf-ocr",
  };
}

/**
 * Bộ hồ sơ nhân sự tập đoàn gửi ngày 08/09/2026.
 *
 * Gồm hồ sơ cá nhân dạng .docx và bốn quyết định thành lập hội đồng trường
 * dạng bản quét (phải OCR). Không phải PDF hồ sơ năng lực như các nguồn khác,
 * nên có mã nguồn riêng.
 */
export function fromHoSoNhanSu(): Provenance {
  return {
    source: "ho-so-nhan-su-2026",
    sourceTitle:
      "CƠ CẤU NHÂN SỰ VIỆT ĐỨC GROUP (hồ sơ cá nhân + quyết định hội đồng trường)",
    documentDate: "2026-09-08",
    importedAt: "2026-09-08",
    method: "manual",
  };
}

/**
 * Hồ sơ dự án đầu tư xây dựng Trường Cao đẳng Công nghệ Việt Đức.
 *
 * Tập đoàn gửi ngày 09/09/2026: văn bản số 06/CV-CTy ngày 03/09/2026 xin hiệu
 * chỉnh, bổ sung thông tin dự án, kèm toàn bộ thuyết minh. Đây là hồ sơ DỰ ÁN
 * đang thẩm định, không phải hồ sơ một trường đang hoạt động — mọi con số lấy
 * từ đây đều là con số thiết kế.
 */
export function fromDuAnCaoDang(page?: number): Provenance {
  return {
    source: "du-an-cao-dang-cong-nghe-viet-duc",
    sourceTitle:
      "Dự án đầu tư xây dựng Trường Cao đẳng Công nghệ Việt Đức (06/CV-CTy)",
    page,
    documentDate: "2026-09-03",
    importedAt: "2026-09-09",
    method: "manual",
  };
}

export function fromLegacySite(): Provenance {
  return {
    source: "legacy-website",
    sourceTitle: "Website cũ vietducgroup.tatthanh.info",
    documentDate: "2026-09-01",
    importedAt: IMPORTED_AT,
    method: "legacy-website",
  };
}
