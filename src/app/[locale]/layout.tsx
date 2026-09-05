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
 * Pages here are rendered once and then re-used for five minutes.
 *
 * They used to be force-dynamic, which meant every page was rebuilt from the
 * database on every request - and, worse, that the router could not prefetch
 * anything, so a tap from the gateway to a landing page sat for well over a
 * second with the old page still on screen.
 *
 * The reason for it was local development: PGlite is an embedded single-process
 * engine and Next's static-generation workers are separate processes that
 * cannot share its data directory. That is still true, which is why building
 * locally needs DATABASE_URL to point at a real Postgres - the server it is
 * deployed to has one, and the build there uses it.
 *
 * Five minutes, not longer: the content is edited through the admin screen a
 * few times a year, and an editor should see their change without having to be
 * told about a cache.
 */
export const revalidate = 300;

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
