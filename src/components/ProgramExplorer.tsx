"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { fmt, getDictionary } from "@/lib/i18n/dictionary";
import { languageLabel, LEVELS, LEVEL_ORDER, levelLabel, MODES, modeLabel } from "@/lib/format";
import { fold } from "@/lib/text";
import type { Locale } from "@/lib/i18n/config";
import { useSavedPrograms, useCompare } from "@/lib/client-store";
import styles from "./ProgramExplorer.module.css";

export type ExplorerProgram = {
  id: number;
  slug: string;
  title: string;
  overview: string;
  schoolSlug: string;
  schoolName: string;
  categorySlug: string;
  categoryName: string;
  level: string;
  levelName: string;
  mode: string;
  modeName: string;
  city: string;
  languages: string[];
  officialCode: string;
  intakeQuota: number | null;
  durationLabel: string;
  intakeSchedule: string;
  tuition: string;
  certificate: string;
  href: string;
};

/** Query-string keys, in Vietnamese so shared links read sensibly. */
const PARAM = {
  q: "tu-khoa",
  field: "linh-vuc",
  level: "trinh-do",
  school: "truong",
  mode: "hinh-thuc",
  language: "ngon-ngu",
  city: "dia-diem",
  sort: "sap-xep",
} as const;

type Filters = {
  q: string;
  field: string;
  level: string;
  school: string;
  mode: string;
  language: string;
  city: string;
  sort: "relevance" | "name" | "level";
};

