"use client";

import { thermalAt } from "@/lib/dispatch";

const COLS = 16;
const ROWS = 5;

/**
 * Cool blue → cyan → amber → hot. Stops chosen to stay legible on graphite.
 *
 * Emitted in comma form because that is how the browser normalises it in the
 * DOM; the space-separated form would differ from what React serialised on
 * the server and trip a hydration mismatch.
 */
function heatColor(t: number): string {
  // Light-theme scale: the cool end is a pale blue rather than navy, because
  // a dark "cold" cell reads as the hottest thing on a white panel.
  const stops: [number, [number, number, number]][] = [
    [0, [216, 232, 243]],
    [0.35, [92, 199, 225]],
    [0.65, [240, 165, 55]],
    [1, [220, 68, 61]],
  ];
  for (let i = 0; i < stops.length - 1; i++) {
    const [p0, c0] = stops[i];
    const [p1, c1] = stops[i + 1];
    if (t >= p0 && t <= p1) {
      const k = p1 === p0 ? 0 : (t - p0) / (p1 - p0);
      const c = c0.map((v, j) => Math.round(v + (c1[j] - v) * k));
      return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
    }
  }
  return "rgb(220, 68, 61)";
}

/**
 * Round to 3dp before it reaches an inline style.
 *
 * A raw float like 0.7110873464796115 is written to the DOM as "0.711087",
 * and hydration then compares the full-precision value against the rounded
 * one and reports a mismatch. Rounding first makes both sides agree.
 */
const px3 = (v: number) => Number(v.toFixed(3));

/**
 * Thermal profile across the rack.
 *
 * Heat tracks throughput, and cells toward the middle run hotter because they
 * are hardest to cool — which is exactly why thermal management and
 * augmentation planning decide storage economics in hot climates.
 */
export default function ThermalMap({ hour }: { hour: number }) {
  const cells: { t: number; key: string }[] = [];
  let peak = 0;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      // 1 at the centre of the rack, 0 at the edges.
      const dx = 1 - Math.abs(c - (COLS - 1) / 2) / ((COLS - 1) / 2);
      const dy = 1 - Math.abs(r - (ROWS - 1) / 2) / ((ROWS - 1) / 2);
      const centrality = dx * 0.65 + dy * 0.35;
      const t = thermalAt(hour, centrality);
      peak = Math.max(peak, t);
      cells.push({ t, key: `${r}-${c}` });
    }
  }

  // Map normalised heat onto a plausible cell temperature band.
  const degrees = (t: number) => Math.round(18 + t * 30);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-baseline justify-between">
        <span className="font-mono text-[10px] tracking-[0.18em] text-muted-2 uppercase">
          Thermal profile
        </span>
        <span className="font-mono text-[10px] tracking-[0.12em] text-muted-2">
          peak {degrees(peak)}°C
        </span>
      </div>

      <div
        className="grid flex-1 gap-[2px]"
        style={{
          gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
        }}
        role="img"
        aria-label={`Rack thermal profile, peak cell temperature ${degrees(peak)} degrees Celsius`}
      >
        {cells.map(({ t, key }) => (
          <div
            key={key}
            className="rounded-[1.5px] transition-colors duration-700 ease-out"
            // `backgroundColor`, not the `background` shorthand: React
            // serialises the shorthand differently on the server than the
            // browser normalises it, which trips a hydration mismatch.
            style={{ backgroundColor: heatColor(t), opacity: px3(0.6 + t * 0.4) }}
          />
        ))}
      </div>

      {/* Scale */}
      <div className="mt-3 flex items-center gap-2">
        <span className="font-mono text-[10px] text-muted-2">18°</span>
        <div
          className="h-1 flex-1 rounded-full"
          style={{
            background:
              "linear-gradient(to right, rgb(216 232 243), rgb(92 199 225), rgb(240 165 55), rgb(220 68 61))",
          }}
        />
        <span className="font-mono text-[10px] text-muted-2">48°</span>
      </div>
    </div>
  );
}
