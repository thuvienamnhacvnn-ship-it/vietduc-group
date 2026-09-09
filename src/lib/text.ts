/**
 * Vietnamese-aware text helpers shared by search, the lexical retriever and
 * slug generation. Kept dependency-free so it can run in tests and scripts.
 */

const COMBINING_MARKS = /[̀-ͯ]/g;
const HORIZONTAL_WS = /[^\S\n]+/g;

/**
 * Folds diacritics and lowercases, so "Điện – Điện lạnh" matches "dien dien
 * lanh". `đ`/`Đ` need an explicit pass: they are single code points, not a base
 * letter plus a combining mark, so NFD leaves them untouched.
 */
/**
 * Giữ tên riêng nằm trọn trên một dòng.
 *
 * Trình duyệt ngắt dòng ở bất kỳ dấu cách nào, nên "Việt Đức" rất dễ thành
 * "Việt" ở dòng trên và "Đức" ở dòng dưới — với một cái tên thương hiệu thì đó
 * là lỗi, không phải chuyện thẩm mỹ.
 *
 * Cách chữa là thay dấu cách BÊN TRONG tên bằng dấu cách không ngắt (U+00A0):
 * chữ vẫn là chữ ấy, sao chép ra vẫn đúng, máy tìm kiếm vẫn đọc được, chỉ có
 * chỗ ngắt dòng là biến mất. Làm ở đây chứ không đặt sẵn trong từ điển, vì dấu
 * cách không ngắt nằm lẫn trong tệp nguồn thì không ai nhìn thấy để sửa.
 */
/** Dấu cách không ngắt. Viết bằng mã thoát để nhìn thấy được trong mã nguồn. */
const KHONG_NGAT = '\u00a0';

const TEN_RIENG = [
  "Việt Đức Group",
  "Viet Duc Group",
  "Việt Đức",
  "Viet Duc",
  "ITW Berlin",
  "Việt Hàn",
  "Bách khoa Vũng Tàu",
  "Ngoại thương",
];

export function giuTenLien(text: string): string {
  let ra = text;
  for (const ten of TEN_RIENG) {
    if (!ten.includes(" ")) continue;
    ra = ra.split(ten).join(ten.replace(/ /g, KHONG_NGAT));
  }
  return ra;
}

export function fold(input: string): string {
  return input
    /* Dấu cách không ngắt do `giuLien` chèn vào tên riêng: với người tìm
       kiếm thì nó vẫn là một dấu cách. */
    .replace(/ /g, " ")
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

export function slugify(input: string): string {
  return fold(input)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const STOPWORDS = new Set([
  // vi
  "va", "cua", "cho", "voi", "trong", "cac", "nhung", "la", "co", "duoc", "den",
  "tai", "mot", "nay", "do", "khi", "tu", "ve", "theo", "se", "da", "hoac", "ma",
  "nhu", "gi", "the", "nao", "ban", "toi", "muon", "hoi", "biet",
  // Vietnamese question words. Dropping them stops "bao nhiêu" in a question
  // from matching every passage that happens to contain "bao nhiêu".
  "bao", "nhieu", "may", "sao", "dau", "khong", "vay", "the nao", "xin",
  // en
  "and", "for", "with", "from", "that", "this", "are", "was", "you", "your",
  "can", "have", "has", "what", "which", "how", "about", "into",
  // de
  "und", "der", "die", "das", "den", "dem", "des", "ein", "eine", "fur", "mit",
  "von", "auf", "ist", "sind", "wie", "welche",
]);

export function tokenize(input: string): string[] {
  return fold(input)
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

/** Rough token count for budgeting model context. Not a real tokenizer. */
export function estimateTokens(text: string): number {
  return Math.ceil(text.trim().length / 3.5);
}

export function truncate(text: string, max: number): string {
  const clean = text.trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

/** Collapses runs of whitespace but keeps paragraph breaks. */
export function tidy(text: string): string {
  return text
    .replace(/\r\n?/g, "\n")
    .replace(HORIZONTAL_WS, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Escapes a user string for safe use inside a regular expression. */
export function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Splits long text into overlapping passages on paragraph then sentence
 * boundaries. Overlap keeps a fact that straddles a boundary retrievable.
 */
export function splitIntoPassages(text: string, maxChars = 900, overlap = 150): string[] {
  const clean = tidy(text);
  if (clean.length <= maxChars) return clean ? [clean] : [];

  const hardChunk = (s: string): string[] => {
    if (s.length <= maxChars) return [s];
    const parts: string[] = [];
    for (let i = 0; i < s.length; i += maxChars) parts.push(s.slice(i, i + maxChars));
    return parts;
  };

  // Paragraph, then sentence, then a blunt cut - a wall of text with no
  // punctuation (common in OCR output) must still respect the size budget.
  const units = clean
    .split(/\n{2,}/)
    .flatMap((para) => (para.length <= maxChars ? [para] : para.split(/(?<=[.!?;:])\s+/)))
    .flatMap(hardChunk);

  const out: string[] = [];
  let buffer = "";
  for (const unit of units) {
    const candidate = buffer ? `${buffer}\n${unit}` : unit;
    if (candidate.length > maxChars && buffer) {
      out.push(buffer);
      // Carry a tail of the previous passage so a fact spanning the boundary
      // stays retrievable - but only while it still fits. A unit that already
      // fills the budget starts a passage of its own.
      const tail = overlap > 0 ? buffer.slice(-overlap) : "";
      const withOverlap = tail ? `${tail}\n${unit}` : unit;
      buffer = withOverlap.length <= maxChars ? withOverlap : unit;
    } else {
      buffer = candidate;
    }
  }
  if (buffer.trim()) out.push(buffer);
  return out.map((s) => s.trim()).filter(Boolean);
}
