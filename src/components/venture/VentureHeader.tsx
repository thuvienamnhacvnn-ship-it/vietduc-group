"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LOCALES, LOCALE_SHORT, localePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { ThemeToggle } from "@/components/ThemeToggle";
import styles from "./VentureHeader.module.css";

type Item = { href: string; label: string };

/**
 * The investment arm's header.
 *
 * Flat and wide-tracked rather than the education side's serif masthead, and it
 * always carries a way back to the gateway: this arm is a destination a visitor
 * arrives at from there, and the other arm has to stay one click away.
 */
export function VentureHeader({ locale, items }: { locale: Locale; items: Item[] }) {
  const dict = getDictionary(locale);
  const [open, setOpen] = useState(false);
  const path = (href: string) => localePath(locale, href);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href={path("/")} className={styles.brand} aria-label={dict.brand.name}>
          <Image src="/brand/viet-duc-mark.png" alt="" width={34} height={37} />
          <span>
            <strong>{dict.brand.name}</strong>
            <em>{dict.venture.section}</em>
          </span>
        </Link>

        <nav className={`${styles.nav} ${open ? styles.navOpen : ""}`} aria-label={dict.nav.menu}>
          <ul>
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li className={styles.crossLink}>
              <Link href={path("/dao-tao")} onClick={() => setOpen(false)}>
                {dict.hub.education.name}
              </Link>
            </li>
            {/* On a phone the bar has no room for the language pill, so it
                moves into the panel instead of being dropped. */}
            <li className={styles.langsInline}>
              <ul aria-label={dict.nav.language}>
                {LOCALES.map((code) => (
                  <li key={code}>
                    <Link
                      href={localePath(code, "/dau-tu")}
                      hrefLang={code}
                      aria-current={code === locale ? "true" : undefined}
                      className={code === locale ? styles.langOn : undefined}
                    >
                      {LOCALE_SHORT[code]}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>

        <div className={styles.tools}>
          <ThemeToggle locale={locale} />

          <ul className={styles.langs} aria-label={dict.nav.language}>
            {LOCALES.map((code) => (
              <li key={code}>
                <Link
                  href={localePath(code, "/dau-tu")}
                  hrefLang={code}
                  aria-current={code === locale ? "true" : undefined}
                  className={code === locale ? styles.langOn : undefined}
                >
                  {LOCALE_SHORT[code]}
                </Link>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className={styles.burger}
            aria-expanded={open}
            aria-label={open ? dict.nav.close : dict.nav.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
