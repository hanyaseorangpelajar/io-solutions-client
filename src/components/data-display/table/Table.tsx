// src/components/data-display/table/Table.tsx
"use client";

import * as React from "react";

export type TableColumn = {
  header: React.ReactNode;
  accessor: string;
  className?: string;
  align?: "left" | "center" | "right";
};

type Props<T = any> = {
  /** Definisi kolom (untuk header & colSpan empty state). */
  columns: TableColumn[];
  /** Data baris. */
  data: T[];
  /** Renderer baris: kembalikan <tr>…</tr> (seperti di halamanmu). */
  renderRow: (item: T, index: number) => React.ReactNode;

  /** Header lengket. */
  stickyHeader?: boolean;
  /** Garis pemisah antar baris. */
  rowDividers?: boolean;

  /** Kustom empty state. */
  empty?: React.ReactNode;

  /** Kelas tambahan untuk <table>. */
  className?: string;
};

const thBase =
  "px-4 py-2 text-xs uppercase tracking-widest " +
  "text-[var(--mono-label)] text-left " +
  "border-b border-[var(--mono-border)]";

export default function Table<T>({
  columns,
  data,
  renderRow,
  stickyHeader = false,
  rowDividers = true,
  empty,
  className = "",
}: Props<T>) {
  return (
    <div className="mono w-full overflow-x-auto">
      <table
        className={`w-full border-collapse bg-[var(--mono-bg)] text-[var(--mono-fg)] ${className}`}
      >
        <thead
          className={`${
            stickyHeader ? "sticky top-0 z-10" : ""
          } bg-[var(--mono-bg)]`}
        >
          <tr>
            {columns.map((col, i) => (
              <th
                key={`${col.accessor}-${i}`}
                scope="col"
                className={`${thBase} ${col.className ?? ""} ${
                  col.align === "center"
                    ? "text-center"
                    : col.align === "right"
                    ? "text-right"
                    : "text-left"
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {data.length > 0 ? (
          <tbody
            className={`${
              rowDividers ? "divide-y divide-[var(--mono-border)]" : ""
            }`}
          >
            {data.map((item, idx) => renderRow(item, idx))}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td
                colSpan={Math.max(1, columns.length)}
                className="px-6 py-8 text-center text-sm text-[var(--mono-muted)] border-b border-[var(--mono-border)]"
              >
                {empty ?? "Belum ada data."}
              </td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
}
