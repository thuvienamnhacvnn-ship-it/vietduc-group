import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, t, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getFaqs, getSourceDocuments } from "@/lib/queries";
import { Breadcrumbs, EmptyState } from "@/components/ui";
import { FaqList } from "@/components/FaqList";
import { PageHead } from "@/components/PageHead";
import shell from "../../page-shell.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "vi";
  return {
    title: getDictionary(locale).nav.faq,
    alternates: { canonical: `/${locale}/cau-hoi-thuong-gap` },
  };
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const [faqs, documents] = await Promise.all([getFaqs(), getSourceDocuments()]);
  const docTitle = new Map(documents.map((d) => [d.slug, t(d.title, locale)]));

  const items = faqs.map((faq) => ({
    id: faq.id,
    topic: faq.topic,
    question: t(faq.question, locale),
    answer: t(faq.answer, locale),
    source: faq.provenance?.source ? (docTitle.get(faq.provenance.source) ?? null) : null,
    page: faq.provenance?.page ?? null,
  }));

  // FAQ structured data is emitted only because these exact questions and
  // answers are genuinely rendered on this page.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <div className={shell.page}>
      <div className="shell">
        <PageHead
          crumbs={<Breadcrumbs locale={locale} trail={[{ label: dict.nav.faq }]} />}
          eyebrow={{ vi: "Hỏi đáp", en: "Questions", de: "Fragen" }[locale]}
          title={dict.nav.faq}
          lead={
            {
              vi: "Mỗi câu trả lời dưới đây đều dẫn nguồn từ tài liệu chính thức của Việt Đức Group.",
              en: "Every answer below cites the official Viet Duc Group document it comes from.",
              de: "Jede Antwort nennt das offizielle Dokument, aus dem sie stammt.",
            }[locale]
          }
        />

        {!items.length ? (
          <EmptyState title={dict.common.empty} />
        ) : (
          <FaqList locale={locale} items={items} />
        )}
      </div>

      {items.length ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      ) : null}
    </div>
  );
}
