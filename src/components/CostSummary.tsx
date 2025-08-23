"use client";

import * as React from "react";
import type { Part } from "@/components/PartsEditor";

export type CostSummaryProps = {
  parts?: Part[];
  laborCost?: number;
  className?: string;
};

function toIDR(n: number) {
  return n.toLocaleString("id-ID");
}

export default function CostSummary({
  parts = [],
  laborCost = 0,
  className = "",
}: CostSummaryProps) {
  const partsTotal =
    parts.reduce(
      (sum, p) => sum + Number(p.qty || 0) * Number(p.unitCost || 0),
      0
    ) || 0;
  const jasa = Number(laborCost || 0);
  const grandTotal = partsTotal + jasa;

  return (
    <div
      className={`border border-black p-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm ${className}`}
    >
      <div className="flex items-center justify-between">
        <span>Total Suku Cadang</span>
        <span>Rp {toIDR(partsTotal)}</span>
      </div>
      <div className="flex items-center justify-between">
        <span>Biaya Jasa</span>
        <span>Rp {toIDR(jasa)}</span>
      </div>
      <div className="flex items-center justify-between font-semibold">
        <span>Grand Total</span>
        <span>Rp {toIDR(grandTotal)}</span>
      </div>
    </div>
  );
}
