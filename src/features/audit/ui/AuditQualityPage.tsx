"use client";

import { useMemo, useState, useEffect } from "react";
import { SimpleTable, type Column } from "@/shared/ui/table/SimpleTable";
import type { AuditLogItem, AuditStatus } from "../model/types";
import { listAudits, deleteAudit } from "../api/audits";
import { notifications } from "@mantine/notifications";
import type { Paginated } from "@/features/tickets/api/tickets";
import Link from "next/link";
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Menu,
  Paper,
  Select,
  Stack,
  Text,
  Title,
  LoadingOverlay,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { DatePickerInput } from "@mantine/dates";
import { IconDots, IconEye, IconTrash } from "@tabler/icons-react";
import TextField from "@/shared/ui/inputs/TextField";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDateTime } from "@/features/tickets/utils/format";
import { downloadCSV } from "@/shared/utils/csv";

type RangeValue = [Date | null, Date | null];

const AuditStatusBadge = ({ status }: { status: AuditStatus }) => {
  const colorMap: Record<AuditStatus, string> = {
    draft: "gray",
    approved: "green",
    rejected: "red",
  };
  return (
    <Badge color={colorMap[status] || "dark"} variant="light">
      {status.toUpperCase()}
    </Badge>
  );
};

export default function AuditQualityPage() {
  const queryClient = useQueryClient();

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<AuditStatus | "all">("all");
  const [range, setRange] = useState<RangeValue>([null, null]);

  const {
    data: auditData,
    isLoading,
    error,
  } = useQuery<Paginated<AuditLogItem>>({
    queryKey: ["audits", "list", { q, status: statusFilter, range }],
    queryFn: () => {
      const [from, to] = range;

      const fromISO = from ? new Date(from).toISOString() : undefined;
      const toISO = to ? new Date(to).toISOString() : undefined;

      return listAudits({
        q: q || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
        from: fromISO,
        to: toISO,
      });
    },
  });

  useEffect(() => {
    if (error) {
      notifications.show({
        color: "red",
        title: "Gagal memuat data audit",
        message: (error as Error).message,
      });
    }
  }, [error]);

  const rows: AuditLogItem[] = auditData?.data ?? [];

  const clearFilters = () => {
    setQ("");
    setStatusFilter("all");
    setRange([null, null]);
  };

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: deleteAudit,
    onSuccess: (_, deletedId) => {
      notifications.show({
        color: "green",
        title: "Audit Dihapus",
        message: `Record audit berhasil dihapus.`,
      });
      queryClient.setQueryData(
        ["audits", "list", { q, status: statusFilter, range }],
        (oldData: Paginated<AuditLogItem> | undefined) => {
          if (!oldData || !oldData.data) return oldData;
          return {
            ...oldData,
            data: oldData.data.filter((a: AuditLogItem) => a.id !== deletedId),
          };
        }
      );
    },
    onError: (e: any) => {
      notifications.show({
        color: "red",
        title: "Gagal Hapus",
        message: e.message,
      });
    },
  });

  const columns: Column<AuditLogItem>[] = [
    {
      key: "at",
      header: "Tanggal Review",
      width: 180,
      cell: (r: AuditLogItem) => formatDateTime(r.at),
    },
    {
      key: "ticket",
      header: "Ticket",
      width: 160,
      cell: (r: AuditLogItem) => (
        <Text
          component={Link}
          href={`/views/tickets/${encodeURIComponent(r.ticketId)}`}
          size="sm"
          c="blue"
        >
          {r.ticketCode}
        </Text>
      ),
    },
    {
      key: "reviewer",
      header: "Reviewer",
      width: 150,
      cell: (r: AuditLogItem) => r.who ?? "N/A",
    },
    {
      key: "score",
      header: "Skor",
      width: 80,
      align: "center",
      cell: (r: AuditLogItem) => r.score?.toString() ?? "-",
    },
    {
      key: "status",
      header: "Status",
      width: 120,
      align: "center",
      cell: (r: AuditLogItem) => <AuditStatusBadge status={r.action} />,
    },
    {
      key: "notes",
      header: "Catatan",
      cell: (r: AuditLogItem) => r.description ?? "-",
    },
    {
      key: "actions",
      header: "",
      align: "right",
      width: 60,
      cell: (r: AuditLogItem) => (
        <Menu withinPortal position="bottom-end" shadow="sm">
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray">
              <IconDots size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEye size={14} />}
              component={Link}
              href={`/views/tickets/${encodeURIComponent(r.ticketId)}`}
            >
              Lihat Tiket
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              color="red"
              leftSection={<IconTrash size={14} />}
              onClick={() => {
                modals.openConfirmModal({
                  title: "Hapus Audit?",
                  children: (
                    <Text size="sm">
                      Yakin hapus audit untuk tiket{" "}
                      <strong>{r.ticketCode}</strong>?
                    </Text>
                  ),
                  labels: { confirm: "Hapus", cancel: "Batal" },
                  confirmProps: {
                    color: "red",
                    loading: deleteMutation.isPending,
                  },
                  onConfirm: () => deleteMutation.mutate(r.id),
                });
              }}
              disabled={deleteMutation.isPending}
            >
              Hapus Audit
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];

  const isMutating = deleteMutation.isPending;

  return (
    <Stack gap="md">
      <Group align="end" wrap="wrap" gap="sm">
        <TextField
          label="Cari"
          placeholder="Kode Tiket / Catatan"
          value={q}
          onChange={(e) => setQ(e.currentTarget.value)}
          style={{ minWidth: 260 }}
        />
        <Select
          label="Status Audit"
          data={[
            { value: "all", label: "Semua" },
            { value: "draft", label: "Draft" },
            { value: "approved", label: "Approved" },
            { value: "rejected", label: "Rejected" },
          ]}
          value={statusFilter}
          onChange={(v) => setStatusFilter((v as any) ?? "all")}
          style={{ minWidth: 160 }}
        />
        <DatePickerInput
          type="range"
          label="Rentang Tanggal Review"
          placeholder="Pilih tanggal"
          value={range}
          onChange={(v) => setRange(v as RangeValue)}
          style={{ minWidth: 260 }}
          popoverProps={{ withinPortal: true }}
        />
        <Button variant="light" onClick={clearFilters}>
          Bersihkan Filter
        </Button>
      </Group>

      <div style={{ position: "relative" }}>
        <LoadingOverlay visible={isLoading || isMutating} />
        <SimpleTable<AuditLogItem>
          dense="sm"
          zebra
          stickyHeader
          maxHeight={540}
          columns={columns}
          data={rows}
          emptyText="Belum ada data audit"
        />
      </div>
    </Stack>
  );
}
