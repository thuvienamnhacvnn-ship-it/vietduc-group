import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

/**
 * Chuyển ảnh từ kho tiếp nhận vào /public/media để web dùng được.
 *
 * Kho chứa bản gốc (JPEG máy ảnh, ảnh WhatsApp, PNG xuất từ thiết kế); web cần
 * WebP đã hạ kích thước. Script này làm đúng một việc đó, và làm lại được bao
 * nhiêu lần cũng ra kết quả y hệt: tên file sinh từ vị trí trong kho cộng số
 * thứ tự, nên chạy lại không sinh ra bản trùng, và một ảnh không bao giờ đổi
 * tên giữa hai lần chạy khiến trang dẫn tới ảnh cũ bị vỡ.
 *
 * KHÔNG động tới ảnh banner đã chỉnh tay trong /public/media/hero: những file
 * đó do người làm, chạy lại script này mà ghi đè là mất công chỉnh.
 *
 *   npm run media:kho
 */

const KHO = process.env.VDG_KHO ?? "E:/Works/itw/VD/kho";
const PUBLIC = path.resolve(process.cwd(), "public", "media");

/** Bề ngang tối đa. Ảnh trong thư viện không bao giờ chiếm hơn nửa màn hình,
 *  nên 1400 là dư; giữ bản gốc trong kho cho lần cần dùng to hơn. */
const WIDTH = 1400;
const QUALITY = 74;

type Job = { from: string; to: string; prefix: string; clean?: boolean };

const JOBS: Job[] = [
  { from: "giao-duc/_chung/anh", to: "brand", prefix: "vdg" },
  { from: "giao-duc/nganh/anh", to: "education", prefix: "nghe" },
  { from: "giao-duc/hoat-dong/anh", to: "activities", prefix: "hd" },
  { from: "giao-duc/doi-tac/anh", to: "partners", prefix: "doitac" },
  { from: "dau-tu/_chung/anh", to: "investment", prefix: "dautu" },
];

/** Mỗi trường một thư mục riêng, để ảnh không bao giờ lẫn giữa các trường. */
const TRUONG = [
  "cao-dang-cong-nghe-ngoai-thuong",
  "trung-cap-nghe-quoc-te-ivs",
  "trung-cap-bach-khoa-vung-tau",
  "trung-cap-viet-han",
  "trung-cap-cong-nghe-viet-duc",
  "itw-berlin",
];
for (const slug of TRUONG) {
  JOBS.push({
    from: `giao-duc/truong/${slug}/anh`,
    // Tiền tố là cả mã trường, không phải mẩu cắt từ nó: cắt hai chữ cuối cho
    // ra "te-ivs-01", vừa khó hiểu vừa có thể đụng nhau khi hai mã trường tình
    // cờ kết thúc giống nhau.
    to: `schools/${slug}`,
    prefix: slug,
    /* Thư mục này do chính script tạo và chỉ chứa ảnh của nó, nên dọn sạch
       trước khi ghi là an toàn — và cần thiết, không thì đổi cách đặt tên sẽ
       để lại một lứa file cũ mồ côi. Các thư mục dùng chung (education,
       activities…) KHÔNG được dọn: trong đó có ảnh làm tay từ trước. */
    clean: true,
  });
}

const SOURCE = /\.(jpe?g|png|webp|tiff?)$/i;

