import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, localePath, t, type Locale, pick } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getPrograms, getSchools } from "@/lib/queries";
import { telHref } from "@/lib/site-config";
import { Breadcrumbs, SectionHeading } from "@/components/ui";
import { SchoolGrid } from "@/components/SchoolGrid";
import shell from "../../page-shell.module.css";
import styles from "./schools.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "vi";
  const dict = getDictionary(locale);
  return {
    title: dict.nav.schools,
    description: pick(
      {
        vi: "Các trường thành viên của Việt Đức Group tại Việt Nam và CHLB Đức.",
        en: "The member schools of Viet Duc Group, in Vietnam and Germany.",
        de: "Die Mitgliedsschulen der Viet Duc Group in Vietnam und Deutschland.",
        ja: "ベトナムとドイツ連邦共和国にある Viet Duc Group の加盟校。",
        ko: "다낭, 닌빈, 붕따우, 동나이, 꽝찌, 베를린에 있는 Viet Duc Group의 여섯 회원 학교.",
        "zh-TW": "Viet Duc Group 位於峴港、寧平、頭頓、同奈、廣治與柏林的六所成員學校。",
      },
      locale,
    ),
    alternates: { canonical: `/${locale}/dao-tao/truong` },
  };
}

/**
 * Các trường thành viên.
 *
 * Trang này trước đây chỉ có tiêu đề và lưới sáu thẻ, còn địa chỉ, điện thoại
 * và trang web của từng trường thì nằm nhờ trong trang Liên hệ. Hệ thống sáu
 * trường lại chính là thứ tập đoàn có mà nơi khác không có, nên nó cần một
 * trang đứng được một mình: mở đầu có sức nặng, những con số lấy thẳng từ dữ
 * liệu chứ không viết tay, dải địa bàn trải từ miền Trung sang Berlin, rồi
 * danh bạ đầy đủ của từng trường.
 */
