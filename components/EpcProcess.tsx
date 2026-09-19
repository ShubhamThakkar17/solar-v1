"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { EPC } from "@/lib/content";
import { IMAGES } from "@/lib/images";
import { EASE, VIEWPORT } from "@/lib/motion";
import Photo from "./Photo";
import Reveal from "./Reveal";

export default function EpcProcess() {
  const ref = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // The rail fills as the stage list passes through the viewport.
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 78%", "end 62%"],
  });

  const { scrollYProgress: sectionProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(sectionProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section
      ref={ref}
      id="epc"
      data-tone="amber"
      className="relative scroll-mt-20 px-4 py-24 sm:px-8 md:py-36"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-3xl md:mb-20">
          <Reveal>
            <span className="eyebrow">{EPC.eyebrow}</span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-display text-[clamp(1.85rem,4.4vw,3.2rem)] leading-[1.06] font-medium tracking-[-0.025em] text-balance">
              {EPC.headline}
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-xl text-[0.98rem] leading-relaxed text-muted">
              {EPC.sub}
            </p>
          </Reveal>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          {/* Parallax plate */}
          <Reveal y={40}>
            <div className="relative card-lift-lg h-[280px] overflow-hidden rounded-3xl sm:h-[420px] lg:sticky lg:top-28 lg:h-[560px]">
              <motion.div
                style={reduced ? undefined : { y: imgY }}
                className="absolute inset-0 scale-110"
              >
                <Photo
                  img={IMAGES.substation}
                  sizes="(max-width: 1024px) 100vw, 48vw"
                />
              </motion.div>
              {/* Caption sits on its own light chip, so the photograph does
                  not have to be darkened to carry it. */}
              <div className="absolute inset-x-0 bottom-0 p-5">
                <span className="inline-block rounded-full bg-white/90 px-4 py-2 font-mono text-[10px] tracking-[0.16em] text-ink uppercase backdrop-blur-md">
                  Grid interconnection &amp; evacuation
                </span>
              </div>
            </div>
          </Reveal>

          {/* Stage list with a rail that fills on scroll */}
          <div ref={railRef} className="relative pl-12 sm:pl-16">
            {/* Track */}
            <div className="absolute top-2 bottom-2 left-[19px] w-px bg-line sm:left-[23px]" />
            {/* Fill */}
            <motion.div
              style={{ scaleY: reduced ? 1 : scrollYProgress }}
              className="bg-accent absolute top-2 bottom-2 left-[19px] w-px origin-top sm:left-[23px]"
            />

            <ol className="flex flex-col gap-10 sm:gap-12">
              {EPC.stages.map((s, i) => (
                <motion.li
                  key={s.n}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
                  className="group relative"
                >
                  {/* Node */}
                  <span className="absolute top-1 -left-12 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface font-mono text-[10px] tracking-[0.1em] text-muted transition-colors duration-500 group-hover:border-[var(--accent)] group-hover:text-[var(--accent)] sm:-left-16">
                    {s.n}
                  </span>
                  <h3 className="font-display text-[1.2rem] font-medium text-ink sm:text-[1.35rem]">
                    {s.title}
                  </h3>
                  <p className="mt-2.5 max-w-md text-[0.9rem] leading-relaxed text-muted">
                    {s.body}
                  </p>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
