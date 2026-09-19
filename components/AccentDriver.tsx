"use client";

import { useEffect } from "react";

/**
 * Drives the page-wide `--accent` colour.
 *
 * Any section carrying `data-tone="amber" | "cyan" | "mixed"` claims the
 * accent while it owns the middle of the viewport. The actual colour change
 * is a CSS transition on a registered `@property` (see globals.css), so the
 * interpolation is done by the browser rather than a JS animation loop —
 * the whole page warms toward solar and cools toward storage as one gesture.
 */
export default function AccentDriver() {
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-tone]")
    );
    if (sections.length === 0) return;

    const root = document.documentElement;

    // Pick whichever tonal section covers the viewport midpoint. Falling back
    // to "nearest above" keeps a sensible tone in the gaps between sections.
    const pick = () => {
      const mid = window.innerHeight / 2;
      let chosen: string | null = null;
      let bestAbove = -Infinity;

      for (const el of sections) {
        const { top, bottom } = el.getBoundingClientRect();
        if (top <= mid && bottom >= mid) {
          chosen = el.dataset.tone ?? null;
          break;
        }
        if (bottom < mid && bottom > bestAbove) {
          bestAbove = bottom;
          chosen = el.dataset.tone ?? null;
        }
      }

      if (chosen && root.dataset.tone !== chosen) root.dataset.tone = chosen;
    };

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        pick();
      });
    };

    pick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      delete root.dataset.tone;
    };
  }, []);

  return null;
}
