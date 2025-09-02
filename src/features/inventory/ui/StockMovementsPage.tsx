"use client";

import { useMemo, useState } from "react";
import { Group, Select, Stack, Title } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import TextField from "@/shared/ui/inputs/TextField";
import { SimpleTable, type Column } from "@/shared/ui/table/SimpleTable";
import { STOCK_MOVES, INVENTORY_ITEMS } from "../model/mock";
import type { StockMovement } from "../model/types";
import { formatDateTime } from "@/features/tickets/utils/format";

type RangeValue = [Date | null, Date | null];

export default function StockMovementsPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<"all" | "in" | "out" | "adjust">("all");
  const [partId, setPartId] = useState<string | "all">("all");
  const [range, setRange] = useState<RangeValue>([null, null]);
  const [moves] = useState<StockMovement[]>(STOCK_MOVES);

  const partOptions = useMemo(() => {
    return [
      { value: "all", label: "Semua part" },
      ...INVENTORY_ITEMS.map((p) => ({
        value: p.id,
        label: `${p.name} ${p.sku ? `(${p.sku})` : ""}`,
      })),
    ];
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const [start, end] = range;
    const startMs = start ? new Date(start).setHours(0, 0, 0, 0) : null;
    const endMs = end ? new Date(end).setHours(23, 59, 59, 999) : null;
    return moves.filter((m) => {
      const matchQ =
        term.length === 0 ||
        m.partName.toLowerCase().includes(term) ||
        (m.ref ?? "").toLowerCase().includes(term) ||
        (m.note ?? "").toLowerCase().includes(term);
      const matchT = type === "all" ? true : m.type === type;
      const matchP = partId === "all" ? true : m.partId === partId;
      const t = Date.parse(m.at);
      const matchD =
        (startMs === null || t >= startMs) && (endMs === null || t <= endMs);
      return matchQ && matchT && matchP && matchD;
    });
  }, [moves, q, type, partId, range]);

  const columns: Column<StockMovement>[] = [
    {
      key: "at",
      header: "Waktu",
      width: 180,
      cell: (r) => formatDateTime(r.at),
    },
    { key: "part", header: "Part", width: "28%", cell: (r) => r.partName },
    {
      key: "type",
      header: "Jenis",
      width: 100,
      align: "center",
      cell: (r) => r.type.toUpperCase(),
    },
    {
      key: "qty",
      header: "Qty",
      width: 80,
      align: "right",
      cell: (r) => r.qty.toString(),
    },
    { key: "ref", header: "Ref", width: 140, cell: (r) => r.ref ?? "-" },
    { key: "note", header: "Catatan", cell: (r) => r.note ?? "-" },
  ];

  return (
    <Stack gap="md">
      <Title order={3}>Stock Movements</Title>

      <Group align="end" wrap="wrap" gap="sm">
        <TextField
          label="Cari"
          placeholder="Part / ref / catatan"
          value={q}
          onChange={(e) => setQ(e.currentTarget.value)}
          style={{ minWidth: 260 }}
        />
        <Select
          label="Jenis"
          data={[
            { value: "all", label: "Semua" },
            { value: "in", label: "Stock In" },
            { value: "out", label: "Stock Out" },
            { value: "adjust", label: "Adjust" },
          ]}
          value={type}
          onChange={(v) => setType((v as any) ?? "all")}
          style={{ minWidth: 160 }}
        />
        <Select
          label="Part"
          data={partOptions}
          value={partId}
          onChange={(v) => setPartId((v as any) ?? "all")}
          searchable
          style={{ minWidth: 240 }}
        />
        <DatePickerInput
          type="range"
          label="Rentang tanggal"
          value={range}
          onChange={(v) => setRange(v as RangeValue)}
          style={{ minWidth: 260 }}
          popoverProps={{ withinPortal: true }}
        />
      </Group>

      <SimpleTable<StockMovement>
        dense="sm"
        zebra
        stickyHeader
        maxHeight={540}
        columns={columns}
        data={filtered}
        emptyText="Belum ada mutasi"
      />
    </Stack>
  );
}
