"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * One IntersectionObserver for the whole document.
 *
 * Server components mark anything they want revealed with `data-reveal`; they
 * do not need to become client components to do it. Elements are unobserved
 * once shown, so this costs nothing after the first scroll through a section.
 */
export function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    if (reduced.matches) {
      for (const element of elements) element.dataset.reveal = "in";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // A fast scroll - a wheel flick, an anchor jump, restoring a scroll
          // position - can carry an element from below the fold to above it
          // between two observer callbacks. Revealing anything that is now
          // past the top as well means those elements can never be stranded
          // invisible.
          const passed = entry.boundingClientRect.bottom <= 0;
          if (!entry.isIntersecting && !passed) continue;
          (entry.target as HTMLElement).dataset.reveal = "in";
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    for (const element of elements) {
      // Anything already on screen at mount should not fade in late.
      const box = element.getBoundingClientRect();
      if (box.top < window.innerHeight * 0.9) {
        element.dataset.reveal = "in";
      } else {
        observer.observe(element);
      }
    }

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
