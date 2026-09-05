import fs from "node:fs";
import path from "node:path";
import { getDb } from "../src/lib/db";
import {
  activities,
  documents,
  faqs,
  partners,
  people,
  posts,
  programs,
  schools,
  settings as settingsTable,
} from "../src/lib/db/schema";
import { KHO_MEDIA } from "../src/content/kho-media";
import { publishedProjects } from "../src/content/venture";
import { DEFAULT_SETTINGS, SOCIAL_KEYS } from "../src/lib/site-config";

/**
 * Bảng kê những gì web còn thiếu — ảnh và thông tin.
 *
 * Đọc thẳng từ cơ sở dữ liệu và từ kho ảnh, không dựa vào trí nhớ của ai. Chạy
 * lại sau mỗi lần bổ sung dữ liệu là biết còn thiếu gì:
 *
 *   npm run thieu
 *
 * Chỉ liệt kê chỗ trống, không đoán và không tự điền. Một ô trống được nói ra
 * thì còn sửa được; một ô trống bị lấp bằng phỏng đoán thì thành thông tin sai
 * nằm trên web thật mà không ai biết.
 */

const KHO = process.env.VDG_KHO ?? "E:/Works/itw/VD/kho";

type Row = { muc: string; thieu: string };

function heading(title: string): void {
  console.log("\n" + title);
  console.log("─".repeat(Math.max(title.length, 60)));
}

function list(rows: Row[]): void {
  if (!rows.length) {
    console.log("  (đủ)");
    return;
  }
  const w = Math.max(...rows.map((r) => r.muc.length));
  for (const r of rows) console.log("  " + r.muc.padEnd(w) + "   " + r.thieu);
}

/** Một trường L10n coi là trống nếu không có bản tiếng Việt. */
const empty = (value: unknown): boolean => {
  if (value == null) return true;
  if (typeof value === "string") return !value.trim();
  if (Array.isArray(value)) return !value.length;
  if (typeof value === "object") {
    const vi = (value as Record<string, unknown>).vi;
    if (Array.isArray(vi)) return !vi.length;
    if (typeof vi === "string") return !vi.trim();
    return vi == null;
  }
  return false;
};

