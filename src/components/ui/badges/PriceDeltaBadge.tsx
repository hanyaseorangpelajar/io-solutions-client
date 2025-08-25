"use client";

import * as React from "react";

type Props = {
  /** delta = (storePrice - marketPrice) / marketPrice * 100  */
  delta?: number | null;
  className?: string;
};

function fmt(n: number) {
  const s = n.toFixed(Math.abs(n) >= 10 ? 0 : 1);
  return (n > 0 ? "+" : "") + s + "%";
}

export default function PriceDeltaBadge({ delta, className = "" }: Props) {
  if (delta === null || delta === undefined || Number.isNaN(delta)) {
    return (
      <span
        className={`inline-flex items-center border border-black px-1.5 py-0.5 text-[10px] ${className}`}
        title="Delta tidak tersedia"
      >
        —
      </span>
    );
  }

  // Monokrom: beda intensitas via opacity
  const tone =
    Math.abs(delta) >= 10
      ? "text-black border-black"
      : "text-black/70 border-black/60";

  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 text-[10px] bg-white border ${tone} ${className}`}
      title="Selisih harga toko vs market"
    >
      {fmt(delta)}
    </span>
  );
}
