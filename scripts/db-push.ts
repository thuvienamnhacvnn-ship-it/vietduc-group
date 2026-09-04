import fs from "node:fs";
import path from "node:path";
import { sql } from "drizzle-orm";
import { getDb } from "../src/lib/db";

/**
 * Applies the generated SQL migrations.
 *
 * Written by hand rather than using a driver-specific migrator so the same
 * command works against PGlite locally and a real Postgres in production. It is
 * idempotent: every statement is guarded, and already-applied migrations are
 * skipped via the `_migrations` table.
 */

const MIGRATIONS_DIR = path.resolve(process.cwd(), "drizzle");

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
    const statements = body
      .split("--> statement-breakpoint")
      .map((s) => s.trim())
      .filter(Boolean);

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
