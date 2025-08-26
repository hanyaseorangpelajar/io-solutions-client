// src/components/data-display/table/TableToolbar.tsx
"use client";

import * as React from "react";
import MonoButton from "@/components/atoms/MonoButton";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";

type Props = {
  /** Placeholder untuk input pencarian. */
  searchPlaceholder?: string;
  /** Controlled value (jika diisi maka komponen menjadi controlled). */
  searchValue?: string;
  /** Default value untuk uncontrolled mode. */
  defaultSearch?: string;
  /** Dipanggil saat nilai input berubah. */
  onSearchChange?: (value: string) => void;
  /** Dipanggil saat submit (Enter / klik tombol Cari). */
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

  const inputId = React.useId();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (!isControlled) setInner(v);
    onSearchChange?.(v);
  };

  const submit = () => {
    if (onSearchSubmit) onSearchSubmit(value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div
      className={["flex items-center justify-between gap-2", className]
        .filter(Boolean)
        .join(" ")}
      aria-label="Table toolbar"
    >
      {/* LEFT: Search + Filter + Sort */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            <label htmlFor={inputId} className="sr-only">
              Search
            </label>
            <MagnifyingGlassIcon
              className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--mono-ph)]"
              aria-hidden="true"
            />
            <input
              id={inputId}
              aria-label="Search"
              value={value}
              onChange={handleChange}
              onKeyDown={onKeyDown}
              placeholder={searchPlaceholder}
              className={[
                "input h-8 pl-7 pr-3 text-xs",
                "transition duration-200 focus-visible:ring-1 focus-visible:ring-[var(--mono-fg)]",
              ].join(" ")}
            />
          </div>

          <MonoButton
            type="button"
            variant="ghost"
            size="sm"
            onClick={submit}
            aria-label="Cari"
            className="px-3 py-1.5"
          >
            Cari
          </MonoButton>
        </div>

        {showFilter && (
          <MonoButton
            type="button"
            variant="ghost"
            size="sm"
            onClick={onFilterClick}
            aria-label="Filter"
            className="px-3 py-1.5"
          >
            <FunnelIcon className="w-4 h-4 mr-1" aria-hidden="true" />
            <span className="hidden sm:inline">Filter</span>
          </MonoButton>
        )}

        {showSort && (
          <MonoButton
            type="button"
            variant="ghost"
            size="sm"
            onClick={onSortClick}
            aria-label="Sort"
            className="px-3 py-1.5"
          >
            <ArrowsUpDownIcon className="w-4 h-4 mr-1" aria-hidden="true" />
            <span className="hidden sm:inline">Sort</span>
          </MonoButton>
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
