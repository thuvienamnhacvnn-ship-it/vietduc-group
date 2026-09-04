import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LOCALES, LOCALE_TAG, isLocale, type Locale } from "@/lib/i18n/config";
import { getSiteSettings } from "@/lib/settings";
import { localisedSeo, resolveSiteUrl } from "@/lib/site-config";

/**
 * The locale boundary, and nothing else.
 *
 * The site has three faces - the gateway, the education arm and the investment
 * arm - and each carries its own header, footer and palette. Keeping the shared
 * chrome out of this layout is what lets the gateway fill the viewport with no
 * navigation bar of the arms around it; the chrome lives in the route groups
 * below instead.
 *
 * Everything under here renders per request. The content lives in a database,
 * and the local development database (PGlite) is an embedded single-process
 * engine - Next's static-generation workers are separate processes and cannot
 * share it. On a deployment backed by real Postgres this can be relaxed.
 */
export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "vi";
  const settings = await getSiteSettings();
  const { title, description } = localisedSeo(settings.seo, locale);
  const siteUrl = resolveSiteUrl(settings.seo.siteUrl);

  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s | ${settings.seo.siteName}` },
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(LOCALES.map((code) => [LOCALE_TAG[code], `/${code}`])),
    },
    openGraph: {
      type: "website",
      siteName: settings.seo.siteName,
      title,
      description,
      locale: LOCALE_TAG[locale],
      url: `${siteUrl}/${locale}`,
      images: settings.seo.ogImage ? [{ url: settings.seo.ogImage }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return children;
}
