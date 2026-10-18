"use client";

import { useEffect, useId, useRef, useState } from "react";
import { getWebsiteNetworkLabels } from "@/lib/website-network";
import { WebsiteNetworkList } from "./WebsiteNetwork";
import styles from "./WebsiteNetwork.module.css";

export function WebsiteNetworkMenu({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  const labels = getWebsiteNetworkLabels(locale);

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  return <div ref={root} className={styles.menu} data-website-network="menu"
    onKeyDown={(event) => {
      if (event.key === "Escape" && open) {
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
        trigger.current?.focus();
      }
    }}
    onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
    }}>
    <button ref={trigger} className={styles.trigger} type="button" aria-label={labels.title} title={labels.title} aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="3" y="3" width="6" height="6" rx="1.3" />
        <rect x="15" y="3" width="6" height="6" rx="1.3" />
        <rect x="3" y="15" width="6" height="6" rx="1.3" />
        <rect x="15" y="15" width="6" height="6" rx="1.3" />
      </svg>
    </button>
    <div id={id} className={`${styles.panel} ${open ? styles.panelOpen : ""}`} inert={!open} aria-hidden={!open}>
      <WebsiteNetworkList locale={locale} />
    </div>
  </div>;
}
