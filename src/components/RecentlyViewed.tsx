"use client";

import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/config";
import { useRecentPrograms } from "@/lib/client-store";
import styles from "./RecentlyViewed.module.css";

/**
 * The programmes this visitor looked at, newest first.
 *
 * The list of slugs lives in the browser; the titles come from the programme
 * data the page already has, so nothing extra is fetched and the server never
 * learns what anyone browsed.
 */
export function RecentlyViewed({
  locale,
  programs,
}: {
  locale: Locale;
  programs: { slug: string; title: string; href: string; meta: string }[];
}) {
  const dict = getDictionary(locale);
  const recent = useRecentPrograms();
  const bySlug = new Map(programs.map((p) => [p.slug, p]));

  const items = recent
    .map((slug) => bySlug.get(slug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 6);

  if (items.length < 2) return null;

  return (
    <section className={styles.wrap} aria-label={dict.explorer.recentlyViewed}>
      <h2 className={styles.title}>{dict.explorer.recentlyViewed}</h2>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.slug}>
            <Link href={item.href}>
              <span className={styles.name}>{item.title}</span>
              <span className={styles.meta}>{item.meta}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
