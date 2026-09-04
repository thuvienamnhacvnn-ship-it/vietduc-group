import { and, eq, inArray } from "drizzle-orm";
import { getDb } from "../db";
import { kbChunks, type L10n } from "../db/schema";
import { getEmbeddingProvider } from "../ai";
import { fold, tokenize } from "../text";
import type { Locale } from "../i18n/config";

/**
 * Retrieval over the approved knowledge base.
 *
 * The `status = 'approved'` filter lives here, in the only function that reads
 * chunks, so a draft passage cannot reach the model through some other path.
 *
 * Scoring is hybrid:
 *  - BM25 over diacritic-folded tokens. Deterministic, needs no external
 *    service, and handles Vietnamese queries typed without tone marks.
 *  - Cosine similarity over embeddings, when an embedding provider is
 *    configured and the chunks have been embedded.
 * With both available the scores are combined; with neither, BM25 alone is a
 * perfectly serviceable retriever for a corpus this size.
 */

export type Chunk = {
  id: number;
  sourceRef: string;
  sourceKind: string;
  citation: L10n;
  href: string | null;
  title: string | null;
  body: string;
  language: string;
  pageNumber: number | null;
  documentId: number | null;
};

export type ScoredChunk = Chunk & {
  score: number;
  lexicalScore: number;
  vectorScore: number;
};

const BM25_K1 = 1.4;
const BM25_B = 0.72;

type Indexed = Chunk & { terms: string[]; length: number; embedding: number[] | null };

type Index = {
  docs: Indexed[];
  df: Map<string, number>;
  avgLength: number;
  builtAt: number;
};

let cached: Index | null = null;
let building: Promise<Index> | null = null;

/** Chunks change only when an editor rebuilds the knowledge base. */
export function invalidateIndex(): void {
  cached = null;
  building = null;
}

async function buildIndex(): Promise<Index> {
  const db = await getDb();
  const rows = await db
    .select({
      id: kbChunks.id,
      sourceRef: kbChunks.sourceRef,
      sourceKind: kbChunks.sourceKind,
      citation: kbChunks.citation,
      href: kbChunks.href,
      title: kbChunks.title,
      body: kbChunks.body,
      normalized: kbChunks.normalized,
      language: kbChunks.language,
      pageNumber: kbChunks.pageNumber,
      documentId: kbChunks.documentId,
      embedding: kbChunks.embedding,
    })
    .from(kbChunks)
    .where(eq(kbChunks.status, "approved"));

  const df = new Map<string, number>();
  const docs: Indexed[] = rows.map((row) => {
    const terms = tokenize(`${row.title ?? ""} ${row.normalized || row.body}`);
    for (const term of new Set(terms)) df.set(term, (df.get(term) ?? 0) + 1);
    return {
      id: row.id,
      sourceRef: row.sourceRef,
      sourceKind: row.sourceKind,
      citation: row.citation,
      href: row.href,
      title: row.title,
      body: row.body,
      language: row.language,
      pageNumber: row.pageNumber,
      documentId: row.documentId,
      terms,
      length: terms.length || 1,
      embedding: Array.isArray(row.embedding) ? row.embedding : null,
    };
  });

  const avgLength = docs.length ? docs.reduce((sum, d) => sum + d.length, 0) / docs.length : 1;
  return { docs, df, avgLength, builtAt: Date.now() };
}

async function getIndex(): Promise<Index> {
  if (cached) return cached;
  building ??= buildIndex().then((index) => {
    cached = index;
    building = null;
    return index;
  });
  return building;
}

function idf(index: Index, term: string): number {
  const total = index.docs.length || 1;
  const df = index.df.get(term) ?? 0;
  return Math.log(1 + (total - df + 0.5) / (df + 0.5));
}

type Match = {
  /** BM25 as a fraction of the best score this query could possibly reach. */
  strength: number;
  /**
   * Share of the query's information content that the document actually
   * covers, weighted by idf. This is what separates "related" from "off
   * topic": a question about gold prices matches a couple of common words and
   * misses every rare one, so coverage collapses even though BM25 is non-zero.
   */
  coverage: number;
};

