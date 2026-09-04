import fs from "node:fs";
import path from "node:path";
import { sql } from "drizzle-orm";
import { getDb } from "../src/lib/db";

/**
 * Freezes the published content into a file the site can serve without a
 * database.
 *
 * The site normally runs on PGlite, which is an embedded engine: it owns a
 * directory on disk and needs to write to it. That is fine on this machine and
 * on a normal server, and impossible on a serverless host, where the deployment
 * is read-only and every request may land on a different instance. Rather than
 * make the education arm depend on a hosted Postgres just to show pages whose
 * content changes a few times a year, the content is dumped here and loaded
 * into an in-memory database on boot - see `src/lib/db/index.ts`.
 *
 * Only public tables are dumped. The register of users, their sessions, the
 * enquiries people have sent and the audit log are operational data: they hold
 * password hashes, session tokens and personal contact details, and this file
 * is committed to a public repository, so they are never written here. That is
 * also why the snapshot is a fallback and not the primary store - anything a
 * visitor submits still needs a real database behind it.
 */

/** Everything a visitor can see. Nothing here is personal data. */
const PUBLIC_TABLES = [
  "media",
  "schools",
  "categories",
  "programs",
  "program_media",
  "people",
  "partners",
  "activities",
  "posts",
  "faqs",
  "pages",
  "documents",
  "document_pages",
  "content_blocks",
  "kb_chunks",
  "settings",
] as const;

/**
 * Tables deliberately left out, kept as a list rather than a comment so a new
 * table cannot be forgotten: the script fails if it meets one it has never been
 * told about.
 */
const PRIVATE_TABLES = new Set([
  "_migrations",
  "users",
  "sessions",
  "audit_log",
  "leads",
  "newsletter_subscribers",
  "conversations",
  "messages",
  "unanswered_questions",
  "search_log",
]);

const OUT = path.resolve(process.cwd(), "src", "content", "db-snapshot.json");
const DDL = path.resolve(process.cwd(), "drizzle", "0000_init.sql");

async function main() {
  const db = await getDb();

  const { rows: present } = (await db.execute(
    sql`SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY 1`,
  )) as unknown as { rows: { table_name: string }[] };

  const known = new Set<string>([...PUBLIC_TABLES, ...PRIVATE_TABLES]);
  const unknown = present.map((r) => r.table_name).filter((t) => !known.has(t));
  if (unknown.length) {
    throw new Error(
      `Unknown table(s): ${unknown.join(", ")}.\n` +
        "Add each one to PUBLIC_TABLES or PRIVATE_TABLES in scripts/snapshot.ts.\n" +
        "Defaulting either way would be wrong: a public table left out silently\n" +
        "empties a page, and a private one let in leaks personal data.",
    );
  }

  const tables: Record<string, unknown[]> = {};
  for (const table of PUBLIC_TABLES) {
    const { rows } = (await db.execute(
      sql.raw(`SELECT coalesce(json_agg(t ORDER BY t), '[]'::json) AS rows FROM "${table}" t`),
    )) as unknown as { rows: { rows: unknown[] }[] };
    tables[table] = rows[0].rows;
    console.log(String(tables[table].length).padStart(5), table);
  }

  const snapshot = {
    /**
     * The schema travels with the data: on a serverless host the migration
     * folder is not part of the traced bundle, so the loader cannot read it.
     */
    ddl: fs.readFileSync(DDL, "utf8"),
    takenAt: new Date().toISOString(),
    tables,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(snapshot), "utf8");
  const kb = (fs.statSync(OUT).size / 1024).toFixed(0);
  console.log(`\nWrote ${path.relative(process.cwd(), OUT)} (${kb} KB).`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
