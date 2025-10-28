"use client";

import Link from "next/link";
import {
  Anchor,
  Badge,
  Button,
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
import type { Part } from "@/features/inventory";
import type { RmaRecord } from "@/features/rma";

import { priorityColor, statusColor } from "@/shared/utils/formatters";
import { formatDateTime } from "@/features/tickets/utils/format";

function isOpenStatus(s: any) {
  const v = String(s ?? "").toLowerCase();
  return !(v.includes("closed") || v.includes("resolved"));
}

export default function AdminDashboardPage() {
  const { data: ticketsData, isLoading: isLoadingTickets } = useQuery({
    queryKey: ["tickets", "list", "dashboard"],
    queryFn: () => apiClient.get("/tickets?limit=500"),
    select: (res: any) => res.data?.data || [],
  });

  const { data: partsData, isLoading: isLoadingParts } = useQuery({
    queryKey: ["parts", "list", "dashboard"],
    queryFn: () => apiClient.get("/parts"),
    select: (res: any) => res.data?.data || [],
  });

  const { data: rmasData, isLoading: isLoadingRmas } = useQuery({
    queryKey: ["rma", "list", "dashboard"],
    queryFn: () => apiClient.get("/rma"),
    select: (res: any) => res.data?.data || [],
  });

  const tickets: Ticket[] = ticketsData ?? [];
  const parts: Part[] = partsData ?? [];
  const rmas: RmaRecord[] = rmasData ?? [];
  const isLoading = isLoadingTickets || isLoadingParts || isLoadingRmas;

  const kpi = {
    openTickets: tickets.filter((t) => isOpenStatus(t.status)).length,
    lowStock:
      parts.filter((p) => {
        const stock = p.stock ?? 0;
        const min = p.minStock ?? 0;
        return stock <= Math.max(0, min);
      }).length || 0,
    pendingRma:
      rmas.filter((r) => {
        const s = String(r?.status ?? "").toLowerCase();
        return !(
          s.includes("closed") ||
          s.includes("returned") ||
          s.includes("rejected")
        );
      }).length || 0,
  };

  const recentTickets = [...tickets]
    .map((t) => ({
      id: t.id,
      code: t.code,
      subject: t.subject,
      status: t.status,
      priority: t.priority,
      createdAt: t.createdAt,
    }))
    .sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return db - da;
    })
    .slice(0, 8);

  const recentRma = [...rmas]
    .map((r) => ({
      _id: r._id,
      code: r.code,
      customer: r.customerName,
      status: r.status,
      createdAt: r.createdAt,
    }))
    .sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return db - da;
    })
    .slice(0, 8);

  return (
    <Stack gap="lg" style={{ position: "relative" }}>
      <LoadingOverlay visible={isLoading} />

      <Group justify="space-between" align="center"></Group>

      <SimpleGrid cols={{ base: 1, sm: 3 }}></SimpleGrid>

      <Paper withBorder radius="md" p="md">
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
              <Table.Th>Prioritas</Table.Th>
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
                  <Badge color={priorityColor(String(t.priority))}>
                    {t.priority}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Badge color={statusColor(String(t.status))}>
                    {t.status}
                  </Badge>
                </Table.Td>
                <Table.Td>{formatDateTime(t.createdAt)}</Table.Td>
              </Table.Tr>
            ))}
            {recentTickets.length === 0 && (
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

      <Paper withBorder radius="md" p="md">
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
              <Table.Th>Pelanggan</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Dibuat</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {recentRma.map((r) => (
              <Table.Tr key={r._id}>
                <Table.Td>
                  <Anchor component={Link} href={`/views/tickets/${r._id}`}>
                    {r.code}
                  </Anchor>
                </Table.Td>
                <Table.Td>{r.customer}</Table.Td>
                <Table.Td>
                  <Badge color={statusColor(r.status)}>{r.status}</Badge>
                </Table.Td>
                <Table.Td>{formatDateTime(r.createdAt)}</Table.Td>
              </Table.Tr>
            ))}
            {recentRma.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={4}>
                  <Text c="dimmed" ta="center">
                    Tidak ada RMA terbaru.
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
