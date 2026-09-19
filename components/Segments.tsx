"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { SEGMENTS, type Segment } from "@/lib/content";
import { IMAGES } from "@/lib/images";
import Photo from "./Photo";
import Reveal from "./Reveal";

function Row({ seg, i }: { seg: Segment; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const flipped = i % 2 === 1;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);

  return (
    <div
      ref={ref}
      className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
    >
      {/* Plate */}
      <Reveal
        y={36}
        className={`relative card-lift-lg h-[260px] overflow-hidden rounded-3xl sm:h-[360px] lg:h-[440px] ${
          flipped ? "lg:order-2" : ""
        }`}
      >
        <motion.div
          style={reduced ? undefined : { y }}
          className="absolute inset-0 scale-110"
        >
          <Photo
            img={IMAGES[seg.imageKey]}
            sizes="(max-width: 1024px) 100vw, 48vw"
          />
        </motion.div>
        
        <span className="absolute top-5 left-5 rounded-full bg-white/90 px-3.5 py-1.5 font-mono text-[10px] tracking-[0.16em] text-ink uppercase backdrop-blur-md">
          {seg.kicker}
        </span>
      </Reveal>

      {/* Copy */}
      <div className={flipped ? "lg:order-1" : ""}>
        <Reveal delay={0.06}>
          <h3 className="font-display text-[clamp(1.45rem,3vw,2.15rem)] leading-[1.12] font-medium tracking-[-0.02em] text-balance">
            {seg.title}
          </h3>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-5 max-w-lg text-[0.95rem] leading-relaxed text-muted">
            {seg.body}
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <ul className="mt-7 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {seg.bullets.map((b) => (
              <li
                key={b}
                className="flex items-start gap-3 border-t border-line pt-3 text-[0.85rem] text-muted"
              >
                <span className="bg-accent mt-[0.62em] h-px w-3 shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </div>
  );
}

export default function Segments() {
  return (
    <section
      id="segments"
      data-tone="amber"
      className="relative scroll-mt-20 px-4 py-24 sm:px-8 md:py-36"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 max-w-3xl md:mb-24">
          <Reveal>
            <span className="eyebrow">Who we build for</span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-display text-[clamp(1.85rem,4.4vw,3.2rem)] leading-[1.06] font-medium tracking-[-0.025em] text-balance">
              From a single roof to a substation.
            </h2>
          </Reveal>
        </div>

        <div className="flex flex-col gap-20 md:gap-32">
          {SEGMENTS.map((s, i) => (
            <Row key={s.id} seg={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
