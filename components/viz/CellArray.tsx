"use client";

import { type Mode } from "@/lib/dispatch";

const COLS = 14;
const ROWS = 6;
const TOTAL = COLS * ROWS;

/**
 * The rack: 84 cells that fill in series with state of charge.
 *
 * Cells fill column by column from the left. The single cell straddling the
 * charge front is drawn partially filled and pulses while current is flowing,
 * which is what makes the array read as *moving* rather than just coloured in.
 */
export default function CellArray({
  soc,
  mode,
}: {
  soc: number;
  mode: Mode;
}) {
  const filled = soc * TOTAL;
  const active = mode !== "idle";

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-baseline justify-between">
        <span className="font-mono text-[10px] tracking-[0.18em] text-muted-2 uppercase">
          Cell array
        </span>
        <span className="font-mono text-[10px] tracking-[0.12em] text-muted-2">
          {TOTAL} × modules
        </span>
      </div>

      <div
        className="grid flex-1 gap-[3px]"
        style={{
          gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
          gridAutoFlow: "column",
        }}
        role="img"
        aria-label={`Battery cell array at ${Math.round(soc * 100)} percent state of charge`}
      >
        {Array.from({ length: TOTAL }, (_, i) => {
          // Fraction of THIS cell that is charged: 1 fully, 0 empty,
          // fractional only for the cell on the charge front.
          const level = Math.max(0, Math.min(1, filled - i));
          const isFront = level > 0 && level < 1;

          return (
            <div
              key={i}
              className="relative overflow-hidden rounded-[2px] bg-[#E3EAF2]"
            >
              <div
                className="absolute inset-x-0 bottom-0 transition-[height] duration-500 ease-out"
                style={{
                  // Rounded before it reaches the DOM: a raw float is written
                  // back at lower precision and hydration reports a mismatch.
                  height: `${(level * 100).toFixed(2)}%`,
                  background:
                    level > 0
                      ? "linear-gradient(to top, #0891B2, #0FA3C4)"
                      : "transparent",
                  opacity: isFront && active ? 0.85 : 1,
                }}
              />
              {isFront && active && (
                <div
                  className="absolute inset-0 animate-pulse"
                  style={{
                    background:
                      "linear-gradient(to top, transparent, rgb(15 163 196 / 0.5))",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="font-mono text-[10px] tracking-[0.12em] text-muted-2">
          {Math.round(soc * TOTAL)} / {TOTAL} charged
        </span>
        <span
          className="font-mono text-[10px] tracking-[0.12em]"
          style={{ color: active ? "#0A6780" : "#8494A5" }}
        >
          {active ? "CURRENT FLOWING" : "AT REST"}
        </span>
      </div>
    </div>
  );
}
