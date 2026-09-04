import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, localePath, t, tList, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { documentDate, findProject, publishedProjects } from "@/content/venture";
import type { VentureBlock } from "@/content/venture-types";
import styles from "./project.module.css";

type Params = Promise<{ locale: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "vi";
  const project = findProject(slug);
  if (!project) return {};
  return {
    title: t(project.name, locale),
    description: t(project.lead, locale),
    alternates: { canonical: `/${locale}/dau-tu/du-an/${slug}` },
  };
}

/**
 * Renders one section of a project.
 *
 * The documents differ from project to project - one has an approved works
 * schedule, another only a land-use table - so a project declares the sections
 * its paperwork supports and this switch draws whichever turn up.
 */
function Block({ block, locale }: { block: VentureBlock; locale: Locale }) {
  const title = t(block.title, locale);

  if (block.kind === "prose") {
    return (
      <section className={styles.block} data-reveal>
        <h2>{title}</h2>
        <div className={styles.blockProse}>
          {tList(block.paragraphs, locale).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>
    );
  }

  if (block.kind === "list") {
    return (
      <section className={styles.block} data-reveal>
        <h2>{title}</h2>
        <ul className={styles.bullets}>
          {tList(block.items, locale).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {block.note ? <p className={styles.note}>{t(block.note, locale)}</p> : null}
      </section>
    );
  }

  if (block.kind === "steps") {
    return (
      <section className={styles.block} data-reveal>
        <h2>{title}</h2>
        <ol className={styles.steps}>
          {block.steps.map((step) => (
            <li key={t(step.when, locale)}>
              <span className={styles.stepWhen}>{t(step.when, locale)}</span>
              <span className={styles.stepWhat}>{t(step.what, locale)}</span>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  if (block.kind === "table") {
    return (
      <section className={styles.block} data-reveal>
        <h2>{title}</h2>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <tbody>
              {block.rows.map((row) => (
                <tr key={t(row.label, locale)}>
                  <th scope="row">{t(row.label, locale)}</th>
                  <td>{t(row.value, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {block.note ? <p className={styles.note}>{t(block.note, locale)}</p> : null}
      </section>
    );
  }

  return (
    <section className={styles.block} data-reveal>
      <h2>{title}</h2>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              {block.columns.map((column) => (
                <th key={t(column, locale)} scope="col">
                  {t(column, locale)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row) => (
              <tr key={t(row[0], locale)}>
                <th scope="row">{t(row[0], locale)}</th>
                <td>{t(row[1], locale)}</td>
                <td>{t(row[2], locale)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {block.note ? <p className={styles.note}>{t(block.note, locale)}</p> : null}
    </section>
  );
}

export default async function VentureProjectPage({ params }: { params: Params }) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const project = findProject(slug);
  if (!project) notFound();

  const dict = getDictionary(locale);
  const path = (href: string) => localePath(locale, href);
  const others = publishedProjects().filter((other) => other.slug !== project.slug);

  return (
    <>
      {/* The photograph is never dimmed; the words carry their own shadow. */}
      <section className={styles.hero}>
        <Image src={project.hero.src} alt="" fill priority sizes="100vw" className={styles.heroImage} />
        <div className={styles.heroText}>
          <p className={styles.kind}>
            {t(project.kind, locale)} · {t(project.location, locale)}
          </p>
          <h1>{t(project.name, locale)}</h1>
          <p className={styles.lead}>{t(project.lead, locale)}</p>
          <p className={styles.stage}>{t(project.stage, locale)}</p>
        </div>
        {t(project.hero.caption, locale) ? (
          <p className={styles.heroCaption}>{t(project.hero.caption, locale)}</p>
        ) : null}
      </section>

      <div className={styles.body}>
        <div className={styles.prose}>
          {tList(project.body, locale).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          {project.parties.length ? (
            <div className={styles.partners}>
              <h2>{dict.venture.partners}</h2>
              <ul>
                {project.parties.map((party) => (
                  <li key={party.name}>
                    <strong>{party.name}</strong>
                    <span>{t(party.role, locale)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <aside className={styles.facts} aria-labelledby="project-facts">
          <h2 id="project-facts">{dict.venture.projectFacts}</h2>
          <dl>
            {project.facts.map((entry) => (
              <div key={t(entry.label, locale)}>
                <dt>{t(entry.label, locale)}</dt>
                <dd>{t(entry.value, locale)}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

      <div className={styles.blocks}>
        {project.blocks.map((block) => (
          <Block key={t(block.title, locale)} block={block} locale={locale} />
        ))}
      </div>

      {project.gallery.length ? (
        <section className={styles.gallery} data-reveal>
          <h2>{dict.venture.gallery}</h2>
          <div className={styles.grid}>
            {project.gallery.map((shot) => (
              <figure key={shot.src}>
                <Image
                  src={shot.src}
                  alt={t(shot.caption, locale)}
                  width={1400}
                  height={900}
                  loading="lazy"
                  sizes="(min-width: 1000px) 46vw, 100vw"
                />
                <figcaption>{t(shot.caption, locale)}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      <section className={styles.sources} data-reveal>
        <h2>{dict.venture.sources}</h2>
        <ul>
          {project.sources.map((source) => (
            <li key={t(source.document, locale)}>
              <span>{t(source.document, locale)}</span>
              <time dateTime={source.date}>{documentDate(source.date, locale)}</time>
            </li>
          ))}
        </ul>
      </section>

      <nav className={styles.more} aria-label={dict.venture.projects}>
        <Link href={path("/dau-tu")} className={styles.back}>
          ← {dict.venture.backToVenture}
        </Link>
        <ul>
          {others.map((other) => (
            <li key={other.slug}>
              <Link href={path(`/dau-tu/du-an/${other.slug}`)}>{t(other.name, locale)} →</Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
