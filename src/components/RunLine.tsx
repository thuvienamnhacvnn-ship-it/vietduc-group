import styles from "./RunLine.module.css";

/**
 * The line that runs between sections.
 *
 * A hairline carrying a bright travelling segment in the group's two colours -
 * the red of the flag and the gold of the mark - moving left to right. It is
 * the page's recurring joint: every band change is marked with one, so a long
 * landing page reads as one continuous thing rather than as stacked blocks.
 *
 * Decorative, so it is hidden from assistive technology, and the travel stops
 * under prefers-reduced-motion, leaving a static gradient rule.
 */
export function RunLine({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <span
      className={`${styles.line} ${tone === "dark" ? styles.onDark : ""}`}
      aria-hidden="true"
    >
      <span className={styles.spark} />
    </span>
  );
}
