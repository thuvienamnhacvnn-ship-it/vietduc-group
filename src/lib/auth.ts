import "server-only";

import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { and, eq, gt } from "drizzle-orm";
import { getDb } from "./db";
import { auditLog, sessions, users, type Role } from "./db/schema";

export { hashPassword, verifyPassword } from "./password";

export const SESSION_COOKIE = "vdg_session";
const SESSION_DAYS = 7;

export type SessionUser = {
  id: number;
  email: string;
  name: string;
  role: Role;
};

export async function createSession(userId: number): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  const db = await getDb();
  await db.insert(sessions).values({ token, userId, expiresAt });
  await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, userId));

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
  return token;
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    const db = await getDb();
    await db.delete(sessions).where(eq(sessions.token, token));
  }
  jar.delete(SESSION_COOKIE);
}

/** Current signed-in editor, or null. Never throws - callers decide. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const db = await getDb();
    const rows = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        active: users.active,
      })
      .from(sessions)
      .innerJoin(users, eq(users.id, sessions.userId))
      .where(and(eq(sessions.token, token), gt(sessions.expiresAt, new Date())))
      .limit(1);

    const user = rows[0];
    if (!user || !user.active) return null;
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  } catch {
    return null;
  }
}

/**
 * Capability check. Each admin action names the capability it needs rather than
 * testing roles inline, so adding a role later touches one table, not 40 files.
 */
export const CAPABILITIES = {
  administrator: [
    "content.read",
    "content.write",
    "content.publish",
    "documents.upload",
    "documents.delete",
    "kb.rebuild",
    "leads.read",
    "leads.write",
    "settings.write",
    "users.manage",
    "conversations.read",
  ],
  content_editor: [
    "content.read",
    "content.write",
    "content.publish",
    "documents.upload",
    "kb.rebuild",
    "conversations.read",
  ],
  admissions_staff: ["content.read", "leads.read", "leads.write", "conversations.read"],
} as const satisfies Record<Role, readonly string[]>;

export type Capability = (typeof CAPABILITIES)[Role][number];

export function can(role: Role, capability: string): boolean {
  return (CAPABILITIES[role] as readonly string[]).includes(capability);
}

/** Throws when the current user may not perform `capability`. */
export async function requireCapability(capability: string): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new AuthError("unauthenticated");
  if (!can(user.role, capability)) throw new AuthError("forbidden");
  return user;
}

export class AuthError extends Error {
  constructor(public readonly kind: "unauthenticated" | "forbidden") {
    super(kind);
    this.name = "AuthError";
  }
}

export async function recordAudit(
  userId: number | null,
  action: string,
  entity: string,
  entityId?: string | null,
  detail?: Record<string, unknown>,
): Promise<void> {
  const db = await getDb();
  await db.insert(auditLog).values({
    userId,
    action,
    entity,
    entityId: entityId ?? null,
    detail: detail ?? null,
  });
}
