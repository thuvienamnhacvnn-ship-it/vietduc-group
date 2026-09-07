import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, localePath, t, type Locale, pick } from "@/lib/i18n/config";
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
import { SchoolGrid } from "@/components/SchoolGrid";
import { FieldBoard } from "@/components/FieldBoard";
import { ClaimLedger } from "@/components/ClaimLedger";
import { ProgramCards } from "@/components/ProgramCards";
import { RunLine } from "@/components/RunLine";
import { RiseText } from "@/components/RiseText";
import { HeroPicture } from "@/components/HeroPicture";
import { HeroVideo } from "@/components/HeroVideo";
import { HeroSocial } from "@/components/HeroSocial";
import { PhotoSections } from "@/components/PhotoSections";
import { NHOM_NGANH } from "@/content/anh-nhom";
import { khoAnh } from "@/content/kho-media";
import { ProgramFinder } from "@/components/ProgramFinder";
import styles from "./home.module.css";

/**
 * Phim ở banner.
 *
 * Phim đặt trên máy chủ của tập đoàn chứ không đi kèm mã nguồn: nó nặng hai
 * megabyte và thay đổi theo lịch riêng, không thuộc về một lần deploy. Xem
 * docs/DATA-NOTES.md mục 20.
 *
 * Khung hình mở đầu dùng ẢNH TĨNH GỐC chứ không phải khung cắt từ phim: khung
 * cắt ra từ bản đã nén mờ hơn hẳn, mà đó lại đúng là ảnh người xem nhìn thấy
 * suốt lúc phim chưa tải xong.
 */