export function ProgramExplorer({
  locale,
  programs,
  categories,
  schools,
}: {
  locale: Locale;
  programs: ExplorerProgram[];
  categories: { slug: string; label: string }[];
  schools: { slug: string; label: string }[];
}) {
  const dict = getDictionary(locale);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<Filters>(() => ({
    q: searchParams.get(PARAM.q) ?? "",
    field: searchParams.get(PARAM.field) ?? "",
    level: searchParams.get(PARAM.level) ?? "",
    school: searchParams.get(PARAM.school) ?? "",
    mode: searchParams.get(PARAM.mode) ?? "",
    language: searchParams.get(PARAM.language) ?? "",
    city: searchParams.get(PARAM.city) ?? "",
    sort: (searchParams.get(PARAM.sort) as Filters["sort"]) ?? "relevance",
  }));

  const { saved, toggleSaved, isSaved } = useSavedPrograms();
  const { compare, toggleCompare, isCompared, clearCompare } = useCompare();
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // The filter state is mirrored into the URL so a filtered view can be
  // bookmarked, shared and reached by the back button.
  useEffect(() => {
    const query = new URLSearchParams();
    if (filters.q) query.set(PARAM.q, filters.q);
    if (filters.field) query.set(PARAM.field, filters.field);
    if (filters.level) query.set(PARAM.level, filters.level);
    if (filters.school) query.set(PARAM.school, filters.school);
    if (filters.mode) query.set(PARAM.mode, filters.mode);
    if (filters.language) query.set(PARAM.language, filters.language);
    if (filters.city) query.set(PARAM.city, filters.city);
    if (filters.sort !== "relevance") query.set(PARAM.sort, filters.sort);
    const next = query.toString();
    const current = searchParams.toString();
    if (next !== current) {
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
    }
  }, [filters, pathname, router, searchParams]);

  const cities = useMemo(() => {
    const set = new Map<string, string>();
    for (const program of programs) if (program.city) set.set(program.city, program.city);
    return [...set.values()].sort((a, b) => a.localeCompare(b, locale));
  }, [programs, locale]);

  const languages = useMemo(() => {
    const set = new Set<string>();
    for (const program of programs) for (const code of program.languages) set.add(code);
    return [...set];
  }, [programs]);

  const results = useMemo(() => {
    const needle = fold(filters.q.trim());
    const terms = needle.split(/\s+/).filter(Boolean);

    let list = programs.filter((program) => {
      if (filters.field && program.categorySlug !== filters.field) return false;
      if (filters.level && program.level !== filters.level) return false;
      if (filters.school && program.schoolSlug !== filters.school) return false;
      if (filters.mode && program.mode !== filters.mode) return false;
      if (filters.language && !program.languages.includes(filters.language)) return false;
      if (filters.city && program.city !== filters.city) return false;
      if (showSavedOnly && !isSaved(program.slug)) return false;
      if (!terms.length) return true;
      const haystack = fold(
        `${program.title} ${program.officialCode} ${program.schoolName} ${program.categoryName} ${program.overview}`,
      );
      return terms.every((term) => haystack.includes(term));
    });

    if (filters.sort === "name") {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title, locale));
    } else if (filters.sort === "level") {
      list = [...list].sort(
        (a, b) =>
          (LEVEL_ORDER[a.level] ?? 9) - (LEVEL_ORDER[b.level] ?? 9) ||
          a.title.localeCompare(b.title, locale),
      );
    } else if (terms.length) {
      // Relevance with a keyword: a title hit beats a body hit.
      list = [...list].sort((a, b) => {
        const score = (p: ExplorerProgram) => {
          const title = fold(p.title);
          const code = fold(p.officialCode);
          let s = 0;
          for (const term of terms) {
            if (title.startsWith(term)) s += 3;
            else if (title.includes(term)) s += 2;
            if (code.includes(term)) s += 3;
          }
          return s;
        };
        return score(b) - score(a) || a.title.localeCompare(b.title, locale);
      });
    }
    return list;
  }, [programs, filters, showSavedOnly, isSaved, locale]);

  const set = useCallback(
    <K extends keyof Filters>(key: K, value: Filters[K]) =>
      setFilters((current) => ({ ...current, [key]: value })),
    [],
  );

  const clear = () => {
    setFilters({
      q: "",
      field: "",
      level: "",
      school: "",
      mode: "",
      language: "",
      city: "",
      sort: "relevance",
    });
    setShowSavedOnly(false);
  };

  const activeCount =
    Number(Boolean(filters.q)) +
    Number(Boolean(filters.field)) +
    Number(Boolean(filters.level)) +
    Number(Boolean(filters.school)) +
    Number(Boolean(filters.mode)) +
    Number(Boolean(filters.language)) +
    Number(Boolean(filters.city));

  const comparedPrograms = programs.filter((program) => compare.includes(program.slug));

  return (
    <div className="shell">
      <div className={styles.layout}>
        <aside className={styles.filters} aria-label={dict.explorer.filters}>
          <div className={styles.filterHead}>
            <h2>{dict.explorer.filters}</h2>
            {activeCount || showSavedOnly ? (
              <button type="button" onClick={clear} className={styles.clear}>
                {dict.explorer.clearFilters}
              </button>
            ) : null}
          </div>

          <label className={styles.search}>
            <span className="visually-hidden">{dict.explorer.searchPlaceholder}</span>
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.6-3.6" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={filters.q}
              onChange={(event) => set("q", event.target.value)}
              placeholder={dict.explorer.searchPlaceholder}
            />
          </label>

          <Select
            label={dict.explorer.field}
            value={filters.field}
            onChange={(value) => set("field", value)}
            options={categories.map((c) => ({ value: c.slug, label: c.label }))}
            allLabel={dict.common.viewAll}
          />
          <Select
            label={dict.explorer.level}
            value={filters.level}
            onChange={(value) => set("level", value)}
            options={LEVELS.map((value) => ({ value, label: levelLabel(value, locale) }))}
            allLabel={dict.common.viewAll}
          />
          <Select
            label={dict.explorer.school}
            value={filters.school}
            onChange={(value) => set("school", value)}
            options={schools.map((s) => ({ value: s.slug, label: s.label }))}
            allLabel={dict.common.viewAll}
          />
          <Select
            label={dict.explorer.mode}
            value={filters.mode}
            onChange={(value) => set("mode", value)}
            options={MODES.map((value) => ({ value, label: modeLabel(value, locale) }))}
            allLabel={dict.common.viewAll}
          />
          <Select
            label={dict.explorer.location}
            value={filters.city}
            onChange={(value) => set("city", value)}
            options={cities.map((city) => ({ value: city, label: city }))}
            allLabel={dict.common.viewAll}
          />
          <Select
            label={dict.explorer.language}
            value={filters.language}
            onChange={(value) => set("language", value)}
            options={languages.map((code) => ({ value: code, label: languageLabel(code, locale) }))}
            allLabel={dict.common.viewAll}
          />

          {saved.length ? (
            <label className={styles.savedToggle}>
              <input
                type="checkbox"
                checked={showSavedOnly}
                onChange={(event) => setShowSavedOnly(event.target.checked)}
              />
              <span>
                {dict.explorer.savedList} ({saved.length})
              </span>
            </label>
          ) : null}
        </aside>

        <section className={styles.results} aria-live="polite">
          <div className={styles.resultHead}>
            <p className={styles.count}>
              {fmt(dict.common.showingResults, { n: results.length })}
            </p>
            <label className={styles.sort}>
              <span>{dict.explorer.sort}</span>
              <select
                value={filters.sort}
                onChange={(event) => set("sort", event.target.value as Filters["sort"])}
              >
                <option value="relevance">{dict.explorer.sortRelevance}</option>
                <option value="name">{dict.explorer.sortName}</option>
                <option value="level">{dict.explorer.sortLevel}</option>
              </select>
            </label>
          </div>

          {!results.length ? (
            <div className={styles.empty}>
              <p>{dict.common.noResults}</p>
              <button type="button" onClick={clear}>
                {dict.explorer.clearFilters}
              </button>
            </div>
          ) : (
            <ul className={styles.list}>
              {results.map((program) => (
                <li key={program.id} className={styles.row}>
                  <div className={styles.rowMain}>
                    <div className={styles.rowTags}>
                      <span className={styles.levelTag}>{program.levelName}</span>
                      {program.officialCode ? (
                        <span className={styles.codeTag}>
                          {dict.explorer.code} {program.officialCode}
                        </span>
                      ) : null}
                    </div>
                    <h3>
                      <Link href={program.href}>{program.title}</Link>
                    </h3>
                    <p className={styles.rowMeta}>
                      {[program.schoolName, program.categoryName, program.city]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>

                  <div className={styles.rowFacts}>
                    {program.intakeQuota ? (
                      <span>
                        <strong>{program.intakeQuota}</strong>
                        {dict.explorer.perYear}
                      </span>
                    ) : null}
                  </div>

                  <div className={styles.rowActions}>
                    <button
                      type="button"
                      className={isSaved(program.slug) ? styles.iconOn : styles.icon}
                      onClick={() => toggleSaved(program.slug)}
                      aria-pressed={isSaved(program.slug)}
                      title={isSaved(program.slug) ? dict.explorer.saved : dict.explorer.save}
                    >
                      <svg viewBox="0 0 24 24" width="17" height="17" fill={isSaved(program.slug) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                        <path d="M6 4h12v17l-6-4.2L6 21V4Z" strokeLinejoin="round" />
                      </svg>
                      <span className="visually-hidden">
                        {isSaved(program.slug) ? dict.explorer.saved : dict.explorer.save}
                      </span>
                    </button>

                    <button
                      type="button"
                      className={isCompared(program.slug) ? styles.iconOn : styles.icon}
                      onClick={() => toggleCompare(program.slug)}
                      aria-pressed={isCompared(program.slug)}
                      disabled={!isCompared(program.slug) && compare.length >= 3}
                      title={
                        !isCompared(program.slug) && compare.length >= 3
                          ? dict.explorer.compareFull
                          : isCompared(program.slug)
                            ? dict.explorer.compareRemove
                            : dict.explorer.compareAdd
                      }
                    >
                      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                        <path d="M4 7h7M4 12h7M4 17h7M15 7h5M15 12h5M15 17h5" strokeLinecap="round" />
                      </svg>
                      <span className="visually-hidden">{dict.explorer.compare}</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {comparedPrograms.length ? (
        <div className={styles.compareBar} role="region" aria-label={dict.explorer.compare}>
          <ul>
            {comparedPrograms.map((program) => (
              <li key={program.slug}>
                <span>{program.title}</span>
                <button
                  type="button"
                  onClick={() => toggleCompare(program.slug)}
                  aria-label={dict.explorer.compareRemove}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
          <div className={styles.compareActions}>
            <button type="button" className={styles.compareClear} onClick={clearCompare}>
              {dict.common.clear}
            </button>
            <Link
              href={`${pathname}/so-sanh?ma=${comparedPrograms.map((p) => p.slug).join(",")}`}
              className={styles.compareGo}
            >
              {fmt(dict.explorer.compareOpen, { n: comparedPrograms.length })}
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  allLabel,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  allLabel: string;
}) {
  if (!options.length) return null;
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">{allLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
