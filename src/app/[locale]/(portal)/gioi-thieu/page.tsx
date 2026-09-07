import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale, localePath, t, type Locale, pick as pickLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getPage, getPartners, getPrograms, getSchools } from "@/lib/queries";
import { ArrowLink, Breadcrumbs, Prose, SectionHeading, StatRow } from "@/components/ui";
import { PageHead } from "@/components/PageHead";
import { PhotoWall } from "@/components/PhotoWall";
import { TamNhin } from "@/components/tam-nhin/TamNhin";
import { khoAnh } from "@/content/kho-media";
import shell from "../page-shell.module.css";
import styles from "./about.module.css";

const SLUG = "gioi-thieu";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "vi";
  const page = await getPage(SLUG);
  if (!page) return {};
  return {
    title: page.seoTitle ? t(page.seoTitle, locale) : t(page.title, locale),
    description: page.seoDescription ? t(page.seoDescription, locale) : undefined,
    alternates: { canonical: `/${locale}/${SLUG}` },
  };
}

/**
 * The group's own page.
 *
 * The text is the same editable page row the generic CMS template renders -
 * this route exists only to give it somewhere better to live. As plain prose in
 * a narrow column it was a wall of type on paper, which is the wrong first
 * impression for the page a visitor opens to decide whether the group is real.
 *
 * So the words keep their place, and everything the site already knows is set
 * around them: the building, the count of schools and programmes actually
 * registered, photographs from the workshops and the ceremonies, and the crests
 * of the six member schools.
 */
