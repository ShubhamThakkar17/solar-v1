"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { STATS, type Stat } from "@/lib/content";
import { EASE } from "@/lib/motion";

/**
 * Counts a numeric value up on entry. Values that are not purely numeric —
 * every placeholder, for instance — are left alone and simply fade in, so
 * `xx GWh` never gets mangled into something that looks like real data.
 */
function StatValue({ stat, active }: { stat: Stat; active: boolean }) {
  const reduced = useReducedMotion();
  const numeric = /^\d+$/.test(stat.value.trim());
  const target = numeric ? parseInt(stat.value, 10) : 0;
  const [n, setN] = useState(numeric ? 0 : null);

  useEffect(() => {
    if (!numeric || !active) return;
    if (reduced) return setN(target);

    let frame = 0;
    const start = performance.now();
    const dur = 1100;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      // Expo-out, matching the page's easing.
      setN(Math.round(target * (1 - Math.pow(2, -10 * t))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [numeric, active, target, reduced]);

  return (
    <span
      data-placeholder={stat.placeholder ? "true" : undefined}
      title={stat.placeholder ? "Placeholder — pending confirmed figure" : undefined}
      className="font-display text-[clamp(1.9rem,4.6vw,3.1rem)] leading-none font-medium tracking-[-0.02em]"
    >
      {numeric ? (n ?? 0) : stat.value}
    </span>
  );
}

export default function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });

  return (
    <section
      data-tone="amber"
      className="relative border-y border-line bg-bg-2"
      aria-label="Key figures"
    >
      <div
        ref={ref}
        className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-line/60 sm:px-0 lg:grid-cols-4"
      >
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay: i * 0.09, ease: EASE }}
            className="group relative bg-bg-2 px-5 py-9 transition-colors duration-500 hover:bg-surface sm:px-8 sm:py-12"
          >
            {/* Accent tick that grows on hover. */}
            <span className="bg-accent absolute top-0 left-0 h-px w-0 transition-all duration-500 group-hover:w-full" />
            <StatValue stat={s} active={inView} />
            <div className="mt-4 font-display text-[0.82rem] text-ink">
              {s.label}
            </div>
            {s.detail && (
              <div className="mt-1 font-mono text-[10.5px] tracking-[0.12em] text-muted-2 uppercase">
                {s.detail}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
