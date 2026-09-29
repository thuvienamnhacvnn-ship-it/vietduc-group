import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, localePath, t, type Locale, pick } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import {
  getCategories,
  getProgramsBySchool,
  getSchool,
  getSourceDocuments,
} from "@/lib/queries";
import { getSiteSettings } from "@/lib/settings";
import { formatDate, levelLabel } from "@/lib/format";
import { resolveSiteUrl, telHref } from "@/lib/site-config";
import { Breadcrumbs, ButtonLink, SectionHeading, SourceNote } from "@/components/ui";
import { PhotoWall } from "@/components/PhotoWall";
import { KhoiNoiDung } from "@/components/KhoiNoiDung";
import { KHOI_DU_AN_TRUONG } from "@/content/du-an-truong";
import { khoAnh } from "@/content/kho-media";
import shell from "../../../page-shell.module.css";
import styles from "./school.module.css";

/*
 * Giữ liền các cụm chỉ LOẠI HÌNH trường trong dòng tiêu đề lớn.
 *
 * Tiếng Việt viết rời từng âm tiết, nên trình duyệt coi "Công nghệ" là hai từ
 * và sẵn sàng ngắt dòng giữa chúng. Ở cỡ chữ tiêu đề thì đó chính là cái
 * "Trường Trung / cấp Công / nghệ Việt Đức" — mỗi dòng kết thúc giữa một cụm
 * từ, đọc lên mất nghĩa.
 *
 * Chỉ dùng cho thẻ h1 của trang này, và chỉ với những cụm có thật trong tên
 * các trường thuộc hệ thống. Không đưa vào `giuLien` của lớp i18n: ở đó nó sẽ
 * tác động lên mọi câu chữ của cả trang web, kể cả đoạn văn thường, nơi việc
 * ghép cứng chẳng giải quyết gì mà lại làm dòng chữ so le.
 */
const CUM_LOAI_TRUONG = [
  "Cao đẳng",
  "Trung cấp",
  "Công nghệ",
  "Kỹ nghệ",
  "Kỹ thuật",
  "Ngoại thương",
  "Quốc tế",
  "Bách khoa",
  "Việt Hàn",
  "Sơ cấp",
];

function ghepCumLoaiTruong(ten: string): string {
  let ra = ten;
  for (const cum of CUM_LOAI_TRUONG) ra = ra.split(cum).join(cum.replaceAll(" ", " "));
  return ra;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "vi";
  const school = await getSchool(slug);
  if (!school) return {};
  const title = t(school.name, locale);
  const description = school.summary ? t(school.summary, locale) : undefined;
  return {
    title,
    description,
    alternates: { canonical: `/${locale}/truong/${slug}` },
    openGraph: { title, description, images: school.coverPath ? [school.coverPath] : undefined },
  };
}

