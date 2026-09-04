import type { ReactNode } from "react";
import styles from "./PageBand.module.css";

/**
 * The head of a page, set on the group's own red.
 *
 * Several pages in the portal open on a title and a line of explanation over
 * paper, which on a site whose whole identity is one strong colour reads as an
 * unfinished draft. This puts that opening on the red instead, full width, with
 * the gold rule closing it - the same pair of colours the banner uses.
 *
 * It is a component rather than a class copied into each page's stylesheet
 * because the pages that want it do not share a stylesheet: page-shell.module.css
 * is common to every portal page, and a red band added there would appear on
 * all of them, including the ones that must stay quiet.
 */
export function PageBand({ children }: { children: ReactNode }) {
  return (
    <div className={styles.band}>
      <div className={`shell ${styles.inner}`}>{children}</div>
    </div>
  );
}

/** Zeroes a page's own top padding so the band meets the header. */
export const bandFlush = styles.flush;
