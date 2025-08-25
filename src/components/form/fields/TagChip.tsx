"use client";

import * as React from "react";
import { mono } from "../../ui/tokens/uiTokens";

type TagChipProps = {
  children: React.ReactNode;
  className?: string;
};

export default function TagChip({ children, className = "" }: TagChipProps) {
  return <span className={`${mono.chip} ${className}`}>{children}</span>;
}
