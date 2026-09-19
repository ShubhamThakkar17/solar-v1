/**
 * All site copy — Silver Touch
 *
 * Everything the page says lives in this one file. When the real company
 * details arrive, edit here and nothing else.
 *
 * PLACEHOLDERS
 * Any figure or detail that is not yet confirmed carries `placeholder: true`.
 * That flag renders a visible dotted underline and a `data-placeholder`
 * attribute, so unverified data cannot ship unnoticed. Search this file for
 * `placeholder: true` and for `xx` to find every one of them.
 *
 * Nothing here invents certifications, client names, project counts or
 * delivered capacity — a live page carrying fabricated credentials is a real
 * liability. Market figures in `markets` are published third-party context,
 * clearly attributed, not company claims.
 */

export type Stat = {
  value: string;
  label: string;
  detail?: string;
  placeholder?: boolean;
};

export type Spec = { label: string; value: string; placeholder?: boolean };

export const COMPANY = {
  name: "Silver Touch",
  /** Split for the animated wordmark. */
  nameParts: ["Silver", "Touch"] as const,
  tagline: "Storage-first energy infrastructure",
  launch: "Full site launching 2026",
} as const;

export const CONTACT = {
  email: "xx@xx.com",
  phone: "+xx xxxxx xxxxx",
  address: "xx, xx, India",
  placeholder: true,
} as const;

/* ------------------------------------------------------------------ hero */

export const HERO = {
  badge: "Coming soon",
  headline: "Sunlight is the easy part.",
  sub: "The hard part is having it at 7pm. Silver Touch builds the storage, the plants and the hardware that make renewable power dispatchable — at utility, industrial and residential scale.",
  cta: "Get launch updates",
  scrollCue: "What we do",
} as const;

/* ----------------------------------------------------------------- stats */

export const STATS: Stat[] = [
  { value: "xx GWh", label: "Storage pipeline", detail: "Contracted and in development", placeholder: true },
  { value: "xx MW", label: "Solar commissioned", detail: "Across utility and C&I", placeholder: true },
  { value: "xx GW", label: "Annual module capacity", detail: "Owned manufacturing", placeholder: true },
  { value: "3", label: "Markets served", detail: "India · GCC · International" },
];

/* ---------------------------------------------------------- capabilities */

export type Capability = {
  id: string;
  index: string;
  title: string;
  lede: string;
  points: string[];
  /** Which end of the dual-tone this card sits at. */
  tone: "cyan" | "amber" | "mixed";
};

export const CAPABILITIES: Capability[] = [
  {
    id: "bess",
    index: "01",
    title: "Battery Energy Storage",
    lede: "Our lead discipline. Grid-scale and behind-the-meter storage engineered end to end — cells and racks, conversion and transformers, controls, thermal management and fire safety as one system rather than a bill of parts.",
    points: [
      "Utility-scale standalone storage",
      "Solar-plus-storage hybrids",
      "C&I peak shaving and backup",
      "Grid services and frequency response",
    ],
    tone: "cyan",
  },
  {
    id: "epc",
    index: "02",
    title: "Engineering, Procurement & Construction",
    lede: "Single-point delivery from feasibility to commissioning — one contract, one accountable team, one performance guarantee. Then O&M that holds that performance across the life of the asset.",
    points: [
      "Feasibility, yield modelling and design",
      "Procurement, logistics and vendor management",
      "Construction, testing and commissioning",
      "O&M and long-term asset management",
    ],
    tone: "amber",
  },
  {
    id: "manufacturing",
    index: "03",
    title: "Manufacturing",
    lede: "In-house production of modules, storage enclosures and balance-of-system hardware. Owning the line means quality and lead times stay ours to control instead of someone else's to promise.",
    points: [
      "Photovoltaic modules",
      "Battery enclosures, racks and integration",
      "Mounting structures and balance-of-system",
      "In-line testing and quality assurance",
    ],
    tone: "mixed",
  },
];

/* --------------------------------------------------------- bess showcase */

