// src/components/data-display/charts/CountChart.tsx
"use client";

import * as React from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer, Cell } from "recharts";
import MonoCard from "@/components/molecules/MonoCard";

type Datum = { name: string; count: number; fill?: string };

type Props = {
  /** Card title */
  title?: string;
  /** Radial data (first item treated as baseline/Total) */
  data?: Datum[];
  /** Height of the chart area inside the card */
  height?: number | string;
  /** Extra classes for the outer card */
  className?: string;
  /** Show legend below chart */
  showLegend?: boolean;
};

/** Strict monochrome defaults; can be overridden via CSS vars */
const COLOR_TOTAL = "var(--chart-total, #fafafa)";
const COLOR_RING_A = "var(--chart-a, #d9d9d9)";
const COLOR_RING_B = "var(--chart-b, #a6a6a6)";
const STROKE = "var(--chart-stroke, var(--mono-border))";

const DEFAULT_DATA: Datum[] = [
  { name: "Total", count: 106, fill: COLOR_TOTAL },
  { name: "Ticket", count: 53, fill: COLOR_RING_A },
  { name: "Teknisi", count: 53, fill: COLOR_RING_B },
];

export default function CountChart({
  title = "Ratio",
  data = DEFAULT_DATA,
  height = 240,
  className = "",
  showLegend = true,
}: Props) {
  const baseline = data[0]?.count ?? 0;

  const percent = (n: number) => {
    if (!baseline) return null;
    return Math.round((n / baseline) * 100);
  };

  // legend excludes the "Total" ring
  const segments = data.slice(1);

  return (
    <MonoCard
      className={className}
      header={
        <h2 className="text-sm font-semibold uppercase tracking-wider">
          {title}
        </h2>
      }
    >
      {/* Total */}
      <div className="mt-1 mb-2">
        <div className="text-3xl font-bold leading-none tabular-nums">
          {Number(baseline || 0).toLocaleString("id-ID")}
        </div>
        <div className="text-xs uppercase text-[var(--mono-label)]">Total</div>
      </div>

      {/* Chart */}
      <div
        className="relative w-full transition duration-200"
        style={{ height }}
      >
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={28}
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar
              dataKey="count"
              isAnimationActive={false}
              cornerRadius={0}
              background
            >
              {data.map((entry, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={entry.fill ?? COLOR_RING_A}
                  stroke={STROKE}
                  strokeWidth={1}
                />
              ))}
            </RadialBar>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="mt-3 flex justify-center gap-16">
          {segments.map((s) => {
            const pct = percent(s.count);
            return (
              <div key={s.name} className="flex flex-col items-center gap-1">
                <div
                  className="w-5 h-5 border rounded-none border-[var(--mono-border)]"
                  style={{ backgroundColor: s.fill ?? COLOR_RING_A }}
                />
                <h3 className="font-bold tabular-nums">
                  {Number(s.count || 0).toLocaleString("id-ID")}
                </h3>
                <p className="text-xs text-[var(--mono-label)]">
                  {s.name} {pct !== null ? `(${pct}%)` : ""}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </MonoCard>
  );
}
