"use client";

import { useMemo } from "react";
import {
  Paper,
  Stack,
  Group,
  Title,
  Text,
  Button,
  SimpleGrid,
  ScrollArea,
  Table,
} from "@mantine/core";
import { downloadCsv, toCsv, monthKey } from "../model/derive";
import { MOCK_TICKETS } from "@/features/tickets";

// Warna/status tidak dipakai di tabel, tapi kita tetap siapkan accessor aman
function getAssigneeName(t: any): string {
  const a = t?.assignee;
  if (!a) return "Unassigned";
  if (typeof a === "string") return a || "Unassigned";
  if (typeof a === "object" && "name" in a && (a as any).name) {
    return String((a as any).name);
  }
  return "Unassigned";
}

export default function TicketsReportPage() {
  const TICKETS = (MOCK_TICKETS ?? []) as any[];

  // --- Tabel: Created vs Resolved per Bulan
  const byMonth = useMemo(() => {
    const map = new Map<
      string,
      { month: string; created: number; resolved: number }
    >();
    for (const t of TICKETS) {
      const mk = monthKey(t.createdAt ?? Date.now());
      if (!map.has(mk)) map.set(mk, { month: mk, created: 0, resolved: 0 });
      map.get(mk)!.created += 1;

      if (t.resolution?.resolvedAt) {
        const rk = monthKey(t.resolution.resolvedAt);
        if (!map.has(rk)) map.set(rk, { month: rk, created: 0, resolved: 0 });
        map.get(rk)!.resolved += 1;
      }
    }
    return Array.from(map.values()).sort((a, b) =>
      a.month.localeCompare(b.month)
    );
  }, [TICKETS]);

  // --- Tabel: Distribusi Prioritas
  const byPriority = useMemo(() => {
    const count: Record<string, number> = {};
    for (const t of TICKETS) {
      const p = (t.priority ?? "UNKNOWN").toString();
      count[p] = (count[p] ?? 0) + 1;
    }
    return Object.entries(count)
      .map(([priority, total]) => ({ priority, total }))
      .sort((a, b) => b.total - a.total);
  }, [TICKETS]);

  // --- Tabel: Tickets per Assignee
  const byAssignee = useMemo(() => {
    const count: Record<string, number> = {};
    for (const t of TICKETS) {
      const name = getAssigneeName(t);
      count[name] = (count[name] ?? 0) + 1;
    }
    return Object.entries(count)
      .map(([assignee, total]) => ({ assignee, total }))
      .sort((a, b) => b.total - a.total);
  }, [TICKETS]);

  // --- Exporters
  const exportByMonthCsv = () => {
    const csv = toCsv(byMonth, ["month", "created", "resolved"]);
    downloadCsv("tickets-by-month.csv", csv);
  };
  const exportByPriorityCsv = () => {
    const csv = toCsv(byPriority, ["priority", "total"]);
    downloadCsv("tickets-by-priority.csv", csv);
  };
  const exportByAssigneeCsv = () => {
    const csv = toCsv(byAssignee, ["assignee", "total"]);
    downloadCsv("tickets-by-assignee.csv", csv);
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={3}>Laporan Tickets</Title>
          <Text c="dimmed">
            Tren dan distribusi dalam format tabel dengan ekspor CSV.
          </Text>
        </div>
      </Group>

      <Paper withBorder radius="md" p="md">
        <Group justify="space-between" mb="xs">
          <Text fw={600}>Created vs Resolved (Bulanan)</Text>
          <Button variant="light" size="xs" onClick={exportByMonthCsv}>
            Export CSV
          </Button>
        </Group>
        <ScrollArea h={340}>
          <Table
            striped
            highlightOnHover
            withTableBorder
            withColumnBorders
            stickyHeader
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Bulan</Table.Th>
                <Table.Th style={{ textAlign: "right" }}>Created</Table.Th>
                <Table.Th style={{ textAlign: "right" }}>Resolved</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {byMonth.map((r) => (
                <Table.Tr key={r.month}>
                  <Table.Td>{r.month}</Table.Td>
                  <Table.Td style={{ textAlign: "right" }}>
                    {r.created}
                  </Table.Td>
                  <Table.Td style={{ textAlign: "right" }}>
                    {r.resolved}
                  </Table.Td>
                </Table.Tr>
              ))}
              {byMonth.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={3}>
                    <Text c="dimmed" ta="center">
                      Tidak ada data.
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Paper>

      <SimpleGrid cols={{ base: 1, md: 2 }}>
        <Paper withBorder radius="md" p="md">
          <Group justify="space-between" mb="xs">
            <Text fw={600}>Distribusi Prioritas</Text>
            <Button variant="light" size="xs" onClick={exportByPriorityCsv}>
              Export CSV
            </Button>
          </Group>
          <ScrollArea h={300}>
            <Table
              striped
              highlightOnHover
              withTableBorder
              withColumnBorders
              stickyHeader
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Prioritas</Table.Th>
                  <Table.Th style={{ textAlign: "right" }}>Total</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {byPriority.map((r) => (
                  <Table.Tr key={r.priority}>
                    <Table.Td>{r.priority}</Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>
                      {r.total}
                    </Table.Td>
                  </Table.Tr>
                ))}
                {byPriority.length === 0 && (
                  <Table.Tr>
                    <Table.Td colSpan={2}>
                      <Text c="dimmed" ta="center">
                        Tidak ada data.
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </Paper>

        <Paper withBorder radius="md" p="md">
          <Group justify="space-between" mb="xs">
            <Text fw={600}>Tickets per Assignee (Top)</Text>
            <Button variant="light" size="xs" onClick={exportByAssigneeCsv}>
              Export CSV
            </Button>
          </Group>
          <ScrollArea h={300}>
            <Table
              striped
              highlightOnHover
              withTableBorder
              withColumnBorders
              stickyHeader
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Assignee</Table.Th>
                  <Table.Th style={{ textAlign: "right" }}>
                    Total Tickets
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {byAssignee.map((r) => (
                  <Table.Tr key={r.assignee}>
                    <Table.Td>{r.assignee}</Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>
                      {r.total}
                    </Table.Td>
                  </Table.Tr>
                ))}
                {byAssignee.length === 0 && (
                  <Table.Tr>
                    <Table.Td colSpan={2}>
                      <Text c="dimmed" ta="center">
                        Tidak ada data.
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </Paper>
      </SimpleGrid>
    </Stack>
  );
}
