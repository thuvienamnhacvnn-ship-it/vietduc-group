import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, t, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getActivities, getSourceDocuments } from "@/lib/queries";
import { Breadcrumbs, EmptyState, SourceNote } from "@/components/ui";
import { ActivityCard } from "@/components/cards";
import { PhotoSections } from "@/components/PhotoSections";
import { NHOM_HOAT_DONG } from "@/content/anh-nhom";
import { khoAnh } from "@/content/kho-media";
import shell from "../page-shell.module.css";
import styles from "./activities.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "vi";
  return {
    title: getDictionary(locale).nav.activities,
    alternates: { canonical: `/${locale}/hoat-dong` },
  };
}

export default async function ActivitiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const [activities, documents] = await Promise.all([getActivities(), getSourceDocuments()]);
  const profile = documents.find((d) => d.slug === "profile-viet-duc-vi");

  /* Ảnh hoạt động lấy từ kho tiếp nhận. */
  const shots = khoAnh("activities");

  return (
    <div className={shell.page}>
      <div className="shell">
        <Breadcrumbs locale={locale} trail={[{ label: dict.nav.activities }]} />
        <header className={shell.header}>
          <h1>{dict.home.activitiesTitle}</h1>
          <p className={shell.lead}>
            {
              {
                vi: "Hoạt động thường niên của học sinh – sinh viên trong hệ thống. Ảnh chụp tại các trường thành viên, trích từ hồ sơ năng lực.",
                en: "The student activities that run through the year across the network. Photographs taken at member schools, from the capability profile.",
                de: "Aktivitäten der Lernenden im Jahresverlauf. Fotos von den Mitgliedsschulen, aus dem Leistungsprofil.",
              }[locale]
            }
          </p>
        </header>

        {!activities.length ? (
          <EmptyState title={dict.common.empty} />
        ) : (
          <div className={styles.gallery}>
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                className={index % 5 === 0 ? styles.wide : undefined}
              >
                <ActivityCard
                  activity={activity}
                  locale={locale}
                  size={index % 5 === 0 ? "lg" : "md"}
                />
              </div>
            ))}
          </div>
        )}

        {/* Toàn bộ ảnh hoạt động trong kho, không cắt bớt: đây đúng là trang
            để xem hết chúng. */}
        {shots.length ? (
          <section className={styles.gallery}>
            <h2>
              {
                {
                  vi: "Hình ảnh theo chủ đề",
                  en: "Photographs by theme",
                  de: "Aufnahmen nach Thema",
                }[locale]
              }
            </h2>
            <PhotoSections
              groups={NHOM_HOAT_DONG}
              all={shots}
              locale={locale}
              otherLabel={{ vi: "Hoạt động khác", en: "Other events", de: "Weitere Veranstaltungen" }}
              alt={(nhom) => nhom}
            />
          </section>
        ) : null}

        {profile ? (
          <div className={styles.source}>
            <SourceNote locale={locale} source={t(profile.title, locale)} page={23} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
