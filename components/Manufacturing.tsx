"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { MANUFACTURING } from "@/lib/content";
import { IMAGES } from "@/lib/images";
import Photo from "./Photo";
import Reveal from "./Reveal";

export default function Manufacturing() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const plateY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section
      ref={ref}
      id="manufacturing"
      data-tone="mixed"
      className="relative scroll-mt-20 px-4 py-24 sm:px-8 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Plate in a rounded frame — the photo stays bright rather than
              being darkened to carry white text. */}
          <Reveal y={36} className="order-2 lg:order-1">
            <div className="card-lift-lg relative h-[300px] overflow-hidden rounded-3xl sm:h-[420px] lg:h-[520px]">
              <motion.div
                style={reduced ? undefined : { y: plateY }}
                className="absolute inset-0 scale-110"
              >
                <Photo
                  img={IMAGES.factoryMachine}
                  sizes="(max-width: 1024px) 100vw, 48vw"
                />
              </motion.div>
            </div>
          </Reveal>

          <div className="order-1 lg:order-2">
            <Reveal>
              <span className="eyebrow">{MANUFACTURING.eyebrow}</span>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-5 font-display text-[clamp(1.9rem,4.4vw,3.1rem)] leading-[1.06] font-medium tracking-[-0.03em] text-balance">
                {MANUFACTURING.headline}
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-lg text-[1rem] leading-relaxed text-muted">
                {MANUFACTURING.sub}
              </p>
            </Reveal>

            <div className="mt-10 flex flex-col gap-px overflow-hidden rounded-2xl border border-line bg-line">
              {MANUFACTURING.points.map((p, i) => (
                <Reveal
                  key={p.title}
                  delay={i * 0.09}
                  className="group bg-surface p-6 transition-colors duration-500 hover:bg-surface-2"
                >
                  <div className="flex items-start gap-4">
                    <span className="bg-accent mt-[0.7em] h-px w-6 shrink-0 transition-all duration-500 group-hover:w-10" />
                    <div>
                      <h3 className="font-display text-[1.05rem] font-medium text-ink">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-[0.885rem] leading-relaxed text-muted">
                        {p.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
