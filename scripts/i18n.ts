/**
 * Soi độ phủ của từ điển giao diện.
 *
 * Kiểu `Dictionary` đã bắt được khoá thiếu lúc dựng, nhưng nó không phân biệt
 * được "đã dịch" với "chép nguyên bản tiếng Việt cho đủ khoá" — mà đó đúng là
 * lỗi hay gặp nhất khi thêm ngôn ngữ. Script này bắt phần còn lại:
 *
 *   - chuỗi trùng y hệt bản tiếng Việt (trừ tên riêng, xem GIU_NGUYEN)
 *   - chuỗi không có lấy một chữ của hệ chữ bản ngữ
 *   - chuỗi lẫn chữ của ngôn ngữ khác (hangul lọt vào bản Nhật…)
 *
 * Chạy: npm run i18n
 */
import { getDictionary } from "@/lib/i18n/dictionary";
import { LOCALES, type Locale } from "@/lib/i18n/config";

/* Tên riêng: giống bản tiếng Việt là đúng, không phải chưa dịch. */
const GIU_NGUYEN = new Set([
  "brand.name",
  "hub.eyebrow",
  "form.whatsapp",
  "form.zalo",
  "form.email",
  "contact.email",
  "contact.website",
  "footer.emailLabel",
  "footer.webLabel",
  "footer.imprint",
  "nav.menu",
]);

/* Hệ chữ bản ngữ của từng ngôn ngữ, và hệ chữ tuyệt đối không được lẫn vào. */
const KANA = /[\u3040-\u30ff]/;
const HANGUL = /[\uac00-\ud7af\u1100-\u11ff]/;
const HAN = /[\u4e00-\u9fff]/;
const BAN_NGU: Partial<Record<Locale, RegExp>> = {
  ja: /[\u3040-\u30ff\u4e00-\u9fff]/,
  ko: HANGUL,
  "zh-TW": HAN,
};
const CAM_LAN: Partial<Record<Locale, Array<[string, RegExp]>>> = {
  ja: [["hangul", HANGUL]],
  ko: [["kana", KANA]],
  "zh-TW": [["kana", KANA], ["hangul", HANGUL]],
};

type Flat = Record<string, string>;
function flatten(obj: unknown, prefix = "", out: Flat = {}): Flat {
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "string") out[key] = v;
    else if (v && typeof v === "object") flatten(v, key, out);
  }
  return out;
}

const vi = flatten(getDictionary("vi"));
const keys = Object.keys(vi);
let loi = 0;

console.log(`Từ điển giao diện: ${keys.length} khoá\n`);

for (const loc of LOCALES) {
  if (loc === "vi") continue;
  const d = flatten(getDictionary(loc));

  const trung = keys.filter((k) => !GIU_NGUYEN.has(k) && d[k] === vi[k]);
  const thieuChu = BAN_NGU[loc]
    ? keys.filter((k) => !GIU_NGUYEN.has(k) && !BAN_NGU[loc]!.test(d[k]))
    : [];
  const lan: string[] = [];
  for (const [ten, re] of CAM_LAN[loc] ?? []) {
    for (const k of keys) if (re.test(d[k])) lan.push(`${k} (lẫn ${ten})`);
  }

  const xau = trung.length + thieuChu.length + lan.length;
  loi += xau;
  const dat = keys.length - trung.length;
  console.log(`${loc.padEnd(6)} ${dat}/${keys.length} đã dịch${xau ? `  — ${xau} chỗ cần xem` : "  ✓"}`);
  for (const k of trung) console.log(`   trùng tiếng Việt   ${k} = ${JSON.stringify(vi[k])}`);
  for (const k of thieuChu) console.log(`   không có chữ bản ngữ  ${k} = ${JSON.stringify(d[k])}`);
  for (const k of lan) console.log(`   ${k}`);
}

console.log(loi ? `\nCòn ${loi} chỗ cần xem.` : "\nSáu ngôn ngữ đã phủ kín.");
process.exit(loi ? 1 : 0);
