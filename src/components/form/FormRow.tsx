"use client";
import * as React from "react";

type Props = {
  children: React.ReactNode;
  cols?: 2 | 3;
  className?: string;
};
export default function FormRow({ children, cols = 2, className = "" }: Props) {
  const colCls = cols === 3 ? "md:grid-cols-3" : "md:grid-cols-2";
  return (
    <div className={`grid grid-cols-1 ${colCls} gap-3 ${className}`}>
      {children}
    </div>
  );
}
