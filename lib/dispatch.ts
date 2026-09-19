/**
 * Dispatch model for the BESS showcase.
 *
 * A representative 24-hour cycle for a solar-coupled battery: charge on
 * midday surplus, hold, then discharge into the evening peak. The numbers are
 * illustrative of how such a system behaves — they are not measurements from
 * an installed project, and the section says so on the page.
 *
 * POWER IS THE PRIMARY QUANTITY and state of charge is its integral. Doing it
 * the other way round (keyframed SOC, differentiated to get power) produces a
 * power curve that oscillates — each interpolated segment's slope returns to
 * zero at every keyframe, so you get one spurious hump per segment instead of
 * one charge and one discharge. Integrating forwards cannot disagree with
 * itself that way.
 */

export type Mode = "charge" | "idle" | "discharge";

/** Gaussian bell. */
const bell = (h: number, centre: number, width: number) =>
  Math.exp(-Math.pow(h - centre, 2) / (2 * width * width));

/** Charging window — tracks the solar day, peaking just after noon. */
const chargeShape = (h: number) => bell(h, 12.3, 3.1);

/** Discharge window — the evening demand peak. Shorter and sharper. */
const dischargeShape = (h: number) => bell(h, 19.8, 1.9);

/**
 * Balance and scale factors, solved once rather than hand-tuned.
 *
 * `BALANCE` equalises the area under the two bells so the energy that goes in
 * across the solar window comes back out across the evening peak — without it
 * the state of charge does not return to where it started and the looping
 * animation visibly jumps at midnight.
 *
 * `PEAK` then normalises so the largest excursion is exactly 1.0. Clamping
 * instead of normalising would flat-top the discharge and silently destroy
 * the balance we just solved for.
 */
const { BALANCE, PEAK } = (() => {
  const n = 2400;
  const dh = 24 / n;
  let cArea = 0;
  let dArea = 0;
  for (let i = 0; i <= n; i++) {
    const h = i * dh;
    const w = i === 0 || i === n ? 0.5 : 1;
    cArea += chargeShape(h) * w * dh;
    dArea += dischargeShape(h) * w * dh;
  }
  const balance = cArea / dArea;

  let peak = 0;
  for (let i = 0; i <= n; i++) {
    const h = i * dh;
    peak = Math.max(peak, Math.abs(dischargeShape(h) * balance - chargeShape(h)));
  }
  return { BALANCE: balance, PEAK: peak };
})();

/**
 * Normalised power, -1..1.
 * Positive = discharging to the grid, negative = charging from solar.
 *
 * The evening peak is the deeper excursion because a discharge into demand is
 * shorter and harder than a charge across a whole solar day.
 */
export function powerAt(hour: number): number {
  const h = ((hour % 24) + 24) % 24;
  return (dischargeShape(h) * BALANCE - chargeShape(h)) / PEAK;
}

/* Integrate power once at module load into a lookup table, then normalise
   the result into a realistic operating band. */
const STEPS = 480;
const SOC_MIN = 0.18;
const SOC_MAX = 0.96;

const SOC_TABLE: number[] = (() => {
  const dh = 24 / STEPS;
  const raw: number[] = [0];
  for (let i = 1; i <= STEPS; i++) {
    const h = i * dh;
    // Trapezoidal step. Negative power charges, so subtract to accumulate.
    const avg = (powerAt(h - dh) + powerAt(h)) / 2;
    raw.push(raw[i - 1] - avg * dh);
  }
  const lo = Math.min(...raw);
  const hi = Math.max(...raw);
  const span = hi - lo || 1;
  return raw.map((v) => SOC_MIN + ((v - lo) / span) * (SOC_MAX - SOC_MIN));
})();

/** State of charge, 0..1, at any hour in [0, 24]. */
export function socAt(hour: number): number {
  const h = ((hour % 24) + 24) % 24;
  const pos = (h / 24) * STEPS;
  const i = Math.floor(pos);
  const t = pos - i;
  const a = SOC_TABLE[Math.min(i, STEPS)];
  const b = SOC_TABLE[Math.min(i + 1, STEPS)];
  return a + (b - a) * t;
}

/** Dead-band around zero so a near-flat curve reads as standby, not drift. */
export function modeAt(hour: number): Mode {
  const p = powerAt(hour);
  if (p < -0.08) return "charge";
  if (p > 0.08) return "discharge";
  return "idle";
}

/**
 * Cell temperature, 0..1. Throughput is the main driver, and cells toward the
 * middle of the rack run considerably warmer because they are the hardest to
 * cool — which is exactly why thermal management decides storage economics in
 * hot climates. Heat also lags load, so the rack stays warm after a cycle.
 */
export function thermalAt(hour: number, centrality: number): number {
  const h = ((hour % 24) + 24) % 24;

  // Thermal mass: sample recent load rather than instantaneous load.
  const load =
    Math.abs(powerAt(h)) * 0.6 +
    Math.abs(powerAt(h - 0.7)) * 0.25 +
    Math.abs(powerAt(h - 1.5)) * 0.15;

  // Ambient swings across the day, warmest mid-afternoon.
  const ambient = 0.26 + 0.17 * bell(h, 15, 5.5);

  // Centrality spread is wide so the gradient across the rack is legible.
  const spread = 0.18 + centrality * 0.82;

  return Math.max(0, Math.min(1, ambient + load * 0.72 * spread));
}

/** A representative hour for each mode, used by the three quick-jump buttons. */
export const MODE_HOURS: Record<Mode, number> = {
  charge: 12.3,
  idle: 16.6,
  discharge: 19.8,
};

/** "13:30" from 13.5 */
export function formatHour(hour: number): string {
  const h = ((hour % 24) + 24) % 24;
  const hh = Math.floor(h);
  let mm = Math.round((h - hh) * 60);
  let carry = 0;
  if (mm === 60) {
    mm = 0;
    carry = 1;
  }
  return `${String((hh + carry) % 24).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}
