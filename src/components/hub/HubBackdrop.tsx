"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./HubBackdrop.module.css";

export type HubShot = { src: string };

/** How long each image holds before the next one fades in. */
const HOLD_MS = 7000;

/** The crossfade, which overlaps the end of the hold. */
const FADE_MS = 1600;

/**
 * The slideshow behind the whole gateway.
 *
 * It sits at the page level rather than inside the stage so the photography
 * runs edge to edge under the bar, the mark and the footer alike. It advances
 * only while the tab is visible - a gateway left open in a background tab
 * should not keep decoding images - and holds on the first frame for readers
 * who have asked for reduced motion.
 */
export function HubBackdrop({ shots, label }: { shots: HubShot[]; label: string }) {
  const [index, setIndex] = useState(0);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setStill(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (still || shots.length < 2) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % shots.length);
    }, HOLD_MS);
    return () => window.clearInterval(timer);
  }, [still, shots.length]);

  return (
    <div className={styles.backdrop} role="img" aria-label={label}>
      {shots.map((shot, i) => (
        <Image
          key={shot.src}
          src={shot.src}
          alt=""
          fill
          priority={i === 0}
          sizes="100vw"
          className={`${styles.shot} ${i === index ? styles.shotOn : ""}`}
          /* The push has to last exactly as long as the frame is up, hold plus
             the crossfade it hands over on, or it would finish early and the
             picture would sit still before the change. */
          style={{ "--hold": `${HOLD_MS + FADE_MS}ms` } as React.CSSProperties}
        />
      ))}
      <span className={styles.edges} aria-hidden="true" />
    </div>
  );
}
