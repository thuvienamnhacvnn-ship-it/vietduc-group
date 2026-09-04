"use client";

import { useEffect, useState, type ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, LOCALE_SHORT, localePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { SearchDialog } from "@/components/SearchDialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import styles from "./SideRail.module.css";

export type RailItem = {
  href: string;
  label: string;
  /** One word for the phone's bottom bar, where the full name would clip. */
  short?: string;
  icon: RailIcon;
  /** Marks the link across to the other arm; it sits apart at the bottom. */
  cross?: boolean;
};

export type RailIcon = keyof typeof ICONS;

/**
 * Wayfinding marks, drawn as single stroked paths so they inherit currentColor
 * and stay legible at 20px. They are a shorthand, never the only affordance:
 * the rail widens on hover and on focus, and every label is always in the DOM.
 */
const ICONS = {
  about: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10.6v6M12 7.6v.6" strokeLinecap="round" />
    </svg>
  ),
  schools: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 3.6 2.9 8l9.1 4.4L21.1 8 12 3.6Z" strokeLinejoin="round" />
      <path d="M6.6 10.4v4.4c0 1.5 2.4 2.8 5.4 2.8s5.4-1.3 5.4-2.8v-4.4" strokeLinecap="round" />
    </svg>
  ),
  programs: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M4 5.4h6.2c1.1 0 2 .8 2 1.8v11c0-.9-.9-1.6-2-1.6H4V5.4Z" strokeLinejoin="round" />
      <path d="M20 5.4h-6.2c-1.1 0-2 .8-2 1.8v11c0-.9.9-1.6 2-1.6H20V5.4Z" strokeLinejoin="round" />
    </svg>
  ),
  library: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M6.4 3.6h7.4l4 4v12.8H6.4V3.6Z" strokeLinejoin="round" />
      <path d="M13.4 3.8v4.2h4.2M9.2 13h5.6M9.2 16.2h5.6" strokeLinecap="round" />
    </svg>
  ),
  faq: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M4 5.6h16v10.2H9.2L5 19.4v-3.6H4V5.6Z" strokeLinejoin="round" />
      <path d="M9.8 9.4a2.2 2.2 0 1 1 2.6 2.2v1M12.3 14.2v.5" strokeLinecap="round" />
    </svg>
  ),
  contact: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M3.4 6.4h17.2v11.2H3.4V6.4Z" strokeLinejoin="round" />
      <path d="m3.8 7 8.2 5.6L20.2 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  venture: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M3 18.6V7.4" strokeLinecap="round" />
      <path d="M21 18.6v-6.8H8.4V9.2H3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 15.2h18" strokeLinecap="round" />
      <circle cx="6.2" cy="9.8" r="1.5" />
    </svg>
  ),
  projects: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M3.6 20.4V9.6l6.6-4.4v15.2M10.2 20.4V11l8.2 2.4v7" strokeLinejoin="round" />
      <path d="M6.4 11.6v.6M6.4 15v.6M13.6 15.4v.6" strokeLinecap="round" />
    </svg>
  ),
  services: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M4 6.4h16M4 12h16M4 17.6h10" strokeLinecap="round" />
    </svg>
  ),
  process: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="6" cy="7" r="2.2" />
      <circle cx="18" cy="17" r="2.2" />
      <path d="M8.2 7H14a2.6 2.6 0 0 1 0 5.2H10a2.6 2.6 0 0 0 0 5.2h5.8" strokeLinecap="round" />
    </svg>
  ),
  education: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 4 2.6 8.4 12 12.8l9.4-4.4L12 4Z" strokeLinejoin="round" />
      <path d="M6.6 11v4.6c0 1.5 2.4 2.8 5.4 2.8s5.4-1.3 5.4-2.8V11" strokeLinecap="round" />
      <path d="M21.4 9v5.2" strokeLinecap="round" />
    </svg>
  ),
} satisfies Record<string, ReactElement>;

type Props = {
  locale: Locale;
  items: RailItem[];
  /** Where the language switch should send the reader on this arm. */
  langBase: string;
  /** Optional call to action pinned above the tools. */
  cta?: { href: string; label: string };
  /** Search is only wired on the arm that has an index. */
  withSearch?: boolean;
  /** A tel: href, when one is configured. Drives the call slot on a phone. */
  tel?: string | null;
  /** Label for the call slot. */
  callLabel?: string;
  tone?: "portal" | "venture";
};

/**
 * The navigation, as a thin rail down the left edge.
 *
 * Collapsed it is a column of marks; hovering or tabbing into it widens the
 * rail and the labels appear beside them. The page is not pushed around when
 * that happens - the rail expands over the content rather than reflowing it,
 * so a reader mid-paragraph never loses their line.
 *
 * Below the desktop breakpoint a rail would eat a third of the screen, so it
 * turns back into a bar with a panel.
 */
