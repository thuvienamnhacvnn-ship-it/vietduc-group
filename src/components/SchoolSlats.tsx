import Image from "next/image";
import Link from "next/link";
import { localePath, t, type Locale } from "@/lib/i18n/config";
import type { SchoolRow } from "@/lib/queries";
import styles from "./SchoolSlats.module.css";

/**
 * The member schools as a stack of slats.
 *
 * The form comes from the buildings themselves: every campus in the group's
 * photographs is faced with horizontal louvres, so the network is drawn the
 * same way - six bands lying on top of one another, each one opening as it is
 * pointed at. Reading down the stack is reading down a facade.
 *
 * What opens is the photograph, not a caption: the closed state already carries
 * the crest, the name, the city and the number of programmes, so nothing is
 * hidden behind an interaction. On a phone the slats simply sit open.
 */
export function SchoolSlats({
  schools,
  locale,
  countLabel,
  programCount,
}: {
  schools: SchoolRow[];
  locale: Locale;
  countLabel: (count: number) => string;
  programCount: (schoolId: number) => number;
}) {
  return (
    <ol className={styles.stack}>
      {schools.map((school, index) => {
        const name = t(school.shortName ?? school.name, locale);
        const city = school.city ? t(school.city, locale) : "";
        const count = programCount(school.id);

        return (
          <li
            key={school.id}
            data-reveal
            data-reveal-as="slide"
            style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}
          >
            <Link
              href={localePath(locale, `/dao-tao/truong/${school.slug}`)}
              className={styles.slat}
            >
              <span className={styles.rank}>{String(index + 1).padStart(2, "0")}</span>

              {school.logoPath ? (
                <span className={styles.crest}>
                  <Image src={school.logoPath} alt="" width={160} height={160} />
                </span>
              ) : null}

              <span className={styles.text}>
                <strong>{name}</strong>
                {city ? <em>{city}</em> : null}
              </span>

              <span className={styles.count}>{countLabel(count)}</span>

              {/* The picture is the slat opening: it grows from the right edge
                  and is never dimmed. */}
              <span className={styles.reveal} aria-hidden="true">
                {school.coverPath ? (
                  <Image
                    src={school.coverPath}
                    alt=""
                    width={1400}
                    height={1000}
                    sizes="(min-width: 1000px) 50vw, 100vw"
                  />
                ) : null}
              </span>

              <span className={styles.arrow} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M5 12h13M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
