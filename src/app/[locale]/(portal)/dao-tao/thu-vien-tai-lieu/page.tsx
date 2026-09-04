import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, t, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getSourceDocuments } from "@/lib/queries";
import { formatDate } from "@/lib/format";
import { Badge, Breadcrumbs, EmptyState } from "@/components/ui";
import shell from "../../page-shell.module.css";
import styles from "./library.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "vi";
  return {
    title: getDictionary(locale).nav.library,
    alternates: { canonical: `/${locale}/thu-vien-tai-lieu` },
  };
}

export default async function LibraryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const documents = await getSourceDocuments();

  return (
    <div className={shell.page}>
      <div className="shell">
        <Breadcrumbs locale={locale} trail={[{ label: dict.nav.library }]} />
        <header className={shell.header}>
          <h1>{dict.nav.library}</h1>
          <p className={shell.lead}>
            {
              {
                vi: "Các tài liệu nguồn mà nội dung trên website này được biên tập từ đó. Tài liệu chỉ tải xuống được khi quản trị viên cho phép công bố.",
                en: "The source documents this website's content is edited from. A document can only be downloaded once an editor has cleared it for publication.",
                de: "Die Quelldokumente, aus denen die Inhalte dieser Website redigiert wurden. Ein Download ist erst nach Freigabe durch die Redaktion möglich.",
              }[locale]
            }
          </p>
        </header>

        {!documents.length ? (
          <EmptyState title={dict.common.empty} />
        ) : (
          <ul className={styles.list}>
            {documents.map((document) => (
              <li key={document.id} className={styles.item}>
                <div className={styles.icon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" strokeLinejoin="round" />
                    <path d="M14 3v5h5" strokeLinejoin="round" />
                  </svg>
                </div>

                <div className={styles.main}>
                  <h2>{t(document.title, locale)}</h2>
                  <p className={styles.meta}>
                    {document.originalName}
                    {document.pageCount ? ` · ${document.pageCount} ${dict.common.page}` : ""}
                    {document.documentDate ? ` · ${formatDate(document.documentDate, locale)}` : ""}
                  </p>
                  <div className={styles.badges}>
                    <Badge tone="neutral">{document.language.toUpperCase()}</Badge>
                    {document.ocrUsed ? (
                      <Badge tone="gold">
                        {
                          {
                            vi: "Đọc bằng OCR",
                            en: "Read by OCR",
                            de: "Per OCR gelesen",
                          }[locale]
                        }
                      </Badge>
                    ) : null}
                  </div>
                </div>

                <div className={styles.action}>
                  {document.downloadable && document.publicPath ? (
                    <a href={document.publicPath} className={styles.download} download>
                      {dict.common.download}
                    </a>
                  ) : (
                    <span className={styles.unavailable}>
                      {
                        {
                          vi: "Chưa công bố tải xuống",
                          en: "Not published for download",
                          de: "Kein Download freigegeben",
                        }[locale]
                      }
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
