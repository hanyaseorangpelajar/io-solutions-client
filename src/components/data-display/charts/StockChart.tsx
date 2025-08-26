// src/components/data-display/charts/StockChart.tsx
"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Row = { name: string; present: number; absent: number };

type Props = {
  title?: string;
  data?: Row[];
  barSize?: number; // default 20
  className?: string;
};

const DEFAULT_DATA: Row[] = [
  { name: "Mon", present: 60, absent: 40 },
  { name: "Tue", present: 70, absent: 60 },
  { name: "Wed", present: 90, absent: 75 },
  { name: "Thu", present: 90, absent: 75 },
  { name: "Fri", present: 65, absent: 55 },
];

// CSS tokens (fallback bila var belum tersedia)
const FG = "var(--mono-fg, #000)";
const BG = "var(--mono-bg, #fff)";
const BD = "var(--mono-border, #000)";

function LegendMono() {
  return (
    <div className="flex items-center gap-6 pt-4 pb-6">
      <span className="inline-flex items-center gap-2 text-sm">
        <span
          className="inline-block w-3 h-3 border"
          style={{ background: FG, borderColor: BD }}
        />
        Present
      </span>
      <span className="inline-flex items-center gap-2 text-sm">
        <span
          className="inline-block w-3 h-3 border"
          style={{ background: BG, borderColor: BD }}
        />
        Absent
      </span>
    </div>
  );
}

export default function StockChart({
  title = "Stock I/O",
  data = DEFAULT_DATA,
  barSize = 20,
  className = "",
}: Props) {
  return (
    <section
      className={`bg-[var(--mono-bg)] text-[var(--mono-fg)] border border-[var(--mono-border)] rounded-none p-4 h-full ${className}`}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} barSize={barSize}>
          <CartesianGrid stroke={BD} strokeDasharray="1 6" vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: FG }}
          />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: FG }} />
          <Tooltip
            cursor={false}
            contentStyle={{
              borderRadius: 0,
              border: `1px solid ${BD}`,
              background: BG,
              color: FG,
            }}
            labelStyle={{ color: FG }}
            itemStyle={{ color: FG }}
          />
          <Legend verticalAlign="top" align="left" content={<LegendMono />} />

          {/* Present = solid */}
          <Bar dataKey="present" fill={BD} stroke={BD} radius={[0, 0, 0, 0]} />
          {/* Absent = outlined */}
          <Bar dataKey="absent" fill={BG} stroke={BD} radius={[0, 0, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}
