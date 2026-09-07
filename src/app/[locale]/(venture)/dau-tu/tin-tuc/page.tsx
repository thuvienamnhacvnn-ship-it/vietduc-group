import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, pick, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getPosts } from "@/lib/queries";
import { NewsList } from "@/components/NewsList";
import styles from "./news.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "vi";
  return {
    title: getDictionary(locale).nav.news,
    alternates: { canonical: `/${locale}/dau-tu/tin-tuc` },
  };
}

/**
 * Tin tức và sự kiện của mảng khách sạn – du lịch.
 *
 * Tách khỏi trang tin của mảng đào tạo, không phải để có thêm một trang, mà vì
 * hai nhóm người đọc khác nhau: người theo dõi tiến độ dự án nghỉ dưỡng không
 * tìm lịch khai giảng, và ngược lại. Danh sách vẫn dùng chung một thành phần.
 */
export default async function VentureNewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);
  const posts = await getPosts(undefined, "venture");

  return (
    <div className={styles.page}>
      <div className="shell">
        <header className={styles.header}>
          <p className={styles.eyebrow}>{dict.venture.section}</p>
          <h1>{dict.nav.news}</h1>
          <p className={styles.lead}>
            {pick(
              {
                vi: "Tiến độ dự án, lễ khởi công và các sự kiện của mảng khách sạn – khu nghỉ dưỡng – lữ hành.",
                en: "Project progress, groundbreakings and events from the hotel, resort and travel arm.",
                de: "Projektfortschritt, Spatenstiche und Veranstaltungen aus dem Bereich Hotellerie, Resorts und Reisen.",
                ja: "ホテル・リゾート・旅行の各事業における進捗、起工式、そして催しのお知らせです。",
                ko: "호텔·리조트·여행 부문의 사업 진행 상황과 착공식, 그리고 행사 소식입니다.",
                "zh-TW": "飯店、度假村與旅遊事業的專案進度、動土典禮與各項活動消息。",
              },
              locale,
            )}
          </p>
        </header>

        {!posts.length ? (
          <div className={styles.empty}>
            <h2>{dict.common.empty}</h2>
            <p>
              {pick(
                {
                  vi: "Chưa có tin nào được xuất bản cho mảng này. Biên tập viên thêm bài trong trang quản trị — website không hiển thị tin mẫu.",
                  en: "Nothing published for this arm yet. Editors add articles in the admin area - this site does not display placeholder news.",
                  de: "Für diesen Bereich ist noch nichts veröffentlicht. Die Redaktion legt Beiträge im Redaktionsbereich an - Platzhaltermeldungen zeigt diese Seite nicht.",
                  ja: "この事業ではまだ記事が公開されていません。編集者は管理画面から追加できます。このサイトはダミー記事を表示しません。",
                  ko: "이 부문에는 아직 공개된 글이 없습니다. 편집자가 관리자 화면에서 추가하며, 이 사이트는 예시 기사를 표시하지 않습니다.",
                  "zh-TW": "本事業尚無已發布的消息。編輯者可於管理後台新增；本網站不會顯示範例新聞。",
                },
                locale,
              )}
            </p>
          </div>
        ) : (
          <NewsList posts={posts} locale={locale} basePath="/dau-tu/tin-tuc" />
        )}
      </div>
    </div>
  );
}