export const BESS = {
  eyebrow: "Storage, in operation",
  headline: "Watch a day pass through the system.",
  sub: "Midday surplus charges the array. The evening peak discharges it. Drag the timeline — the cell array, state of charge, thermal profile and power flow all respond the way a real dispatch cycle does.",
  note: "Illustrative dispatch model. Behaviour is representative of a solar-coupled LFP system, not a specific installed project.",
  specs: [
    { label: "Rated energy", value: "xx MWh", placeholder: true },
    { label: "Rated power", value: "xx MW", placeholder: true },
    { label: "Round-trip efficiency", value: "xx %", placeholder: true },
    { label: "Response time", value: "< 1 s" },
    { label: "Cell chemistry", value: "LFP" },
    { label: "Augmentation", value: "Year xx", placeholder: true },
  ] as Spec[],
  /** Labels for the three dispatch states. */
  modes: {
    charge: { label: "Charging", hint: "Solar surplus into the array" },
    idle: { label: "Standby", hint: "Holding state of charge" },
    discharge: { label: "Discharging", hint: "Array into evening peak" },
  },
} as const;

/* ------------------------------------------------------------------- epc */

export const EPC = {
  eyebrow: "Delivery",
  headline: "Five stages. One accountable team.",
  sub: "Split delivery across vendors and the gaps between them become your problem. We hold the whole chain, so the performance number at the end is the one we signed up to.",
  stages: [
    { n: "01", title: "Engineer", body: "Site assessment, yield and storage modelling, single-line design, grid studies and approvals." },
    { n: "02", title: "Procure", body: "Specification, vendor qualification, contracting and logistics — with our own manufacturing in the mix." },
    { n: "03", title: "Construct", body: "Civil, mechanical and electrical execution under a single site organisation and one safety regime." },
    { n: "04", title: "Commission", body: "Testing, grid synchronisation, performance verification and handover against contracted metrics." },
    { n: "05", title: "Operate", body: "Monitoring, preventive maintenance, performance analytics and augmentation planning." },
  ],
} as const;

/* --------------------------------------------------------- manufacturing */

export const MANUFACTURING = {
  eyebrow: "Made in-house",
  headline: "We'd rather own the line than argue with it.",
  sub: "Manufacturing modules, enclosures and balance-of-system ourselves removes the two things that derail renewable projects most often: lead times we cannot influence and quality we cannot inspect.",
  points: [
    { title: "Control the schedule", body: "Production slots we allocate ourselves, not ones we queue for." },
    { title: "Control the spec", body: "In-line testing against our own thresholds, traceable to the batch." },
    { title: "Control the cost", body: "One margin in the stack instead of three, and no surprise escalations." },
  ],
} as const;

/* -------------------------------------------------------------- segments */

export type Segment = {
  id: string;
  kicker: string;
  title: string;
  body: string;
  bullets: string[];
  imageKey: "solarField" | "industrialRoof" | "residentialStreet";
};

export const SEGMENTS: Segment[] = [
  {
    id: "utility",
    kicker: "Utility scale",
    title: "Plants and storage that answer to the grid",
    body: "Large-scale solar and standalone or co-located storage, built to dispatch against a schedule and hold up under grid-code scrutiny.",
    bullets: ["Ground-mount solar plants", "Standalone and co-located BESS", "Substation and evacuation works", "Grid compliance and studies"],
    imageKey: "solarField",
  },
  {
    id: "ci",
    kicker: "Commercial & industrial",
    title: "Cheaper units, and the lights stay on",
    body: "Rooftop, ground-mount and carport generation paired with storage that shaves demand charges and carries critical load through an outage.",
    bullets: ["Rooftop and carport solar", "Peak shaving and demand management", "Backup and power quality", "Open access and captive structures"],
    imageKey: "industrialRoof",
  },
  {
    id: "residential",
    kicker: "Residential",
    title: "A quieter, cheaper roof",
    body: "Home solar with optional battery backup — designed, installed and maintained by the same people who build our grid-scale projects.",
    bullets: ["Rooftop systems and design", "Home battery backup", "Net metering and subsidy support", "Monitoring and maintenance"],
    imageKey: "residentialStreet",
  },
];

