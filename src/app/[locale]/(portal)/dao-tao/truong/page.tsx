import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale, pick } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getPrograms, getSchools } from "@/lib/queries";
import { Breadcrumbs } from "@/components/ui";
import { SchoolGrid } from "@/components/SchoolGrid";
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
              pick({
                vi: "Sáu cơ sở đào tạo, mỗi nơi một thế mạnh ngành nghề và địa bàn. Số ngành hiển thị là số ngành đã đăng ký hoạt động giáo dục nghề nghiệp.",
                en: "Six institutions, each with its own strengths and location. The programme count shown is the number of registered occupations.",
                de: "Sechs Einrichtungen mit je eigenen Schwerpunkten und Standorten. Die Zahl nennt die registrierten Berufsprofile.",
              }, locale)
            }
          </p>
        </header>

        {/* The same three-by-two wall the landing page uses. The shared grid3
            class here was auto-fit, which at this width made four across and
            two below - six schools split five-one or four-two rather than into
            two even ranks. */}
        <SchoolGrid
          schools={schools}
          locale={locale}
          programCount={(id) => counts.get(id) ?? 0}
          countLabel={(count) =>
            count > 0
              ? pick(
                  {
                    vi: `${count} ngành`,
                    en: `${count} programmes`,
                    de: `${count} Programme`,
                  },
                  locale,
                )
              : pick({ vi: "Đang cập nhật", en: "Being updated", de: "Wird ergänzt" }, locale)
          }
        />
      </div>
    </div>
  );
}
