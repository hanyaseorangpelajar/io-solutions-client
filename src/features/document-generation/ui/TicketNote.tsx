"use client";

import type { Staff } from "@/features/staff/model/types";
import { getStaffList } from "@/features/staff/api/staff";
import { useMemo } from "react";
import type { Ticket, ReplacementItem } from "@/features/tickets/model/types";
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
    isLoading: isLoadingTicket,
    error: ticketError,
  } = useQuery<Ticket>({
    queryKey: ["tickets", ticketId, "detailForNote"],
    queryFn: () => getTicket(ticketId),
    enabled: !!ticketId,
  });

  const { data: users = [], isLoading: isLoadingUsers } = useQuery<Staff[]>({
    queryKey: ["staff", "list", "forNote"],
    queryFn: getStaffList,
    enabled: !!ticketId,
    staleTime: 5 * 60 * 1000,
  });

  const userNameMap = useMemo(
    () => new Map(users.map((u) => [u.id, u.nama])),
    [users]
  );

  const isLoading = isLoadingTicket || isLoadingUsers;
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

  const { nomorTiket, tanggalMasuk, customerId, teknisiId, keluhanAwal } =
    ticket;
  const resolvedAt = ticket.tanggalSelesai;
  const assigneeName =
    (teknisiId ? userNameMap.get(teknisiId.id) : null) ?? "Tidak Ditugaskan";

  const partRows =
    ticket.replacementItems?.map((p: ReplacementItem) => {
      return {
        name: p.namaKomponen,
        qty: p.qty,
        keterangan: p.keterangan ?? "-",
      };
    }) ?? [];

  return (
    <Paper shadow="sm" radius="md" p="xl" withBorder>
      <Stack gap="lg">
        <Stack gap="xs">
          <Title order={3} ta="center">
            Nota Layanan Tiket
          </Title>
          <Group justify="space-between">
            <Text size="sm">
              No: <strong>{nomorTiket}</strong>
            </Text>
            <Text size="sm">Tanggal: {safeFormatDateTime(tanggalMasuk)}</Text>
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
            <Text fw={500}>{customerId?.nama ?? "N/A"}</Text>
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
            {keluhanAwal || "-"}
          </Text>
        </Stack>

        {partRows.length > 0 && (
          <>
            <Divider my="sm" />
            <Stack gap="md">
              <Title order={5}>Item Pengganti</Title>
              {partRows.length > 0 && (
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
                          <Table.Td>{row.keterangan}</Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Stack>
              )}
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
            ( {customerId?.nama ?? "Nama Pelanggan"} )
          </Text>
        </Stack>
      </Stack>
    </Paper>
  );
}