export default async function SchoolsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const [schools, programs] = await Promise.all([getSchools(), getPrograms()]);

  const counts = new Map<number, number>();
  for (const program of programs) {
    if (program.schoolId == null) continue;
    counts.set(program.schoolId, (counts.get(program.schoolId) ?? 0) + 1);
  }

  /* Địa bàn lấy từ chính dữ liệu trường, bỏ trùng, giữ nguyên thứ tự. */
  const places: string[] = [];
  for (const school of schools) {
    const city = school.city ? t(school.city, locale) : "";
    if (city && !places.includes(city)) places.push(city);
  }

  /* Số quốc gia đếm từ cột country chứ không viết cứng: mở thêm một trường ở
     nước khác thì con số tự đúng, không ai phải nhớ ra mà sửa. */
  const countries = new Set(schools.map((s) => s.country)).size;

  const soNganh = (count: number) =>
    pick(
      {
        vi: `${count} ngành`,
        en: `${count} programmes`,
        de: `${count} Programme`,
        ja: `${count} 課程`,
        ko: `${count}개 과정`,
        "zh-TW": `${count} 個課程`,
      },
      locale,
    );

  const figures = [
    {
      value: String(schools.length),
      label: pick(
        {
          vi: "trường thành viên",
          en: "member schools",
          de: "Mitgliedsschulen",
          ja: "加盟校",
          ko: "회원 학교",
          "zh-TW": "所成員學校",
        },
        locale,
      ),
    },
    {
      value: String(programs.length),
      label: pick(
        {
          vi: "ngành đã đăng ký hoạt động",
          en: "registered occupations",
          de: "registrierte Berufsprofile",
          ja: "認可を受けた職種",
          ko: "인가받은 직종",
          "zh-TW": "個已立案職類",
        },
        locale,
      ),
    },
    {
      value: String(places.length),
      label: pick(
        {
          vi: "địa bàn đào tạo",
          en: "locations",
          de: "Standorte",
          ja: "の教育拠点",
          ko: "곳의 교육 거점",
          "zh-TW": "個培訓據點",
        },
        locale,
      ),
    },
    {
      value: String(countries),
      label: pick(
        {
          vi: "quốc gia",
          en: "countries",
          de: "Länder",
          ja: "か国",
          ko: "개국",
          "zh-TW": "個國家",
        },
        locale,
      ),
    },
  ];

  const nhanDiaChi = pick(
    { vi: "Địa chỉ", en: "Address", de: "Adresse", ja: "所在地", ko: "주소", "zh-TW": "地址" },
    locale,
  );

  return (
    <div className={shell.page}>
      <section className={styles.hero}>
        <span className={styles.heroGlow} aria-hidden="true" />
        <div className={`shell ${styles.heroInner}`}>
          <Breadcrumbs locale={locale} trail={[{ label: dict.nav.schools }]} />

          <p className={styles.eyebrow}>
            {pick(
              {
                vi: "Hệ thống",
                en: "The network",
                de: "Der Verbund",
                ja: "ネットワーク",
                ko: "네트워크",
                "zh-TW": "體系",
              },
              locale,
            )}
          </p>
          <h1 className={styles.title}>{dict.home.schoolsTitle.replace("{n}", String(schools.length))}</h1>
          <p className={styles.lead}>
            {pick(
              {
                vi: "Mỗi trường có thế mạnh ngành nghề và địa bàn riêng, nhưng cùng một chuẩn đào tạo và cùng một mạng lưới doanh nghiệp. Số ngành ghi ở đây là số ngành đã đăng ký hoạt động giáo dục nghề nghiệp, trích từ giấy chứng nhận có số hiệu và ngày cấp.",
                en: "Each school has its own strengths and its own part of the country, but they share one training standard and one network of employers. The programme counts here are the occupations registered on each school's licence, with its number and date of issue.",
                de: "Jede Schule hat eigene Schwerpunkte und einen eigenen Standort, teilt aber denselben Ausbildungsstandard und dasselbe Unternehmensnetz. Die Zahlen nennen die auf der jeweiligen Urkunde registrierten Berufsprofile.",
                ja: "学校ごとに得意分野も所在地も違いますが、教育の水準と企業のネットワークは同じものを共有しています。ここに記した課程数は、各校の立案証明書に登録された職種の数です。",
                ko: "학교마다 강점 분야와 자리 잡은 지역이 다르지만, 교육의 기준과 기업 네트워크는 같은 것을 함께 씁니다. 여기 적힌 과정 수는 각 학교 인가증에 등록된 직종의 수입니다.",
                "zh-TW": "每所學校各有專長領域與所在地區，但共用同一套培訓標準與同一個企業網絡。此處所列課程數，為各校立案證明書上登記的職類數量。",
              },
              locale,
            )}
          </p>

          <dl className={styles.figures}>
            {figures.map((f) => (
              <div key={f.label} className={styles.figure}>
                <dd className={styles.figureValue}>{f.value}</dd>
                <dt className={styles.figureLabel}>{f.label}</dt>
              </div>
            ))}
          </dl>

          <ul className={styles.places}>
            {places.map((place) => (
              <li key={place} className={styles.place}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M12 21s7-5.4 7-10.4A7 7 0 0 0 5 10.6C5 15.6 12 21 12 21Z" strokeLinejoin="round" />
                  <circle cx="12" cy="10.4" r="2.4" />
                </svg>
                {place}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Sáu khuôn viên, mỗi trường một tấm ảnh của chính nó. */}
      <section className="shell">
        <SchoolGrid
          schools={schools}
          locale={locale}
          programCount={(id) => counts.get(id) ?? 0}
          countLabel={(count) =>
            count > 0
              ? soNganh(count)
              : pick(
                  {
                    vi: "Đang cập nhật",
                    en: "Being updated",
                    de: "Wird ergänzt",
                    ja: "更新中",
                    ko: "업데이트 중",
                    "zh-TW": "更新中",
                  },
                  locale,
                )
          }
        />
      </section>

      {/* Danh bạ: nơi ở, số điện thoại, hòm thư của từng trường. */}
      <section className={styles.directory}>
        <div className="shell">
          <SectionHeading
            eyebrow={pick(
              {
                vi: "Danh bạ",
                en: "Directory",
                de: "Verzeichnis",
                ja: "連絡先一覧",
                ko: "연락처",
                "zh-TW": "通訊錄",
              },
              locale,
            )}
            title={pick(
              {
                vi: "Liên hệ từng trường",
                en: "Reach a school directly",
                de: "Direkt zur Schule",
                ja: "各校へ直接",
                ko: "각 학교로 바로 연락",
                "zh-TW": "直接聯絡各校",
              },
              locale,
            )}
            lead={pick(
              {
                vi: "Phòng tuyển sinh của từng trường trả lời chính xác nhất về ngành, điều kiện và học phí của trường đó.",
                en: "Each school's admissions office gives the most exact answer about its own programmes, entry requirements and fees.",
                de: "Das Zulassungsbüro jeder Schule beantwortet Fragen zu ihren Programmen, Zugangsvoraussetzungen und Gebühren am genauesten.",
                ja: "課程・出願条件・学費について最も正確に答えられるのは、その学校の入学窓口です。",
                ko: "과정과 지원 자격, 학비에 대해 가장 정확히 답해 드릴 수 있는 곳은 그 학교의 입학 부서입니다.",
                "zh-TW": "關於課程、入學條件與學費，各校招生單位能給出最準確的答覆。",
              },
              locale,
            )}
          />

          <ol className={styles.list}>
            {schools.map((school) => {
              const name = t(school.shortName ?? school.name, locale);
              const city = school.city ? t(school.city, locale) : "";
              const count = counts.get(school.id) ?? 0;
              const tel = telHref(school.phone ?? "");

              return (
                <li key={school.id} className={styles.entry} data-reveal suppressHydrationWarning>
                  <span className={styles.crest}>
                    {school.logoPath ? (
                      <Image src={school.logoPath} alt="" width={160} height={160} />
                    ) : null}
                  </span>

                  <div className={styles.entryMain}>
                    {city ? <span className={styles.entryCity}>{city}</span> : null}
                    <h3 className={styles.entryName}>
                      <Link href={localePath(locale, `/dao-tao/truong/${school.slug}`)}>{name}</Link>
                    </h3>
                    {school.tagline ? (
                      <p className={styles.entryTagline}>{t(school.tagline, locale)}</p>
                    ) : null}
                    <p className={styles.entryMeta}>
                      {count > 0 ? <span className={styles.entryBadge}>{soNganh(count)}</span> : null}
                      {school.legalNameEn ? <span>{school.legalNameEn}</span> : null}
                    </p>
                  </div>

                  <div className={styles.contact}>
                    {school.address ? (
                      <div>
                        <span className={styles.contactLabel}>{nhanDiaChi}</span>
                        <span>{school.address}</span>
                      </div>
                    ) : null}
                    {school.phone ? (
                      <div>
                        <span className={styles.contactLabel}>{dict.contact.phone}</span>
                        {tel ? <a href={tel}>{school.phone}</a> : <span>{school.phone}</span>}
                      </div>
                    ) : null}
                    {school.email ? (
                      <div>
                        <span className={styles.contactLabel}>{dict.contact.email}</span>
                        <a href={`mailto:${school.email}`}>{school.email}</a>
                      </div>
                    ) : null}
                    {school.website ? (
                      <div>
                        <span className={styles.contactLabel}>{dict.contact.website}</span>
                        <a href={school.website} target="_blank" rel="noopener noreferrer">
                          {school.website.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </div>
  );
}
