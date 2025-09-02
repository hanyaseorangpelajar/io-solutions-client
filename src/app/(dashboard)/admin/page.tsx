"use client";

import Link from "next/link";
import {
  Anchor,
  Badge,
  Button,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";

// Pakai data mock yang sudah ada di fitur terkait
import { MOCK_TICKETS } from "@/features/tickets";
import { INVENTORY_ITEMS } from "@/features/inventory";
import { MOCK_RMAS } from "@/features/rma";

// --- helpers kecil ---
function isOpenStatus(s: any) {
  const v = String(s ?? "").toLowerCase();
  return !(v.includes("closed") || v.includes("resolved"));
}
function priorityColor(p: string) {
  const v = (p ?? "").toString().toLowerCase();
  if (v.includes("urgent") || v.includes("critical")) return "red";
  if (v.includes("high")) return "orange";
  if (v.includes("medium")) return "yellow";
  if (v.includes("low")) return "green";
  return "gray";
}
function statusColor(s: string) {
  const v = (s ?? "").toString().toLowerCase();
  if (v.includes("new") || v.includes("open")) return "blue";
  if (v.includes("progress") || v.includes("work")) return "indigo";
  if (v.includes("hold") || v.includes("pending")) return "yellow";
  if (v.includes("resolved")) return "teal";
  if (v.includes("closed") || v.includes("done")) return "green";
  if (v.includes("cancel")) return "red";
  return "gray";
}
function assigneeName(t: any): string {
  const a = t?.assignee;
  if (!a) return "Unassigned";
  if (typeof a === "string") return a || "Unassigned";
  if (typeof a === "object" && "name" in a && (a as any).name) {
    return String((a as any).name);
  }
  return "Unassigned";
}

export default function AdminDashboardPage() {
  const tickets = (MOCK_TICKETS ?? []) as any[];
  const parts = (INVENTORY_ITEMS ?? []) as any[];
  const rmas = (MOCK_RMAS ?? []) as any[];

  // KPI ringkas
  const kpi = {
    openTickets: tickets.filter((t) => isOpenStatus(t.status)).length,
    lowStock:
      parts.filter((p) => {
        const stock = Number(p?.stock ?? p?.qty ?? 0) || 0;
        const min = Number(p?.minStock ?? p?.reorderPoint ?? 0) || 0;
        return stock <= Math.max(0, min);
      }).length || 0,
    pendingRma:
      rmas.filter((r) => {
        const s = String(r?.status ?? "").toLowerCase();
        return !s.includes("closed");
      }).length || 0,
  };

  // Tiket terbaru (max 8)
  const recentTickets = [...tickets]
    .map((t) => ({
      id: t?.id ?? t?.code ?? "",
      title: t?.title ?? t?.subject ?? "(Tanpa judul)",
      status: t?.status ?? "UNKNOWN",
      priority: t?.priority ?? "—",
      assignee: assigneeName(t),
      createdAt: t?.createdAt ?? Date.now(),
    }))
    .sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return db - da;
    })
    .slice(0, 8);

  // RMA terbaru (max 8) — jika dataset tersedia
  const recentRma = [...rmas]
    .map((r) => ({
      code: r?.code ?? r?.id ?? "",
      customer: r?.customer?.name ?? r?.customer ?? "—",
      status: r?.status ?? "UNKNOWN",
      createdAt: r?.createdAt ?? Date.now(),
    }))
    .sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return db - da;
    })
    .slice(0, 8);

  return (
    <Stack gap="lg">
      {/* Header */}
      <Group justify="space-between" align="center">
        <Stack gap={2}>
          <Title order={3}>Admin Dashboard</Title>
          <Text c="dimmed" size="sm">
            Ringkasan operasional harian dan pintasan aksi.
          </Text>
        </Stack>
        <Group gap="xs" wrap="wrap">
          <Button component={Link} href="/views/tickets" variant="light">
            Kelola Tickets
          </Button>
          <Button component={Link} href="/inventory" variant="light">
            Kelola Inventory
          </Button>
          <Button component={Link} href="/views/misc/rma" variant="light">
            Kelola RMA
          </Button>
        </Group>
      </Group>

      {/* KPI Cards */}
      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        <Paper withBorder radius="md" p="md">
          <Text c="dimmed" size="sm">
            Tickets Open
          </Text>
          <Title order={2}>{kpi.openTickets}</Title>
          <Text size="xs" c="dimmed">
            Perlu tindak lanjut
          </Text>
        </Paper>

        <Paper withBorder radius="md" p="md">
          <Text c="dimmed" size="sm">
            Low / Out of Stock
          </Text>
          <Title order={2}>{kpi.lowStock}</Title>
          <Text size="xs" c="dimmed">
            Item stok menipis/kosong
          </Text>
        </Paper>

        <Paper withBorder radius="md" p="md">
          <Text c="dimmed" size="sm">
            RMA Pending
          </Text>
          <Title order={2}>{kpi.pendingRma}</Title>
          <Text size="xs" c="dimmed">
            Belum closed
          </Text>
        </Paper>
      </SimpleGrid>

      {/* Recent Tickets */}
      <Paper withBorder radius="md" p="md">
        <Group justify="space-between" mb="xs">
          <Text fw={600}>Tickets Terbaru</Text>
          <Anchor component={Link} href="/views/tickets" size="sm">
            Lihat semua
          </Anchor>
        </Group>
        <Table
          striped
          highlightOnHover
          withTableBorder
          withColumnBorders
          stickyHeader
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Judul</Table.Th>
              <Table.Th>Assignee</Table.Th>
              <Table.Th>Prioritas</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Dibuat</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {recentTickets.map((t) => (
              <Table.Tr key={t.id}>
                <Table.Td>
                  <Anchor component={Link} href={`/views/tickets/${t.id}`}>
                    {t.id}
                  </Anchor>
                </Table.Td>
                <Table.Td>{t.title}</Table.Td>
                <Table.Td>{t.assignee}</Table.Td>
                <Table.Td>
                  <Badge color={priorityColor(String(t.priority))}>
                    {String(t.priority)}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Badge color={statusColor(String(t.status))}>
                    {String(t.status)}
                  </Badge>
                </Table.Td>
                <Table.Td>{new Date(t.createdAt).toLocaleString()}</Table.Td>
              </Table.Tr>
            ))}
            {recentTickets.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Text c="dimmed" ta="center">
                    Tidak ada tiket terbaru.
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* Recent RMA */}
      <Paper withBorder radius="md" p="md">
        <Group justify="space-between" mb="xs">
          <Text fw={600}>RMA Terbaru</Text>
          <Anchor component={Link} href="/views/misc/rma" size="sm">
            Lihat semua
          </Anchor>
        </Group>
        <Table
          striped
          highlightOnHover
          withTableBorder
          withColumnBorders
          stickyHeader
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Kode</Table.Th>
              <Table.Th>Pelanggan</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Dibuat</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {recentRma.map((r) => (
              <Table.Tr key={r.code}>
                <Table.Td>{r.code}</Table.Td>
                <Table.Td>{r.customer}</Table.Td>
                <Table.Td>
                  <Badge color={statusColor(String(r.status))}>
                    {String(r.status)}
                  </Badge>
                </Table.Td>
                <Table.Td>{new Date(r.createdAt).toLocaleString()}</Table.Td>
              </Table.Tr>
            ))}
            {recentRma.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={4}>
                  <Text c="dimmed" ta="center">
                    Tidak ada RMA terbaru.
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>
    </Stack>
  );
}
