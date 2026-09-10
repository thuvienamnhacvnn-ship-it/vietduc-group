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
import { Breadcrumbs, ButtonLink, SectionHeading, SourceNote, StatRow } from "@/components/ui";
import { PhotoWall } from "@/components/PhotoWall";
import { KhoiNoiDung } from "@/components/KhoiNoiDung";
import { KHOI_DU_AN_TRUONG } from "@/content/du-an-truong";
import { khoAnh } from "@/content/kho-media";
import shell from "../../../page-shell.module.css";
import styles from "./school.module.css";

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

  // Group the licensed occupations by level, the way the certificate lists them.
  const byLevel = new Map<string, typeof programs>();
  for (const program of programs) {
    const list = byLevel.get(program.level) ?? [];
    list.push(program);
    byLevel.set(program.level, list);
  }
  const levelOrder = ["cao_dang", "trung_cap", "so_cap", "lien_ket"];

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
      <div className="shell">
        <Breadcrumbs
          locale={locale}
          trail={[
            { href: localePath(locale, "/dao-tao/truong"), label: dict.nav.schools },
            { label: t(school.shortName ?? school.name, locale) },
          ]}
        />
      </div>

      <header className={styles.hero}>
        <div className={`shell ${styles.heroInner}`}>
          <div className={styles.heroText}>
            {school.logoPath ? (
              <Image
                src={school.logoPath}
                alt=""
                width={320}
                height={320}
                className={styles.crest}
                sizes="80px"
              />
            ) : null}
            <h1>{t(school.name, locale)}</h1>
            {school.tagline ? <p className={styles.tagline}>{t(school.tagline, locale)}</p> : null}
            {school.city ? <p className={styles.place}>{t(school.city, locale)}</p> : null}
          </div>
          {school.coverPath ? (
            <div className={styles.heroMedia}>
              <Image
                src={school.coverPath}
                alt={`${t(school.name, locale)} — ${
                  pick({ vi: "khuôn viên", en: "campus", de: "Campus", ja: "キャンパス", ko: "캠퍼스", "zh-TW": "校園" }, locale)
                }`}
                width={1400}
                height={1000}
                priority
                sizes="(min-width: 1000px) 50vw, 100vw"
                className={styles.heroImage}
              />
            </div>
          ) : null}
        </div>
      </header>

      <div className="shell">
        <div className={`${shell.body} ${shell.bodyWithAside}`}>
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
                <StatRow
                  stats={school.stats.map((stat) => ({
                    value: stat.value,
                    label: t(stat.label, locale),
                  }))}
                />
              </div>
            ) : null}

            {highlights.length ? (
              <section className={shell.section}>
                <h2 className={shell.sectionTitle}>
                  {pick({ vi: "Điểm nổi bật", en: "Highlights", de: "Schwerpunkte", ja: "特色", ko: "주요 특징", "zh-TW": "特色亮點" }, locale)}
                </h2>
                <ul className={styles.highlights}>
                  {highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {khoiDuAn.map((khoi, i) => (
              <KhoiNoiDung key={i} khoi={khoi} locale={locale} />
            ))}

            {programs.length ? (
              <section className={shell.section}>
                <h2 className={shell.sectionTitle}>{dict.nav.programs}</h2>
                {levelOrder
                  .filter((level) => byLevel.has(level))
                  .map((level) => (
                    <div key={level} className={styles.levelGroup}>
                      <h3 className={styles.levelTitle}>{levelLabel(level, locale)}</h3>
                      <ul className={styles.programList}>
                        {byLevel.get(level)!.map((program) => (
                          <li key={program.id}>
                            <Link href={localePath(locale, `/dao-tao/chuong-trinh/${program.slug}`)}>
                              {t(program.title, locale)}
                            </Link>
                            <span className={styles.programMeta}>
                              {program.officialCode ? `${program.officialCode} · ` : ""}
                              {program.categoryId ? categoryName.get(program.categoryId) : ""}
                              {program.intakeQuota
                                ? ` · ${program.intakeQuota}${dict.explorer.perYear}`
                                : ""}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </section>
            ) : null}

            {school.legalRefs?.length ? (
              <section className={shell.section}>
                <h2 className={shell.sectionTitle}>
                  {pick({ vi: "Hồ sơ pháp lý", en: "Legal record", de: "Rechtliche Grundlage", ja: "法的記録", ko: "법적 기록", "zh-TW": "法律文件紀錄" }, locale)}
                </h2>
                <div className={shell.tableScroll}>
                  <table className={shell.legalTable}>
                    <thead>
                      <tr>
                        <th scope="col">{pick({ vi: "Văn bản", en: "Document", de: "Dokument", ja: "文書", ko: "문서", "zh-TW": "文件" }, locale)}</th>
                        <th scope="col">{pick({ vi: "Số hiệu", en: "Number", de: "Nummer", ja: "文書番号", ko: "문서 번호", "zh-TW": "文號" }, locale)}</th>
                        <th scope="col">{pick({ vi: "Ngày", en: "Date", de: "Datum", ja: "日付", ko: "날짜", "zh-TW": "日期" }, locale)}</th>
                        <th scope="col">{pick({ vi: "Cơ quan cấp", en: "Issued by", de: "Aussteller", ja: "発行機関", ko: "발급 기관", "zh-TW": "核發機關" }, locale)}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {school.legalRefs.map((ref) => (
                        <tr key={`${ref.number}-${ref.date}`}>
                          <td>{t(ref.label, locale)}</td>
                          <td>{ref.number}</td>
                          <td>{formatDate(ref.date, locale)}</td>
                          <td>{t(ref.issuer, locale)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ) : null}
          </div>

          <aside className={`${shell.aside} ${shell.asideSticky}`}>
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
                  <dt>{pick({ vi: "Tên giao dịch quốc tế", en: "International name", de: "Internationaler Name", ja: "英文名称", ko: "국제 명칭", "zh-TW": "國際名稱" }, locale)}</dt>
                  <dd>{school.legalNameEn}</dd>
                </div>
              ) : null}
            </dl>

            <ButtonLink href={localePath(locale, `/dao-tao/chuong-trinh?truong=${school.slug}`)} variant="secondary">
              {dict.nav.programs}
            </ButtonLink>
            <ButtonLink href={localePath(locale, "/dao-tao/dang-ky-tu-van")}>{dict.nav.apply}</ButtonLink>
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
              title={
                pick({
                  vi: `Tại ${schoolName}`,
                  en: `At ${schoolName}`,
                  de: `An der ${schoolName}`,
                }, locale)
              }
            />
            <PhotoWall
              shots={gallery.map((src) => ({ src, alt: schoolName }))}
              /* Hiện hết. Trang của một trường là chỗ để xem ảnh trường đó,
                 cắt bớt ở đây là giấu đúng thứ người ta vào để xem. */
              limit={gallery.length}
              moreLabel={(rest) =>
                pick({
                  vi: `Và ${rest} ảnh nữa trong kho tư liệu của trường.`,
                  en: `And ${rest} more in the school's archive.`,
                  de: `Und ${rest} weitere im Archiv der Schule.`,
                }, locale)
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
