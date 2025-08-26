"use client";
import * as React from "react";

type Props = {
  /** delta = (storePrice - marketPrice) / marketPrice * 100 */
  delta?: number | null;
  className?: string;
  title?: string;
};

function formatPercent(n: number) {
  const digits = Math.abs(n) >= 10 ? 0 : 1;
  const s = n.toFixed(digits);
  return (n > 0 ? "+" : "") + s + "%";
}

export default function PriceDeltaBadge({
  delta,
  className = "",
  title,
}: Props) {
  // Unknown / not available
  if (delta === null || delta === undefined || Number.isNaN(delta)) {
    return (
      <span
        className={[
          "inline-flex items-center px-1.5 py-0.5 text-[10px] border rounded-none",
          "bg-mono-bg text-mono-muted border-[var(--mono-border)]",
          "transition duration-200",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        title={title || "Delta not available"}
        aria-label="Price delta not available"
      >
        —
      </span>
    );
  }

  const abs = Math.abs(delta);

  // Tone (monochrome): large change = inverted (solid), small = ghost
  const toneClass =
    abs >= 10
      ? "bg-mono-fg text-mono-bg border-mono-fg"
      : "bg-mono-bg text-mono-fg border-[var(--mono-border)]";

  return (
    <span
      data-delta={delta}
      className={[
        "inline-flex items-center px-1.5 py-0.5 text-[10px] border rounded-none",
        "uppercase tracking-widest",
        "transition duration-200 hover:opacity-90",
        toneClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      title={title || "Store price vs. market delta"}
      aria-label={`Price delta ${formatPercent(delta)}`}
    >
      {formatPercent(delta)}
    </span>
  );
}
