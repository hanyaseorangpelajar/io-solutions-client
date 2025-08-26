"use client";
import * as React from "react";

type Props = {
  children: React.ReactNode;
  /** Small prefix before label, e.g. "#" */
  prefix?: React.ReactNode;
  /** Keep chip colors stable when parent row (class "group/row") is hovered */
  lockOnRowHover?: boolean;
  /** Chip size */
  size?: "xs" | "sm";
  /** Extra classes */
  className?: string;
  /** Wrapper element */
  as?: keyof JSX.IntrinsicElements;
  /** Optional tooltip */
  title?: string;
};

const sizeMap: Record<NonNullable<Props["size"]>, string> = {
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
        "inline-flex items-center gap-1 rounded-none",
        "border border-[var(--mono-border)]",
        "bg-[var(--mono-bg)] text-[var(--mono-fg)]",
        "uppercase tracking-widest",
        "transition duration-200",
        sizeMap[size],
        lock,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {prefix != null ? <span aria-hidden="true">{prefix}</span> : null}
      <span className="leading-none">{children}</span>
    </Tag>
  );
}
