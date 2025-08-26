"use client";
import * as React from "react";

export type MonoCardProps = React.PropsWithChildren<{
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  /** Apply inner padding (default: true) */
  padding?: boolean;
}>;

export default function MonoCard({
  className = "",
  header,
  footer,
  padding = true,
  children,
}: MonoCardProps) {
  return (
    <div
      className={[
        "card",
        padding ? "p-4" : "",
        // smooth micro-animations for hover/focus contexts
        "transition duration-200",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {header ? <div className="mb-3">{header}</div> : null}
      <div>{children}</div>
      {footer ? <div className="mt-3">{footer}</div> : null}
    </div>
  );
}
