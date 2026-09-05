import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { isLocale, t, type Locale, pick } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getDb } from "@/lib/db";
import { people } from "@/lib/db/schema";
import { getSchools } from "@/lib/queries";
import { Breadcrumbs, EmptyState } from "@/components/ui";
import shell from "../page-shell.module.css";
import styles from "./people.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "vi";
  return {
    title: getDictionary(locale).nav.people,
    alternates: { canonical: `/${locale}/doi-ngu` },
  };
}

/**
 * Leadership and teaching staff.
 *
 * The source documents name no individuals, so this page ships empty rather
 * than with placeholder faces and invented biographies. It becomes a real page
 * the moment an editor adds people in the admin area.
 */
export default async function PeoplePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const db = await getDb();
  const [rows, schools] = await Promise.all([
    db.select().from(people).where(eq(people.status, "approved")).orderBy(asc(people.order)),
    getSchools(),
  ]);
  const schoolName = new Map(schools.map((s) => [s.id, t(s.shortName ?? s.name, locale)]));

  return (
    <div className={shell.page}>
      <div className="shell">
        <Breadcrumbs locale={locale} trail={[{ label: dict.nav.people }]} />
        <header className={shell.header}>
          <h1>{dict.nav.people}</h1>
          <p className={shell.lead}>
            {
              pick({
                vi: "Ban lãnh đạo và đội ngũ giảng viên của các trường thành viên.",
                en: "The leadership and teaching staff of the member schools.",
                de: "Leitung und Lehrpersonal der Mitgliedsschulen.",
              }, locale)
            }
          </p>
        </header>

        {!rows.length ? (
          <EmptyState
            title={
              pick({
                vi: "Chưa công bố thông tin đội ngũ",
                en: "Staff information not published yet",
                de: "Angaben zum Team noch nicht veröffentlicht",
              }, locale)
            }
            hint={
              pick({
                vi: "Hồ sơ năng lực hiện có không nêu tên, ảnh hay tiểu sử của cá nhân nào. Trang này sẽ hiển thị ngay khi nhà trường cung cấp và biên tập viên duyệt trong trang quản trị — website không dùng ảnh hay hồ sơ minh hoạ.",
                en: "The available capability profile names no individuals, and this site does not use stand-in portraits or invented biographies. The page fills in as soon as the schools supply the details and an editor approves them.",
                de: "Das vorliegende Leistungsprofil nennt keine Personen, und diese Website verwendet keine Platzhalterporträts oder erfundenen Lebensläufe. Die Seite füllt sich, sobald die Schulen die Angaben liefern und die Redaktion sie freigibt.",
              }, locale)
            }
          />
        ) : (
          <div className={styles.grid}>
            {rows.map((person) => (
              <article key={person.id} className={styles.card} data-reveal>
                {person.photoPath ? (
                  <Image
                    src={person.photoPath}
                    alt=""
                    width={600}
                    height={600}
                    sizes="(min-width: 900px) 25vw, 50vw"
                    className={styles.photo}
                  />
                ) : (
                  <div className={styles.photoFallback} aria-hidden="true">
                    {person.name.slice(0, 1)}
                  </div>
                )}
                <div className={styles.body}>
                  <h2>{person.name}</h2>
                  {person.role ? <p className={styles.role}>{t(person.role, locale)}</p> : null}
                  {person.schoolId ? (
                    <p className={styles.school}>{schoolName.get(person.schoolId)}</p>
                  ) : null}
                  {person.bio ? <p className={styles.bio}>{t(person.bio, locale)}</p> : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
