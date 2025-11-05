"use client";

import {
  Alert,
  Card,
  Group,
  SimpleGrid,
  Skeleton,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient"; // Pastikan path ini benar
import { IconInbox, IconClock, IconCheck } from "@tabler/icons-react";

// Tipe data yang kita harapkan dari API
type TicketSummaryData = {
  incoming: number;
  inProgress: number;
  completed: number;
};

// Fungsi untuk mengambil data dari API
const fetchTicketSummary = async () => {
  // Kita akan membuat endpoint ini di backend nanti
  const response = await apiClient.get<TicketSummaryData>(
    "/reports/dashboard-summary" // <-- Sesuaikan dengan rute baru
  );
  return response.data;
};

export function TicketStats() {
  const theme = useMantineTheme();

  const { data, isLoading, isError } = useQuery<TicketSummaryData>({
    queryKey: ["ticket-summary"],
    queryFn: fetchTicketSummary,
    refetchInterval: 30000, // Refresh setiap 30 detik
    staleTime: 15000, // Data dianggap fresh selama 15 detik
  });

  // 1. Loading State
  if (isLoading) {
    return (
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
        <Skeleton height={120} radius="md" />
        <Skeleton height={120} radius="md" />
        <Skeleton height={120} radius="md" />
      </SimpleGrid>
    );
  }

  // 2. Error State
  if (isError) {
    return (
      <Alert
        title="Gagal Memuat Data"
        color="red"
        variant="light"
        withCloseButton
      >
        Tidak dapat mengambil data statistik servis. API backend mungkin sedang
        tidak aktif atau endpoint belum dibuat.
      </Alert>
    );
  }

  // 3. Success State
  const stats = [
    {
      title: "Servis Masuk",
      value: data?.incoming ?? 0,
      icon: IconInbox,
      color: "blue",
    },
    {
      title: "Sedang Dikerjakan",
      value: data?.inProgress ?? 0,
      icon: IconClock,
      color: "orange",
    },
    {
      title: "Selesai",
      value: data?.completed ?? 0,
      icon: IconCheck,
      color: "green",
    },
  ];

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
      {stats.map((stat) => (
        <Card withBorder shadow="sm" radius="md" key={stat.title}>
          <Group justify="space-between">
            <Text size="sm" c="dimmed" fw={700}>
              {stat.title}
            </Text>
            <stat.icon
              size={28}
              stroke={1.5}
              color={theme.colors[stat.color][6]}
            />
          </Group>
          <Text fz={36} fw={700} mt="md">
            {stat.value}
          </Text>
        </Card>
      ))}
    </SimpleGrid>
  );
}
