// File: features/inventory/ui/StockMovementsPage.tsx

"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Group,
  Select,
  Stack,
  Title,
  LoadingOverlay,
  Text,
  Button, // [TAMBAHKAN INI]
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import TextField from "@/shared/ui/inputs/TextField";
import { SimpleTable, type Column } from "@/shared/ui/table/SimpleTable";
import type { StockMovement } from "../model/types";
import { formatDateTime } from "@/features/tickets/utils/format";

import { useQuery } from "@tanstack/react-query";
import { listStockMovements } from "../api/stockMovements";
import { listParts, type Part } from "../api/parts";
import { notifications } from "@mantine/notifications";

type RangeValue = [Date | null, Date | null];

export default function StockMovementsPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<"all" | "in" | "out" | "adjust">("all");
  const [partId, setPartId] = useState<string | "all">("all");
  const [range, setRange] = useState<RangeValue>([null, null]);

  const { data: parts = [], isLoading: isLoadingParts } = useQuery<Part[]>({
    queryKey: ["parts", "list", "forFilter"],
    queryFn: listParts,
  });

  const partOptions = useMemo(() => {
    return [
      { value: "all", label: "Semua part" },
      ...parts.map((p) => ({
        value: p.id,
        label: `${p.name} ${p.sku ? `(${p.sku})` : ""}`,
      })),
    ];
  }, [parts]);

  const {
    data: movementsData,
    isLoading: isLoadingMovements,
    error,
  } = useQuery({
    queryKey: ["stockMovements", "list", { q, type, partId, range }],
    queryFn: () => {
      const [from, to] = range;
      // [PERBAIKAN] Pastikan kita kirim tanggal sebagai objek Date
      const fromISO = from ? new Date(from).toISOString() : undefined;
      const toISO = to ? new Date(to).toISOString() : undefined;

      return listStockMovements({
        q: q || undefined,
        type: type === "all" ? undefined : type,
        partId: partId === "all" ? undefined : partId,
        from: fromISO,
        to: toISO,
      });
    },
  });

  useEffect(() => {
    if (error) {
      notifications.show({
        color: "red",
        title: "Gagal memuat pergerakan stok",
        message: (error as Error).message,
      });
    }
  }, [error]);

  // [PERBAIKAN 1] Sekarang 'movementsData.data' akan terisi dengan benar
  const rows: StockMovement[] = movementsData?.data ?? [];

  const columns: Column<StockMovement>[] = [
    {
      key: "at",
      header: "Waktu",
      width: 180,
      cell: (r) => formatDateTime(r.at),
    },
    { key: "partName", header: "Part", width: "28%", cell: (r) => r.partName },
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
    { key: "by", header: "Oleh", width: 140, cell: (r) => r.by ?? "N/A" },
  ];

  // [FUNGSI BARU]
  const clearFilters = () => {
    setQ("");
    setType("all");
    setPartId("all");
    setRange([null, null]);
  };

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
          // [PERBAIKAN 2] Isi data untuk filter 'Jenis'
          data={[
            { value: "all", label: "Semua Jenis" },
            { value: "in", label: "Masuk (In)" },
            { value: "out", label: "Keluar (Out)" },
            { value: "adjust", label: "Penyesuaian (Adjust)" },
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
          disabled={isLoadingParts}
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
        {/* [BONUS] Tombol clear filter */}
        <Button variant="light" onClick={clearFilters}>
          Bersihkan Filter
        </Button>
      </Group>

      <div style={{ position: "relative" }}>
        <LoadingOverlay visible={isLoadingMovements} />
        <SimpleTable<StockMovement>
          dense="sm"
          zebra
          stickyHeader
          maxHeight={540}
          columns={columns}
          data={rows}
          emptyText="Belum ada mutasi"
        />
      </div>
    </Stack>
  );
}