const HERO_VIDEO = "https://itw-berlin.de/vdg-media/vdg-edu.mp4";

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

  /* Ảnh xưởng thực hành lấy từ kho tiếp nhận. */
  const workshop = khoAnh("education");

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
    { value: "15+", label: pick({ vi: "năm hình thành và phát triển", en: "years of formation and development", de: "Jahre Aufbau und Entwicklung", ja: "年の歩み", ko: "년의 발자취", "zh-TW": "年的發展歷程" }, locale) },
    { value: String(schools.length), label: pick({ vi: "trường thành viên", en: "member schools", de: "Mitgliedsschulen", ja: "の加盟校", ko: "개 회원 학교", "zh-TW": "所成員學校" }, locale) },
    { value: String(programs.length), label: pick({ vi: "ngành nghề đã đăng ký hoạt động", en: "registered occupations", de: "registrierte Berufsprofile", ja: "の認可職種", ko: "개 인가 직종", "zh-TW": "個立案職類" }, locale) },
    { value: "200+", label: pick({ vi: "doanh nghiệp đối tác", en: "partner enterprises", de: "Partnerunternehmen", ja: "の提携企業", ko: "개 협력 기업", "zh-TW": "家合作企業" }, locale) },
  ];

  const pathway = [
    {
      step: "01",
      title: pick({ vi: "Học tập", en: "Study", de: "Lernen", ja: "学ぶ", ko: "학습", "zh-TW": "學習" }, locale),
      body: pick({ vi: "Trang bị kiến thức chuyên môn và ngoại ngữ theo chuẩn nghề nghiệp.", en: "Build professional knowledge and foreign-language skills to occupational standards.", de: "Fachwissen und Fremdsprachen nach beruflichen Standards aufbauen.", ja: "職業基準に沿った専門知識と外国語力を身につけます。", ko: "직업 표준에 맞춘 전문 지식과 외국어 실력을 갖춥니다.", "zh-TW": "依職業標準培養專業知識與外語能力。" }, locale),
    },
    {
      step: "02",
      title: pick({ vi: "Thực hành", en: "Practice", de: "Praxis", ja: "実習する", ko: "실습", "zh-TW": "實作" }, locale),
      body: pick({ vi: "Rèn kỹ năng nghề tại xưởng thực hành và phòng thí nghiệm của trường.", en: "Develop hands-on skills in the school's workshops and laboratories.", de: "Praktische Fertigkeiten in Werkstätten und Laboren entwickeln.", ja: "学校の実習工場と実験室で職業技能を磨きます。", ko: "학교의 실습 공장과 실험실에서 직업 기능을 익힙니다.", "zh-TW": "在學校的實習工場與實驗室中鍛鍊職業技能。" }, locale),
    },
    {
      step: "03",
      title: pick({ vi: "Thực tập", en: "Internship", de: "Praktikum", ja: "企業実習", ko: "현장 실습", "zh-TW": "企業實習" }, locale),
      body: pick({ vi: "Làm việc thực tế tại doanh nghiệp đối tác trong và ngoài nước.", en: "Work in real conditions at partner employers in Vietnam and abroad.", de: "Im Betrieb arbeiten – bei Partnern in Vietnam und im Ausland.", ja: "国内外の提携企業で実際の現場に立ちます。", ko: "국내외 협력 기업에서 실제 현장을 경험합니다.", "zh-TW": "在國內外合作企業的真實現場工作。" }, locale),
    },
    {
      step: "04",
      title: pick({ vi: "Việc làm", en: "Employment", de: "Beschäftigung", ja: "就業", ko: "취업", "zh-TW": "就業" }, locale),
      body: pick({ vi: "Ứng tuyển và phát triển nghề nghiệp lâu dài với hỗ trợ của nhà trường.", en: "Apply and build a long-term career with the school's support.", de: "Bewerben und mit Unterstützung der Schule langfristig Karriere machen.", ja: "学校の支援を受けて応募し、長く続く職業人生を築きます。", ko: "학교의 지원을 받아 지원하고 오래가는 경력을 쌓습니다.", "zh-TW": "在學校協助下應徵求職，發展長遠的職涯。" }, locale),
    },
  ];

  /**
   * Four claims, each with the record that supports it. The evidence column is
   * the one that had to be checkable: two of these are counted from this site's
   * own licence data, one names the document, one names the institution.
   */
  const reasons = [
    {
      claim: pick({ vi: "Gắn với giấy phép, không phải lời hứa", en: "Tied to licences, not promises", de: "An Zulassungen gebunden, nicht an Versprechen", ja: "約束ではなく、認可に裏づけられて", ko: "약속이 아니라 인가에 근거합니다", "zh-TW": "依據立案文件，而非口頭承諾" }, locale),
      body: pick({ vi: "Mỗi ngành trên website đều kèm mã ngành/nghề và quy mô tuyển sinh trích từ giấy chứng nhận đăng ký hoạt động giáo dục nghề nghiệp, có số hiệu và ngày cấp.", en: "Every programme here carries the occupation code and intake quota transcribed from the vocational-education registration certificate, with its number and date of issue.", de: "Jedes Programm nennt den amtlichen Berufscode und die Aufnahmekapazität aus dem Zulassungsbescheid – mit Nummer und Datum.", ja: "本サイトの各課程には、技能教育の立案証明書から書き写した職種コードと募集定員が、証明書番号と交付日とともに添えられています。", ko: "이 사이트의 모든 과정에는 직업교육 인가증에서 옮겨 적은 직종 코드와 모집 정원이 인가증 번호 및 발급일과 함께 표시됩니다.", "zh-TW": "本網站的每一個課程都附有自技職教育立案證明書抄錄的職類代碼與招生名額，並註明證書字號與核發日期。" }, locale),
      evidence: pick({ vi: `${programs.length} ngành đã đăng ký hoạt động, trích từ giấy chứng nhận của ${schools.length} trường`, en: `${programs.length} registered occupations, transcribed from the certificates of ${schools.length} schools`, de: `${programs.length} registrierte Berufsprofile aus den Bescheiden von ${schools.length} Schulen` }, locale),
      image: {
        src: "/media/education/trao-thuong-hoc-sinh.webp",
        alt: pick({ vi: "Trao phần thưởng cho học sinh trong đồng phục nhà trường", en: "Prizes presented to students in school uniform", de: "Preisverleihung an Schülerinnen und Schüler in Schuluniform", ja: "制服姿の生徒への表彰", ko: "교복을 입은 학생에게 시상하는 모습", "zh-TW": "頒獎給身著校服的學生" }, locale),
      },
    },
    {
      claim: pick({ vi: "Thực hành chiếm phần lớn thời lượng", en: "Practice takes most of the time", de: "Praxis nimmt den größten Teil ein", ja: "時間の大半は実習に", ko: "수업 시간의 대부분은 실습", "zh-TW": "課程時數多半用於實作" }, locale),
      body: pick({ vi: "Các trường kỹ thuật trong hệ thống bố trí khoảng 70% thời lượng cho thực hành tại xưởng và tại doanh nghiệp.", en: "The technical schools in the system devote around 70% of training time to workshop and workplace practice.", de: "Die technischen Schulen widmen rund 70 % der Ausbildungszeit der Praxis.", ja: "系列の工業系学校では、訓練時間のおよそ 70% を工場および企業での実習に充てています。", ko: "체계 안의 공업계 학교들은 훈련 시간의 약 70%를 공장과 기업 실습에 배정합니다.", "zh-TW": "體系內的技術學校將約 70% 的訓練時數安排於工場與企業實作。" }, locale),
      evidence: pick({ vi: "Hồ sơ năng lực Việt Đức Group, phần chương trình đào tạo", en: "Viet Duc Group capability profile, training chapter", de: "Leistungsprofil der Viet Duc Group, Kapitel Ausbildung", ja: "Viet Duc Group 会社案内、教育課程の章", ko: "Viet Duc Group 역량 소개서, 교육 과정 부분", "zh-TW": "Viet Duc Group 能力簡介，培訓課程章節" }, locale),
      image: {
        src: "/media/education/xuong-thuc-hanh-may.webp",
        alt: pick({ vi: "Học viên thực hành trên dây chuyền máy tại doanh nghiệp trong mạng lưới NIBELC", en: "Trainees at a production line in the NIBELC partner network", de: "Auszubildende an einer Fertigungslinie im NIBELC-Partnernetz", ja: "NIBELC ネットワーク企業の生産ラインで実習する学生", ko: "NIBELC 네트워크 기업의 생산 라인에서 실습하는 학생", "zh-TW": "學員在 NIBELC 網絡企業的生產線上實作" }, locale),
      },
    },
    {
      claim: pick({ vi: "Một cửa ngõ sang Đức và châu Âu", en: "A route into Germany and Europe", de: "Ein Weg nach Deutschland und Europa", ja: "ドイツとヨーロッパへの入口", ko: "독일과 유럽으로 가는 관문", "zh-TW": "通往德國與歐洲的門戶" }, locale),
      body: pick({ vi: "Viện Đào tạo và Giáo dục ITW Berlin chuyển giao chương trình, phương pháp và đào tạo tiếng Đức ngay tại Việt Nam.", en: "The ITW Berlin institute transfers programmes, teaching methods and German-language training directly into Vietnam.", de: "Das itw Berlin überträgt Programme, Methoden und Deutschunterricht direkt nach Vietnam.", ja: "ITW ベルリン教育訓練研究所が、教育課程・指導法・ドイツ語教育をベトナム国内に移転しています。", ko: "ITW 베를린 교육훈련원이 교육 과정과 교수법, 독일어 교육을 베트남 현지로 이전합니다.", "zh-TW": "ITW 柏林教育訓練學院將課程、教學方法與德語教學直接移轉至越南。" }, locale),
      evidence: pick({ vi: "ITW Berlin – thành viên của hệ thống, đặt tại CHLB Đức", en: "ITW Berlin - member of the network, based in Germany", de: "ITW Berlin – Mitglied des Verbunds, Sitz in Deutschland", ja: "ITW ベルリン — ドイツ連邦共和国に置かれた系列校", ko: "ITW 베를린 — 독일 연방공화국에 있는 회원 기관", "zh-TW": "ITW 柏林 — 設於德意志聯邦共和國的體系成員" }, locale),
      image: {
        src: "/media/education/gap-doi-tac-chau-au.webp",
        alt: pick({ vi: "Gặp gỡ đối tác châu Âu trong mạng lưới NIBELC", en: "Meeting European partners in the NIBELC network", de: "Treffen mit europäischen Partnern im NIBELC-Netz", ja: "NIBELC ネットワークのヨーロッパ提携先との面談", ko: "NIBELC 네트워크의 유럽 협력사와의 만남", "zh-TW": "與 NIBELC 網絡中的歐洲夥伴會面" }, locale),
      },
    },
    {
      claim: pick({ vi: "Sáu trường, một hệ thống", en: "Six schools, one system", de: "Sechs Schulen, ein Verbund", ja: "六つの学校、ひとつの体系", ko: "여섯 학교, 하나의 체계", "zh-TW": "六所學校，一個體系" }, locale),
      body: pick({ vi: "Từ Đà Nẵng, Ninh Bình, Vũng Tàu, Đồng Nai đến Quảng Trị và Berlin – người học chọn ngành trước, chọn nơi học sau.", en: "From Da Nang, Ninh Binh, Vung Tau and Dong Nai to Quang Tri and Berlin: choose the field first, the campus second.", de: "Von Da Nang, Ninh Binh, Vung Tau und Dong Nai bis Quang Tri und Berlin – erst das Fach, dann der Standort.", ja: "ダナン、ニンビン、ブンタウ、ドンナイから、クアンチ、そしてベルリンまで。まず分野を選び、学ぶ場所はその次に。", ko: "다낭, 닌빈, 붕따우, 동나이에서 꽝찌와 베를린까지. 먼저 분야를 고르고, 배울 곳은 그다음입니다.", "zh-TW": "從峴港、寧平、頭頓、同奈，到廣治與柏林——先選領域，再選校區。" }, locale),
      evidence: pick({ vi: `${schools.length} trường thành viên, hồ sơ từng trường công bố trên trang Hệ thống trường`, en: `${schools.length} member schools, each with its own record on the network page`, de: `${schools.length} Mitgliedsschulen, jede mit eigenem Profil auf der Verbundseite` }, locale),
      image: {
        src: "/media/education/tai-nang-thanh-lich.webp",
        alt: pick({ vi: "Đêm chung kết cuộc thi Học sinh – Sinh viên tài năng thanh lịch", en: "Final night of the student talent and poise contest", de: "Finalabend des Talentwettbewerbs", ja: "学生タレント・エレガンスコンテスト決勝の夜", ko: "학생 재능·품위 선발대회 결승전의 밤", "zh-TW": "學生才藝與儀態競賽決賽之夜" }, locale),
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
            tall={{ src: "/media/hero/vdg-hq-portrait.webp", width: 992, height: 1586 }}
            alt={
              pick({
                vi: "Trụ sở Việt Đức Group",
                en: "The Viet Duc Group headquarters",
                de: "Der Hauptsitz der Viet Duc Group",
                ja: "Viet Duc Group 本部",
                ko: "Viet Duc Group 본부",
                "zh-TW": "Viet Duc Group 總部",
              }, locale)
            }
            priority
            className={styles.heroImage}
          />
          {/* Phone only: the film runs over the still it opens on. */}
          <HeroVideo src={HERO_VIDEO} poster="/media/hero/vdg-hq-portrait.webp" className={styles.heroVideo} />
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
      <section className={`section ${styles.bandPaper} ${styles.afterHero}`}>
        <div className="shell">
          <div className={styles.aboutGrid}>
            <div data-reveal>
              <SectionHeading
                eyebrow={dict.home.aboutTitle}
                title={
                  pick({
                    vi: "Một hệ thống giáo dục nghề nghiệp Việt – Đức, vận hành thật",
                    en: "A Vietnamese–German vocational system that actually runs",
                    de: "Ein vietnamesisch-deutsches Berufsbildungssystem, das wirklich arbeitet",
                    ja: "実際に動いている越独技能教育の体系",
                    ko: "실제로 돌아가는 베트남·독일 직업교육 체계",
                    "zh-TW": "確實在運作的越德技職教育體系",
                  }, locale)
                }
                lead={
                  pick({
                    vi: "Việt Đức Group là hệ thống giáo dục đa cấp, đa ngành, hoạt động trong lĩnh vực đào tạo nghề, cao đẳng, trung cấp và liên kết quốc tế, với sáu trường thành viên tại Việt Nam và CHLB Đức.",
                    en: "Viet Duc Group is a multi-level, multi-field education system working at college, intermediate and vocational levels, with six member schools in Vietnam and Germany.",
                    de: "Die Viet Duc Group ist ein mehrstufiges, fächerübergreifendes Bildungssystem mit sechs Mitgliedsschulen in Vietnam und Deutschland.",
                    ja: "Viet Duc Group は、職業訓練・短期大学・中級課程および国際連携を手がける多段階・多分野の教育体系であり、ベトナムとドイツ連邦共和国に六つの加盟校を擁します。",
                    ko: "Viet Duc Group은 직업훈련·전문대·중급 과정과 국제 협력을 아우르는 다단계·다분야 교육 체계로, 베트남과 독일 연방공화국에 여섯 개 회원 학교를 두고 있습니다.",
                    "zh-TW": "Viet Duc Group 是涵蓋職業訓練、專科、中級課程與國際合作的多層級、多領域教育體系，在越南與德意志聯邦共和國設有六所成員學校。",
                  }, locale)
                }
              />
              {/* Liên kết đặt DƯỚI đoạn dẫn, không nhét vào cạnh nó: trong cột
                  hẹp thế này, đưa vào ô hành động của tiêu đề làm nó lơ lửng
                  giữa đoạn văn. */}
              <p className={styles.aboutLink}>
                <ArrowLink href={path("/gioi-thieu")}>{dict.common.readMore}</ArrowLink>
              </p>
            </div>

            <div className={styles.timelineWrap} data-reveal>
              <h3 className={styles.timelineHead}>
                {pick({ vi: "Chặng đường", en: "The road so far", de: "Der Weg bisher", ja: "これまでの道のり", ko: "지나온 길", "zh-TW": "一路走來" }, locale)}
              </h3>
              <ul className={styles.timeline}>
              {[
                { year: "2008", text: pick({ vi: "Khởi đầu với các cơ sở đào tạo nghề chất lượng cao.", en: "Established the first colleges and vocational schools.", de: "Gründung der ersten Colleges und Berufsschulen.", ja: "質の高い職業訓練機関の設立から始まりました。", ko: "수준 높은 직업훈련 기관의 설립으로 출발했습니다.", "zh-TW": "從設立優質的職業訓練機構起步。" }, locale) },
                { year: "2013", text: pick({ vi: "Mở rộng hệ thống, đa dạng ngành đào tạo.", en: "Opened the system and widened the range of programmes.", de: "Ausbau des Verbunds und Erweiterung der Programme.", ja: "体系を広げ、教育分野を多様にしました。", ko: "체계를 넓히고 교육 분야를 다양하게 했습니다.", "zh-TW": "擴展體系，豐富培訓領域。" }, locale) },
                { year: "2018", text: pick({ vi: "Hợp tác quốc tế, nâng tầm chất lượng đào tạo.", en: "Expanded international partnerships and upgraded quality.", de: "Ausbau internationaler Partnerschaften und der Qualität.", ja: "国際連携を進め、教育の質を高めました。", ko: "국제 협력을 넓히고 교육의 질을 높였습니다.", "zh-TW": "拓展國際合作，提升培訓品質。" }, locale) },
                { year: pick({ vi: "Hiện tại", en: "Today", de: "Heute", ja: "現在", ko: "현재", "zh-TW": "現在" }, locale), text: pick({ vi: "Phát triển bền vững trong lĩnh vực giáo dục nghề nghiệp.", en: "Growing sustainably in vocational education.", de: "Nachhaltiges Wachstum in der beruflichen Bildung.", ja: "職業教育の分野で着実に歩みを進めています。", ko: "직업교육 분야에서 꾸준히 성장하고 있습니다.", "zh-TW": "在技職教育領域穩健成長。" }, locale) },
              ].map((item) => (
                <li key={item.year}>
                  <span className={styles.timelineYear}>{item.year}</span>
                  <span className={styles.timelineText}>{item.text}</span>
                </li>
              ))}
              </ul>
            </div>
          </div>

          {/* Bốn số liệu thành một hàng riêng chạy hết chiều ngang, dưới cả
              hai cột. Nhét vào cột trái làm cột đó dài hơn hẳn cột phải, để
              lại một mảng trống lớn bên cạnh bảng chặng đường. */}
          <div className={styles.aboutStats} data-reveal>
            <StatRow stats={stats} />
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
            eyebrow={pick({ vi: "Hệ thống", en: "The network", de: "Der Verbund", ja: "ネットワーク", ko: "네트워크", "zh-TW": "體系" }, locale)}
            title={dict.home.schoolsTitle}
            lead={
              pick({
                vi: "Mỗi trường có thế mạnh riêng về ngành nghề và địa bàn. Chọn nơi phù hợp với ngành bạn muốn học.",
                en: "Each school has its own strengths and location. Pick the one that fits the field you want.",
                de: "Jede Schule hat eigene Schwerpunkte und Standorte. Wählen Sie die passende für Ihr Fach.",
                ja: "学校ごとに得意な分野と地域があります。学びたい分野に合う一校をお選びください。",
                ko: "학교마다 강점 분야와 지역이 다릅니다. 배우고 싶은 분야에 맞는 곳을 고르세요.",
                "zh-TW": "每所學校各有專長領域與所在地。請挑選最適合您想學領域的一所。",
              }, locale)
            }
          />
        </div>

        {/* Wider than the page shell: six cards three abreast need the room,
            and the band they sit in is the widest thing on the page. */}
        <div className={styles.schoolsWide}>
          <SchoolGrid
            schools={schools}
            locale={locale}
            programCount={(id) => programCountBySchool.get(id) ?? 0}
            countLabel={(count) =>
              count > 0
                ? pick(
                    {
                      vi: `${count} ngành`,
                      en: `${count} programmes`,
                      de: `${count} Programme`,
                    },
                    locale,
                  )
                : pick({ vi: "Đang cập nhật", en: "Being updated", de: "Wird ergänzt", ja: "更新中", ko: "업데이트 중", "zh-TW": "更新中" }, locale)
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
            eyebrow={pick({ vi: "Ngành nghề", en: "Fields", de: "Fachbereiche", ja: "分野", ko: "분야", "zh-TW": "職類領域" }, locale)}
            title={
              pick({
                vi: "Nhóm ngành đào tạo",
                en: "Fields of training",
                de: "Ausbildungsbereiche",
                ja: "教育分野の区分",
                ko: "교육 분야 구분",
                "zh-TW": "培訓領域分類",
              }, locale)
            }
            lead={
              pick({
                vi: "Chọn nhóm ngành để xem toàn bộ chương trình đang tuyển sinh trong nhóm đó.",
                en: "Pick a field to see every programme currently open inside it.",
                de: "Wählen Sie einen Bereich, um alle laufenden Programme darin zu sehen.",
                ja: "分野を選ぶと、その分野で現在募集中の課程がすべて表示されます。",
                ko: "분야를 고르면 그 분야에서 지금 모집 중인 과정이 모두 나옵니다.",
                "zh-TW": "選擇領域，即可看到該領域目前招生中的所有課程。",
              }, locale)
            }
          />

          <FieldBoard
            fields={fields}
            locale={locale}
            unit={pick({ vi: "ngành", en: "programmes", de: "Programme", ja: "課程", ko: "개 과정", "zh-TW": "個課程" }, locale)}
            seeAll={
              pick({
                vi: "Xem toàn bộ nhóm ngành này",
                en: "See every programme in this field",
                de: "Alle Programme dieses Bereichs",
                ja: "この分野の課程をすべて見る",
                ko: "이 분야의 과정 모두 보기",
                "zh-TW": "查看此領域的所有課程",
              }, locale)
            }
          />
        </div>
      </section>

      {/* ------------------------------------------------------ programs */}
      <section className={`section ${styles.bandBeige}`}>
        <div className="shell">
          <SectionHeading
            eyebrow={pick({ vi: "Đào tạo", en: "Training", de: "Ausbildung", ja: "教育課程", ko: "교육 과정", "zh-TW": "培訓" }, locale)}
            title={dict.home.programsTitle}
            lead={
              pick({
                vi: "Danh sách dưới đây lấy trực tiếp từ giấy chứng nhận đăng ký hoạt động giáo dục nghề nghiệp của từng trường.",
                en: "The list below is taken directly from each school's vocational-education registration certificate.",
                de: "Die folgende Liste stammt direkt aus den Zulassungsbescheiden der Schulen.",
                ja: "以下の一覧は、各校の技能教育立案証明書からそのまま採録したものです。",
                ko: "아래 목록은 각 학교의 직업교육 인가증에서 그대로 옮긴 것입니다.",
                "zh-TW": "以下清單直接取自各校的技職教育立案證明書。",
              }, locale)
            }
            action={<ArrowLink href={path("/dao-tao/chuong-trinh")}>{dict.common.viewAll}</ArrowLink>}
          />

          <ProgramCards
            locale={locale}
            codeLabel={pick({ vi: "Mã ngành", en: "Code", de: "Code", ja: "職種コード", ko: "직종 코드", "zh-TW": "職類代碼" }, locale)}
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

      {/* Ảnh xưởng thực hành và phòng máy: mục "học nghề" nói bằng ảnh, không
          bằng chữ. Chưa có ảnh trong kho thì cả mục không dựng. */}
      {workshop.length ? (
        <section className={`section ${styles.workshopSection}`}>
          <div className="shell">
            <SectionHeading
              eyebrow={pick({ vi: "Trong xưởng", en: "In the workshop", de: "In der Werkstatt", ja: "実習の現場から", ko: "실습 현장에서", "zh-TW": "在實習工場" }, locale)}
              title={
                pick({
                  vi: "Thực hành trực chiến",
                  en: "Trained on the real thing",
                  de: "Ausbildung am echten Gerät",
                  ja: "本物の現場で鍛える",
                  ko: "실전 그대로 익힌다",
                  "zh-TW": "在真實現場練功",
                }, locale)
              }
              lead={
                pick({
                  vi: "Giờ thực hành tại các trường thành viên: xưởng cơ khí, phòng máy, phòng thực hành nghiệp vụ.",
                  en: "Practicals at the member schools: machine shops, computer rooms, service training rooms.",
                  de: "Übungsstunden an den Mitgliedsschulen: Werkstätten, Rechnerräume, Übungsräume.",
                  ja: "加盟校での実習風景 — 機械工場、コンピューター室、実務実習室。",
                  ko: "회원 학교의 실습 시간 — 기계 공장, 전산실, 실무 실습실.",
                  "zh-TW": "各成員學校的實作課：機械工場、電腦教室、實務操作教室。",
                }, locale)
              }
            />
          </div>
          <div className={styles.schoolsWide}>
            <PhotoSections
              groups={NHOM_NGANH}
              all={workshop}
              locale={locale}
              otherLabel={{ vi: "Hình ảnh khác", en: "Other photographs", de: "Weitere Aufnahmen", ja: "その他の写真", ko: "그 밖의 사진", "zh-TW": "其他照片" }}
              alt={(nhom) => nhom}
            />
          </div>
        </section>
      ) : null}

      <div className="shell">
        <RunLine />
      </div>

      {/* ---------------------------------------------------------- why */}
      {/* Claims are cheap; the column on the right is the point. */}
      <section className={`section ${styles.whySection}`}>
        <div className="shell">
          {/* tone="dark" ĐÚNG ở đây: nền mục là var(--band), tối ở cả hai
              theme, khác với mục "Nhóm ngành" trước đây chỉ có lớp phủ mờ. */}
          <SectionHeading
            eyebrow={pick({ vi: "Lý do", en: "Why", de: "Warum", ja: "理由", ko: "이유", "zh-TW": "原因" }, locale)}
            title={dict.home.whyTitle}
            tone="dark"
          />

          <ClaimLedger
            claims={reasons}
            evidenceLabel={
              pick({ vi: "Căn cứ", en: "Evidence", de: "Beleg", ja: "根拠", ko: "근거", "zh-TW": "依據" }, locale)
            }
          />

          <div className={styles.whyAction}>
            <ButtonLink href={path("/dao-tao/dang-ky-tu-van")}>{dict.nav.apply}</ButtonLink>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- pathway */}
      <section className={`section ${styles.bandPaper}`}>
        <div className="shell">
          <SectionHeading
            eyebrow={pick({ vi: "Lộ trình", en: "Pathway", de: "Weg", ja: "道すじ", ko: "경로", "zh-TW": "路徑" }, locale)}
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
              eyebrow={pick({ vi: "Đời sống", en: "Campus life", de: "Schulleben", ja: "学校生活", ko: "학교 생활", "zh-TW": "校園生活" }, locale)}
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
        <section className={`section ${styles.bandPaper}`}>
          <div className="shell">
            <SectionHeading
              eyebrow={pick({ vi: "Mạng lưới", en: "Network", de: "Netzwerk", ja: "ネットワーク", ko: "네트워크", "zh-TW": "網絡" }, locale)}
              title={dict.home.partnersTitle}
              lead={
                pick({
                  vi: "Doanh nghiệp và tổ chức được nêu trong hồ sơ năng lực của Việt Đức Group và mạng lưới đối tác chiến lược NIBELC.",
                  en: "Employers and organisations named in the Viet Duc Group capability profile and in the NIBELC strategic partner network.",
                  de: "Unternehmen und Organisationen aus dem Leistungsprofil der Viet Duc Group und dem Partnernetz von NIBELC.",
                  ja: "Viet Duc Group の会社案内および NIBELC 戦略提携ネットワークに名前の挙がる企業・団体です。",
                  ko: "Viet Duc Group 역량 소개서와 NIBELC 전략 협력 네트워크에 이름이 오른 기업과 기관입니다.",
                  "zh-TW": "列名於 Viet Duc Group 能力簡介與 NIBELC 策略夥伴網絡中的企業與機構。",
                }, locale)
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
        <section className={`section ${styles.bandBeige}`}>
          <div className="shell">
            <SectionHeading
              eyebrow={pick({ vi: "Tin tức", en: "News", de: "Aktuelles", ja: "お知らせ", ko: "소식", "zh-TW": "最新消息" }, locale)}
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
