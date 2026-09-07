import Image from "next/image";
import Link from "next/link";
import { localePath, t, pick, type Locale } from "@/lib/i18n/config";
import { formatDate } from "@/lib/format";
import type { PostRow } from "@/lib/queries";
import styles from "./NewsList.module.css";

/**
 * Tin và sự kiện, dùng chung cho mảng đào tạo và mảng khách sạn – du lịch.
 *
 * Hai mảng có hai bộ màu và hai đường dẫn riêng, nhưng một bài viết thì vẫn là
 * một bài viết: cùng ngày tháng, cùng tiêu đề, cùng tóm tắt. Tách ra hai thành
 * phần giống nhau chỉ khác đường dẫn là cách chắc chắn để hai bên lệch nhau
 * sau vài lần sửa.
 *
 * `basePath` là gốc đường dẫn của mảng — "/tin-tuc" hay "/dau-tu/tin-tuc".
 */
export function NewsList({
  posts,
  locale,
  basePath,
}: {
  posts: PostRow[];
  locale: Locale;
  basePath: string;
}) {
  const nhan = pick(
    {
      vi: "Sự kiện",
      en: "Event",
      de: "Veranstaltung",
      ja: "イベント",
      ko: "행사",
      "zh-TW": "活動",
    },
    locale,
  );

  return (
    <div className={styles.grid}>
      {posts.map((post) => {
        const href = localePath(locale, `${basePath}/${post.slug}`);
        /* Sự kiện thì ngày diễn ra mới là ngày người đọc cần, không phải ngày đăng. */
        const ngay = post.isEvent ? (post.eventAt ?? post.publishedAt) : post.publishedAt;

        return (
          <article key={post.id} className={styles.card} data-reveal>
            {post.coverPath ? (
              <Link href={href} className={styles.media} tabIndex={-1} aria-hidden="true">
                <Image
                  src={post.coverPath}
                  alt=""
                  width={1200}
                  height={800}
                  sizes="(min-width: 700px) 33vw, 110px"
                />
              </Link>
            ) : null}

            <div className={styles.body}>
              <p className={styles.meta}>
                {post.isEvent ? <span className={styles.eventTag}>{nhan}</span> : null}
                {ngay ? (
                  <time dateTime={new Date(ngay).toISOString()}>{formatDate(ngay, locale)}</time>
                ) : null}
                {post.eventPlace ? (
                  <span className={styles.place}>{t(post.eventPlace, locale)}</span>
                ) : null}
              </p>

              <h3>
                <Link href={href}>{t(post.title, locale)}</Link>
              </h3>

              {post.excerpt ? <p>{t(post.excerpt, locale)}</p> : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
