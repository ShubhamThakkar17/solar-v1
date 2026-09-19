"use client";

import { type Mode } from "@/lib/dispatch";

const W = 640;
const H = 210;

const BUS_Y = 72;
const BESS_Y = 158;

type NodeSpec = { x: number; y: number; w: number; label: string; sub: string };

const NODES: Record<string, NodeSpec> = {
  pv: { x: 24, y: BUS_Y - 22, w: 96, label: "PV", sub: "array" },
  pcs: { x: 212, y: BUS_Y - 22, w: 96, label: "PCS", sub: "conversion" },
  xfmr: { x: 372, y: BUS_Y - 22, w: 96, label: "XFMR", sub: "step-up" },
  grid: { x: 520, y: BUS_Y - 22, w: 96, label: "GRID", sub: "export" },
  bess: { x: 212, y: BESS_Y - 22, w: 96, label: "BESS", sub: "storage" },
};

function Block({ n, live }: { n: NodeSpec; live: boolean }) {
  return (
    <g>
      <rect
        x={n.x}
        y={n.y}
        width={n.w}
        height={44}
        rx={5}
        fill={live ? "rgb(15 163 196 / 0.10)" : "#FFFFFF"}
        stroke={live ? "#0FA3C4" : "#C6D3E0"}
        strokeWidth={live ? 1.2 : 1}
        className="transition-all duration-500"
      />
      <text
        x={n.x + n.w / 2}
        y={n.y + 20}
        textAnchor="middle"
        className="font-mono transition-colors duration-500"
        style={{ fontSize: 11, fill: live ? "#0A6780" : "#4F5D6E", letterSpacing: "0.1em" }}
      >
        {n.label}
      </text>
      <text
        x={n.x + n.w / 2}
        y={n.y + 33}
        textAnchor="middle"
        className="font-mono"
        style={{ fontSize: 8, fill: "#8494A5", letterSpacing: "0.08em" }}
      >
        {n.sub}
      </text>
    </g>
  );
}

/** A conductor. `flow` of 0 is dead, 1 flows forward, -1 flows backward. */
function Line({ d, flow }: { d: string; flow: -1 | 0 | 1 }) {
  return (
    <g>
      <path d={d} fill="none" stroke="#C6D3E0" strokeWidth="1.5" />
      {flow !== 0 && (
        <path
          d={d}
          fill="none"
          stroke="#0FA3C4"
          strokeWidth="1.8"
          strokeDasharray="7 11"
          className="sld-flow"
          style={{ animationDirection: flow === 1 ? "normal" : "reverse" }}
        />
      )}
    </g>
  );
}

/**
 * Single-line diagram.
 *
 * Charging pushes solar through the converter and down into the battery;
 * discharging pulls it back up and out through the transformer to the grid.
 * The conductors that are not carrying power stay grey, so the active path is
 * readable at a glance.
 */
export default function SingleLine({ mode }: { mode: Mode }) {
  const charging = mode === "charge";
  const discharging = mode === "discharge";

  // PV feeds the converter while the sun is up (i.e. while charging).
  const pvFlow: -1 | 0 | 1 = charging ? 1 : 0;
  // Vertical stub: down into the battery, up out of it.
  const bessFlow: -1 | 0 | 1 = charging ? 1 : discharging ? -1 : 0;
  // Export path only carries power on discharge.
  const exportFlow: -1 | 0 | 1 = discharging ? 1 : 0;

  const seg = (a: NodeSpec, b: NodeSpec) =>
    `M${a.x + a.w},${BUS_Y} L${b.x},${BUS_Y}`;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-baseline justify-between">
        <span className="font-mono text-[10px] tracking-[0.18em] text-muted-2 uppercase">
          Power flow
        </span>
        <span
          className="font-mono text-[10px] tracking-[0.12em] transition-colors duration-500"
          style={{ color: mode === "idle" ? "#8494A5" : "#0A6780" }}
        >
          {charging ? "SOLAR → STORAGE" : discharging ? "STORAGE → GRID" : "NO EXPORT"}
        </span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-full w-full flex-1"
        role="img"
        aria-label={`Single line diagram, currently ${
          charging ? "charging from solar" : discharging ? "discharging to grid" : "on standby"
        }`}
      >
        {/* Conductors, drawn under the blocks */}
        <Line d={seg(NODES.pv, NODES.pcs)} flow={pvFlow} />
        <Line d={seg(NODES.pcs, NODES.xfmr)} flow={exportFlow} />
        <Line d={seg(NODES.xfmr, NODES.grid)} flow={exportFlow} />
        <Line
          d={`M${NODES.pcs.x + NODES.pcs.w / 2},${BUS_Y + 22} L${
            NODES.pcs.x + NODES.pcs.w / 2
          },${BESS_Y - 22}`}
          flow={bessFlow}
        />

        <Block n={NODES.pv} live={charging} />
        <Block n={NODES.pcs} live={mode !== "idle"} />
        <Block n={NODES.xfmr} live={discharging} />
        <Block n={NODES.grid} live={discharging} />
        <Block n={NODES.bess} live={mode !== "idle"} />
      </svg>
    </div>
  );
}
