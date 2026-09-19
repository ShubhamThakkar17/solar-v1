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

    // Reduced motion lands on the final figure on the very first frame, but
    // it still goes through the rAF path rather than setting state straight
    // from the effect body. The prerendered HTML is built with
    // `useReducedMotion` server-side null, so the preference only becomes
    // known on the client's first render — jumping to the target during
    // render would be a hydration mismatch, and doing it synchronously in
    // the effect body costs a second render pass on every mount.
    let frame = 0;
    const start = performance.now();
    const dur = reduced ? 0 : 1100;
    const tick = (now: number) => {
      const t = dur > 0 ? Math.min(1, (now - start) / dur) : 1;
      // Expo-out, matching the page's easing. Pinned at the endpoint so the
      // counter settles on the figure itself rather than a whisker below it.
      setN(t < 1 ? Math.round(target * (1 - Math.pow(2, -10 * t))) : target);
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
