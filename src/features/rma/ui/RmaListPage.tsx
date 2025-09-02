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
} from "@mantine/core";
import { IconDots, IconEye, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { MOCK_RMAS } from "../model/mock";
import type { RmaRecord, RmaStatus } from "../model/types";
import RmaStatusBadge from "./RmaStatusBadge";
import RmaFormModal from "./RmaFormModal";
import RmaActionModal from "./RmaActionModal";

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
  const [rows, setRows] = useState<RmaRecord[]>(() => [...MOCK_RMAS]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<RmaStatus | "all">("all");

  const [createOpen, setCreateOpen] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);
  const [actionTarget, setActionTarget] = useState<RmaRecord | null>(null);

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
              <Table.Tr key={r.id}>
                <Table.Td>
                  {/* HREF konkret, TANPA [id] */}
                  <Link href={`/views/misc/rma/${encodeURIComponent(r.id)}`}>
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
                      {/* Di Menu.Item juga pakai href final */}
                      <Menu.Item
                        component={Link}
                        href={detailHref(r.id)}
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

      {/* Modal: buat RMA */}
      <RmaFormModal
        opened={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={(v) => {
          const now = new Date().toISOString();
          const newRow: RmaRecord = {
            id: `rma-${Date.now()}`,
            code: `RMA-${new Date().getFullYear()}-${(rows.length + 1)
              .toString()
              .padStart(4, "0")}`,
            title: v.title,
            customerName: v.customerName,
            contact: v.contact,
            productName: v.productName,
            productSku: v.productSku,
            ticketId: v.ticketId,
            issueDesc: v.issueDesc,
            warranty: v.warranty,
            status: "new",
            createdAt: now,
            updatedAt: now,
            actions: [],
          };
          setRows((prev) => [newRow, ...prev]);
        }}
      />

      {/* Modal: aksi RMA */}
      <RmaActionModal
        opened={actionOpen}
        onClose={() => setActionOpen(false)}
        onSubmit={(v) => {
          if (!actionTarget) return;
          const now = new Date().toISOString();
          const next = { ...actionTarget };
          next.actions = [
            ...next.actions,
            {
              id: `act-${Date.now()}`,
              type: v.type,
              note: v.note,
              by: "sysadmin",
              at: now,
            },
          ];
          const map: Record<string, RmaStatus> = {
            receive_unit: "received",
            send_to_vendor: "sent_to_vendor",
            vendor_update: "in_vendor",
            replace: "replaced",
            repair: "repaired",
            return_to_customer: "returned",
            reject: "rejected",
            cancel: "cancelled",
          };
          next.status = map[v.type] ?? next.status;
          next.updatedAt = now;

          setRows((prev) => prev.map((r) => (r.id === next.id ? next : r)));
          setActionTarget(null);
        }}
      />
    </Stack>
  );
}
