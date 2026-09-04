import Image from "next/image";
import Link from "next/link";
import { localePath, t, type Locale } from "@/lib/i18n/config";
import type { SchoolRow } from "@/lib/queries";
import styles from "./SchoolGrid.module.css";

/**
 * The member schools as a wall of six: three across, twice over.
 *
 * Six is a number that wants to be seen at once. As a stack of rows it read as
 * a list to be scrolled through; as two ranks of three it reads as a network,
 * which is what it is - and each school gets a photograph of its own campus
 * rather than a line of type.
 *
 * The card carries everything the closed row used to: the number, the crest,
 * the name, the city and how many programmes the school actually runs. Nothing
 * is behind an interaction.
 */
export function SchoolGrid({
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
    <ol className={styles.grid}>
      {schools.map((school, index) => {
        const name = t(school.shortName ?? school.name, locale);
        const city = school.city ? t(school.city, locale) : "";

        return (
          <li
            key={school.id}
            data-reveal
            style={{ "--reveal-delay": `${(index % 3) * 90}ms` } as React.CSSProperties}
          >
            <Link
              href={localePath(locale, `/dao-tao/truong/${school.slug}`)}
              className={styles.card}
            >
              <span className={styles.figure}>
                {school.coverPath ? (
                  <Image
                    src={school.coverPath}
                    alt=""
                    width={1400}
                    height={1000}
                    sizes="(min-width: 1100px) 33vw, (min-width: 700px) 50vw, 100vw"
                  />
                ) : null}
                <span className={styles.rank}>{String(index + 1).padStart(2, "0")}</span>
                {school.logoPath ? (
                  <span className={styles.crest}>
                    <Image src={school.logoPath} alt="" width={160} height={160} />
                  </span>
                ) : null}
              </span>

              <span className={styles.body}>
                {city ? <em className={styles.city}>{city}</em> : null}
                <strong className={styles.name}>{name}</strong>
                <span className={styles.foot}>
                  <span className={styles.count}>{countLabel(programCount(school.id))}</span>
                  <span className={styles.arrow} aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M5 12h13M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
