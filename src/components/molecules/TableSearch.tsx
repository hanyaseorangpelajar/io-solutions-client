"use client";

import * as React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type Props = {
  placeholder?: string;
  className?: string;
  /** Optional custom id to avoid duplicates when multiple search boxes exist */
  id?: string;
  /** Optional controlled value */
  value?: string;
  /** Optional controlled onChange */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function TableSearch({
  placeholder = "Search...",
  className = "",
  id,
  value,
  onChange,
}: Props) {
  const autoId = React.useId();
  const inputId = id ?? `table-search-${autoId}`;

  return (
    <div
      className={["inline-flex items-center", className]
        .filter(Boolean)
        .join(" ")}
    >
      <label htmlFor={inputId} className="sr-only">
        Search
      </label>

      <div className="relative">
        <MagnifyingGlassIcon
          className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--mono-ph)]"
          aria-hidden="true"
        />
        <input
          id={inputId}
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={[
            // reuse util dari globals.css
            "input h-8 pl-7 pr-3 text-xs",
            // fokus/hover halus (monochrome)
            "transition duration-200 focus-visible:ring-1 focus-visible:ring-[var(--mono-fg)]",
          ]
            .filter(Boolean)
            .join(" ")}
        />
      </div>
    </div>
  );
}
