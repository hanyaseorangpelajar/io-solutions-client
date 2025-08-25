import * as React from "react";

const Table = ({
  columns,
  renderRow,
  data,
}: {
  columns: { header: string; accessor: string; className?: string }[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
}) => {
  return (
    <div className="w-full mt-4 overflow-x-auto">
      <table className="w-full border border-black border-collapse bg-white text-black">
        <thead>
          <tr className="bg-black text-white">
            {columns.map((col) => (
              <th
                key={col.accessor}
                className={[
                  "px-4 py-3 text-left font-medium",
                  col.className || "",
                ].join(" ")}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-black">
          {data.map((item) => renderRow(item))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
