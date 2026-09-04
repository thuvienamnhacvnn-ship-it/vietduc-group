import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { telHref, type ContactSettings, type SocialSettings } from "@/lib/site-config";
import { SocialLinks, hasSocial } from "@/components/SocialLinks";
import styles from "./VentureFooter.module.css";

/**
 * The investment arm's footer: contact, the way back to the other two faces of
 * the group, and the legal pages the whole site shares.
 */
export function VentureFooter({
  locale,
  contact,
  social,
}: {
  locale: Locale;
  contact: ContactSettings;
  social: SocialSettings;
}) {
  const dict = getDictionary(locale);
  const path = (href: string) => localePath(locale, href);
  const tel = telHref(contact.phoneE164 || contact.phone);

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.lead}>
          <p className={styles.eyebrow}>{dict.venture.section}</p>
          <p className={styles.motto}>{dict.brand.motto}</p>
          {hasSocial(social) ? <SocialLinks social={social} locale={locale} variant="boxed" /> : null}
        </div>

        <div className={styles.col}>
          <h2>{dict.contact.title}</h2>
          <ul>
            <li>{contact.headquarters}</li>
            {tel ? (
              <li>
                <a href={tel}>{contact.phone}</a>
              </li>
            ) : null}
            {contact.email ? (
              <li>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </li>
            ) : null}
            <li>
              <Link href={path("/lien-he")}>{dict.nav.contact}</Link>
            </li>
          </ul>
        </div>

        <div className={styles.col}>
          <h2>{dict.brand.name}</h2>
          <ul>
            <li>
              <Link href={path("/")}>{dict.nav.home}</Link>
            </li>
            <li>
              <Link href={path("/dao-tao")}>{dict.hub.education.name}</Link>
            </li>
            <li>
              <Link href={path("/gioi-thieu")}>{dict.nav.aboutGroup}</Link>
            </li>
            <li>
              <Link href={path("/tin-tuc")}>{dict.nav.news}</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
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
      </div>
    </footer>
  );
}
