import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { fmt, getDictionary } from "@/lib/i18n/dictionary";
import { searchSite, type SearchHit } from "@/lib/search";
import { Breadcrumbs, EmptyState } from "@/components/ui";
import shell from "../page-shell.module.css";
import styles from "./search.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "vi";
  return {
    title: getDictionary(locale).search.title,
    robots: { index: false, follow: true },
  };
}

const GROUPS: SearchHit["kind"][] = ["program", "school", "faq", "post", "page", "document"];

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const hits = query.length >= 2 ? await searchSite(query, locale, 60) : [];

  const label: Record<SearchHit["kind"], string> = {
    program: dict.search.inPrograms,
    school: dict.search.inSchools,
    faq: dict.search.inFaqs,
    post: dict.search.inPosts,
    page: dict.nav.about,
    document: dict.search.inDocuments,
  };

  return (
    <div className={shell.page}>
      <div className="shell">
        <Breadcrumbs locale={locale} trail={[{ label: dict.search.title }]} />
        <header className={shell.header}>
          <h1>{dict.search.title}</h1>
          <form action="" method="get" className={styles.form} role="search">
            <label htmlFor="site-search" className="visually-hidden">
              {dict.search.placeholder}
            </label>
            <input
              id="site-search"
              type="search"
              name="q"
              defaultValue={query}
              placeholder={dict.search.placeholder}
            />
            <button type="submit">{dict.nav.search}</button>
          </form>
        </header>

        {query.length < 2 ? (
          <p className={styles.hint}>{dict.search.hint}</p>
        ) : !hits.length ? (
          <EmptyState title={dict.common.noResults} hint={query} />
        ) : (
          <>
            <p className={styles.count}>{fmt(dict.common.showingResults, { n: hits.length })}</p>
            {GROUPS.map((kind) => {
              const group = hits.filter((hit) => hit.kind === kind);
              if (!group.length) return null;
              return (
                <section key={kind} className={styles.group}>
                  <h2>{label[kind]}</h2>
                  <ul>
                    {group.map((hit) => (
                      <li key={`${hit.kind}-${hit.href}`}>
                        <Link href={hit.href}>
                          <span className={styles.title}>{hit.title}</span>
                          {hit.meta ? <span className={styles.meta}>{hit.meta}</span> : null}
                          <span className={styles.excerpt}>{hit.excerpt}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
