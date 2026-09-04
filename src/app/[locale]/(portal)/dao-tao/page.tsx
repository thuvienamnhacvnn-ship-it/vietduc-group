import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, localePath, t, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import {
  getActivities,
  getCategories,
  getFeaturedPrograms,
  getPartners,
  getPosts,
  getPrograms,
  getSchools,
} from "@/lib/queries";
import { getSiteSettings } from "@/lib/settings";
import { levelLabel } from "@/lib/format";
import { ArrowLink, ButtonLink, SectionHeading, StatRow } from "@/components/ui";
import { ActivityCard } from "@/components/cards";
import { SchoolSlats } from "@/components/SchoolSlats";
import { FieldBoard } from "@/components/FieldBoard";
import { ClaimLedger } from "@/components/ClaimLedger";
import { ProgramCards } from "@/components/ProgramCards";
import { RunLine } from "@/components/RunLine";
import { RiseText } from "@/components/RiseText";
import { HeroPicture } from "@/components/HeroPicture";
import { HeroVideo } from "@/components/HeroVideo";
import { HeroSocial } from "@/components/HeroSocial";
import { ProgramFinder } from "@/components/ProgramFinder";
import styles from "./home.module.css";

/**
 * The banner film and the frame it opens on.
 *
 * The film is hosted on the group's own server rather than shipped with the
 * site: it is two megabytes, it changes on its own schedule, and a deployment
 * is not the place for it. See docs/DATA-NOTES.md section 20.
 */
