import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getPrograms, getSchools } from "@/lib/queries";
import { Breadcrumbs } from "@/components/ui";
import { SchoolCard } from "@/components/cards";
import shell from "../../page-shell.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "vi";
  const dict = getDictionary(locale);
  return { title: dict.nav.schools, alternates: { canonical: `/${locale}/truong` } };
}

export default async function SchoolsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const [schools, programs] = await Promise.all([getSchools(), getPrograms()]);
  const counts = new Map<number, number>();
  for (const program of programs) {
    if (program.schoolId == null) continue;
    counts.set(program.schoolId, (counts.get(program.schoolId) ?? 0) + 1);
  }

  return (
    <div className={shell.page}>
      <div className="shell">
        <Breadcrumbs locale={locale} trail={[{ label: dict.nav.schools }]} />
        <header className={shell.header}>
          <h1>{dict.home.schoolsTitle}</h1>
          <p className={shell.lead}>
            {
              {
                vi: "Sáu cơ sở đào tạo, mỗi nơi một thế mạnh ngành nghề và địa bàn. Số ngành hiển thị là số ngành đã đăng ký hoạt động giáo dục nghề nghiệp.",
                en: "Six institutions, each with its own strengths and location. The programme count shown is the number of registered occupations.",
                de: "Sechs Einrichtungen mit je eigenen Schwerpunkten und Standorten. Die Zahl nennt die registrierten Berufsprofile.",
              }[locale]
            }
          </p>
        </header>

        <div className={shell.grid3}>
          {schools.map((school, index) => (
            <SchoolCard
              key={school.id}
              school={school}
              locale={locale}
              programCount={counts.get(school.id)}
              priority={index < 3}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
