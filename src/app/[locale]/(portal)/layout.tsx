import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getSiteSettings } from "@/lib/settings";
import { telHref } from "@/lib/site-config";
import { getCategories, getSchools } from "@/lib/queries";
import { suggestedQuestions } from "@/lib/rag/advisor";
import { SideRail, type RailItem } from "@/components/rail/SideRail";
import { SiteFooter } from "@/components/SiteFooter";
import { Advisor } from "@/components/Advisor";
import { CookieNotice } from "@/components/CookieNotice";
import { Reveal } from "@/components/Reveal";

/**
 * The chrome of the education arm and the group's own pages.
 *
 * A route group, so it adds nothing to the URL: /vi/dao-tao and /vi/gioi-thieu
 * are inside it, while the gateway at /vi and the investment arm under
 * /vi/dau-tu carry their own chrome instead.
 */
export const dynamic = "force-dynamic";

export default async function PortalLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;

  const [settings, schools, categories] = await Promise.all([
    getSiteSettings(),
    getSchools(),
    getCategories(),
  ]);
  const dict = getDictionary(locale);

  const railItems: RailItem[] = [
    { href: "/gioi-thieu", label: dict.nav.about, short: dict.nav.about, icon: "about" },
    { href: "/dao-tao/truong", label: dict.nav.schools, short: dict.nav.schoolsShort, icon: "schools" },
    {
      href: "/dao-tao/chuong-trinh",
      label: dict.nav.programs,
      short: dict.nav.programsShort,
      icon: "programs",
    },
    { href: "/dao-tao/thu-vien-tai-lieu", label: dict.nav.library, icon: "library" },
    { href: "/dao-tao/cau-hoi-thuong-gap", label: dict.nav.faq, icon: "faq" },
    { href: "/lien-he", label: dict.nav.contact, icon: "contact" },
    { href: "/dau-tu", label: dict.hub.venture.name, icon: "venture", cross: true },
  ];

  return (
    <>
      <SideRail
        locale={locale}
        items={railItems}
        langBase="/dao-tao"
        cta={{ href: "/dao-tao/dang-ky-tu-van", label: dict.nav.apply }}
        withSearch
        tel={telHref(settings.contact.phoneE164 || settings.contact.phone)}
        callLabel={dict.contact.callNow}
      />

      <main id="main" data-rail>
        {children}
      </main>

      <div data-rail>
        <SiteFooter
        locale={locale}
        contact={settings.contact}
        social={settings.social}
        schools={schools}
        categories={categories}
        />
      </div>

      <Advisor locale={locale} contact={settings.contact} suggestions={suggestedQuestions(locale)} />
      <CookieNotice locale={locale} />
      <Reveal />
    </>
  );
}
