"use client";

import Link from "next/link";
import {
  Anchor,
  Badge,
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
import apiClient from "@/lib/apiClient";
import type { Ticket } from "@/features/tickets";
import { priorityColor, statusColor } from "@/shared/utils/formatters";
import { useMemo } from "react";
import { formatDateTime } from "@/features/tickets/utils/format";
// --- 1. Impor useAuth ---
import { useAuth } from "@/features/auth";

function isOpenStatus(s: unknown) {
  const v = String(s ?? "").toLowerCase();
  return v === "diagnosis" || v === "dalamproses" || v === "menunggisparepart";
}

function isTechnician(role: unknown) {
  const v = String(role ?? "").toLowerCase();
  return v.includes("teknisi") || v.includes("technician");
}

export default function AdminDashboardPage() {
  // --- 2. Ambil data user ---
  const { user } = useAuth();
  const userName = user?.nama ?? "Admin";

  const { data: ticketsData, isLoading: isLoadingTickets } = useQuery({
    queryKey: ["tickets", "list", "dashboard"],
    queryFn: () => apiClient.get("/tickets", { params: { limit: 500 } }),
    select: (res: any) => res?.data?.results ?? res?.data?.data ?? [],
  });

  const tickets: Ticket[] = ticketsData ?? [];
  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => isOpenStatus(t.status)).length;

  const recentTickets = [...tickets]
    .map((t: any) => ({
      id: t.id ?? t._id ?? t.nomorTiket,
      code: t.nomorTiket,
      subject: t.keluhanAwal ?? "-",
      status: t.status,
      createdAt: t.createdAt ?? t.created_at ?? t.tanggalMasuk,
    }))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users", "list", "dashboard"],
    queryFn: () => apiClient.get("/users", { params: { limit: 500 } }),
    select: (res: any) => res?.data?.results ?? res?.data?.data ?? [],
  });

  const { data: kbData, isLoading: isLoadingKB } = useQuery({
    queryKey: ["kb-entry", "list", "dashboard"],
    queryFn: () => apiClient.get("/kb-entry", { params: { limit: 999 } }),
    select: (res: any) => res?.data ?? { results: [], totalResults: 0 },
  });

  const kbStats = useMemo(() => {
    const entries: any[] = kbData?.results ?? [];
    const totalEntries = kbData?.totalResults ?? entries.length;

    if (entries.length === 0) {
      return { total: totalEntries, mostFrequentTag: "-" };
    }

    const tagCounts = new Map<string, number>();
    for (const e of entries) {
      if (Array.isArray(e.tags)) {
        for (const tag of e.tags) {
          if (tag && tag.nama) {
            const count = tagCounts.get(tag.nama) ?? 0;
            tagCounts.set(tag.nama, count + 1);
          }
        }
      }
    }

    let mostFrequentTag = "-";
    let maxCount = 0;
    for (const [tag, count] of tagCounts.entries()) {
      if (count > maxCount) {
        maxCount = count;
        mostFrequentTag = tag;
      }
    }

    return { total: totalEntries, mostFrequentTag };
  }, [kbData]);

  const users: Array<{ id?: string; role?: string } & Record<string, unknown>> =
    (usersData as any[]) ?? [];
  const technicianCount = users.filter((u) =>
    isTechnician((u as any).role)
  ).length;

  const isLoading = isLoadingTickets || isLoadingUsers || isLoadingKB;

  return (
    <Stack gap="lg" style={{ position: "relative" }}>
      <LoadingOverlay visible={isLoading} />

      {/* --- 3. Sisipkan teks sambutan di sini --- */}
      <Group justify="space-between" align="center">
        <Stack gap={2}>
          <Title order={3}>Dashboard Admin</Title>
          <Text c="dimmed" size="sm">
            Hai {userName}, berikut kinerja saat ini.
          </Text>
        </Stack>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        <Paper withBorder radius="md" p="md">
          <Text c="dimmed" size="sm">
            Total Tiket
          </Text>
          <Title order={2}>{totalTickets}</Title>
          <Text size="xs" c="dimmed">
            Seluruh tiket yang tercatat
          </Text>
        </Paper>

        <Paper withBorder radius="md" p="md">
          <Text c="dimmed" size="sm">
            Tiket Terbuka
          </Text>
          <Title order={2}>{openTickets}</Title>
          <Text size="xs" c="dimmed">
            Diagnosis, Dalam Proses, Menunggu
          </Text>
        </Paper>

        <Paper withBorder radius="md" p="md">
          <Text c="dimmed" size="sm">
            Total Teknisi
          </Text>
          <Title order={2}>{technicianCount}</Title>
          <Text size="xs" c="dimmed">
            Pengguna dengan role Teknisi
          </Text>
        </Paper>
      </SimpleGrid>

      <Paper withBorder radius="md" p="md">
        <Title order={4} mb="sm">
          Knowledge Base
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Stack gap={4}>
            <Text c="dimmed" size="sm">
              Total Entri (SOP)
            </Text>
            <Title order={2}>{kbStats.total}</Title>
            <Text size="xs" c="dimmed">
              Solusi yang terdokumentasi
            </Text>
          </Stack>
          <Stack gap={4}>
            <Text c="dimmed" size="sm">
              Tag Terbanyak
            </Text>
            <Title order={2} tt="capitalize">
              {kbStats.mostFrequentTag}
            </Title>
            <Text size="xs" c="dimmed">
              Topik yang paling sering muncul
            </Text>
          </Stack>
        </SimpleGrid>
      </Paper>

      <Paper withBorder radius="md" p="md">
        <Title order={4} mb="sm">
          Tiket Terbaru
        </Title>
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
              <Table.Th>Judul</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Dibuat</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {recentTickets.map((t) => (
              <Table.Tr key={t.id}>
                <Table.Td>
                  <Anchor component={Link} href={`/views/tickets/${t.id}`}>
                    {t.code}
                  </Anchor>
                </Table.Td>
                <Table.Td>{t.subject}</Table.Td>
                <Table.Td>
                  <Badge color={statusColor(String(t.status))}>
                    {String(t.status)}
                  </Badge>
                </Table.Td>
                <Table.Td>{formatDateTime(t.createdAt)}</Table.Td>
              </Table.Tr>
            ))}

            {recentTickets.length === 0 && !isLoading && (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <Text c="dimmed" ta="center">
                    Tidak ada tiket terbaru.
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
