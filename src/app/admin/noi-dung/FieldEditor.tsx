import { setLocalisedField } from "../actions";
import styles from "../admin.module.css";

type L10n = { vi?: string; en?: string; de?: string } | null | undefined;

export type EditableRow = {
  field: string;
  label: string;
  value: L10n;
  long?: boolean;
};

/**
 * Edits one localised field at a time.
 *
 * Each field is its own form so a save touches exactly one column: an editor
 * correcting a Vietnamese heading cannot accidentally blank the German one, and
 * two people editing different fields do not overwrite each other.
 */
export function FieldEditor({
  entity,
  id,
  rows,
}: {
  entity: string;
  id: number;
  rows: EditableRow[];
}) {
  if (!rows.length) return null;

  return (
    <div style={{ marginTop: "var(--s-6)", paddingTop: "var(--s-5)", borderTop: "1px solid var(--line)" }}>
      <h3>Sửa nội dung #{id}</h3>
      <p style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
        Bỏ trống ô tiếng Đức hoặc tiếng Anh thì website sẽ hiển thị bản tiếng Việt.
      </p>

      {rows.map((row) => (
        <form
          key={row.field}
          action={setLocalisedField}
          style={{ marginBottom: "var(--s-5)" }}
        >
          <input type="hidden" name="entity" value={entity} />
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="field" value={row.field} />

          <div className={styles.field} style={{ marginBottom: "var(--s-2)" }}>
            <label htmlFor={`${row.field}-vi`}>{row.label} — tiếng Việt</label>
            {row.long ? (
              <textarea
                id={`${row.field}-vi`}
                name="vi"
                rows={6}
                defaultValue={row.value?.vi ?? ""}
                className={styles.textarea}
              />
            ) : (
              <input
                id={`${row.field}-vi`}
                name="vi"
                type="text"
                defaultValue={row.value?.vi ?? ""}
                className={styles.input}
                style={{ width: "100%" }}
              />
            )}
          </div>

          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <label htmlFor={`${row.field}-en`}>English</label>
              {row.long ? (
                <textarea
                  id={`${row.field}-en`}
                  name="en"
                  rows={4}
                  defaultValue={row.value?.en ?? ""}
                  className={styles.textarea}
                />
              ) : (
                <input
                  id={`${row.field}-en`}
                  name="en"
                  type="text"
                  defaultValue={row.value?.en ?? ""}
                  className={styles.input}
                />
              )}
            </div>
            <div className={styles.field}>
              <label htmlFor={`${row.field}-de`}>Deutsch</label>
              {row.long ? (
                <textarea
                  id={`${row.field}-de`}
                  name="de"
                  rows={4}
                  defaultValue={row.value?.de ?? ""}
                  className={styles.textarea}
                />
              ) : (
                <input
                  id={`${row.field}-de`}
                  name="de"
                  type="text"
                  defaultValue={row.value?.de ?? ""}
                  className={styles.input}
                />
              )}
            </div>
          </div>

          <button type="submit" className={styles.button} style={{ marginTop: "var(--s-3)" }}>
            Lưu “{row.label}”
          </button>
        </form>
      ))}
    </div>
  );
}
