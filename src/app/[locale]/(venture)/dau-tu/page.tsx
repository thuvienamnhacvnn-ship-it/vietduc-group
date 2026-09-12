import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  isLocale,
  localePath,
  t,
  tList,
  type Locale,
  pick,
} from "@/lib/i18n/config";
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

export default async function VenturePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
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
  const renders = [
    "/media/hospitality/bo-trach-exterior.webp",
    "/media/hospitality/bo-trach-aerial-fields.webp",
    "/media/hospitality/bo-trach-pool-night.webp",
    "/media/hospitality/bo-trach-terrace.webp",
  ];

  /*
   * Trộn xen kẽ phối cảnh với ảnh công trường thay vì nối đuôi nhau.
   *
   * Mười một ảnh công trường chụp cùng một mỏ đá, nhìn gần như giống hệt nhau;
   * để liền một dãy thì băng ảnh trôi qua một đoạn dài mà mắt tưởng nó đứng
   * yên. Xen phối cảnh vào giữa thì cứ vài tấm lại có một tấm đổi hẳn khung
   * cảnh, và cả dải mới thật sự trôi.
   */
  const marquee: string[] = [];
  const longer = Math.max(renders.length, siteShots.length);
  const every = Math.ceil(siteShots.length / renders.length);
  for (let i = 0, r = 0; i < longer * 2; i++) {
    const site = siteShots[marquee.length - r];
    if (i % (every + 1) === 0 && r < renders.length) marquee.push(renders[r++]);
    else if (site) marquee.push(site);
  }

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
          <HeroSocial locale={locale} social={settings.socialVenture} />
        </div>
        <p className={styles.heroCaption}>{t(VENTURE_HERO.caption, locale)}</p>
      </section>

      {/* Ngay dưới banner là hình ảnh, không phải một khối chữ. Đoạn chữ vốn
          nằm đây nói về cách trích số liệu từ hồ sơ — nó thuộc về mục "Cách
          làm" ở dưới, và đã được chuyển xuống đó. */}
      <section
        className={styles.marqueeSection}
        aria-label={dict.venture.projects}
      >
        <PhotoMarquee
          shots={marquee}
          alt={pick(
            {
              vi: "Dự án khách sạn, khu nghỉ dưỡng và công trường của Việt Đức Group",
              en: "Viet Duc Group hotel, resort and construction projects",
              de: "Hotel-, Resort- und Bauprojekte der Viet Duc Group",
              ja: "Viet Duc Group のホテル・リゾート・建設現場のプロジェクト",
              ko: "Viet Duc Group의 호텔·리조트·건설 현장 프로젝트",
              "zh-TW": "Viet Duc Group 的飯店、度假村與工地專案",
            },
            locale,
          )}
          seconds={marquee.length > 12 ? 80 : 55}
        />
      </section>

      <section
        id="linh-vuc"
        className={`${styles.section} ${styles.nenQuang}`}
        data-reveal
        suppressHydrationWarning
      >
        <div className={styles.sectionHead}>
          <h2>{dict.venture.services}</h2>
        </div>

        <ServicePanels services={VENTURE_SERVICES} locale={locale} />
      </section>

      <section
        id="du-an"
        className={`${styles.section} ${styles.vien}`}
        data-reveal
        suppressHydrationWarning
      >
        <div className={styles.sectionHead}>
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
        <section
          id="hien-truong"
          className={`${styles.section} ${styles.nenDai}`}
          data-reveal
          suppressHydrationWarning
        >
          <div className={styles.sectionHead}>
            <h2>
              {pick(
                {
                  vi: "Ngoài hiện trường",
                  en: "On site",
                  de: "Vor Ort",
                  ja: "現場から",
                  ko: "현장에서",
                  "zh-TW": "在工地現場",
                },
                locale,
              )}
            </h2>
          </div>
          <PhotoWall
            shots={siteShots.map((src) => ({
              src,
              alt: pick(
                {
                  vi: "Hiện trường hoạt động đầu tư của Việt Đức Group",
                  en: "A Viet Duc Group investment site",
                  de: "Ein Investitionsstandort der Viet Duc Group",
                  ja: "Viet Duc Group の投資事業の現場",
                  ko: "Viet Duc Group 투자 사업 현장",
                  "zh-TW": "Viet Duc Group 投資事業的現場",
                },
                locale,
              ),
            }))}
            limit={siteShots.length}
            chuLap={pick(
              {
                vi: "Ảnh do đội dự án chụp tại hiện trường",
                en: "Photographs taken on site by the project team",
                de: "Aufnahmen des Projektteams vor Ort",
                ja: "事業チームが現場で撮影",
                ko: "프로젝트 팀이 현장에서 촬영",
                "zh-TW": "由專案團隊於現場拍攝",
              },
              locale,
            )}
          />
        </section>
      ) : null}

      <section
        id="cach-lam"
        className={`${styles.section} ${styles.dark}`}
        data-reveal
        suppressHydrationWarning
      >
        {/*
          Số mục, tiêu đề và hai đoạn dẫn nằm chung một khung có viền.

          Ba thứ này nói cùng một điều — dự án đi từ hồ sơ ra thực địa, và mọi
          số liệu trên trang đều trích từ hồ sơ ấy. Để rời nhau giữa nền tối thì
          chúng trôi nổi như ba mẩu chữ bỏ quên; đóng khung lại thì đọc ra ngay
          là một lời cam kết về nguồn số liệu.
        */}
        <div className={styles.khungTrangTrong}>
          {/*
            Số mục đứng riêng một cột, tiêu đề và phần chữ chung cột còn lại.

            Trước đây số và tiêu đề là một hàng, còn phần chữ là một khối khác
            bên dưới — nên chữ bắt đầu từ mép khung, thụt ra ngoài lề của tiêu
            đề. Tách cột thì hai thứ cùng một lề mà không phải đoán bề rộng con
            số, vốn co giãn theo cỡ màn hình.

            04, không phải 03: mục ảnh hiện trường vừa chen vào trước nó, và hai
            mục cùng mang số 03 thì dãy số mất hết ý nghĩa.
          */}

          <div className={styles.khungChu}>
            <h2 className={styles.khungTieuDe}>
              {t(VENTURE_PROCESS.title, locale)}
            </h2>

            {/*
            Đoạn chữ nằm gọn lại, rê chuột (hoặc tab tới) mới mở ra.

            Nó nói về cách trích số liệu từ hồ sơ — cần có, nhưng không phải thứ
            người xem cần đọc ngay khi lướt qua. Thu lại thì cái khung còn đúng
            số mục và tiêu đề, gọn như một tấm biển; ai muốn biết kỹ thì mở.

            Trên màn hình cảm ứng không có "rê chuột" nên phần này mở sẵn — xem
            luật @media (hover: none) trong tệp kiểu.
          */}
            <div className={styles.processIntro} tabIndex={0}>
              <div className={styles.processIntroTrong}>
                {tList(VENTURE_INTRO.body, locale).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <ol className={styles.steps}>
          {VENTURE_PROCESS.steps.map((step) => (
            <li key={t(step.name, locale)}>
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

      {/*
        Lời mời liên hệ và danh mục nguồn đứng cạnh nhau, không phải nối đuôi.

        Xếp dọc thì lời mời chiếm một dải rộng mà chỉ có ba dòng chữ với một cái
        nút dạt hẳn sang phải, còn danh mục nguồn nằm dưới thành một cột chữ nhỏ
        kéo dài — cả vùng cuối trang loang lổ chỗ trống. Đứng cạnh nhau thì hai
        khối tự lấp đầy nhau và cùng thẳng hai lề.
      */}
      <div className={styles.dayCuoi} data-reveal suppressHydrationWarning>
        <section className={styles.cta}>
          <div>
            <h2>{dict.venture.contactCta}</h2>
            <p>{dict.venture.documentNote}</p>
          </div>
          <Link href={path("/lien-he")} className={styles.ctaButton}>
            {dict.nav.contact}
          </Link>
        </section>

        <section
          className={styles.sourceLine}
          aria-labelledby="venture-sources"
        >
          <h2 id="venture-sources">{dict.venture.sources}</h2>
          <ul>
            {projects.flatMap((project) =>
              project.sources.map((source) => (
                <li
                  key={`${project.slug}-${source.date}-${t(source.document, locale)}`}
                >
                  <span>{t(source.document, locale)}</span>
                  <time dateTime={source.date}>
                    {documentDate(source.date, locale)}
                  </time>
                </li>
              )),
            )}
          </ul>
        </section>
      </div>
    </>
  );
}
