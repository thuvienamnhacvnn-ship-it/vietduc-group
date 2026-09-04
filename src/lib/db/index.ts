// NOTE: no `server-only` here - the CLI scripts in /scripts import this module
// directly. It is never imported from a client component.
import path from "node:path";
import { drizzle as drizzlePglite, type PgliteDatabase } from "drizzle-orm/pglite";
import * as schema from "./schema";

export * as schema from "./schema";
export type Db = PgliteDatabase<typeof schema>;

/**
 * The site runs on PGlite (Postgres compiled to WASM) by default so it needs no
 * database server - this machine cannot run a native Postgres build. Set
 * DATABASE_URL to point at a real Postgres instance in production; the schema
 * and every query are plain Postgres and work unchanged on both.
 */
const DATA_DIR = process.env.PGLITE_DATA_DIR
  ? path.resolve(process.env.PGLITE_DATA_DIR)
  : path.resolve(process.cwd(), "data", "pgdata");

declare global {
  var __vdg_db: Db | undefined;
}

/**
 * True where PGlite cannot keep a data directory: a serverless deployment is
 * read-only and every request may land on a fresh instance, so an embedded
 * engine has nowhere to live. VDG_DB_MODE forces the choice either way.
 */
function snapshotMode(): boolean {
  if (process.env.VDG_DB_MODE === "snapshot") return true;
  if (process.env.VDG_DB_MODE === "pglite") return false;
  return Boolean(process.env.VERCEL);
}

/**
 * True when the database only lives as long as the process that made it, so
 * nothing written to it can be read back later. Callers that accept something
 * from a visitor have to carry it out of the database themselves.
 */
export function dbIsEphemeral(): boolean {
  return !process.env.DATABASE_URL && snapshotMode();
}

async function create(): Promise<Db> {
  if (process.env.DATABASE_URL) {
    const [{ drizzle }, pg] = await Promise.all([
      import("drizzle-orm/node-postgres"),
      import("pg"),
    ]);
    const pool = new pg.default.Pool({ connectionString: process.env.DATABASE_URL });
    return drizzle(pool, { schema }) as unknown as Db;
  }
  const { PGlite } = await import("@electric-sql/pglite");
  if (snapshotMode()) return drizzlePglite(await fromSnapshot(PGlite), { schema });
  await claimDataDir();
  const client = await PGlite.create({ dataDir: DATA_DIR });
  return drizzlePglite(client, { schema });
}

/**
 * Builds the database in memory from the committed content snapshot.
 *
 * The schema and the published rows both come out of src/content/db-snapshot.json
 * (written by `npm run snapshot`), so every query in the app runs against real
 * Postgres and needs no separate code path. What is lost is durability: this
 * copy is per-instance and disappears with it, so anything a visitor writes -
 * an enquiry, a newsletter sign-up - is only as safe as the notification that
 * goes out beside it. Set DATABASE_URL to a hosted Postgres when that matters.
 */
async function fromSnapshot(PGlite: typeof import("@electric-sql/pglite").PGlite) {
  const { default: snapshot } = await import("@/content/db-snapshot.json");
  const client = await PGlite.create();

  for (const statement of snapshot.ddl.split("--> statement-breakpoint")) {
    const trimmed = statement.trim();
    if (trimmed) await client.exec(trimmed);
  }

  const tables = snapshot.tables as Record<string, unknown[]>;
  for (const [table, rows] of Object.entries(tables)) {
    if (!rows.length) continue;
    // jsonb_populate_recordset maps the dumped JSON onto the table's own row
    // type, so column order, jsonb columns and timestamps all come back right
    // without this file having to know a single column name.
    await client.query(
      `INSERT INTO "${table}" SELECT * FROM jsonb_populate_recordset(null::"${table}", $1::jsonb)`,
      [JSON.stringify(rows)],
    );
    // The dump carries its own ids, which leaves each sequence at 1 and makes
    // the next insert collide with row 1.
    await client.query(
      `SELECT setval(pg_get_serial_sequence($1, 'id'), coalesce((SELECT max(id) FROM "${table}"), 1))`,
      [table],
    ).catch(() => {
      /* not every table has a serial id */
    });
  }

  return client;
}

/**
 * PGlite is an embedded engine: the data directory belongs to exactly one
 * process. Two processes opening it - a running `next dev` and a `npm run seed`
 * in another terminal - corrupts it, and the damage only shows up later as
 * "missing chunk number 0 for toast value ...".
 *
 * PGlite does not enforce this on Windows, so this advisory lock does. It
 * records the owning pid and refuses to open when that process is still alive,
 * with a message that says what to do about it.
 */
async function claimDataDir(): Promise<void> {
  const fs = await import("node:fs");
  const lockPath = path.join(DATA_DIR, ".vdg-lock");

  try {
    const raw = fs.readFileSync(lockPath, "utf8");
    const owner = Number(raw.split("\n")[0]);
    if (Number.isInteger(owner) && owner !== process.pid) {
      let alive = false;
      try {
        // Signal 0 tests for existence without touching the process.
        process.kill(owner, 0);
        alive = true;
      } catch {
        alive = false; // stale lock from a process that has since exited
      }
      if (alive) {
        throw new Error(
          `The PGlite data directory at ${DATA_DIR} is already open in process ${owner}.\n` +
            "Stop the dev server before running scripts that write to the database\n" +
            "(npm run db:push, seed, ingest, kb:build), or point PGLITE_DATA_DIR at a\n" +
            "separate directory. Opening it twice corrupts the database.",
        );
      }
    }
  } catch (error) {
    // ENOENT simply means nobody holds the lock.
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      if (error instanceof Error && error.message.includes("already open")) throw error;
    }
  }

  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(lockPath, `${process.pid}\n${new Date().toISOString()}\n`);

  const release = () => {
    try {
      const raw = fs.readFileSync(lockPath, "utf8");
      if (Number(raw.split("\n")[0]) === process.pid) fs.unlinkSync(lockPath);
    } catch {
      /* already gone */
    }
  };
  process.once("exit", release);
  process.once("SIGINT", () => {
    release();
    process.exit(130);
  });
  process.once("SIGTERM", () => {
    release();
    process.exit(143);
  });
}

let pending: Promise<Db> | undefined;

/**
 * Cached across hot reloads in dev; PGlite holds an exclusive lock on its data
 * directory, so a second instance would fail rather than fall back silently.
 */
export async function getDb(): Promise<Db> {
  if (globalThis.__vdg_db) return globalThis.__vdg_db;
  if (!pending) {
    pending = create().then((db) => {
      globalThis.__vdg_db = db;
      return db;
    });
  }
  return pending;
}
