"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CAPABILITIES, type Capability } from "@/lib/content";
import { EASE, VIEWPORT } from "@/lib/motion";
import Reveal from "./Reveal";

const TONE_COLOR: Record<Capability["tone"], string> = {
  cyan: "#0FA3C4",
  amber: "#E8890B",
  mixed: "#9BBF8A",
};

function Card({ cap, i }: { cap: Capability; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const color = TONE_COLOR[cap.tone];

  // Pointer-tracked spotlight. Written straight to CSS vars on the node so
  // it never triggers a React render on mousemove.
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--px", `${e.clientX - r.left}px`);
    ref.current.style.setProperty("--py", `${e.clientY - r.top}px`);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.85, delay: i * 0.12, ease: EASE }}
      style={{ "--card": color } as React.CSSProperties}
      className="group relative flex flex-col overflow-hidden rounded-xl card-lift border border-line bg-surface p-7 transition-colors duration-500 hover:border-[var(--card)]/45 sm:p-9"
    >
      {/* Spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(22rem 22rem at var(--px,50%) var(--py,50%), color-mix(in srgb, var(--card) 11%, transparent), transparent 70%)",
        }}
      />
      {/* Top rule that fills on hover */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px w-0 transition-all duration-700 group-hover:w-full"
        style={{ backgroundColor: color }}
      />

      <div className="relative flex items-center justify-between">
        <span className="font-mono text-[11px] tracking-[0.22em]" style={{ color }}>
          {cap.index}
        </span>
        <span
          aria-hidden
          className="h-1.5 w-1.5 rounded-full transition-transform duration-500 group-hover:scale-[2.2]"
          style={{ backgroundColor: color }}
        />
      </div>

      <h3 className="relative mt-7 font-display text-[1.32rem] leading-snug font-medium tracking-[-0.01em] text-ink sm:text-[1.5rem]">
        {cap.title}
      </h3>

      <p className="relative mt-4 text-[0.92rem] leading-relaxed text-muted">
        {cap.lede}
      </p>

      <ul className="relative mt-7 flex flex-col gap-2.5 border-t border-line/80 pt-6">
        {cap.points.map((p) => (
          <li key={p} className="flex items-start gap-3 text-[0.855rem] text-muted">
            <span
              aria-hidden
              className="mt-[0.5em] h-px w-3.5 shrink-0 transition-all duration-500 group-hover:w-5"
              style={{ backgroundColor: color }}
            />
            {p}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function Capabilities() {
  return (
    <section
      id="capabilities"
      data-tone="amber"
      className="relative scroll-mt-20 px-4 py-24 sm:px-8 md:py-36"
    >

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-16 max-w-3xl md:mb-20">
          <Reveal>
            <span className="eyebrow">What we do</span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-display text-[clamp(1.85rem,4.4vw,3.2rem)] leading-[1.06] font-medium tracking-[-0.025em] text-balance">
              Three disciplines that only work properly together.
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-xl text-[0.98rem] leading-relaxed text-muted">
              Storage decides when the power lands, EPC decides whether it gets
              built to spec, and manufacturing decides what it costs and when it
              arrives. Running all three under one roof is the point.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {CAPABILITIES.map((c, i) => (
            <Card key={c.id} cap={c} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
