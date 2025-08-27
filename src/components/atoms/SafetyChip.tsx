"use client";
import * as React from "react";

type Props = {
  children: React.ReactNode;
  /** Mis. "#" di depan tag */
  prefix?: React.ReactNode;
  /**
   * Sinkron dengan hover baris tabel (pakai group/row).
   * Biar chip ikut “kontras” saat row di-hover.
   */
  lockOnRowHover?: boolean;
  className?: string;
  title?: string;
};

export default function SafetyChip({
  children,
  prefix,
  lockOnRowHover = false,
  className = "",
  title,
}: Props) {
  return (
    <span
      title={title}
      className={[
        // IDENTITAS: penting agar bisa di-target CSS global
        "safety-chip", // spesifik untuk komponen ini
        "chip", // base util (jika ada di globals.css)

        // Visual dasar (monokrom)
        "inline-flex items-center gap-1 px-2 py-0.5 text-[10px]",
        "border border-[var(--mono-border)]",
        "bg-[var(--mono-bg)] text-[var(--mono-fg)]",
        "rounded-none transition-colors duration-200",

        // Ikuti hover baris (opsional)
        lockOnRowHover
          ? "group-hover/row:bg-[var(--mono-bg)] group-hover/row:text-[var(--mono-fg)] group-hover/row:border-[var(--mono-bg)]"
          : "",

        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {prefix ? (
        <span className="opacity-70" aria-hidden="true">
          {prefix}
        </span>
      ) : null}
      <span className="leading-none">{children}</span>
    </span>
  );
}
