"use client";

import { useMemo, useEffect } from "react";
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
  LoadingOverlay,
} from "@mantine/core";

import { useQuery } from "@tanstack/react-query";
import { listTickets } from "@/features/tickets/api/tickets";
import type { Ticket } from "@/features/tickets";
// --- 1. Pastikan 'User' diimpor ---
import { useAuth, type User } from "@/features/auth";
import { notifications } from "@mantine/notifications";

import { formatDateTime } from "@/features/tickets/utils/format";
import TicketPriorityBadge from "@/features/tickets/ui/TicketPriorityBadge";
import TicketStatusBadge from "@/features/tickets/ui/TicketStatusBadge";

export default function TechnicianDashboardPage() {
  const { user } = useAuth();
  const userId = (user as User & { id: string })?.id;

  // --- 2. PERBAIKAN: Gunakan 'user.nama' (dari tipe User) bukan 'user.name' ---
  const userName = user?.nama ?? "Teknisi";

  const {
    data: queryResult,
    isLoading,
    error,
  } = useQuery<Ticket[]>({
    queryKey: ["tickets", "list", { assignee: userId }],
    queryFn: async () => {
      if (!userId) return [];
      // --- PERBAIKAN 3: Ganti filter 'assignee' menjadi 'teknisiId' ---
      // agar sesuai dengan API endpoint /tickets
      const res = await listTickets({
        teknisiId: userId,
        limit: 500,
      });
      return res.data ?? [];
    },
    enabled: !!userId,
  });

  useEffect(() => {
    if (error) {
      notifications.show({
        color: "red",
        title: "Gagal memuat tiket",
        message: (error as Error).message,
      });
    }
  }, [error]);

  const allMyTickets: Ticket[] = queryResult ?? [];

  // --- 4. PERBAIKAN: Sesuaikan filter status dengan data API baru ---
  const myOpen = useMemo(
    () => allMyTickets.filter((t: Ticket) => t.status === "Diagnosis"),
    [allMyTickets]
  );
  const myInProgress = useMemo(
    () => allMyTickets.filter((t: Ticket) => t.status === "DalamProses"),
    [allMyTickets]
  );
  const myResolved = useMemo(
    () =>
      allMyTickets.filter(
        (t: Ticket) => t.status === "Selesai" && t.teknisiId?.id === userId
      ),
    [allMyTickets, userId]
  );
  const totalAssigned = allMyTickets.length;

  const recentAssigned = useMemo(
    () =>
      [...myOpen, ...myInProgress]
        .sort(
          (a: Ticket, b: Ticket) =>
            new Date(b.tanggalMasuk).getTime() -
            new Date(a.tanggalMasuk).getTime()
        )
        .slice(0, 8),
    [myOpen, myInProgress]
  );

  const recentResolved = useMemo(
    () =>
      myResolved
        .sort(
          (a: Ticket, b: Ticket) =>
            new Date(b.tanggalSelesai ?? 0).getTime() -
            new Date(a.tanggalSelesai ?? 0).getTime()
        )
        .slice(0, 8),
    [myResolved]
  );

  return (
    <Stack gap="lg" style={{ position: "relative" }}>
      <LoadingOverlay visible={isLoading} />

      <Group justify="space-between" align="center">
        {/* --- 5. Teks sambutan sudah sesuai permintaan Anda --- */}
        <Stack gap={2}>
          <Title order={3}>Dashboard Teknisi</Title>
          <Text c="dimmed" size="sm">
            Hai, {userName}. Berikut ringkasan pekerjaanmu.
          </Text>
        </Stack>
        <Group gap="xs" wrap="wrap">
          <Button component={Link} href="/views/tickets/works" variant="light">
            Lihat My Work
          </Button>
          <Button
            component={Link}
            href="/views/tickets/history"
            variant="light"
          >
            Riwayat Audit
          </Button>
        </Group>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        <Paper withBorder radius="md" p="md">
          <Text c="dimmed" size="sm">
            Tickets ditugaskan
          </Text>
          <Title order={2}>{totalAssigned}</Title>
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
            Status 'Dalam Proses'
          </Text>
        </Paper>
        <Paper withBorder radius="md" p="md">
          <Text c="dimmed" size="sm">
            Sudah diselesaikan
          </Text>
          <Title order={2}>{myResolved.length}</Title>
          <Text size="xs" c="dimmed">
            Ticket yang kamu 'Selesaikan'
          </Text>
        </Paper>
      </SimpleGrid>

      <Paper withBorder radius="md" p="md">
        <Group justify="space-between" mb="xs">
          <Text fw={600}>Tugas Aktif Saya</Text>
          <Anchor component={Link} href="/views/tickets/works" size="sm">
            Lihat semua
          </Anchor>
        </Group>
        <Table
          striped
          highlightOnHover
          withTableBorder={false}
          withColumnBorders={false}
          stickyHeader
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Kode</Table.Th>
              <Table.Th>Keluhan</Table.Th>
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
                    {t.nomorTiket}
                  </Anchor>
                </Table.Td>
                <Table.Td>{t.keluhanAwal}</Table.Td>
                <Table.Td>
                  <TicketPriorityBadge priority={t.priority} />
                </Table.Td>
                <Table.Td>
                  <TicketStatusBadge status={t.status} />
                </Table.Td>
                <Table.Td>{formatDateTime(t.tanggalMasuk)}</Table.Td>
              </Table.Tr>
            ))}
            {recentAssigned.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <Text c="dimmed" ta="center" py="sm">
                    Tidak ada tugas aktif.
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>

      <Paper withBorder radius="md" p="md">
        <Group justify="space-between" mb="xs">
          <Text fw={600}>Riwayat Penyelesaian Saya</Text>
          <Anchor
            component={Link}
            href="/views/tickets/list?status=Selesai"
            size="sm"
          >
            Lihat semua
          </Anchor>
        </Group>
        <Table
          striped
          highlightOnHover
          withTableBorder={false}
          withColumnBorders={false}
          stickyHeader
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Kode</Table.Th>
              <Table.Th>Keluhan</Table.Th>
              <Table.Th>Prioritas</Table.Th>
              <Table.Th>Diselesaikan</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {recentResolved.map((t) => (
              <Table.Tr key={t.id}>
                <Table.Td>
                  <Anchor component={Link} href={`/views/tickets/${t.id}`}>
                    {t.nomorTiket}
                  </Anchor>
                </Table.Td>
                <Table.Td>{t.keluhanAwal}</Table.Td>
                <Table.Td>
                  <TicketPriorityBadge priority={t.priority} />
                </Table.Td>
                <Table.Td>
                  {formatDateTime(t.tanggalSelesai ?? t.diperbaruiPada)}
                </Table.Td>
              </Table.Tr>
            ))}
            {recentResolved.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={4}>
                  <Text c="dimmed" ta="center" py="sm">
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
