"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Group, Stack, Title } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import TextField from "@/shared/ui/inputs/TextField";
import { SimpleTable, type Column } from "@/shared/ui/table/SimpleTable";
import { formatDateTime } from "../utils/format";

/** Item riwayat global (UI-only) */
type HistoryItem = {
  id: string;
  at: string; // ISO time
  who: string; // aktor (user/teknisi)
  ticketId: string;
  ticketCode: string;
  action: "created" | "status_changed" | "resolved" | "commented" | "updated";
  description: string; // ringkas
};

type RangeValue = [Date | null, Date | null];

// Mock UI-only
const MOCK_HISTORY: HistoryItem[] = [
  {
    id: "h4",
    at: "2025-08-27T10:33:00Z",
    who: "tech03",
    ticketId: "3",
    ticketCode: "TCK-2025-000125",
    action: "resolved",
    description: "Ticket diselesaikan (instalasi software).",
  },
  {
    id: "h2",
    at: "2025-08-27T08:01:00Z",
    who: "tech02",
    ticketId: "2",
    ticketCode: "TCK-2025-000124",
    action: "status_changed",
    description: "Status berpindah: Open → In progress.",
  },
  {
    id: "h1",
    at: "2025-08-26T09:12:00Z",
    who: "Andi",
    ticketId: "1",
    ticketCode: "TCK-2025-000123",
    action: "created",
    description: "Ticket dibuat (Keyboard tidak berfungsi).",
  },
  {
    id: "h3",
    at: "2025-08-27T16:47:00Z",
    who: "Dewi",
    ticketId: "4",
    ticketCode: "TCK-2025-000126",
    action: "created",
    description: "Ticket dibuat (Monitor berkedip).",
  },
];

function actionLabel(a: HistoryItem["action"]) {
  switch (a) {
    case "created":
      return "Created";
    case "status_changed":
      return "Status changed";
    case "resolved":
      return "Resolved";
    case "commented":
      return "Commented";
    case "updated":
      return "Updated";
    default:
      return a;
  }
}

export function TicketsHistoryPage() {
  // filter toolbar
  const [q, setQ] = useState("");
  const [range, setRange] = useState<RangeValue>([null, null]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const [start, end] = range;
    const startMs = start ? new Date(start).setHours(0, 0, 0, 0) : null;
    const endMs = end ? new Date(end).setHours(23, 59, 59, 999) : null;

    return MOCK_HISTORY.filter((h) => {
      const t = Date.parse(h.at);
      const matchDate =
        (startMs === null || t >= startMs) && (endMs === null || t <= endMs);
      const matchQ =
        term.length === 0 ||
        h.ticketCode.toLowerCase().includes(term) ||
        h.who.toLowerCase().includes(term) ||
        h.description.toLowerCase().includes(term) ||
        actionLabel(h.action).toLowerCase().includes(term);
      return matchDate && matchQ;
    }).sort((a, b) => Date.parse(b.at) - Date.parse(a.at));
  }, [q, range]);

  type Row = HistoryItem;
  const columns: Column<Row>[] = [
    {
      key: "at",
      header: "Waktu",
      width: 190,
      cell: (r) => formatDateTime(r.at),
    },
    {
      key: "ticket",
      header: "Ticket",
      width: 180,
      cell: (r) => (
        <Link href={`/views/tickets/${encodeURIComponent(r.ticketId)}`}>
          {r.ticketCode}
        </Link>
      ),
    },
    { key: "who", header: "Aktor", width: 140, cell: (r) => r.who },
    {
      key: "action",
      header: "Aksi",
      width: 160,
      cell: (r) => actionLabel(r.action),
    },
    {
      key: "description",
      header: "Deskripsi",
      cell: (r) => r.description,
      width: "40%",
    },
  ];

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={3}>Tickets History</Title>
      </Group>

      {/* Toolbar: cari & rentang tanggal */}
      <Group align="end" wrap="wrap" gap="sm">
        <TextField
          label="Cari"
          placeholder="Kode / aktor / deskripsi / aksi"
          value={q}
          onChange={(e) => setQ(e.currentTarget.value)}
          style={{ minWidth: 260 }}
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

      <SimpleTable<Row>
        dense="sm"
        zebra
        stickyHeader
        maxHeight={520}
        columns={columns}
        data={filtered}
        emptyText="Belum ada riwayat"
      />
    </Stack>
  );
}
