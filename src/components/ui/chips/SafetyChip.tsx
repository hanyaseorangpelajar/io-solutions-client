// src/components/ui/chips/SafetyChip.tsx
"use client";

import * as React from "react";

type Props = {
  children: React.ReactNode;
  /** Teks/ikon kecil di depan label, mis. "#" */
  prefix?: React.ReactNode;
  /** Paksa chip tetap putih/hitam saat parent <tr class="group/row hover:..."> di-hover */
  lockOnRowHover?: boolean;
  /** Ukuran chip */
  size?: "xs" | "sm";
  /** Kelas ekstra */
  className?: string;
  /** Elemen wrapper */
  as?: keyof JSX.IntrinsicElements;
  /** Title (tooltip) opsional */
  title?: string;
};

const sizeMap = {
  xs: "px-2 py-0.5 text-[10px]",
  sm: "px-2.5 py-1 text-[11px]",
};

export default function SafetyChip({
  children,
  prefix,
  lockOnRowHover = true,
  size = "xs",
  className = "",
  as: Tag = "span",
  title,
}: Props) {
  const lock = lockOnRowHover
    ? "group-hover/row:bg-[var(--mono-bg)] group-hover/row:text-[var(--mono-fg)]"
    : "";

  return (
    <Tag
      title={title}
      className={[
        "inline-flex items-center gap-1",
        "border border-[var(--mono-border)]",
        "bg-[var(--mono-bg)] text-[var(--mono-fg)]",
        sizeMap[size],
        lock,
        className,
      ].join(" ")}
    >
      {prefix != null ? <span aria-hidden="true">{prefix}</span> : null}
      <span className="leading-none">{children}</span>
    </Tag>
  );
}
