"use client";
import * as React from "react";

type Props = {
  children: React.ReactNode;
  prefix?: string; // contoh: "#"
  className?: string;
};

export default function SafetyChip({
  children,
  prefix,
  className = "",
}: Props) {
  return (
    <span
      className={
        "inline-flex items-center border border-black bg-white text-black " +
        "px-1.5 py-0.5 text-[10px] uppercase tracking-widest " +
        // pastikan tetap kontras saat <tr> di-hover jadi hitam/teks putih
        "group-hover:!bg-white group-hover:!text-black " +
        className
      }
    >
      {prefix ? <span className="opacity-70 mr-0.5">{prefix}</span> : null}
      {children}
    </span>
  );
}
