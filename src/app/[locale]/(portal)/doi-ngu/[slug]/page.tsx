import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, t, tList, type Locale, pick } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getPersonBySlug, getSchools } from "@/lib/queries";
import { Breadcrumbs } from "@/components/ui";
import { ChanDung } from "@/components/nhan-su/ChanDung";
import shell from "../../page-shell.module.css";
import styles from "./profile.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "vi";
  const nguoi = await getPersonBySlug(slug);
  if (!nguoi) return { title: getDictionary(locale).nav.people };
  const ten = [nguoi.honorific, nguoi.name].filter(Boolean).join(" ");
  return {
    title: ten,
    description: nguoi.headline ? t(nguoi.headline, locale) : undefined,
    alternates: { canonical: `/${locale}/doi-ngu/${slug}` },
  };
}

/**
 * Hồ sơ một người.
 *
 * Thứ tự các mục theo đúng cái người đọc muốn biết trước: ông/bà này đang giữ
 * chức gì ở đâu, rồi mới đến tiểu sử, học vấn và hành trình. Hồ sơ gốc mở đầu
 * bằng một câu trích dẫn nên câu ấy giữ nguyên vị trí mở đầu ở đây.
 *
 * Mục nào tài liệu không có thì KHÔNG hiện khung rỗng — hồ sơ mỗi người viết
 * một khác, có người có bảng hành trình công tác, có người chỉ có phần định
 * hướng, và một cái khung trống có tiêu đề chỉ làm trang trông dở dang.
 */
