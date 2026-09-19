/**
 * Solar savings model — Industrial and Residential.
 *
 * ── READ THIS BEFORE THE NUMBERS GO LIVE ────────────────────────────────
 * Every assumption below is a documented, editable default, not a quote.
 * They are drawn from ordinary public ranges for each market so the output
 * is plausible, but they are NOT Silver Touch's pricing and they are NOT a
 * guarantee. The UI states this, and the figures carry the same placeholder
 * treatment as the rest of the page.
 *
 * Replace `MARKETS` with real, signed-off numbers before launch.
 * ────────────────────────────────────────────────────────────────────────
 */

export type Segment = "industrial" | "residential";
export type MarketId = "india" | "gcc" | "intl";

export type Market = {
  id: MarketId;
  label: string;
  currency: string;
  /** Currency symbol shown in the UI. */
  symbol: string;
  /** Locale used for grouping digits (Indian grouping differs). */
  locale: string;
  /** Grid tariff per kWh, in local currency. */
  tariff: Record<Segment, number>;
  /** Installed cost per kW, in local currency. */
  costPerKw: Record<Segment, number>;
  /** Capital subsidy as a fraction of system cost. */
  subsidy: Record<Segment, number>;
  /** Specific yield — kWh generated per kW installed, per year. */
  yieldPerKw: number;
  /** Typical monthly bill, used as the slider's starting point. */
  defaultBill: Record<Segment, number>;
  /** Added cost per kWh of battery storage. */
  batteryCostPerKwh: number;
  /** Plain-language note on where the subsidy figure comes from. */
  subsidyNote: string;
};

export const MARKETS: Record<MarketId, Market> = {
  india: {
    id: "india",
    label: "India",
    currency: "INR",
    symbol: "₹",
    locale: "en-IN",
    tariff: { industrial: 9.2, residential: 7.5 },
    costPerKw: { industrial: 42000, residential: 55000 },
    subsidy: { industrial: 0, residential: 0.25 },
    yieldPerKw: 1450,
    defaultBill: { industrial: 250000, residential: 4500 },
    batteryCostPerKwh: 22000,
    subsidyNote:
      "Residential figure approximates a capital subsidy of the kind offered under national rooftop schemes; industrial assumes none.",
  },
  gcc: {
    id: "gcc",
    label: "GCC",
    currency: "USD",
    symbol: "$",
    locale: "en-US",
    tariff: { industrial: 0.09, residential: 0.08 },
    costPerKw: { industrial: 620, residential: 850 },
    subsidy: { industrial: 0, residential: 0 },
    yieldPerKw: 1750,
    defaultBill: { industrial: 4200, residential: 130 },
    batteryCostPerKwh: 310,
    subsidyNote:
      "No capital subsidy assumed. High irradiance gives the strongest yield of the three markets.",
  },
  intl: {
    id: "intl",
    label: "International",
    currency: "USD",
    symbol: "$",
    locale: "en-US",
    tariff: { industrial: 0.16, residential: 0.19 },
    costPerKw: { industrial: 900, residential: 1450 },
    subsidy: { industrial: 0.1, residential: 0.2 },
    yieldPerKw: 1250,
    defaultBill: { industrial: 6500, residential: 180 },
    batteryCostPerKwh: 420,
    subsidyNote:
      "Generic incentive placeholder standing in for the credits available in many markets; varies widely by country.",
  },
};

/** Roof area needed per kW installed, in square feet. */
const SQFT_PER_KW = 85;

/** Share of generation actually consumed on site rather than exported. */
const SELF_CONSUMPTION: Record<Segment, number> = {
  industrial: 0.92,
  residential: 0.75,
};

/** Annual output loss from panel degradation. */
const DEGRADATION = 0.005;

/** Annual grid tariff escalation — the reason payback keeps improving. */
const TARIFF_ESCALATION = 0.04;

/** Operations and maintenance, as a fraction of system cost per year. */
const OM_RATE = 0.01;

const HORIZON_YEARS = 25;

export type Inputs = {
  segment: Segment;
  market: MarketId;
  /** Monthly electricity bill in local currency. */
  monthlyBill: number;
  /** Usable roof area in square feet. */
  roofSqft: number;
  /** Residential only — add battery backup. */
  battery: boolean;
  /** Battery size in kWh when `battery` is on. */
  batteryKwh: number;
};

export type Result = {
  /** System size actually installable, in kW. */
  systemKw: number;
  /** Size the bill alone would justify, before the roof limit. */
  billLimitedKw: number;
  /** Size the roof allows. */
  roofLimitedKw: number;
  /** True when the roof, not the bill, is the binding constraint. */
  roofConstrained: boolean;
  annualGenerationKwh: number;
  grossCost: number;
  subsidyAmount: number;
  batteryCost: number;
  netCost: number;
  monthlySaving: number;
  firstYearSaving: number;
  /** Years to recover net cost. `null` if it never pays back. */
  paybackYears: number | null;
  lifetimeSaving: number;
  billBefore: number;
  billAfter: number;
  /** Tonnes of CO2 avoided per year. */
  co2TonnesPerYear: number;
  /** Year-by-year cumulative net position, for the chart. */
  cumulative: number[];
};

