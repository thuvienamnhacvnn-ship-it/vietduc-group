/**
 * Soi mọi khối chữ đa ngữ trong mã nguồn, tìm chỗ lẫn hệ chữ.
 *
 * Kiểu `L10nMap` bảo đảm có đủ khoá, nhưng không nhìn được vào bên trong chuỗi.
 * Ba lần trong lúc dịch tay, chữ của ngôn ngữ này lọt vào ô của ngôn ngữ khác:
 * "школ" (Kirin) rơi vào câu tiếng Nhật, một chữ Hán lạc vào câu tiếng Anh,
 * một từ tiếng Anh sót lại giữa câu tiếng Trung. Cả ba đều dựng và chạy bình
 * thường, chỉ người đọc đúng thứ tiếng đó mới thấy — nghĩa là không ai thấy.
 *
 * Script này đọc mã nguồn bằng chính bộ phân tích của TypeScript, tìm mọi
 * object literal có khoá `vi`, rồi kiểm từng ô:
 *
 *   - ô ja/ko/zh-TW phải có chữ của hệ chữ ấy (bỏ qua ô thuần số liệu)
 *   - ô ja không được có hangul; ô ko không được có kana; ô zh-TW không có cả hai
 *   - không ô nào được lẫn Kirin, Ả Rập hay Thái
 *   - ô en/de không được có chữ CJK
 *
 * Chạy: npm run i18n:soi
 */
import ts from "typescript";
import { readFileSync } from "node:fs";
import { globSync } from "node:fs";

const KANA = /[぀-ヿ]/;
const HANGUL = /[가-힯ᄀ-ᇿ]/;
const HAN = /[一-鿿]/;
const CJK = /[぀-ヿ가-힯一-鿿]/;
const LA = /[Ѐ-ӿ؀-ۿ฀-๿]/; // Kirin, Ả Rập, Thái

type Luat = { banNgu?: RegExp; cam: Array<[string, RegExp]> };
const LUAT: Record<string, Luat> = {
  ja: { banNgu: /[぀-ヿ一-鿿]/, cam: [["hangul", HANGUL]] },
  ko: { banNgu: HANGUL, cam: [["kana", KANA]] },
  "zh-TW": { banNgu: HAN, cam: [["kana", KANA], ["hangul", HANGUL]] },
  en: { cam: [["chữ CJK", CJK]] },
  de: { cam: [["chữ CJK", CJK]] },
};

/*
 * Khi nào KHÔNG đòi ô phải có chữ bản ngữ.
 *
 * Hai trường hợp, nhận ra qua chính ô tiếng Việt:
 *
 *  - Ô số liệu: "16.244,9 m²", "40,0%". Dịch sang tiếng Nhật vẫn là con số.
 *  - Bảng mã, không phải câu chữ: `LOCALE_TAG` có vi:"vi-VN" ja:"ja-JP",
 *    `LOCALE_SHORT` có vi:"VI" ja:"JA". Chúng cũng là object có khoá `vi` nên
 *    lọt vào đây, nhưng đòi "ja-JP" phải chứa kana là vô lý. Dấu hiệu: ô tiếng
 *    Việt thuần ASCII — câu tiếng Việt thật gần như luôn có dấu.
 *
 * Phần kiểm lẫn hệ chữ vẫn chạy cho mọi ô; đó mới là phần bắt được lỗi thật.
 */
const boQuaBanNgu = (vi: string) =>
  (/\d/.test(vi) && vi.replace(/[\d\s.,%²³()/+–-]/g, "").length <= 3) ||
  /^[\x00-\x7F]*$/.test(vi);

const files = globSync("src/**/*.{ts,tsx}");
const loi: string[] = [];
let soO = 0;

for (const file of files) {
  const text = readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

  const visit = (node: ts.Node) => {
    if (ts.isObjectLiteralExpression(node)) {
      const o = new Map<string, string>();
      for (const p of node.properties) {
        if (!ts.isPropertyAssignment(p)) continue;
        const ten = ts.isIdentifier(p.name) || ts.isStringLiteral(p.name) ? p.name.text : null;
        if (!ten) continue;
        const v = p.initializer;
        if (ts.isStringLiteral(v) || ts.isNoSubstitutionTemplateLiteral(v)) o.set(ten, v.text);
        /* Mảng chuỗi (L10nList): gộp lại kiểm chung, sai ở dòng nào cũng bắt được. */
        else if (ts.isArrayLiteralExpression(v)) {
          const cac = v.elements
            .filter((e): e is ts.StringLiteral => ts.isStringLiteral(e))
            .map((e) => e.text);
          if (cac.length === v.elements.length && cac.length) o.set(ten, cac.join(" ⏵ "));
        }
      }

      const vi = o.get("vi");
      if (vi) {
        const dong = sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;
        for (const [ma, luat] of Object.entries(LUAT)) {
          const v = o.get(ma);
          if (v === undefined) continue;
          soO += 1;
          const noi = `${file}:${dong} [${ma}]`;
          if (luat.banNgu && !boQuaBanNgu(vi) && !luat.banNgu.test(v)) {
            loi.push(`${noi} không có chữ bản ngữ: ${JSON.stringify(v.slice(0, 60))}`);
          }
          for (const [ten, re] of luat.cam) {
            const m = re.exec(v);
            if (m) loi.push(`${noi} lẫn ${ten} "${m[0]}": ${JSON.stringify(v.slice(0, 60))}`);
          }
          const k = LA.exec(v);
          if (k) loi.push(`${noi} lẫn chữ lạ "${k[0]}": ${JSON.stringify(v.slice(0, 60))}`);
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
}

console.log(`Đã soi ${soO} ô chữ trong ${files.length} file.`);
if (!loi.length) {
  console.log("Không có ô nào lẫn hệ chữ.");
  process.exit(0);
}
console.error(`\n${loi.length} chỗ cần xem:`);
for (const l of loi) console.error(`   ${l}`);
process.exit(1);