function scoreDoc(index: Index, queryTerms: string[], doc: Indexed): Match {
  const counts = new Map<string, number>();
  for (const term of doc.terms) counts.set(term, (counts.get(term) ?? 0) + 1);

  let score = 0;
  let ideal = 0;
  let matchedWeight = 0;
  let totalWeight = 0;

  for (const term of queryTerms) {
    const termIdf = idf(index, term);
    totalWeight += termIdf;
    // A document saturated with this term approaches idf * (k1 + 1).
    ideal += termIdf * (BM25_K1 + 1);

    const tf = counts.get(term);
    if (!tf) continue;
    matchedWeight += termIdf;
    const denominator = tf + BM25_K1 * (1 - BM25_B + (BM25_B * doc.length) / index.avgLength);
    score += termIdf * ((tf * (BM25_K1 + 1)) / denominator);
  }

  return {
    strength: ideal > 0 ? Math.min(1, score / ideal) : 0,
    coverage: totalWeight > 0 ? matchedWeight / totalWeight : 0,
  };
}

function cosine(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length);
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < n; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export type RetrieveOptions = {
  locale?: Locale;
  limit?: number;
  /** Restrict to chunks derived from these entity kinds. */
  kinds?: string[];
};

export type RetrieveResult = {
  chunks: ScoredChunk[];
  /** 0-1. Below CONFIDENCE_FLOOR the advisor must decline to answer. */
  confidence: number;
  usedVectors: boolean;
  corpusSize: number;
};

/**
 * Below this the retriever is not confident that anything relevant was found,
 * and the advisor says it could not find the information instead of guessing.
 */
export const CONFIDENCE_FLOOR = 0.35;

export async function retrieve(query: string, options: RetrieveOptions = {}): Promise<RetrieveResult> {
  const { locale = "vi", limit = 6, kinds } = options;
  const index = await getIndex();
  if (!index.docs.length) {
    return { chunks: [], confidence: 0, usedVectors: false, corpusSize: 0 };
  }

  const pool = kinds?.length ? index.docs.filter((d) => kinds.includes(d.sourceKind)) : index.docs;
  const queryTerms = tokenize(query);
  if (!queryTerms.length) {
    return { chunks: [], confidence: 0, usedVectors: false, corpusSize: pool.length };
  }

  const lexical = pool.map((doc) => ({ doc, match: scoreDoc(index, queryTerms, doc) }));

  // Vector leg, only when embeddings exist for this corpus.
  let vectorByDoc: Map<number, number> | null = null;
  const provider = getEmbeddingProvider();
  const hasEmbeddings = pool.some((d) => d.embedding?.length);
  if (provider && hasEmbeddings) {
    try {
      const [queryVector] = await provider.embed([query]);
      vectorByDoc = new Map(
        pool.map((doc) => [doc.id, doc.embedding ? cosine(queryVector, doc.embedding) : 0]),
      );
    } catch (error) {
      // A provider outage must degrade to lexical search, not break the page.
      console.warn("[rag] embedding lookup failed, using lexical only:", (error as Error).message);
      vectorByDoc = null;
    }
  }

  const foldedQuery = fold(query);
  const scored: ScoredChunk[] = lexical.map(({ doc, match }) => {
    // Coverage carries most of the weight: a passage that answers the question
    // must contain the words that make the question specific, not just score
    // well on the few common ones.
    const lexicalScore = 0.45 * match.strength + 0.55 * match.coverage;
    const vectorScore = vectorByDoc?.get(doc.id) ?? 0;
    // A small nudge for the reader's own language and for exact phrase hits;
    // both are weak signals, so they adjust rather than dominate the ranking.
    const localeBonus = doc.language === locale ? 0.05 : 0;
    const phraseBonus = foldedQuery.length > 8 && fold(doc.body).includes(foldedQuery) ? 0.12 : 0;
    const blended = vectorByDoc
      ? 0.6 * lexicalScore + 0.4 * Math.max(0, vectorScore)
      : lexicalScore;
    return {
      ...doc,
      lexicalScore,
      vectorScore,
      score: Math.min(1, blended + localeBonus + phraseBonus),
    };
  });

  scored.sort((a, b) => b.score - a.score);
  const top = scored.filter((c) => c.score > 0).slice(0, limit);

  return {
    chunks: top,
    confidence: top[0]?.score ?? 0,
    usedVectors: Boolean(vectorByDoc),
    corpusSize: pool.length,
  };
}

/** Fetches specific chunks by id, still restricted to approved rows. */
export async function getApprovedChunks(ids: number[]): Promise<Chunk[]> {
  if (!ids.length) return [];
  const db = await getDb();
  const rows = await db
    .select()
    .from(kbChunks)
    .where(and(inArray(kbChunks.id, ids), eq(kbChunks.status, "approved")));
  return rows.map((row) => ({
    id: row.id,
    sourceRef: row.sourceRef,
    sourceKind: row.sourceKind,
    citation: row.citation,
    href: row.href,
    title: row.title,
    body: row.body,
    language: row.language,
    pageNumber: row.pageNumber,
    documentId: row.documentId,
  }));
}
