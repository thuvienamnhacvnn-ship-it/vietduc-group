import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, t, type Locale, pick } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getCategories, getPrograms, getSchools } from "@/lib/queries";
import { getSiteSettings } from "@/lib/settings";
import { levelLabel } from "@/lib/format";
import { telHref } from "@/lib/site-config";
import { Breadcrumbs } from "@/components/ui";
import { LeadForm, type FormProgram } from "@/components/LeadForm";
import shell from "../../page-shell.module.css";
import styles from "./apply.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "vi";
  const dict = getDictionary(locale);
  return {
    title: dict.form.title,
    description: dict.form.lead,
    alternates: { canonical: `/${locale}/dang-ky-tu-van` },
  };
}

export default async function ApplyPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ "chuong-trinh"?: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);
  const query = await searchParams;

  const [programs, categories, schools, settings] = await Promise.all([
    getPrograms(),
    getCategories(),
    getSchools(),
    getSiteSettings(),
  ]);

  const categoryBySlug = new Map(categories.map((c) => [c.id, c.slug]));
  const schoolById = new Map(schools.map((s) => [s.id, t(s.shortName ?? s.name, locale)]));

  const formPrograms: FormProgram[] = programs.map((program) => ({
    slug: program.slug,
    title: t(program.title, locale),
    categorySlug: program.categoryId ? (categoryBySlug.get(program.categoryId) ?? "") : "",
    level: program.level,
    levelName: levelLabel(program.level, locale),
    schoolName: program.schoolId ? (schoolById.get(program.schoolId) ?? "") : "",
    mode: program.mode ?? "",
  }));

  const initial = query["chuong-trinh"];
  const tel = telHref(settings.contact.phoneE164 || settings.contact.admissionsPhone);

  return (
    <div className={shell.page}>
      <div className="shell">
        <Breadcrumbs locale={locale} trail={[{ label: dict.form.title }]} />

        <div className={styles.layout}>
          <div>
            <header className={shell.header}>
              <h1>{dict.form.title}</h1>
              <p className={shell.lead}>{dict.form.lead}</p>
            </header>

            <LeadForm
              locale={locale}
              categories={categories.map((c) => ({ slug: c.slug, label: t(c.name, locale) }))}
              programs={formPrograms}
              initialProgram={
                initial && formPrograms.some((p) => p.slug === initial) ? initial : undefined
              }
            />
          </div>

          <aside className={styles.aside}>
            <h2>{pick({ vi: "Chúng tôi làm gì với thông tin này", en: "What we do with your details", de: "Was mit Ihren Angaben geschieht" }, locale)}</h2>
            <ul>
              <li>
                {
                  pick({
                    vi: "Chuyển tới phòng tuyển sinh của trường thành viên phụ trách ngành bạn chọn.",
                    en: "Pass them to the admissions office of the member school that runs your chosen field.",
                    de: "Weitergabe an das Zulassungsbüro der zuständigen Mitgliedsschule.",
                  }, locale)
                }
              </li>
              <li>
                {
                  pick({
                    vi: "Chỉ dùng cho mục đích tư vấn tuyển sinh; không chia sẻ cho bên thứ ba vì mục đích tiếp thị.",
                    en: "Use them only for admissions advice; never share them with third parties for marketing.",
                    de: "Nutzung nur zur Bildungsberatung; keine Weitergabe zu Marketingzwecken.",
                  }, locale)
                }
              </li>
              <li>
                {
                  pick({
                    vi: "Lưu tối đa 24 tháng kể từ lần liên hệ cuối, sau đó xoá.",
                    en: "Keep them for at most 24 months after the last contact, then delete them.",
                    de: "Speicherung höchstens 24 Monate nach dem letzten Kontakt.",
                  }, locale)
                }
              </li>
              <li>
                {
                  pick({
                    vi: "Không kết luận bạn có đủ điều kiện trúng tuyển – việc đó do nhà trường quyết định.",
                    en: "Not decide your eligibility - that is the school's decision, not this form's.",
                    de: "Keine Entscheidung über Ihre Zulassung - das obliegt der Schule.",
                  }, locale)
                }
              </li>
            </ul>

            {tel ? (
              <p className={styles.callout}>
                {pick({ vi: "Muốn gọi trực tiếp?", en: "Prefer to call?", de: "Lieber anrufen?" }, locale)}{" "}
                <a href={tel}>{settings.contact.admissionsPhone}</a>
              </p>
            ) : null}
          </aside>
        </div>
      </div>
    </div>
  );
}
