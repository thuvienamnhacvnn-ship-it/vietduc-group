import "server-only";

import { cache } from "react";
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { settings } from "./db/schema";
import {
  DEFAULT_SETTINGS,
  SETTINGS_KEYS,
  type ContactSettings,
  type SeoSettings,
  type SiteSettings,
  type SocialSettings,
} from "./site-config";

/**
 * Settings are read on nearly every render, so they are memoised per request.
 * A missing row falls back to the seed value rather than crashing the page.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const db = await getDb();
    const rows = await db.select().from(settings);
    const byKey = new Map(rows.map((r) => [r.key, r.value]));
    return {
      contact: {
        ...DEFAULT_SETTINGS.contact,
        ...((byKey.get(SETTINGS_KEYS.contact) as Partial<ContactSettings>) ?? {}),
      },
      social: {
        ...DEFAULT_SETTINGS.social,
        ...((byKey.get(SETTINGS_KEYS.social) as Partial<SocialSettings>) ?? {}),
      },
      seo: {
        ...DEFAULT_SETTINGS.seo,
        ...((byKey.get(SETTINGS_KEYS.seo) as Partial<SeoSettings>) ?? {}),
      },
    };
  } catch (error) {
    // The database is unavailable during `next build` on a clean checkout.
    // Rendering with seed settings is correct; failing the build is not.
    console.warn("[settings] falling back to defaults:", (error as Error).message);
    return DEFAULT_SETTINGS;
  }
});

export async function writeSetting(key: string, value: unknown, userId?: number): Promise<void> {
  const db = await getDb();
  const existing = await db.select({ key: settings.key }).from(settings).where(eq(settings.key, key));
  if (existing.length) {
    await db
      .update(settings)
      .set({ value, updatedAt: new Date(), updatedBy: userId ?? null })
      .where(eq(settings.key, key));
  } else {
    await db.insert(settings).values({ key, value, updatedBy: userId ?? null });
  }
}
