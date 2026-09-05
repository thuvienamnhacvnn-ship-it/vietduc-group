import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, localePath, t, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getCategories, getPrograms, getSchools } from "@/lib/queries";
import { levelLabel, modeLabel } from "@/lib/format";
import { Breadcrumbs } from "@/components/ui";
import { ProgramExplorer, type ExplorerProgram } from "@/components/ProgramExplorer";
import { RecentlyViewed } from "@/components/RecentlyViewed";
import styles from "../../page-shell.module.css";
import { PageHead } from "@/components/PageHead";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "vi";
  const dict = getDictionary(locale);
  return {
    title: dict.explorer.title,
    description: dict.explorer.lead,
    alternates: { canonical: `/${locale}/chuong-trinh` },
  };
}

export default async function ProgramsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const [programs, schools, categories] = await Promise.all([
    getPrograms(),
    getSchools(),
    getCategories(),
  ]);

  const schoolBySlug = new Map(schools.map((s) => [s.id, s]));
  const categoryById = new Map(categories.map((c) => [c.id, c]));

  // Flattened, already-localised rows: the explorer filters in the browser, so
  // it must not need the whole database shape or the i18n helpers.
  const rows: ExplorerProgram[] = programs.map((program) => {
    const school = program.schoolId ? schoolBySlug.get(program.schoolId) : undefined;
    const category = program.categoryId ? categoryById.get(program.categoryId) : undefined;
    return {
      id: program.id,
      slug: program.slug,
      title: t(program.title, locale),
      overview: program.overview ? t(program.overview, locale) : "",
      schoolSlug: school?.slug ?? "",
      schoolName: school ? t(school.shortName ?? school.name, locale) : "",
      categorySlug: category?.slug ?? "",
      categoryName: category ? t(category.name, locale) : "",
      level: program.level,
      levelName: levelLabel(program.level, locale),
      mode: program.mode ?? "",
      modeName: modeLabel(program.mode, locale),
      city: program.locationCity ? t(program.locationCity, locale) : "",
      languages: program.languages ?? [],
      officialCode: program.officialCode ?? "",
      intakeQuota: program.intakeQuota ?? null,
      durationLabel: program.durationLabel ? t(program.durationLabel, locale) : "",
      intakeSchedule: program.intakeSchedule ? t(program.intakeSchedule, locale) : "",
      tuition: program.tuition ? t(program.tuition, locale) : "",
      certificate: program.certificate ? t(program.certificate, locale) : "",
      href: localePath(locale, `/dao-tao/chuong-trinh/${program.slug}`),
    };
  });

  return (
    <div className={styles.page}>
      {/* The finder opens on the group's own red rather than on paper. */}
      <div className="shell">
        <PageHead
          crumbs={<Breadcrumbs locale={locale} trail={[{ label: dict.nav.programs }]} />}
          eyebrow={dict.nav.programs}
          title={dict.explorer.title}
          lead={dict.explorer.lead}
        />
      </div>

      <ProgramExplorer
        locale={locale}
        programs={rows}
        categories={categories.map((c) => ({ slug: c.slug, label: t(c.name, locale) }))}
        schools={schools.map((s) => ({ slug: s.slug, label: t(s.shortName ?? s.name, locale) }))}
      />

      <div className="shell">
        <RecentlyViewed
          locale={locale}
          programs={rows.map((row) => ({
            slug: row.slug,
            title: row.title,
            href: row.href,
            meta: [row.levelName, row.schoolName].filter(Boolean).join(" · "),
          }))}
        />
      </div>
    </div>
  );
}
