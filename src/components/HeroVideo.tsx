/**
 * A banner that moves, on a phone only.
 *
 * The film is layered over the still, which stays underneath as the poster: on
 * a slow connection, or where autoplay is refused, the reader sees the same
 * frame the film opens on rather than a black rectangle. Above the phone
 * breakpoint the element is not rendered at all, so nothing is fetched - the
 * wide screens keep the still photograph, which is composed for that shape.
 *
 * It is muted, looped and inline: a banner that made noise, or that took over
 * the screen on iOS, would be a trap rather than a decoration. There are no
 * controls for the same reason - there is nothing here to pause or seek, and
 * the still says everything the film does.
 */
export function HeroVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  return (
    <video
      className={className}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      // Nothing is fetched until the element is on screen and allowed to play,
      // which on a desktop is never: the media query keeps it out of the layout.
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
