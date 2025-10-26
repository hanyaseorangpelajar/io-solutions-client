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
import {
  getAssigneeName,
  priorityColor,
  statusColor,
} from "@/shared/utils/formatters";
import { formatDateTime } from "@/features/tickets/utils/format";

// ———————————————————————————————————————————————
// GANTI fungsi ini ke integrasi auth milikmu (mis. NextAuth/getServerSession)
// Di sini sementara mock agar UI langsung jalan.
function getSessionUser() {
  return {
    id: "tech-1",
    name: "Technician A",
    role: "technician",
  };
}
// ———————————————————————————————————————————————

function normalizeAssigneeId(t: any): string | null {
  const a = t?.assignee;
  if (!a) return null;
  // Asumsi assignee bisa berupa string (id) atau object { id, name }
  if (typeof a === "string") return a;
  if (typeof a === "object" && "id" in a && (a as any).id) {
    return String((a as any).id);
  }
  return null;
}

function isOpenStatus(s: any) {
  const v = String(s ?? "").toLowerCase();
  return !(v.includes("closed") || v.includes("resolved"));
}

export default function TechnicianDashboardPage() {
  const user = getSessionUser();
  const tickets: Ticket[] = MOCK_TICKETS ?? [];

  // Tickets yang ditugaskan ke teknisi yang sedang login (match by id atau by name)
  const myTickets = tickets.filter((t) => {
    const aid = normalizeAssigneeId(t);
    const aname = getAssigneeName(t);
    return aid === user.id || aname === user.name;
  });

  const myOpen = myTickets.filter((t) => isOpenStatus(t.status));
  const myInProgress = myTickets.filter((t) =>
    String(t.status ?? "")
      .toLowerCase()
      .includes("progress")
  );
  const myResolved = myTickets.filter((t) => {
    const rb = t?.resolution?.resolvedBy;
    if (!rb) return false;
    if (typeof rb === "string") return rb === user.name;
    if (typeof rb === "object") {
      const rid = "id" in rb ? String(rb.id) : null;
      const rname = "name" in rb ? String(rb.name) : null;
      return rid === user.id || rname === user.name;
    }
    return false;
  });

  const recentAssigned = [...myOpen]
    .map((t) => ({
      id: t.id,
      title: t.subject,
      status: t.status,
      priority: t.priority,
      createdAt: t.createdAt,
    }))
    .sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return db - da;
    })
    .slice(0, 8);

  const recentResolved = [...myResolved]
    .map((t) => ({
      id: t.id,
      title: t.subject,
      resolvedAt: t.resolution?.resolvedAt ?? new Date().toISOString(),
      priority: t.priority,
    }))
    .sort((a, b) => {
      const da = new Date(a.resolvedAt).getTime();
      const db = new Date(b.resolvedAt).getTime();
      return db - da;
    })
    .slice(0, 8);

  return (
    <Stack gap="lg">
      {/* Header */}
      <Group justify="space-between" align="center">
        <Stack gap={2}>
          <Title order={3}>Dashboard Teknisi</Title>
          <Text c="dimmed" size="sm">
            Hai, {user.name}. Berikut ringkasan pekerjaanmu.
          </Text>
        </Stack>
        <Group gap="xs" wrap="wrap">
          <Button
            component={Link}
            href="/views/tickets/my-work"
            variant="light"
          >
            Lihat My Work
          </Button>
          <Button
            component={Link}
            href="/views/tickets/history"
            variant="light"
          >
            Riwayat Ticket
          </Button>
        </Group>
      </Group>

      {/* KPI ringkas */}
      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        <Paper withBorder radius="md" p="md">
          <Text c="dimmed" size="sm">
            Tickets ditugaskan
          </Text>
          <Title order={2}>{myTickets.length}</Title>
          <Text size="xs" c="dimmed">
            Total semua status
          </Text>
        </Paper>
        <Paper withBorder radius="md" p="md">
          <Text c="dimmed" size="sm">
            Sedang dikerjakan
          </Text>
          <Title order={2}>{myInProgress.length}</Title>
          <Text size="xs" c="dimmed">
            Status in progress
          </Text>
        </Paper>
        <Paper withBorder radius="md" p="md">
          <Text c="dimmed" size="sm">
            Sudah diselesaikan
          </Text>
          <Title order={2}>{myResolved.length}</Title>
          <Text size="xs" c="dimmed">
            Ticket yang kamu resolve
          </Text>
        </Paper>
      </SimpleGrid>

      {/* Daftar tugas aktif */}
      <Paper withBorder radius="md" p="md">
        <Group justify="space-between" mb="xs">
          <Text fw={600}>Tugas Aktif Saya</Text>
          <Anchor component={Link} href="/views/tickets/my-work" size="sm">
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
              <Table.Th>Prioritas</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Dibuat</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {recentAssigned.map((t) => (
              <Table.Tr key={t.id}>
                <Table.Td>
                  <Anchor component={Link} href={`/views/tickets/${t.id}`}>
                    {t.id}
                  </Anchor>
                </Table.Td>
                <Table.Td>{t.title}</Table.Td>
                <Table.Td>
                  <Badge color={priorityColor(t.priority)}>{t.priority}</Badge>
                </Table.Td>
                <Table.Td>
                  <Badge color={statusColor(t.status)}>{t.status}</Badge>
                </Table.Td>
                <Table.Td>{formatDateTime(t.createdAt)}</Table.Td>
              </Table.Tr>
            ))}
            {recentAssigned.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <Text c="dimmed" ta="center">
                    Tidak ada tugas aktif.
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* Riwayat penyelesaian saya */}
      <Paper withBorder radius="md" p="md">
        <Group justify="space-between" mb="xs">
          <Text fw={600}>Riwayat Penyelesaian Saya</Text>
          <Anchor component={Link} href="/views/tickets/history" size="sm">
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
              <Table.Th>Prioritas</Table.Th>
              <Table.Th>Diselesaikan</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {recentResolved.map((t) => (
              <Table.Tr key={t.id}>
                <Table.Td>
                  <Anchor component={Link} href={`/views/tickets/${t.id}`}>
                    {t.id}
                  </Anchor>
                </Table.Td>
                <Table.Td>{t.title}</Table.Td>
                <Table.Td>
                  <Badge color={priorityColor(t.priority)}>{t.priority}</Badge>
                </Table.Td>
                <Table.Td>{formatDateTime(t.resolvedAt)}</Table.Td>
              </Table.Tr>
            ))}
            {recentResolved.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={4}>
                  <Text c="dimmed" ta="center">
                    Belum ada ticket yang kamu selesaikan.
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
