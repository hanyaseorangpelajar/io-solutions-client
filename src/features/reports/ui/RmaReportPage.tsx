"use client";

import { useMemo } from "react";
import {
  Paper,
  Stack,
  Group,
  Title,
  Text,
  Button,
  ScrollArea,
  Table,
} from "@mantine/core";
import { downloadCsv, toCsv, monthKey } from "../model/derive";
import { MOCK_RMAS } from "@/features/rma";

/** Ambil tanggal closed dari berbagai kemungkinan field agar tahan variasi tipe/mock */
function getClosedAt(r: any): Date | string | number | null {
  return (
    r?.closedAt ??
    r?.resolvedAt ??
    r?.completedAt ??
    r?.closed_on ??
    r?.closedDate ??
    null
  );
}

export default function RmaReportPage() {
  const RMAS = (MOCK_RMAS ?? []) as any[];

  // --- Tabel: RMA per Bulan (created vs closed)
  const byMonth = useMemo(() => {
    const map = new Map<
      string,
      { month: string; created: number; closed: number }
    >();
    for (const r of RMAS) {
      const mk = monthKey(r?.createdAt ?? Date.now());
      if (!map.has(mk)) map.set(mk, { month: mk, created: 0, closed: 0 });
      map.get(mk)!.created += 1;

      const closedAt = getClosedAt(r);
      if (closedAt) {
        const ck = monthKey(closedAt);
        if (!map.has(ck)) map.set(ck, { month: ck, created: 0, closed: 0 });
        map.get(ck)!.closed += 1;
      }
    }
    return Array.from(map.values()).sort((a, b) =>
      a.month.localeCompare(b.month)
    );
  }, [RMAS]);

  // --- Tabel: Distribusi Status RMA
  const byStatus = useMemo(() => {
    const count: Record<string, number> = {};
    for (const r of RMAS) {
      const s = (r?.status ?? "UNKNOWN").toString();
      count[s] = (count[s] ?? 0) + 1;
    }
    return Object.entries(count)
      .map(([status, total]) => ({ status, total }))
      .sort((a, b) => b.total - a.total);
  }, [RMAS]);

  // --- Exporters
  const exportByMonthCsv = () => {
    const csv = toCsv(byMonth, ["month", "created", "closed"]);
    downloadCsv("rma-by-month.csv", csv);
  };
  const exportByStatusCsv = () => {
    const csv = toCsv(byStatus, ["status", "total"]);
    downloadCsv("rma-by-status.csv", csv);
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={3}>Laporan RMA & Warranty</Title>
          <Text c="dimmed">Rekap klaim per bulan dan distribusi status</Text>
        </div>
      </Group>

      <Paper withBorder radius="md" p="md">
        <Group justify="space-between" mb="xs">
          <Text fw={600}>RMA per Bulan</Text>
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
                <Table.Th style={{ textAlign: "right" }}>Closed</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {byMonth.map((r) => (
                <Table.Tr key={r.month}>
                  <Table.Td>{r.month}</Table.Td>
                  <Table.Td style={{ textAlign: "right" }}>
                    {r.created}
                  </Table.Td>
                  <Table.Td style={{ textAlign: "right" }}>{r.closed}</Table.Td>
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

      <Paper withBorder radius="md" p="md">
        <Group justify="space-between" mb="xs">
          <Text fw={600}>Distribusi Status</Text>
          <Button variant="light" size="xs" onClick={exportByStatusCsv}>
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
                <Table.Th>Status</Table.Th>
                <Table.Th style={{ textAlign: "right" }}>Total</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {byStatus.map((r) => (
                <Table.Tr key={r.status}>
                  <Table.Td>{r.status}</Table.Td>
                  <Table.Td style={{ textAlign: "right" }}>{r.total}</Table.Td>
                </Table.Tr>
              ))}
              {byStatus.length === 0 && (
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
    </Stack>
  );
}
