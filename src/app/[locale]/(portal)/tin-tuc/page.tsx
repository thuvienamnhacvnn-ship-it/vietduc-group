import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale, pick } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getPosts } from "@/lib/queries";
import { Breadcrumbs, EmptyState } from "@/components/ui";
import { NewsList } from "@/components/NewsList";
import shell from "../page-shell.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "vi";
  return {
    title: getDictionary(locale).nav.news,
    alternates: { canonical: `/${locale}/tin-tuc` },
  };
}

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);
  /* Chỉ tin của mảng đào tạo; tin dự án nghỉ dưỡng có trang riêng bên kia. */
  const posts = await getPosts(undefined, "education");

  return (
    <div className={shell.page}>
      <div className="shell">
        <Breadcrumbs locale={locale} trail={[{ label: dict.nav.news }]} />
        <header className={shell.header}>
          <h1>{dict.home.newsTitle}</h1>
        </header>

        {!posts.length ? (
          <EmptyState
            title={dict.common.empty}
            hint={
              pick({
                vi: "Chưa có bài viết nào được xuất bản. Biên tập viên có thể thêm bài trong trang quản trị – website không hiển thị tin mẫu.",
                en: "No articles published yet. Editors can add them in the admin area - this site does not display placeholder news.",
                de: "Noch keine Beiträge veröffentlicht. Die Redaktion kann sie im Redaktionsbereich anlegen - Platzhaltermeldungen zeigt diese Seite nicht.",
                ja: "まだ公開された記事はありません。編集者は管理画面から追加できます。このサイトはダミー記事を表示しません。",
                ko: "아직 공개된 글이 없습니다. 편집자는 관리자 화면에서 추가할 수 있으며, 이 사이트는 예시 기사를 표시하지 않습니다.",
                "zh-TW": "目前尚無已發布的文章。編輯者可於管理後台新增；本網站不會顯示範例新聞。",
              }, locale)
            }
          />
        ) : (
          <NewsList posts={posts} locale={locale} basePath="/tin-tuc" />
        )}
      </div>
    </div>
  );
}
