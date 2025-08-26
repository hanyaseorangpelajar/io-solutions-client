// src/components/data-display/charts/FinanceChart.tsx
"use client";

import * as React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Row = { name: string; income: number; expense: number };

type Props = {
  title?: string;
  data?: Row[];
  /** tinggi area chart (persentase dari kartu) */
  chartHeightPct?: number; // default 0.9
  className?: string;
};

const DEFAULT_DATA: Row[] = [
  { name: "Jan", income: 4000, expense: 2400 },
  { name: "Feb", income: 3000, expense: 1398 },
  { name: "Mar", income: 2000, expense: 9800 },
  { name: "Apr", income: 2780, expense: 3908 },
  { name: "May", income: 1890, expense: 4800 },
  { name: "Jun", income: 2390, expense: 3800 },
  { name: "Jul", income: 3490, expense: 4300 },
  { name: "Aug", income: 3490, expense: 4300 },
  { name: "Sep", income: 3490, expense: 4300 },
  { name: "Oct", income: 3490, expense: 4300 },
  { name: "Nov", income: 3490, expense: 4300 },
  { name: "Dec", income: 3490, expense: 4300 },
];

// CSS tokens (fallback ke warna lama bila var belum tersedia)
const FG = "var(--mono-fg, #000)";
const BG = "var(--mono-bg, #fff)";
const BD = "var(--mono-border, #000)";
const GRID_DASH = "1 6";
const EXPENSE_DASH = "6 6";

function LegendMono() {
  return (
    <div className="flex items-center gap-6 pt-2 pb-6">
      <span className="inline-flex items-center gap-2 text-sm">
        <span className="inline-block w-6 h-[2px]" style={{ background: FG }} />
        Income
      </span>
      <span className="inline-flex items-center gap-2 text-sm">
        <span
          className="inline-block w-6 h-[2px]"
          style={{
            backgroundImage: `linear-gradient(90deg, ${FG} 50%, transparent 0)`,
            backgroundSize: "8px 2px",
            backgroundRepeat: "repeat-x",
          }}
        />
        Expense
      </span>
    </div>
  );
}

export default function FinanceChart({
  title = "Uang I/O",
  data = DEFAULT_DATA,
  chartHeightPct = 0.9,
  className = "",
}: Props) {
  return (
    <section
      className={`w-full h-full p-4 border rounded-none
                  bg-[var(--mono-bg)] text-[var(--mono-fg)] border-[var(--mono-border)]
                  ${className}`}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      <ResponsiveContainer
        width="100%"
        height={`${Math.round(chartHeightPct * 100)}%`}
      >
        <LineChart
          data={data}
          margin={{ top: 10, right: 16, left: 8, bottom: 10 }}
        >
          <CartesianGrid stroke={BD} strokeDasharray={GRID_DASH} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            tick={{ fill: FG }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickMargin={20}
            tick={{ fill: FG }}
          />
          <Tooltip
            cursor={{ stroke: BD, strokeDasharray: "2 4" }}
            contentStyle={{
              borderRadius: 0,
              border: `1px solid ${BD}`,
              background: BG,
              color: FG,
            }}
            labelStyle={{ color: FG }}
            itemStyle={{ color: FG }}
          />
          <Legend verticalAlign="top" align="center" content={<LegendMono />} />

          {/* Income (solid) */}
          <Line
            type="monotone"
            dataKey="income"
            stroke={BD}
            strokeWidth={3}
            dot={{ r: 3, stroke: BD, fill: BG }}
            activeDot={{ r: 5, stroke: BD, fill: BG }}
          />

          {/* Expense (dashed) */}
          <Line
            type="monotone"
            dataKey="expense"
            stroke={BD}
            strokeWidth={3}
            strokeDasharray={EXPENSE_DASH}
            dot={{ r: 3, stroke: BD, fill: BG }}
            activeDot={{ r: 5, stroke: BD, fill: BG }}
          />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
}
