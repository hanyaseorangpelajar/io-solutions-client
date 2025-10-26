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

import { MOCK_TICKETS, type Ticket } from "@/features/tickets";
import { INVENTORY_ITEMS, type Part } from "@/features/inventory";
import { MOCK_RMAS, type Rma } from "@/features/rma";
import {
  getAssigneeName,
  priorityColor,
  statusColor,
} from "@/shared/utils/formatters";
import { formatDateTime } from "@/features/tickets/utils/format";

// --- helpers kecil ---
function isOpenStatus(s: any) {
  const v = String(s ?? "").toLowerCase();
  return !(v.includes("closed") || v.includes("resolved"));
}

export default function AdminDashboardPage() {
  const tickets: Ticket[] = MOCK_TICKETS ?? [];
  const parts: Part[] = INVENTORY_ITEMS ?? [];
  const rmas: Rma[] = MOCK_RMAS ?? [];

  // KPI ringkas
  const kpi = {
    openTickets: tickets.filter((t) => isOpenStatus(t.status)).length,
    lowStock:
      parts.filter((p) => {
        const stock = p.stock ?? 0;
        const min = p.minStock ?? 0;
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
      id: t.id,
      title: t.subject,
      status: t.status,
      priority: t.priority,
      assignee: getAssigneeName(t),
      createdAt: t.createdAt,
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
      code: r.code,
      customer: r.customer.name,
      status: r.status,
      createdAt: r.createdAt,
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
                    {t.priority}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Badge color={statusColor(String(t.status))}>
                    {t.status}
                  </Badge>
                </Table.Td>
                <Table.Td>{formatDateTime(t.createdAt)}</Table.Td>
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
                  <Badge color={statusColor(r.status)}>{r.status}</Badge>
                </Table.Td>
                <Table.Td>{formatDateTime(r.createdAt)}</Table.Td>
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
