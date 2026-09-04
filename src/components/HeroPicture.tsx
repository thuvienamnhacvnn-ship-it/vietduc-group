type Source = { src: string; width: number; height: number };

/**
 * A banner photograph that changes picture, not just crop, on a phone.
 *
 * The wide shot is composed for a landscape frame; on a phone that frame is a
 * narrow band and cropping it either shrinks the subject to nothing or cuts the
 * building in half. So each arm supplies a second, upright photograph, and the
 * browser picks between them by viewport width.
 *
 * This is art direction, which is the one thing next/image cannot express: it
 * varies resolution for a single source, not the source itself. Two <Image>
 * elements hidden by CSS would not do either - the hidden one is still fetched,
 * and on a phone that is the whole point of the exercise wasted. Both files are
 * already sized and encoded as WebP by the media scripts, so the only thing the
 * optimiser would have added here is a round trip.
 */
export function HeroPicture({
  wide,
  tall,
  alt,
  className,
  breakpoint = 719,
  priority = false,
}: {
  wide: Source;
  /** Shown at or below `breakpoint`. Omit to use the wide shot everywhere. */
  tall?: Source;
  alt: string;
  className?: string;
  breakpoint?: number;
  priority?: boolean;
}) {
  return (
    <picture>
      {tall ? (
        <source
          media={`(max-width: ${breakpoint}px)`}
          srcSet={tall.src}
          width={tall.width}
          height={tall.height}
        />
      ) : null}
      <img
        src={wide.src}
        alt={alt}
        width={wide.width}
        height={wide.height}
        className={className}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
        loading={priority ? "eager" : "lazy"}
      />
    </picture>
  );
}