export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const nguoi = await getPersonBySlug(slug);
  if (!nguoi) notFound();

  const truong = await getSchools();
  const tenTruong = new Map(truong.map((s) => [s.id, t(s.shortName ?? s.name, locale)]));

  const nhan = {
    chucVu: pick({ vi: "Chức vụ đang đảm nhiệm", en: "Current appointments", de: "Aktuelle Ämter", ja: "現在の役職", ko: "현재 직책", "zh-TW": "現任職務" }, locale),
    tongQuan: pick({ vi: "Tổng quan", en: "Overview", de: "Überblick", ja: "概要", ko: "개요", "zh-TW": "概覽" }, locale),
    hocVan: pick({ vi: "Trình độ & học vấn", en: "Qualifications", de: "Qualifikationen", ja: "学歴・資格", ko: "학력·자격", "zh-TW": "學歷與資格" }, locale),
    nangLuc: pick({ vi: "Năng lực cốt lõi", en: "Core strengths", de: "Kernkompetenzen", ja: "中核となる強み", ko: "핵심 역량", "zh-TW": "核心能力" }, locale),
    congTac: pick({ vi: "Hành trình công tác", en: "Career history", de: "Beruflicher Werdegang", ja: "職歴", ko: "경력", "zh-TW": "工作經歷" }, locale),
    dauAn: pick({ vi: "Dấu ấn kinh nghiệm", en: "Experience highlights", de: "Erfahrungsschwerpunkte", ja: "経験の要点", ko: "경험의 요점", "zh-TW": "經驗亮點" }, locale),
    trongTam: pick({ vi: "Trọng tâm hành động", en: "Priorities", de: "Schwerpunkte", ja: "重点課題", ko: "중점 과제", "zh-TW": "行動重點" }, locale),
    dinhHuong: pick({ vi: "Định hướng", en: "Direction", de: "Ausrichtung", ja: "方針", ko: "방향", "zh-TW": "方向" }, locale),
    namSinh: pick({ vi: "Năm sinh", en: "Year of birth", de: "Geburtsjahr", ja: "生年", ko: "출생 연도", "zh-TW": "出生年" }, locale),
    quayLai: pick({ vi: "Tất cả nhân sự", en: "All people", de: "Alle Personen", ja: "一覧へ戻る", ko: "전체 보기", "zh-TW": "全部人員" }, locale),
  };

  /*
   * Bản dọc của ảnh, do `npm run media:nhan-su` xuất ra cạnh bản vuông.
   *
   * Suy từ tên tệp chứ không lưu thêm một cột trong bảng: hai bản luôn được
   * sinh cùng lúc từ cùng một ảnh gốc, nên tên chúng đi liền nhau theo quy ước.
   */
  const anhDoc = nguoi.photoPath ? nguoi.photoPath.replace(/\.webp$/, "-doc.webp") : null;

  const congTac = nguoi.career ?? [];
  const hocVan = nguoi.education ?? [];
  const nangLuc = nguoi.competencies ?? [];
  const tongQuan = nguoi.overview ? tList(nguoi.overview, locale) : [];
  const dauAn = nguoi.highlights ? tList(nguoi.highlights, locale) : [];
  const trongTam = nguoi.focus ? tList(nguoi.focus, locale) : [];

  return (
    <div className={shell.page}>
      <div className="shell">
        <Breadcrumbs
          locale={locale}
          trail={[{ label: dict.nav.people, href: `/${locale}/doi-ngu` }, { label: nguoi.name }]}
        />

        {/*
          Đầu trang hồ sơ: ảnh lớn, không phải một đĩa tròn nhỏ cạnh dòng tên.

          Đây là hồ sơ lãnh đạo của một tập đoàn, nên trang phải mở ra bằng
          chính con người ấy ở khổ lớn — tên, chức danh và câu nói đứng cạnh
          ảnh trên một nền tối liền mạch, chứ không phải mấy dòng chữ xếp trên
          một cái ảnh đại diện cỡ con tem.

          Ảnh dùng bản DỌC (`-doc.webp`) do `media:nhan-su` xuất ra cùng lúc với
          bản vuông: ở khổ này, cắt vuông sẽ mất mất phần thân và bối cảnh văn
          phòng vốn là thứ làm tấm ảnh trông trang trọng.
        */}
        <header className={styles.dau}>
          {anhDoc ? (
            <div className={styles.dauAnh}>
              <Image
                src={anhDoc}
                alt=""
                width={900}
                height={1125}
                priority
                sizes="(min-width: 900px) 34vw, 90vw"
                className={styles.anhLon}
              />
            </div>
          ) : (
            <div className={styles.dauAnh}>
              <ChanDung ten={nguoi.name} anh={null} lon />
            </div>
          )}

          <div className={styles.dauChu}>
            {nguoi.headline ? <p className={styles.chucDanh}>{t(nguoi.headline, locale)}</p> : null}
            <h1 className={styles.ten}>
              {nguoi.honorific ? <span className={styles.hocVi}>{nguoi.honorific} </span> : null}
              {nguoi.name}
            </h1>
            {nguoi.birthYear ? (
              <p className={styles.phu}>
                {nhan.namSinh}: {nguoi.birthYear}
              </p>
            ) : null}
            {nguoi.quote ? <blockquote className={styles.trichDan}>{t(nguoi.quote, locale)}</blockquote> : null}
          </div>
        </header>

        <div className={styles.bo}>
          <div className={styles.chinh}>
            {tongQuan.length ? (
              <section className={styles.muc} data-reveal suppressHydrationWarning>
                <h2>{nhan.tongQuan}</h2>
                {tongQuan.map((doan, i) => (
                  <p key={i}>{doan}</p>
                ))}
              </section>
            ) : nguoi.bio ? (
              <section className={styles.muc} data-reveal suppressHydrationWarning>
                <h2>{nhan.tongQuan}</h2>
                <p>{t(nguoi.bio, locale)}</p>
              </section>
            ) : null}

            {nangLuc.length ? (
              <section className={styles.muc} data-reveal suppressHydrationWarning>
                <h2>{nhan.nangLuc}</h2>
                <ul className={styles.luoiNangLuc}>
                  {nangLuc.map((n, i) => (
                    <li key={i}>
                      <h3>{t(n.title, locale)}</h3>
                      <p>{t(n.text, locale)}</p>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {congTac.length ? (
              <section className={styles.muc} data-reveal suppressHydrationWarning>
                <h2>{nhan.congTac}</h2>
                <ol className={styles.dong}>
                  {congTac.map((c, i) => (
                    <li key={i}>
                      <span className={styles.dongMoc}>{c.time}</span>
                      <span className={styles.dongChu}>
                        <strong>{t(c.role, locale)}</strong>
                        <span>{t(c.org, locale)}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}

            {dauAn.length ? (
              <section className={styles.muc} data-reveal suppressHydrationWarning>
                <h2>{nhan.dauAn}</h2>
                <ul className={styles.dsGach}>
                  {dauAn.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {trongTam.length ? (
              <section className={styles.muc} data-reveal suppressHydrationWarning>
                <h2>{nhan.trongTam}</h2>
                <ul className={styles.dsGach}>
                  {trongTam.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {nguoi.direction ? (
              <section className={styles.muc} data-reveal suppressHydrationWarning>
                <h2>{nhan.dinhHuong}</h2>
                <p>{t(nguoi.direction, locale)}</p>
              </section>
            ) : null}
          </div>

          <aside className={styles.ben}>
            <section className={styles.hop}>
              <h2>{nhan.chucVu}</h2>
              <ul className={styles.dsChucVu}>
                {nguoi.chucVu.map((cv) => (
                  <li key={cv.id}>
                    <strong>{t(cv.title, locale)}</strong>
                    <span>
                      {cv.schoolId ? tenTruong.get(cv.schoolId) : cv.orgLabel ? t(cv.orgLabel, locale) : null}
                    </span>
                    {cv.term ? (
                      <span className={styles.chuNho}>
                        {pick({ vi: "Nhiệm kỳ", en: "Term", de: "Amtszeit", ja: "任期", ko: "임기", "zh-TW": "任期" }, locale)}{" "}
                        {cv.term}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>

            {hocVan.length ? (
              <section className={styles.hop}>
                <h2>{nhan.hocVan}</h2>
                <ul className={styles.dsHocVan}>
                  {hocVan.map((h, i) => (
                    <li key={i}>
                      {h.period ? <span className={styles.moc}>{h.period}</span> : null}
                      <span>{t(h.text, locale)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <Link href={`/${locale}/doi-ngu`} className={styles.quayLai}>
              ← {nhan.quayLai}
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
