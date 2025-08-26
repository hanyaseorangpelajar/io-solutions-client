"use client";
import * as React from "react";

export type MonoButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "ghost";
  size?: "sm" | "md" | "lg";
};

const sizeMap: Record<NonNullable<MonoButtonProps["size"]>, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-3 text-base",
};

export default function MonoButton({
  variant = "solid",
  size = "md",
  className = "",
  ...rest
}: MonoButtonProps) {
  const variantClass = variant === "ghost" ? "btn-ghost" : "btn";
  const sizeClass = sizeMap[size];

  return (
    <button
      className={[
        variantClass,
        sizeClass,
        "transition duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--mono-fg)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    />
  );
}
