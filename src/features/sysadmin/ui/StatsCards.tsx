"use client";

import { Card, Group, Text, ThemeIcon, SimpleGrid, Stack } from "@mantine/core";
import {
  IconUsers,
  IconServer,
  IconAlertTriangle,
  IconSettings,
} from "@tabler/icons-react";

type Stat = {
  label: string;
  value: string;
  icon: React.ReactNode;
  hint?: string;
};

export default function StatsCards() {
  const data: Stat[] = [
    { label: "Pengguna aktif", value: "128", icon: <IconUsers size={18} /> },
    {
      label: "Service up",
      value: "7/7",
      icon: <IconServer size={18} />,
      hint: "Semua sehat",
    },
    {
      label: "Peringatan",
      value: "3",
      icon: <IconAlertTriangle size={18} />,
      hint: "2 medium, 1 low",
    },
    {
      label: "Perubahan config",
      value: "12",
      icon: <IconSettings size={18} />,
      hint: "7 hari terakhir",
    },
  ];

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
      {data.map((s) => (
        <Card key={s.label} withBorder radius="md" p="md">
          <Group align="flex-start" justify="space-between">
            <ThemeIcon variant="light" radius="md">
              {s.icon}
            </ThemeIcon>
            <Stack gap={2} style={{ textAlign: "right" }}>
              <Text fw={600}>{s.value}</Text>
              <Text size="xs" c="dimmed">
                {s.hint}
              </Text>
            </Stack>
          </Group>
          <Text size="sm" mt="sm" c="dimmed">
            {s.label}
          </Text>
        </Card>
      ))}
    </SimpleGrid>
  );
}
