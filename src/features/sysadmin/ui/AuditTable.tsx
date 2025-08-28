"use client";

import {
  Badge,
  Card,
  Group,
  SegmentedControl,
  Stack,
  Title,
  Text,
} from "@mantine/core";
import { useMemo, useState } from "react";
import { SimpleTable, type Column } from "@/shared/ui/table/SimpleTable";
import type { AuditEntry, AuditLevel } from "../model/types";

const MOCK: AuditEntry[] = [
  {
    id: "a1",
    at: "2025-08-28T12:01:00Z",
    actor: "sysadmin",
    action: "UPDATE_PARAM",
    target: "system.siteName",
    level: "info",
  },
  {
    id: "a2",
    at: "2025-08-28T11:40:00Z",
    actor: "sysadmin",
    action: "FLUSH_CACHE",
    level: "warning",
  },
  {
    id: "a3",
    at: "2025-08-27T18:12:00Z",
    actor: "tech01",
    action: "ASSIGN_TICKET",
    target: "TCK-2025-000123",
    level: "info",
  },
  {
    id: "a4",
    at: "2025-08-27T09:03:00Z",
    actor: "admin",
    action: "DELETE_USER",
    target: "user:guest",
    level: "error",
  },
];

function LevelBadge({ level }: { level: AuditLevel }) {
  const color =
    level === "error" ? "red" : level === "warning" ? "yellow" : "green";
  return (
    <Badge color={color} variant="light" radius="sm" tt="uppercase">
      {level}
    </Badge>
  );
}

export default function AuditTable() {
  const [filter, setFilter] = useState<AuditLevel | "all">("all");

  const rows = useMemo(() => {
    return MOCK.filter((r) => (filter === "all" ? true : r.level === filter));
  }, [filter]);

  const columns: Column<AuditEntry>[] = [
    {
      key: "at",
      header: "Waktu",
      cell: (r) => new Date(r.at).toLocaleString(),
      width: 180,
    },
    { key: "actor", header: "Aktor", cell: (r) => r.actor },
    { key: "action", header: "Aksi", cell: (r) => r.action },
    {
      key: "target",
      header: "Target",
      cell: (r) => r.target ?? "-",
      width: "30%",
    },
    {
      key: "level",
      header: "Level",
      cell: (r) => <LevelBadge level={r.level} />,
      align: "center",
    },
  ];

  return (
    <Card withBorder radius="md" p="md">
      <Group justify="space-between" mb="xs">
        <Title order={5}>Audit Log</Title>
        <SegmentedControl
          size="xs"
          value={filter}
          onChange={(v) => setFilter(v as any)}
          data={[
            { label: "Semua", value: "all" },
            { label: "Info", value: "info" },
            { label: "Warning", value: "warning" },
            { label: "Error", value: "error" },
          ]}
        />
      </Group>

      <SimpleTable<AuditEntry>
        dense="sm"
        zebra
        stickyHeader
        maxHeight={360}
        columns={columns}
        data={rows}
        emptyText="Belum ada aktivitas"
      />

      <Text size="xs" c="dimmed" mt="xs">
        Menampilkan {rows.length} dari {MOCK.length} entri
      </Text>
    </Card>
  );
}
