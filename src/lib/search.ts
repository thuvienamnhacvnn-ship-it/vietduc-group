import "server-only";

import { localePath, t, type Locale } from "./i18n/config";
import { fold, tokenize, truncate } from "./text";
import {
  getFaqs,
  getPosts,
  getPrograms,
  getSchools,
  getSourceDocuments,
  getPage,
  getPageSlugs,
} from "./queries";
import { levelLabel } from "./format";

/**
 * Site-wide search across everything a visitor can reach.
 *
 * Deliberately separate from the advisor's retriever: this ranks whole pages
 * for a person scanning a list, where that ranks passages for a model. Sharing
 * one scorer would compromise both.
 */

export type SearchHit = {
  kind: "program" | "school" | "post" | "faq" | "document" | "page";
  title: string;
  excerpt: string;
  href: string;
  meta?: string;
  score: number;
};

type Candidate = Omit<SearchHit, "score"> & { haystack: string };

function scoreCandidate(candidate: Candidate, terms: string[], foldedQuery: string): number {
  const title = fold(candidate.title);
  const body = candidate.haystack;

  let score = 0;
  let matched = 0;

  for (const term of terms) {
    let hit = false;
    if (title.startsWith(term)) {
      score += 6;
      hit = true;
    } else if (title.includes(term)) {
      score += 4;
      hit = true;
    }
    if (body.includes(term)) {
      score += 1;
      hit = true;
    }
    if (hit) matched += 1;
  }

  // Every word of the query has to land somewhere, otherwise a two-word search
  // would return everything that matched only the commoner word.
  if (matched < terms.length) return 0;

  if (title === foldedQuery) score += 10;
  else if (title.includes(foldedQuery)) score += 3;

  return score;
}

export async function searchSite(
  query: string,
  locale: Locale,
  limit = 20,
): Promise<SearchHit[]> {
  const terms = tokenize(query);
  if (!terms.length) return [];
  const foldedQuery = fold(query.trim());

  const [programs, schools, posts, faqs, documents, pageSlugs] = await Promise.all([
    getPrograms(),
    getSchools(),
    getPosts(),
    getFaqs(),
    getSourceDocuments(),
    getPageSlugs(),
  ]);

  const schoolName = new Map(schools.map((s) => [s.id, t(s.shortName ?? s.name, locale)]));
  const candidates: Candidate[] = [];

  for (const program of programs) {
    const title = t(program.title, locale);
    const school = program.schoolId ? (schoolName.get(program.schoolId) ?? "") : "";
    const overview = program.overview ? t(program.overview, locale) : "";
    candidates.push({
      kind: "program",
      title,
      excerpt: overview || school,
      meta: [levelLabel(program.level, locale), program.officialCode].filter(Boolean).join(" · "),
      href: localePath(locale, `/dao-tao/chuong-trinh/${program.slug}`),
      haystack: fold(`${title} ${program.officialCode ?? ""} ${school} ${overview}`),
    });
  }

  for (const school of schools) {
    const title = t(school.name, locale);
    const summary = school.summary ? t(school.summary, locale) : "";
    candidates.push({
      kind: "school",
      title,
      excerpt: summary,
      meta: school.city ? t(school.city, locale) : undefined,
      href: localePath(locale, `/dao-tao/truong/${school.slug}`),
      haystack: fold(`${title} ${school.legalNameEn ?? ""} ${summary} ${school.address ?? ""}`),
    });
  }

  for (const post of posts) {
    const title = t(post.title, locale);
    const excerpt = post.excerpt ? t(post.excerpt, locale) : "";
    const body = post.body ? t(post.body, locale) : "";
    candidates.push({
      kind: "post",
      title,
      excerpt: excerpt || truncate(body, 160),
      href: localePath(locale, `/tin-tuc/${post.slug}`),
      haystack: fold(`${title} ${excerpt} ${body}`),
    });
  }

  for (const faq of faqs) {
    const question = t(faq.question, locale);
    const answer = t(faq.answer, locale);
    candidates.push({
      kind: "faq",
      title: question,
      excerpt: truncate(answer, 180),
      href: localePath(locale, "/dao-tao/cau-hoi-thuong-gap"),
      haystack: fold(`${question} ${answer}`),
    });
  }

  for (const document of documents) {
    const title = t(document.title, locale);
    candidates.push({
      kind: "document",
      title,
      excerpt: document.originalName,
      meta: `${document.pageCount} · ${document.language.toUpperCase()}`,
      href: localePath(locale, "/dao-tao/thu-vien-tai-lieu"),
      haystack: fold(`${title} ${document.originalName}`),
    });
  }

  for (const slug of pageSlugs) {
    const page = await getPage(slug);
    if (!page) continue;
    const title = t(page.title, locale);
    const body = page.body ? t(page.body, locale) : "";
    candidates.push({
      kind: "page",
      title,
      excerpt: truncate(body.replace(/^#+\s*/gm, ""), 180),
      href: localePath(locale, `/${slug}`),
      haystack: fold(`${title} ${body}`),
    });
  }

  return candidates
    .map((candidate) => {
      const { haystack: _haystack, ...rest } = candidate;
      return { ...rest, score: scoreCandidate(candidate, terms, foldedQuery) };
    })
    .filter((hit) => hit.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
