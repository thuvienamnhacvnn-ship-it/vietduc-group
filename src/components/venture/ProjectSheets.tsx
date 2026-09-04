import Image from "next/image";
import Link from "next/link";
import { localePath, t, type Locale } from "@/lib/i18n/config";
import type { VentureProject } from "@/content/venture-types";
import styles from "./ProjectSheets.module.css";

/**
 * The projects as sheets from a dossier.
 *
 * Each one takes a full band of the page and alternates side, so scrolling the
 * section swings left and right rather than running down a column of equal
 * cards. The figures are set as the largest type in the band: on this side of
 * the group the numbers - hectares, rooms, density - are the argument, so they
 * are given the weight a headline usually gets.
 *
 * The picture is never dimmed; the sheet sits beside it on the page's own
 * ground, with a gold rule tying the two together.
 */
export function ProjectSheets({
  projects,
  locale,
  moreLabel,
}: {
  projects: VentureProject[];
  locale: Locale;
  moreLabel: string;
}) {
  return (
    <ol className={styles.sheets}>
      {projects.map((project, index) => (
        <li key={project.slug} className={styles.sheet} data-reveal>
          <Link
            href={localePath(locale, `/dau-tu/du-an/${project.slug}`)}
            className={styles.link}
          >
            <span className={styles.frame}>
              <Image
                src={project.hero.src}
                alt=""
                width={1400}
                height={900}
                sizes="(min-width: 960px) 52vw, 100vw"
                className={styles.image}
              />
              <span className={styles.rule} aria-hidden="true" />
            </span>

            <span className={styles.text}>
              <span className={styles.head}>
                <span className={styles.no}>{String(index + 1).padStart(2, "0")}</span>
                <span className={styles.kind}>
                  {t(project.kind, locale)} · {t(project.location, locale)}
                </span>
              </span>

              <span className={styles.name}>{t(project.name, locale)}</span>
              <span className={styles.stage}>{t(project.stage, locale)}</span>
              <span className={styles.lead}>{t(project.lead, locale)}</span>

              {project.facts.length ? (
                <span className={styles.figures}>
                  {project.facts.slice(0, 3).map((fact) => (
                    <span key={t(fact.label, locale)}>
                      <em>{t(fact.value, locale)}</em>
                      <small>{t(fact.label, locale)}</small>
                    </span>
                  ))}
                </span>
              ) : null}

              <span className={styles.more}>
                {moreLabel}
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M5 12h13M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
