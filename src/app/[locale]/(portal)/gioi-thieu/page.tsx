import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, localePath, t, type Locale, pick as pickLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getPage, getSchools } from "@/lib/queries";
import { ArrowLink, Breadcrumbs, Prose } from "@/components/ui";
import { PhotoWall } from "@/components/PhotoWall";
import { SoDoHeSinhThai, type Nhanh } from "@/components/SoDoHeSinhThai";
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

  const [page, schools] = await Promise.all([getPage(SLUG), getSchools()]);
  if (!page) notFound();

  /* Gói chữ tại chỗ cho gọn; thiếu ngôn ngữ nào thì `pick` lùi về tiếng Việt. */
  const say = (map: Parameters<typeof pickLocale<string>>[0]): string => pickLocale(map, locale);

  /*
   * Hai vòng của sơ đồ hệ sinh thái.
   *
   * Vòng trong là năm thương hiệu, vòng ngoài là các trường thành viên. Logo
   * đều đã tách nền bằng `_tach-logo.mjs`; trường thì suy đường dẫn từ chính
   * `logoPath` trong cơ sở dữ liệu, nên thêm trường mới là sơ đồ tự có thêm
   * một nhánh mà không phải sửa gì ở đây.
   */
  const thuongHieu: Nhanh[] = [
    {
      src: "/media/so-do/vgie.png",
      ten: { vi: "VGIE", en: "VGIE", de: "VGIE", ja: "VGIE", ko: "VGIE", "zh-TW": "VGIE" },
    },
    {
      src: "/media/so-do/dau-tu-du-lich.png",
      ten: {
        vi: "Việt Đức – Đầu tư & Du lịch",
        en: "Viet Duc – Investment & Tourism",
        de: "Viet Duc – Investment & Tourismus",
        ja: "Viet Duc — 投資・観光",
        ko: "Viet Duc — 투자·관광",
        "zh-TW": "Viet Duc — 投資與觀光",
      },
    },
    {
      src: "/media/so-do/khach-san-lu-hanh.png",
      ten: {
        vi: "Việt Đức – Khách sạn & Lữ hành",
        en: "Viet Duc – Hotel & Travel",
        de: "Viet Duc – Hotel & Reisen",
        ja: "Viet Duc — ホテル・旅行",
        ko: "Viet Duc — 호텔·여행",
        "zh-TW": "Viet Duc — 飯店與旅遊",
      },
    },
    {
      src: "/media/so-do/golden-dragon.png",
      ten: {
        vi: "Golden Dragon Hotel",
        en: "Golden Dragon Hotel",
        de: "Golden Dragon Hotel",
        ja: "Golden Dragon Hotel",
        ko: "Golden Dragon Hotel",
        "zh-TW": "Golden Dragon Hotel",
      },
    },
    {
      src: "/media/so-do/shdc.png",
      ten: {
        vi: "SHDC – Du lịch sinh thái",
        en: "SHDC – Ecotourism",
        de: "SHDC – Ökotourismus",
        ja: "SHDC — エコツーリズム",
        ko: "SHDC — 생태 관광",
        "zh-TW": "SHDC — 生態旅遊",
      },
    },
  ];

  const nhanhTruong: Nhanh[] = schools
    .filter((s) => s.logoPath)
    .map((s) => ({
      src: s.logoPath!.replace("/media/schools/logos/", "/media/so-do/truong-").replace(/.webp$/, ".png"),
      ten: (s.shortName ?? s.name) as Nhanh["ten"],
      href: path(`/dao-tao/truong/${s.slug}`),
    }));

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
      <div className="shell">
        <Breadcrumbs locale={locale} trail={[{ label: t(page.title, locale) }]} />
      </div>

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
            width={1742}
            height={724}
            priority
            sizes="100vw"
            className={styles.moAnh}
          />
          <span className={styles.moPhu} aria-hidden="true" />
          <span className={styles.moPhuDuoi} aria-hidden="true" />

          {/*
            Chữ đặt trên mảng tối bên trái của banner.
            Bức này có một vùng navy phẳng chạy dọc mép trái, dựng riêng để đặt
            chữ — khác hẳn những bức trước, nơi nhân vật đứng chính giữa và mọi
            dòng chữ phủ lên đều rơi vào mặt. Vẫn có một lớp phủ mỏng bên dưới
            phòng khi ảnh được thay bằng bức khác sáng hơn.
          */}
          <div className={styles.moLop}>
            <div className={`shell ${styles.moChu}`}>
              <div className={styles.moTrong} data-reveal>
                <Image
                  src="/media/so-do/viet-duc-group.png"
                  alt={dict.brand.name}
                  width={465}
                  height={327}
                  className={styles.moLogo}
                  priority
                />

                <p className={styles.deTua}>
                  <span className={styles.gach} aria-hidden="true" />
                  {t(page.title, locale)}
                </p>

                <h1 className={styles.moTieuDe}>
                  {say({
                    vi: "Hệ thống giáo dục nghề nghiệp Việt Đức",
                    en: "The Viet Duc vocational education system",
                    de: "Das Berufsbildungssystem der Viet Duc Group",
                    ja: "Viet Duc の職業教育ネットワーク",
                    ko: "Viet Duc 직업교육 체계",
                    "zh-TW": "Viet Duc 技職教育體系",
                  })}
                </h1>

                <span className={styles.vach} aria-hidden="true" />

                <p className={styles.moDan}>
                  {say({
                    vi: "Hiện đại và luôn đổi mới",
                    en: "Modern, and always renewing itself",
                    de: "Modern und stets in Erneuerung",
                    ja: "現代的であり、つねに新しくありつづける",
                    ko: "현대적이며, 끊임없이 새로워지는",
                    "zh-TW": "現代化，且不斷革新",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/*
          Mạng lưới nhánh, đặt liền ngay dưới banner trong cùng một nền tối.
          Trước đây nó là một mục riêng cách banner cả màn hình, và vì là vòng
          tròn 760px nên chiếm chỗ như một trang con. Ở đây nó dẹt lại thành
          một dải ngang, nối tiếp banner thành một khối mở đầu duy nhất.
        */}
        <div className="shell">
          <SoDoHeSinhThai
            locale={locale}
            tam={{
              src: "/media/so-do/viet-duc-group.png",
              ten: {
                vi: "Việt Đức Group",
                en: "Viet Duc Group",
                de: "Viet Duc Group",
                ja: "Viet Duc Group",
                ko: "Viet Duc Group",
                "zh-TW": "Viet Duc Group",
              },
            }}
            vongTrong={thuongHieu}
            vongNgoai={nhanhTruong}
          />
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
