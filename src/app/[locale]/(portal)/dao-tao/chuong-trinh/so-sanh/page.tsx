import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, localePath, t, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getCategories, getProgramsBySlugs, getSchools } from "@/lib/queries";
import { languageLabel, levelLabel, modeLabel } from "@/lib/format";
import { Breadcrumbs, ButtonLink, EmptyState } from "@/components/ui";
import shell from "../../../page-shell.module.css";
import styles from "./compare.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "vi";
  return {
    title: getDictionary(locale).explorer.compare,
    robots: { index: false, follow: true },
  };
}

export default async function ComparePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ ma?: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);
  const { ma } = await searchParams;

  const slugs = (ma ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);

  const [programs, schools, categories] = await Promise.all([
    getProgramsBySlugs(slugs),
    getSchools(),
    getCategories(),
  ]);

  // Preserve the order the visitor picked rather than database order.
  const ordered = slugs
    .map((slug) => programs.find((program) => program.slug === slug))
    .filter((program): program is NonNullable<typeof program> => Boolean(program));

  const schoolById = new Map(schools.map((s) => [s.id, s]));
  const categoryById = new Map(categories.map((c) => [c.id, c]));

  const rows: { label: string; value: (program: (typeof ordered)[number]) => string | null }[] = [
    { label: dict.explorer.level, value: (p) => levelLabel(p.level, locale) },
    { label: dict.explorer.code, value: (p) => p.officialCode },
    {
      label: dict.explorer.school,
      value: (p) => (p.schoolId ? t(schoolById.get(p.schoolId)!.shortName ?? schoolById.get(p.schoolId)!.name, locale) : null),
    },
    {
      label: dict.explorer.field,
      value: (p) => (p.categoryId ? t(categoryById.get(p.categoryId)!.name, locale) : null),
    },
    { label: dict.explorer.location, value: (p) => (p.locationCity ? t(p.locationCity, locale) : null) },
    {
      label: dict.explorer.quota,
      value: (p) => (p.intakeQuota ? `${p.intakeQuota}${dict.explorer.perYear}` : null),
    },
    { label: dict.program.mode, value: (p) => modeLabel(p.mode, locale) || null },
    {
      label: dict.explorer.language,
      value: (p) => (p.languages?.length ? p.languages.map((c) => languageLabel(c, locale)).join(", ") : null),
    },
    { label: dict.program.duration, value: (p) => (p.durationLabel ? t(p.durationLabel, locale) : null) },
    { label: dict.program.intake, value: (p) => (p.intakeSchedule ? t(p.intakeSchedule, locale) : null) },
    { label: dict.program.tuition, value: (p) => (p.tuition ? t(p.tuition, locale) : null) },
    { label: dict.program.certificate, value: (p) => (p.certificate ? t(p.certificate, locale) : null) },
  ];

  return (
    <div className={shell.page}>
      <div className="shell">
        <Breadcrumbs
          locale={locale}
          trail={[
            { href: localePath(locale, "/dao-tao/chuong-trinh"), label: dict.nav.programs },
            { label: dict.explorer.compare },
          ]}
        />
        <header className={shell.header}>
          <h1>{dict.explorer.compare}</h1>
          <p className={shell.lead}>
            {
              {
                vi: "Đặt cạnh nhau các thông tin đã được công bố. Ô để trống nghĩa là tài liệu chính thức chưa nêu.",
                en: "Published facts side by side. An empty cell means the official documents do not state it.",
                de: "Veröffentlichte Angaben im Vergleich. Eine leere Zelle heißt: die amtlichen Unterlagen nennen es nicht.",
              }[locale]
            }
          </p>
        </header>

        {!ordered.length ? (
          <EmptyState
            title={dict.common.noResults}
            hint={
              {
                vi: "Hãy chọn tối đa ba chương trình trong trang tra cứu rồi bấm So sánh.",
                en: "Pick up to three programmes in the explorer, then choose Compare.",
                de: "Wählen Sie bis zu drei Programme in der Übersicht und dann Vergleichen.",
              }[locale]
            }
          />
        ) : (
          <div className={shell.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col" className={styles.corner}>
                    <span className="visually-hidden">{dict.nav.programs}</span>
                  </th>
                  {ordered.map((program) => (
                    <th scope="col" key={program.id}>
                      <Link href={localePath(locale, `/dao-tao/chuong-trinh/${program.slug}`)}>
                        {t(program.title, locale)}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    {ordered.map((program) => {
                      const value = row.value(program);
                      return (
                        <td key={program.id} className={value ? undefined : styles.missing}>
                          {value ?? dict.common.notPublished}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr>
                  <th scope="row">{dict.nav.apply}</th>
                  {ordered.map((program) => (
                    <td key={program.id}>
                      <ButtonLink
                        href={localePath(locale, `/dao-tao/dang-ky-tu-van?chuong-trinh=${program.slug}`)}
                        size="sm"
                      >
                        {dict.program.apply}
                      </ButtonLink>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
