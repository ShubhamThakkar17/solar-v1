"use client";

import { MARKETS } from "@/lib/content";
import Reveal from "./Reveal";

export default function Markets() {
  return (
    <section
      id="markets"
      data-tone="cyan"
      className="relative scroll-mt-20 border-y border-line bg-bg-2 px-4 py-24 sm:px-8 md:py-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(52rem 34rem at 18% 25%, rgb(15 163 196 / 0.07), transparent 62%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-14 max-w-3xl md:mb-20">
          <Reveal>
            <span className="eyebrow">{MARKETS.eyebrow}</span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-display text-[clamp(1.85rem,4.4vw,3.2rem)] leading-[1.06] font-medium tracking-[-0.025em] text-balance">
              {MARKETS.headline}
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-xl text-[0.98rem] leading-relaxed text-muted">
              {MARKETS.sub}
            </p>
          </Reveal>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {MARKETS.regions.map((r, i) => (
            <Reveal
              key={r.name}
              delay={i * 0.1}
              y={34}
              className="group flex flex-col rounded-xl card-lift border border-line bg-surface p-7 transition-colors duration-500 hover:border-[var(--accent)]/40 sm:p-8"
            >
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-[1.3rem] font-medium text-ink">
                  {r.name}
                </h3>
                <span className="font-mono text-[10px] tracking-[0.18em] text-muted-2">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <span className="bg-accent mt-5 block h-px w-8 transition-all duration-500 group-hover:w-16" />

              <p className="mt-5 text-[0.9rem] leading-relaxed text-muted">
                {r.body}
              </p>

              {r.context && (
                <div className="mt-6 border-t border-line pt-5">
                  <p className="text-[0.82rem] leading-relaxed text-muted-2">
                    {r.context}
                  </p>
                  {/* Third-party market context, attributed. Not a claim about
                      Silver Touch's own delivered capacity. */}
                  {r.source && (
                    <p className="mt-3 font-mono text-[9.5px] tracking-[0.14em] text-muted-2/70 uppercase">
                      Source: {r.source}
                    </p>
                  )}
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