export default async function SchoolPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const school = await getSchool(slug);
  if (!school) notFound();

  const [programs, categories, documents, settings] = await Promise.all([
    getProgramsBySchool(school.id),
    getCategories(),
    getSourceDocuments(),
    getSiteSettings(),
  ]);

  const schoolName = t(school.shortName ?? school.name, locale);
  /* Ảnh của riêng trường này, lấy theo mã định danh của nó. Trường chưa có ảnh
     trong kho thì mảng rỗng và cả mục ảnh không được dựng. */
  const gallery = khoAnh(`schools/${school.slug}`);

  const categoryName = new Map(categories.map((c) => [c.id, t(c.name, locale)]));
  const highlights = school.highlights?.[locale] ?? school.highlights?.vi ?? [];
  const trainingSites = school.trainingSites ?? [];
  /*
   * Số liệu hồ sơ dự án, nếu trường này đang trong giai đoạn đầu tư.
   *
   * Trường đang xây thì phần đáng đọc là hồ sơ dự án — bảng hạng mục, cơ cấu
   * sử dụng đất, vốn, tiến độ — chứ không phải mục ngành nghề đang tuyển sinh,
   * vốn còn trống. Xem src/content/du-an-truong.ts.
   */
  const khoiDuAn = KHOI_DU_AN_TRUONG[school.slug] ?? [];
  const sourceDocument = documents.find((d) => d.slug === school.provenance?.source);
  const tel = telHref(school.phone ?? "");

  /*
   * Các quyết định xếp từ CŨ đến MỚI.
   *
   * Thứ tự trong cơ sở dữ liệu là thứ tự người nhập gõ vào, nên bảng cũ mở đầu
   * bằng quyết định mới nhất rồi lùi dần — đọc ngược. Xếp theo ngày thì trục
   * thời gian tự kể chuyện: cho phép thành lập, đổi tên, rồi cấp phép hoạt
   * động. Quyết định nào thiếu ngày thì dồn xuống cuối chứ không nhảy lên đầu.
   */
  const legalRefs = [...(school.legalRefs ?? [])].sort((a, b) =>
    (a.date || "9999").localeCompare(b.date || "9999"),
  );

  // Group the licensed occupations by level, the way the certificate lists them.
  const byLevel = new Map<string, typeof programs>();
  for (const program of programs) {
    const list = byLevel.get(program.level) ?? [];
    list.push(program);
    byLevel.set(program.level, list);
  }
  const levelOrder = ["cao_dang", "trung_cap", "so_cap", "lien_ket"];

  /*
   * Trường mới lập hồ sơ thì hai cột đều có thể rỗng.
   *
   * Lưới hai cột với cột trái trống để lại một mảng trắng bằng nửa màn hình,
   * còn thẻ "Liên hệ" không có lấy một số điện thoại thì là một cái tiêu đề
   * nói dối. Đo trước, rồi mới chọn dựng cái gì.
   */
  const hasFacts = Boolean(
    school.address || school.phone || school.email || school.website || school.legalNameEn,
  );
  const hasMain = Boolean(
    school.summary ||
      school.stats?.length ||
      highlights.length ||
      khoiDuAn.length ||
      programs.length ||
      trainingSites.length ||
      legalRefs.length,
  );

  const nganhLabel = pick(
    { vi: "ngành", en: "occupations", de: "Berufe", ja: "職種", ko: "직종", "zh-TW": "職種" },
    locale,
  );

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: t(school.name, locale),
    alternateName: school.legalNameEn || undefined,
    description: school.summary ? t(school.summary, locale) : undefined,
    url: `${resolveSiteUrl(settings.seo.siteUrl)}${localePath(locale, `/dao-tao/truong/${school.slug}`)}`,
    address: school.address
      ? { "@type": "PostalAddress", streetAddress: school.address, addressCountry: school.country }
      : undefined,
    telephone: school.phone || undefined,
    email: school.email || undefined,
    parentOrganization: { "@type": "EducationalOrganization", name: settings.seo.siteName },
  };

  return (
    <div className={shell.page}>
      {/*
       * Dải đầu trang mang luôn cả đường dẫn phụ.
       *
       * `on-dark` đổi hướng các biến màu dùng chung, nên đường dẫn phụ và nút
       * phụ của bộ giao diện đọc được trên nền tối mà không phải viết lại màu
       * cho riêng trang này.
       */}
      <header
        className={`${styles.hero} on-dark`}
        data-anh={school.coverPath ? "co" : "khong"}
      >
        {school.coverPath ? (
          <Image
            src={school.coverPath}
            alt={`${t(school.name, locale)} — ${pick(
              {
                vi: "khuôn viên",
                en: "campus",
                de: "Campus",
                ja: "キャンパス",
                ko: "캠퍼스",
                "zh-TW": "校園",
              },
              locale,
            )}`}
            fill
            priority
            sizes="100vw"
            className={styles.heroPhoto}
          />
        ) : null}
        {/* Lớp phủ chỉ cần khi có ảnh. Trường chưa có ảnh thì nền đã là navy,
            phủ thêm chỉ dập tắt quầng vàng dựng sẵn ở góc trên trái. */}
        {school.coverPath ? <div className={styles.heroScrim} aria-hidden="true" /> : null}

        {/*
         * Chưa có ảnh khuôn viên thì chính huy hiệu của trường làm hình nền:
         * phóng lớn, mờ gần hết, nằm khuất bên phải. Dải đầu trang có một hình
         * thật của riêng trường này chứ không phải một mảng gradient dùng
         * chung cho mọi trường chưa có ảnh.
         */}
        {!school.coverPath && school.logoPath ? (
          <Image
            src={school.logoPath}
            alt=""
            width={800}
            height={800}
            aria-hidden="true"
            className={styles.heroWatermark}
            sizes="520px"
          />
        ) : null}

        <div className={`shell ${styles.heroInner}`}>
          <Breadcrumbs
            locale={locale}
            trail={[
              { href: localePath(locale, "/dao-tao/truong"), label: dict.nav.schools },
              { label: t(school.shortName ?? school.name, locale) },
            ]}
          />

          <div className={styles.heroText}>
            {school.logoPath ? (
              <Image
                src={school.logoPath}
                alt=""
                width={320}
                height={320}
                className={styles.crest}
                sizes="92px"
              />
            ) : null}
            {school.city ? <p className={styles.eyebrow}>{t(school.city, locale)}</p> : null}
            <h1>{ghepCumLoaiTruong(t(school.name, locale))}</h1>
            {school.tagline ? <p className={styles.tagline}>{t(school.tagline, locale)}</p> : null}
            <div className={styles.heroActions}>
              <ButtonLink href={localePath(locale, "/dao-tao/dang-ky-tu-van")}>
                {dict.nav.apply}
              </ButtonLink>
              {programs.length ? (
                <ButtonLink
                  href={localePath(locale, `/dao-tao/chuong-trinh?truong=${school.slug}`)}
                  variant="secondary"
                >
                  {dict.nav.programs}
                </ButtonLink>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <div className="shell">
        <div className={`${shell.body} ${hasMain ? shell.bodyWithAside : ""}`}>
          {hasMain ? (
          <div>
            {school.summary ? (
              <section>
                <p className={styles.summary}>{t(school.summary, locale)}</p>
                {sourceDocument ? (
                  <SourceNote
                    locale={locale}
                    source={t(sourceDocument.title, locale)}
                    page={school.provenance?.page}
                  />
                ) : null}
              </section>
            ) : null}

            {school.stats?.length ? (
              <div className={shell.section}>
                <dl className={styles.statGrid}>
                  {school.stats.map((stat) => (
                    <div key={t(stat.label, locale)} className={styles.statCard}>
                      <dt className={styles.statValue}>{stat.value}</dt>
                      <dd className={styles.statLabel}>{t(stat.label, locale)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}

            {highlights.length ? (
              <section className={shell.section}>
                <div className={styles.blockHead}>
                  <h2>
                    {pick(
                      {
                        vi: "Điểm nổi bật",
                        en: "Highlights",
                        de: "Schwerpunkte",
                        ja: "特色",
                        ko: "주요 특징",
                        "zh-TW": "特色亮點",
                      },
                      locale,
                    )}
                  </h2>
                </div>
                <ul className={styles.highlights}>
                  {highlights.map((item, i) => (
                    <li key={item} className={styles.highlightCard}>
                      <span className={styles.highlightIndex} aria-hidden="true">
                        {i + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {khoiDuAn.map((khoi, i) => (
              <KhoiNoiDung key={i} khoi={khoi} locale={locale} />
            ))}

            {programs.length ? (
              <section className={shell.section}>
                <div className={styles.blockHead}>
                  <h2>{dict.nav.programs}</h2>
                  <span className={styles.blockCount}>
                    {programs.length} {nganhLabel}
                  </span>
                </div>
                {levelOrder
                  .filter((level) => byLevel.has(level))
                  .map((level, _i, levels) => {
                    const list = byLevel.get(level)!;
                    /* Trường chỉ có một trình độ thì số ở đầu mục và số ở đầu
                       nhóm là cùng một con số, in hai lần cách nhau 40px. */
                    const showCount = levels.length > 1;
                    return (
                      <div key={level} className={styles.levelGroup}>
                        <div className={styles.levelHead}>
                          <h3 className={styles.levelTitle}>{levelLabel(level, locale)}</h3>
                          <span className={styles.levelRule} aria-hidden="true" />
                          {showCount ? (
                            <span className={styles.levelCount}>
                              {list.length} {nganhLabel}
                            </span>
                          ) : null}
                        </div>
                        <ul className={styles.programGrid}>
                          {list.map((program) => (
                            <li key={program.id} className={styles.programCard}>
                              {program.officialCode ? (
                                <span className={styles.programCode}>{program.officialCode}</span>
                              ) : null}
                              <h4 className={styles.programName}>
                                <Link
                                  href={localePath(
                                    locale,
                                    `/dao-tao/chuong-trinh/${program.slug}`,
                                  )}
                                >
                                  {t(program.title, locale)}
                                </Link>
                              </h4>
                              {program.categoryId ? (
                                <p className={styles.programField}>
                                  {categoryName.get(program.categoryId)}
                                </p>
                              ) : null}
                              {/* Chỉ tiêu chỉ hiện khi giấy phép có ghi. Không
                                  có thì bỏ trống chứ không đoán một con số. */}
                              {program.intakeQuota ? (
                                <p className={styles.programFoot}>
                                  <strong>{program.intakeQuota}</strong>
                                  <span>{dict.explorer.perYear.trim()}</span>
                                </p>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
              </section>
            ) : null}

            {trainingSites.length ? (
              <section className={shell.section}>
                <div className={styles.blockHead}>
                  <h2>
                    {pick(
                      {
                        vi: "Địa điểm đào tạo",
                        en: "Training sites",
                        de: "Ausbildungsstandorte",
                        ja: "実習拠点",
                        ko: "교육 장소",
                        "zh-TW": "培訓地點",
                      },
                      locale,
                    )}
                  </h2>
                </div>
                <ul className={styles.siteGrid}>
                  {trainingSites.map((site, i) => (
                    <li key={site} className={styles.siteCard}>
                      <span className={styles.siteIndex} aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path
                            d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"
                            strokeLinejoin="round"
                          />
                          <circle cx="12" cy="10" r="2.5" />
                        </svg>
                      </span>
                      <span className={styles.siteBody}>
                        <span className={styles.siteLabel}>
                          {pick(
                            {
                              vi: "Cơ sở",
                              en: "Site",
                              de: "Standort",
                              ja: "拠点",
                              ko: "캠퍼스",
                              "zh-TW": "校區",
                            },
                            locale,
                          )}{" "}
                          {i + 1}
                        </span>
                        <span className={styles.siteText}>{site}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {legalRefs.length ? (
              <section className={shell.section}>
                <div className={styles.blockHead}>
                  <h2>
                    {pick(
                      {
                        vi: "Hồ sơ pháp lý",
                        en: "Legal record",
                        de: "Rechtliche Grundlage",
                        ja: "法的記録",
                        ko: "법적 기록",
                        "zh-TW": "法律文件紀錄",
                      },
                      locale,
                    )}
                  </h2>
                </div>
                <ol className={styles.timeline}>
                  {legalRefs.map((ref) => (
                    <li key={`${ref.number}-${ref.date}`} className={styles.timelineItem}>
                      <div className={styles.timelineTop}>
                        <span className={styles.timelineNumber}>{ref.number}</span>
                        {ref.date ? (
                          <time className={styles.timelineDate} dateTime={ref.date}>
                            {formatDate(ref.date, locale)}
                          </time>
                        ) : null}
                      </div>
                      <p className={styles.timelineLabel}>{t(ref.label, locale)}</p>
                      <p className={styles.timelineIssuer}>{t(ref.issuer, locale)}</p>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}
          </div>
          ) : null}

          <aside
            className={`${shell.aside} ${hasMain ? shell.asideSticky : styles.asideAlone}`}
          >
            {hasFacts ? (
              <>
            <h2 className={shell.asideTitle}>{dict.contact.title}</h2>
            <dl className={shell.factList}>
              {school.address ? (
                <div>
                  <dt>{dict.contact.headquarters}</dt>
                  <dd>{school.address}</dd>
                </div>
              ) : null}
              {school.phone ? (
                <div>
                  <dt>{dict.contact.phone}</dt>
                  <dd>{tel ? <a href={tel}>{school.phone}</a> : school.phone}</dd>
                </div>
              ) : null}
              {school.email ? (
                <div>
                  <dt>{dict.contact.email}</dt>
                  <dd>
                    <a href={`mailto:${school.email}`}>{school.email}</a>
                  </dd>
                </div>
              ) : null}
              {school.website ? (
                <div>
                  <dt>{dict.contact.website}</dt>
                  <dd>
                    <a href={school.website} target="_blank" rel="noopener noreferrer">
                      {school.website.replace(/^https?:\/\//, "")}
                    </a>
                  </dd>
                </div>
              ) : null}
              {school.legalNameEn ? (
                <div>
                  <dt>
                    {pick(
                      {
                        vi: "Tên giao dịch quốc tế",
                        en: "International name",
                        de: "Internationaler Name",
                        ja: "英文名称",
                        ko: "국제 명칭",
                        "zh-TW": "國際名稱",
                      },
                      locale,
                    )}
                  </dt>
                  <dd>{school.legalNameEn}</dd>
                </div>
              ) : null}
            </dl>
              </>
            ) : (
              /* Chưa có một thông tin liên hệ nào. Nói thẳng là tài liệu chưa
                 công bố, thay vì dựng một thẻ "Liên hệ" rỗng ruột. */
              <p className={styles.emptyNote}>{dict.program.notInDocuments}</p>
            )}

            {/* Không có ngành nào thì nút này dẫn tới một bộ lọc rỗng. */}
            {programs.length ? (
              <ButtonLink
                href={localePath(locale, `/dao-tao/chuong-trinh?truong=${school.slug}`)}
                variant="secondary"
              >
                {dict.nav.programs}
              </ButtonLink>
            ) : null}
            <ButtonLink href={localePath(locale, "/dao-tao/dang-ky-tu-van")}>
              {dict.nav.apply}
            </ButtonLink>
          </aside>
        </div>
      </div>

      {/* Ảnh của chính trường này. Trường nào chưa có ảnh trong kho thì cả
          mục biến mất chứ không mượn ảnh của trường khác. */}
      {gallery.length ? (
        <section className={`section ${styles.gallerySection}`}>
          <div className="shell">
            <SectionHeading
              eyebrow={pick({ vi: "Hình ảnh", en: "Photographs", de: "Bilder", ja: "写真", ko: "사진", "zh-TW": "照片" }, locale)}
              title={pick(
                {
                  vi: `Tại ${schoolName}`,
                  en: `At ${schoolName}`,
                  de: `An der ${schoolName}`,
                  ja: `${schoolName}の写真`,
                  ko: `${schoolName} 사진`,
                  "zh-TW": `${schoolName}照片`,
                },
                locale,
              )}
            />
            <PhotoWall
              shots={gallery.map((src) => ({ src, alt: schoolName }))}
              /* Hiện hết. Trang của một trường là chỗ để xem ảnh trường đó,
                 cắt bớt ở đây là giấu đúng thứ người ta vào để xem. */
              limit={gallery.length}
              moreLabel={(rest) =>
                pick(
                  {
                    vi: `Và ${rest} ảnh nữa trong kho tư liệu của trường.`,
                    en: `And ${rest} more in the school's archive.`,
                    de: `Und ${rest} weitere im Archiv der Schule.`,
                    ja: `学校の資料庫にはほかに${rest}枚の写真があります。`,
                    ko: `학교 자료실에 사진 ${rest}장이 더 있습니다.`,
                    "zh-TW": `校方資料庫中還有 ${rest} 張照片。`,
                  },
                  locale,
                )
              }
            />
          </div>
        </section>
      ) : null}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
    </div>
  );
}
