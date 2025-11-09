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
  Pagination,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import TextField from "@/shared/ui/inputs/TextField";
import { SimpleTable, type Column } from "@/shared/ui/table/SimpleTable";
import { formatDateTime } from "../utils/format";

import { useQuery } from "@tanstack/react-query";
import {
  getGlobalTicketHistory,
  type TicketHistoryEvent,
  type Paginated,
} from "../api/tickets";
import TicketStatusBadge from "./TicketStatusBadge";
import { notifications } from "@mantine/notifications";
import { useAuth } from "@/features/auth";

type Row = TicketHistoryEvent;
type RangeValue = [Date | null, Date | null];

export default function TicketsHistoryPage() {
  const [q, setQ] = useState("");
  const [range, setRange] = useState<RangeValue>([null, null]);
  const { user, isLoading: isLoadingUser } = useAuth();

  const [page, setPage] = useState(1);
  const PAGE_LIMIT = 20;

  useEffect(() => {
    setPage(1);
  }, [q, range]);

  const { data, isLoading, error } = useQuery<Paginated<TicketHistoryEvent>>({
    queryKey: [
      "tickets",
      "history",
      "list",
      { q, range, userId: user?.id, page, PAGE_LIMIT },
    ],
    queryFn: () => {
      const [from, to] = range;

      const params: Record<string, any> = {
        q: q || undefined,
        from: from ? from.toISOString() : undefined,
        to: to ? to.toISOString() : undefined,
        page: page,
        limit: PAGE_LIMIT,
      };

      return getGlobalTicketHistory(params);
    },
    enabled: !isLoadingUser,
    placeholderData: (prev) => prev,
  });

  useEffect(() => {
    if (error) {
      notifications.show({
        color: "red",
        title: "Gagal memuat riwayat tiket",
        message: (error as Error).message,
      });
    }
  }, [error]);

  const rows: Row[] = data?.data ?? [];
  const totalResults = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  const columns: Column<Row>[] = [
    {
      key: "at",
      header: "Waktu",
      width: 190,
      cell: (r) => formatDateTime(r.at),
    },
    {
      key: "ticket",
      header: "Tiket",
      width: 180,
      cell: (r) => (
        <Link href={`/views/tickets/${encodeURIComponent(r.ticketId)}`}>
          {r.ticketCode}
        </Link>
      ),
    },
    {
      key: "teknisi",
      header: "Teknisi",
      width: 160,
      cell: (r) => r.teknisiName ?? "-",
    },
    {
      key: "status",
      header: "Status Baru",
      width: 160,
      cell: (r) => <TicketStatusBadge status={r.newStatus} />,
    },
    {
      key: "description",
      header: "Catatan",
      cell: (r) => r.note ?? "-",
      width: "40%",
    },
  ];

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={3}>Riwayat Status Tiket</Title>
      </Group>

      <Group align="end" wrap="wrap" gap="sm">
        <TextField
          label="Cari"
          placeholder="Kode tiket, status, catatan..."
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
        <LoadingOverlay visible={isLoading || isLoadingUser} />
        <SimpleTable<Row>
          dense="sm"
          zebra
          stickyHeader
          maxHeight={520}
          columns={columns}
          data={rows}
          emptyText="Belum ada riwayat status tiket"
        />
      </div>

      <Group justify="space-between" align="center" mt="md">
        <Text size="sm" c="dimmed">
          Menampilkan {rows.length} dari {totalResults} log
        </Text>
        <Pagination
          total={totalPages}
          value={page}
          onChange={setPage}
          disabled={totalPages <= 1}
        />
      </Group>
    </Stack>
  );
}
