import styles from "./PageSkeleton.module.css";

/**
 * What the reader sees while the next page is being fetched.
 *
 * Without one of these the router has nothing to show between the tap and the
 * finished page, so the browser simply keeps the old page on screen - for over
 * a second on the heavier landing pages, which reads as the site having
 * ignored the tap. A skeleton makes the wait legible: something happened, and
 * this is the shape of what is coming.
 *
 * It also earns its keep before the tap. Next prefetches the loading boundary
 * of a link that comes into view, so by the time a reader reaches the buttons
 * on the gateway this much is already in the browser and appears instantly.
 *
 * Deliberately coarse: it stands for a banner and a few blocks of text on any
 * of the pages, and a skeleton that tries to mimic one page exactly is wrong on
 * every other one.
 */
export function PageSkeleton() {
  return (
    <div className={styles.wrap} aria-busy="true" aria-live="polite">
      <span className={styles.srOnly}>Đang tải…</span>
      <div className={styles.banner} />
      <div className={styles.body}>
        <div className={`${styles.line} ${styles.title}`} />
        <div className={`${styles.line} ${styles.wide}`} />
        <div className={`${styles.line} ${styles.mid}`} />
        <div className={styles.cards}>
          <div className={styles.card} />
          <div className={styles.card} />
          <div className={styles.card} />
        </div>
      </div>
    </div>
  );
}
