"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Button,
  Group,
  Paper,
  Stack,
  Table,
  Text,
  TextInput,
  Select,
  Menu,
  ActionIcon,
  Badge,
  LoadingOverlay,
} from "@mantine/core";
import { IconDots, IconEye, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import type { RmaRecord, RmaStatus } from "../model/types";
import RmaStatusBadge from "./RmaStatusBadge";
import RmaFormModal from "./RmaFormModal";
import RmaActionModal from "./RmaActionModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { notifications } from "@mantine/notifications";
import type { RmaFormInput, RmaActionInput } from "../model/schema";
import type { Paginated } from "@/features/tickets/api/tickets";

function dt(v: string | Date | undefined) {
  if (!v) return "-";
  const d = typeof v === "string" ? new Date(v) : v;
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

const STATUS_OPTIONS: { value: RmaStatus | "all"; label: string }[] = [
  { value: "all", label: "Semua status" },
  { value: "new", label: "Baru" },
  { value: "received", label: "Diterima" },
  { value: "sent_to_vendor", label: "Dikirim ke Vendor" },
  { value: "in_vendor", label: "Proses Vendor" },
  { value: "replaced", label: "Diganti" },
  { value: "repaired", label: "Diperbaiki" },
  { value: "returned", label: "Dikembalikan" },
  { value: "rejected", label: "Ditolak" },
  { value: "cancelled", label: "Batal" },
];

export default function RmaListPage() {
  const queryClient = useQueryClient();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<RmaStatus | "all">("all");

  const [createOpen, setCreateOpen] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);
  const [actionTarget, setActionTarget] = useState<RmaRecord | null>(null);

  const {
    data: rmaData,
    isLoading,
    error,
  } = useQuery<Paginated<RmaRecord>>({
    queryKey: ["rma", "list", { q, status }],

    queryFn: async () => {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (status !== "all") params.set("status", status);

      const res = await apiClient.get<{
        results: RmaRecord[];
        page: number;
        limit: number;
        totalResults: number;
        totalPages: number;
      }>(`/rma?${params.toString()}`);

      return {
        data: res.data.results ?? [],
        meta: {
          page: res.data.page ?? 1,
          limit: res.data.limit ?? 10,
          total: res.data.totalResults ?? 0,
          totalPages: res.data.totalPages ?? 0,
        },
      };
    },
  });

  useEffect(() => {
    if (error) {
      notifications.show({
        color: "red",
        title: "Gagal Memuat RMA",
        message: (error as Error).message,
      });
    }
  }, [error]);

  const rows: RmaRecord[] = rmaData?.data ?? [];

  const createRmaMutation = useMutation({
    mutationFn: (payload: RmaFormInput) =>
      apiClient.post<{ data: RmaRecord }>("/rma", payload),
    onSuccess: () => {
      notifications.show({
        color: "green",
        title: "RMA Dibuat",
        message: "RMA baru telah berhasil dibuat.",
      });
      setCreateOpen(false);
      queryClient.invalidateQueries({ queryKey: ["rma", "list"] });
    },
    onError: (e: any) => {
      notifications.show({
        color: "red",
        title: "Gagal Membuat RMA",
        message: e.response?.data?.message || e.message || "Terjadi kesalahan",
      });
    },
  });

  const addActionMutation = useMutation({
    mutationFn: (vars: { id: string; payload: RmaActionInput }) =>
      apiClient.put<{ data: RmaRecord }>(
        `/rma/${vars.id}/actions`,
        vars.payload
      ),
    onSuccess: (response, vars) => {
      notifications.show({
        color: "green",
        title: "Aksi Dicatat",
        message: "Aksi RMA telah berhasil dicatat.",
      });
      setActionOpen(false);
      setActionTarget(null);
      queryClient.invalidateQueries({ queryKey: ["rma", "list"] });
      queryClient.invalidateQueries({ queryKey: ["rma", "detail", vars.id] });
    },
    onError: (e: any) => {
      notifications.show({
        color: "red",
        title: "Gagal Mencatat Aksi",
        message: e.response?.data?.message || e.message || "Terjadi kesalahan",
      });
    },
  });

  const openAction = (row: RmaRecord) => {
    setActionTarget(row);
    setActionOpen(true);
  };

  const detailHref = (id: string) =>
    `/views/misc/rma/${encodeURIComponent(id)}`;

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Stack gap={2}>
          <Text fw={700} fz="lg">
            RMA & Warranty Tracker
          </Text>
          <Text c="dimmed" fz="sm">
            Kelola klaim garansi, status, dan timeline vendor.
          </Text>
        </Stack>
        <Group>
          <TextInput
            placeholder="Cari RMA..."
            value={q}
            onChange={(e) => setQ(e.currentTarget.value)}
            style={{ minWidth: 200 }}
          />
          <Select
            value={status}
            onChange={(v) => setStatus((v as any) ?? "all")}
            data={STATUS_OPTIONS}
            style={{ minWidth: 160 }}
          />
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setCreateOpen(true)}
            disabled={createRmaMutation.isPending}
          >
            Buat RMA
          </Button>
        </Group>
      </Group>

      <Paper withBorder radius="md" style={{ position: "relative" }}>
        <LoadingOverlay visible={isLoading} />
        <Table
          highlightOnHover
          withTableBorder={false}
          withColumnBorders={false}
          stickyHeader
          mah={550}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Kode</Table.Th>
              <Table.Th>Judul</Table.Th>
              <Table.Th>Pelanggan</Table.Th>
              <Table.Th>Produk</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Update Terakhir</Table.Th>
              <Table.Th w={48} />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length === 0 && !isLoading ? (
              <Table.Tr>
                <Table.Td colSpan={7}>
                  <Text c="dimmed" ta="center" py="lg">
                    Tidak ada data RMA.
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              rows.map((r) => (
                <Table.Tr key={r.id}>
                  <Table.Td>
                    <Text
                      component={Link}
                      href={detailHref(r.id)}
                      size="sm"
                      c="blue"
                    >
                      {r.code}
                    </Text>
                  </Table.Td>
                  <Table.Td>{r.title}</Table.Td>
                  <Table.Td>{r.customerName}</Table.Td>
                  <Table.Td>
                    <Text span size="sm">
                      {r.productName}
                    </Text>
                    {r.productSku ? (
                      <Badge variant="light" size="sm" ml={5}>
                        {r.productSku}
                      </Badge>
                    ) : null}
                  </Table.Td>
                  <Table.Td>
                    <RmaStatusBadge status={r.status} />
                  </Table.Td>
                  <Table.Td>
                    <Text c="dimmed" fz="xs">
                      {dt(r.updatedAt)}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Menu withinPortal position="bottom-end">
                      {" "}
                      <Menu.Target>
                        <ActionIcon
                          variant="subtle"
                          color="gray"
                          aria-label="Aksi"
                        >
                          <IconDots size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          component={Link}
                          href={detailHref(r.id)}
                          leftSection={<IconEye size={14} />}
                        >
                          Lihat detail
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item
                          leftSection={<IconPlus size={14} />}
                          onClick={() => openAction(r)}
                          disabled={addActionMutation.isPending}
                        >
                          Catat aksi…
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Paper>

      <RmaFormModal
        opened={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={async (v) => {
          await createRmaMutation.mutateAsync(v);
        }}
        isSubmitting={createRmaMutation.isPending}
      />

      <RmaActionModal
        opened={actionOpen}
        onClose={() => setActionOpen(false)}
        onSubmit={async (v) => {
          if (!actionTarget) return;
          await addActionMutation.mutateAsync({
            id: actionTarget.id,
            payload: v,
          });
        }}
        isSubmitting={addActionMutation.isPending}
      />
    </Stack>
  );
}
