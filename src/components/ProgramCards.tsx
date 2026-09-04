import Image from "next/image";
import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n/config";
import styles from "./ProgramCards.module.css";

export type ProgramCard = {
  slug: string;
  title: string;
  school: string;
  field: string;
  level: string;
  code: string | null;
  /** The campus of the school that runs it - never a stock picture. */
  cover: string | null;
  crest: string | null;
};

/**
 * Featured programmes as cards.
 *
 * The picture on each card is the campus of the school that actually runs the
 * programme, with that school's crest on it: there is no photograph of a
 * "programme", and putting a generic classroom behind one would be decoration
 * pretending to be evidence.
 *
 * The official occupation code stays on the card, because that is the thing
 * that makes the entry checkable against the licence.
 */
export function ProgramCards({
  programs,
  locale,
  codeLabel,
}: {
  programs: ProgramCard[];
  locale: Locale;
  codeLabel: string;
}) {
  return (
    <ol className={styles.grid}>
      {programs.map((program, index) => (
        <li
          key={program.slug}
          data-reveal
          style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}
        >
          <Link href={localePath(locale, `/dao-tao/chuong-trinh/${program.slug}`)} className={styles.card}>
            <span className={styles.media}>
              {program.cover ? (
                <Image
                  src={program.cover}
                  alt=""
                  width={1400}
                  height={1000}
                  sizes="(min-width: 1100px) 30vw, (min-width: 700px) 46vw, 100vw"
                  className={styles.cover}
                />
              ) : (
                <span className={styles.coverFallback} aria-hidden="true" />
              )}

              <span className={styles.level}>{program.level}</span>

              {program.crest ? (
                <span className={styles.crest}>
                  <Image src={program.crest} alt="" width={160} height={160} />
                </span>
              ) : null}
            </span>

            <span className={styles.body}>
              <span className={styles.field}>{program.field}</span>
              <span className={styles.title}>{program.title}</span>
              <span className={styles.school}>{program.school}</span>

              <span className={styles.foot}>
                <span className={styles.code}>
                  <em>{codeLabel}</em>
                  {program.code ?? "—"}
                </span>
                <span className={styles.go} aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M5 12h13M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