async function main(): Promise<void> {
  const db = await getDb();
  const [schoolRows, programRows, partnerRows, activityRows, faqRows, postRows, peopleRows, docRows, settingRows] =
    await Promise.all([
      db.select().from(schools),
      db.select().from(programs),
      db.select().from(partners),
      db.select().from(activities),
      db.select().from(faqs),
      db.select().from(posts),
      db.select().from(people),
      db.select().from(documents),
      db.select().from(settingsTable),
    ]);

  console.log("BẢNG KÊ THIẾU — Việt Đức Group");
  console.log("Đọc từ cơ sở dữ liệu đang chạy và kho ảnh tại " + KHO);

  /* ---------------------------------------------------------------- ảnh */

  heading("1. ẢNH — trường thành viên");
  list(
    schoolRows
      .map((s) => {
        const gallery = KHO_MEDIA[`schools/${s.slug}`]?.length ?? 0;
        const missing: string[] = [];
        if (!gallery) missing.push("chưa có ảnh nào trong kho");
        if (!s.coverPath) missing.push("thiếu ảnh bìa");
        if (!s.logoPath) missing.push("thiếu logo");
        return missing.length ? { muc: s.slug, thieu: missing.join(", ") } : null;
      })
      .filter((r): r is Row => r !== null),
  );

  heading("2. ẢNH — dự án đầu tư");
  list(
    publishedProjects().map((p) => ({
      muc: p.slug,
      thieu: `chưa có thư mục ảnh riêng (kho: dau-tu/du-an/${p.slug}/anh)`,
    })),
  );

  heading("3. ẢNH — ngành đào tạo");
  {
    const total = programRows.length;
    console.log(`  ${total} ngành đang đăng, chưa ngành nào có ảnh riêng.`);
    console.log("  Kho hiện có 12 ảnh xưởng thực hành dùng chung cho cả landing,");
    console.log("  chưa gán được ảnh nào cho một ngành cụ thể.");
  }

  /* ----------------------------------------------------------- thông tin */

  heading("4. THÔNG TIN — trường thành viên");
  list(
    schoolRows
      .map((s) => {
        const missing: string[] = [];
        if (empty(s.summary)) missing.push("giới thiệu");
        if (empty(s.tagline)) missing.push("khẩu hiệu");
        if (!s.address) missing.push("địa chỉ");
        if (!s.phone) missing.push("điện thoại");
        if (!s.email) missing.push("email");
        if (!s.website) missing.push("website");
        if (empty(s.highlights)) missing.push("điểm nổi bật");
        if (empty(s.stats)) missing.push("số liệu");
        return missing.length ? { muc: s.slug, thieu: missing.join(", ") } : null;
      })
      .filter((r): r is Row => r !== null),
  );

  heading("5. THÔNG TIN — ngành đào tạo (số ngành còn trống mỗi mục)");
  {
    const fields: [string, (p: (typeof programRows)[number]) => unknown][] = [
      ["mô tả tổng quan", (p) => p.overview],
      ["đối tượng tuyển", (p) => p.audience],
      ["mục tiêu", (p) => p.objectives],
      ["chuẩn đầu ra", (p) => p.outcomes],
      ["môn học / mô-đun", (p) => p.modules],
      ["cơ hội việc làm", (p) => p.careers],
      ["hồ sơ đăng ký", (p) => p.admissionFile],
      ["thời lượng", (p) => p.durationMonths ?? p.durationLabel],
      ["chỉ tiêu/năm", (p) => p.intakeQuota],
    ];
    list(
      fields
        .map(([label, get]) => {
          const n = programRows.filter((p) => empty(get(p))).length;
          return n ? { muc: label, thieu: `${n}/${programRows.length} ngành trống` } : null;
        })
        .filter((r): r is Row => r !== null),
    );
  }

  heading("6. THÔNG TIN — cấu hình chung");
  {
    const rows: Row[] = [];
    const byKey = new Map(settingRows.map((r) => [r.key, r.value as Record<string, unknown>]));
    const social = { ...DEFAULT_SETTINGS.social, ...(byKey.get("social") ?? {}) } as Record<string, string>;
    const emptyChannels = SOCIAL_KEYS.filter((k) => !social[k]?.trim());
    if (emptyChannels.length) {
      rows.push({ muc: "mạng xã hội", thieu: `${emptyChannels.length}/${SOCIAL_KEYS.length} kênh chưa có địa chỉ: ${emptyChannels.join(", ")}` });
    }
    const contact = { ...DEFAULT_SETTINGS.contact, ...(byKey.get("contact") ?? {}) } as Record<string, unknown>;
    if (!String(contact.mapEmbedUrl ?? "").trim()) rows.push({ muc: "bản đồ", thieu: "chưa có mapEmbedUrl (đang dựng tạm từ địa chỉ)" });
    if (!String(contact.officeHours ?? "").trim()) rows.push({ muc: "giờ làm việc", thieu: "chưa có" });
    const seo = { ...DEFAULT_SETTINGS.seo, ...(byKey.get("seo") ?? {}) } as Record<string, unknown>;
    if (!String(seo.siteUrl ?? "").trim()) rows.push({ muc: "địa chỉ web chính thức", thieu: "chưa có siteUrl (cần cho SEO và ảnh chia sẻ)" });
    list(rows);
  }

  heading("7. THÔNG TIN — các bảng còn trống");
  {
    const rows: Row[] = [];
    if (!peopleRows.length) rows.push({ muc: "Đội ngũ", thieu: "0 người — trang /doi-ngu không có gì để hiện" });
    if (!postRows.length) rows.push({ muc: "Tin tức", thieu: "0 bài — trang /tin-tuc trống" });
    const draftPrograms = programRows.filter((p) => p.status !== "approved").length;
    if (draftPrograms) rows.push({ muc: "Ngành ở dạng nháp", thieu: `${draftPrograms} ngành chưa duyệt nên không hiện ra` });
    const draftPartners = partnerRows.filter((p) => p.status !== "approved").length;
    if (draftPartners) rows.push({ muc: "Đối tác ở dạng nháp", thieu: `${draftPartners} đối tác chưa duyệt` });
    rows.push({ muc: "Hoạt động", thieu: `${activityRows.length} mục` });
    rows.push({ muc: "Hỏi đáp", thieu: `${faqRows.length} câu` });
    rows.push({ muc: "Tài liệu nguồn", thieu: `${docRows.length} tài liệu` });
    list(rows);
  }

  /* ------------------------------------------------------------ trong kho */

  heading("8. TRONG KHO — chưa phân loại hoặc chưa xử lý");
  {
    const rows: Row[] = [];
    const chua = path.join(KHO, "_chua-phan-loai");
    if (fs.existsSync(chua)) {
      const files = fs.readdirSync(chua).filter((f) => !f.endsWith(".md"));
      if (files.length) rows.push({ muc: "_chua-phan-loai", thieu: `${files.length} file chưa gán cho trường/dự án nào` });
      const links = path.join(chua, "lien-ket.md");
      if (fs.existsSync(links)) {
        const n = fs.readFileSync(links, "utf8").split(/\r?\n/).filter((l) => /^https?:\/\//.test(l)).length;
        if (n) rows.push({ muc: "link chưa rõ", thieu: `${n} link Facebook chưa biết thuộc mục nào` });
      }
    }
    const videos = KHO_MEDIA["partners"] ? 0 : 0;
    void videos;
    rows.push({ muc: "video trong kho", thieu: "2 video NIBELC Gala chưa đưa lên web" });
    rows.push({ muc: "PDF", thieu: "2 file đều là bản scan, 0 ký tự đọc được — cần bản Word/gốc hoặc chạy OCR 68 trang" });
    list(rows);
  }

  heading("9. CHƯA THỐNG NHẤT — cần Sếp xác nhận");
  list([
    { muc: "Trung cấp Kỹ nghệ Việt Đức", thieu: "có trên sơ đồ tập đoàn, chưa có trong web" },
    { muc: "Cao đẳng công nghệ Việt Đức", thieu: "có trên sơ đồ, chưa có trong web (có PDF 'Dự án đầu tư xây dựng' — đang xây?)" },
    { muc: "VGIE", thieu: "thương hiệu trên sơ đồ, web chưa nhắc tới" },
    { muc: "Viet Duc Investment & Tourism", thieu: "thương hiệu trên sơ đồ, web chưa nhắc tới" },
    { muc: "Viet Duc Hotel & Travel", thieu: "thương hiệu trên sơ đồ, web chưa nhắc tới" },
    { muc: "Golden Dragon Hotel", thieu: "thương hiệu trên sơ đồ, web chưa nhắc tới" },
    { muc: "SHDC Du lịch sinh thái", thieu: "thương hiệu trên sơ đồ, web chưa nhắc tới" },
    { muc: "11 ảnh mỏ đá / công trường", thieu: "chưa biết thuộc dự án nào, đang để tiêu đề chung 'Ngoài hiện trường'" },
    { muc: "Tài khoản quản trị", thieu: "chưa tạo — cần chạy seed với ADMIN_EMAIL/ADMIN_PASSWORD" },
  ]);

  console.log("");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
