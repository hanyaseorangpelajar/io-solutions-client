import * as React from "react";

type Column = { header: string; accessor: string; className?: string };

type TableProps<T> = {
  columns: Column[];
  data: T[];
  renderRow: (item: T, index: number) => React.ReactNode;
  className?: string;
  emptyText?: string;
  dense?: boolean; // true = padding lebih rapat
};

const Table = <T,>({
  columns,
  data,
  renderRow,
  className,
  emptyText = "No data",
  dense = false,
}: TableProps<T>) => {
  const cellPad = dense ? "px-3 py-2" : "px-4 py-3";

  return (
    <div className="w-full mt-4 overflow-x-auto">
      <table
        className={[
          "w-full border border-gray-200 dark:border-neutral-800",
          "border-collapse text-sm bg-white dark:bg-neutral-900",
          className,
        ].join(" ")}
      >
        <thead className="text-left text-gray-500 dark:text-neutral-400">
          <tr className="border-b border-gray-200 dark:border-neutral-800">
            {columns.map((col) => (
              <th
                key={col.accessor}
                scope="col"
                className={[
                  cellPad,
                  "font-medium align-middle",
                  // header tetap flat + monochrome; sticky opsional jika parent punya height & overflow
                  "bg-white dark:bg-neutral-900",
                  col.className || "",
                ].join(" ")}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 dark:divide-neutral-800">
          {data.length === 0 ? (
            <tr>
              <td
                className={`${cellPad} text-gray-500 dark:text-neutral-400`}
                colSpan={columns.length}
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((item, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
              >
                {renderRow(item, idx)}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
