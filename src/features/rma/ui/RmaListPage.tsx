"use client";

import { useMemo, useState } from "react";
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

function dt(v: string | Date) {
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

  const { data: rows = [], isLoading } = useQuery<RmaRecord[]>({
    queryKey: ["rma", "list"],
    queryFn: async () => {
      const res = await apiClient.get("/rma");
      return res.data?.data || [];
    },
  });

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const okStatus = status === "all" ? true : r.status === status;
      const hay = (
        r.code +
        r.title +
        r.customerName +
        r.productName
      ).toLowerCase();
      const okQ = q.trim() === "" ? true : hay.includes(q.toLowerCase());
      return okStatus && okQ;
    });
  }, [rows, q, status]);

  const createRmaMutation = useMutation({
    mutationFn: (payload: RmaFormInput) => apiClient.post("/rma", payload),
    onSuccess: () => {
      notifications.show({
        color: "green",
        title: "RMA Dibuat",
        message: "RMA baru telah berhasil dibuat.",
      });
      queryClient.invalidateQueries({ queryKey: ["rma", "list"] });
    },
    onError: (e: any) => {
      notifications.show({
        color: "red",
        title: "Gagal Membuat RMA",
        message: e.message,
      });
    },
  });

  const addActionMutation = useMutation({
    mutationFn: (vars: { id: string; payload: RmaActionInput }) =>
      apiClient.post(`/rma/${vars.id}/actions`, vars.payload),
    onSuccess: (data, vars) => {
      notifications.show({
        color: "green",
        title: "Aksi Dicatat",
        message: "Aksi RMA telah berhasil dicatat.",
      });
      queryClient.invalidateQueries({ queryKey: ["rma", "list"] });
      queryClient.invalidateQueries({ queryKey: ["rma", "detail", vars.id] });
    },
    onError: (e: any) => {
      notifications.show({
        color: "red",
        title: "Gagal Mencatat Aksi",
        message: e.message,
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
          />
          <Select
            value={status}
            onChange={(v) => setStatus((v as any) ?? "all")}
            data={STATUS_OPTIONS}
          />
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setCreateOpen(true)}
          >
            Buat RMA
          </Button>
        </Group>
      </Group>

      <Paper withBorder radius="md" p="sm">
        <Table
          highlightOnHover
          withTableBorder={false}
          withColumnBorders={false}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Kode</Table.Th>
              <Table.Th>Judul</Table.Th>
              <Table.Th>Pelanggan</Table.Th>
              <Table.Th>Produk</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Update</Table.Th>
              <Table.Th w={48} />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filtered.map((r) => (
              <Table.Tr key={r._id}>
                <Table.Td>
                  <Link href={`/views/misc/rma/${encodeURIComponent(r._id)}`}>
                    {r.code}
                  </Link>
                </Table.Td>
                <Table.Td>{r.title}</Table.Td>
                <Table.Td>{r.customerName}</Table.Td>
                <Table.Td>
                  <Text span>{r.productName}</Text>{" "}
                  {r.productSku ? (
                    <Badge variant="light">{r.productSku}</Badge>
                  ) : null}
                </Table.Td>
                <Table.Td>
                  <RmaStatusBadge status={r.status} />
                </Table.Td>
                <Table.Td>
                  <Text c="dimmed" fz="sm">
                    {dt(r.updatedAt)}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Menu withinPortal>
                    <Menu.Target>
                      <ActionIcon variant="subtle" aria-label="Aksi">
                        <IconDots size={18} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        component={Link}
                        href={detailHref(r._id)}
                        leftSection={<IconEye size={16} />}
                      >
                        Lihat detail
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item onClick={() => openAction(r)}>
                        Catat aksi…
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              </Table.Tr>
            ))}
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
            id: actionTarget._id,
            payload: v,
          });
          setActionTarget(null);
        }}
        isSubmitting={addActionMutation.isPending}
      />
    </Stack>
  );
}
