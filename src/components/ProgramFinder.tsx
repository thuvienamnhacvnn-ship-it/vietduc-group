"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { localePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { LEVELS, levelLabel } from "@/lib/format";
import styles from "./ProgramFinder.module.css";

/**
 * The quick finder on the home page. It only ever composes a query string for
 * the explorer, so its result is a real, shareable, indexable URL rather than
 * hidden client state.
 */
export function ProgramFinder({
  locale,
  categories,
  schools,
}: {
  locale: Locale;
  categories: { slug: string; label: string }[];
  schools: { slug: string; label: string }[];
}) {
  const dict = getDictionary(locale);
  const router = useRouter();
  const [field, setField] = useState("");
  const [level, setLevel] = useState("");
  const [school, setSchool] = useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const query = new URLSearchParams();
    if (field) query.set("linh-vuc", field);
    if (level) query.set("trinh-do", level);
    if (school) query.set("truong", school);
    const suffix = query.toString();
    router.push(localePath(locale, `/chuong-trinh${suffix ? `?${suffix}` : ""}`));
  }

  return (
    <form className={styles.finder} onSubmit={submit}>
      <div className={styles.intro}>
        <p className={styles.title}>{dict.home.findProgram}</p>
        <p className={styles.hint}>{dict.home.findProgramHint}</p>
      </div>

      <div className={styles.fields}>
        <label className={styles.field}>
          <span>{dict.explorer.field}</span>
          <select value={field} onChange={(event) => setField(event.target.value)}>
            <option value="">{dict.common.viewAll}</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.label}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>{dict.explorer.level}</span>
          <select value={level} onChange={(event) => setLevel(event.target.value)}>
            <option value="">{dict.common.viewAll}</option>
            {LEVELS.map((value) => (
              <option key={value} value={value}>
                {levelLabel(value, locale)}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>{dict.explorer.school}</span>
          <select value={school} onChange={(event) => setSchool(event.target.value)}>
            <option value="">{dict.common.viewAll}</option>
            {schools.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" className={styles.submit}>
          {dict.nav.search}
        </button>
      </div>
    </form>
  );
}
