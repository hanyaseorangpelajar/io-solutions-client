// src/components/data-display/charts/CountChart.tsx
"use client";

import * as React from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer, Cell } from "recharts";

// Gunakan CSS variables (fallback ke warna lama)
const COLOR_TOTAL = "var(--chart-total, #FFFFFF)";
const COLOR_TICKET = "var(--chart-a, #FEE715)";
const COLOR_TEKNISI = "var(--chart-b, #101820)";
const STROKE = "var(--mono-border, #000)";

type Datum = { name: string; count: number; fill?: string };

type Props = {
  /** Title kartu */
  title?: string;
  /** Data radial (Item pertama dianggap baseline/Total untuk persentase) */
  data?: Datum[];
  /** Tinggi chart container */
  height?: number | string;
  /** ClassName tambahan untuk wrapper kartu */
  className?: string;
};

const DEFAULT_DATA: Datum[] = [
  { name: "Total", count: 106, fill: COLOR_TOTAL },
  { name: "Ticket", count: 53, fill: COLOR_TICKET },
  { name: "Teknisi", count: 53, fill: COLOR_TEKNISI },
];

export default function CountChart({
  title = "Ratio",
  data = DEFAULT_DATA,
  height = "50%", // tinggi area chart di dalam kartu
  className = "",
}: Props) {
  const baseline = data[0]?.count ?? 0;

  const percent = (n: number) => {
    if (!baseline) return null;
    return Math.round((n / baseline) * 100);
  };

  // legend: abaikan ring "Total"
  const segments = data.slice(1);

  return (
    <section
      className={`w-full h-full p-4 border rounded-none
                  bg-[var(--mono-bg)] text-[var(--mono-fg)] border-[var(--mono-border)]
                  ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      {/* Total */}
      <div className="mt-2 mb-2">
        <div className="text-3xl font-bold leading-none">
          {baseline.toLocaleString("id-ID")}
        </div>
        <div className="text-xs uppercase">Total</div>
      </div>

      {/* Chart */}
      <div className="relative w-full" style={{ height }}>
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
                  fill={entry.fill ?? COLOR_TICKET}
                  stroke={STROKE}
                  strokeWidth={1}
                />
              ))}
            </RadialBar>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-3 flex justify-center gap-16">
        {segments.map((s) => {
          const pct = percent(s.count);
          return (
            <div key={s.name} className="flex flex-col items-center gap-1">
              <div
                className="w-5 h-5 border rounded-none border-[var(--mono-border)]"
                style={{ backgroundColor: s.fill ?? COLOR_TICKET }}
              />
              <h3 className="font-bold">{s.count.toLocaleString("id-ID")}</h3>
              <p className="text-xs">
                {s.name} {pct !== null ? `(${pct}%)` : ""}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