const HERO_VIDEO = "https://itw-berlin.de/vdg-media/vdg-edu.mp4";
const HERO_VIDEO_POSTER = "/media/hero/vdg-edu-video-poster.webp";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);
  const path = (href: string) => localePath(locale, href);

  const [schools, categories, programs, featured, activities, partners, posts, settings] =
    await Promise.all([
      getSchools(),
      getCategories(),
      getPrograms(),
      getFeaturedPrograms(6),
      getActivities(),
      getPartners(),
      getPosts(3),
      getSiteSettings(),
    ]);

  const programCountBySchool = new Map<number, number>();
  for (const program of programs) {
    if (program.schoolId == null) continue;
    programCountBySchool.set(program.schoolId, (programCountBySchool.get(program.schoolId) ?? 0) + 1);
  }
  const schoolName = new Map(schools.map((s) => [s.id, t(s.shortName ?? s.name, locale)]));
  const schoolCover = new Map(schools.map((s) => [s.id, s.coverPath ?? null]));
  const schoolCrest = new Map(schools.map((s) => [s.id, s.logoPath ?? null]));

  const programCountByCategory = new Map<number, number>();
  for (const program of programs) {
    if (program.categoryId == null) continue;
    programCountByCategory.set(
      program.categoryId,
      (programCountByCategory.get(program.categoryId) ?? 0) + 1,
    );
  }

  /**
   * Each field carries the programmes actually inside it, so the board is a way
   * into the catalogue rather than a set of counters. Six per field is as many
   * as a row can hold before it becomes a page of its own; the link at the foot
   * of each row opens the rest in the explorer.
   */
  const fields = categories
    .map((category) => {
      const inField = programs.filter((program) => program.categoryId === category.id);
      return {
        slug: category.slug,
        label: t(category.name, locale),
        count: inField.length,
        programs: inField.slice(0, 6).map((program) => ({
          slug: program.slug,
          title: t(program.title, locale),
          level: levelLabel(program.level, locale),
          code: program.officialCode ?? null,
          school: program.schoolId ? (schoolName.get(program.schoolId) ?? "") : "",
        })),
      };
    })
    .filter((field) => field.count > 0)
    .sort((a, b) => b.count - a.count);

  const categoryName = new Map(categories.map((c) => [c.id, t(c.name, locale)]));

  /**
   * Figures shown on the home page are the ones the capability profile states
   * about the group as a whole (page 2), plus two counts this site can verify
   * from its own licence data.
   */
  const stats = [
    { value: "15+", label: { vi: "năm hình thành và phát triển", en: "years of formation and development", de: "Jahre Aufbau und Entwicklung" }[locale] },
    { value: String(schools.length), label: { vi: "trường thành viên", en: "member schools", de: "Mitgliedsschulen" }[locale] },
    { value: String(programs.length), label: { vi: "ngành nghề đã đăng ký hoạt động", en: "registered occupations", de: "registrierte Berufsprofile" }[locale] },
    { value: "200+", label: { vi: "doanh nghiệp đối tác", en: "partner enterprises", de: "Partnerunternehmen" }[locale] },
  ];

  const pathway = [
    {
      step: "01",
      title: { vi: "Học tập", en: "Study", de: "Lernen" }[locale],
      body: { vi: "Trang bị kiến thức chuyên môn và ngoại ngữ theo chuẩn nghề nghiệp.", en: "Build professional knowledge and foreign-language skills to occupational standards.", de: "Fachwissen und Fremdsprachen nach beruflichen Standards aufbauen." }[locale],
    },
    {
      step: "02",
      title: { vi: "Thực hành", en: "Practice", de: "Praxis" }[locale],
      body: { vi: "Rèn kỹ năng nghề tại xưởng thực hành và phòng thí nghiệm của trường.", en: "Develop hands-on skills in the school's workshops and laboratories.", de: "Praktische Fertigkeiten in Werkstätten und Laboren entwickeln." }[locale],
    },
    {
      step: "03",
      title: { vi: "Thực tập", en: "Internship", de: "Praktikum" }[locale],
      body: { vi: "Làm việc thực tế tại doanh nghiệp đối tác trong và ngoài nước.", en: "Work in real conditions at partner employers in Vietnam and abroad.", de: "Im Betrieb arbeiten – bei Partnern in Vietnam und im Ausland." }[locale],
    },
    {
      step: "04",
      title: { vi: "Việc làm", en: "Employment", de: "Beschäftigung" }[locale],
      body: { vi: "Ứng tuyển và phát triển nghề nghiệp lâu dài với hỗ trợ của nhà trường.", en: "Apply and build a long-term career with the school's support.", de: "Bewerben und mit Unterstützung der Schule langfristig Karriere machen." }[locale],
    },
  ];

  /**
   * Four claims, each with the record that supports it. The evidence column is
   * the one that had to be checkable: two of these are counted from this site's
   * own licence data, one names the document, one names the institution.
   */
  const reasons = [
    {
      claim: { vi: "Gắn với giấy phép, không phải lời hứa", en: "Tied to licences, not promises", de: "An Zulassungen gebunden, nicht an Versprechen" }[locale],
      body: { vi: "Mỗi ngành trên website đều kèm mã ngành/nghề và quy mô tuyển sinh trích từ giấy chứng nhận đăng ký hoạt động giáo dục nghề nghiệp, có số hiệu và ngày cấp.", en: "Every programme here carries the occupation code and intake quota transcribed from the vocational-education registration certificate, with its number and date of issue.", de: "Jedes Programm nennt den amtlichen Berufscode und die Aufnahmekapazität aus dem Zulassungsbescheid – mit Nummer und Datum." }[locale],
      evidence: { vi: `${programs.length} ngành đã đăng ký hoạt động, trích từ giấy chứng nhận của ${schools.length} trường`, en: `${programs.length} registered occupations, transcribed from the certificates of ${schools.length} schools`, de: `${programs.length} registrierte Berufsprofile aus den Bescheiden von ${schools.length} Schulen` }[locale],
      image: {
        src: "/media/education/trao-thuong-hoc-sinh.webp",
        alt: { vi: "Trao phần thưởng cho học sinh trong đồng phục nhà trường", en: "Prizes presented to students in school uniform", de: "Preisverleihung an Schülerinnen und Schüler in Schuluniform" }[locale],
      },
    },
    {
      claim: { vi: "Thực hành chiếm phần lớn thời lượng", en: "Practice takes most of the time", de: "Praxis nimmt den größten Teil ein" }[locale],
      body: { vi: "Các trường kỹ thuật trong hệ thống bố trí khoảng 70% thời lượng cho thực hành tại xưởng và tại doanh nghiệp.", en: "The technical schools in the system devote around 70% of training time to workshop and workplace practice.", de: "Die technischen Schulen widmen rund 70 % der Ausbildungszeit der Praxis." }[locale],
      evidence: { vi: "Hồ sơ năng lực Việt Đức Group, phần chương trình đào tạo", en: "Viet Duc Group capability profile, training chapter", de: "Leistungsprofil der Viet Duc Group, Kapitel Ausbildung" }[locale],
      image: {
        src: "/media/education/xuong-thuc-hanh-may.webp",
        alt: { vi: "Học viên thực hành trên dây chuyền máy tại doanh nghiệp trong mạng lưới NIBELC", en: "Trainees at a production line in the NIBELC partner network", de: "Auszubildende an einer Fertigungslinie im NIBELC-Partnernetz" }[locale],
      },
    },
    {
      claim: { vi: "Một cửa ngõ sang Đức và châu Âu", en: "A route into Germany and Europe", de: "Ein Weg nach Deutschland und Europa" }[locale],
      body: { vi: "Viện Đào tạo và Giáo dục ITW Berlin chuyển giao chương trình, phương pháp và đào tạo tiếng Đức ngay tại Việt Nam.", en: "The ITW Berlin institute transfers programmes, teaching methods and German-language training directly into Vietnam.", de: "Das itw Berlin überträgt Programme, Methoden und Deutschunterricht direkt nach Vietnam." }[locale],
      evidence: { vi: "ITW Berlin – thành viên của hệ thống, đặt tại CHLB Đức", en: "ITW Berlin - member of the network, based in Germany", de: "ITW Berlin – Mitglied des Verbunds, Sitz in Deutschland" }[locale],
      image: {
        src: "/media/education/gap-doi-tac-chau-au.webp",
        alt: { vi: "Gặp gỡ đối tác châu Âu trong mạng lưới NIBELC", en: "Meeting European partners in the NIBELC network", de: "Treffen mit europäischen Partnern im NIBELC-Netz" }[locale],
      },
    },
    {
      claim: { vi: "Sáu trường, một hệ thống", en: "Six schools, one system", de: "Sechs Schulen, ein Verbund" }[locale],
      body: { vi: "Từ Đà Nẵng, Ninh Bình, Vũng Tàu, Đồng Nai đến Quảng Trị và Berlin – người học chọn ngành trước, chọn nơi học sau.", en: "From Da Nang, Ninh Binh, Vung Tau and Dong Nai to Quang Tri and Berlin: choose the field first, the campus second.", de: "Von Da Nang, Ninh Binh, Vung Tau und Dong Nai bis Quang Tri und Berlin – erst das Fach, dann der Standort." }[locale],
      evidence: { vi: `${schools.length} trường thành viên, hồ sơ từng trường công bố trên trang Hệ thống trường`, en: `${schools.length} member schools, each with its own record on the network page`, de: `${schools.length} Mitgliedsschulen, jede mit eigenem Profil auf der Verbundseite` }[locale],
      image: {
        src: "/media/education/tai-nang-thanh-lich.webp",
        alt: { vi: "Đêm chung kết cuộc thi Học sinh – Sinh viên tài năng thanh lịch", en: "Final night of the student talent and poise contest", de: "Finalabend des Talentwettbewerbs" }[locale],
      },
    },
  ];

  return (
    <>
      {/* ---------------------------------------------------------- hero */}
      {/* Full width, because the building is the first thing the group wants
          seen. The picture is not dimmed: only the top and bottom edges carry a
          gradient, enough to seat the header above it and the card below. */}
      <section className={styles.hero}>
        <div className={styles.heroMedia}>
          {/* Two photographs of the same building: the wide one on a desktop,
              the upright one on a phone, where a landscape frame would leave
              the facade a sliver. */}
          <HeroPicture
            wide={{ src: "/media/hero/vdg-banner-16x9.webp", width: 1672, height: 941 }}
            tall={{ src: HERO_VIDEO_POSTER, width: 900, height: 1580 }}
            alt={
              {
                vi: "Trụ sở Việt Đức Group",
                en: "The Viet Duc Group headquarters",
                de: "Der Hauptsitz der Viet Duc Group",
              }[locale]
            }
            priority
            className={styles.heroImage}
          />
          {/* Phone only: the film runs over the still it opens on. */}
          <HeroVideo src={HERO_VIDEO} poster={HERO_VIDEO_POSTER} className={styles.heroVideo} />
          <span className={styles.heroFade} aria-hidden="true" />
        </div>

        <div className="shell">
          <div className={styles.heroText}>
          <p className={styles.heroEyebrow}>{dict.home.heroEyebrow}</p>
          {/* The line sets itself word by word; the sentence and the buttons
              arrive once it has finished. */}
          <h1 className={styles.heroTitle}>
            <RiseText text={dict.brand.motto.split("–")[0].trim()} delay={180} />
            <RiseText as="em" text={dict.brand.motto.split("–")[1]?.trim() ?? ""} delay={520} />
          </h1>
          <p className={styles.heroLead}>{dict.home.heroLead}</p>
            <div className={styles.heroActions}>
              <ButtonLink href={path("/dao-tao/chuong-trinh")}>{dict.nav.explorer}</ButtonLink>
              <ButtonLink href={path("/gioi-thieu")} variant="secondary">
                {dict.nav.aboutGroup}
              </ButtonLink>
            </div>
            {/* Phone only: the desktop keeps these against the right edge. */}
            <HeroSocial locale={locale} social={settings.social} />
          </div>
        </div>

        <RunLine tone="dark" />
      </section>

      {/* The finder rides the seam between the banner and the page. */}
      <div className={`shell ${styles.finderWrap}`}>
        <ProgramFinder
          locale={locale}
          categories={categories.map((c) => ({ slug: c.slug, label: t(c.name, locale) }))}
          schools={schools.map((sc) => ({ slug: sc.slug, label: t(sc.shortName ?? sc.name, locale) }))}
        />
      </div>

      {/* --------------------------------------------------------- about */}
      <section className={`section ${styles.afterHero}`}>
        <div className="shell">
          <div className={styles.aboutGrid}>
            <div data-reveal>
              <SectionHeading
                eyebrow={dict.home.aboutTitle}
                title={
                  {
                    vi: "Một hệ thống giáo dục nghề nghiệp Việt – Đức, vận hành thật",
                    en: "A Vietnamese–German vocational system that actually runs",
                    de: "Ein vietnamesisch-deutsches Berufsbildungssystem, das wirklich arbeitet",
                  }[locale]
                }
                lead={
                  {
                    vi: "Việt Đức Group là hệ thống giáo dục đa cấp, đa ngành, hoạt động trong lĩnh vực đào tạo nghề, cao đẳng, trung cấp và liên kết quốc tế, với sáu trường thành viên tại Việt Nam và CHLB Đức.",
                    en: "Viet Duc Group is a multi-level, multi-field education system working at college, intermediate and vocational levels, with six member schools in Vietnam and Germany.",
                    de: "Die Viet Duc Group ist ein mehrstufiges, fächerübergreifendes Bildungssystem mit sechs Mitgliedsschulen in Vietnam und Deutschland.",
                  }[locale]
                }
                action={<ArrowLink href={path("/gioi-thieu")}>{dict.common.readMore}</ArrowLink>}
              />
              <StatRow stats={stats} />
            </div>

            <ul className={styles.timeline} data-reveal>
              {[
                { year: "2008", text: { vi: "Khởi đầu với các cơ sở đào tạo nghề chất lượng cao.", en: "Established the first colleges and vocational schools.", de: "Gründung der ersten Colleges und Berufsschulen." }[locale] },
                { year: "2013", text: { vi: "Mở rộng hệ thống, đa dạng ngành đào tạo.", en: "Opened the system and widened the range of programmes.", de: "Ausbau des Verbunds und Erweiterung der Programme." }[locale] },
                { year: "2018", text: { vi: "Hợp tác quốc tế, nâng tầm chất lượng đào tạo.", en: "Expanded international partnerships and upgraded quality.", de: "Ausbau internationaler Partnerschaften und der Qualität." }[locale] },
                { year: { vi: "Hiện tại", en: "Today", de: "Heute" }[locale], text: { vi: "Phát triển bền vững trong lĩnh vực giáo dục nghề nghiệp.", en: "Growing sustainably in vocational education.", de: "Nachhaltiges Wachstum in der beruflichen Bildung." }[locale] },
              ].map((item) => (
                <li key={item.year}>
                  <span className={styles.timelineYear}>{item.year}</span>
                  <span className={styles.timelineText}>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="shell">
        <RunLine />
      </div>

      {/* ------------------------------------------------------- schools */}
      <section className={`section ${styles.schoolsSection}`}>
        <div className="shell">
          <SectionHeading
            eyebrow={{ vi: "Hệ thống", en: "The network", de: "Der Verbund" }[locale]}
            title={dict.home.schoolsTitle}
            lead={
              {
                vi: "Mỗi trường có thế mạnh riêng về ngành nghề và địa bàn. Chọn nơi phù hợp với ngành bạn muốn học.",
                en: "Each school has its own strengths and location. Pick the one that fits the field you want.",
                de: "Jede Schule hat eigene Schwerpunkte und Standorte. Wählen Sie die passende für Ihr Fach.",
              }[locale]
            }
          />
        </div>

        <div className="shell">
          <SchoolSlats
            schools={schools}
            locale={locale}
            programCount={(id) => programCountBySchool.get(id) ?? 0}
            countLabel={(count) =>
              count > 0
                ? ({
                    vi: `${count} ngành`,
                    en: `${count} programmes`,
                    de: `${count} Programme`,
                  })[locale]
                : { vi: "Đang cập nhật", en: "Being updated", de: "Wird ergänzt" }[locale]
            }
          />
        </div>

        <div className={`shell ${styles.schoolsMore}`}>
          <ArrowLink href={path("/dao-tao/truong")}>{dict.common.viewAll}</ArrowLink>
        </div>
      </section>

      {/* -------------------------------------------------------- fields */}
      <section className={`section ${styles.fieldsSection}`}>
        <div className="shell">
          <SectionHeading
            eyebrow={{ vi: "Ngành nghề", en: "Fields", de: "Fachbereiche" }[locale]}
            title={
              {
                vi: "Nhóm ngành đào tạo",
                en: "Fields of training",
                de: "Ausbildungsbereiche",
              }[locale]
            }
            tone="dark"
            lead={
              {
                vi: "Chọn nhóm ngành để xem toàn bộ chương trình đang tuyển sinh trong nhóm đó.",
                en: "Pick a field to see every programme currently open inside it.",
                de: "Wählen Sie einen Bereich, um alle laufenden Programme darin zu sehen.",
              }[locale]
            }
          />

          <FieldBoard
            fields={fields}
            locale={locale}
            unit={{ vi: "ngành", en: "programmes", de: "Programme" }[locale]}
            seeAll={
              {
                vi: "Xem toàn bộ nhóm ngành này",
                en: "See every programme in this field",
                de: "Alle Programme dieses Bereichs",
              }[locale]
            }
          />
        </div>
      </section>

      {/* ------------------------------------------------------ programs */}
      <section className="section">
        <div className="shell">
          <SectionHeading
            eyebrow={{ vi: "Đào tạo", en: "Training", de: "Ausbildung" }[locale]}
            title={dict.home.programsTitle}
            lead={
              {
                vi: "Danh sách dưới đây lấy trực tiếp từ giấy chứng nhận đăng ký hoạt động giáo dục nghề nghiệp của từng trường.",
                en: "The list below is taken directly from each school's vocational-education registration certificate.",
                de: "Die folgende Liste stammt direkt aus den Zulassungsbescheiden der Schulen.",
              }[locale]
            }
            action={<ArrowLink href={path("/dao-tao/chuong-trinh")}>{dict.common.viewAll}</ArrowLink>}
          />

          <ProgramCards
            locale={locale}
            codeLabel={{ vi: "Mã ngành", en: "Code", de: "Code" }[locale]}
            programs={featured.map((program) => ({
              slug: program.slug,
              title: t(program.title, locale),
              school: program.schoolId ? (schoolName.get(program.schoolId) ?? "") : "",
              field: program.categoryId ? (categoryName.get(program.categoryId) ?? "") : "",
              level: levelLabel(program.level, locale),
              code: program.officialCode ?? null,
              cover: program.schoolId ? (schoolCover.get(program.schoolId) ?? null) : null,
              crest: program.schoolId ? (schoolCrest.get(program.schoolId) ?? null) : null,
            }))}
          />
        </div>
      </section>

      <div className="shell">
        <RunLine />
      </div>

      {/* ---------------------------------------------------------- why */}
      {/* Claims are cheap; the column on the right is the point. */}
      <section className={`section ${styles.whySection}`}>
        <div className="shell">
          <SectionHeading
            eyebrow={{ vi: "Lý do", en: "Why", de: "Warum" }[locale]}
            title={dict.home.whyTitle}
          />

          <ClaimLedger
            claims={reasons}
            evidenceLabel={
              { vi: "Căn cứ", en: "Evidence", de: "Beleg" }[locale]
            }
          />

          <div className={styles.whyAction}>
            <ButtonLink href={path("/dao-tao/dang-ky-tu-van")}>{dict.nav.apply}</ButtonLink>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- pathway */}
      <section className="section">
        <div className="shell">
          <SectionHeading
            eyebrow={{ vi: "Lộ trình", en: "Pathway", de: "Weg" }[locale]}
            title={dict.home.roadmapTitle}
            align="center"
          />
          <ol className={styles.pathway}>
            {pathway.map((item, index) => (
              <li key={item.step} data-reveal style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}>
                <span className={styles.pathwayStep}>{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------------------------------------------- activities */}
      {activities.length ? (
        <section className={`section ${styles.activitiesSection}`}>
          <div className="shell">
            <SectionHeading
              eyebrow={{ vi: "Đời sống", en: "Campus life", de: "Schulleben" }[locale]}
              title={dict.home.activitiesTitle}
              action={<ArrowLink href={path("/hoat-dong")}>{dict.common.viewAll}</ArrowLink>}
            />
            <div className={styles.activityGrid}>
              {activities.slice(0, 5).map((activity, index) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  locale={locale}
                  size={index === 0 ? "lg" : "sm"}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ------------------------------------------------------- partners */}
      {partners.length ? (
        <section className="section">
          <div className="shell">
            <SectionHeading
              eyebrow={{ vi: "Mạng lưới", en: "Network", de: "Netzwerk" }[locale]}
              title={dict.home.partnersTitle}
              lead={
                {
                  vi: "Doanh nghiệp và tổ chức được nêu trong hồ sơ năng lực của Việt Đức Group và mạng lưới đối tác chiến lược NIBELC.",
                  en: "Employers and organisations named in the Viet Duc Group capability profile and in the NIBELC strategic partner network.",
                  de: "Unternehmen und Organisationen aus dem Leistungsprofil der Viet Duc Group und dem Partnernetz von NIBELC.",
                }[locale]
              }
              action={<ArrowLink href={path("/doi-tac")}>{dict.common.viewAll}</ArrowLink>}
            />
            <ul className={styles.partnerStrip} data-reveal>
              {partners.slice(0, 16).map((partner) => (
                <li key={partner.id}>
                  <span>{partner.name}</span>
                  {partner.country ? <small>{partner.country}</small> : null}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* ----------------------------------------------------------- news */}
      {posts.length ? (
        <section className="section">
          <div className="shell">
            <SectionHeading
              eyebrow={{ vi: "Tin tức", en: "News", de: "Aktuelles" }[locale]}
              title={dict.home.newsTitle}
              action={<ArrowLink href={path("/tin-tuc")}>{dict.common.viewAll}</ArrowLink>}
            />
            <div className={styles.postGrid}>
              {posts.map((post) => (
                <article key={post.id} className={styles.postCard} data-reveal>
                  <h3>
                    <Link href={path(`/tin-tuc/${post.slug}`)}>{t(post.title, locale)}</Link>
                  </h3>
                  {post.excerpt ? <p>{t(post.excerpt, locale)}</p> : null}
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ------------------------------------------------------------ CTA */}
      <section className={styles.ctaSection}>
        <div className={`shell ${styles.ctaInner}`}>
          <div>
            <h2 className={styles.ctaTitle}>{dict.home.ctaTitle}</h2>
            <p className={styles.ctaLead}>{dict.home.ctaLead}</p>
          </div>
          <div className={styles.ctaActions}>
            <ButtonLink href={path("/dao-tao/dang-ky-tu-van")}>{dict.nav.apply}</ButtonLink>
            {settings.contact.admissionsPhone ? (
              <a
                className={styles.ctaPhone}
                href={`tel:${settings.contact.phoneE164 || settings.contact.admissionsPhone}`}
              >
                {settings.contact.admissionsPhone}
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
