import fs from "node:fs";
import path from "node:path";

/**
 * Kho tiếp nhận dữ liệu — tạo cây thư mục, và kiểm kê những gì đã bỏ vào.
 *
 * Ý tưởng: **vị trí của file chính là lời khai báo về nó.** Một tấm ảnh nằm ở
 * `giao-duc/truong/itw-berlin/anh/` thì tự nó đã nói nó là ảnh của trường ITW
 * Berlin — không cần ai điền thêm form nào, không cần đặt tên file theo quy
 * ước, và cũng không có chỗ nào để khai sai mà máy không phát hiện được.
 *
 * Vì sao không dùng một file kê khai tập trung: với vài nghìn file thì viết kê
 * khai là công việc nặng hơn cả việc sắp file, và một dòng khai sai sẽ âm thầm
 * gán ảnh của trường này cho trường khác. Cây thư mục thì nhìn là thấy.
 *
 *   npm run kho -- --init    tạo (hoặc bổ sung) cây thư mục, không xoá gì
 *   npm run kho              kiểm kê và báo cáo
 */

const ROOT = process.env.VDG_KHO ?? "E:/Works/itw/VD/kho";

/** Sáu trường thành viên, lấy đúng mã định danh đang dùng trong cơ sở dữ liệu. */
const TRUONG = [
  "cao-dang-cong-nghe-ngoai-thuong",
  "trung-cap-nghe-quoc-te-ivs",
  "trung-cap-bach-khoa-vung-tau",
  "trung-cap-viet-han",
  "trung-cap-cong-nghe-viet-duc",
  "itw-berlin",
];

/** Bốn dự án đang đăng, lấy đúng mã định danh trong src/content/venture.ts. */
const DU_AN = [
  "khach-san-nghi-duong-toki",
  "khu-nghi-duong-vinh-hung",
  "long-beach-resort",
  "quy-hoach-so-bo-phong-nha",
];

/** Mỗi thực thể có đúng ba ngăn. Nhiều hơn ba là bắt đầu phải nghĩ khi cất file. */
const NGAN = ["anh", "video", "tai-lieu"];

const IMAGE = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".heic", ".tif", ".tiff"]);
const VIDEO = new Set([".mp4", ".mov", ".m4v", ".webm", ".avi", ".mkv"]);
const DOC = new Set([".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".md", ".zip", ".rar"]);

const NEWLINE = /\r?\n/;

/**
 * Một link viết sát lề. Dòng thụt vào là ví dụ trong file mẫu; không loại chúng
 * ra thì kho trống vẫn báo có 15 link, mà một con số sai như thế còn tệ hơn
 * không có con số nào.
 */
const FLUSH_LINK = /^https?:\/\/\S+/;

type Entity = { key: string; dir: string; label: string };

function entities(): Entity[] {
  const list: Entity[] = [
    { key: "giao-duc/_chung", dir: "giao-duc/_chung", label: "Giáo dục — dùng chung" },
    { key: "giao-duc/nganh", dir: "giao-duc/nganh", label: "Giáo dục — ngành nghề" },
    { key: "giao-duc/hoat-dong", dir: "giao-duc/hoat-dong", label: "Giáo dục — hoạt động" },
    { key: "giao-duc/doi-tac", dir: "giao-duc/doi-tac", label: "Giáo dục — đối tác" },
  ];
  for (const slug of TRUONG) {
    list.push({ key: `giao-duc/truong/${slug}`, dir: `giao-duc/truong/${slug}`, label: `Trường: ${slug}` });
  }
  list.push({ key: "dau-tu/_chung", dir: "dau-tu/_chung", label: "Đầu tư — dùng chung" });
  for (const slug of DU_AN) {
    list.push({ key: `dau-tu/du-an/${slug}`, dir: `dau-tu/du-an/${slug}`, label: `Dự án: ${slug}` });
  }
  return list;
}

/* ------------------------------------------------------------------ init */

const README = `# Kho dữ liệu Việt Đức Group

Bỏ file vào đúng thư mục. **Vị trí file là lời khai báo về nó** — không cần đặt
tên theo quy ước, không cần điền form.

## Quy tắc

- Ảnh vào \`anh/\`, video vào \`video/\`, tài liệu (PDF, Word, Excel) vào \`tai-lieu/\`.
- Không biết bỏ đâu thì để ở \`_chua-phan-loai/\`. Không được đoán bừa — để đó
  rồi hỏi, sai chỗ còn tệ hơn chưa phân loại.
- Ảnh/video cứ để nguyên bản gốc, độ phân giải cao. Việc nén là của máy.
- Trùng file không sao, máy tự nhận ra và bỏ bản trùng.

## Link (Canva, YouTube, Drive, Facebook…)

Mỗi thư mục có file \`lien-ket.md\`. Mỗi dòng một link, kèm vài chữ mô tả:

    https://www.canva.com/design/xxxx  — bộ nhận diện thương hiệu 2026
    https://youtu.be/xxxx              — phóng sự lễ khai giảng

**Canva:** link Canva cần đăng nhập mới xem được, máy không tự lấy nội dung
được. Với thứ cần đưa lên web thì xuất từ Canva ra PDF hoặc PNG rồi bỏ vào
\`tai-lieu/\` hoặc \`anh/\`, và vẫn dán link vào \`lien-ket.md\` để còn biết bản
gốc nằm đâu mà sửa.

## Kiểm tra đã đủ chưa

    cd ~/viet-duc-group
    npm run kho

Lệnh đó liệt kê từng thư mục có bao nhiêu ảnh, video, tài liệu, và chỉ ra chỗ
nào còn trống hoặc có gì đó máy không hiểu.
`;

const LIEN_KET = `# Link

Mỗi dòng một link, kèm vài chữ mô tả sau dấu gạch ngang. Ví dụ:

    https://www.canva.com/design/xxxx  — hồ sơ năng lực bản 2026
`;

function init(): void {
  let made = 0;
  const mk = (rel: string) => {
    const dir = path.join(ROOT, rel);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      made += 1;
    }
  };

  for (const e of entities()) {
    for (const ngan of NGAN) mk(path.join(e.dir, ngan));
    const links = path.join(ROOT, e.dir, "lien-ket.md");
    if (!fs.existsSync(links)) fs.writeFileSync(links, LIEN_KET, "utf8");
  }
  mk("canva");
  mk("_chua-phan-loai");

  const readme = path.join(ROOT, "README.md");
  if (!fs.existsSync(readme)) fs.writeFileSync(readme, README, "utf8");

  console.log(`Kho: ${ROOT}`);
  console.log(made ? `Đã tạo thêm ${made} thư mục.` : "Cây thư mục đã đầy đủ, không tạo thêm gì.");
  console.log("Đọc README.md trong kho để biết quy tắc bỏ file.");
}

/* -------------------------------------------------------------- kiểm kê */

type Count = { anh: number; video: number; tailieu: number; la: string[]; bytes: number };

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile() && !entry.name.startsWith("~$") && entry.name !== "lien-ket.md") out.push(full);
  }
  return out;
}

