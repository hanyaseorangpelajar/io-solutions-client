"use client";

import { Stack, Title, Text } from "@mantine/core";

export default function FormHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <Stack gap={2}>
      <Title order={3}>{title}</Title>
      {subtitle ? (
        <Text c="dimmed" size="sm">
          {subtitle}
        </Text>
      ) : null}
    </Stack>
  );
}