export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);
  const path = (href: string) => localePath(locale, href);

  const [page, schools, programs, partners] = await Promise.all([
    getPage(SLUG),
    getSchools(),
    getPrograms(),
    getPartners(),
  ]);
  if (!page) notFound();

  /* Gói chữ tại chỗ cho gọn; thiếu ngôn ngữ nào thì `pick` lùi về tiếng Việt. */
  const say = (map: Parameters<typeof pickLocale<string>>[0]): string => pickLocale(map, locale);

  const stats = [
    {
      value: String(schools.length),
      label: say({ vi: "trường thành viên", en: "member schools", de: "Mitgliedsschulen", ja: "加盟校", ko: "회원 학교", "zh-TW": "所成員學校" }),
    },
    {
      value: String(programs.length),
      label: say({ vi: "ngành đã đăng ký", en: "registered programmes", de: "registrierte Programme", ja: "認可課程", ko: "인가 과정", "zh-TW": "已立案課程" }),
    },
    {
      value: String(partners.length),
      label: say({ vi: "doanh nghiệp đối tác", en: "partner employers", de: "Partnerunternehmen", ja: "提携企業", ko: "협력 기업", "zh-TW": "合作企業" }),
    },
    {
      value: "2",
      label: say({ vi: "quốc gia", en: "countries", de: "Länder", ja: "か国", ko: "개국", "zh-TW": "個國家" }),
    },
  ];

  /*
   * Sơ đồ cấu trúc tập đoàn, lấy từ kho. Ảnh thứ hai trong nhóm brand là sơ đồ;
   * ảnh thứ nhất là logo, đã dùng ở chỗ khác.
   */
  const chart = khoAnh("brand")[1] ?? null;

  /*
   * Ảnh hoạt động lấy từ kho tiếp nhận. Bốn ảnh cũ giữ lại làm dự phòng: nếu
   * chưa ai đổ ảnh vào kho thì mục này vẫn có cái để dựng thay vì biến mất.
   */
  const fromKho = khoAnh("activities");
  const mosaic = fromKho.length
    ? fromKho.map((src) => ({
        src,
        alt: say({
          vi: "Ban lãnh đạo Việt Đức Group",
          en: "The Viet Duc Group leadership",
          de: "Die Führung der Viet Duc Group",
          ja: "Viet Duc Group の経営陣",
          ko: "Viet Duc Group 경영진",
          "zh-TW": "Viet Duc Group 經營團隊",
        }),
      }))
    : [
        {
          src: "/media/education/xuong-thuc-hanh-may.webp",
          alt: say({ vi: "Xưởng thực hành cơ khí", en: "The machining workshop", de: "Die Maschinenwerkstatt", ja: "機械実習工場", ko: "기계 실습 공장", "zh-TW": "機械實習工場" }),
        },
        {
          src: "/media/education/nghiep-vu-le-tan.webp",
          alt: say({ vi: "Thực hành nghiệp vụ lễ tân", en: "Front-office training", de: "Rezeptionstraining", ja: "フロント業務の実習", ko: "프런트 업무 실습", "zh-TW": "櫃檯實務操作" }),
        },
        {
          src: "/media/education/gap-doi-tac-chau-au.webp",
          alt: say({ vi: "Làm việc với đối tác châu Âu", en: "Meeting European partners", de: "Treffen mit Partnern", ja: "ヨーロッパの提携先との打ち合わせ", ko: "유럽 협력사와의 업무 협의", "zh-TW": "與歐洲夥伴的工作會談" }),
        },
        {
          src: "/media/education/tien-hoc-vien-len-duong.webp",
          alt: say({ vi: "Tiễn học viên lên đường", en: "Seeing students off", de: "Verabschiedung", ja: "旅立つ学生の見送り", ko: "떠나는 학생을 배웅하며", "zh-TW": "歡送學員啟程" }),
        },
      ];

  return (
    <div className={shell.page}>
      {/* Banner mở trang. Không đặt chữ lên trên: bức này có người ở chính
          giữa, mọi dòng chữ phủ lên đều rơi vào mặt hoặc vào vùng dày chi
          tiết nhất. */}
      <section className={styles.banner}>
        <Image
          src="/media/vision/tam-nhin-rong.webp"
          alt={say({
            vi: "Ban lãnh đạo Việt Đức Group cùng hình ảnh các trường thành viên và giờ thực hành nghề",
            en: "The Viet Duc Group leadership with the member schools and scenes from workshop training",
            de: "Die Führung der Viet Duc Group mit den Mitgliedsschulen und Szenen aus der Werkstattausbildung",
            ja: "Viet Duc Group の経営陣と、加盟各校および実習風景",
            ko: "Viet Duc Group 경영진과 회원 학교들, 그리고 실습 장면",
            "zh-TW": "Viet Duc Group 經營團隊，以及各成員學校與實作教學的場景",
          })}
          width={2172}
          height={724}
          priority
          sizes="100vw"
          className={styles.bannerImage}
        />
      </section>

      <div className="shell">
        <PageHead
          crumbs={<Breadcrumbs locale={locale} trail={[{ label: t(page.title, locale) }]} />}
          eyebrow={say({ vi: "Việt Đức Group", en: "Viet Duc Group", de: "Viet Duc Group", ja: "Viet Duc グループ", ko: "Viet Duc 그룹", "zh-TW": "Viet Duc 集團" })}
          title={t(page.title, locale)}
          lead={dict.brand.motto}
        />
      </div>


      <div className={`shell ${styles.statWrap}`}>
        <StatRow stats={stats} />
      </div>

      {/* The editable text, with photographs beside it rather than under it. */}
      <section className={`section ${styles.storySection}`}>
        <div className="shell">
          <div className={styles.story}>
            <div className={styles.storyText}>
              {page.body ? <Prose markdown={t(page.body, locale)} /> : null}
              <div className={styles.storyLinks}>
                <ArrowLink href={path("/tam-nhin-su-menh")}>{dict.nav.vision}</ArrowLink>
                <ArrowLink href={path("/dao-tao/truong")}>{dict.nav.schools}</ArrowLink>
              </div>
            </div>

            <aside className={styles.storyAside} data-reveal>
              <figure className={styles.asideFigure}>
                <Image
                  src="/media/education/cong-truong-ky-thuat.webp"
                  alt={say({
                    vi: "Giờ thực hành kỹ thuật",
                    en: "A technical practical",
                    de: "Technische Übungsstunde",
                    ja: "技術実習の時間",
                    ko: "기술 실습 시간",
                    "zh-TW": "技術實作課",
                  })}
                  width={1400}
                  height={1000}
                />
              </figure>
              <figure className={styles.asideFigure}>
                <Image
                  src="/media/education/trao-thuong-hoc-sinh.webp"
                  alt={say({ vi: "Trao thưởng cho học sinh", en: "Prize-giving", de: "Preisverleihung", ja: "生徒への表彰", ko: "학생 시상", "zh-TW": "學生頒獎" })}
                  width={1400}
                  height={1000}
                />
              </figure>
            </aside>
          </div>
        </div>
      </section>

      {/* Sơ đồ tập đoàn: một tấm nói được nhiều hơn cả trang chữ - ba mảng,
          năm thương hiệu đầu tư và khách sạn, bảy huy hiệu trường. */}
      {chart ? (
        <section className={`section ${styles.chartSection}`}>
          <div className="shell">
            <SectionHeading
              eyebrow={say({ vi: "Cấu trúc", en: "Structure", de: "Struktur", ja: "組織構成", ko: "조직 구성", "zh-TW": "組織架構" })}
              title={say({
                vi: "Ba mảng dưới một cái tên",
                en: "Three arms under one name",
                de: "Drei Bereiche unter einem Namen",
                ja: "ひとつの名の下に三つの領域",
                ko: "하나의 이름 아래 세 영역",
                "zh-TW": "一個名字，三大領域",
              })}
              lead={say({
                vi: "Giáo dục, đầu tư và khách sạn – lữ hành, cùng các trường thành viên.",
                en: "Education, investment, and hospitality, with the member schools.",
                de: "Bildung, Investition und Hotellerie, mit den Mitgliedsschulen.",
                ja: "教育、投資、そしてホテル・旅行。あわせて加盟各校。",
                ko: "교육, 투자, 그리고 호텔·여행. 여기에 회원 학교들.",
                "zh-TW": "教育、投資與飯店旅遊，以及各成員學校。",
              })}
            />
            <figure className={styles.chart}>
              <Image
                src={chart}
                alt={say({
                  vi: "Sơ đồ cấu trúc Việt Đức Group",
                  en: "The Viet Duc Group structure",
                  de: "Struktur der Viet Duc Group",
                  ja: "Viet Duc Group の組織図",
                  ko: "Viet Duc Group 조직도",
                  "zh-TW": "Viet Duc Group 組織架構圖",
                })}
                width={1536}
                height={1024}
                sizes="(min-width: 1100px) 1100px, 100vw"
              />
            </figure>
          </div>
        </section>
      ) : null}

      {/* A band of what the schools actually do. */}
      <section className={`section ${styles.mosaicSection}`}>
        <div className="shell">
          <SectionHeading
            eyebrow={say({ vi: "Đội ngũ", en: "Leadership", de: "Führung", ja: "経営陣", ko: "경영진", "zh-TW": "經營團隊" })}
            title={say({
              vi: "Đội ngũ lãnh đạo",
              en: "The people who run it",
              de: "Die Führung der Gruppe",
              ja: "率いている人たち",
              ko: "이끄는 사람들",
              "zh-TW": "領導團隊",
            })}
            lead={say({
              vi: "Ban lãnh đạo Việt Đức Group tại các lễ kỷ niệm, chuyến công tác và những buổi làm việc với đối tác trong nước và nước ngoài.",
              en: "The Viet Duc Group leadership at anniversaries, field visits and working sessions with partners at home and abroad.",
              de: "Die Führung der Viet Duc Group bei Jubiläen, Vor-Ort-Besuchen und Arbeitstreffen mit Partnern.",
              ja: "記念式典、視察、そして国内外の提携先との協議に臨む Viet Duc Group の経営陣。",
              ko: "기념식과 현장 방문, 그리고 국내외 협력사와의 업무 협의에 임한 Viet Duc Group 경영진.",
              "zh-TW": "Viet Duc Group 經營團隊出席週年慶典、實地訪視，以及與國內外夥伴的工作會談。",
            })}
          />
        </div>
        <div className={styles.mosaicWrap}>
          <PhotoWall
            shots={mosaic}
            limit={9}
            moreLabel={(rest) =>
              say({
                vi: `Và ${rest} ảnh nữa trong kho tư liệu của tập đoàn.`,
                en: `And ${rest} more in the group's archive.`,
                de: `Und ${rest} weitere im Archiv der Gruppe.`,
              })
            }
          />
        </div>
      </section>

      {/* The crests, as proof the network is six real institutions. */}
      <section className={`section ${styles.crestSection}`}>
        <div className="shell">
          <SectionHeading
            eyebrow={say({ vi: "Hệ thống", en: "The network", de: "Der Verbund", ja: "ネットワーク", ko: "네트워크", "zh-TW": "體系" })}
            title={dict.home.schoolsTitle}
          />
          <ul className={styles.crests}>
            {schools.map((school) => (
              <li key={school.id}>
                {school.logoPath ? (
                  <Image
                    src={school.logoPath}
                    alt={t(school.shortName ?? school.name, locale)}
                    width={160}
                    height={160}
                  />
                ) : null}
                <span>{t(school.shortName ?? school.name, locale)}</span>
              </li>
            ))}
          </ul>
          <div className={styles.crestMore}>
            <ArrowLink href={path("/dao-tao/truong")}>{dict.common.viewAll}</ArrowLink>
          </div>
        </div>
      </section>

      <TamNhin locale={locale} />
    </div>
  );
}
