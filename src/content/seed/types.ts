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
  kind: "culture" | "sports" | "volunteer" | "soft_skills" | "career" | "international";
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

export function fromLegacySite(): Provenance {
  return {
    source: "legacy-website",
    sourceTitle: "Website cũ vietducgroup.tatthanh.info",
    documentDate: "2026-09-01",
    importedAt: IMPORTED_AT,
    method: "legacy-website",
  };
}
