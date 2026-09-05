import { eq, inArray } from "drizzle-orm";
import { getDb } from "../db";
import {
  activities,
  contentBlocks,
  documents,
  faqs,
  kbChunks,
  pages,
  partners,
  posts,
  programs,
  schools,
  type L10n,
} from "../db/schema";
import { getEmbeddingProvider } from "../ai";
import { estimateTokens, fold, splitIntoPassages, tidy } from "../text";
import { invalidateIndex } from "./retrieve";

/**
 * Rebuilds the knowledge base from everything an editor has approved.
 *
 * Sources of truth, in order of trust:
 *  1. Published CMS entities (schools, programmes, FAQs, pages, activities) -
 *     these were reviewed by a person and carry document provenance.
 *  2. Content blocks extracted from PDFs that an editor explicitly approved.
 *
 * Draft, pending and rejected records are never chunked, so they cannot reach
 * the advisor even by accident.
 */

type Draft = {
  sourceRef: string;
  sourceKind: string;
  citation: L10n;
  href: string | null;
  language: string;
  title: string | null;
  body: string;
  documentId?: number | null;
  pageNumber?: number | null;
};

const LEVEL_LABEL: Record<string, L10n> = {
  cao_dang: { vi: "Cao đẳng", en: "College", de: "College" },
  trung_cap: { vi: "Trung cấp", en: "Intermediate", de: "Fachschule" },
  so_cap: { vi: "Sơ cấp", en: "Elementary", de: "Grundstufe" },
  lien_ket: { vi: "Liên kết quốc tế", en: "International partnership", de: "Internationale Kooperation" },
};

function pick(field: L10n | null | undefined, locale: "vi" | "en" | "de"): string {
  if (!field) return "";
  return (field[locale] ?? field.vi ?? "").trim();
}

function citationFor(base: string, locale: "vi" | "en" | "de", page?: number | null): L10n {
  const pageWord = pick({ vi: "trang", en: "page", de: "Seite" }, locale);
  return { [locale]: page ? `${base}, ${pageWord} ${page}` : base } as unknown as L10n;
}

/** One chunk set per language, so a German reader is cited German text. */
const LOCALES = ["vi", "en", "de"] as const;

