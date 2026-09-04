import { fold, tidy } from "../text";

/**
 * Turns raw page text into reviewable blocks: strips repeated headers and
 * footers, guesses a heading, assigns a content category and flags text that
 * looks like it is trying to give the model instructions.
 */

export const BLOCK_CATEGORIES = [
  "organisation",
  "program",
  "course",
  "people",
  "partner",
  "certificate",
  "news",
  "activity",
  "faq",
  "policy",
  "download",
  "other",
] as const;

export type BlockCategory = (typeof BLOCK_CATEGORIES)[number];

type Rule = { category: BlockCategory; terms: string[]; weight?: number };

/** Terms are diacritic-folded, so "chứng nhận" is written "chung nhan". */
const RULES: Rule[] = [
  { category: "certificate", weight: 3, terms: [
    "giay chung nhan", "quyet dinh", "chung thuc", "cong hoa xa hoi chu nghia",
    "uy ban nhan dan", "bo lao dong", "tong cuc giao duc nghe nghiep", "dieu 1",
    "can cu luat", "so hieu", "gcndkhd", "urkunde", "certificate of",
  ] },
  { category: "program", weight: 2, terms: [
    "nganh nghe dao tao", "ma nganh", "quy mo tuyen sinh", "trinh do dao tao",
    "chuong trinh dao tao", "trung cap", "cao dang", "so cap", "module",
    "ausbildungsprogramm", "training programme", "curriculum",
  ] },
  { category: "course", weight: 1, terms: ["khoa hoc", "lop hoc", "thoi luong", "course", "kurs"] },
  { category: "people", weight: 2, terms: [
    "doi ngu", "giang vien", "hieu truong", "ban giam hieu", "chu tich hoi dong",
    "teaching staff", "lecturer", "lehrkraft",
  ] },
  { category: "partner", weight: 2, terms: [
    "doi tac", "hop tac", "mou", "ky ket", "partner", "cooperation", "partnerschaft",
  ] },
  { category: "activity", weight: 2, terms: [
    "hoat dong sinh vien", "ngoai khoa", "hoi thao sinh vien", "thien nguyen",
    "team building", "van nghe", "student activities", "aktivitaten",
  ] },
  { category: "news", weight: 1, terms: ["tin tuc", "su kien", "thong bao", "news", "veranstaltung"] },
  { category: "faq", weight: 2, terms: ["cau hoi thuong gap", "hoi dap", "faq", "haufige fragen"] },
  { category: "policy", weight: 2, terms: [
    "chinh sach", "dieu khoan", "bao mat", "quy che", "privacy", "datenschutz", "nutzungsbedingungen",
  ] },
  { category: "organisation", weight: 1, terms: [
    "gioi thieu", "tam nhin", "su menh", "gia tri cot loi", "lich su hinh thanh",
    "ve chung toi", "about", "vision", "mission", "uber uns",
  ] },
];

export function classifyBlock(text: string): BlockCategory {
  const folded = fold(text);
  const scores = new Map<BlockCategory, number>();
  for (const rule of RULES) {
    for (const term of rule.terms) {
      if (folded.includes(term)) {
        scores.set(rule.category, (scores.get(rule.category) ?? 0) + (rule.weight ?? 1));
      }
    }
  }
  let best: BlockCategory = "other";
  let bestScore = 0;
  for (const [category, score] of scores) {
    if (score > bestScore) {
      best = category;
      bestScore = score;
    }
  }
  return best;
}

/**
 * Text inside a PDF is data, never instruction. This flags passages that read
 * like an attempt to steer a model so a reviewer sees them before they can ever
 * reach the knowledge base.
 */
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts)/i,
  /disregard\s+(the\s+)?(system|previous)\s+(prompt|instructions)/i,
  /you\s+are\s+now\s+(a|an)\s+/i,
  /\b(system|developer)\s*(prompt|message)\s*[:=]/i,
  /reveal\s+(your|the)\s+(system\s+)?(prompt|instructions|api\s*key)/i,
  /\bbỏ qua (mọi )?(hướng dẫn|chỉ dẫn|lệnh) (trước|trên)/i,
  /\bhãy đóng vai\b/i,
  /<\s*\/?\s*(system|assistant|instructions)\s*>/i,
  /\[\[?\s*(system|instruction)\s*\]?\]/i,
];

export function looksLikeInjection(text: string): boolean {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(text));
}

/**
 * Detects lines repeated across most pages - running headers, footers, page
 * furniture - so they do not end up as content or pollute retrieval.
 */
export function findRepeatedLines(pages: { text: string }[], threshold = 0.5): Set<string> {
  if (pages.length < 4) return new Set();
  const counts = new Map<string, number>();
  for (const page of pages) {
    const unique = new Set(
      page.text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 3 && line.length < 120),
    );
    for (const line of unique) counts.set(line, (counts.get(line) ?? 0) + 1);
  }
  const limit = Math.max(3, Math.ceil(pages.length * threshold));
  const repeated = new Set<string>();
  for (const [line, count] of counts) if (count >= limit) repeated.add(line);
  return repeated;
}

export type Block = {
  pageNumber: number;
  heading: string | null;
  body: string;
  category: BlockCategory;
  injectionFlag: boolean;
};

const HEADING_MAX = 90;

/** A line is treated as a heading when it is short and not a full sentence. */
function isHeading(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed || trimmed.length > HEADING_MAX) return false;
  if (/[.;]$/.test(trimmed)) return false;
  const words = trimmed.split(/\s+/);
  if (words.length > 12) return false;
  const letters = trimmed.replace(/[^A-Za-zÀ-ỹ]/g, "");
  if (!letters) return false;
  const upperRatio = (letters.match(/[A-ZÀ-Ỹ]/g)?.length ?? 0) / letters.length;
  return upperRatio > 0.6 || words.length <= 8;
}

/**
 * Splits pages into blocks. Deliberately conservative: it would rather emit one
 * larger true block than several confidently wrong small ones, because a human
 * reviews every block before it is published.
 */
export function buildBlocks(
  pages: { pageNumber: number; text: string }[],
  options: { minChars?: number } = {},
): Block[] {
  const { minChars = 80 } = options;
  const repeated = findRepeatedLines(pages);
  const blocks: Block[] = [];
  const seenBodies = new Set<string>();

  for (const page of pages) {
    const lines = page.text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !repeated.has(line));

    let heading: string | null = null;
    let buffer: string[] = [];

    const flush = () => {
      const body = tidy(buffer.join("\n"));
      buffer = [];
      if (body.length < minChars) return;
      const key = fold(body).slice(0, 300);
      if (seenBodies.has(key)) return;
      seenBodies.add(key);
      blocks.push({
        pageNumber: page.pageNumber,
        heading,
        body,
        category: classifyBlock(`${heading ?? ""}\n${body}`),
        injectionFlag: looksLikeInjection(body) || looksLikeInjection(heading ?? ""),
      });
    };

    for (const line of lines) {
      if (isHeading(line) && buffer.length > 0) {
        flush();
        heading = line;
      } else if (isHeading(line) && !heading) {
        heading = line;
      } else {
        buffer.push(line);
      }
    }
    flush();
  }

  return blocks;
}
