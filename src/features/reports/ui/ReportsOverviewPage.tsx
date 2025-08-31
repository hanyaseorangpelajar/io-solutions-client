"use client";

import { useMemo } from "react";
import {
  Paper,
  Stack,
  Group,
  Title,
  Text,
  SimpleGrid,
  Button,
  Tooltip,
} from "@mantine/core";
import { BarChart, LineChart, DonutChart } from "@mantine/charts";
import { downloadCsv, toCsv, monthKey } from "../model/derive";

// Ambil data dari fitur lain (mock). Safe-guard jika kosong.
import { MOCK_TICKETS } from "@/features/tickets";
import { INVENTORY_ITEMS, STOCK_MOVES } from "@/features/inventory";
import { MOCK_RMAS } from "@/features/rma";

// Warna konsisten per status untuk DonutChart
function statusColor(status: string) {
  const s = status.toLowerCase();
  if (s.includes("new") || s.includes("open")) return "blue.6";
  if (s.includes("progress") || s.includes("ongoing") || s.includes("work"))
    return "indigo.6";
  if (s.includes("hold") || s.includes("pending")) return "yellow.6";
  if (s.includes("resolved")) return "teal.6";
  if (s.includes("closed") || s.includes("done")) return "green.6";
  if (s.includes("cancel")) return "red.6";
  return "gray.6";
}

export default function ReportsOverviewPage() {
  // KPI sederhana
  const kpi = useMemo(() => {
    const ticketsTotal = MOCK_TICKETS?.length ?? 0;
    const ticketsOpen = (MOCK_TICKETS ?? []).filter(
      (t: any) =>
        t.status &&
        String(t.status).toLowerCase() !== "closed" &&
        String(t.status).toLowerCase() !== "resolved"
    ).length;

    const totalStock = (INVENTORY_ITEMS ?? []).reduce(
      (sum: number, p: any) => sum + (p.stock ?? 0),
      0
    );
    const movementsIn = (STOCK_MOVES ?? []).filter(
      (m: any) => m.type === "IN"
    ).length;
    const movementsOut = (STOCK_MOVES ?? []).filter(
      (m: any) => m.type === "OUT"
    ).length;

    const rmaOpen = (MOCK_RMAS ?? []).filter(
      (r: any) => (r.status ?? "").toLowerCase() !== "closed"
    ).length;

    return {
      ticketsTotal,
      ticketsOpen,
      totalStock,
      movementsIn,
      movementsOut,
      rmaOpen,
    };
  }, []);

  // Tickets per bulan (created vs resolved)
  const ticketSeries = useMemo(() => {
    const map = new Map<
      string,
      { month: string; Created: number; Resolved: number }
    >();
    for (const t of MOCK_TICKETS ?? []) {
      const mk = monthKey(t.createdAt ?? Date.now());
      if (!map.has(mk)) map.set(mk, { month: mk, Created: 0, Resolved: 0 });
      map.get(mk)!.Created += 1;

      if (t.resolution?.resolvedAt) {
        const rk = monthKey(t.resolution.resolvedAt);
        if (!map.has(rk)) map.set(rk, { month: rk, Created: 0, Resolved: 0 });
        map.get(rk)!.Resolved += 1;
      }
    }
    return Array.from(map.values()).sort((a, b) =>
      a.month.localeCompare(b.month)
    );
  }, []);

  // Distribusi tiket by status (lengkap dengan color untuk DonutChart)
  const ticketStatus = useMemo(() => {
    const count: Record<string, number> = {};
    for (const t of MOCK_TICKETS ?? []) {
      const s = (t.status ?? "UNKNOWN").toString();
      count[s] = (count[s] ?? 0) + 1;
    }
    return Object.entries(count).map(([name, value]) => ({
      name,
      value,
      color: statusColor(name),
    }));
  }, []);

  // Stock movements ringkas (dipakai untuk LineChart)
  const movementData = useMemo(() => {
    const inc = (STOCK_MOVES ?? []).filter((m: any) => m.type === "IN").length;
    const out = (STOCK_MOVES ?? []).filter((m: any) => m.type === "OUT").length;
    return [
      { name: "IN", value: inc },
      { name: "OUT", value: out },
    ];
  }, []);

  const exportTicketsCsv = () => {
    const csv = toCsv(ticketSeries, ["month", "Created", "Resolved"]);
    downloadCsv("tickets-monthly.csv", csv);
  };

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <div>
          <Title order={3} style={{ lineHeight: 1.2 }}>
            Ringkasan Laporan
          </Title>
          <Text c="dimmed">Ikhtisar cepat performa sistem.</Text>
        </div>
        <Group>
          <Tooltip label="Ekspor data seri bulanan (CSV)">
            <Button variant="light" onClick={exportTicketsCsv}>
              Export CSV
            </Button>
          </Tooltip>
        </Group>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        <Paper withBorder radius="md" p="md">
          <Text c="dimmed" size="sm">
            Total Tickets
          </Text>
          <Title order={2}>{kpi.ticketsTotal}</Title>
          <Text c="dimmed" size="sm">
            Open: {kpi.ticketsOpen}
          </Text>
        </Paper>
        <Paper withBorder radius="md" p="md">
          <Text c="dimmed" size="sm">
            Total Stok
          </Text>
          <Title order={2}>{kpi.totalStock}</Title>
          <Text c="dimmed" size="sm">
            Pergerakan: IN {kpi.movementsIn} / OUT {kpi.movementsOut}
          </Text>
        </Paper>
        <Paper withBorder radius="md" p="md">
          <Text c="dimmed" size="sm">
            RMA Terbuka
          </Text>
          <Title order={2}>{kpi.rmaOpen}</Title>
        </Paper>
      </SimpleGrid>

      <Paper withBorder radius="md" p="md">
        <Text fw={600} mb="xs">
          Tickets per Bulan
        </Text>
        <BarChart
          h={260}
          data={ticketSeries}
          dataKey="month"
          series={[
            { name: "Created", color: "blue.6" },
            { name: "Resolved", color: "teal.6" },
          ]}
          withLegend
        />
      </Paper>

      <SimpleGrid cols={{ base: 1, md: 2 }}>
        <Paper withBorder radius="md" p="md">
          <Text fw={600} mb="xs">
            Distribusi Status Ticket
          </Text>
          <DonutChart h={240} data={ticketStatus} withLabels paddingAngle={1} />
        </Paper>

        <Paper withBorder radius="md" p="md">
          <Text fw={600} mb="xs">
            Stock Movements
          </Text>
          <LineChart
            h={240}
            data={movementData.map((d, i) => ({
              idx: i + 1,
              [d.name]: d.value,
            }))}
            dataKey="idx"
            series={movementData.map((d) => ({
              name: d.name,
              color: d.name === "IN" ? "indigo.6" : "red.6",
            }))}
            withLegend
          />
        </Paper>
      </SimpleGrid>
    </Stack>
  );
}
