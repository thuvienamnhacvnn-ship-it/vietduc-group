import styles from "./HubDecor.module.css";

/**
 * The band that closes the gateway banner.
 *
 * Three soft crests drifting at different speeds, drawn with cubic curves
 * rather than straight segments - a polyline reads as a sawtooth at this size,
 * which is exactly what a decorative band should not do. Each layer is blurred
 * and faint, so the band settles under the content instead of competing with
 * it, and the colours are the brand's own red and gold at low opacity.
 *
 * Everything is inline SVG and CSS: nothing to download, no library, and it
 * scales to any width without a second asset. Purely decorative, so it is
 * hidden from assistive technology, and every animation stops under
 * prefers-reduced-motion.
 */

/** One crest, repeated twice side by side so the drift loops without a seam. */
function Wave({ d, fill, className }: { d: string; fill: string; className: string }) {
  return (
    <g className={className}>
      <path d={d} fill={fill} />
      <path transform="translate(1440 0)" d={d} fill={fill} />
    </g>
  );
}

// Long, shallow curves: control points sit far apart so no crest turns into a
// point. Each path closes along the bottom edge so the fill has a flat base.
const FAR =
  "M0 240 C 180 168, 360 168, 540 206 C 720 244, 900 250, 1080 214 C 1200 190, 1320 182, 1440 198 L1440 240 Z";
const MID =
  "M0 240 C 200 206, 380 190, 560 214 C 760 240, 940 262, 1140 236 C 1260 220, 1350 212, 1440 220 L1440 240 Z";
const NEAR =
  "M0 240 C 240 224, 420 246, 620 250 C 820 254, 980 232, 1180 240 C 1300 245, 1370 250, 1440 246 L1440 240 Z";

export function HubDecor() {
  return (
    <div className={styles.decor} aria-hidden="true">
      <svg
        className={styles.sky}
        viewBox="0 0 1440 240"
        preserveAspectRatio="none"
        focusable="false"
      >
        <defs>
          <linearGradient id="vdg-wave-far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8e1f2d" stopOpacity="0.26" />
            <stop offset="100%" stopColor="#4a0e18" stopOpacity="0.06" />
          </linearGradient>
          <linearGradient id="vdg-wave-mid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c49145" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#7d5a1e" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="vdg-wave-near" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d2a259" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#2a1c0c" stopOpacity="0.04" />
          </linearGradient>
        </defs>

        <Wave d={FAR} fill="url(#vdg-wave-far)" className={`${styles.layer} ${styles.layerFar}`} />
        <Wave d={MID} fill="url(#vdg-wave-mid)" className={`${styles.layer} ${styles.layerMid}`} />
        <Wave d={NEAR} fill="url(#vdg-wave-near)" className={`${styles.layer} ${styles.layerNear}`} />
      </svg>

      {/* Embers rising from the band, echoing the flame in the mark. */}
      <div className={styles.embers}>
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} className={styles.ember} data-i={i} />
        ))}
      </div>

      <span className={styles.hairline} />
    </div>
  );
}
