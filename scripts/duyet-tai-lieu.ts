import { eq, inArray } from "drizzle-orm";
import { napEnv } from "./env";

napEnv();

const { getDb } = await import("../src/lib/db");
const { contentBlocks, documents } = await import("../src/lib/db/schema");

/**
 * Duyệt tài liệu đã bóc, trừ những tài liệu không được phép công khai.
 *
 * `npm run ingest` để mọi thứ ở trạng thái nháp, và nháp thì trợ lý AI không
 * đọc tới — nó chỉ dùng nội dung đã duyệt. Hệ quả: bóc xong 800 đoạn mà hỏi gì
 * trợ lý cũng không biết, vì chưa ai bấm duyệt cho từng đoạn một.
 *
 * KHÔNG DUYỆT hai nhóm:
 *
 * 1. Giấy tờ có SỐ ĐỊNH DANH CÁ NHÂN. Năm giấy chứng nhận đăng ký doanh nghiệp
 *    và bộ hồ sơ pháp lý Hoàng Long đều in số định danh, ngày sinh đầy đủ và
 *    địa chỉ nhà riêng của người đại diện. Duyệt tức là cho trợ lý quyền đọc
 *    ra những thứ ấy khi khách hỏi.
 *
 * 2. Văn bản chỉ có chữ do MÁY ĐỌC ẢNH. Quyết định 1015 và 2541 là bản quét,
 *    chữ lấy bằng OCR nên sai chính tả và sai số là chuyện thường. Số liệu sai
 *    mà trợ lý nói ra bằng giọng chắc chắn thì tệ hơn là trợ lý im lặng.
 *
 * Chạy: npm run duyet
 */

/** Tài liệu giữ nguyên trạng thái nháp, kèm lý do. */
const GIU_NHAP: { khop: string; vi_sao: string }[] = [
  { khop: "Giấy chứng nhận ĐKKD", vi_sao: "có số định danh cá nhân và ngày sinh" },
  { khop: "Hồ sơ pháp lý - Công ty CP Khách sạn", vi_sao: "có số định danh cá nhân và ngày sinh" },
  { khop: "Quyết định 1015", vi_sao: "bản quét, chữ lấy bằng OCR nên chưa đáng tin" },
  { khop: "Quyết định 2541", vi_sao: "bản quét, chữ lấy bằng OCR nên chưa đáng tin" },
];

async function main() {
  const db = await getDb();
  const rows = await db.select().from(documents);

  const duyet: number[] = [];
  for (const r of rows) {
    const ten = r.originalName.normalize("NFC");
    const giu = GIU_NHAP.find((g) => ten.includes(g.khop));
    if (giu) {
      console.log(`  giữ nháp  ${ten.slice(0, 56)}  (${giu.vi_sao})`);
      continue;
    }
    duyet.push(r.id);
  }

  if (!duyet.length) {
    console.log("Không có tài liệu nào để duyệt.");
    process.exit(0);
  }

  await db.update(documents).set({ status: "approved" }).where(inArray(documents.id, duyet));
  const ketQua = await db
    .update(contentBlocks)
    .set({ status: "approved" })
    .where(inArray(contentBlocks.documentId, duyet))
    .returning({ id: contentBlocks.id });

  console.log(`\nĐã duyệt ${duyet.length} tài liệu, ${ketQua.length} đoạn nội dung.`);

  const conNhap = await db
    .select({ id: contentBlocks.id })
    .from(contentBlocks)
    .where(eq(contentBlocks.status, "draft"));
  console.log(`Còn ${conNhap.length} đoạn ở trạng thái nháp, đúng như chủ ý.`);
  console.log("\nTiếp theo: npm run kb:build");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
