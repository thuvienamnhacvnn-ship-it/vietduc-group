import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import type { SocialSettings } from "@/lib/site-config";
import { SocialLinks, hasSocial } from "./SocialLinks";
import styles from "./SocialRail.module.css";

/**
 * The group's channels, pinned to the right edge of a landing page.
 *
 * Only channels with a configured address are drawn - a social icon that goes
 * nowhere is worse than no icon - so with nothing configured this renders
 * nothing at all rather than a row of dead marks.
 *
 * It is hidden below the desktop breakpoint: on a phone the same links sit
 * under the two buttons on the gateway, where they do not fight the navigation
 * bar at the foot of the screen.
 */
export function SocialRail({ locale, social }: { locale: Locale; social: SocialSettings }) {
  if (!hasSocial(social)) return null;
  const dict = getDictionary(locale);

  return (
    <aside className={styles.rail} aria-label={dict.contact.followUs}>
      <span className={styles.label}>{dict.contact.followUs}</span>
      <span className={styles.line} aria-hidden="true" />
      <SocialLinks social={social} locale={locale} variant="boxed" />
    </aside>
  );
}
