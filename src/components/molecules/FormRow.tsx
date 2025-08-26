"use client";
import * as React from "react";

export type FormRowProps = React.HTMLAttributes<HTMLDivElement> & {
  cols?: 2 | 3;
};

export default function FormRow({
  children,
  cols = 2,
  className = "",
  ...rest
}: FormRowProps) {
  const colCls = cols === 3 ? "md:grid-cols-3" : "md:grid-cols-2";

  return (
    <div
      data-cols={cols}
      className={`grid grid-cols-1 ${colCls} gap-3 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
