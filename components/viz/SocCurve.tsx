"use client";

import { useMemo } from "react";
import { socAt, powerAt, formatHour } from "@/lib/dispatch";

const W = 560;
const H = 220;
const PAD = { t: 16, r: 14, b: 26, l: 30 };

const x = (h: number) => PAD.l + (h / 24) * (W - PAD.l - PAD.r);
const y = (v: number) => PAD.t + (1 - v) * (H - PAD.t - PAD.b);

/**
 * State of charge across the day, with power drawn behind it as a signed
 * area — above the midline is discharge to the grid, below is charge from
 * solar. The playhead is the current hour.
 */
export default function SocCurve({ hour }: { hour: number }) {
  const { socPath, chargeArea, dischargeArea } = useMemo(() => {
    const steps = 240;
    const pts: [number, number][] = [];
    for (let i = 0; i <= steps; i++) {
      const h = (i / steps) * 24;
      pts.push([x(h), y(socAt(h))]);
    }
    const socPath = pts
      .map(([px, py], i) => `${i === 0 ? "M" : "L"}${px.toFixed(2)},${py.toFixed(2)}`)
      .join(" ");

    // Power ribbon, drawn around the vertical midline.
    const mid = y(0.5);
    const amp = (H - PAD.t - PAD.b) * 0.42;
    const build = (sign: 1 | -1) => {
      let d = `M${x(0)},${mid}`;
      for (let i = 0; i <= steps; i++) {
        const h = (i / steps) * 24;
        const p = powerAt(h);
        const v = sign > 0 ? Math.max(0, p) : Math.min(0, p);
        d += ` L${x(h).toFixed(2)},${(mid - v * amp).toFixed(2)}`;
      }
      d += ` L${x(24)},${mid} Z`;
      return d;
    };

    return { socPath, dischargeArea: build(1), chargeArea: build(-1) };
  }, []);

  const px = x(hour);
  const py = y(socAt(hour));

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-baseline justify-between">
        <span className="font-mono text-[10px] tracking-[0.18em] text-muted-2 uppercase">
          24-hour dispatch
        </span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted-2">
            <span className="h-px w-3 bg-[#0FA3C4]" /> SOC
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted-2">
            <span className="h-1.5 w-3 rounded-sm bg-[#E8890B]/45" /> Power
          </span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-full w-full flex-1"
        preserveAspectRatio="none"
        role="img"
        aria-label={`State of charge ${Math.round(socAt(hour) * 100)} percent at ${formatHour(hour)}`}
      >
        <defs>
          <linearGradient id="socFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0FA3C4" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#0FA3C4" stopOpacity="0" />
          </linearGradient>
          <clipPath id="past">
            <rect x="0" y="0" width={px} height={H} />
          </clipPath>
        </defs>

        {/* Horizontal gridlines at 0 / 50 / 100% */}
        {[0, 0.5, 1].map((v) => (
          <g key={v}>
            <line
              x1={PAD.l}
              x2={W - PAD.r}
              y1={y(v)}
              y2={y(v)}
              stroke="#E1E9F1"
              strokeDasharray={v === 0.5 ? "2 4" : undefined}
            />
            <text
              x={PAD.l - 7}
              y={y(v) + 3}
              textAnchor="end"
              className="fill-[#8494A5] font-mono"
              style={{ fontSize: 8.5 }}
            >
              {v * 100}
            </text>
          </g>
        ))}

        {/* Hour ticks every 6h */}
        {[0, 6, 12, 18, 24].map((h) => (
          <text
            key={h}
            x={x(h)}
            y={H - 8}
            textAnchor="middle"
            className="fill-[#8494A5] font-mono"
            style={{ fontSize: 8.5 }}
          >
            {String(h % 24).padStart(2, "0")}
          </text>
        ))}

        {/* Power ribbon */}
        <path d={dischargeArea} fill="#E8890B" fillOpacity="0.16" />
        <path d={chargeArea} fill="#0FA3C4" fillOpacity="0.14" />

        {/* SOC: full curve dimmed, elapsed portion bright */}
        <path d={socPath} fill="none" stroke="#0FA3C4" strokeOpacity="0.22" strokeWidth="1.5" />
        <g clipPath="url(#past)">
          <path d={`${socPath} L${x(24)},${y(0)} L${x(0)},${y(0)} Z`} fill="url(#socFill)" />
          <path d={socPath} fill="none" stroke="#0FA3C4" strokeWidth="2" />
        </g>

        {/* Playhead */}
        <line x1={px} x2={px} y1={PAD.t} y2={H - PAD.b} stroke="#0A6780" strokeOpacity="0.4" />
        <circle cx={px} cy={py} r="8" fill="#0FA3C4" fillOpacity="0.18" />
        <circle cx={px} cy={py} r="3.5" fill="#0A6780" />
      </svg>
    </div>
  );
}
