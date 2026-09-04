import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getSiteSettings } from "@/lib/settings";
import { telHref } from "@/lib/site-config";
import { suggestedQuestions } from "@/lib/rag/advisor";
import { Advisor } from "@/components/Advisor";
import { SocialRail } from "@/components/SocialRail";
import { CookieNotice } from "@/components/CookieNotice";
import { Reveal } from "@/components/Reveal";
import { SideRail, type RailItem } from "@/components/rail/SideRail";
import { VentureFooter } from "@/components/venture/VentureFooter";
import shell from "@/components/venture/venture-shell.module.css";

/**
 * The chrome of the investment arm.
 *
 * A route group, so /vi/dau-tu keeps its address while getting a header, a
 * footer and a palette of its own - the education pages and this arm share a
 * brand but should not read as the same website.
 */
export const dynamic = "force-dynamic";

export default async function VentureLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);
  const settings = await getSiteSettings();

  const railItems: RailItem[] = [
    { href: "/dau-tu", label: dict.venture.section, short: dict.nav.ventureShort, icon: "venture" },
    {
      href: "/dau-tu/du-an/khach-san-nghi-duong-toki",
      label: dict.venture.projects,
      short: dict.venture.projects,
      icon: "projects",
    },
    { href: "/lien-he", label: dict.nav.contact, icon: "contact" },
    { href: "/dao-tao", label: dict.hub.education.name, icon: "education", cross: true },
  ];

  return (
    <div className={shell.scope}>
      <a className="skip-link" href="#main">
        {dict.nav.skipToContent}
      </a>

      <SideRail
        locale={locale}
        items={railItems}
        langBase="/dau-tu"
        tone="venture"
        cta={{ href: "/lien-he", label: dict.venture.contactCta, short: dict.nav.contact }}
        tel={telHref(settings.contact.phoneE164 || settings.contact.phone)}
        callLabel={dict.contact.callNow}
      />

      <main id="main" className={shell.body} data-rail>
        {children}
      </main>

      <div data-rail>
        <VentureFooter locale={locale} contact={settings.contact} social={settings.social} />
      </div>

      <SocialRail locale={locale} social={settings.social} />
      <Advisor locale={locale} contact={settings.contact} suggestions={suggestedQuestions(locale)} />
      <CookieNotice locale={locale} />
      <Reveal />
    </div>
  );
}
