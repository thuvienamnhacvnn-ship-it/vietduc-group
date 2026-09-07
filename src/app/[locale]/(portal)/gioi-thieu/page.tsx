import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, localePath, t, type Locale, pick as pickLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getPage, getPartners, getPrograms, getSchools } from "@/lib/queries";
import { ArrowLink, Breadcrumbs, Prose } from "@/components/ui";
import { PhotoWall } from "@/components/PhotoWall";
import { SoDem } from "@/components/SoDem";
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
 * Trang Giới thiệu.
 *
 * Mạch trang: ảnh mở đầu với tấm bảng tiêu đề kèm bốn con số — chuyện của tập
 * đoàn — dải ảnh ngắt chương — sơ đồ ba mảng — đội ngũ — sáu trường thành viên
 * — rồi mục Tầm nhìn & Triết lý giáo dục.
 *
 * Hai nguyên tắc giữ suốt trang:
 *
 *  - Không đặt chữ lên ảnh. Ảnh nào của tập đoàn cũng có người ở trong, và chữ
 *    phủ lên đều rơi vào mặt. Chỗ của chữ là tấm bảng bên dưới ảnh.
 *  - Con số lấy thẳng từ cơ sở dữ liệu, không viết tay. Đếm được bao nhiêu
 *    trường, bao nhiêu ngành đã đăng ký thì hiện bấy nhiêu.
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

  const soLieu = [
    {
      so: schools.length,
      nhan: say({
        vi: "trường thành viên",
        en: "member schools",
        de: "Mitgliedsschulen",
        ja: "の加盟校",
        ko: "개 회원 학교",
        "zh-TW": "所成員學校",
      }),
    },
    {
      so: programs.length,
      nhan: say({
        vi: "ngành đã đăng ký hoạt động",
        en: "registered occupations",
        de: "registrierte Berufsprofile",
        ja: "の認可職種",
        ko: "개 인가 직종",
        "zh-TW": "個已立案職類",
      }),
    },
    {
      so: partners.length,
      nhan: say({
        vi: "doanh nghiệp đối tác",
        en: "partner employers",
        de: "Partnerunternehmen",
        ja: "の提携企業",
        ko: "개 협력 기업",
        "zh-TW": "家合作企業",
      }),
    },
    {
      so: new Set(schools.map((s) => s.country)).size,
      nhan: say({
        vi: "quốc gia",
        en: "countries",
        de: "Länder",
        ja: "か国",
        ko: "개국",
        "zh-TW": "個國家",
      }),
    },
  ];

  /*
   * Sơ đồ cấu trúc tập đoàn, lấy từ kho. Ảnh thứ hai trong nhóm brand là sơ đồ;
   * ảnh thứ nhất là logo, đã dùng ở chỗ khác.
   */
  const soDo = khoAnh("brand")[1] ?? null;

  /* Ảnh đội ngũ lấy từ kho tiếp nhận; chưa có thì mục này không dựng. */
  const anhDoiNgu = khoAnh("activities").map((src) => ({
    src,
    alt: say({
      vi: "Ban lãnh đạo Việt Đức Group",
      en: "The Viet Duc Group leadership",
      de: "Die Führung der Viet Duc Group",
      ja: "Viet Duc Group の経営陣",
      ko: "Viet Duc Group 경영진",
      "zh-TW": "Viet Duc Group 經營團隊",
    }),
  }));

  return (
    <div className={`${shell.page} ${styles.trang}`}>
      {/* ------------------------------------------------------- mở đầu */}
      <section className={styles.mo}>
        <div className={styles.moKhung}>
          <Image
            src="/media/vision/lanh-dao-do-thi.webp"
            alt={say({
              vi: "Ban lãnh đạo Việt Đức Group trước khu đô thị lên đèn lúc chiều tối",
              en: "The Viet Duc Group leadership before the lit city at dusk",
              de: "Die Führung der Viet Duc Group vor der beleuchteten Stadt in der Dämmerung",
              ja: "夕暮れ、灯りのともる街を背にした Viet Duc Group の経営陣",
              ko: "해 질 녘 불 밝힌 도시를 배경으로 선 Viet Duc Group 경영진",
              "zh-TW": "暮色中華燈初上的城市前，Viet Duc Group 的經營團隊",
            })}
            width={2172}
            height={724}
            priority
            sizes="100vw"
            className={styles.moAnh}
          />
          <span className={styles.moPhu} aria-hidden="true" />
          <span className={styles.moPhuDuoi} aria-hidden="true" />
        </div>

        <div className="shell">
          <div className={styles.bang} data-reveal>
            <Breadcrumbs locale={locale} trail={[{ label: t(page.title, locale) }]} />

            <div className={styles.bangDau}>
              <p className={styles.deTua}>{dict.brand.name}</p>
            </div>
            <h1 className={styles.bangTieuDe}>{t(page.title, locale)}</h1>
            <p className={styles.bangDan}>{dict.brand.motto}</p>

            <dl className={styles.soLieu}>
              {soLieu.map((s, i) => (
                <div
                  key={s.nhan}
                  className={styles.oSo}
                  data-reveal
                  style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
                >
                  <dd className={styles.soLon}>
                    <SoDem so={s.so} />
                  </dd>
                  <dt className={styles.soNhan}>{s.nhan}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- chuyện */}
      <section className={styles.khoi}>
        <div className="shell">
          <div className={styles.chuyen}>
            <div className={styles.chuyenBen}>
              <p className={styles.deTua}>
                {say({
                  vi: "Câu chuyện",
                  en: "The story",
                  de: "Die Geschichte",
                  ja: "歩み",
                  ko: "우리의 이야기",
                  "zh-TW": "我們的故事",
                })}
              </p>
              <h2 className={styles.chuyenTieuDe}>{dict.home.aboutTitle}</h2>

              <div className={styles.anhBen}>
                <figure className={styles.o} data-reveal>
                  <Image
                    src="/media/vision/to-thuc-hanh-co-khi.webp"
                    alt={say({
                      vi: "Một tổ thực hành tháo lắp cụm truyền động",
                      en: "A practice team stripping down a gear assembly",
                      de: "Eine Übungsgruppe zerlegt eine Getriebebaugruppe",
                      ja: "伝動装置を分解する実習班",
                      ko: "전동 장치를 분해하는 실습 조",
                      "zh-TW": "拆解傳動組件的實作小組",
                    })}
                    width={1400}
                    height={1050}
                    sizes="(min-width: 1000px) 30vw, 50vw"
                  />
                  <figcaption>
                    {say({
                      vi: "Giờ thực hành cơ khí",
                      en: "A mechanical practical",
                      de: "Praktikum Mechanik",
                      ja: "機械実習の時間",
                      ko: "기계 실습 시간",
                      "zh-TW": "機械實作課",
                    })}
                  </figcaption>
                </figure>

                <figure
                  className={styles.o}
                  data-reveal
                  style={{ "--reveal-delay": "90ms" } as React.CSSProperties}
                >
                  <Image
                    src="/media/vision/cung-thiet-ke-voi-doanh-nghiep.webp"
                    alt={say({
                      vi: "Người của nhà trường và của doanh nghiệp cùng đứng quanh một mô hình thiết bị",
                      en: "School and company people together around a training rig",
                      de: "Schule und Unternehmen gemeinsam an einem Übungsaufbau",
                      ja: "学校と企業の担当者が実習装置を囲む",
                      ko: "학교와 기업 관계자가 실습 장비를 둘러선 자리",
                      "zh-TW": "校方與企業人員一同圍在教學設備旁",
                    })}
                    width={1600}
                    height={900}
                    sizes="(min-width: 1000px) 30vw, 50vw"
                  />
                  <figcaption>
                    {say({
                      vi: "Làm việc cùng doanh nghiệp đối tác",
                      en: "Working with employer partners",
                      de: "Zusammenarbeit mit Partnerunternehmen",
                      ja: "提携企業との協働",
                      ko: "협력 기업과의 협업",
                      "zh-TW": "與合作企業共事",
                    })}
                  </figcaption>
                </figure>
              </div>
            </div>

            <div className={styles.chuyenChu}>
              {page.body ? <Prose markdown={t(page.body, locale)} /> : null}

              <p className={styles.trich}>{dict.brand.motto}</p>

              <div className={styles.chuyenLink}>
                <ArrowLink href={path("/tam-nhin-su-menh")}>{dict.nav.vision}</ArrowLink>
                <ArrowLink href={path("/dao-tao/truong")}>{dict.nav.schools}</ArrowLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------- dải ngắt chương */}
      <section className={styles.dai}>
        <Image
          src="/media/vision/toan-canh-hoang-hon.webp"
          alt={say({
            vi: "Toàn cảnh khu đô thị và cơ sở đào tạo nhìn từ trên cao lúc hoàng hôn",
            en: "An aerial view of the campus and its surroundings at sunset",
            de: "Luftbild des Campus und seiner Umgebung bei Sonnenuntergang",
            ja: "夕日のなか、上空から見たキャンパスとその周辺",
            ko: "해 질 무렵 상공에서 내려다본 캠퍼스와 그 일대",
            "zh-TW": "夕陽下自空中俯瞰的校區與周邊",
          })}
          width={2172}
          height={724}
          sizes="100vw"
          className={styles.daiAnh}
        />
        <div className="shell">
          <p className={styles.daiChu}>
            {say({
              vi: "Giáo dục, đầu tư và khách sạn – lữ hành: ba mảng dưới một cái tên.",
              en: "Education, investment and hospitality: three arms under one name.",
              de: "Bildung, Investition und Hotellerie: drei Bereiche unter einem Namen.",
              ja: "教育、投資、そしてホテル・旅行 — ひとつの名の下に三つの領域。",
              ko: "교육과 투자, 호텔·여행 — 하나의 이름 아래 세 영역.",
              "zh-TW": "教育、投資與飯店旅遊：一個名字下的三大領域。",
            })}
          </p>
        </div>
      </section>

      {/* -------------------------------------------------------- sơ đồ */}
      {soDo ? (
        <section className={`${styles.khoi} ${styles.khoiNen}`}>
          <div className="shell">
            <div className={styles.dauMuc}>
              <p className={styles.deTua}>
                {say({
                  vi: "Cấu trúc",
                  en: "Structure",
                  de: "Struktur",
                  ja: "組織構成",
                  ko: "조직 구성",
                  "zh-TW": "組織架構",
                })}
              </p>
              <h2 className={styles.chuyenTieuDe}>
                {say({
                  vi: "Ba mảng dưới một cái tên",
                  en: "Three arms under one name",
                  de: "Drei Bereiche unter einem Namen",
                  ja: "ひとつの名の下に三つの領域",
                  ko: "하나의 이름 아래 세 영역",
                  "zh-TW": "一個名字，三大領域",
                })}
              </h2>
              <p>
                {say({
                  vi: "Giáo dục, đầu tư và khách sạn – lữ hành, cùng các trường thành viên.",
                  en: "Education, investment, and hospitality, with the member schools.",
                  de: "Bildung, Investition und Hotellerie, mit den Mitgliedsschulen.",
                  ja: "教育、投資、ホテル・旅行、そして加盟各校。",
                  ko: "교육과 투자, 호텔·여행, 그리고 회원 학교들.",
                  "zh-TW": "教育、投資與飯店旅遊，以及各成員學校。",
                })}
              </p>
            </div>

            <figure className={styles.soDo} data-reveal>
              <Image
                src={soDo}
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
              <figcaption>
                {say({
                  vi: "Sơ đồ trích từ hồ sơ năng lực của tập đoàn.",
                  en: "The chart as printed in the group's capability profile.",
                  de: "Das Schaubild aus dem Leistungsprofil der Gruppe.",
                  ja: "グループの会社案内に掲載された組織図。",
                  ko: "그룹 역량 소개서에 실린 조직도.",
                  "zh-TW": "取自集團能力簡介的組織架構圖。",
                })}
              </figcaption>
            </figure>
          </div>
        </section>
      ) : null}

      {/* ------------------------------------------------------- đội ngũ */}
      {anhDoiNgu.length ? (
        <section className={styles.khoi}>
          <div className="shell">
            <div className={styles.dauMuc}>
              <p className={styles.deTua}>
                {say({
                  vi: "Đội ngũ",
                  en: "Leadership",
                  de: "Führung",
                  ja: "経営陣",
                  ko: "경영진",
                  "zh-TW": "經營團隊",
                })}
              </p>
              <h2 className={styles.chuyenTieuDe}>
                {say({
                  vi: "Đội ngũ lãnh đạo",
                  en: "The people who run it",
                  de: "Die Führung der Gruppe",
                  ja: "率いている人たち",
                  ko: "이끄는 사람들",
                  "zh-TW": "領導團隊",
                })}
              </h2>
              <p>
                {say({
                  vi: "Ban lãnh đạo Việt Đức Group tại các lễ kỷ niệm, chuyến công tác và những buổi làm việc với đối tác trong nước và nước ngoài.",
                  en: "The Viet Duc Group leadership at anniversaries, field visits and working sessions with partners at home and abroad.",
                  de: "Die Führung der Viet Duc Group bei Jubiläen, Vor-Ort-Besuchen und Arbeitstreffen mit Partnern.",
                  ja: "記念式典、視察、国内外の提携先との協議に臨む Viet Duc Group の経営陣。",
                  ko: "기념식과 현장 방문, 국내외 협력사와의 업무 협의에 임한 Viet Duc Group 경영진.",
                  "zh-TW": "Viet Duc Group 經營團隊出席週年慶典、實地訪視，以及與國內外夥伴的工作會談。",
                })}
              </p>
            </div>
          </div>
          <div className={`shell ${styles.mosaicWrap}`}>
            <PhotoWall
              shots={anhDoiNgu}
              limit={9}
              moreLabel={(rest) =>
                say({
                  vi: `Và ${rest} ảnh nữa trong kho tư liệu của tập đoàn.`,
                  en: `And ${rest} more in the group's archive.`,
                  de: `Und ${rest} weitere im Archiv der Gruppe.`,
                  ja: `ほかに ${rest} 点がグループの資料庫にあります。`,
                  ko: `그 밖에 ${rest}장이 그룹 자료실에 있습니다.`,
                  "zh-TW": `另有 ${rest} 張存於集團資料庫。`,
                })
              }
            />
          </div>
        </section>
      ) : null}

      {/* -------------------------------------------------------- trường */}
      <section className={`${styles.khoi} ${styles.khoiNen}`}>
        <div className="shell">
          <div className={styles.dauMuc}>
            <p className={styles.deTua}>
              {say({
                vi: "Hệ thống",
                en: "The network",
                de: "Der Verbund",
                ja: "ネットワーク",
                ko: "네트워크",
                "zh-TW": "體系",
              })}
            </p>
            <h2 className={styles.chuyenTieuDe}>{dict.home.schoolsTitle}</h2>
          </div>

          <ul className={styles.crests}>
            {schools.map((school, i) => (
              <li
                key={school.id}
                data-reveal
                style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}
              >
                <Link href={path(`/dao-tao/truong/${school.slug}`)} className={styles.the}>
                  {school.logoPath ? (
                    <Image src={school.logoPath} alt="" width={160} height={160} />
                  ) : null}
                  <span className={styles.theTen}>
                    {t(school.shortName ?? school.name, locale)}
                  </span>
                </Link>
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
