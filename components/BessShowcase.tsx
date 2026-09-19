"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { BESS } from "@/lib/content";
import {
  socAt,
  powerAt,
  modeAt,
  formatHour,
  MODE_HOURS,
  type Mode,
} from "@/lib/dispatch";
import { IMAGES } from "@/lib/images";
import CellArray from "./viz/CellArray";
import SocCurve from "./viz/SocCurve";
import ThermalMap from "./viz/ThermalMap";
import SingleLine from "./viz/SingleLine";
import Photo from "./Photo";
import Reveal from "./Reveal";

/** Seconds of real time per simulated hour when running. */
const HOURS_PER_SECOND = 2.2;

export default function BessShowcase() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-25% 0px -25% 0px" });
  const reduced = useReducedMotion();

  const [hour, setHour] = useState(12.5);
  // The visitor taking hold of the controls always wins over autoplay.
  const [manual, setManual] = useState(false);

  // Slow drift on the grid plate, the same gesture the EPC section uses.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const plateY = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);

  const running = inView && !manual && !reduced;

  useEffect(() => {
    if (!running) return;
    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setHour((h) => (h + dt * HOURS_PER_SECOND) % 24);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running]);

  const takeControl = useCallback((h: number) => {
    setManual(true);
    setHour(h);
  }, []);

  const soc = socAt(hour);
  const power = powerAt(hour);
  const mode = modeAt(hour);
  const modeCopy = BESS.modes[mode];

  return (
    <section
      ref={ref}
      id="bess"
      data-tone="cyan"
      className="relative scroll-mt-20 overflow-hidden border-y border-line bg-bg-2 px-4 py-24 sm:px-8 md:py-36"
    >
      {/* Cool wash so the storage section reads distinctly from the amber ones. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60rem 40rem at 72% 18%, rgb(15 163 196 / 0.07), transparent 65%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 grid gap-10 md:mb-16 lg:grid-cols-[1fr_0.82fr] lg:items-end lg:gap-14">
          <div className="max-w-3xl">
            <Reveal>
              <span className="eyebrow">{BESS.eyebrow}</span>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-5 font-display text-[clamp(1.85rem,4.4vw,3.2rem)] leading-[1.06] font-medium tracking-[-0.025em] text-balance">
                {BESS.headline}
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-xl text-[0.98rem] leading-relaxed text-muted">
                {BESS.sub}
              </p>
            </Reveal>
          </div>

          {/* The grid the storage answers to. Sits beside the intro rather
              than above the panel, so the instrument stays the thing the
              eye lands on. */}
          <Reveal delay={0.2} y={40}>
            <div className="relative card-lift h-[210px] overflow-hidden rounded-2xl sm:h-[270px] lg:h-[300px]">
              <motion.div
                style={reduced ? undefined : { y: plateY }}
                className="absolute inset-0 scale-110"
              >
                <Photo
                  img={IMAGES.substationApproach}
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </motion.div>
              <div className="absolute inset-x-0 bottom-0 p-4">
                <span className="inline-block rounded-full bg-white/90 px-4 py-2 font-mono text-[10px] tracking-[0.16em] text-ink uppercase backdrop-blur-md">
                  Point of common coupling
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Instrument panel ------------------------------------------- */}
        <Reveal delay={0.1} y={40}>
          <div className="overflow-hidden card-lift rounded-2xl border border-line bg-surface">
            {/* Controls */}
            <div className="flex flex-col gap-6 border-b border-line p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
              {/* Mode jump buttons */}
              <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-label="Jump to dispatch state"
              >
                {(Object.keys(MODE_HOURS) as Mode[]).map((m) => {
                  const active = mode === m;
                  return (
                    <button
                      key={m}
                      onClick={() => takeControl(MODE_HOURS[m])}
                      aria-pressed={active}
                      className={`rounded-full border px-4 py-2 font-mono text-[10.5px] tracking-[0.14em] uppercase transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#0FA3C4]/60 focus-visible:outline-none ${
                        active
                          ? "border-[#0FA3C4] bg-[#0FA3C4]/12 text-[#0A6780]"
                          : "border-line-2 text-muted hover:border-[#0FA3C4]/50 hover:text-ink"
                      }`}
                    >
                      {BESS.modes[m].label}
                    </button>
                  );
                })}
              </div>

              {/* Live readouts */}
              <div className="flex flex-wrap items-baseline gap-x-7 gap-y-3">
                <Readout label="Time" value={formatHour(hour)} />
                <Readout label="SOC" value={`${Math.round(soc * 100)}%`} accent />
                <Readout
                  label="Power"
                  value={`${power > 0.02 ? "+" : ""}${(power * 100).toFixed(0)}%`}
                  accent={Math.abs(power) > 0.07}
                />
                <Readout label="State" value={modeCopy.label} accent={mode !== "idle"} />
              </div>
            </div>

            {/* Scrubber */}
            <div className="border-b border-line px-5 py-5 sm:px-7">
              <div className="mb-3 flex items-baseline justify-between">
                <label
                  htmlFor="dispatch-hour"
                  className="font-mono text-[10px] tracking-[0.18em] text-muted-2 uppercase"
                >
                  Drag to scrub the day
                </label>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[10px] text-muted-2">
                    {modeCopy.hint}
                  </span>
                  {manual && !reduced && (
                    <button
                      onClick={() => setManual(false)}
                      className="font-mono text-[10px] tracking-[0.14em] text-[#0A6780] uppercase transition-opacity hover:opacity-70"
                    >
                      ▶ Resume
                    </button>
                  )}
                </div>
              </div>
              <input
                id="dispatch-hour"
                type="range"
                min={0}
                max={24}
                step={0.1}
                value={hour}
                onChange={(e) => takeControl(parseFloat(e.target.value))}
                aria-valuetext={`${formatHour(hour)}, ${modeCopy.label}, ${Math.round(
                  soc * 100
                )} percent charged`}
                className="dispatch-range w-full"
                style={{ "--pct": `${(hour / 24) * 100}%` } as React.CSSProperties}
              />
            </div>

            {/* Visualisations */}
            <div className="grid gap-px bg-line lg:grid-cols-2">
              <Panel>
                <div className="h-[168px]">
                  <CellArray soc={soc} mode={mode} />
                </div>
              </Panel>
              <Panel>
                <div className="h-[168px]">
                  <SocCurve hour={hour} />
                </div>
              </Panel>
              <Panel>
                <div className="h-[168px]">
                  <ThermalMap hour={hour} />
                </div>
              </Panel>
              <Panel>
                <div className="h-[168px]">
                  <SingleLine mode={mode} />
                </div>
              </Panel>
            </div>
          </div>
        </Reveal>

        {/* Specs ------------------------------------------------------- */}
        <Reveal delay={0.12}>
          <dl className="mt-px grid grid-cols-2 gap-px overflow-hidden rounded-b-xl bg-line sm:grid-cols-3 lg:grid-cols-6">
            {BESS.specs.map((s) => (
              <div key={s.label} className="bg-surface px-5 py-5">
                <dt className="font-mono text-[9.5px] tracking-[0.16em] text-muted-2 uppercase">
                  {s.label}
                </dt>
                <dd
                  data-placeholder={s.placeholder ? "true" : undefined}
                  title={s.placeholder ? "Placeholder — pending confirmed figure" : undefined}
                  className="mt-2 font-display text-[1.05rem] text-ink"
                >
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-6 max-w-2xl font-mono text-[10.5px] leading-relaxed tracking-[0.04em] text-muted-2">
            {BESS.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return <div className="bg-surface p-5 sm:p-6">{children}</div>;
}

function Readout({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[9.5px] tracking-[0.16em] text-muted-2 uppercase">
        {label}
      </span>
      <span
        className="font-mono text-[0.95rem] tabular-nums transition-colors duration-300"
        style={{ color: accent ? "#0A6780" : "#0C1520" }}
      >
        {value}
      </span>
    </div>
  );
}
