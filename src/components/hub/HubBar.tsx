import Image from "next/image";
import Link from "next/link";
import { LOCALES, LOCALE_SHORT, localePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import type { SocialSettings } from "@/lib/site-config";
import { SocialLinks, hasSocial } from "@/components/SocialLinks";
import { ThemeToggle } from "@/components/ThemeToggle";
import styles from "./HubBar.module.css";

/**
 * The gateway's own navigation bar.
 *
 * Deliberately thinner than the education header: at this point the visitor has
 * not chosen a field yet, so it carries only what belongs to the group as a
 * whole - the two fields, the corporate pages, the languages and the channels.
 */
export function HubBar({ locale, social }: { locale: Locale; social: SocialSettings }) {
  const dict = getDictionary(locale);
  const path = (href: string) => localePath(locale, href);

  const links = [
    { href: "/dao-tao", label: dict.hub.education.name },
    { href: "/dau-tu", label: dict.hub.venture.name },
    { href: "/gioi-thieu", label: dict.nav.about },
    { href: "/tin-tuc", label: dict.nav.news },
    { href: "/lien-he", label: dict.nav.contact },
  ];

  return (
    <header className={`on-dark ${styles.bar}`}>
      <div className={styles.inner}>
        <Link href={path("/")} className={styles.brand}>
          <Image
            src="/brand/viet-duc-mark.png"
            alt=""
            width={40}
            height={43}
            className={styles.brandMark}
          />
          <span className={styles.brandText}>
            <strong>{dict.brand.name}</strong>
            <em>{dict.brand.motto}</em>
          </span>
        </Link>

        <nav className={styles.nav} aria-label={dict.nav.menu}>
          <ul>
            {links.map((link) => (
              <li key={link.href}>
                <Link href={path(link.href)}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.tools}>
          {hasSocial(social) ? (
            <div className={styles.social}>
              <SocialLinks social={social} locale={locale} variant="plain" />
            </div>
          ) : null}

          <ThemeToggle locale={locale} />

          <ul className={styles.langs} aria-label={dict.nav.language}>
            {LOCALES.map((code) => (
              <li key={code}>
                <Link
                  href={localePath(code, "/")}
                  hrefLang={code}
                  aria-current={code === locale ? "true" : undefined}
                  className={code === locale ? styles.langOn : undefined}
                >
                  {LOCALE_SHORT[code]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
