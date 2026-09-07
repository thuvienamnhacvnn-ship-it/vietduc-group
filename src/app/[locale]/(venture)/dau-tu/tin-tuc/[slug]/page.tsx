import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, localePath, t, pick, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getPost } from "@/lib/queries";
import { getSiteSettings } from "@/lib/settings";
import { formatDate } from "@/lib/format";
import { resolveSiteUrl } from "@/lib/site-config";
import { Prose, SourceNote } from "@/components/ui";
import styles from "../news.module.css";

type Params = Promise<{ locale: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "vi";
  const post = await getPost(slug);
  if (!post) return {};
  const title = t(post.title, locale);
  const description = post.excerpt ? t(post.excerpt, locale) : undefined;
  return {
    title,
    description,
    alternates: { canonical: `/${locale}/dau-tu/tin-tuc/${slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      images: post.coverPath ? [post.coverPath] : undefined,
    },
  };
}

/**
 * Một bài tin của mảng khách sạn – du lịch.
 *
 * Bài của mảng đào tạo mở bằng đường dẫn này thì trả 404: cùng một bảng dữ
 * liệu, nhưng địa chỉ phải nói đúng bài thuộc về đâu, nếu không cùng một bài
 * sẽ có hai địa chỉ và công cụ tìm kiếm phải tự đoán cái nào là chính.
 */
export default async function VenturePostPage({ params }: { params: Params }) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const post = await getPost(slug);
  if (!post || post.arm !== "venture") notFound();
  const settings = await getSiteSettings();

  const ngay = post.isEvent ? (post.eventAt ?? post.publishedAt) : post.publishedAt;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": post.isEvent ? "Event" : "Article",
    [post.isEvent ? "name" : "headline"]: t(post.title, locale),
    description: post.excerpt ? t(post.excerpt, locale) : undefined,
    ...(post.isEvent && post.eventAt
      ? { startDate: new Date(post.eventAt).toISOString() }
      : { datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined }),
    ...(post.eventPlace
      ? { location: { "@type": "Place", name: t(post.eventPlace, locale) } }
      : {}),
    url: `${resolveSiteUrl(settings.seo.siteUrl)}${localePath(locale, `/dau-tu/tin-tuc/${post.slug}`)}`,
    publisher: { "@type": "Organization", name: settings.seo.siteName },
    image: post.coverPath ? [post.coverPath] : undefined,
  };

  return (
    <div className={styles.page}>
      <div className="shell-narrow">
        <Link href={localePath(locale, "/dau-tu/tin-tuc")} className={styles.back}>
          <span aria-hidden="true">←</span>
          {dict.nav.news}
        </Link>

        <header className={styles.header}>
          {ngay ? (
            <p className={styles.date}>
              {post.isEvent
                ? `${pick({ vi: "Sự kiện", en: "Event", de: "Veranstaltung", ja: "イベント", ko: "행사", "zh-TW": "活動" }, locale)} · `
                : ""}
              <time dateTime={new Date(ngay).toISOString()}>{formatDate(ngay, locale)}</time>
              {post.eventPlace ? ` · ${t(post.eventPlace, locale)}` : ""}
            </p>
          ) : null}
          <h1>{t(post.title, locale)}</h1>
          {post.excerpt ? <p className={styles.lead}>{t(post.excerpt, locale)}</p> : null}
        </header>

        {post.coverPath ? (
          <Image
            src={post.coverPath}
            alt=""
            width={1200}
            height={800}
            priority
            sizes="(min-width: 940px) 900px, 100vw"
            className={styles.cover}
          />
        ) : null}

        {post.body ? <Prose markdown={t(post.body, locale)} /> : null}

        {post.provenance?.sourceTitle ? (
          <SourceNote
            locale={locale}
            source={post.provenance.sourceTitle}
            page={post.provenance.page}
          />
        ) : null}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </div>
  );
}
