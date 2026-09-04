import "server-only";

import { cache } from "react";
import { and, asc, desc, eq, inArray, isNotNull, sql } from "drizzle-orm";
import { getDb } from "./db";
import {
  activities,
  categories,
  documents,
  faqs,
  pages,
  partners,
  posts,
  programs,
  schools,
} from "./db/schema";

/**
 * Read model for the public site.
 *
 * Every function here filters on `status = 'approved'`. Draft and rejected
 * records exist only in the admin area - a programme that is not licence-backed
 * must never appear on a public page just because someone linked to it.
 *
 * Each query is wrapped in `cache()` so a page that needs the school list in
 * three places still hits the database once per request.
 */

export type ProgramRow = typeof programs.$inferSelect;
export type SchoolRow = typeof schools.$inferSelect;
export type CategoryRow = typeof categories.$inferSelect;
export type ActivityRow = typeof activities.$inferSelect;
export type PartnerRow = typeof partners.$inferSelect;
export type FaqRow = typeof faqs.$inferSelect;
export type PostRow = typeof posts.$inferSelect;
export type PageRow = typeof pages.$inferSelect;
export type DocumentRow = typeof documents.$inferSelect;

export const getSchools = cache(async (): Promise<SchoolRow[]> => {
  const db = await getDb();
  return db.select().from(schools).where(eq(schools.status, "approved")).orderBy(asc(schools.order));
});

export const getSchool = cache(async (slug: string): Promise<SchoolRow | null> => {
  const db = await getDb();
  const rows = await db
    .select()
    .from(schools)
    .where(and(eq(schools.slug, slug), eq(schools.status, "approved")))
    .limit(1);
  return rows[0] ?? null;
});

export const getCategories = cache(async (): Promise<CategoryRow[]> => {
  const db = await getDb();
  return db.select().from(categories).orderBy(asc(categories.order));
});

export const getPrograms = cache(async (): Promise<ProgramRow[]> => {
  const db = await getDb();
  return db
    .select()
    .from(programs)
    .where(eq(programs.status, "approved"))
    .orderBy(desc(programs.featured), asc(programs.level), asc(programs.slug));
});

export const getProgram = cache(async (slug: string): Promise<ProgramRow | null> => {
  const db = await getDb();
  const rows = await db
    .select()
    .from(programs)
    .where(and(eq(programs.slug, slug), eq(programs.status, "approved")))
    .limit(1);
  return rows[0] ?? null;
});

export const getFeaturedPrograms = cache(async (limit = 6): Promise<ProgramRow[]> => {
  const all = await getPrograms();
  const featured = all.filter((p) => p.featured);
  return (featured.length ? featured : all).slice(0, limit);
});

export const getProgramsBySchool = cache(async (schoolId: number): Promise<ProgramRow[]> => {
  const all = await getPrograms();
  return all.filter((p) => p.schoolId === schoolId);
});

/**
 * Programmes in the same field, excluding the one being viewed. Falls back to
 * the same school when the field has nothing else, so the section is either
 * genuinely useful or absent - never padded.
 */
export const getRelatedPrograms = cache(
  async (program: ProgramRow, limit = 4): Promise<ProgramRow[]> => {
    const all = await getPrograms();
    const sameField = all.filter(
      (p) => p.id !== program.id && p.categoryId === program.categoryId,
    );
    if (sameField.length >= 2) return sameField.slice(0, limit);
    const sameSchool = all.filter((p) => p.id !== program.id && p.schoolId === program.schoolId);
    return [...sameField, ...sameSchool].slice(0, limit);
  },
);

export const getActivities = cache(async (): Promise<ActivityRow[]> => {
  const db = await getDb();
  return db
    .select()
    .from(activities)
    .where(eq(activities.status, "approved"))
    .orderBy(asc(activities.order));
});

export const getPartners = cache(async (): Promise<PartnerRow[]> => {
  const db = await getDb();
  return db
    .select()
    .from(partners)
    .where(eq(partners.status, "approved"))
    .orderBy(asc(partners.order));
});

export const getFaqs = cache(async (): Promise<FaqRow[]> => {
  const db = await getDb();
  return db.select().from(faqs).where(eq(faqs.status, "approved")).orderBy(asc(faqs.order));
});

export const getPosts = cache(async (limit?: number): Promise<PostRow[]> => {
  const db = await getDb();
  const rows = await db
    .select()
    .from(posts)
    .where(and(eq(posts.status, "approved"), isNotNull(posts.publishedAt)))
    .orderBy(desc(posts.publishedAt));
  return limit ? rows.slice(0, limit) : rows;
});

export const getPost = cache(async (slug: string): Promise<PostRow | null> => {
  const db = await getDb();
  const rows = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.status, "approved")))
    .limit(1);
  return rows[0] ?? null;
});

export const getPage = cache(async (slug: string): Promise<PageRow | null> => {
  const db = await getDb();
  const rows = await db
    .select()
    .from(pages)
    .where(and(eq(pages.slug, slug), eq(pages.status, "approved")))
    .limit(1);
  return rows[0] ?? null;
});

export const getPageSlugs = cache(async (): Promise<string[]> => {
  const db = await getDb();
  const rows = await db.select({ slug: pages.slug }).from(pages).where(eq(pages.status, "approved"));
  return rows.map((r) => r.slug);
});

/** Documents an editor has explicitly marked downloadable. */
export const getPublicDocuments = cache(async (): Promise<DocumentRow[]> => {
  const db = await getDb();
  return db
    .select()
    .from(documents)
    .where(and(eq(documents.status, "approved"), eq(documents.downloadable, true)))
    .orderBy(asc(documents.slug));
});

/** Documents referenced as sources, whether or not they can be downloaded. */
export const getSourceDocuments = cache(async (): Promise<DocumentRow[]> => {
  const db = await getDb();
  return db
    .select()
    .from(documents)
    .where(eq(documents.status, "approved"))
    .orderBy(asc(documents.slug));
});

/** Fire-and-forget view counter used by the programme page. */
export async function recordProgramView(id: number): Promise<void> {
  try {
    const db = await getDb();
    await db
      .update(programs)
      .set({ views: sql`${programs.views} + 1` })
      .where(eq(programs.id, id));
  } catch {
    // A statistics counter must never take a page down.
  }
}

export async function getProgramsByIds(ids: number[]): Promise<ProgramRow[]> {
  if (!ids.length) return [];
  const db = await getDb();
  return db
    .select()
    .from(programs)
    .where(and(inArray(programs.id, ids), eq(programs.status, "approved")));
}

export async function getProgramsBySlugs(slugs: string[]): Promise<ProgramRow[]> {
  if (!slugs.length) return [];
  const db = await getDb();
  return db
    .select()
    .from(programs)
    .where(and(inArray(programs.slug, slugs), eq(programs.status, "approved")));
}
