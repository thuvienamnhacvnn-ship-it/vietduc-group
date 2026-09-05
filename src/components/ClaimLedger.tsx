import Image from "next/image";
import styles from "./ClaimLedger.module.css";

export type Claim = {
  claim: string;
  body: string;
  /** What backs the claim up - a count, a document, an institution. */
  evidence: string;
  /** A photograph of the thing being claimed, with what it actually shows. */
  image: { src: string; alt: string };
};

/**
 * Claims set against the thing that backs them, and a picture of it.
 *
 * Every education site makes the same four promises, so the promise is not the
 * content here - the evidence column is, and the photograph beside it is the
 * same argument in another form. Rows alternate side so the section reads as a
 * sequence rather than a stack.
 *
 * Nothing the group cannot show is on the list.
 */
export function ClaimLedger({ claims, evidenceLabel }: { claims: Claim[]; evidenceLabel: string }) {
  return (
    <div className={styles.ledger}>
      {claims.map((entry, index) => (
        <article
          key={entry.claim}
          className={styles.row}
          data-reveal
          style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}
        >
          <div className={styles.figure}>
            <Image
              src={entry.image.src}
              alt={entry.image.alt}
              width={1400}
              height={933}
              sizes="(min-width: 1000px) 46vw, 100vw"
            />
          </div>

          <div className={styles.text}>
            <h3 className={styles.claim}>{entry.claim}</h3>
            <p className={styles.body}>{entry.body}</p>

            <div className={styles.evidence}>
              <span className={styles.evidenceLabel}>{evidenceLabel}</span>
              <span className={styles.evidenceValue}>{entry.evidence}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
