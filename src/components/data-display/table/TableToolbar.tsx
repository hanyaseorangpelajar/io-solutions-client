// src/components/data-display/table/TableToolbar.tsx
"use client";

import * as React from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

type Props = {
  /** Placeholder untuk kolom pencarian */
  searchPlaceholder?: string;
  /** Panggil saat submit cari (Enter / klik tombol) */
  onSearch?: (q: string) => void;
  /** Nilai awal kolom pencarian (optional) */
  initialSearch?: string;

  /** Tombol Create (biasanya <FormModal .../>) */
  createButton?: React.ReactNode;

  /** Tampilkan tombol Filter */
  showFilter?: boolean;
  /** Tampilkan tombol Sort */
  showSort?: boolean;

  /** Handler click Filter / Sort (opsional) */
  onFilterClick?: () => void;
  onSortClick?: () => void;

  /** Kelas wrapper ekstra (opsional) */
  className?: string;
};

const btn =
  "inline-flex items-center justify-center gap-1 h-8 px-2 " +
  "border border-[var(--mono-border)] bg-[var(--mono-bg)] text-[var(--mono-fg)] " +
  "hover:bg-[var(--mono-fg)] hover:text-[var(--mono-bg)] transition";

const iconCls = "w-4 h-4";

export default function TableToolbar({
  searchPlaceholder = "Search…",
  onSearch,
  initialSearch = "",
  createButton,
  showFilter = false,
  showSort = false,
  onFilterClick,
  onSortClick,
  className,
}: Props) {
  const [q, setQ] = React.useState(initialSearch);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    onSearch?.(q.trim());
  };

  const clear = () => {
    setQ("");
    onSearch?.("");
  };

  return (
    <div
      className={[
        "w-full flex items-center justify-between gap-2",
        className || "",
      ].join(" ")}
    >
      {/* Search */}
      <form onSubmit={submit} className="flex items-center gap-2 min-w-0">
        <div className="flex items-center gap-2 border border-[var(--mono-border)] bg-[var(--mono-bg)] px-2 h-9">
          <MagnifyingGlassIcon className={iconCls} aria-hidden="true" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-8 w-[200px] md:w-[260px] lg:w-[320px] outline-none bg-transparent"
            aria-label="Search"
          />
          {q && (
            <button
              type="button"
              onClick={clear}
              className="p-1 -mr-1 hover:opacity-70"
              aria-label="Clear"
              title="Clear"
            >
              <XMarkIcon className={iconCls} />
            </button>
          )}
        </div>
        <button type="submit" className={btn} aria-label="Search">
          Go
        </button>
      </form>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {showFilter && (
          <button
            type="button"
            onClick={onFilterClick}
            className={btn}
            aria-label="Filter"
            title="Filter"
          >
            <FunnelIcon className={iconCls} />
            <span className="hidden sm:inline">Filter</span>
          </button>
        )}
        {showSort && (
          <button
            type="button"
            onClick={onSortClick}
            className={btn}
            aria-label="Sort"
            title="Sort"
          >
            <ArrowsUpDownIcon className={iconCls} />
            <span className="hidden sm:inline">Sort</span>
          </button>
        )}

        {/* Create button dari luar (mis. FormModal) */}
        {createButton}
      </div>
    </div>
  );
}
