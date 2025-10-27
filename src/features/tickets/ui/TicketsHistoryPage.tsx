"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  Group,
  Stack,
  Title,
  LoadingOverlay,
  Text,
  Badge,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import TextField from "@/shared/ui/inputs/TextField";
import { SimpleTable, type Column } from "@/shared/ui/table/SimpleTable";
import { formatDateTime } from "../utils/format";

import { useQuery } from "@tanstack/react-query";
import { getGlobalAuditLog, type AuditLogEvent } from "../api/tickets";
import { notifications } from "@mantine/notifications";

type Row = AuditLogEvent;

function auditActionLabel(action: Row["action"]): {
  label: string;
  color: string;
} {
  switch (action) {
    case "approved":
      return { label: "Approved", color: "green" };
    case "rejected":
      return { label: "Rejected", color: "red" };
    case "draft":
      return { label: "Draft", color: "gray" };
    default:
      return { label: action, color: "dark" };
  }
}

type RangeValue = [Date | null, Date | null];

export function TicketsHistoryPage() {
  const [q, setQ] = useState("");
  const [range, setRange] = useState<RangeValue>([null, null]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["audits", "list", { q, range }],
    queryFn: () => {
      const [from, to] = range;
      return getGlobalAuditLog({
        q: q || undefined,
        from: from ? from.toISOString() : undefined,
        to: to ? to.toISOString() : undefined,
      });
    },
  });

  useEffect(() => {
    if (error) {
      notifications.show({
        color: "red",
        title: "Gagal memuat riwayat audit",
        message: (error as Error).message,
      });
    }
  }, [error]);

  const rows: Row[] = data?.data ?? [];
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
    { key: "who", header: "Reviewer", width: 140, cell: (r) => r.who },
    {
      key: "action",
      header: "Status Audit",
      width: 160,
      cell: (r) => {
        const { label, color } = auditActionLabel(r.action);
        return (
          <Badge color={color} variant="light">
            {label}
          </Badge>
        );
      },
    },
    {
      key: "description",
      header: "Catatan (Notes)",
      cell: (r) => r.description,
      width: "40%",
    },
  ];

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={3}>Audit Log</Title>
      </Group>

      <Group align="end" wrap="wrap" gap="sm">
        <TextField
          label="Cari"
          placeholder="Kode tiket / catatan"
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

      <div style={{ position: "relative" }}>
        <LoadingOverlay visible={isLoading} />
        <SimpleTable<Row>
          dense="sm"
          zebra
          stickyHeader
          maxHeight={520}
          columns={columns}
          data={rows}
          emptyText="Belum ada riwayat audit"
        />
      </div>
    </Stack>
  );
}
