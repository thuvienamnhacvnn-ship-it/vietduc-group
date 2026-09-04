import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { socialHref, telHref, type ContactSettings, type SocialSettings } from "@/lib/site-config";
import styles from "./MobileQuickActions.module.css";

/**
 * The phone-sized action bar: call, message, request advice.
 *
 * Only rendered for channels that are actually configured, and it sits above
 * the safe-area inset so it does not collide with the home indicator. The
 * advisor button is positioned clear of this bar - see Advisor.module.css.
 */
export function MobileQuickActions({
  locale,
  contact,
  social,
}: {
  locale: Locale;
  contact: ContactSettings;
  social: SocialSettings;
}) {
  const dict = getDictionary(locale);
  const tel = telHref(contact.phoneE164 || contact.phone);
  const whatsapp = socialHref("whatsapp", social.whatsapp ?? "");
  const zalo = socialHref("zalo", social.zalo ?? "");

  const actions = [
    tel
      ? {
          key: "call",
          href: tel,
          label: dict.contact.callNow,
          external: false,
          icon: (
            <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M4.5 4h3.2l1.6 4-2 1.4a12.5 12.5 0 0 0 5.3 5.3l1.4-2 4 1.6v3.2a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3 5.6 1.5 1.5 0 0 1 4.5 4Z" strokeLinejoin="round" />
            </svg>
          ),
        }
      : null,
    whatsapp
      ? {
          key: "whatsapp",
          href: whatsapp,
          label: dict.contact.chatWhatsapp,
          external: true,
          icon: (
            <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true">
              <path d="M12.05 2A9.95 9.95 0 0 0 3.5 17.06L2 22l5.1-1.34A9.95 9.95 0 1 0 12.05 2Zm0 18.13a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.27 8.27 0 1 1 6.99 3.86Zm4.52-5.75c-.25-.13-1.47-.72-1.7-.8-.22-.09-.39-.13-.55.12-.17.25-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.12.25-.3.37-.44.13-.15.17-.25.25-.42.09-.17.05-.31-.02-.44-.06-.12-.55-1.34-.76-1.83-.2-.48-.4-.41-.55-.42h-.47c-.17 0-.44.06-.66.31-.23.25-.87.85-.87 2.06s.89 2.39 1.01 2.56c.13.16 1.75 2.67 4.24 3.74.59.26 1.05.4 1.41.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z" />
            </svg>
          ),
        }
      : null,
    zalo && !whatsapp
      ? {
          key: "zalo",
          href: zalo,
          label: dict.contact.chatZalo,
          external: true,
          icon: <span className={styles.zaloMark}>Zalo</span>,
        }
      : null,
    {
      key: "apply",
      href: localePath(locale, "/dao-tao/dang-ky-tu-van"),
      label: dict.nav.apply,
      external: false,
      icon: (
        <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M4 6h16M4 12h10M4 18h7" strokeLinecap="round" />
        </svg>
      ),
    },
  ].filter(Boolean) as {
    key: string;
    href: string;
    label: string;
    external: boolean;
    icon: React.ReactNode;
  }[];

  if (actions.length < 2) return null;

  return (
    <nav className={`${styles.bar} no-print`} aria-label={dict.nav.contact}>
      {actions.map((action) =>
        action.external ? (
          <a
            key={action.key}
            href={action.href}
            target="_blank"
            rel="noopener noreferrer"
            className={action.key === "apply" ? styles.primary : styles.action}
          >
            {action.icon}
            <span>{action.label}</span>
          </a>
        ) : (
          <Link
            key={action.key}
            href={action.href}
            className={action.key === "apply" ? styles.primary : styles.action}
          >
            {action.icon}
            <span>{action.label}</span>
          </Link>
        ),
      )}
    </nav>
  );
}
