"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, LOCALE_SHORT, localePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { PRIMARY_SOCIAL, type ContactSettings, type SocialSettings } from "@/lib/site-config";
import { SocialLinks, hasSocial } from "./SocialLinks";
import { SearchDialog } from "./SearchDialog";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./SiteHeader.module.css";

type NavItem = { href: string; label: string; children?: { href: string; label: string }[] };

type Props = {
  locale: Locale;
  social: SocialSettings;
  contact: ContactSettings;
  fields: { slug: string; label: string }[];
  schools: { slug: string; label: string }[];
};

export function SiteHeader({ locale, social, contact, fields, schools }: Props) {
  const dict = getDictionary(locale);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  const nav: NavItem[] = [
    {
      href: "/gioi-thieu",
      label: dict.nav.about,
      children: [
        { href: "/gioi-thieu", label: dict.nav.aboutGroup },
        { href: "/tam-nhin-su-menh", label: dict.nav.vision },
        { href: "/doi-ngu", label: dict.nav.people },
        { href: "/doi-tac", label: dict.nav.partners },
        { href: "/hoat-dong", label: dict.nav.activities },
      ],
    },
    {
      href: "/dao-tao/truong",
      label: dict.nav.schools,
      children: schools.map((s) => ({ href: `/dao-tao/truong/${s.slug}`, label: s.label })),
    },
    {
      href: "/dao-tao/chuong-trinh",
      label: dict.nav.programsShort,
      children: [
        { href: "/dao-tao/chuong-trinh", label: dict.nav.explorer },
        ...fields.map((f) => ({ href: `/dao-tao/chuong-trinh?linh-vuc=${f.slug}`, label: f.label })),
      ],
    },
    { href: "/dao-tao/thu-vien-tai-lieu", label: dict.nav.libraryShort },
    { href: "/dao-tao/cau-hoi-thuong-gap", label: dict.nav.faqShort },
    { href: "/lien-he", label: dict.nav.contact },
    { href: "/dau-tu", label: dict.nav.ventureShort },
  ];

  // Route changes close the mobile panel; without this the panel survives
  // navigation and traps the reader on the new page. Adjusting state during
  // render - React's documented pattern for "reset when a value changes" -
  // avoids the extra commit an effect would cause.
  const [renderedPath, setRenderedPath] = useState(pathname);
  if (pathname !== renderedPath) {
    setRenderedPath(pathname);
    setOpen(false);
    setExpanded(null);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const path = (href: string) => localePath(locale, href);
  const isActive = (href: string) => {
    const full = path(href);
    return pathname === full || (href !== "/" && pathname.startsWith(`${full}/`));
  };

  // The locale switcher must keep the reader on the page they are looking at.
  const swapLocale = (target: Locale) => {
    const rest = pathname.replace(/^\/(vi|de|en)/, "") || "/";
    return localePath(target, rest);
  };

  return (
    <>
      <a className="skip-link" href="#main">
        {dict.nav.skipToContent}
      </a>

      <div className={styles.topbar}>
        <div className={`shell ${styles.topbarInner}`}>
          <p className={styles.motto}>{dict.brand.motto}</p>
          <div className={styles.topbarRight}>
            {contact.admissionsPhone ? (
              <a className={styles.topPhone} href={`tel:${contact.phoneE164 || contact.admissionsPhone}`}>
                {dict.contact.hotline}: <strong>{contact.admissionsPhone}</strong>
              </a>
            ) : null}
            {hasSocial(social, PRIMARY_SOCIAL) ? (
              <SocialLinks social={social} locale={locale} keys={PRIMARY_SOCIAL} size="sm" />
            ) : null}
          </div>
        </div>
      </div>

      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}>
        <div className={`shell ${styles.inner}`}>
          <Link href={path("/")} className={styles.brand} aria-label={dict.brand.name}>
            <Image
              src="/brand/viet-duc-group-logo.png"
              alt=""
              width={459}
              height={167}
              className={styles.logo}
              priority
            />
          </Link>

          <nav className={styles.desktopNav} aria-label={dict.nav.menu}>
            <ul className={styles.navList}>
              {nav.map((item) => (
                <li key={item.href} className={item.children ? styles.hasChildren : undefined}>
                  <Link
                    href={path(item.href)}
                    className={styles.navLink}
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    {item.label}
                    {item.children ? <ChevronIcon /> : null}
                  </Link>
                  {item.children ? (
                    <div className={styles.dropdown}>
                      <ul>
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link href={path(child.href)}>{child.label}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.iconButton}
              onClick={() => setSearchOpen(true)}
              aria-label={dict.search.open}
            >
              <SearchIcon />
            </button>

            <ThemeToggle locale={locale} />

            <div className={styles.locales} role="group" aria-label={dict.nav.language}>
              {LOCALES.map((code) => (
                <Link
                  key={code}
                  href={swapLocale(code)}
                  className={`${styles.localeLink} ${code === locale ? styles.localeActive : ""}`}
                  hrefLang={code}
                  aria-current={code === locale ? "true" : undefined}
                >
                  {LOCALE_SHORT[code]}
                </Link>
              ))}
            </div>

            <Link href={path("/dao-tao/dang-ky-tu-van")} className={styles.cta}>
              {dict.nav.apply}
            </Link>

            <button
              type="button"
              className={styles.burger}
              aria-expanded={open}
              aria-controls={navId}
              aria-label={open ? dict.nav.close : dict.nav.openMenu}
              onClick={() => setOpen((value) => !value)}
            >
              <span className={open ? styles.burgerBarOpen : styles.burgerBar} />
            </button>
          </div>
        </div>
      </header>

      <div
        id={navId}
        ref={panelRef}
        className={`${styles.panel} ${open ? styles.panelOpen : ""}`}
        hidden={!open}
      >
        <nav className={styles.panelNav} aria-label={dict.nav.menu}>
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <div className={styles.panelRow}>
                  <Link href={path(item.href)} className={styles.panelLink}>
                    {item.label}
                  </Link>
                  {item.children ? (
                    <button
                      type="button"
                      className={styles.panelToggle}
                      aria-expanded={expanded === item.href}
                      aria-label={item.label}
                      onClick={() => setExpanded(expanded === item.href ? null : item.href)}
                    >
                      <ChevronIcon />
                    </button>
                  ) : null}
                </div>
                {item.children && expanded === item.href ? (
                  <ul className={styles.panelChildren}>
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link href={path(child.href)}>{child.label}</Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.panelFooter}>
          <Link href={path("/dao-tao/dang-ky-tu-van")} className={styles.panelCta}>
            {dict.nav.apply}
          </Link>
          <div className={styles.panelTools}>
            <ThemeToggle locale={locale} />
            <SocialLinks social={social} locale={locale} variant="boxed" />
          </div>
        </div>
      </div>

      <SearchDialog locale={locale} open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.6-3.6" strokeLinecap="round" />
    </svg>
  );
}
