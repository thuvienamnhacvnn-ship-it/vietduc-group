import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, t, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getPage } from "@/lib/queries";
import { formatDate } from "@/lib/format";
import { Breadcrumbs, Prose } from "@/components/ui";
import shell from "../page-shell.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "vi";
  const page = await getPage(slug);
  if (!page) return {};
  return {
    title: page.seoTitle ? t(page.seoTitle, locale) : t(page.title, locale),
    description: page.seoDescription ? t(page.seoDescription, locale) : undefined,
    alternates: { canonical: `/${locale}/${slug}` },
  };
}

export default async function CmsPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const page = await getPage(slug);
  if (!page) notFound();

  return (
    <div className={shell.page}>
      <div className="shell-narrow">
        <Breadcrumbs locale={locale} trail={[{ label: t(page.title, locale) }]} />
        <header className={shell.header}>
          <h1>{t(page.title, locale)}</h1>
        </header>

        {page.body ? <Prose markdown={t(page.body, locale)} /> : null}

        <p className={shell.notice} style={{ marginTop: "var(--s-7)" }}>
          <span>
            {dict.common.updated}: {formatDate(page.updatedAt, locale)}
          </span>
        </p>
      </div>
    </div>
  );
}
