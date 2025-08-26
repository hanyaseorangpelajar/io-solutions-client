// src/components/data-display/table/Pagination.tsx
"use client";

import * as React from "react";

type Props = {
  /** 1-based current page; jika tidak diberi, komponen akan unmanaged (state internal) */
  page?: number;
  /** total item — jika diisi bersama perPage, totalPages dihitung otomatis */
  total?: number;
  /** item per halaman (default 10) */
  perPage?: number;
  /** total halaman (alternatif jika tidak pakai total/perPage) */
  totalPages?: number;
  /** panggilan saat pindah halaman (page 1-based) */
  onChange?: (page: number) => void;
  /** kelas ekstra wrapper (mis. mt-4) */
  className?: string;
  /** tampilkan info “Page X of Y” (default true) */
  showInfo?: boolean;
};

const btnBase =
  "inline-flex items-center justify-center h-8 min-w-8 px-2 " +
  "border border-[var(--mono-border)] bg-[var(--mono-bg)] text-[var(--mono-fg)] " +
  "hover:bg-[var(--mono-fg)] hover:text-[var(--mono-bg)] transition";
const btnDisabled =
  "opacity-60 cursor-not-allowed hover:bg-[var(--mono-bg)] hover:text-[var(--mono-fg)]";
const btnActive = "bg-[var(--mono-fg)] text-[var(--mono-bg)]";

function useControlledPage(pageProp?: number, onChange?: (p: number) => void) {
  const [inner, setInner] = React.useState<number>(pageProp ?? 1);
  const isControlled = pageProp !== undefined;

  React.useEffect(() => {
    if (isControlled) setInner(pageProp!);
  }, [isControlled, pageProp]);

  const set = React.useCallback(
    (p: number) => {
      if (isControlled) onChange?.(p);
      else setInner(p), onChange?.(p);
    },
    [isControlled, onChange]
  );

  return [inner, set] as const;
}

export default function Pagination({
  page: pageProp,
  total,
  perPage = 10,
  totalPages: totalPagesProp,
  onChange,
  className,
  showInfo = true,
}: Props) {
  const computedTotalPages =
    total !== undefined ? Math.max(1, Math.ceil(total / perPage)) : undefined;
  const totalPages = totalPagesProp ?? computedTotalPages ?? 1;

  const [page, setPage] = useControlledPage(pageProp, onChange);

  // pastikan tetap dalam rentang
  React.useEffect(() => {
    if (page < 1) setPage(1);
    else if (page > totalPages) setPage(totalPages);
  }, [page, totalPages, setPage]);

  const goto = (p: number) => {
    if (p < 1 || p > totalPages || p === page) return;
    setPage(p);
  };

  // buat deret nomor pendek (maks 5 tombol angka + ellipsis)
  const makeRange = () => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "...")[] = [];
    const add = (n: number | "...") => pages.push(n);

    const left = Math.max(2, page - 1);
    const right = Math.min(totalPages - 1, page + 1);

    add(1);
    if (left > 2) add("...");
    for (let p = left; p <= right; p++) add(p);
    if (right < totalPages - 1) add("...");
    add(totalPages);

    return pages;
  };

  return (
    <div
      className={[
        "w-full flex items-center justify-between",
        className || "",
      ].join(" ")}
      role="navigation"
      aria-label="Pagination"
    >
      {showInfo ? (
        <div className="text-xs text-[var(--mono-muted)]">
          Page {page} of {totalPages}
          {total !== undefined && (
            <span className="ml-2">
              • {Math.min(total, (page - 1) * perPage + 1)}–
              {Math.min(total, page * perPage)} of {total}
            </span>
          )}
        </div>
      ) : (
        <span />
      )}

      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          type="button"
          onClick={() => goto(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className={[btnBase, page <= 1 ? btnDisabled : ""].join(" ")}
        >
          ‹
        </button>

        {/* Numbers */}
        {makeRange().map((p, i) =>
          p === "..." ? (
            <span
              key={`e-${i}`}
              className="px-2 text-xs text-[var(--mono-muted)] select-none"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => goto(p)}
              aria-current={p === page ? "page" : undefined}
              className={[btnBase, p === page ? btnActive : ""].join(" ")}
              title={`Page ${p}`}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          type="button"
          onClick={() => goto(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          className={[btnBase, page >= totalPages ? btnDisabled : ""].join(" ")}
        >
          ›
        </button>
      </div>
    </div>
  );
}
