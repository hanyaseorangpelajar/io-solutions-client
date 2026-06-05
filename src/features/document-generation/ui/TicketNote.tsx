"use client";

import { useMemo } from "react";
import type {
  ServiceTicketDto,
  ReplacementItem,
  TicketCustomer,
  TicketTechnician,
} from "@/features/tickets/model/types";
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
  Box,
  rem,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

type Props = {
  ticketId: string;
};

const safeFormatDateTime = (dateString?: string) => {
  if (!dateString) return "-";
  try {
    return formatDateTime(dateString);
  } catch (e) {
    return dateString;
  }
};

export default function TicketNote({ ticketId }: Props) {
  const {
    data: ticket,
    isLoading,
    error,
  } = useQuery<ServiceTicketDto>({
    queryKey: ["tickets", ticketId, "detailForNote"],
    queryFn: () => getTicket(ticketId),
    enabled: !!ticketId,
  });

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

  const {
    ticketNumber,
    createdAt,
    customer,
    technician,
    initialComplaint,
    resolvedAt,
  } = ticket;

  const customerObj = customer as TicketCustomer;
  const technicianObj = technician as TicketTechnician;

  const customerName = typeof customer === "object" ? customerObj?.name : "N/A";
  const assigneeName =
    typeof technician === "object"
      ? (technicianObj?.name ?? "Tidak Ditugaskan")
      : "Tidak Ditugaskan";

  const partRows =
    ticket.replacementItems?.map((p: ReplacementItem) => ({
      name: p.componentName,
      qty: p.quantity,
      note: p.note ?? "-",
    })) ?? [];

  return (
    <Paper shadow="sm" radius="md" p="xl" withBorder>
      <Stack gap="lg">
        <Stack gap="xs">
          <Title order={3} ta="center">
            Nota Layanan Tiket
          </Title>
          <Group justify="space-between">
            <Text size="sm">
              No: <strong>{ticketNumber}</strong>
            </Text>
            <Text size="sm">Tanggal: {safeFormatDateTime(createdAt)}</Text>
          </Group>
          {resolvedAt && (
            <Group justify="end">
              <Text size="sm" c="dimmed">
                Selesai: {safeFormatDateTime(resolvedAt)}
              </Text>
            </Group>
          )}
        </Stack>

        <Divider />

        <Group grow>
          <Stack gap={4}>
            <Text size="xs" c="dimmed">
              Pelanggan:
            </Text>
            <Text fw={500}>{customerName}</Text>
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
            {initialComplaint || "-"}
          </Text>
        </Stack>

        {partRows.length > 0 && (
          <>
            <Divider my="sm" />
            <Stack gap="md">
              <Title order={5}>Item Pengganti</Title>
              <Stack gap="xs">
                <Table striped withRowBorders={false}>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Nama Part</Table.Th>
                      <Table.Th ta="right">Qty</Table.Th>
                      <Table.Th>Keterangan</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {partRows.map((row, i) => (
                      <Table.Tr key={`part-${i}`}>
                        <Table.Td>{row.name}</Table.Td>
                        <Table.Td ta="right">{row.qty}</Table.Td>
                        <Table.Td>{row.note}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Stack>
            </Stack>
          </>
        )}

        <Stack
          gap="xs"
          mt="xl"
          pt="xl"
          style={{ borderTop: "1px dashed #ced4da" }}
        >
          <Text size="sm" ta="center">
            Tanda Terima Pelanggan:
          </Text>
          <Box
            style={{
              height: rem(70),
              width: rem(200),
              alignSelf: "center",
            }}
          />
          <Text ta="center" fw={500}>
            ( {customerName} )
          </Text>
        </Stack>
      </Stack>
    </Paper>
  );
}
