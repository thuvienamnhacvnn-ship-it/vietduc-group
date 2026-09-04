import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n/config";
import styles from "./FieldBoard.module.css";

export type BoardField = { slug: string; label: string; count: number };

/**
 * The fields of training, set as a board rather than as cards.
 *
 * No emblems and no pictograms: a field is a set of licensed occupations, and
 * the honest way to show its weight is the count itself. Each row is a name, a
 * leader of dots, and the figure - the typography of a contents page or a
 * departure board, which is what this is.
 *
 * The bar under each row is drawn to scale against the largest field, so the
 * shape of the whole offer is readable at a glance without a chart library.
 */
export function FieldBoard({
  fields,
  locale,
  unit,
  tone = "light",
}: {
  fields: BoardField[];
  locale: Locale;
  unit: string;
  tone?: "light" | "dark";
}) {
  const largest = Math.max(...fields.map((field) => field.count), 1);

  return (
    <ol className={`${styles.board} ${tone === "dark" ? styles.onDark : ""}`}>
      {fields.map((field, index) => (
        <li
          key={field.slug}
          data-reveal
          data-reveal-as="slide"
          style={{ "--reveal-delay": `${index * 55}ms` } as React.CSSProperties}
        >
          <Link
            href={localePath(locale, `/dao-tao/chuong-trinh?linh-vuc=${field.slug}`)}
            className={styles.row}
            style={{ "--share": `${Math.round((field.count / largest) * 100)}%` } as React.CSSProperties}
          >
            <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
            <span className={styles.name}>{field.label}</span>
            <span className={styles.leader} aria-hidden="true" />
            <span className={styles.figure}>
              {field.count}
              <em>{unit}</em>
            </span>
            <span className={styles.bar} aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ol>
  );
}
