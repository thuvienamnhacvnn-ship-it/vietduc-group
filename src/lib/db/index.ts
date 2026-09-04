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
  await claimDataDir();
  const client = await PGlite.create({ dataDir: DATA_DIR });
  return drizzlePglite(client, { schema });
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
