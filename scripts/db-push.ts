import fs from "node:fs";
import path from "node:path";
import { sql } from "drizzle-orm";
import { napEnv } from "./_env";

napEnv();

const { getDb } = await import("../src/lib/db");

/**
 * Applies the generated SQL migrations.
 *
 * Written by hand rather than using a driver-specific migrator so the same
 * command works against PGlite locally and a real Postgres in production. It is
 * idempotent: every statement is guarded, and already-applied migrations are
 * skipped via the `_migrations` table.
 */

const MIGRATIONS_DIR = path.resolve(process.cwd(), "drizzle");

/**
 * Cắt một tệp SQL thành từng câu lệnh rời.
 *
 * Postgres thật KHÔNG nhận nhiều câu lệnh trong một lần gửi — nó trả về lỗi cú
 * pháp 42601, mà thông báo thì chỉ nói "syntax error" chứ không nói là vì có
 * hai câu lệnh, nên rất dễ đi tìm nhầm chỗ. PGlite thì nuốt cả tệp, nên tệp
 * viết tay chạy ngon ở máy rồi gãy khi đẩy lên Neon.
 *
 * Tệp do drizzle-kit sinh ra đã có sẵn dấu `--> statement-breakpoint`; tệp
 * viết tay thì không, nên phải tự tìm dấu `;` kết câu. Không thể chỉ
 * `split(";")`: dấu chấm phẩy còn nằm trong chuỗi, trong lời chú, và trong
 * thân hàm trích bằng `$$`. Hàm này đọc qua một lượt và chỉ cắt ở dấu `;`
 * thật sự đứng ngoài mọi thứ đó.
 */
function catCauLenh(body: string): string[] {
  if (body.includes("--> statement-breakpoint")) {
    return body.split("--> statement-breakpoint").map((s) => s.trim()).filter(Boolean);
  }

  const cau: string[] = [];
  let dang = "";
  let i = 0;
  while (i < body.length) {
    const c = body[i];
    const doi2 = body.slice(i, i + 2);

    if (doi2 === "--") {
      const het = body.indexOf("\n", i);
      const doan = het === -1 ? body.slice(i) : body.slice(i, het);
      dang += doan;
      i += doan.length;
      continue;
    }
    if (doi2 === "/*") {
      const het = body.indexOf("*/", i + 2);
      const doan = het === -1 ? body.slice(i) : body.slice(i, het + 2);
      dang += doan;
      i += doan.length;
      continue;
    }
    if (c === "'" || c === '"') {
      let j = i + 1;
      while (j < body.length) {
        if (body[j] === "\\") j += 2;
        else if (body[j] === c) { j += 1; break; }
        else j += 1;
      }
      dang += body.slice(i, j);
      i = j;
      continue;
    }
    if (c === "$") {
      const the = /^\$[A-Za-z_]*\$/.exec(body.slice(i));
      if (the) {
        const het = body.indexOf(the[0], i + the[0].length);
        const doan = het === -1 ? body.slice(i) : body.slice(i, het + the[0].length);
        dang += doan;
        i += doan.length;
        continue;
      }
    }
    if (c === ";") {
      cau.push(dang.trim());
      dang = "";
      i += 1;
      continue;
    }
    dang += c;
    i += 1;
  }
  if (dang.trim()) cau.push(dang.trim());

  // Bỏ những mẩu chỉ còn lời chú, không có câu lệnh nào.
  return cau.filter((c) => c.split("\n").some((d) => d.trim() && !d.trim().startsWith("--")));
}

async function main() {
  const db = await getDb();

  await db.execute(
    sql`CREATE TABLE IF NOT EXISTS _migrations (
      name text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )`,
  );

  const applied = new Set(
    (
      (await db.execute(sql`SELECT name FROM _migrations`)) as unknown as {
        rows: { name: string }[];
      }
    ).rows.map((r) => r.name),
  );

  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  let ran = 0;
  for (const file of files) {
    if (applied.has(file)) {
      console.log(`  skip  ${file}`);
      continue;
    }
    const body = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf8");
    const statements = catCauLenh(body);

    for (const statement of statements) {
      try {
        await db.execute(sql.raw(statement));
      } catch (error) {
        const message = (error as Error).message;
        // Re-running a partially applied migration is normal during
        // development; a genuinely new failure still stops the run.
        if (/already exists|duplicate/i.test(message)) continue;
        console.error(`\nFailed in ${file}:\n${statement.slice(0, 300)}\n`);
        throw error;
      }
    }
    await db.execute(sql`INSERT INTO _migrations (name) VALUES (${file})`);
    console.log(`  apply ${file} (${statements.length} statements)`);
    ran += 1;
  }

  console.log(ran ? `\nApplied ${ran} migration(s).` : "\nDatabase already up to date.");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
