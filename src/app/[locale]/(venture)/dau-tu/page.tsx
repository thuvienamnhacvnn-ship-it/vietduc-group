import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, localePath, t, tList, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import {
  VENTURE_HERO,
  VENTURE_INTRO,
  VENTURE_PARTNERS,
  VENTURE_PROCESS,
  VENTURE_SERVICES,
  documentDate,
  publishedProjects,
} from "@/content/venture";
import { getSiteSettings } from "@/lib/settings";
import { ServicePanels } from "@/components/venture/ServicePanels";
import { ProjectSheets } from "@/components/venture/ProjectSheets";
import { HeroPicture } from "@/components/HeroPicture";
import { HeroVideo } from "@/components/HeroVideo";
import { HeroSocial } from "@/components/HeroSocial";
import styles from "./venture.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "vi";
  return {
    title: t(VENTURE_INTRO.title, locale),
    description: t(VENTURE_INTRO.lead, locale),
    alternates: { canonical: `/${locale}/dau-tu` },
  };
}

export default async function VenturePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);
  const path = (href: string) => localePath(locale, href);
  const projects = publishedProjects();
  const settings = await getSiteSettings();

  return (
    <>
      {/* Full-bleed opening: on this side of the group the photograph carries
          the message and the words sit inside it. */}
      <section className={styles.hero}>
        <div className={styles.heroMedia}>
          {/* The wide rendering on a desktop; on a phone the valley shot, which
              is upright and keeps the mountains behind the building. */}
          <HeroPicture
            wide={{ src: VENTURE_HERO.src, width: 1672, height: 941 }}
            tall={{ src: VENTURE_HERO.mobilePoster, width: 900, height: 1580 }}
            alt=""
            priority
            className={styles.heroImage}
          />
          {/* Phone only: the film runs over the still it opens on. */}
          <HeroVideo
            src={VENTURE_HERO.mobileVideo}
            poster={VENTURE_HERO.mobilePoster}
            className={styles.heroVideo}
          />
        </div>
        <div className={styles.heroText}>
          {/* Phone only: the mark stands above the title, a little over centre,
              the way it does on the gateway. */}
          <Image
            src="/brand/viet-duc-mark.png"
            alt=""
            width={236}
            height={240}
            priority
            className={styles.heroMark}
          />
          <p className={styles.heroEyebrow}>{dict.venture.section}</p>

          {/* Two lines, each animated from its own side. The outer span owns
              the hover split so it does not fight the entrance animation on the
              inner one - two elements, two properties, no conflict. */}
          <h1 className={styles.heroTitle}>
            {tList(VENTURE_INTRO.titleLines, locale).map((line, i) => (
              <span
                key={line}
                className={i === 0 ? styles.lineFromRight : styles.lineFromLeft}
              >
                <span>{line}</span>
              </span>
            ))}
          </h1>

          <p className={styles.heroLead}>{t(VENTURE_INTRO.lead, locale)}</p>
          <HeroSocial locale={locale} social={settings.social} />
        </div>
        <p className={styles.heroCaption}>{t(VENTURE_HERO.caption, locale)}</p>
      </section>

      <section className={styles.intro}>
        <div className={styles.introInner}>
          {tList(VENTURE_INTRO.body, locale).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section id="linh-vuc" className={styles.section} data-reveal>
        <div className={styles.sectionHead}>
          <p className={styles.kicker}>01</p>
          <h2>{dict.venture.services}</h2>
        </div>

        <ServicePanels services={VENTURE_SERVICES} locale={locale} />
      </section>

      <section id="du-an" className={styles.section} data-reveal>
        <div className={styles.sectionHead}>
          <p className={styles.kicker}>02</p>
          <h2>{dict.venture.projects}</h2>
        </div>

        <ProjectSheets
          projects={projects}
          locale={locale}
          moreLabel={dict.common.readMore}
        />
      </section>

      <section id="cach-lam" className={`${styles.section} ${styles.dark}`} data-reveal>
        <div className={styles.sectionHead}>
          <p className={styles.kicker}>03</p>
          <h2>{t(VENTURE_PROCESS.title, locale)}</h2>
        </div>

        <ol className={styles.steps}>
          {VENTURE_PROCESS.steps.map((step, i) => (
            <li key={t(step.name, locale)}>
              <span className={styles.stepNo}>{String(i + 1).padStart(2, "0")}</span>
              <h3>{t(step.name, locale)}</h3>
              <p>{t(step.detail, locale)}</p>
            </li>
          ))}
        </ol>

        <div className={styles.partners}>
          <h3>{dict.venture.partners}</h3>
          <ul>
            {VENTURE_PARTNERS.map((partner) => (
              <li key={partner.name}>
                <strong>{partner.name}</strong>
                <em>{t(partner.role, locale)}</em>
                <span>{t(partner.note, locale)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.cta} data-reveal>
        <div>
          <h2>{dict.venture.contactCta}</h2>
          <p>{dict.venture.documentNote}</p>
        </div>
        <Link href={path("/lien-he")} className={styles.ctaButton}>
          {dict.nav.contact}
        </Link>
      </section>

      <section className={styles.sourceLine} aria-labelledby="venture-sources">
        <h2 id="venture-sources">{dict.venture.sources}</h2>
        <ul>
          {projects.flatMap((project) =>
            project.sources.map((source) => (
              <li key={`${project.slug}-${source.date}-${t(source.document, locale)}`}>
                <span>{t(source.document, locale)}</span>
                <time dateTime={source.date}>{documentDate(source.date, locale)}</time>
              </li>
            )),
          )}
        </ul>
      </section>
    </>
  );
}
