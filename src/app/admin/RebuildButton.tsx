"use client";

import { useState, useTransition } from "react";
import { rebuildKb } from "./actions";
import styles from "./admin.module.css";

/**
 * Rebuilds the advisor's knowledge base from approved content. Kept as a
 * client component only so the editor gets progress and a confirmation - the
 * work itself, and the permission check, happen in the server action.
 */
export function RebuildButton() {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  return (
    <div>
      <button
        type="button"
        className={styles.button}
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            setDone(false);
            await rebuildKb();
            setDone(true);
          })
        }
      >
        {pending ? "Đang cập nhật…" : "Cập nhật Knowledge Base"}
      </button>
      {done ? (
        <p style={{ margin: "var(--s-2) 0 0", fontSize: "0.82rem", color: "var(--ok)" }} role="status">
          Đã cập nhật xong.
        </p>
      ) : null}
    </div>
  );
}
