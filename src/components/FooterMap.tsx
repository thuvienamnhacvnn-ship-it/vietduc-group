import styles from "./FooterMap.module.css";

/**
 * The head office on a map, with a route out to a directions app.
 *
 * OpenStreetMap rather than a commercial embed: it sets no cookies and runs no
 * profiling, so the map can be on the page before anyone has answered the
 * cookie notice - which is what the site's own cookie policy promises.
 *
 * The pin is placed from the address, so the "Chỉ đường" button searches for
 * the written address rather than for the pin's coordinates: whichever service
 * the visitor uses resolves the real building, even if the pin is a few metres
 * out.
 */
export function FooterMap({
  address,
  bbox,
  marker,
  title,
  directionsLabel,
}: {
  address: string;
  /** left,bottom,right,top - the window OpenStreetMap should draw. */
  bbox: string;
  /** "lat,lon" for the pin. */
  marker: string;
  title: string;
  directionsLabel: string;
}) {
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

  return (
    <div className={styles.map}>
      <iframe
        src={src}
        title={title}
        loading="lazy"
        referrerPolicy="no-referrer"
        className={styles.frame}
      />
      <a
        href={directions}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.directions}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M12 21s7-6.4 7-11.4A7 7 0 0 0 5 9.6C5 14.6 12 21 12 21Z" strokeLinejoin="round" />
          <circle cx="12" cy="9.5" r="2.4" />
        </svg>
        {directionsLabel}
      </a>
    </div>
  );
}
