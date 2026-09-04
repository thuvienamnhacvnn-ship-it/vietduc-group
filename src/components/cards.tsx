import Image from "next/image";
import Link from "next/link";
import { localePath, t, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { levelLabel } from "@/lib/format";
import type { ActivityRow, ProgramRow, SchoolRow } from "@/lib/queries";
import { Badge } from "./ui";
import styles from "./cards.module.css";

/* -------------------------------------------------------------- schools */

/**
 * Editorial school card: full-bleed photograph, crest, and the facts that make
 * one school different from the next. Used on the home page and the school
 * index; the school page itself uses a different, wider layout on purpose.
 */
export function SchoolCard({
  school,
  locale,
  programCount,
  priority = false,
}: {
  school: SchoolRow;
  locale: Locale;
  programCount?: number;
  priority?: boolean;
}) {
  const dict = getDictionary(locale);
  const name = t(school.shortName ?? school.name, locale);
  const highlights = school.highlights?.[locale] ?? school.highlights?.vi ?? [];

  return (
    <article className={styles.schoolCard} data-reveal>
      <Link
        href={localePath(locale, `/dao-tao/truong/${school.slug}`)}
        className={styles.schoolLink}
      >
        <div className={styles.schoolMedia}>
          <div className={styles.schoolFrame}>
            {school.coverPath ? (
              <Image
                src={school.coverPath}
                alt=""
                width={1400}
                height={1000}
                className={styles.schoolImage}
                sizes="(min-width: 1120px) 33vw, (min-width: 700px) 50vw, 100vw"
                priority={priority}
              />
            ) : (
              <div className={styles.mediaFallback} aria-hidden="true" />
            )}
          </div>
          {school.logoPath ? (
            <Image
              src={school.logoPath}
              alt=""
              width={320}
              height={320}
              className={styles.schoolCrest}
              sizes="72px"
            />
          ) : null}
        </div>

        <div className={styles.schoolBody}>
          <div className={styles.schoolMeta}>
            {school.city ? <span>{t(school.city, locale)}</span> : null}
            {typeof programCount === "number" && programCount > 0 ? (
              <span>
                {programCount} {dict.nav.programs.toLowerCase()}
              </span>
            ) : null}
          </div>
          <h3 className={styles.schoolName}>{name}</h3>
          {school.tagline ? (
            <p className={styles.schoolTagline}>{t(school.tagline, locale)}</p>
          ) : null}
          {highlights.length ? (
            <ul className={styles.schoolHighlights}>
              {highlights.slice(0, 2).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          <span className={styles.schoolCta}>
            {dict.common.readMore}
            <ArrowGlyph />
          </span>
        </div>
      </Link>
    </article>
  );
}

/* ------------------------------------------------------------- programs */

export function ProgramCard({
  program,
  locale,
  schoolName,
  categoryName,
  compact = false,
  action,
}: {
  program: ProgramRow;
  locale: Locale;
  schoolName?: string;
  categoryName?: string;
  compact?: boolean;
  action?: React.ReactNode;
}) {
  const dict = getDictionary(locale);
  const title = t(program.title, locale);

  return (
    <article
      className={`${styles.programCard} ${compact ? styles.programCompact : ""}`}
      data-reveal
    >
      <div className={styles.programTop}>
        <Badge
          tone={
            program.level === "cao_dang"
              ? "burgundy"
              : program.level === "lien_ket"
                ? "navy"
                : "neutral"
          }
        >
          {levelLabel(program.level, locale)}
        </Badge>
        {program.officialCode ? (
          <span className={styles.programCode}>
            {dict.explorer.code} {program.officialCode}
          </span>
        ) : null}
      </div>

      <h3 className={styles.programTitle}>
        <Link href={localePath(locale, `/dao-tao/chuong-trinh/${program.slug}`)}>
          {title}
        </Link>
      </h3>

      <dl className={styles.programFacts}>
        {schoolName ? (
          <div>
            <dt>{dict.explorer.school}</dt>
            <dd>{schoolName}</dd>
          </div>
        ) : null}
        {categoryName ? (
          <div>
            <dt>{dict.explorer.field}</dt>
            <dd>{categoryName}</dd>
          </div>
        ) : null}
        {program.locationCity ? (
          <div>
            <dt>{dict.explorer.location}</dt>
            <dd>{t(program.locationCity, locale)}</dd>
          </div>
        ) : null}
        {program.intakeQuota ? (
          <div>
            <dt>{dict.explorer.quota}</dt>
            <dd>
              {program.intakeQuota}
              {dict.explorer.perYear}
            </dd>
          </div>
        ) : null}
      </dl>

      {action ? <div className={styles.programAction}>{action}</div> : null}
    </article>
  );
}

/* ----------------------------------------------------------- activities */

export function ActivityCard({
  activity,
  locale,
  size = "md",
}: {
  activity: ActivityRow;
  locale: Locale;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <figure
      className={`${styles.activityCard} ${styles[`activity_${size}`]}`}
      data-reveal
    >
      {activity.coverPath ? (
        <Image
          src={activity.coverPath}
          alt=""
          width={1200}
          height={800}
          className={styles.activityImage}
          sizes="(min-width: 1120px) 33vw, (min-width: 700px) 50vw, 100vw"
        />
      ) : (
        <div className={styles.mediaFallback} aria-hidden="true" />
      )}
      <figcaption className={styles.activityCaption}>
        <h3>{t(activity.title, locale)}</h3>
        {activity.description ? <p>{t(activity.description, locale)}</p> : null}
      </figcaption>
    </figure>
  );
}

function ArrowGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path
        d="M5 12h13M13 6l6 6-6 6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
