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
            <h2>{pick({ vi: "Chúng tôi làm gì với thông tin này", en: "What we do with your details", de: "Was mit Ihren Angaben geschieht", ja: "お預かりした情報の取り扱い", ko: "받은 정보를 어떻게 쓰는지", "zh-TW": "我們如何處理這些資料" }, locale)}</h2>
            <ul>
              <li>
                {
                  pick({
                    vi: "Chuyển tới phòng tuyển sinh của trường thành viên phụ trách ngành bạn chọn.",
                    en: "Pass them to the admissions office of the member school that runs your chosen field.",
                    de: "Weitergabe an das Zulassungsbüro der zuständigen Mitgliedsschule.",
                    ja: "お選びの分野を担当する加盟校の入学窓口へお伝えします。",
                    ko: "고르신 분야를 담당하는 회원 학교의 입학 부서로 전달합니다.",
                    "zh-TW": "轉交給開設您所選領域之成員學校的招生單位。",
                  }, locale)
                }
              </li>
              <li>
                {
                  pick({
                    vi: "Chỉ dùng cho mục đích tư vấn tuyển sinh; không chia sẻ cho bên thứ ba vì mục đích tiếp thị.",
                    en: "Use them only for admissions advice; never share them with third parties for marketing.",
                    de: "Nutzung nur zur Bildungsberatung; keine Weitergabe zu Marketingzwecken.",
                    ja: "入学相談の目的にのみ用い、営業目的で第三者に渡すことはありません。",
                    ko: "입학 상담 목적으로만 쓰며, 마케팅 목적으로 제삼자에게 제공하지 않습니다.",
                    "zh-TW": "僅用於招生諮詢用途，不會為行銷目的提供給第三方。",
                  }, locale)
                }
              </li>
              <li>
                {
                  pick({
                    vi: "Lưu tối đa 24 tháng kể từ lần liên hệ cuối, sau đó xoá.",
                    en: "Keep them for at most 24 months after the last contact, then delete them.",
                    de: "Speicherung höchstens 24 Monate nach dem letzten Kontakt.",
                    ja: "最後のご連絡から最長 24 か月保管し、その後は削除します。",
                    ko: "마지막 연락일로부터 최대 24개월 보관한 뒤 삭제합니다.",
                    "zh-TW": "自最後一次聯繫起最多保存 24 個月，之後即刪除。",
                  }, locale)
                }
              </li>
              <li>
                {
                  pick({
                    vi: "Không kết luận bạn có đủ điều kiện trúng tuyển – việc đó do nhà trường quyết định.",
                    en: "Not decide your eligibility - that is the school's decision, not this form's.",
                    de: "Keine Entscheidung über Ihre Zulassung - das obliegt der Schule.",
                    ja: "合否や出願資格を判断するものではありません。それは学校が決めることです。",
                    ko: "합격 여부나 지원 자격을 판단하지 않습니다. 그것은 학교가 정합니다.",
                    "zh-TW": "不會判定您是否符合錄取資格——那由學校決定。",
                  }, locale)
                }
              </li>
            </ul>

            {tel ? (
              <p className={styles.callout}>
                {pick({ vi: "Muốn gọi trực tiếp?", en: "Prefer to call?", de: "Lieber anrufen?", ja: "お電話をご希望ですか。", ko: "전화로 연락하고 싶으신가요?", "zh-TW": "想直接來電嗎？" }, locale)}{" "}
                <a href={tel}>{settings.contact.admissionsPhone}</a>
              </p>
            ) : null}
          </aside>
        </div>
      </div>
    </div>
  );
}