export async function collectDrafts(): Promise<Draft[]> {
  const db = await getDb();
  const drafts: Draft[] = [];

  const docRows = await db.select().from(documents);
  const docTitle = new Map(docRows.map((d) => [d.id, d.title]));
  const docSlugTitle = new Map(docRows.map((d) => [d.slug, d.title]));

  /* -------------------------------------------------------------- schools */
  const schoolRows = await db.select().from(schools).where(eq(schools.status, "approved"));
  for (const school of schoolRows) {
    for (const locale of LOCALES) {
      const name = pick(school.name, locale);
      if (!name) continue;
      const lines = [
        pick(school.tagline, locale),
        pick(school.summary, locale),
        school.address ? `Địa chỉ / Address: ${school.address}` : "",
        school.phone ? `Điện thoại / Phone: ${school.phone}` : "",
        school.email ? `Email: ${school.email}` : "",
        school.website ? `Website: ${school.website}` : "",
        (school.highlights?.[locale] ?? school.highlights?.vi ?? []).map((h) => `- ${h}`).join("\n"),
        (school.legalRefs ?? [])
          .map((ref) => `- ${pick(ref.label, locale)}: ${ref.number} (${ref.date}) — ${pick(ref.issuer, locale)}`)
          .join("\n"),
        (school.stats ?? []).map((s) => `- ${s.value} ${pick(s.label, locale)}`).join("\n"),
      ].filter(Boolean);

      const sourceTitle = school.provenance?.source
        ? docSlugTitle.get(school.provenance.source)
        : undefined;
      const base = sourceTitle ? pick(sourceTitle, locale) : "Hồ sơ năng lực Việt Đức Group";

      drafts.push({
        sourceRef: `school:${school.id}`,
        sourceKind: "school",
        citation: citationFor(base, locale, school.provenance?.page),
        href: `/${locale}/truong/${school.slug}`,
        language: locale,
        title: name,
        body: tidy([name, ...lines].join("\n")),
        pageNumber: school.provenance?.page ?? null,
      });
    }
  }

  /* ------------------------------------------------------------- programs */
  const programRows = await db.select().from(programs).where(eq(programs.status, "approved"));
  const schoolById = new Map(schoolRows.map((s) => [s.id, s]));
  for (const program of programRows) {
    for (const locale of LOCALES) {
      const title = pick(program.title, locale);
      if (!title) continue;
      const school = program.schoolId ? schoolById.get(program.schoolId) : undefined;
      const lines = [
        school ? `${pick({ vi: "Trường", en: "School", de: "Schule" }, locale)}: ${pick(school.name, locale)}` : "",
        `${pick({ vi: "Trình độ", en: "Level", de: "Niveau" }, locale)}: ${pick(LEVEL_LABEL[program.level], locale)}`,
        program.officialCode
          ? `${pick({ vi: "Mã ngành/nghề", en: "Official code", de: "Amtlicher Code" }, locale)}: ${program.officialCode}`
          : "",
        program.intakeQuota
          ? `${pick({ vi: "Quy mô tuyển sinh", en: "Annual intake quota", de: "Aufnahmekapazität" }, locale)}: ${program.intakeQuota}/${pick({ vi: "năm", en: "year", de: "Jahr" }, locale)}`
          : "",
        program.locationCity
          ? `${pick({ vi: "Địa điểm", en: "Location", de: "Standort" }, locale)}: ${pick(program.locationCity, locale)}`
          : "",
        pick(program.overview, locale),
        (program.careers?.[locale] ?? program.careers?.vi ?? []).map((c) => `- ${c}`).join("\n"),
      ].filter(Boolean);

      const sourceTitle = program.provenance?.source
        ? docSlugTitle.get(program.provenance.source)
        : undefined;
      const base = sourceTitle ? pick(sourceTitle, locale) : "Hồ sơ năng lực Việt Đức Group";

      drafts.push({
        sourceRef: `program:${program.id}`,
        sourceKind: "program",
        citation: citationFor(base, locale, program.provenance?.page),
        href: `/${locale}/chuong-trinh/${program.slug}`,
        language: locale,
        title,
        body: tidy([title, ...lines].join("\n")),
        pageNumber: program.provenance?.page ?? null,
      });
    }
  }

  /* ----------------------------------------------------------------- FAQs */
  const faqRows = await db.select().from(faqs).where(eq(faqs.status, "approved"));
  for (const faq of faqRows) {
    for (const locale of LOCALES) {
      const question = pick(faq.question, locale);
      const answer = pick(faq.answer, locale);
      if (!question || !answer) continue;
      const sourceTitle = faq.provenance?.source ? docSlugTitle.get(faq.provenance.source) : undefined;
      const base = sourceTitle ? pick(sourceTitle, locale) : "Câu hỏi thường gặp – Việt Đức Group";
      drafts.push({
        sourceRef: `faq:${faq.id}`,
        sourceKind: "faq",
        citation: citationFor(base, locale, faq.provenance?.page),
        href: `/${locale}/cau-hoi-thuong-gap`,
        language: locale,
        title: question,
        body: `${question}\n${answer}`,
        pageNumber: faq.provenance?.page ?? null,
      });
    }
  }

  /* ---------------------------------------------------------------- pages */
  const pageRows = await db.select().from(pages).where(eq(pages.status, "approved"));
  for (const page of pageRows) {
    for (const locale of LOCALES) {
      const title = pick(page.title, locale);
      const body = pick(page.body, locale);
      if (!title || !body) continue;
      for (const [i, passage] of splitIntoPassages(body, 900, 120).entries()) {
        drafts.push({
          sourceRef: `page:${page.id}#${i}`,
          sourceKind: "page",
          citation: { [locale]: `${title} — vietducgroup` } as unknown as L10n,
          href: `/${locale}/${page.slug}`,
          language: locale,
          title,
          body: passage,
        });
      }
    }
  }

  /* ----------------------------------------------------------- activities */
  const activityRows = await db.select().from(activities).where(eq(activities.status, "approved"));
  for (const activity of activityRows) {
    for (const locale of LOCALES) {
      const title = pick(activity.title, locale);
      const description = pick(activity.description, locale);
      if (!title) continue;
      const sourceTitle = activity.provenance?.source
        ? docSlugTitle.get(activity.provenance.source)
        : undefined;
      const base = sourceTitle ? pick(sourceTitle, locale) : "Hồ sơ năng lực Việt Đức Group";
      drafts.push({
        sourceRef: `activity:${activity.id}`,
        sourceKind: "activity",
        citation: citationFor(base, locale, activity.provenance?.page),
        href: `/${locale}/hoat-dong`,
        language: locale,
        title,
        body: `${title}\n${description}`,
        pageNumber: activity.provenance?.page ?? null,
      });
    }
  }

  /* ------------------------------------------------------------- partners */
  const partnerRows = await db.select().from(partners).where(eq(partners.status, "approved"));
  if (partnerRows.length) {
    for (const locale of LOCALES) {
      const listing = partnerRows
        .map((p) => `- ${p.name}${p.country ? ` (${p.country})` : ""}`)
        .join("\n");
      const heading = pick({ vi: "Đối tác của Việt Đức Group", en: "Viet Duc Group partners", de: "Partner der Viet Duc Group" }, locale);
      drafts.push({
        sourceRef: "partners:index",
        sourceKind: "partner",
        citation: citationFor("Hồ sơ năng lực Việt Đức Group", locale, 22),
        href: `/${locale}/doi-tac`,
        language: locale,
        title: heading,
        body: `${heading}\n${listing}`,
        pageNumber: 22,
      });
    }
  }

  /* ---------------------------------------------------------------- posts */
  const postRows = await db.select().from(posts).where(eq(posts.status, "approved"));
  for (const post of postRows) {
    for (const locale of LOCALES) {
      const title = pick(post.title, locale);
      const body = pick(post.body, locale) || pick(post.excerpt, locale);
      if (!title || !body) continue;
      for (const [i, passage] of splitIntoPassages(body, 900, 120).entries()) {
        drafts.push({
          sourceRef: `post:${post.id}#${i}`,
          sourceKind: "post",
          citation: { [locale]: `${title} — vietducgroup` } as unknown as L10n,
          href: `/${locale}/tin-tuc/${post.slug}`,
          language: locale,
          title,
          body: passage,
        });
      }
    }
  }

  /* -------------------------------------------- editor-approved PDF blocks */
  const blockRows = await db.select().from(contentBlocks).where(eq(contentBlocks.status, "approved"));
  const usedDocIds = [...new Set(blockRows.map((b) => b.documentId).filter((id): id is number => id != null))];
  const approvedDocs = usedDocIds.length
    ? await db.select({ id: documents.id, status: documents.status }).from(documents).where(inArray(documents.id, usedDocIds))
    : [];
  const docApproved = new Set(approvedDocs.filter((d) => d.status === "approved").map((d) => d.id));

  for (const block of blockRows) {
    // Belt and braces: an approved block inside a document that was later
    // withdrawn must not stay in the knowledge base.
    if (block.documentId && !docApproved.has(block.documentId)) continue;
    if (block.injectionFlag) continue;
    const title = block.documentId ? docTitle.get(block.documentId) : undefined;
    const locale = (LOCALES as readonly string[]).includes(block.language)
      ? (block.language as "vi" | "en" | "de")
      : "vi";
    const base = title ? pick(title, locale) : "Tài liệu Việt Đức Group";
    for (const [i, passage] of splitIntoPassages(block.body, 900, 120).entries()) {
      drafts.push({
        sourceRef: `block:${block.id}#${i}`,
        sourceKind: "document",
        citation: citationFor(base, locale, block.pageNumber),
        href: `/${locale}/thu-vien-tai-lieu`,
        language: locale,
        title: block.heading,
        body: passage,
        documentId: block.documentId,
        pageNumber: block.pageNumber,
      });
    }
  }

  return drafts;
}

