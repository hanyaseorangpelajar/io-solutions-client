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
  // Table, // Tidak dipakai
  Text,
  Title,
  LoadingOverlay,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { DatePickerInput } from "@mantine/dates";
import {
  IconDots,
  IconEye,
  // IconPencil,
  IconTrash,
  // IconFilter,
} from "@tabler/icons-react";
import TextField from "@/shared/ui/inputs/TextField";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDateTime } from "@/features/tickets/utils/format";
import { downloadCSV } from "@/shared/utils/csv";

type RangeValue = [Date | null, Date | null];

// Helper Badge
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

  // Filters
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<AuditStatus | "all">("all");
  const [range, setRange] = useState<RangeValue>([null, null]);

  // Fetch data
  const {
    data: auditData,
    isLoading,
    error,
  } = useQuery<Paginated<AuditLogItem>>({
    queryKey: ["audits", "list", { q, status: statusFilter, range }],
    queryFn: () => {
      const [from, to] = range;
      return listAudits({
        q: q || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
        from: from ? from.toISOString() : undefined,
        to: to ? to.toISOString() : undefined,
      });
    }, // <-- PERBAIKAN: Hapus koma berlebih di sini
  });

  // Handle error fetch
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

  // Export CSV
  const exportCSV = () => {
    /* ... (sama) ... */
  };

  // Delete Mutation
  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: deleteAudit,
    onSuccess: (_, deletedId) => {
      notifications.show({
        color: "green",
        title: "Audit Dihapus",
        message: `Record audit berhasil dihapus.`,
      });
      queryClient.setQueryData(
        ["audits", "list"],
        (oldData: Paginated<AuditLogItem> | undefined) => {
          if (!oldData || !oldData.data) return oldData;
          return {
            ...oldData,
            data: oldData.data.filter((a: AuditLogItem) => a.id !== deletedId),
            // totalResults: (oldData.totalResults ?? 1) -1 // Asumsi Paginated punya totalResults
          };
        }
      );
    },
    onError: (e: any) => {
      /* ... (sama) ... */
    },
  });

  // --- Kolom Tabel ---
  // PERBAIKAN: Gunakan AuditLogItem di sini
  const columns: Column<AuditLogItem>[] = [
    {
      key: "at",
      header: "Tanggal Review",
      width: 180,
      cell: (r: AuditLogItem) => formatDateTime(r.at), // Gunakan AuditLogItem
    },
    {
      key: "ticket",
      header: "Ticket",
      width: 160,
      cell: (
        r: AuditLogItem // Gunakan AuditLogItem
      ) => (
        <Link href={`/views/tickets/${encodeURIComponent(r.ticketId)}`}>
          {r.ticketCode}
        </Link>
      ),
    },
    {
      key: "reviewer",
      header: "Reviewer",
      width: 150,
      cell: (r: AuditLogItem) => r.who ?? "N/A", // Gunakan AuditLogItem
    },
    {
      key: "score",
      header: "Skor",
      width: 80,
      align: "center",
      cell: (r: AuditLogItem) => r.score?.toString() ?? "-", // Gunakan AuditLogItem
    },
    {
      key: "status",
      header: "Status",
      width: 120,
      align: "center",
      cell: (r: AuditLogItem) => <AuditStatusBadge status={r.action} />, // Gunakan AuditLogItem
    },
    {
      key: "notes",
      header: "Catatan",
      cell: (r: AuditLogItem) => r.description ?? "-",
    }, // Gunakan AuditLogItem
    {
      key: "actions",
      header: "",
      align: "right",
      width: 60,
      cell: (
        r: AuditLogItem // Gunakan AuditLogItem
      ) => (
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
      {/* ... (Header, Toolbar sama) ... */}

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
