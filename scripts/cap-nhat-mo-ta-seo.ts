import { napEnv } from "./env";

napEnv();

const { getDb } = await import("../src/lib/db");
const { settings } = await import("../src/lib/db/schema");
const { DEFAULT_SETTINGS, SETTINGS_KEYS } = await import("../src/lib/site-config");
const { eq } = await import("drizzle-orm");

/**
 * Ghi đè RIÊNG câu mô tả mặc định (defaultDescription) của khối SEO trong cơ sở
 * dữ liệu bằng giá trị trong `site-config.ts`.
 *
 * Cùng lý do với `cap-nhat-lien-he.ts`: seed cố ý không đụng tới settings đã
 * lưu, nên sửa câu mô tả trong mã nguồn rồi seed thì mọi trang vẫn mang câu cũ
 * trong thẻ meta. Lần này là câu "với sáu trường thành viên", nằm trong mô tả
 * của MỌI trang và hiện ngay trên kết quả Google.
 *
 * Chỉ thay đúng một trường ấy. Các trường khác của khối SEO (tên site, địa chỉ
 * site, ảnh chia sẻ) có thể đã được sửa qua trang quản trị nên để nguyên.
 */
async function main() {
  const db = await getDb();
  const cu = await db.select().from(settings).where(eq(settings.key, SETTINGS_KEYS.seo));
  const moTa = DEFAULT_SETTINGS.seo.defaultDescription;

  if (!cu[0]) {
    await db.insert(settings).values({ key: SETTINGS_KEYS.seo, value: DEFAULT_SETTINGS.seo });
    console.log("Da tao moi khoi SEO.");
  } else {
    const giaTri = { ...(cu[0].value as Record<string, unknown>), defaultDescription: moTa };
    await db.update(settings).set({ value: giaTri }).where(eq(settings.key, SETTINGS_KEYS.seo));
    console.log("Da thay cau mo ta mac dinh cua khoi SEO.");
  }
  console.log("  vi:", moTa.vi);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
