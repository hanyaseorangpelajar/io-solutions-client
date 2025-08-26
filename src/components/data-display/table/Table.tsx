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
  columns: TableColumn[];
  data: T[];
  renderRow: (item: T, index: number) => React.ReactNode;
  /** Teks saat data kosong */
  emptyText?: string;
  /** Pad & tinggi sel lebih rapat */
  dense?: boolean;
  /** Jadikan header lengket saat scroll */
  stickyHeader?: boolean;
  /** Kelas tambahan wrapper (opsional) */
  className?: string;
};

const headBase =
  "text-[11px] uppercase tracking-widest font-medium text-[var(--mono-fg)]";
const cellBase = "align-middle";
const sepBorder = "border-b border-[var(--mono-border)]";

export default function Table<T>({
  columns,
  data,
  renderRow,
  emptyText = "No data",
  dense = false,
  stickyHeader = false,
  className,
}: Props<T>) {
  const pad = dense ? "px-3 py-2" : "px-4 py-3";

  return (
    <div
      className={[
        "mono w-full overflow-x-auto",
        // tidak ada margin/padding eksternal; biar parent yang atur
        className || "",
      ].join(" ")}
      role="region"
      aria-label="Data table"
    >
      <table className="w-full border-collapse">
        <thead
          className={[
            sepBorder,
            stickyHeader
              ? "sticky top-0 z-10 bg-[var(--mono-bg)]"
              : "bg-[var(--mono-bg)]",
          ].join(" ")}
        >
          <tr>
            {columns.map((col, i) => (
              <th
                key={String(col.accessor) + i}
                scope="col"
                className={[
                  headBase,
                  pad,
                  col.className || "",
                  col.align === "center"
                    ? "text-center"
                    : col.align === "right"
                    ? "text-right"
                    : "text-left",
                ].join(" ")}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                className={[
                  pad,
                  cellBase,
                  "text-sm text-[var(--mono-muted)]",
                ].join(" ")}
                colSpan={columns.length}
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((item, idx) => renderRow(item, idx))
          )}
        </tbody>
      </table>
    </div>
  );
}
