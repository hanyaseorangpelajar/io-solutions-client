"use client";

import { Paper, SimpleGrid, Stack, Title, Text } from "@mantine/core";
import type { PropsWithChildren, ReactNode } from "react";

type AuthLayoutProps = PropsWithChildren<{
  /** Lebar maksimal panel form (px) */
  panelWidth?: number;
  /** Konten brand panel kiri (opsional, default: brand proyek) */
  brandSlot?: ReactNode;
}>;

function DefaultBrand() {
  return (
    <Stack gap={8} align="center">
      <Title order={2} c="gray.1">
        I/O SOLUTIONS
      </Title>
      <Text c="gray.4">GOLDEN SERVICE</Text>
    </Stack>
  );
}

export default function AuthLayout({
  children,
  panelWidth = 420,
  brandSlot,
}: AuthLayoutProps) {
  return (
    <SimpleGrid cols={{ base: 1, md: 2 }} mih="100dvh">
      <Stack
        justify="center"
        align="center"
        p="xl"
        style={{
          background:
            "linear-gradient(135deg, var(--mantine-color-dark-8), var(--mantine-color-dark-6))",
        }}
        visibleFrom="md"
      >
        {brandSlot ?? <DefaultBrand />}
      </Stack>

      <Stack justify="center" align="center" p="md">
        <Paper
          withBorder
          p="xl"
          radius="lg"
          style={{ width: `min(${panelWidth}px, 92vw)` }}
        >
          {children}
        </Paper>
      </Stack>
    </SimpleGrid>
  );
}