async function run(): Promise<void> {
  if (!fs.existsSync(KHO)) {
    console.error(`Chưa có kho ở ${KHO}. Chạy: npm run kho -- --init`);
    process.exit(1);
  }

  let made = 0;
  let skipped = 0;
  const manifest: { file: string; from: string }[] = [];

  for (const job of JOBS) {
    const src = path.join(KHO, job.from);
    if (!fs.existsSync(src)) continue;
    const files = fs.readdirSync(src).filter((f) => SOURCE.test(f)).sort();
    if (!files.length) continue;

    const dest = path.join(PUBLIC, job.to);
    fs.mkdirSync(dest, { recursive: true });
    if (job.clean) {
      for (const stale of fs.readdirSync(dest).filter((f) => f.endsWith(".webp"))) {
        fs.unlinkSync(path.join(dest, stale));
      }
    }

    for (let i = 0; i < files.length; i++) {
      const name = `${job.prefix}-${String(i + 1).padStart(2, "0")}.webp`;
      const out = path.join(dest, name);
      const from = path.join(src, files[i]);

      // Bỏ qua nếu bản đã chuyển còn mới hơn bản gốc: chạy lại script trên một
      // kho vài trăm ảnh mà lần nào cũng nén lại từ đầu là mấy phút chờ vô ích.
      if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(from).mtimeMs) {
        skipped += 1;
        manifest.push({ file: `/media/${job.to}/${name}`, from: files[i] });
        continue;
      }

      await sharp(from)
        .rotate() // theo hướng EXIF; ảnh điện thoại hay nằm ngang nếu bỏ qua
        .resize({ width: WIDTH, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(out);
      made += 1;
      manifest.push({ file: `/media/${job.to}/${name}`, from: files[i] });
    }

    console.log(`${String(files.length).padStart(3)}  ${job.from}  ->  public/media/${job.to}`);
  }

  /*
   * Bản kê ghi lại ảnh nào sinh ra từ file gốc nào. Không có nó thì sáu tháng
   * nữa không ai trả lời được câu "tấm doitac-07 này chụp ở đâu".
   */
  const out = path.resolve(process.cwd(), "docs", "media-kho.json");
  fs.writeFileSync(out, JSON.stringify({ takenAt: new Date().toISOString(), files: manifest }, null, 1));

  /*
   * Danh sách ảnh cho trang gọi tới, sinh ra dưới dạng module TypeScript.
   *
   * Không để trang tự đọc thư mục lúc chạy: đọc đĩa trong lúc dựng trang là ép
   * trang phải dựng động, mà chính chỗ đó vừa được nới ra cho nhanh. Sinh sẵn
   * thì trình biên dịch cũng bắt được lỗi gõ sai tên nhóm.
   */
  const groups = new Map<string, string[]>();
  for (const m of manifest) {
    const key = m.file.replace(/^\/media\//, "").replace(/\/[^/]+$/, "");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(m.file);
  }
  const lines = [
    "/*",
    " * Ảnh lấy từ kho tiếp nhận. SINH TỰ ĐỘNG bằng `npm run media:kho` — sửa tay",
    " * ở đây sẽ bị ghi đè. Muốn thêm ảnh thì bỏ file vào kho rồi chạy lại lệnh đó.",
    " */",
    "export const KHO_MEDIA: Record<string, readonly string[]> = {",
    ...[...groups.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, files]) => `  ${JSON.stringify(key)}: [\n${files.map((f) => `    ${JSON.stringify(f)},`).join("\n")}\n  ],`),
    "};",
    "",
    "/** Ảnh của một nhóm, mảng rỗng nếu nhóm đó chưa có ảnh nào. */",
    "export function khoAnh(key: string): readonly string[] {",
    "  return KHO_MEDIA[key] ?? [];",
    "}",
    "",
  ];
  fs.writeFileSync(path.resolve(process.cwd(), "src", "content", "kho-media.ts"), lines.join("\n"), "utf8");

  const bytes = manifest.reduce((sum, m) => {
    const f = path.join(process.cwd(), "public", m.file.replace(/^\/media\//, "media/"));
    return sum + (fs.existsSync(f) ? fs.statSync(f).size : 0);
  }, 0);

  console.log(
    `\nChuyển mới ${made} ảnh, giữ nguyên ${skipped} ảnh đã có. ` +
      `Tổng ${manifest.length} ảnh, ${(bytes / 1024 / 1024).toFixed(1)} MB.`,
  );
  console.log("Bản kê nguồn gốc: docs/media-kho.json");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
