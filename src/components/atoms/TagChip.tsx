"use client";
import * as React from "react";

export type TagChipProps = React.HTMLAttributes<HTMLSpanElement> & {
  children: React.ReactNode;
};

export default function TagChip({
  children,
  className = "",
  ...rest
}: TagChipProps) {
  return (
    <span
      className={[
        // base classes
        "tag-chip", // <- base identifier untuk override global
        "chip", // <- tetap, bila sudah ada styling .chip di globals.css
        "rounded-none transition duration-200 hover:opacity-90",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </span>
  );
}
