import styles from "./RiseText.module.css";

/**
 * A line of type that sets itself.
 *
 * Each word starts below a mask and rises into place, one after the next, the
 * way a line of metal type is laid into a stick. It is the education arm's own
 * entrance - the investment banner throws its two halves in from the sides of
 * the screen, and the two arms should not move the same way.
 *
 * The words are split for animation only: the element keeps the whole sentence
 * as its accessible name, so a screen reader hears one line rather than a list
 * of words, and a browser's find-in-page still matches across them.
 */
export function RiseText({
  text,
  as: Tag = "span",
  className,
  delay = 0,
}: {
  text: string;
  as?: "span" | "em" | "strong" | "p";
  className?: string;
  /** Milliseconds before the first word moves. */
  delay?: number;
}) {
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <Tag className={[styles.line, className].filter(Boolean).join(" ")} aria-label={text}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className={styles.mask} aria-hidden="true">
          <span
            className={styles.word}
            style={{ "--rise-delay": `${delay + i * 90}ms` } as React.CSSProperties}
          >
            {word}
          </span>
        </span>
      ))}
    </Tag>
  );
}
