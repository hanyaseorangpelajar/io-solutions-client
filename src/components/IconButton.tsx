// src/components/IconButton.tsx
"use client";

import * as React from "react";
import { mono } from "./uiTokens";

type IconButtonProps = {
  ariaLabel: string;
  children: React.ReactNode; // kirim <PlusIcon className={mono.icon} />
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

export default function IconButton({
  ariaLabel,
  children,
  className = "",
  onClick,
  type = "button",
  disabled,
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      className={`${mono.iconBtn} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}
