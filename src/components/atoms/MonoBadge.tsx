"use client";
import * as React from "react";

export type MonoBadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  /** Ghost = outline/dark-surface badge. Solid = inverted (white on black). */
  ghost?: boolean;
};

export default function MonoBadge({
  ghost = true,
  className = "",
  ...rest
}: MonoBadgeProps) {
  const base =
    "badge inline-flex items-center gap-1 uppercase tracking-widest rounded-none transition duration-200";
  const variant = ghost
    ? "bg-mono-bg text-mono-fg hover:bg-mono-fg hover:text-mono-bg"
    : "bg-mono-fg text-mono-bg hover:opacity-90";

  return (
    <span
      className={[base, variant, className].filter(Boolean).join(" ")}
      {...rest}
    />
  );
}