export type BuildReport = {
  chunks: number;
  embedded: number;
  embeddingModel: string | null;
  byKind: Record<string, number>;
};

/**
 * Replaces the knowledge base wholesale. Embedding is best-effort: if the
 * provider is missing or fails, chunks are still written and retrieval falls
 * back to lexical scoring.
 */
export async function rebuildKnowledgeBase(): Promise<BuildReport> {
  const db = await getDb();
  const drafts = await collectDrafts();

  await db.delete(kbChunks);

  const provider = getEmbeddingProvider();
  let embedded = 0;

  const rows = drafts.map((draft) => ({
    sourceRef: draft.sourceRef,
    sourceKind: draft.sourceKind,
    documentId: draft.documentId ?? null,
    pageNumber: draft.pageNumber ?? null,
    citation: draft.citation,
    href: draft.href,
    language: draft.language,
    title: draft.title,
    body: draft.body,
    normalized: fold(`${draft.title ?? ""} ${draft.body}`),
    tokenCount: estimateTokens(draft.body),
    embedding: null as number[] | null,
    embeddingModel: null as string | null,
    status: "approved" as const,
  }));

  if (provider && rows.length) {
    const BATCH = 64;
    try {
      for (let i = 0; i < rows.length; i += BATCH) {
        const batch = rows.slice(i, i + BATCH);
        const vectors = await provider.embed(batch.map((r) => r.body));
        batch.forEach((row, j) => {
          if (vectors[j]) {
            row.embedding = vectors[j];
            row.embeddingModel = provider.model;
            embedded += 1;
          }
        });
      }
    } catch (error) {
      console.warn(
        `[kb] embedding failed after ${embedded} chunks, keeping lexical index:`,
        (error as Error).message,
      );
    }
  }

  const CHUNK_INSERT = 100;
  for (let i = 0; i < rows.length; i += CHUNK_INSERT) {
    await db.insert(kbChunks).values(rows.slice(i, i + CHUNK_INSERT));
  }

  invalidateIndex();

  const byKind: Record<string, number> = {};
  for (const row of rows) byKind[row.sourceKind] = (byKind[row.sourceKind] ?? 0) + 1;

  return {
    chunks: rows.length,
    embedded,
    embeddingModel: provider?.model ?? null,
    byKind,
  };
}
