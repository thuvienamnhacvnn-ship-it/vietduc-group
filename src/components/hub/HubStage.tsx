"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./HubStage.module.css";

/**
 * The two fields as marks rather than photographs: at the size a satellite is
 * drawn, a photo turns to mush while a single-path symbol stays readable. Both
 * inherit currentColor so the sphere decides their colour.
 */
const ICONS = {
  education: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      <path
        d="M12 4 2.5 8.5 12 13l9.5-4.5L12 4Z"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 10.8v4.4c0 1.5 2.5 2.8 5.5 2.8s5.5-1.3 5.5-2.8v-4.4"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M21 8.8v5.4" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  venture: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M3 18.5V7.2" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M21 18.5v-6.7H8.4v-2.6H3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 15.1h18" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="6.2" cy="9.6" r="1.6" strokeWidth="1.6" />
    </svg>
  ),
} as const;

export type HubIcon = keyof typeof ICONS;

export type HubBranch = {
  key: "education" | "venture";
  href: string;
  name: string;
  tagline: string;
  desc: string;
  /** Which mark the satellite carries. */
  icon: HubIcon;
};

type Props = {
  branches: [HubBranch, HubBranch];
  enterLabel: string;
  orbitLabel: string;
  /** The group's channels, shown under the two buttons on a phone. */
  channels?: React.ReactNode;
  /**
   * The wording of the page. It lives inside the stage so the same markup can
   * be ordered two ways: above the orbit on a desktop, below it on a phone,
   * where the mark should be the first thing on the screen.
   */
  heading: React.ReactNode;
};

/**
 * The group mark at the centre with the two business fields circling it.
 *
 * Three things are deliberate:
 *
 *  - The orbit is decoration. Each satellite is a plain link and the two cards
 *    underneath lead to the same two places, so nothing depends on catching a
 *    moving target.
 *  - Motion stops on hover and on focus, so a satellite can be read and clicked
 *    without chasing it, and it never moves at all when the reader has asked
 *    the system for reduced motion.
 *  - The pointer lean is written to custom properties rather than to the
 *    element's own transform, because the orbit animation owns `transform`.
 */
export function HubStage({ branches, enterLabel, orbitLabel, heading, channels }: Props) {
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const node = stageRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.setProperty("--lean-x", `${(x * 14).toFixed(2)}deg`);
    node.style.setProperty("--lean-y", `${(-y * 11).toFixed(2)}deg`);
  }, []);

  const onPointerLeave = useCallback(() => {
    const node = stageRef.current;
    if (!node) return;
    node.style.setProperty("--lean-x", "0deg");
    node.style.setProperty("--lean-y", "0deg");
  }, []);

  const still = reduced || paused;

  return (
    <div
      ref={stageRef}
      className={styles.stage}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div className={`${styles.orbit} ${still ? styles.orbitStill : ""}`} aria-label={orbitLabel}>
        <span className={styles.ring} aria-hidden="true" />
        <span className={`${styles.ring} ${styles.ringOuter}`} aria-hidden="true" />

        <div className={styles.core}>
          <span className={styles.glow} aria-hidden="true" />
          <Image
            src="/brand/viet-duc-mark.png"
            alt=""
            width={380}
            height={409}
            priority
            className={styles.mark}
          />
          <span className={styles.plinth} aria-hidden="true" />
        </div>

        {branches.map((branch, i) => (
          <div
            key={branch.key}
            className={`${styles.arm} ${i === 1 ? styles.armSecond : ""}`}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <Link href={branch.href} className={styles.satellite}>
              <span className={`${styles.planet} ${styles[branch.icon]}`}>
                <span className={styles.planetIcon}>{ICONS[branch.icon]}</span>
                <span className={styles.planetRim} aria-hidden="true" />
              </span>
              {/* Faded, not removed: the link keeps its name for a screen
                  reader whether or not a pointer is over it. */}
              <span className={styles.planetLabel}>{branch.name}</span>
            </Link>
          </div>
        ))}
      </div>

      <div className={styles.heading}>{heading}</div>

      <div className={styles.choices}>
        {branches.map((branch) => (
          <Link
            key={branch.key}
            href={branch.href}
            className={`${styles.choice} ${
              branch.icon === "education" ? styles.choiceEducation : styles.choiceVenture
            }`}
            title={branch.desc}
          >
            <span className={styles.choiceName}>{branch.name}</span>
            <span className={styles.choiceGo} aria-hidden="true">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor">
                <path d="M5 12h13M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="visually-hidden">{enterLabel}</span>
          </Link>
        ))}
      </div>

      {channels ? <div className={styles.channels}>{channels}</div> : null}
    </div>
  );
}
