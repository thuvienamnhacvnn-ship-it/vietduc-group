import path from "node:path";

/**
 * Nạp `.env.local` cho các lệnh chạy bằng `tsx`.
 *
 * `next dev` và `next build` tự đọc `.env.local`, `tsx` thì không. Mà `getDb()`
 * chọn đích theo đúng một điều kiện: có `DATABASE_URL` thì nối tới Postgres
 * thật, không có thì mở PGlite trong thư mục dữ liệu ở máy.
 *
 * Thiếu bước này thì `seed`, `db:push`, `ingest`, `kb:build` chạy vào cơ sở dữ
 * liệu Ở MÁY trong khi trang web đọc cơ sở dữ liệu THẬT — và chúng vẫn in ra
 * "xong" như thường. Không có gì báo sai; chỉ có nội dung trên web là không đổi,
 * nên người chạy đi tìm nguyên nhân ở chỗ khác. Đã mất một lượt đúng như vậy.
 *
 * PHẢI gọi TRƯỚC khi nạp bất cứ module nào chạm tới `src/lib/db`, vì thân module
 * ấy đọc biến môi trường ngay lúc được nạp. Trong tệp gọi nó, điều đó nghĩa là
 * `import` tĩnh không dùng được cho `db` — phải `await import(...)` sau lời gọi
 * này.
 */
export function napEnv() {
  try {
    process.loadEnvFile(path.resolve(process.cwd(), ".env.local"));
  } catch {
    // Không có tệp thì thôi: khi ấy PGlite ở máy đúng là đích cần đến.
  }
}
