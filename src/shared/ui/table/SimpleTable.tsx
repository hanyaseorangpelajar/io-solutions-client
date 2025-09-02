"use client";

import { Table, ScrollArea, rem } from "@mantine/core";
import { Fragment } from "react";

export type Column<T> = {
  key: string;
  header: React.ReactNode;
  cell: (row: T, rowIndex: number) => React.ReactNode;
  width?: number | string;
  align?: "left" | "center" | "right";
};

export type SimpleTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  emptyText?: string;
  stickyHeader?: boolean;
  zebra?: boolean;
  dense?: "sm" | "md";
  maxHeight?: number; // px
};

export function SimpleTable<T>({
  data,
  columns,
  emptyText = "Tidak ada data",
  stickyHeader = true,
  zebra = true,
  dense = "md",
  maxHeight = 520,
}: SimpleTableProps<T>) {
  return (
    <ScrollArea h={maxHeight} type="auto">
      <Table
        highlightOnHover
        striped={zebra}
        withTableBorder
        horizontalSpacing={dense === "sm" ? "xs" : "sm"}
        verticalSpacing={dense === "sm" ? "xs" : "sm"}
      >
        <Table.Thead
          style={
            stickyHeader
              ? {
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                  background:
                    "light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))",
                }
              : undefined
          }
        >
          <Table.Tr>
            {columns.map((c) => (
              <Table.Th
                key={c.key}
                style={{
                  width: c.width,
                  textAlign: c.align,
                  borderBottom: `${rem(1)} solid var(--mantine-color-mono-7)`,
                }}
              >
                {c.header}
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {data.length === 0 ? (
            <Table.Tr>
              <Table.Td
                colSpan={columns.length}
                style={{ textAlign: "center", fontStyle: "italic" }}
              >
                {emptyText}
              </Table.Td>
            </Table.Tr>
          ) : (
            data.map((row, i) => (
              <Fragment key={(row as any).id ?? i}>
                <Table.Tr>
                  {columns.map((c) => (
                    <Table.Td key={c.key} style={{ textAlign: c.align }}>
                      {c.cell(row, i)}
                    </Table.Td>
                  ))}
                </Table.Tr>
              </Fragment>
            ))
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
