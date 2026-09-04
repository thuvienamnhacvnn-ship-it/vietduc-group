import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import type { SocialSettings } from "@/lib/site-config";
import { SocialLinks, hasSocial } from "./SocialLinks";
import styles from "./HeroSocial.module.css";

/**
 * The group's channels, sitting under the buttons in a banner.
 *
 * This is the phone's version of the rail that runs down the right edge of a
 * desktop window: there is no right edge to spare on a 390px screen, and the
 * bottom of it belongs to the navigation bar. Below the buttons is the one
 * place left where the marks are reachable without covering the picture.
 *
 * As everywhere else, a channel with no configured address is not drawn, and
 * with none configured at all this renders nothing rather than a row of marks
 * that lead nowhere.
 */
export function HeroSocial({
  locale,
  social,
  tone = "light",
}: {
  locale: Locale;
  social: SocialSettings;
  /** "light" for marks on a photograph, "dark" for marks on paper. */
  tone?: "light" | "dark";
}) {
  if (!hasSocial(social)) return null;
  const dict = getDictionary(locale);

  return (
    <div className={`${styles.row} ${tone === "light" ? styles.onPhoto : ""}`}>
      <span className={styles.label}>{dict.contact.followUs}</span>
      <SocialLinks social={social} locale={locale} variant="boxed" />
    </div>
  );
}
