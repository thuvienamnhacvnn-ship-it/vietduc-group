import { napEnv } from "./env";

napEnv();

const { getDb } = await import("../src/lib/db");
const { settings } = await import("../src/lib/db/schema");
const { DEFAULT_SETTINGS, SETTINGS_KEYS } = await import("../src/lib/site-config");
const { eq } = await import("drizzle-orm");

/**
 * Ghi đè khối liên hệ trong cơ sở dữ liệu bằng giá trị trong mã nguồn.
 *
 * `seed` CỐ Ý không đụng tới settings đã lưu — đó là nơi biên tập viên sửa qua
 * trang quản trị, ghi đè mỗi lần seed thì mọi thay đổi của họ biến mất. Nhưng
 * vì thế, sửa địa chỉ trong `site-config.ts` rồi chạy seed thì trang vẫn hiện
 * địa chỉ cũ: bản ghi trong DB có từ lần seed đầu tiên và không ai thay nó.
 *
 * Lệnh này là cái van cho đúng tình huống ấy — chạy khi đã sửa `site-config` và
 * muốn giá trị mới thắng. Chỉ đụng khối `contact`, không đụng social hay seo.
 */
async function main() {
  const db = await getDb();
  const cu = await db.select().from(settings).where(eq(settings.key, SETTINGS_KEYS.contact));

  if (!cu[0]) {
    await db.insert(settings).values({ key: SETTINGS_KEYS.contact, value: DEFAULT_SETTINGS.contact });
    console.log("Da tao moi khoi lien he.");
  } else {
    await db
      .update(settings)
      .set({ value: DEFAULT_SETTINGS.contact })
      .where(eq(settings.key, SETTINGS_KEYS.contact));
    console.log("Da ghi de khoi lien he bang gia tri trong site-config.ts.");
  }
  console.log("  tru so:", DEFAULT_SETTINGS.contact.headquarters);
  console.log("  so van phong:", DEFAULT_SETTINGS.contact.offices?.length ?? 0);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
