"use client";

// Hapus 'listParts' dan 'Part'
// import { listParts, type Part } from "@/features/inventory/api/parts";
import type { Staff } from "@/features/staff/model/types";
import { getStaffList } from "@/features/staff/api/staff";
import { useMemo } from "react";
// Ganti 'PartUsage' dengan 'ReplacementItem' dari tipe tiket
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
} from "@mantine/core";
// Hapus IconInfoCircle jika tidak dipakai (atau biarkan)
// import { IconInfoCircle } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
// Hapus useState jika tidak dipakai
// import { useEffect, useState } from "react";

type Props = {
  ticketId: string;
};

// Hapus formatCurrency
/*
const formatCurrency = (amount: number | null | undefined): string => {
  if (amount == null) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};
*/

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

  // Hapus query 'listParts'
  /*
  const { data: parts = [], isLoading: isLoadingParts } = useQuery<Part[]>({
    queryKey: ["parts", "list", "forNote"],
    queryFn: listParts,
    enabled: !!ticketId,
    staleTime: 5 * 60 * 1000,
  });
  */

  const { data: users = [], isLoading: isLoadingUsers } = useQuery<Staff[]>({
    queryKey: ["staff", "list", "forNote"],
    queryFn: getStaffList,
    enabled: !!ticketId,
    staleTime: 5 * 60 * 1000,
  });

  // Hapus 'partPriceMap'
  // const partPriceMap = useMemo(...);

  const userNameMap = useMemo(
    () => new Map(users.map((u) => [u.id, u.nama])),
    [users]
  );

  // Hapus isLoadingParts
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

  const {
    nomorTiket, // Ganti code
    tanggalMasuk, // Ganti createdAt
    customerId, // Ganti requester
    teknisiId, // Ganti assignee
    keluhanAwal, // Ganti description
    // Hapus resolution
  } = ticket;
  const resolvedAt = ticket.tanggalSelesai; // Ganti resolution?.resolvedAt
  const assigneeName =
    (teknisiId ? userNameMap.get(teknisiId.id) : null) ?? "Tidak Ditugaskan";

  // Hapus semua logika biaya
  // let totalPartsCost = 0;
  // let totalExtraCost = 0;

  // Sesuaikan mapping 'partRows'
  const partRows =
    ticket.replacementItems?.map((p: ReplacementItem) => {
      return {
        name: p.namaKomponen,
        qty: p.qty,
        keterangan: p.keterangan ?? "-",
      };
    }) ?? [];

  // Hapus 'extraCostRows' dan 'totalCost'
  // const extraCostRows = ...
  // const totalCost = ...

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
            <Text size="sm">Tanggal: {formatDateTime(tanggalMasuk)}</Text>
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

        {/* Hapus 'resolution' dan ganti dengan 'partRows.length' */}
        {partRows.length > 0 && (
          <>
            <Divider my="sm" />
            <Stack gap="md">
              {/* Ganti Judul */}
              <Title order={5}>Item Pengganti</Title>
              {partRows.length > 0 && (
                <Stack gap="xs">
                  {/* <Text size="sm" fw={500}>
                    Suku Cadang Digunakan:
                  </Text> */}
                  {/* Modifikasi Tabel */}
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
                      {/* Hapus Baris Total Biaya */}
                    </Table.Tbody>
                  </Table>
                </Stack>
              )}

              {/* Hapus 'extraCostRows' */}
              {/* Hapus 'Total Biaya' */}
            </Stack>
          </>
        )}
      </Stack>
    </Paper>
  );
}
