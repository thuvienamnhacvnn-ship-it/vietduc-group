import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale, localePath, t, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getPost } from "@/lib/queries";
import { getSiteSettings } from "@/lib/settings";
import { formatDate } from "@/lib/format";
import { resolveSiteUrl } from "@/lib/site-config";
import { Breadcrumbs, Prose, SourceNote } from "@/components/ui";
import shell from "../../page-shell.module.css";
import styles from "../news.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "vi";
  const post = await getPost(slug);
  if (!post) return {};
  const title = t(post.title, locale);
  const description = post.excerpt ? t(post.excerpt, locale) : undefined;
  return {
    title,
    description,
    alternates: { canonical: `/${locale}/tin-tuc/${slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      images: post.coverPath ? [post.coverPath] : undefined,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const post = await getPost(slug);
  if (!post) notFound();
  const settings = await getSiteSettings();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: t(post.title, locale),
    description: post.excerpt ? t(post.excerpt, locale) : undefined,
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    dateModified: new Date(post.updatedAt).toISOString(),
    url: `${resolveSiteUrl(settings.seo.siteUrl)}${localePath(locale, `/tin-tuc/${post.slug}`)}`,
    publisher: { "@type": "Organization", name: settings.seo.siteName },
    image: post.coverPath ? [post.coverPath] : undefined,
  };

  return (
    <div className={shell.page}>
      <div className="shell-narrow">
        <Breadcrumbs
          locale={locale}
          trail={[
            { href: localePath(locale, "/tin-tuc"), label: dict.nav.news },
            { label: t(post.title, locale) },
          ]}
        />
        <header className={shell.header}>
          {post.publishedAt ? (
            <p className={styles.date}>
              <time dateTime={new Date(post.publishedAt).toISOString()}>
                {formatDate(post.publishedAt, locale)}
              </time>
            </p>
          ) : null}
          <h1>{t(post.title, locale)}</h1>
          {post.excerpt ? <p className={shell.lead}>{t(post.excerpt, locale)}</p> : null}
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
          <div className={styles.postSource}>
            <SourceNote
              locale={locale}
              source={post.provenance.sourceTitle}
              page={post.provenance.page}
            />
          </div>
        ) : null}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </div>
  );
}
