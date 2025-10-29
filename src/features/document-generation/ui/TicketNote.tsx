"use client";

import { listParts, type Part } from "@/features/inventory/api/parts";
import type { Staff } from "@/features/staff/model/types";
import { getStaffList } from "@/features/staff/api/staff";
import { useMemo } from "react";
import type { Ticket, PartUsage } from "@/features/tickets/model/types";
import { getTicket } from "@/features/tickets/api/tickets";
import { formatDateTime } from "@/features/tickets/utils/format";
import {
  Alert,
  Divider,
  Group,
  LoadingOverlay,
  Paper,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type Props = {
  ticketId: string;
};

const formatCurrency = (amount: number | null | undefined): string => {
  if (amount == null) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function TicketNote({ ticketId }: Props) {
  const {
    data: ticket,
    isLoading: isLoadingTicket,
    error: ticketError,
  } = useQuery<Ticket>({
    queryKey: ["tickets", ticketId, "detailForNote"],
    queryFn: () => getTicket(ticketId),
    enabled: !!ticketId,
  });

  const { data: parts = [], isLoading: isLoadingParts } = useQuery<Part[]>({
    queryKey: ["parts", "list", "forNote"],
    queryFn: listParts,
    enabled: !!ticketId,
    staleTime: 5 * 60 * 1000,
  });

  const { data: users = [], isLoading: isLoadingUsers } = useQuery<Staff[]>({
    queryKey: ["staff", "list", "forNote"],
    queryFn: getStaffList,
    enabled: !!ticketId,
    staleTime: 5 * 60 * 1000,
  });

  const partPriceMap = useMemo(
    () => new Map(parts.map((p) => [p.id, p.price ?? 0])),
    [parts]
  );

  const userNameMap = useMemo(
    () => new Map(users.map((u) => [u.id, u.name])),
    [users]
  );

  const isLoading = isLoadingTicket || isLoadingParts || isLoadingUsers;
  const error = ticketError;

  if (isLoading) {
    return (
      <Paper withBorder p="xl" radius="md">
        <LoadingOverlay visible />
      </Paper>
    );
  }

  if (error || !ticket) {
    return (
      <Paper withBorder p="xl" radius="md">
        <Alert color="red" title="Error Memuat Data">
          Gagal memuat detail tiket:{" "}
          {(error as Error)?.message || "Tiket tidak ditemukan."}
        </Alert>
      </Paper>
    );
  }

  const { code, createdAt, requester, assignee, description, resolution } =
    ticket;
  const resolvedAt = resolution?.resolvedAt;
  const assigneeName =
    (assignee ? userNameMap.get(assignee) : null) ?? "Tidak Ditugaskan";

  let totalPartsCost = 0;
  let totalExtraCost = 0;
  const partRows =
    resolution?.parts?.map((p: PartUsage) => {
      const unitPrice = partPriceMap.get(p.partId) ?? 0;
      const subtotal = p.qty * unitPrice;
      totalPartsCost += subtotal;
      return { name: p.name, qty: p.qty, unitPrice, subtotal };
    }) ?? [];

  const extraCostRows =
    resolution?.extraCosts?.map((ec) => {
      totalExtraCost += ec.amount;
      return { label: ec.label, amount: ec.amount };
    }) ?? [];

  const totalCost = totalPartsCost + totalExtraCost;

  return (
    <Paper shadow="sm" radius="md" p="xl" withBorder>
      <Stack gap="lg">
        <Stack gap="xs">
          <Title order={3} ta="center">
            Nota Layanan Tiket
          </Title>
          <Group justify="space-between">
            <Text size="sm">
              No: <strong>{code}</strong>
            </Text>
            <Text size="sm">Tanggal: {formatDateTime(createdAt)}</Text>
          </Group>
          {resolvedAt && (
            <Group justify="end">
              <Text size="sm" c="dimmed">
                Selesai: {formatDateTime(resolvedAt)}
              </Text>
            </Group>
          )}
        </Stack>

        <Divider />

        <Group grow>
          <Stack gap={4}>
            <Text size="xs" c="dimmed">
              Pemohon:
            </Text>
            <Text fw={500}>{requester}</Text>
          </Stack>
          <Stack gap={4}>
            <Text size="xs" c="dimmed">
              Teknisi:
            </Text>
            <Text fw={500}>{assigneeName}</Text>
          </Stack>
        </Group>

        <Stack gap={4}>
          <Text size="sm" fw={500}>
            Deskripsi Masalah:
          </Text>
          <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
            {description || "-"}
          </Text>
        </Stack>

        {resolution && (
          <>
            <Divider my="sm" />
            <Stack gap="md">
              <Title order={5}>Detail Penyelesaian</Title>
              <Stack gap={4}>
                <Text size="xs" c="dimmed">
                  Akar Masalah:
                </Text>
                <Text size="sm">{resolution.rootCause}</Text>
              </Stack>
              <Stack gap={4}>
                <Text size="xs" c="dimmed">
                  Solusi:
                </Text>
                <Text size="sm">{resolution.solution}</Text>
              </Stack>
            </Stack>
          </>
        )}

        {resolution && (partRows.length > 0 || extraCostRows.length > 0) && (
          <>
            <Divider my="sm" />
            <Stack gap="md">
              <Title order={5}>Rincian Biaya</Title>
              {partRows.length > 0 && (
                <Stack gap="xs">
                  <Text size="sm" fw={500}>
                    Suku Cadang Digunakan:
                  </Text>
                  <Table striped withRowBorders={false}>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Nama Part</Table.Th>
                        <Table.Th ta="right">Qty</Table.Th>
                        <Table.Th ta="right">Harga Satuan</Table.Th>
                        <Table.Th ta="right">Subtotal</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {partRows.map((row, i) => (
                        <Table.Tr key={`part-${i}`}>
                          <Table.Td>{row.name}</Table.Td>
                          <Table.Td ta="right">{row.qty}</Table.Td>
                          <Table.Td ta="right">
                            {formatCurrency(row.unitPrice)}
                          </Table.Td>
                          <Table.Td ta="right">
                            {formatCurrency(row.subtotal)}
                          </Table.Td>
                        </Table.Tr>
                      ))}
                      <Table.Tr>
                        <Table.Td colSpan={3} ta="right" fw={700}>
                          Total Suku Cadang
                        </Table.Td>
                        <Table.Td ta="right" fw={700}>
                          {formatCurrency(totalPartsCost)}
                        </Table.Td>
                      </Table.Tr>
                    </Table.Tbody>
                  </Table>
                </Stack>
              )}

              {extraCostRows.length > 0 && (
                <Stack gap="xs">
                  <Text size="sm" fw={500}>
                    Biaya Tambahan:
                  </Text>
                  <Table striped withRowBorders={false}>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Keterangan</Table.Th>
                        <Table.Th ta="right">Jumlah</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {extraCostRows.map((row, i) => (
                        <Table.Tr key={`extra-${i}`}>
                          <Table.Td>{row.label}</Table.Td>
                          <Table.Td ta="right">
                            {formatCurrency(row.amount)}
                          </Table.Td>
                        </Table.Tr>
                      ))}
                      <Table.Tr>
                        <Table.Td ta="right" fw={700}>
                          Total Biaya Tambahan
                        </Table.Td>
                        <Table.Td ta="right" fw={700}>
                          {formatCurrency(totalExtraCost)}
                        </Table.Td>
                      </Table.Tr>
                    </Table.Tbody>
                  </Table>
                </Stack>
              )}

              <Group justify="flex-end" mt="sm">
                <Text size="lg" fw={700}>
                  Total Biaya:
                </Text>
                <Text size="lg" fw={700}>
                  {formatCurrency(totalCost)}
                </Text>
              </Group>
            </Stack>
          </>
        )}
      </Stack>
    </Paper>
  );
}
