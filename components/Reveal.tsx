"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { EASE, VIEWPORT } from "@/lib/motion";

type Props = {
  children: ReactNode;
  /** Travel distance in px. Ignored under reduced motion. */
  y?: number;
  delay?: number;
  duration?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span" | "p" | "h2";
};

/**
 * Scroll reveal that degrades honestly.
 *
 * Under `prefers-reduced-motion` the translation is dropped and it becomes a
 * short cross-fade — the content still announces itself, but nothing moves.
 */
export default function Reveal({
  children,
  y = 28,
  delay = 0,
  duration = 0.8,
  className,
  as = "div",
}: Props) {
  const reduced = useReducedMotion();

  const variants: Variants = reduced
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.3, delay, ease: "linear" } },
      }
    : {
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration, delay, ease: EASE } },
      };

  const M = motion[as];

  return (
    <M
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={variants}
      className={className}
    >
      {children}
    </M>
  );
}
