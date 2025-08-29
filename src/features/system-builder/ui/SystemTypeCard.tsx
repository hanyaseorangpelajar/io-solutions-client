"use client";

import { Card, Group, Text, Badge } from "@mantine/core";
import { ReactNode } from "react";

export default function SystemTypeCard({
  id,
  label,
  description,
  selected,
  onSelect,
  icon,
  tags = [],
}: {
  id: string;
  label: string;
  description?: string;
  selected?: boolean;
  onSelect: (id: string) => void;
  icon?: ReactNode;
  tags?: string[];
}) {
  return (
    <Card
      withBorder
      radius="md"
      p="md"
      onClick={() => onSelect(id)}
      style={{
        cursor: "pointer",
        borderColor: selected ? "var(--mantine-color-blue-6)" : undefined,
        outline: selected ? "2px solid var(--mantine-color-blue-3)" : "none",
      }}
    >
      <Group gap="sm" mb={6}>
        {icon}
        <Text fw={700}>{label}</Text>
      </Group>
      {description && (
        <Text size="sm" c="dimmed" mb="xs">
          {description}
        </Text>
      )}
      {tags.length > 0 && (
        <Group gap={6}>
          {tags.map((t) => (
            <Badge key={t} variant="light">
              {t}
            </Badge>
          ))}
        </Group>
      )}
    </Card>
  );
}
