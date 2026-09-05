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
import { PhotoWall } from "@/components/PhotoWall";
import { PhotoMarquee } from "@/components/PhotoMarquee";
import { khoAnh } from "@/content/kho-media";
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
  /* Ảnh hiện trường lấy từ kho tiếp nhận; chưa có ảnh thì cả mục không dựng. */
  const siteShots = khoAnh("investment");

  /*
   * Băng ảnh dưới banner: CHỈ ảnh chụp và phối cảnh.
   *
   * Thư mục hospitality còn có mười ba bản vẽ mặt bằng, vị trí và phân khu —
   * đó là tài liệu kỹ thuật, đưa vào một băng ảnh đang trôi thì vừa không đọc
   * được vừa làm hỏng cả dải. Chúng vẫn nằm đầy đủ ở trang chi tiết từng dự án.
   */
  const marquee = [
    "/media/hospitality/bo-trach-exterior.webp",
    "/media/hospitality/bo-trach-aerial-fields.webp",
    "/media/hospitality/bo-trach-pool-night.webp",
    "/media/hospitality/bo-trach-terrace.webp",
    ...siteShots,
  ];

  return (
    <>
      {/* Full-bleed opening: on this side of the group the photograph carries
          the message and the words sit inside it. */}
      <section className={styles.hero}>
        <div className={styles.heroMedia}>
          {/*
            Máy tính dùng bản rộng; điện thoại dùng ảnh thung lũng dựng đứng.

            Ảnh dựng đứng là ảnh tĩnh GỐC, không phải khung cắt từ video. Khung
            cắt ra từ bản video đã nén mờ hơn hẳn — 95 KB so với 299 KB ở cùng
            khổ — mà đó lại đúng là ảnh người xem nhìn thấy suốt lúc video chưa
            tải xong, hoặc mãi mãi nếu trình duyệt từ chối tự phát.
          */}
          <HeroPicture
            wide={{ src: VENTURE_HERO.src, width: 1672, height: 941 }}
            tall={{ src: VENTURE_HERO.mobileSrc, width: 941, height: 1672 }}
            alt=""
            priority
            className={styles.heroImage}
          />
          {/* Phone only: the film runs over the still it opens on. */}
          <HeroVideo
            src={VENTURE_HERO.mobileVideo}
            poster={VENTURE_HERO.mobileSrc}
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

      {/* Ngay dưới banner là hình ảnh, không phải một khối chữ. Đoạn chữ vốn
          nằm đây nói về cách trích số liệu từ hồ sơ — nó thuộc về mục "Cách
          làm" ở dưới, và đã được chuyển xuống đó. */}
      <section className={styles.marqueeSection} aria-label={dict.venture.projects}>
        <PhotoMarquee
          shots={marquee}
          alt={
            {
              vi: "Dự án khách sạn, khu nghỉ dưỡng và công trường của Việt Đức Group",
              en: "Viet Duc Group hotel, resort and construction projects",
              de: "Hotel-, Resort- und Bauprojekte der Viet Duc Group",
            }[locale]
          }
          seconds={marquee.length > 12 ? 80 : 55}
        />
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

      {/*
        Ảnh công trường của mảng đầu tư. Tiêu đề chỉ nói đúng những gì trong
        ảnh — chưa xác định được các ảnh này thuộc dự án nào, và đặt tên một dự
        án mà không biết chắc thì tệ hơn là không đặt tên.
      */}
      {siteShots.length ? (
        <section id="hien-truong" className={styles.section} data-reveal>
          <div className={styles.sectionHead}>
            <p className={styles.kicker}>03</p>
            <h2>
              {
                {
                  vi: "Ngoài hiện trường",
                  en: "On site",
                  de: "Vor Ort",
                }[locale]
              }
            </h2>
          </div>
          <PhotoWall
            shots={siteShots.map((src) => ({
              src,
              alt: {
                vi: "Hiện trường hoạt động đầu tư của Việt Đức Group",
                en: "A Viet Duc Group investment site",
                de: "Ein Investitionsstandort der Viet Duc Group",
              }[locale],
            }))}
            limit={siteShots.length}
          />
        </section>
      ) : null}

      <section id="cach-lam" className={`${styles.section} ${styles.dark}`} data-reveal>
        <div className={styles.sectionHead}>
          {/* 04, không phải 03: mục ảnh hiện trường vừa chen vào trước nó, và
              hai mục cùng mang số 03 thì dãy số mất hết ý nghĩa. */}
          <p className={styles.kicker}>{siteShots.length ? "04" : "03"}</p>
          <h2>{t(VENTURE_PROCESS.title, locale)}</h2>
        </div>

        {/* Đoạn chữ chuyển từ dưới banner xuống đây: nó nói về cách trích số
            liệu từ hồ sơ, tức đúng chủ đề của mục này. */}
        <div className={styles.processIntro}>
          {tList(VENTURE_INTRO.body, locale).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
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
