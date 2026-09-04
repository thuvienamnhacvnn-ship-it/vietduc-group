import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale, localePath, t, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getPosts } from "@/lib/queries";
import { formatDate } from "@/lib/format";
import { Breadcrumbs, EmptyState } from "@/components/ui";
import shell from "../page-shell.module.css";
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
    alternates: { canonical: `/${locale}/tin-tuc` },
  };
}

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);
  const posts = await getPosts();

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
              {
                vi: "Chưa có bài viết nào được xuất bản. Biên tập viên có thể thêm bài trong trang quản trị – website không hiển thị tin mẫu.",
                en: "No articles published yet. Editors can add them in the admin area - this site does not display placeholder news.",
                de: "Noch keine Beiträge veröffentlicht. Die Redaktion kann sie im Redaktionsbereich anlegen - Platzhaltermeldungen zeigt diese Seite nicht.",
              }[locale]
            }
          />
        ) : (
          <div className={styles.grid}>
            {posts.map((post) => (
              <article key={post.id} className={styles.card} data-reveal>
                {post.coverPath ? (
                  <Link href={localePath(locale, `/tin-tuc/${post.slug}`)} className={styles.media}>
                    <Image
                      src={post.coverPath}
                      alt=""
                      width={1200}
                      height={800}
                      sizes="(min-width: 900px) 33vw, 100vw"
                    />
                  </Link>
                ) : null}
                <div className={styles.body}>
                  {post.publishedAt ? (
                    <time dateTime={new Date(post.publishedAt).toISOString()}>
                      {formatDate(post.publishedAt, locale)}
                    </time>
                  ) : null}
                  <h2>
                    <Link href={localePath(locale, `/tin-tuc/${post.slug}`)}>
                      {t(post.title, locale)}
                    </Link>
                  </h2>
                  {post.excerpt ? <p>{t(post.excerpt, locale)}</p> : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
