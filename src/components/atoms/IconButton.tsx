"use client";
import * as React from "react";

type IconButtonProps = {
  ariaLabel: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: "solid" | "ghost";
};

export default function IconButton({
  ariaLabel,
  children,
  className = "",
  onClick,
  type = "button",
  disabled,
  variant = "solid",
}: IconButtonProps) {
  const variantClass = variant === "ghost" ? "btn-icon-ghost" : "btn-icon";

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      title={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      className={[
        variantClass,
        "transition duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--mono-fg)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
}
