import type { Variants, Transition } from "framer-motion";

/** Shared easing. Expo-out — fast departure, long settle. */
export const EASE = [0.16, 1, 0.3, 1] as const;

export const SPRING: Transition = { type: "spring", stiffness: 120, damping: 20, mass: 0.6 };

/** Standard reveal: rise and fade as the element enters view. */
export const rise: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

/** Same, but travels further — for section headings. */
export const riseLg: Variants = {
  hidden: { opacity: 0, y: 44 },
  show: { opacity: 1, y: 0, transition: { duration: 0.95, ease: EASE } },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease: EASE } },
};

/** Parent that staggers its children. */
export const stagger = (gap = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

/** Word-by-word mask reveal, used on the hero headline. */
export const wordMask: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 1.05, ease: EASE } },
};

/** Draws an SVG path from nothing to full length. */
export const drawPath: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: { pathLength: 1, opacity: 1, transition: { pathLength: { duration: 1.6, ease: EASE }, opacity: { duration: 0.2 } } },
};

/** Shared viewport config — fire once, slightly before fully in view. */
export const VIEWPORT = { once: true, margin: "-12% 0px -12% 0px" } as const;

/**
 * Collapse a variant set to a plain cross-fade.
 * Used when the visitor prefers reduced motion: content still arrives, but
 * nothing translates, scales or draws.
 */
export function stillVariants(v: Variants): Variants {
  const show = (v.show ?? {}) as Record<string, unknown>;
  return {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.3, ease: "linear" } },
    ...(show.transition ? {} : {}),
  };
}
