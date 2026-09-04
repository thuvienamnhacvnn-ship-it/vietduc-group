import styles from "./ClaimLedger.module.css";

export type Claim = {
  claim: string;
  body: string;
  /** What backs the claim up - a count, a document, a partner. */
  evidence: string;
};

/**
 * Claims set against the thing that backs them.
 *
 * Every education site makes the same four promises, so the promise is not the
 * content here - the evidence column is. Each row states a claim on the left
 * and, on the right, the licence, the count or the institution it rests on;
 * anything the group cannot show is not on the list.
 *
 * The rows draw themselves in as they arrive: the rule first, then the claim
 * uncovered left to right, so reading order and animation order agree.
 */
export function ClaimLedger({ claims, evidenceLabel }: { claims: Claim[]; evidenceLabel: string }) {
  return (
    <dl className={styles.ledger}>
      {claims.map((entry, index) => (
        <div
          key={entry.claim}
          className={styles.row}
          data-reveal
          style={{ "--reveal-delay": `${index * 90}ms` } as React.CSSProperties}
        >
          <span className={styles.rule} data-reveal data-reveal-as="draw" aria-hidden="true" />

          <dt>
            <span className={styles.no}>{String(index + 1).padStart(2, "0")}</span>
            <span className={styles.claim}>{entry.claim}</span>
          </dt>

          <dd className={styles.body}>{entry.body}</dd>

          <dd className={styles.evidence}>
            <span className={styles.evidenceLabel}>{evidenceLabel}</span>
            <span className={styles.evidenceValue}>{entry.evidence}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