export function SideRail({
  locale,
  items,
  langBase,
  cta,
  withSearch,
  tel,
  callLabel,
  tone = "portal",
}: Props) {
  const dict = getDictionary(locale);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const path = (href: string) => localePath(locale, href);

  // A route change closes the mobile panel; without this it survives navigation
  // and traps the reader on the new page. Adjusting during render is React's
  // documented pattern for "reset when a value changes".
  const [renderedPath, setRenderedPath] = useState(pathname);
  if (pathname !== renderedPath) {
    setRenderedPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => {
    const full = path(href);
    return pathname === full || (href !== "/" && pathname.startsWith(`${full}/`));
  };

  const main = items.filter((item) => !item.cross);
  const cross = items.filter((item) => item.cross);
  /* Three destinations at the foot, then call and the full menu: five slots is
     as many as a thumb can aim at across a phone. */
  const quick = main.slice(0, 3);

  return (
    <>
      {/*
        On a phone the chrome splits in two. The top bar carries the tools a
        reader reaches for while reading - search, appearance, language - as
        real controls rather than as a logo. The foot carries where to go, with
        the one action the page is for raised into the middle of it, because
        that is the spot a thumb rests on.
      */}
      <header className={styles.topbar}>
        {withSearch ? (
          <button
            type="button"
            className={styles.tool}
            onClick={() => setSearchOpen(true)}
            aria-label={dict.nav.search}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
              <circle cx="11" cy="11" r="6.4" />
              <path d="m15.8 15.8 4 4" strokeLinecap="round" />
            </svg>
          </button>
        ) : (
          <span />
        )}

        <div className={styles.topTools}>
          <div className={styles.toolTheme}>
            <ThemeToggle locale={locale} />
          </div>

          <ul className={styles.topLangs} aria-label={dict.nav.language}>
            {LOCALES.map((code) => (
              <li key={code}>
                <Link
                  href={localePath(code, langBase)}
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
      </header>

      <nav className={styles.bottombar} aria-label={dict.nav.menu}>
        {quick.slice(0, 2).map((item) => (
          <Link
            key={item.href}
            href={path(item.href)}
            className={styles.slot}
            aria-current={isActive(item.href) ? "page" : undefined}
          >
            <span className={styles.slotIcon}>{ICONS[item.icon]}</span>
            <span className={styles.slotLabel}>{item.short ?? item.label}</span>
          </Link>
        ))}

        {/* The raised action: what the whole arm is asking the reader to do. */}
        {cta ? (
          <Link href={path(cta.href)} className={styles.fab}>
            <span className={styles.fabRing} aria-hidden="true" />
            <span className={styles.fabIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5.4v13.2M5.4 12h13.2" strokeLinecap="round" />
              </svg>
            </span>
            <span className={styles.fabLabel}>{cta.label}</span>
          </Link>
        ) : (
          <span />
        )}

        {tel ? (
          <a href={tel} className={styles.slot}>
            <span className={styles.slotIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                <path
                  d="M4.6 4h3l1.5 3.8-1.9 1.3a12 12 0 0 0 5.1 5.1l1.3-1.9 3.8 1.5v3a1.4 1.4 0 0 1-1.5 1.4A15.8 15.8 0 0 1 3.2 5.5 1.4 1.4 0 0 1 4.6 4Z"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className={styles.slotLabel}>{callLabel}</span>
          </a>
        ) : (
          <Link
            href={path(quick[2]?.href ?? "/")}
            className={styles.slot}
            aria-current={quick[2] && isActive(quick[2].href) ? "page" : undefined}
          >
            <span className={styles.slotIcon}>{quick[2] ? ICONS[quick[2].icon] : null}</span>
            <span className={styles.slotLabel}>{quick[2]?.short ?? quick[2]?.label}</span>
          </Link>
        )}

        <button
          type="button"
          className={styles.slot}
          aria-expanded={open}
          aria-controls="side-rail"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={styles.slotIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </span>
          <span className={styles.slotLabel}>{open ? dict.nav.close : dict.nav.menu}</span>
        </button>
      </nav>

      {open ? <button type="button" className={styles.scrim} aria-label={dict.nav.close} onClick={() => setOpen(false)} /> : null}

      <div
        id="side-rail"
        className={`${styles.rail} ${tone === "venture" ? styles.venture : ""} ${open ? styles.railOpen : ""}`}
      >
        <Link href={path("/")} className={styles.brand} aria-label={dict.brand.name}>
          <Image src="/brand/viet-duc-mark.png" alt="" width={40} height={43} />
          <span className={styles.brandText}>
            <strong>{dict.brand.name}</strong>
            <em>{dict.brand.motto}</em>
          </span>
        </Link>

        <nav className={styles.nav} aria-label={dict.nav.menu}>
          <ul>
            {main.map((item) => (
              <li key={item.href}>
                <Link
                  href={path(item.href)}
                  className={styles.item}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  <span className={styles.icon}>{ICONS[item.icon]}</span>
                  <span className={styles.label}>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {cross.length ? (
            <ul className={styles.cross}>
              {cross.map((item) => (
                <li key={item.href}>
                  <Link href={path(item.href)} className={styles.item}>
                    <span className={styles.icon}>{ICONS[item.icon]}</span>
                    <span className={styles.label}>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </nav>

        <div className={styles.tools}>
          {withSearch ? (
            <button
              type="button"
              className={styles.item}
              onClick={() => setSearchOpen(true)}
              aria-label={dict.nav.search}
            >
              <span className={styles.icon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <circle cx="11" cy="11" r="6.4" />
                  <path d="m15.8 15.8 4 4" strokeLinecap="round" />
                </svg>
              </span>
              <span className={styles.label}>{dict.nav.search}</span>
            </button>
          ) : null}

          {cta ? (
            <Link href={path(cta.href)} className={`${styles.item} ${styles.cta}`}>
              <span className={styles.icon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M12 5.2v13.6M5.2 12h13.6" strokeLinecap="round" />
                </svg>
              </span>
              <span className={styles.label}>{cta.label}</span>
            </Link>
          ) : null}

          <div className={styles.theme}>
            <ThemeToggle locale={locale} />
            <span className={styles.label}>{dict.theme.label}</span>
          </div>

          <ul className={styles.langs} aria-label={dict.nav.language}>
            {LOCALES.map((code) => (
              <li key={code}>
                <Link
                  href={localePath(code, langBase)}
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

      {withSearch ? (
        <SearchDialog locale={locale} open={searchOpen} onClose={() => setSearchOpen(false)} />
      ) : null}
    </>
  );
}
