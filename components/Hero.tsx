"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Photo from "./Photo";
import { IMAGES } from "@/lib/images";
import { COMPANY, HERO, STATS } from "@/lib/content";
import { EASE } from "@/lib/motion";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // The plate drifts slowly behind its rounded frame as the page moves.
  const plateY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const plateScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const words = HERO.headline.split(" ");

  return (
    <section
      ref={ref}
      data-tone="amber"
      className="relative overflow-hidden px-4 pt-28 pb-16 sm:px-8 md:pt-36 md:pb-24"
    >
      {/* Soft sky wash behind the type, in the spirit of the references. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[70%]"
        style={{
          background:
            "radial-gradient(60rem 34rem at 78% 0%, rgb(232 137 11 / 0.10), transparent 62%), radial-gradient(52rem 32rem at 12% 8%, rgb(15 163 196 / 0.10), transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-7xl">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="bg-accent-soft inline-flex items-center gap-2.5 rounded-full py-1.5 pr-4 pl-3"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="bg-accent absolute inline-flex h-full w-full animate-ping rounded-full opacity-70" />
            <span className="bg-accent relative inline-flex h-1.5 w-1.5 rounded-full" />
          </span>
          <span className="font-mono text-[10.5px] tracking-[0.18em] text-[var(--accent-ink)] uppercase">
            {HERO.badge} · {COMPANY.launch}
          </span>
        </motion.div>

        {/* Headline — each word rides up out of its own mask. */}
        <h1 className="mt-7 max-w-5xl font-display text-[clamp(2.5rem,8vw,6rem)] leading-[0.97] font-medium tracking-[-0.04em] text-balance">
          {words.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.08em]">
              <motion.span
                className="inline-block"
                initial={reduced ? { opacity: 0 } : { y: "110%" }}
                animate={reduced ? { opacity: 1 } : { y: "0%" }}
                transition={{
                  duration: reduced ? 0.4 : 1.05,
                  delay: 0.12 + i * 0.07,
                  ease: EASE,
                }}
              >
                {w}
                {i < words.length - 1 ? " " : ""}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
            className="max-w-xl text-[1.02rem] leading-relaxed text-muted sm:text-[1.1rem]"
          >
            {HERO.sub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.62, ease: EASE }}
            className="flex shrink-0 flex-wrap items-center gap-3"
          >
            <a
              href="#calculator"
              className="group bg-accent inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 font-display text-[0.92rem] font-medium text-white transition-transform duration-300 hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {HERO.cta}
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
            <a
              href="#capabilities"
              className="inline-flex items-center gap-2 rounded-full border border-line-2 px-6 py-3.5 font-display text-[0.92rem] text-ink transition-colors duration-300 hover:border-[var(--accent)] hover:text-[var(--accent-ink)]"
            >
              {HERO.scrollCue}
            </a>
          </motion.div>
        </div>

        {/* 4K plate in a rounded frame, with a floating figure card over it. */}
        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: EASE }}
          className="relative mt-14 md:mt-20"
        >
          <div className="card-lift-lg relative h-[300px] overflow-hidden rounded-3xl sm:h-[440px] lg:h-[560px]">
            <motion.div
              style={reduced ? undefined : { y: plateY, scale: plateScale }}
              className="absolute inset-0"
            >
              <Photo img={IMAGES.hero} priority sizes="100vw" className="scale-105" />
            </motion.div>

            {/* Floating figure card, like the reference sites. */}
            <div className="absolute right-4 bottom-4 left-4 sm:right-auto sm:bottom-7 sm:left-7 sm:max-w-xs">
              <div className="rounded-2xl border border-white/50 bg-white/85 p-5 backdrop-blur-xl">
                <div className="flex items-baseline gap-2">
                  <span
                    data-placeholder="true"
                    title="Placeholder — pending confirmed figure"
                    className="font-display text-[1.6rem] leading-none font-medium tracking-[-0.02em] text-ink"
                  >
                    {STATS[0].value}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.14em] text-muted-2 uppercase">
                    {STATS[0].label}
                  </span>
                </div>
                <p className="mt-2.5 text-[0.82rem] leading-relaxed text-muted">
                  Storage-first, so clean power lands when the grid actually
                  needs it — not only when the sun is out.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
