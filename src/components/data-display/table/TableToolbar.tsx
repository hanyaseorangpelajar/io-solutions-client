// src/components/TableToolbar.tsx
"use client";

import TableSearch from "@/components/data-display/table/TableSearch";
import {
  FunnelIcon,
  ArrowsUpDownIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import * as React from "react";

type TableToolbarProps = {
  // Search
  searchPlaceholder?: string;
  searchClassName?: string;

  // Action handlers
  onFilterClick?: () => void;
  onSortClick?: () => void;

  // Create
  createButton?: React.ReactNode; // kirim <FormModal ... /> ke sini
  onCreateClick?: () => void; // fallback: pakai tombol bawaan

  showFilter?: boolean;
  showSort?: boolean;

  // Styling
  className?: string;
  /**
   * Jika true, tombol akan ikut "invert" saat parent memiliki .group:hover,
   * sehingga cocok ketika toolbar dipakai di dalam row yang me-hover bg hitam.
   * Di header (bukan di dalam .group) ini tidak berdampak.
   */
  enableRowHoverSync?: boolean;

  /** Tambahan class untuk setiap tombol (Filter/Sort/Create bawaan). */
  buttonClassName?: string;
  /** Tambahan class untuk icon (Filter/Sort/Create bawaan). */
  iconClassName?: string;
};

export default function TableToolbar({
  searchPlaceholder,
  searchClassName,
  onFilterClick,
  onSortClick,
  createButton,
  onCreateClick,
  showFilter = true,
  showSort = true,
  className = "",
  enableRowHoverSync = true,
  buttonClassName = "",
  iconClassName = "",
}: TableToolbarProps) {
  const rowSyncBtn = enableRowHoverSync
    ? "group-hover:bg-white group-hover:text-black"
    : "";
  const rowSyncIcon = enableRowHoverSync ? "group-hover:text-black" : "";

  const btnBase =
    "group w-8 h-8 inline-flex items-center justify-center " +
    "rounded-none border border-black bg-black hover:bg-white transition " +
    rowSyncBtn;

  const iconBase = "w-4 h-4 text-white transition-colors " + rowSyncIcon;

  return (
    <div
      className={`flex flex-col md:flex-row items-center gap-4 w-full md:w-auto ${className}`}
    >
      <TableSearch
        placeholder={searchPlaceholder}
        className={searchClassName}
      />

      <div className="flex items-center gap-2 self-end">
        {showFilter && (
          <button
            className={`${btnBase} ${buttonClassName}`}
            aria-label="Filter"
            onClick={onFilterClick}
            type="button"
          >
            <FunnelIcon className={`${iconBase} ${iconClassName}`} />
          </button>
        )}

        {showSort && (
          <button
            className={`${btnBase} ${buttonClassName}`}
            aria-label="Sort"
            onClick={onSortClick}
            type="button"
          >
            <ArrowsUpDownIcon className={`${iconBase} ${iconClassName}`} />
          </button>
        )}

        {createButton
          ? createButton
          : onCreateClick && (
              <button
                className={`${btnBase} ${buttonClassName}`}
                aria-label="Create"
                onClick={onCreateClick}
                type="button"
              >
                <PlusIcon className={`${iconBase} ${iconClassName}`} />
              </button>
            )}
      </div>
    </div>
  );
}
