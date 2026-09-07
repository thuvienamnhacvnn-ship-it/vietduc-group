import { eq } from "drizzle-orm";
import { getDb } from "../src/lib/db";
import { settings } from "../src/lib/db/schema";
import { DEFAULT_SETTINGS, SETTINGS_KEYS } from "../src/lib/site-config";

/**
 * Ghi lại các khối cấu hình từ giá trị mặc định trong mã nguồn.
 *
 * `npm run seed` cố ý KHÔNG đụng vào bảng `settings` khi đã có giá trị: người
 * biên tập sửa số điện thoại trong trang quản trị mà mỗi lần seed lại bị đè về
 * cũ thì không ai dám dùng nữa.
 *
 * Nhưng chính vì thế, khi mặc định trong mã nguồn có thêm thứ mới — ba ngôn ngữ
 * nữa cho tiêu đề trang, tên miền vừa trỏ về — thì bản trong cơ sở dữ liệu vẫn
 * đứng yên ở bản cũ. Trang tiếng Nhật đã hiển thị tiếng Nhật, riêng thẻ <title>
 * vẫn tiếng Việt, đúng vì lý do đó.
 *
 * Script này là lối thoát cho tình huống ấy, và nó GHI ĐÈ. Chỉ chạy khi biết
 * rõ khối đó chưa ai sửa tay, hoặc khi chấp nhận mất phần sửa tay đó. Nó in ra
 * giá trị cũ trước khi ghi, để còn khôi phục được nếu lỡ.
 *
 * Chạy:  npm run cau-hinh          → xem sẽ đổi gì, không ghi
 *        npm run cau-hinh -- --ghi → ghi thật
 */
const GHI = process.argv.includes("--ghi");

/* Chỉ những khối thực sự do mã nguồn định nghĩa. Số liên hệ để người ta tự sửa. */
const KHOI = [SETTINGS_KEYS.seo] as const;

async function main() {
  const db = await getDb();

  for (const key of KHOI) {
    const [row] = await db.select().from(settings).where(eq(settings.key, key));
    const moi = DEFAULT_SETTINGS[key];

    if (!row) {
      if (GHI) await db.insert(settings).values({ key, value: moi });
      console.log(`${key}: chưa có, ${GHI ? "đã tạo" : "sẽ tạo"}`);
      continue;
    }

    const cu = JSON.stringify(row.value);
    if (cu === JSON.stringify(moi)) {
      console.log(`${key}: đã khớp, không đổi`);
      continue;
    }

    console.log(`${key}: khác nhau`);
    console.log(`  cũ  ${cu}`);
    console.log(`  mới ${JSON.stringify(moi)}`);
    if (GHI) {
      await db.update(settings).set({ value: moi }).where(eq(settings.key, key));
      console.log(`  → đã ghi`);
    }
  }

  if (!GHI) console.log("\nChưa ghi gì. Thêm -- --ghi để ghi thật.");
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
