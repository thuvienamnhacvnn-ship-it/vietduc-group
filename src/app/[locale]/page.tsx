import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getSiteSettings } from "@/lib/settings";
import { suggestedQuestions } from "@/lib/rag/advisor";
import { Advisor } from "@/components/Advisor";
import { CookieNotice } from "@/components/CookieNotice";
import { SocialLinks, hasSocial } from "@/components/SocialLinks";
import { HubBar } from "@/components/hub/HubBar";
import { HubDecor } from "@/components/hub/HubDecor";
import { HubBackdrop } from "@/components/hub/HubBackdrop";
import { HubStage, type HubBranch } from "@/components/hub/HubStage";
import styles from "./hub.module.css";

/**
 * The gateway.
 *
 * The group runs two businesses that share a name and nothing else about how
 * they are read: a family looking for a vocational course and an investor
 * looking at a resort want different pages entirely. This page asks which one
 * the visitor is, and hands them over.
 *
 * The backdrop is drawn from real project photography on both sides, so the
 * choice is made in front of the actual work rather than a stock image.
 */
export default async function HubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);
  const settings = await getSiteSettings();
  const path = (href: string) => localePath(locale, href);

  const branches: [HubBranch, HubBranch] = [
    {
      key: "education",
      href: path("/dao-tao"),
      name: dict.hub.education.name,
      tagline: dict.hub.education.tagline,
      desc: dict.hub.education.desc,
      icon: "education",
    },
    {
      key: "venture",
      href: path("/dau-tu"),
      name: dict.hub.venture.name,
      tagline: dict.hub.venture.tagline,
      desc: dict.hub.venture.desc,
      icon: "venture",
    },
  ];

  // Real work on both sides of the group, alternating, so whichever frame a
  // visitor lands on shows something the group actually built or designed.
  const backdrops = [
    { src: "/media/hospitality/bo-trach-aerial-fields.webp" },
    { src: "/media/hero/group-hq.webp" },
    { src: "/media/hospitality/bo-trach-pool-night.webp" },
    { src: "/media/hospitality/bo-trach-terrace.webp" },
  ];

  return (
    <div className={styles.hub}>
      <a className="skip-link" href="#main">
        {dict.nav.skipToContent}
      </a>

      <HubBackdrop shots={backdrops} label={dict.hub.backdropLabel} />

      <HubBar locale={locale} social={settings.social} />

      <main id="main" className={styles.main}>
        <HubStage
          branches={branches}
          enterLabel={dict.hub.enter}
          orbitLabel={dict.hub.orbitLabel}
          channels={
            hasSocial(settings.social) ? (
              <SocialLinks social={settings.social} locale={locale} variant="boxed" />
            ) : null
          }
          heading={
            <div className={styles.intro}>
              <p className={styles.eyebrow}>{dict.hub.eyebrow}</p>
              <h1 className={styles.title}>{dict.hub.title}</h1>
              <p className={styles.lead}>{dict.hub.lead}</p>
            </div>
          }
        />

        <HubDecor />
      </main>

      <footer className={`on-dark ${styles.footer}`}>
        <p>
          © {new Date().getFullYear()} {dict.brand.name}. {dict.footer.rights}
        </p>
        <ul>
          <li>
            <Link href={path("/chinh-sach-bao-mat")}>{dict.footer.privacy}</Link>
          </li>
          <li>
            <Link href={path("/chinh-sach-cookie")}>{dict.footer.cookies}</Link>
          </li>
          <li>
            <Link href={path("/dieu-khoan-su-dung")}>{dict.footer.terms}</Link>
          </li>
          <li>
            <Link href={path("/impressum")}>{dict.footer.imprint}</Link>
          </li>
        </ul>
      </footer>

      <Advisor locale={locale} contact={settings.contact} suggestions={suggestedQuestions(locale)} />
      <CookieNotice locale={locale} />
    </div>
  );
}