function tally(dir: string): Count {
  const c: Count = { anh: 0, video: 0, tailieu: 0, la: [], bytes: 0 };
  for (const file of walk(dir)) {
    const ext = path.extname(file).toLowerCase();
    c.bytes += fs.statSync(file).size;
    if (IMAGE.has(ext)) c.anh += 1;
    else if (VIDEO.has(ext)) c.video += 1;
    else if (DOC.has(ext)) c.tailieu += 1;
    else c.la.push(path.relative(ROOT, file));
  }
  return c;
}

function mb(bytes: number): string {
  return bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/**
 * Số link thật trong lien-ket.md.
 *
 * Chỉ tính dòng viết sát lề. Dòng thụt vào là ví dụ trong file mẫu; không loại
 * chúng ra thì kho trống vẫn báo có 15 link, và một con số sai như thế còn tệ
 * hơn không có con số nào.
 */
function links(dir: string): number {
  const file = path.join(dir, "lien-ket.md");
  if (!fs.existsSync(file)) return 0;
  const text = fs.readFileSync(file, "utf8");
  const rows = text.split(NEWLINE);
  return rows.filter((line) => FLUSH_LINK.test(line)).length;
}

function report(): void {
  if (!fs.existsSync(ROOT)) {
    console.error(`Chưa có kho ở ${ROOT}. Chạy: npm run kho -- --init`);
    process.exit(1);
  }

  console.log(`Kho: ${ROOT}\n`);
  console.log("  ẢNH  VIDEO   T.LIỆU  LINK   DUNG LƯỢNG   THƯ MỤC");
  console.log("  ---- ------  ------  ----   ----------   " + "-".repeat(40));

  const total = { anh: 0, video: 0, tailieu: 0, bytes: 0, link: 0 };
  const trong: string[] = [];
  const la: string[] = [];

  for (const e of entities()) {
    const dir = path.join(ROOT, e.dir);
    const c = tally(dir);
    const l = links(dir);
    total.anh += c.anh;
    total.video += c.video;
    total.tailieu += c.tailieu;
    total.bytes += c.bytes;
    total.link += l;
    la.push(...c.la);
    if (!c.anh && !c.video && !c.tailieu && !l) trong.push(e.label);
    console.log(
      `  ${String(c.anh).padStart(4)} ${String(c.video).padStart(6)}  ${String(c.tailieu).padStart(6)}  ${String(l).padStart(4)}   ${mb(c.bytes).padStart(10)}   ${e.label}`,
    );
  }

  const chua = tally(path.join(ROOT, "_chua-phan-loai"));
  const canva = tally(path.join(ROOT, "canva"));

  console.log("\n  " + "-".repeat(66));
  console.log(
    `  TỔNG: ${total.anh} ảnh · ${total.video} video · ${total.tailieu} tài liệu · ${total.link} link · ${mb(total.bytes)}`,
  );

  if (chua.anh + chua.video + chua.tailieu > 0) {
    console.log(
      `\n  ⚠ _chua-phan-loai: ${chua.anh} ảnh, ${chua.video} video, ${chua.tailieu} tài liệu (${mb(chua.bytes)})`,
    );
    console.log("    Những thứ này chưa gán được cho trường hay dự án nào.");
  }
  if (canva.anh + canva.video + canva.tailieu > 0) {
    console.log(`\n  canva/: ${canva.anh} ảnh, ${canva.tailieu} tài liệu (${mb(canva.bytes)})`);
  }

  if (la.length) {
    console.log(`\n  ⚠ ${la.length} file máy không nhận ra định dạng:`);
    for (const f of la.slice(0, 12)) console.log(`    ${f}`);
    if (la.length > 12) console.log(`    … và ${la.length - 12} file nữa`);
  }

  if (trong.length) {
    console.log(`\n  Chưa có gì (${trong.length}):`);
    for (const t of trong) console.log(`    ${t}`);
  }

  console.log("");
}

const mode = process.argv.includes("--init") ? "init" : "report";
if (mode === "init") init();
else report();
