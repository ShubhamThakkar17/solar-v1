# Image credits

All photographs are from [Unsplash](https://unsplash.com) and used under the
[Unsplash License](https://unsplash.com/license): free for commercial use, no
permission or attribution required. Credit is recorded here anyway as good
practice, and because it makes the set auditable.

Images are served from the Unsplash CDN rather than committed to this repo —
see the *Images* section of [README.md](README.md).

## Verification

Every photo below was checked for its **native** pixel dimensions against the
CDN metadata endpoint before being used:

```bash
curl -s "https://images.unsplash.com/<photo-id>?fm=json"
```

All are 4K or larger on the long edge; none are upscaled. Delivery URLs include
`fit=max`, which prevents the CDN upscaling past the native size.

| Used for | Photo ID | Native |
|---|---|---|
| Hero — building clad in PV | `photo-1764885519082-68398601112f` | 5438 × 3625 |
| Utility-scale — aerial farm | `photo-1680355065203-43ad84bb6e69` | 8649 × 5200 |
| Utility-scale — solar field | `photo-1509391366360-2e959784a276` | 6144 × 4088 |
| Aerial field | `photo-1497435334941-8c899ee9e8e9` | 3992 × 2992 |
| Panel row | `photo-1502637098811-fa9526d2b659` | 4000 × 2250 |
| EPC — substation | `photo-1780396140802-52309c205050` | 6012 × 4008 |
| EPC — substation approach | `photo-1764046847046-f518d367f5e9` | 6305 × 4181 |
| Manufacturing — machine | `photo-1717386255773-1e3037c81788` | 6000 × 4002 |
| Manufacturing — floor | `photo-1717386255767-52643970d483` | 6000 × 4002 |
| Manufacturing — assembly | `photo-1668097613572-40b7c11c8727` | 8192 × 5464 |
| C&I — industrial roof | `photo-1713544123580-12096cc9eb12` | 4080 × 2394 |
| C&I — sawtooth roof | `photo-1775317776711-ef4a57017181` | 5168 × 3448 |
| C&I — solar carport | `photo-1726866492047-7f9516558c6e` | 5129 × 3190 |
| Residential — street | `photo-1761472823286-9f6093ed6663` | 6720 × 4480 |
| Residential — building | `photo-1655300283247-6b1924b1d152` | 3936 × 2216 |

Any photo's page is at `https://unsplash.com/photos/<photo-id>`.

## Why the BESS visuals are drawn, not photographed

The battery storage section uses hand-built animated SVG rather than
photography. Searches across Unsplash and Pexels for grid-scale BESS imagery
return consumer batteries, power banks, EV chargers and 3D render clip-art —
there is effectively no credible free-stock photography of utility-scale
battery containers.

Since storage is the lead business line, a generic battery photo there would
undercut the page. The vector approach is also sharp at any resolution, takes
the brand colour exactly, carries no licensing risk, and is what makes the
section interactive.
