import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n/config";
import styles from "./FieldBoard.module.css";

export type BoardProgram = { slug: string; title: string; level: string; code: string | null; school: string };
export type BoardField = { slug: string; label: string; count: number; programs: BoardProgram[] };

/**
 * The fields of training, as a board that opens.
 *
 * Closed, each row is a name, a bar drawn to scale against the largest field
 * and the count - so the shape of the whole offer is readable at a glance.
 * Opened, it lists the actual programmes inside that field with their official
 * code, level and school, which is the thing a reader came to find.
 *
 * Built on <details>, so it works before any JavaScript arrives and a browser's
 * own find-in-page can reach the programmes inside a closed row.
 */
export function FieldBoard({
  fields,
  locale,
  unit,
  seeAll,
}: {
  fields: BoardField[];
  locale: Locale;
  unit: string;
  seeAll: string;
}) {
  const largest = Math.max(...fields.map((field) => field.count), 1);

  return (
    <ol className={styles.board}>
      {fields.map((field, index) => (
        <li
          key={field.slug}
          data-reveal
          data-reveal-as="slide"
          style={{ "--reveal-delay": `${index * 45}ms` } as React.CSSProperties}
        >
          <details className={styles.row}>
            <summary
              className={styles.head}
              style={{ "--share": `${Math.round((field.count / largest) * 100)}%` } as React.CSSProperties}
            >
              <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
              <span className={styles.name}>{field.label}</span>
              <span className={styles.leader} aria-hidden="true" />
              <span className={styles.figure}>
                {field.count}
                <em>{unit}</em>
              </span>
              <span className={styles.chevron} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className={styles.bar} aria-hidden="true" />
            </summary>

            <div className={styles.body}>
              <ul className={styles.programs}>
                {field.programs.map((program) => (
                  <li key={program.slug}>
                    <Link href={localePath(locale, `/dao-tao/chuong-trinh/${program.slug}`)}>
                      <span className={styles.programName}>{program.title}</span>
                      <span className={styles.programMeta}>
                        {program.school}
                        {program.code ? ` · ${program.code}` : ""}
                      </span>
                      <span className={styles.programLevel}>{program.level}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              <Link
                href={localePath(locale, `/dao-tao/chuong-trinh?linh-vuc=${field.slug}`)}
                className={styles.seeAll}
              >
                {seeAll}
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M5 12h13M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </details>
        </li>
      ))}
    </ol>
  );
}
