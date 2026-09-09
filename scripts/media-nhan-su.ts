import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import sharp from "sharp";

/**
 * Bóc ảnh chân dung nhúng trong hồ sơ .docx rồi đưa vào `public/media/people`.
 *
 * Mỗi hồ sơ là một tệp zip, ảnh nằm trong `word/media/`. Điều này DỄ BỎ SÓT:
 * bản bóc đầu tiên chỉ đọc `word/document.xml` để lấy chữ, và vì thế 17 tấm
 * chân dung nằm im trong tệp suốt một vòng làm việc — trong khi kích thước tệp
 * (1,8-2,2 MB cho một trang chữ) đã nói rõ là có ảnh trong đó.
 *
 * Cùng một người có hồ sơ chép sang nhiều thư mục, nên ảnh trùng nhau; gom
 * theo hash nội dung để mỗi tấm chỉ lưu một lần.
 *
 * Chạy: npm run media:nhan-su
 */

const GOC = "E:/Works/itw/VD/CƠ CẤU NHÂN SỰ VIỆT ĐỨC GROUP";
const RA = path.resolve(process.cwd(), "public/media/people");

/**
 * Hash nội dung ảnh -> slug người.
 *
 * Khoá là hash chứ không phải tên tệp .docx: cùng một người có thể có hai bản
 * hồ sơ tên khác nhau (một bản có ảnh, một bản không), và ảnh mới là thứ ta
 * cần nhận diện.
 */
const THEO_HASH: Record<string, string> = {
  "1c1831b7fd50": "phan-phuong-nguyen",
  "87f4826cae31": "pham-van-tung",
  "810332219f9d": "bui-van-phuong",
  cdad53273e59: "nguyen-manh-tuan",
  "046cb570c75a": "tran-dinh-hung",
  "63f87cba51cc": "ha-thi-men",
  "35db79b862ea": "nguyen-thi-phuong-lan",
  "97a2207d870d": "dam-quang-viet",
  ce20a526cfa4: "le-van-tan",
  b3f441a827fe: "nguyen-kien-trung",
  "30a2c1342118": "ho-van-phong",
  d61e054f6e73: "phan-minh-phuong",
  "67695dfc227e": "do-thi-thuy",
  c8eef492343c: "hoang-dinh-chien",
  "7b79f0da0822": "nguyen-thi-nhu-ngoc",
  f0e34c8c33f2: "nguyen-van-linh",
  b7eaf21574e3: "le-cong-hoa",
};

function duyet(thuMuc: string): string[] {
  const ra: string[] = [];
  for (const ten of fs.readdirSync(thuMuc)) {
    const p = path.join(thuMuc, ten);
    if (fs.statSync(p).isDirectory()) ra.push(...duyet(p));
    else if (p.toLowerCase().endsWith(".docx")) ra.push(p);
  }
  return ra;
}

async function main() {
  if (!fs.existsSync(GOC)) {
    console.error(`Khong thay thu muc nguon: ${GOC}`);
    process.exit(1);
  }
  fs.mkdirSync(RA, { recursive: true });

  const daLam = new Set<string>();
  let ghi = 0;
  const chuaBiet: string[] = [];

  for (const tep of duyet(GOC)) {
    let media: { co: number; ten: string }[] = [];
    try {
      media = execFileSync("unzip", ["-l", tep], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 })
        .split("\n")
        .map((d) => d.trim())
        .filter((d) => d.includes("word/media/"))
        .map((d) => ({ co: Number(d.split(/\s+/)[0]), ten: d.split(/\s+/).pop() as string }));
    } catch {
      continue;
    }
    if (!media.length) continue;

    // Ảnh chân dung là ảnh lớn nhất: logo và hoạ tiết trang trí đều nhỏ.
    media.sort((a, b) => b.co - a.co);
    const bytes = execFileSync("unzip", ["-p", tep, media[0].ten], { maxBuffer: 96 * 1024 * 1024 });
    const hash = createHash("sha1").update(bytes).digest("hex").slice(0, 12);

    const slug = THEO_HASH[hash];
    if (!slug) {
      if (!chuaBiet.includes(hash)) chuaBiet.push(`${hash}  (${path.basename(tep)})`);
      continue;
    }
    if (daLam.has(slug)) continue;
    daLam.add(slug);

    /*
     * Hai cỡ, cùng một khung cắt.
     *
     * Ảnh gốc là chân dung nửa người ngồi bàn làm việc, khuôn mặt nằm ở khoảng
     * một phần ba trên. Cắt vuông từ giữa ảnh sẽ chặt mất đầu, nên khung vuông
     * neo lên phía trên (`position: "top"`) — phần bị bỏ là mặt bàn phía dưới.
     */
    const vuong = (canh: number) =>
      sharp(bytes).resize(canh, canh, { fit: "cover", position: "top" }).webp({ quality: 82 });

    await vuong(640).toFile(path.join(RA, `${slug}.webp`));
    // Bản dọc cho trang hồ sơ: giữ nguyên tỉ lệ, chỉ thu nhỏ.
    await sharp(bytes).resize(900, null, { withoutEnlargement: true }).webp({ quality: 84 }).toFile(path.join(RA, `${slug}-doc.webp`));
    ghi += 1;
    console.log(`  ok    ${slug}`);
  }

  console.log(`\nDa ghi ${ghi} chan dung vao ${path.relative(process.cwd(), RA)}`);
  if (chuaBiet.length) {
    console.log("\nCHUA BIET LA AI (them vao THEO_HASH):");
    for (const h of chuaBiet) console.log("  " + h);
  }
  const thieu = Object.values(THEO_HASH).filter((s) => !daLam.has(s));
  if (thieu.length) console.log("\nKhong tim thay anh cho: " + thieu.join(", "));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
