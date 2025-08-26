"use client";

import * as React from "react";
import type { Part } from "@/components/organisms/PartsEditor";

export type CostSummaryProps = {
  parts?: Part[];
  laborCost?: number;
  className?: string;
};

function toIDR(n: number) {
  return Number(n || 0).toLocaleString("id-ID");
}

export default function CostSummary({
  parts = [],
  laborCost = 0,
  className = "",
}: CostSummaryProps) {
  const partsTotal = React.useMemo(
    () =>
      (parts || []).reduce(
        (sum, p) => sum + Number(p.qty || 0) * Number(p.unitCost || 0),
        0
      ),
    [parts]
  );

  const labor = Number(laborCost || 0);
  const grandTotal = partsTotal + labor;

  return (
    <div
      className={[
        "card p-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm",
        "transition duration-200",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="group"
      aria-label="Ringkasan biaya"
    >
      <div className="flex items-center justify-between">
        <span className="text-[var(--mono-label)]">Total Suku Cadang</span>
        <span className="tabular-nums">Rp {toIDR(partsTotal)}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[var(--mono-label)]">Biaya Jasa</span>
        <span className="tabular-nums">Rp {toIDR(labor)}</span>
      </div>
      <div className="flex items-center justify-between font-semibold">
        <span>Grand Total</span>
        <span className="tabular-nums">Rp {toIDR(grandTotal)}</span>
      </div>
    </div>
  );
}
