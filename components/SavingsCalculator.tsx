"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  calculate,
  money,
  kw,
  kwh,
  MARKETS,
  RANGES,
  type Segment,
  type MarketId,
} from "@/lib/savings";
import { CALCULATOR } from "@/lib/content";
import { EASE } from "@/lib/motion";
import Reveal from "./Reveal";

export default function SavingsCalculator() {
  const reduced = useReducedMotion();
  const [segment, setSegment] = useState<Segment>("industrial");
  const [market, setMarket] = useState<MarketId>("india");

  const m = MARKETS[market];
  const billRange = RANGES.bill[segment][market];
  const roofRange = RANGES.roof[segment];

  const [bill, setBill] = useState(m.defaultBill[segment]);
  const [roof, setRoof] = useState(segment === "industrial" ? 25000 : 700);
  const [battery, setBattery] = useState(false);
  const [batteryKwh, setBatteryKwh] = useState(10);

  // Switching segment or market changes what a sensible bill even looks like,
  // so reset to that combination's typical value rather than carrying over a
  // number that would be nonsense in the new context.
  const switchSegment = (s: Segment) => {
    setSegment(s);
    setBill(MARKETS[market].defaultBill[s]);
    setRoof(s === "industrial" ? 25000 : 700);
    if (s === "industrial") setBattery(false);
  };
  const switchMarket = (id: MarketId) => {
    setMarket(id);
    setBill(MARKETS[id].defaultBill[segment]);
  };

  const r = useMemo(
    () =>
      calculate({
        segment,
        market,
        monthlyBill: bill,
        roofSqft: roof,
        battery,
        batteryKwh,
      }),
    [segment, market, bill, roof, battery, batteryKwh]
  );

  const copy = CALCULATOR[segment];
  const pct = (v: number, [lo, hi]: readonly [number, number] | number[]) =>
    `${((v - lo) / (hi - lo)) * 100}%`;

  return (
    <section
      id="calculator"
      data-tone={segment === "residential" ? "amber" : "cyan"}
      className="relative scroll-mt-20 border-y border-line bg-bg-2 px-4 py-24 sm:px-8 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl md:mb-14">
          <Reveal>
            <span className="eyebrow">{CALCULATOR.eyebrow}</span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-display text-[clamp(1.9rem,4.4vw,3.2rem)] leading-[1.06] font-medium tracking-[-0.03em] text-balance">
              {CALCULATOR.headline}
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-5 max-w-xl text-[1rem] leading-relaxed text-muted">
              {copy.sub}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1} y={36}>
          <div className="card-lift-lg overflow-hidden rounded-3xl border border-line bg-surface">
            {/* Segment tabs -------------------------------------------- */}
            <div
              className="flex border-b border-line"
              role="tablist"
              aria-label="Choose a segment"
            >
              {(["industrial", "residential"] as Segment[]).map((s) => {
                const on = segment === s;
                return (
                  <button
                    key={s}
                    role="tab"
                    aria-selected={on}
                    onClick={() => switchSegment(s)}
                    className={`relative flex-1 px-5 py-5 font-display text-[0.95rem] font-medium transition-colors duration-300 sm:text-[1.05rem] ${
                      on ? "text-ink" : "text-muted-2 hover:text-muted"
                    }`}
                  >
                    {CALCULATOR[s].tab}
                    {on && (
                      <motion.span
                        layoutId="calc-tab"
                        transition={
                          reduced ? { duration: 0 } : { duration: 0.4, ease: EASE }
                        }
                        className="bg-accent absolute inset-x-0 bottom-0 h-[3px]"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
              {/* Inputs ------------------------------------------------ */}
              <div className="border-b border-line p-6 sm:p-8 lg:border-r lg:border-b-0">
                {/* Market */}
                <fieldset>
                  <legend className="font-mono text-[10px] tracking-[0.18em] text-muted-2 uppercase">
                    Market
                  </legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(Object.keys(MARKETS) as MarketId[]).map((id) => {
                      const on = market === id;
                      return (
                        <button
                          key={id}
                          onClick={() => switchMarket(id)}
                          aria-pressed={on}
                          className={`rounded-full border px-4 py-2 font-mono text-[10.5px] tracking-[0.12em] uppercase transition-all duration-300 ${
                            on
                              ? "border-[var(--accent)] bg-accent-soft text-[var(--accent-ink)]"
                              : "border-line-2 text-muted hover:border-[var(--accent)]/60 hover:text-ink"
                          }`}
                        >
                          {MARKETS[id].label}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                {/* Monthly bill */}
                <div className="mt-8">
                  <div className="flex items-baseline justify-between">
                    <label
                      htmlFor="calc-bill"
                      className="font-mono text-[10px] tracking-[0.18em] text-muted-2 uppercase"
                    >
                      {copy.billLabel}
                    </label>
                    <span className="font-display text-[1.15rem] font-medium text-ink tabular-nums">
                      {money(bill, m)}
                    </span>
                  </div>
                  <input
                    id="calc-bill"
                    type="range"
                    min={billRange[0]}
                    max={billRange[1]}
                    step={Math.max(1, Math.round((billRange[1] - billRange[0]) / 200))}
                    value={bill}
                    onChange={(e) => setBill(Number(e.target.value))}
                    className="calc-range mt-3"
                    style={{ "--pct": pct(bill, billRange) } as React.CSSProperties}
                  />
                  <div className="flex justify-between font-mono text-[9.5px] text-muted-2">
                    <span>{money(billRange[0], m, true)}</span>
                    <span>{money(billRange[1], m, true)}</span>
                  </div>
                </div>

                {/* Roof area */}
                <div className="mt-7">
                  <div className="flex items-baseline justify-between">
                    <label
                      htmlFor="calc-roof"
                      className="font-mono text-[10px] tracking-[0.18em] text-muted-2 uppercase"
                    >
                      {copy.roofLabel}
                    </label>
                    <span className="font-display text-[1.15rem] font-medium text-ink tabular-nums">
                      {roof.toLocaleString(m.locale)} ft²
                    </span>
                  </div>
                  <input
                    id="calc-roof"
                    type="range"
                    min={roofRange[0]}
                    max={roofRange[1]}
                    step={roofRange[0]}
                    value={roof}
                    onChange={(e) => setRoof(Number(e.target.value))}
                    className="calc-range mt-3"
                    style={{ "--pct": pct(roof, roofRange) } as React.CSSProperties}
                  />
                  <div className="flex justify-between font-mono text-[9.5px] text-muted-2">
                    <span>{roofRange[0].toLocaleString()} ft²</span>
                    <span>{roofRange[1].toLocaleString()} ft²</span>
                  </div>
                </div>

                {/* Battery — residential only */}
                <AnimatePresence initial={false}>
                  {segment === "residential" && (
                    <motion.div
                      initial={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
                      animate={
                        reduced ? { opacity: 1 } : { opacity: 1, height: "auto" }
                      }
                      exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="mt-7 rounded-2xl border border-line bg-surface-2 p-5">
                        <label className="flex cursor-pointer items-center justify-between gap-4">
                          <span>
                            <span className="font-display text-[0.95rem] font-medium text-ink">
                              Add battery backup
                            </span>
                            <span className="mt-1 block text-[0.8rem] text-muted">
                              Stores daytime surplus for the evening — and keeps
                              the lights on in an outage.
                            </span>
                          </span>
                          <span className="relative shrink-0">
                            <input
                              type="checkbox"
                              checked={battery}
                              onChange={(e) => setBattery(e.target.checked)}
                              className="peer sr-only"
                            />
                            <span className="block h-6 w-11 rounded-full bg-line-2 transition-colors duration-300 peer-checked:bg-[var(--accent)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--accent)]/50 peer-focus-visible:ring-offset-2" />
                            <span className="pointer-events-none absolute top-0.5 left-0.5 block h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 peer-checked:translate-x-5" />
                          </span>
                        </label>

                        {battery && (
                          <div className="mt-5 border-t border-line pt-4">
                            <div className="flex items-baseline justify-between">
                              <label
                                htmlFor="calc-batt"
                                className="font-mono text-[10px] tracking-[0.18em] text-muted-2 uppercase"
                              >
                                Battery size
                              </label>
                              <span className="font-display text-[1rem] font-medium text-ink tabular-nums">
                                {batteryKwh} kWh
                              </span>
                            </div>
                            <input
                              id="calc-batt"
                              type="range"
                              min={5}
                              max={30}
                              step={1}
                              value={batteryKwh}
                              onChange={(e) => setBatteryKwh(Number(e.target.value))}
                              className="calc-range mt-3"
                              style={
                                { "--pct": pct(batteryKwh, [5, 30]) } as React.CSSProperties
                              }
                            />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Results ----------------------------------------------- */}
              <div className="bg-surface-2/60 p-6 sm:p-8">
                {/* Headline numbers */}
                <div className="grid grid-cols-2 gap-4">
                  <Figure
                    label="You could save"
                    value={money(r.monthlySaving, m)}
                    unit="per month"
                    big
                  />
                  <Figure
                    label="Payback in"
                    value={
                      r.paybackYears === null
                        ? "—"
                        : `${r.paybackYears.toFixed(1)}`
                    }
                    unit={r.paybackYears === null ? "not in 25 yrs" : "years"}
                    big
                  />
                </div>

                {/* Bill before / after */}
                <div className="mt-6 rounded-2xl border border-line bg-surface p-5">
                  <span className="font-mono text-[10px] tracking-[0.18em] text-muted-2 uppercase">
                    Monthly bill
                  </span>
                  <div className="mt-4 flex items-end gap-3">
                    <Bar
                      label="Before"
                      value={money(r.billBefore, m, true)}
                      height={100}
                      tone="muted"
                    />
                    <Bar
                      label="After"
                      value={money(r.billAfter, m, true)}
                      height={
                        r.billBefore > 0
                          ? Math.max(6, (r.billAfter / r.billBefore) * 100)
                          : 0
                      }
                      tone="accent"
                    />
                  </div>
                </div>

                {/* Breakdown */}
                <dl className="mt-6 flex flex-col gap-px overflow-hidden rounded-2xl border border-line bg-line">
                  <Row k="System size" v={kw(r.systemKw)} />
                  <Row k="Annual generation" v={kwh(r.annualGenerationKwh)} />
                  <Row k="System cost" v={money(r.grossCost, m, true)} />
                  {r.subsidyAmount > 0 && (
                    <Row
                      k="Less incentive"
                      v={`− ${money(r.subsidyAmount, m, true)}`}
                      accent
                    />
                  )}
                  {r.batteryCost > 0 && (
                    <Row k="Battery" v={`+ ${money(r.batteryCost, m, true)}`} />
                  )}
                  <Row k="Net cost" v={money(r.netCost, m, true)} strong />
                  <Row k="25-year net saving" v={money(r.lifetimeSaving, m, true)} strong />
                  <Row k="CO₂ avoided" v={`${r.co2TonnesPerYear.toFixed(1)} t / yr`} />
                </dl>

                {/* Roof is the binding constraint — worth saying plainly. */}
                {r.roofConstrained && (
                  <p className="mt-4 rounded-xl bg-accent-soft px-4 py-3 text-[0.82rem] leading-relaxed text-[var(--accent-ink)]">
                    Your roof is the limit here, not your bill. The area given
                    supports {kw(r.roofLimitedKw)}, while your consumption would
                    justify {kw(r.billLimitedKw)}.
                  </p>
                )}
              </div>
            </div>

            {/* Assumptions -------------------------------------------- */}
            <details className="border-t border-line bg-surface px-6 py-4 sm:px-8">
              <summary className="cursor-pointer font-mono text-[10px] tracking-[0.16em] text-muted-2 uppercase hover:text-muted">
                Assumptions used
              </summary>
              <div className="mt-4 grid gap-x-8 gap-y-2 text-[0.8rem] text-muted sm:grid-cols-2">
                <Assume k="Tariff" v={`${m.symbol}${m.tariff[segment]} / kWh`} />
                <Assume k="Installed cost" v={`${money(m.costPerKw[segment], m)} / kW`} />
                <Assume k="Specific yield" v={`${m.yieldPerKw} kWh / kW / yr`} />
                <Assume k="Incentive" v={`${(m.subsidy[segment] * 100).toFixed(0)}% of system cost`} />
                <Assume k="Roof required" v="85 ft² per kW" />
                <Assume k="Tariff escalation" v="4% per year" />
                <Assume k="Degradation" v="0.5% per year" />
                <Assume k="O&M" v="1% of net cost per year" />
              </div>
              <p className="mt-4 text-[0.78rem] leading-relaxed text-muted-2">
                {m.subsidyNote}
              </p>
            </details>
          </div>
        </Reveal>

        <Reveal delay={0.14}>
          <p className="mt-5 max-w-3xl text-[0.82rem] leading-relaxed text-muted-2">
            {CALCULATOR.disclaimer}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- partials */

function Figure({
  label,
  value,
  unit,
  big = false,
}: {
  label: string;
  value: string;
  unit: string;
  big?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <span className="font-mono text-[10px] tracking-[0.16em] text-muted-2 uppercase">
        {label}
      </span>
      <div
        className={`mt-2 font-display font-medium tracking-[-0.02em] text-ink tabular-nums ${
          big ? "text-[clamp(1.5rem,3.6vw,2.1rem)]" : "text-[1.3rem]"
        }`}
      >
        {value}
      </div>
      <span className="font-mono text-[10px] tracking-[0.1em] text-muted-2">
        {unit}
      </span>
    </div>
  );
}

function Bar({
  label,
  value,
  height,
  tone,
}: {
  label: string;
  value: string;
  height: number;
  tone: "muted" | "accent";
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-2">
      <span className="font-display text-[0.9rem] font-medium text-ink tabular-nums">
        {value}
      </span>
      <div className="flex h-24 w-full items-end">
        <div
          className={`w-full rounded-t-lg transition-all duration-500 ease-out ${
            tone === "accent" ? "bg-accent" : "bg-line-2"
          }`}
          style={{ height: `${height.toFixed(1)}%` }}
        />
      </div>
      <span className="font-mono text-[9.5px] tracking-[0.14em] text-muted-2 uppercase">
        {label}
      </span>
    </div>
  );
}

function Row({
  k,
  v,
  strong = false,
  accent = false,
}: {
  k: string;
  v: string;
  strong?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 bg-surface px-5 py-3">
      <dt className="text-[0.85rem] text-muted">{k}</dt>
      <dd
        className={`text-[0.9rem] tabular-nums ${
          accent
            ? "text-[var(--accent-ink)]"
            : strong
              ? "font-display font-medium text-ink"
              : "text-ink"
        }`}
      >
        {v}
      </dd>
    </div>
  );
}

function Assume({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-line py-1.5">
      <span className="text-muted-2">{k}</span>
      <span className="tabular-nums">{v}</span>
    </div>
  );
}
