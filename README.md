# Silver Touch — coming-soon landing page

A scroll-animated, single-page site for **Silver Touch**, a storage-first solar
company working across battery energy storage (BESS), solar EPC, and
manufacturing, for utility, commercial/industrial and residential customers in
India, the GCC and international markets.

This is **phase 1 of the real site**, not a throwaway holding page: it becomes
the home page once `/about`, `/projects`, `/bess` are added.

---

## ⚠️ Before this goes live

Real company details do not exist yet. The page ships with placeholders, and
every unverified figure is marked so it cannot go out unnoticed.

**Anything with a dotted underline is a placeholder.** They also carry a
`data-placeholder="true"` attribute, so you can find them all in the browser:

```js
document.querySelectorAll('[data-placeholder="true"]')
```

To replace them, edit **[`lib/content.ts`](lib/content.ts)** — search for `xx`
and for `placeholder: true`. That file holds every word on the page.

Nothing in this repo invents certifications, client names, project counts or
delivered capacity. The market figures in `MARKETS` are published third-party
context and are attributed as such on the page — they are not company claims.

The **savings calculator** assumptions in
[`lib/savings.ts`](lib/savings.ts) are ordinary public ranges for each market,
chosen so the output is plausible. **They are not Silver Touch pricing.**
Replace them with signed-off numbers before launch.

The **email capture has no backend**. It validates and shows a success state
but transmits nothing, and the page says so. Wire it to Formspree, Resend or
your CRM when you pick one.

---

## Running it

```bash
npm install && npm run dev
```

Then open http://localhost:3000.

```bash
npm run build
```

Produces a fully static site in `out/` — deployable to Vercel, Netlify, S3,
nginx or any static host.

---

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, `output: 'export'`) |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion + Lenis smooth scroll |
| Fonts | Space Grotesk (display), Inter (body), JetBrains Mono (data) |

---

## The two files you'll actually edit

| File | Holds |
|---|---|
| **`lib/content.ts`** | Every word on the page, and every `xx` placeholder |
| **`lib/images.ts`** | Every photograph |

---

## How a few things work

### Dual-tone accent

Amber marks the solar/EPC side of the business, cyan marks BESS/storage. Rather
than switching colour abruptly per section, a single registered CSS custom
property `--accent` is **interpolated** as you scroll, so the page warms and
cools as one continuous gesture.

Sections declare their tone with `data-tone="amber" | "cyan" | "mixed"`;
[`components/AccentDriver.tsx`](components/AccentDriver.tsx) sets the matching
attribute on `:root` and the browser does the interpolation on the compositor.

Registering `--accent` via `@property` is what makes it transitionable — an
unregistered custom property would snap between values instead of blending.

Each accent has two values: a vibrant one for **graphics** and a darker `-ink`
one for **text**, because the vibrant amber only reaches ~3.9:1 on white and
small copy needs 4.5:1.

### BESS dispatch model

[`lib/dispatch.ts`](lib/dispatch.ts) drives the interactive storage panel —
cell array, state-of-charge curve, thermal map and single-line diagram all read
from it, so they can never disagree with each other.

**Power is the primary quantity and state of charge is its integral.** Doing it
the other way round (keyframed SOC, differentiated to get power) produces a
power curve that oscillates, because each interpolated segment's slope returns
to zero at every keyframe — you get one spurious hump per segment instead of
one charge and one discharge.

The charge and discharge bells are balanced analytically so the day closes:
SOC returns to within 0.05% of where it started at midnight, which matters
because the animation loops. Power is normalised rather than clamped, since
clamping would flat-top the discharge and destroy that balance.

### Images

Photographs are served straight from the Unsplash CDN with hand-built srcsets
(640/1280/1920/2560/3840), so phones pull ~640px and retina desktops pull the
full 4K. Every photo was verified for **native** resolution via the CDN's
metadata endpoint — see [`CREDITS.md`](CREDITS.md).

`fit=max` in the URL is load-bearing: without it the CDN will happily upscale
past the native size and you get a soft image that claims to be 4K.

To self-host instead of hotlinking, change `srcFor()` in `lib/images.ts` to
point at `/images/<id>.jpg` and drop the files into `public/images/`.

### Reduced motion

`prefers-reduced-motion` is honoured throughout: Lenis is not initialised at
all, transforms collapse to plain cross-fades, the dispatch animation holds a
static composed state, and the CSS flow animation stops.

---

## Layout

```
app/
  layout.tsx            fonts, metadata, OG tags
  page.tsx              composes the sections in scroll order
  globals.css           design tokens + custom controls
components/
  Nav · Hero · StatsBar · Capabilities · BessShowcase
  EpcProcess · Manufacturing · Segments · Markets
  SavingsCalculator · Notify · Footer
  AccentDriver · SmoothScroll · Photo · Reveal
  viz/                  CellArray · SocCurve · ThermalMap · SingleLine
lib/
  content.ts            all copy + placeholders
  images.ts             verified image catalogue
  dispatch.ts           BESS dispatch model
  savings.ts            savings calculator model
  motion.ts             shared easing and variants
```