/* --------------------------------------------------------------- markets */

export const MARKETS = {
  eyebrow: "Where we work",
  headline: "Three markets, one engineering standard.",
  sub: "Engineering depth built in India, delivered into the Gulf and international markets — with the same design discipline applied whichever grid code it has to satisfy.",
  regions: [
    {
      name: "India",
      body: "Utility-scale storage, C&I generation and residential rooftop, with the regulatory and interconnection work that comes with each.",
      /** Published third-party market context — attributed, not a company claim. */
      context:
        "India's storage build-out is moving from pilot to programme: operational BESS capacity is projected to reach around 5 GWh in 2026, up from roughly 507 MWh in 2025, supported by viability gap funding covering 43.2 GWh.",
      source: "Industry market reporting, 2026",
    },
    {
      name: "GCC",
      body: "Utility-scale photovoltaic plants paired with storage for IPP and tender-led programmes, engineered for high-irradiance, high-temperature operation.",
      context:
        "Sustained high ambient temperatures make thermal management and augmentation planning decisive for storage economics in the region.",
      source: null,
    },
    {
      name: "International",
      body: "Commercial, industrial and distributed projects delivered with partners, using the same design and quality standard as our domestic work.",
      context: null,
      source: null,
    },
  ],
} as const;

/* ------------------------------------------------------------ calculator */

export const CALCULATOR = {
  eyebrow: "Savings calculator",
  headline: "See what your roof is worth.",
  industrial: {
    tab: "Industrial & commercial",
    sub: "Enter your monthly electricity spend and the roof or ground area you can use. We'll size the plant, price it, and show you the payback — including the point where the roof, not the bill, becomes the limit.",
    billLabel: "Monthly electricity bill",
    roofLabel: "Usable roof / ground area",
  },
  residential: {
    tab: "Residential",
    sub: "Enter your monthly bill and roof area to see the system size, what it costs after incentives, and how long it takes to pay for itself. Add a battery to see what backup does to the numbers.",
    billLabel: "Monthly electricity bill",
    roofLabel: "Usable roof area",
  },
  disclaimer:
    "Indicative estimate only — not a quote. Figures come from the documented default assumptions shown above, which are ordinary public ranges for each market rather than Silver Touch pricing, and they exclude site-specific factors such as shading, roof condition, structural work, sanctioned load and interconnection cost. A real proposal follows a site assessment.",
} as const;

/* ---------------------------------------------------------------- notify */

export const NOTIFY = {
  eyebrow: "Stay in the loop",
  headline: "The full site is on its way.",
  sub: "Project references, technical documentation and the full capability set are being prepared. Leave an address and we'll tell you when it's live.",
  placeholderText: "you@company.com",
  cta: "Notify me",
  success: "You're on the list. We'll be in touch.",
  /** No backend yet — see the note in Notify.tsx. */
  disclaimer: "No backend is wired up yet, so nothing is transmitted or stored.",
} as const;

/* ---------------------------------------------------------------- footer */

export const FOOTER = {
  blurb: "Battery energy storage, solar EPC and manufacturing — engineered as one system.",
  columns: [
    { title: "Capabilities", links: ["Battery Energy Storage", "Solar EPC", "Manufacturing", "Operations & Maintenance"] },
    { title: "Segments", links: ["Utility scale", "Commercial & industrial", "Residential"] },
    { title: "Company", links: ["About", "Projects", "Careers", "Contact"] },
  ],
  legal: "All figures shown with a dotted underline are placeholders pending confirmation.",
} as const;

/* ------------------------------------------------------------------- nav */

export const NAV_LINKS = [
  { label: "What we do", href: "#capabilities" },
  { label: "Storage", href: "#bess" },
  { label: "Calculator", href: "#calculator" },
  { label: "Delivery", href: "#epc" },
  { label: "Segments", href: "#segments" },
  { label: "Markets", href: "#markets" },
] as const;
