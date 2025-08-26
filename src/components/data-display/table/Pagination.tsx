// src/components/data-display/table/Pagination.tsx
"use client";

import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

type Props = {
  /** Halaman saat ini (controlled). */
  page?: number;
  /** Halaman awal untuk uncontrolled. Default: 1 */
  defaultPage?: number;
  /** Jumlah halaman (langsung). Jika tidak ada, akan dihitung dari totalItems/pageSize. */
  totalPages?: number;
  /** Total item untuk menghitung totalPages jika totalPages tidak diberikan. */
  totalItems?: number;
  /** Ukuran halaman (untuk hitung totalPages + menampilkan range). Default: 10 */
  pageSize?: number;
  /** Callback saat halaman berubah. */
  onPageChange?: (page: number) => void;

  /** Tampilkan dropdown page size (opsional). */
  showPageSize?: boolean;
  /** Nilai page size (controlled). Jika tidak ada, pakai internal state. */
  controlledPageSize?: number;
  /** Default page size untuk uncontrolled. */
  defaultPageSize?: number;
  /** Opsi page size. */
  pageSizeOptions?: number[];
  /** Callback ketika page size berubah. */
  onPageSizeChange?: (size: number) => void;

  /** Tampilkan "Showing X–Y of Z". Aktif bila ada totalItems. */
  showTotals?: boolean;

  className?: string;
};

const btnBase =
  "inline-flex items-center justify-center gap-2 h-8 min-w-8 px-2 text-sm " +
  "border border-[var(--mono-border)] bg-[var(--mono-bg)] text-[var(--mono-fg)] " +
  "hover:bg-[var(--mono-fg)] hover:text-[var(--mono-bg)] transition " +
  "disabled:opacity-50 disabled:cursor-not-allowed " +
  "disabled:hover:bg-[var(--mono-bg)] disabled:hover:text-[var(--mono-fg)]";

const btnSolid =
  "inline-flex items-center justify-center gap-2 h-8 min-w-8 px-2 text-sm " +
  "border border-[var(--mono-border)] bg-[var(--mono-fg)] text-[var(--mono-bg)]";

const iconCls = "w-4 h-4";

function useControlledState<T>(
  controlled: T | undefined,
  defaultValue: T
): [T, (v: T) => void] {
  const [inner, setInner] = React.useState<T>(defaultValue);
  const value = controlled !== undefined ? controlled : inner;
  const set = (v: T) => setInner(v);
  return [value, set];
}

function computeTotalPages(
  totalPages?: number,
  totalItems?: number,
  pageSize?: number
) {
  if (typeof totalPages === "number" && totalPages > 0) return totalPages;
  if (typeof totalItems === "number" && totalItems >= 0) {
    const size = pageSize && pageSize > 0 ? pageSize : 10;
    return Math.max(1, Math.ceil(totalItems / size));
  }
  // fallback demo
  return 8;
}

function visiblePages(current: number, total: number): (number | "...")[] {
  // Tampilkan semua kalau <=7
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set<number>();
  pages.add(1);
  pages.add(total);

  // tetangga
  for (let p = current - 1; p <= current + 1; p++) {
    if (p >= 1 && p <= total) pages.add(p);
  }
  // juga 2 & total-1 untuk kenyamanan
  pages.add(2);
  pages.add(total - 1);

  const arr = Array.from(pages).sort((a, b) => a - b);
  const out: (number | "...")[] = [];
  for (let i = 0; i < arr.length; i++) {
    out.push(arr[i]);
    const next = arr[i + 1];
    if (next && next - arr[i] > 1) out.push("...");
  }
  return out;
}

export default function Pagination({
  page,
  defaultPage = 1,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,

  showPageSize = false,
  controlledPageSize,
  defaultPageSize = 10,
  pageSizeOptions = [10, 20, 50],
  onPageSizeChange,

  showTotals = true,
  className = "",
}: Props) {
  // state halaman (controlled/uncontrolled)
  const [curPage, setCurPage] = useControlledState<number>(page, defaultPage);
  // state page size (controlled/uncontrolled)
  const [innerPageSize, setInnerPageSize] = useControlledState<number>(
    controlledPageSize ?? pageSize,
    defaultPageSize
  );

  const total = computeTotalPages(totalPages, totalItems, innerPageSize);

  // jaga-jaga kalau current lebih dari total
  React.useEffect(() => {
    if (curPage > total) {
      handleChange(total);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  function handleChange(next: number) {
    const clamped = Math.min(Math.max(1, next), total);
    if (page === undefined) setCurPage(clamped);
    onPageChange?.(clamped);
  }

  function handleSizeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newSize = Number(e.target.value);
    if (controlledPageSize === undefined && pageSize === undefined) {
      setInnerPageSize(newSize);
    }
    onPageSizeChange?.(newSize);
    // reset ke halaman 1 supaya aman
    handleChange(1);
  }

  const numbers = visiblePages(curPage, total);

  const leftInfo =
    showTotals && typeof totalItems === "number"
      ? (() => {
          const start = (curPage - 1) * innerPageSize + 1;
          const end = Math.min(curPage * innerPageSize, totalItems);
          return `Showing ${start}–${end} of ${totalItems}`;
        })()
      : null;

  return (
    <nav
      className={`mono mt-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between ${className}`}
      aria-label="Pagination"
    >
      {/* Left: totals / page size */}
      <div className="flex items-center gap-2 text-xs">
        {leftInfo && (
          <span className="opacity-70" aria-live="polite">
            {leftInfo}
          </span>
        )}

        {showPageSize && (
          <label className="flex items-center gap-2">
            <span className="text-[11px] opacity-70">Rows per page</span>
            <select
              value={controlledPageSize ?? innerPageSize}
              onChange={handleSizeChange}
              className="h-8 border border-[var(--mono-border)] bg-[var(--mono-bg)] text-[var(--mono-fg)] px-2 text-sm outline-none"
            >
              {pageSizeOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {/* Right: pager */}
      <div className="flex items-center gap-1 self-end md:self-auto">
        <button
          type="button"
          className={btnBase}
          onClick={() => handleChange(curPage - 1)}
          disabled={curPage <= 1}
          aria-label="Previous page"
        >
          <ChevronLeftIcon className={iconCls} />
        </button>

        {numbers.map((n, i) =>
          n === "..." ? (
            <span
              key={`dots-${i}`}
              className="px-2 text-sm opacity-70 select-none"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <button
              key={n}
              type="button"
              className={n === curPage ? btnSolid : btnBase}
              aria-current={n === curPage ? "page" : undefined}
              onClick={() => handleChange(n)}
            >
              {n}
            </button>
          )
        )}

        <button
          type="button"
          className={btnBase}
          onClick={() => handleChange(curPage + 1)}
          disabled={curPage >= total}
          aria-label="Next page"
        >
          <ChevronRightIcon className={iconCls} />
        </button>
      </div>
    </nav>
  );
}
