/**
 * Image catalogue — Silver Touch
 *
 * Every photo below was verified against the Unsplash CDN metadata endpoint
 * (`https://images.unsplash.com/<id>?fm=json`) for its NATIVE pixel size.
 * All are 4K+ on the long edge; none are upscaled.
 *
 * Delivery is direct from the Unsplash CDN (imgix) with a hand-built srcset,
 * so phones pull ~640px and retina desktops pull the full 3840px. `fit=max`
 * is load-bearing: without it imgix will happily upscale past the native
 * size and you get a soft image that claims to be 4K.
 *
 * Licence: Unsplash Licence — free for commercial use, no attribution
 * required. Credits are recorded in CREDITS.md as good practice.
 *
 * To self-host instead of hotlinking, change `srcFor()` to point at
 * `/images/<id>.jpg` and drop the files into `public/images/`.
 */

const CDN = "https://images.unsplash.com";

/** Widths offered in every srcset. */
const WIDTHS = [640, 1280, 1920, 2560, 3840] as const;

export type Img = {
  /** Unsplash photo id. */
  id: string;
  /** Native pixel dimensions, as verified. */
  native: [number, number];
  /** Descriptive alt text. Written for screen readers, not for SEO stuffing. */
  alt: string;
  /** Average colour, used as the pre-load background so there is no flash. */
  tone: string;
};

/** Single URL at a given width. */
export function srcFor(img: Img, width: number): string {
  return `${CDN}/${img.id}?w=${width}&q=80&fm=jpg&fit=max&auto=format`;
}

/** Full responsive srcset string, capped at the image's native width. */
export function srcSetFor(img: Img): string {
  return WIDTHS.filter((w) => w <= img.native[0])
    .map((w) => `${srcFor(img, w)} ${w}w`)
    .join(", ");
}

/** Aspect ratio as a CSS-friendly number. */
export function ratioOf(img: Img): number {
  return img.native[0] / img.native[1];
}

/* -------------------------------------------------------------------------
   The catalogue
------------------------------------------------------------------------- */

export const IMAGES = {
  /**
   * Hero — 5438x3625. A modern building clad in photovoltaic panels against
   * a bright sky. Chosen over the previous aerial farm because the light
   * palette needs a bright, airy plate, and this one reads commercial rather
   * than generic stock.
   */
  hero: {
    id: "photo-1764885519082-68398601112f",
    native: [5438, 3625],
    alt: "A modern multi-storey building clad in photovoltaic panels, photographed from below against a bright blue sky.",
    tone: "#8fb6d4",
  },

  /** Kept as the deep-field plate for the utility-scale band — 8649x5200. */
  aerialFarm: {
    id: "photo-1680355065203-43ad84bb6e69",
    native: [8649, 5200],
    alt: "Aerial view of a large solar farm, long rows of photovoltaic panels receding across open ground.",
    tone: "#1b2430",
  },

  /** Utility-scale segment — 6144x4088. */
  solarField: {
    id: "photo-1509391366360-2e959784a276",
    native: [6144, 4088],
    alt: "Rows of solar panels across a green field under an open sky.",
    tone: "#22303a",
  },

  /** Secondary aerial, used in the markets band — 3992x2992. */
  aerialField: {
    id: "photo-1497435334941-8c899ee9e8e9",
    native: [3992, 2992],
    alt: "Aerial photograph of blue solar panels laid out across grassland.",
    tone: "#2a3b34",
  },

  /** Close texture shot — 4000x2250. */
  panelRow: {
    id: "photo-1502637098811-fa9526d2b659",
    native: [4000, 2250],
    alt: "Close landscape view along a row of blue photovoltaic panels.",
    tone: "#1d2a38",
  },

  /** EPC lead — 6012x4008. */
  substation: {
    id: "photo-1780396140802-52309c205050",
    native: [6012, 4008],
    alt: "Electrical substation with transformers and overhead power lines against a blue sky.",
    tone: "#28323f",
  },

  /** EPC secondary — 6305x4181. */
  substationApproach: {
    id: "photo-1764046847046-f518d367f5e9",
    native: [6305, 4181],
    alt: "A paved service road leading toward a grid substation.",
    tone: "#2c3540",
  },

  /** Manufacturing lead — 6000x4002. */
  factoryMachine: {
    id: "photo-1717386255773-1e3037c81788",
    native: [6000, 4002],
    alt: "Large automated production machine on a manufacturing floor.",
    tone: "#2f3540",
  },

  /** Manufacturing wide — 6000x4002. */
  factoryFloor: {
    id: "photo-1717386255767-52643970d483",
    native: [6000, 4002],
    alt: "Factory interior with rows of production machinery.",
    tone: "#2b313b",
  },

  /** Manufacturing detail — 8192x5464. */
  panelAssembly: {
    id: "photo-1668097613572-40b7c11c8727",
    native: [8192, 5464],
    alt: "A technician working on a solar photovoltaic panel.",
    tone: "#243040",
  },

  /** C&I lead — 4080x2394. */
  industrialRoof: {
    id: "photo-1713544123580-12096cc9eb12",
    native: [4080, 2394],
    alt: "A large industrial rooftop covered with solar panels.",
    tone: "#31383f",
  },

  /** C&I secondary — 5168x3448. */
  sawtoothRoof: {
    id: "photo-1775317776711-ef4a57017181",
    native: [5168, 3448],
    alt: "Industrial building with sawtooth roof sections carrying solar panels.",
    tone: "#39414a",
  },

  /** C&I carport — 5129x3190. */
  solarCarport: {
    id: "photo-1726866492047-7f9516558c6e",
    native: [5129, 3190],
    alt: "Aerial view of a car park roofed with solar panel canopies.",
    tone: "#343b44",
  },

  /** Residential lead — 6720x4480. */
  residentialStreet: {
    id: "photo-1761472823286-9f6093ed6663",
    native: [6720, 4480],
    alt: "A suburban neighbourhood of houses with rooftop solar panels.",
    tone: "#3a4048",
  },

  /** Residential secondary — 3936x2216. */
  residentialBuilding: {
    id: "photo-1655300283247-6b1924b1d152",
    native: [3936, 2216],
    alt: "A modern residential building fitted with solar panels.",
    tone: "#333a43",
  },
} satisfies Record<string, Img>;

export type ImageKey = keyof typeof IMAGES;
