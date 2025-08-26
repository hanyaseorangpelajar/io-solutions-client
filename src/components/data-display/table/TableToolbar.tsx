// src/components/data-display/table/TableToolbar.tsx
"use client";

import * as React from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";

type Props = {
  /** Placeholder input cari. */
  searchPlaceholder?: string;
  /** Controlled value; jika diisi maka komponen jadi controlled. */
  searchValue?: string;
  /** Default value untuk uncontrolled mode. */
  defaultSearch?: string;
  /** Dipanggil saat nilai input berubah. */
  onSearchChange?: (value: string) => void;
  /** Dipanggil saat submit (Enter / klik tombol cari). */
  onSearchSubmit?: (value: string) => void;

  /** Tampilkan tombol Filter. */
  showFilter?: boolean;
  /** Event klik tombol Filter. */
  onFilterClick?: () => void;

  /** Tampilkan tombol Sort. */
  showSort?: boolean;
  /** Event klik tombol Sort. */
  onSortClick?: () => void;

  /** Slot aksi kanan (mis. tombol Create via FormModal). */
  createButton?: React.ReactNode;
  /** Slot tambahan di kanan selain createButton. */
  rightSlot?: React.ReactNode;

  /** Kelas tambahan wrapper. */
  className?: string;
};

const btnBase =
  "inline-flex items-center gap-2 px-3 py-1.5 text-sm " +
  "border border-[var(--mono-border)] bg-[var(--mono-bg)] text-[var(--mono-fg)] " +
  "hover:bg-[var(--mono-fg)] hover:text-[var(--mono-bg)] transition";

const iconCls = "w-4 h-4";

export default function TableToolbar({
  searchPlaceholder = "Search…",
  searchValue,
  defaultSearch = "",
  onSearchChange,
  onSearchSubmit,

  showFilter = true,
  onFilterClick,

  showSort = true,
  onSortClick,

  createButton,
  rightSlot,
  className = "",
}: Props) {
  const isControlled = typeof searchValue === "string";
  const [inner, setInner] = React.useState(defaultSearch);

  const value = isControlled ? (searchValue as string) : inner;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (!isControlled) setInner(v);
    onSearchChange?.(v);
  };

  const submit = () => onSearchSubmit?.(value);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") submit();
  };

  return (
    <div
      className={`mono flex items-center justify-between gap-2 ${className}`}
      aria-label="Table toolbar"
    >
      {/* LEFT: Search + Filter + Sort */}
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <input
            aria-label="Search"
            value={value}
            onChange={handleChange}
            onKeyDown={onKeyDown}
            placeholder={searchPlaceholder}
            className="h-8 w-56 md:w-64 px-3 py-1.5 text-sm outline-none
                       border border-[var(--mono-border)] bg-[var(--mono-bg)] text-[var(--mono-fg)]
                       placeholder:text-[var(--mono-ph)]"
          />
          <button
            type="button"
            onClick={submit}
            className={`${btnBase} h-8 -ml-px`}
            title="Cari"
            aria-label="Cari"
          >
            <MagnifyingGlassIcon className={iconCls} />
          </button>
        </div>

        {showFilter && (
          <button
            type="button"
            onClick={onFilterClick}
            className={`${btnBase} h-8`}
            title="Filter"
            aria-label="Filter"
          >
            <FunnelIcon className={iconCls} />
            <span className="hidden sm:inline">Filter</span>
          </button>
        )}

        {showSort && (
          <button
            type="button"
            onClick={onSortClick}
            className={`${btnBase} h-8`}
            title="Sort"
            aria-label="Sort"
          >
            <ArrowsUpDownIcon className={iconCls} />
            <span className="hidden sm:inline">Sort</span>
          </button>
        )}
      </div>

      {/* RIGHT: custom actions */}
      <div className="flex items-center gap-2">
        {rightSlot}
        {createButton}
      </div>
    </div>
  );
}
