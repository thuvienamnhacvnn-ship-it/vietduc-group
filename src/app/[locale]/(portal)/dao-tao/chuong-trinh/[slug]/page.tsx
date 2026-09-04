import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, localePath, t, tList, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import {
  getCategories,
  getFaqs,
  getProgram,
  getRelatedPrograms,
  getSchools,
  getSourceDocuments,
  recordProgramView,
} from "@/lib/queries";
import { getSiteSettings } from "@/lib/settings";
import { formatDate, languageLabel, levelLabel, modeLabel } from "@/lib/format";
import { resolveSiteUrl } from "@/lib/site-config";
import { Badge, Breadcrumbs, ButtonLink, SectionHeading, SourceNote } from "@/components/ui";
import { ProgramCard } from "@/components/cards";
import { ProgramTools } from "@/components/ProgramTools";
import { QrCode } from "@/components/QrCode";
import shell from "../../../page-shell.module.css";
import styles from "./program.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "vi";
  const program = await getProgram(slug);
  if (!program) return {};
  const title = t(program.title, locale);
  const description = program.overview ? t(program.overview, locale) : undefined;
  return {
    title,
    description,
    alternates: { canonical: `/${locale}/chuong-trinh/${slug}` },
    openGraph: { title, description, type: "article" },
  };
}

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const program = await getProgram(slug);
  if (!program) notFound();

  const [school, categories, related, faqs, documents, settings, schools] = await Promise.all([
    program.schoolId ? getSchoolById(program.schoolId) : Promise.resolve(null),
    getCategories(),
    getRelatedPrograms(program, 3),
    getFaqs(),
    getSourceDocuments(),
    getSiteSettings(),
    getSchools(),
  ]);

  void recordProgramView(program.id);

  const category = categories.find((c) => c.id === program.categoryId) ?? null;
  const schoolName = new Map(schools.map((s) => [s.id, t(s.shortName ?? s.name, locale)]));
  const categoryName = new Map(categories.map((c) => [c.id, t(c.name, locale)]));
  const siteUrl = resolveSiteUrl(settings.seo.siteUrl);
  const pageUrl = `${siteUrl}${localePath(locale, `/dao-tao/chuong-trinh/${program.slug}`)}`;

  const sourceDocument = documents.find((d) => d.slug === program.provenance?.source);
  const admissionFaqs = faqs.filter((faq) => faq.topic === "admissions").slice(0, 4);

  /**
   * Facts the licence states. A field the documents do not mention renders as
   * "not published" with a pointer to admissions, never as a blank or a guess.
   */
  const facts: { label: string; value: string | null }[] = [
    { label: dict.explorer.level, value: levelLabel(program.level, locale) },
    { label: dict.explorer.code, value: program.officialCode },
    {
      label: dict.explorer.quota,
      value: program.intakeQuota ? `${program.intakeQuota}${dict.explorer.perYear}` : null,
    },
    { label: dict.explorer.school, value: school ? t(school.shortName ?? school.name, locale) : null },
    { label: dict.explorer.field, value: category ? t(category.name, locale) : null },
    { label: dict.explorer.location, value: program.locationCity ? t(program.locationCity, locale) : null },
    { label: dict.program.mode, value: modeLabel(program.mode, locale) || null },
    {
      label: dict.explorer.language,
      value: program.languages?.length
        ? program.languages.map((code) => languageLabel(code, locale)).join(", ")
        : null,
    },
    { label: dict.program.duration, value: program.durationLabel ? t(program.durationLabel, locale) : null },
    { label: dict.program.intake, value: program.intakeSchedule ? t(program.intakeSchedule, locale) : null },
    { label: dict.program.tuition, value: program.tuition ? t(program.tuition, locale) : null },
    { label: dict.program.certificate, value: program.certificate ? t(program.certificate, locale) : null },
  ];

  const lists: { title: string; items: string[] }[] = [
    { title: dict.program.audience, items: tList(program.audience, locale) },
    { title: dict.program.objectives, items: tList(program.objectives, locale) },
    { title: dict.program.outcomes, items: tList(program.outcomes, locale) },
    { title: dict.program.careers, items: tList(program.careers, locale) },
    { title: dict.program.admissionFile, items: tList(program.admissionFile, locale) },
  ].filter((section) => section.items.length);

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: t(program.title, locale),
    description: program.overview ? t(program.overview, locale) : undefined,
    url: pageUrl,
    inLanguage: program.languages,
    courseCode: program.officialCode || undefined,
    provider: school
      ? {
          "@type": "EducationalOrganization",
          name: t(school.name, locale),
          url: school.website || undefined,
        }
      : {
          "@type": "EducationalOrganization",
          name: settings.seo.siteName,
        },
    educationalCredentialAwarded: program.certificate ? t(program.certificate, locale) : undefined,
    hasCourseInstance:
      program.mode || program.locationCity
        ? [
            {
              "@type": "CourseInstance",
              courseMode: program.mode === "online" ? "online" : "onsite",
              location: program.locationCity
                ? { "@type": "Place", name: t(program.locationCity, locale) }
                : undefined,
            },
          ]
        : undefined,
  };

  return (
    <div className={shell.page}>
      <div className="shell">
        <Breadcrumbs
          locale={locale}
          trail={[
            { href: localePath(locale, "/dao-tao/chuong-trinh"), label: dict.nav.programs },
            { label: t(program.title, locale) },
          ]}
        />

        <header className={styles.head}>
          <div className={styles.headTags}>
            <Badge tone="burgundy">{levelLabel(program.level, locale)}</Badge>
            {category ? <Badge tone="gold">{t(category.name, locale)}</Badge> : null}
            {program.officialCode ? (
              <span className={styles.code}>
                {dict.explorer.code} {program.officialCode}
              </span>
            ) : null}
          </div>
          <h1>{t(program.title, locale)}</h1>
          {school ? (
            <p className={styles.headSchool}>
              <Link href={localePath(locale, `/dao-tao/truong/${school.slug}`)}>
                {t(school.name, locale)}
              </Link>
              {program.locationCity ? ` · ${t(program.locationCity, locale)}` : ""}
            </p>
          ) : null}
        </header>

        <div className={`${shell.body} ${shell.bodyWithAside}`}>
          <div>
            {program.overview ? (
              <section>
                <h2 className={shell.sectionTitle}>{dict.program.overview}</h2>
                <p className={styles.overview}>{t(program.overview, locale)}</p>
                {sourceDocument ? (
                  <SourceNote
                    locale={locale}
                    source={t(sourceDocument.title, locale)}
                    page={program.provenance?.page}
                  />
                ) : null}
              </section>
            ) : null}

            {lists.map((section) => (
              <section key={section.title} className={shell.section}>
                <h2 className={shell.sectionTitle}>{section.title}</h2>
                <ul className={styles.bullets}>
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ))}

            {program.modules?.length ? (
              <section className={shell.section}>
                <h2 className={shell.sectionTitle}>{dict.program.modules}</h2>
                <ol className={styles.modules}>
                  {program.modules.map((module, index) => (
                    <li key={index}>
                      <strong>{t(module.title, locale)}</strong>
                      {module.detail ? <span>{t(module.detail, locale)}</span> : null}
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}

            {school?.legalRefs?.length ? (
              <section className={shell.section}>
                <h2 className={shell.sectionTitle}>
                  {{ vi: "Cơ sở pháp lý", en: "Legal basis", de: "Rechtsgrundlage" }[locale]}
                </h2>
                <div className={shell.tableScroll}>
                  <table className={shell.legalTable}>
                    <caption>
                      {
                        {
                          vi: "Các văn bản do cơ quan quản lý nhà nước cấp cho trường thành viên.",
                          en: "Documents issued to the member school by the competent authority.",
                          de: "Von der zuständigen Behörde ausgestellte Dokumente der Mitgliedsschule.",
                        }[locale]
                      }
                    </caption>
                    <thead>
                      <tr>
                        <th scope="col">{{ vi: "Văn bản", en: "Document", de: "Dokument" }[locale]}</th>
                        <th scope="col">{{ vi: "Số hiệu", en: "Number", de: "Nummer" }[locale]}</th>
                        <th scope="col">{{ vi: "Ngày", en: "Date", de: "Datum" }[locale]}</th>
                        <th scope="col">{{ vi: "Cơ quan cấp", en: "Issued by", de: "Aussteller" }[locale]}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {school.legalRefs.map((ref) => (
                        <tr key={ref.number}>
                          <td>{t(ref.label, locale)}</td>
                          <td>{ref.number}</td>
                          <td>{formatDate(ref.date, locale)}</td>
                          <td>{t(ref.issuer, locale)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ) : null}

            {admissionFaqs.length ? (
              <section className={shell.section}>
                <h2 className={shell.sectionTitle}>{dict.program.faq}</h2>
                <div className={styles.faqs}>
                  {admissionFaqs.map((faq) => (
                    <details key={faq.id}>
                      <summary>{t(faq.question, locale)}</summary>
                      <p>{t(faq.answer, locale)}</p>
                    </details>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <aside className={`${shell.aside} ${shell.asideSticky}`}>
            <h2 className={shell.asideTitle}>
              {{ vi: "Thông tin chương trình", en: "Programme facts", de: "Programmdaten" }[locale]}
            </h2>
            <dl className={shell.factList}>
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd className={fact.value ? undefined : shell.factMissing}>
                    {fact.value ?? dict.common.notPublished}
                  </dd>
                </div>
              ))}
            </dl>

            <ProgramTools
              locale={locale}
              slug={program.slug}
              title={t(program.title, locale)}
              url={pageUrl}
              qr={<QrCode value={pageUrl} label={dict.program.qrTitle} />}
            />

            <ButtonLink href={localePath(locale, `/dao-tao/dang-ky-tu-van?chuong-trinh=${program.slug}`)}>
              {dict.program.apply}
            </ButtonLink>
          </aside>
        </div>

        {facts.some((fact) => !fact.value) ? (
          <p className={`${shell.notice} ${styles.notice}`}>
            <span>
              <strong>{dict.common.notPublished}</strong>
              {dict.program.notInDocuments}
            </span>
          </p>
        ) : null}

        {related.length ? (
          <section className={shell.section}>
            <SectionHeading title={dict.program.related} as="h2" />
            <div className={shell.grid3}>
              {related.map((item) => (
                <ProgramCard
                  key={item.id}
                  program={item}
                  locale={locale}
                  schoolName={item.schoolId ? schoolName.get(item.schoolId) : undefined}
                  categoryName={item.categoryId ? categoryName.get(item.categoryId) : undefined}
                  compact
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <script
        type="application/ld+json"
        // Serialised by JSON.stringify, so no user text can escape the script.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
    </div>
  );
}

async function getSchoolById(id: number) {
  const schools = await getSchools();
  return schools.find((school) => school.id === id) ?? null;
}
