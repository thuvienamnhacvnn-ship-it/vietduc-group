import type { MetadataRoute } from "next";
import { LOCALES, LOCALE_TAG, localePath } from "@/lib/i18n/config";
import { getPageSlugs, getPosts, getPrograms, getSchools } from "@/lib/queries";
import { publishedProjects } from "@/content/venture";
import { getSiteSettings } from "@/lib/settings";
import { resolveSiteUrl } from "@/lib/site-config";

/**
 * Every public URL, in every locale, with hreflang alternates.
 *
 * Only approved content appears here - the query helpers filter on status, so a
 * draft programme cannot be advertised to search engines.
 */
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSiteSettings();
  const base = resolveSiteUrl(settings.seo.siteUrl);

  const [programs, schools, posts, pageSlugs] = await Promise.all([
    getPrograms(),
    getSchools(),
    getPosts(),
    getPageSlugs(),
  ]);

  const staticPaths = [
    "/",
    "/dao-tao",
    "/dau-tu",
    "/dao-tao/chuong-trinh",
    "/dao-tao/truong",
    "/doi-tac",
    "/hoat-dong",
    "/tin-tuc",
    "/dao-tao/thu-vien-tai-lieu",
    "/dao-tao/cau-hoi-thuong-gap",
    "/lien-he",
    "/dao-tao/dang-ky-tu-van",
  ];

  const paths = [
    ...staticPaths.map((path) => ({ path, priority: path === "/" ? 1 : 0.8, lastModified: undefined as Date | undefined })),
    ...pageSlugs.map((slug) => ({ path: `/${slug}`, priority: 0.5, lastModified: undefined })),
    ...schools.map((school) => ({
      path: `/dao-tao/truong/${school.slug}`,
      priority: 0.7,
      lastModified: school.updatedAt,
    })),
    ...programs.map((program) => ({
      path: `/dao-tao/chuong-trinh/${program.slug}`,
      priority: 0.6,
      lastModified: program.updatedAt,
    })),
    ...posts.map((post) => ({
      path: `/tin-tuc/${post.slug}`,
      priority: 0.5,
      lastModified: post.updatedAt,
    })),
    // Only the projects whose paperwork supports publishing them; the drafts in
    // src/content/venture.ts are filtered out by publishedProjects().
    ...publishedProjects().map((project) => ({
      path: `/dau-tu/du-an/${project.slug}`,
      priority: 0.6,
      lastModified: undefined,
    })),
  ];

  return paths.flatMap(({ path, priority, lastModified }) =>
    LOCALES.map((locale) => ({
      url: `${base}${localePath(locale, path)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((code) => [LOCALE_TAG[code], `${base}${localePath(code, path)}`]),
        ),
      },
    })),
  );
}