export function calculate(input: Inputs): Result {
  const m = MARKETS[input.market];
  const seg = input.segment;
  const tariff = m.tariff[seg];

  // What the bill implies about consumption, and therefore system size.
  const monthlyKwh = input.monthlyBill / tariff;
  const annualKwh = monthlyKwh * 12;
  const billLimitedKw = annualKwh / m.yieldPerKw;

  // The roof is a hard ceiling regardless of how big the bill is.
  const roofLimitedKw = input.roofSqft / SQFT_PER_KW;

  const systemKw = Math.max(0, Math.min(billLimitedKw, roofLimitedKw));
  const roofConstrained = roofLimitedKw < billLimitedKw;

  const annualGenerationKwh = systemKw * m.yieldPerKw;

  const grossCost = systemKw * m.costPerKw[seg];
  const subsidyAmount = grossCost * m.subsidy[seg];
  const batteryCost =
    seg === "residential" && input.battery
      ? input.batteryKwh * m.batteryCostPerKwh
      : 0;
  const netCost = grossCost - subsidyAmount + batteryCost;

  // Only self-consumed generation offsets the bill at the full retail tariff.
  // A battery lifts that share by storing what would otherwise be exported.
  const selfUse = Math.min(
    1,
    SELF_CONSUMPTION[seg] + (batteryCost > 0 ? 0.15 : 0)
  );
  const offsetKwh = Math.min(annualGenerationKwh * selfUse, annualKwh);

  const omCost = netCost * OM_RATE;
  const firstYearSaving = offsetKwh * tariff - omCost;
  const monthlySaving = firstYearSaving / 12;

  // Walk the horizon year by year: output decays, tariffs climb.
  const cumulative: number[] = [];
  let running = -netCost;
  let payback: number | null = null;

  for (let y = 1; y <= HORIZON_YEARS; y++) {
    const output = offsetKwh * Math.pow(1 - DEGRADATION, y - 1);
    const rate = tariff * Math.pow(1 + TARIFF_ESCALATION, y - 1);
    const yearSaving = output * rate - omCost;
    const before = running;
    running += yearSaving;
    cumulative.push(running);

    if (payback === null && before < 0 && running >= 0) {
      // Interpolate within the year rather than rounding to a whole one.
      payback = y - 1 + Math.abs(before) / yearSaving;
    }
  }

  const billBefore = input.monthlyBill;
  const billAfter = Math.max(0, billBefore - monthlySaving);

  return {
    systemKw,
    billLimitedKw,
    roofLimitedKw,
    roofConstrained,
    annualGenerationKwh,
    grossCost,
    subsidyAmount,
    batteryCost,
    netCost,
    monthlySaving,
    firstYearSaving,
    paybackYears: payback,
    lifetimeSaving: cumulative[cumulative.length - 1] ?? 0,
    billBefore,
    billAfter,
    // Grid emission factor of roughly 0.7 kg CO2 per kWh.
    co2TonnesPerYear: (annualGenerationKwh * 0.7) / 1000,
    cumulative,
  };
}

/* ----------------------------------------------------------- formatting */

export function money(v: number, m: Market, compact = false): string {
  const abs = Math.abs(v);

  if (compact) {
    if (m.locale === "en-IN") {
      // Indian readers expect lakh and crore, not millions.
      if (abs >= 1e7) return `${m.symbol}${(v / 1e7).toFixed(2)} Cr`;
      if (abs >= 1e5) return `${m.symbol}${(v / 1e5).toFixed(2)} L`;
    } else if (abs >= 1e6) {
      return `${m.symbol}${(v / 1e6).toFixed(2)}M`;
    } else if (abs >= 1e4) {
      return `${m.symbol}${(v / 1e3).toFixed(1)}K`;
    }
  }

  return `${m.symbol}${Math.round(v).toLocaleString(m.locale)}`;
}

export function kw(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(2)} MW`;
  return `${v.toFixed(v < 10 ? 1 : 0)} kW`;
}

export function kwh(v: number): string {
  if (v >= 1e6) return `${(v / 1e6).toFixed(2)} GWh`;
  if (v >= 1000) return `${(v / 1000).toFixed(1)} MWh`;
  return `${Math.round(v)} kWh`;
}

/** Slider bounds, per market and segment. */
export const RANGES = {
  bill: {
    industrial: { india: [50000, 2000000], gcc: [800, 40000], intl: [1000, 60000] },
    residential: { india: [1000, 25000], gcc: [40, 600], intl: [50, 800] },
  },
  roof: {
    industrial: [2000, 200000],
    residential: [200, 3000],
  },
} as const;
