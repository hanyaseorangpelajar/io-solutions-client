"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  ActionIcon,
  Badge,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
  Tooltip,
  Button,
  Timeline,
  ThemeIcon,
  Alert,
  LoadingOverlay,
} from "@mantine/core";
import {
  IconX,
  IconNotes,
  IconFileText,
  IconHistory,
  IconTool,
  IconPlus,
} from "@tabler/icons-react";
import { useParams, useRouter } from "next/navigation";
import type {
  Ticket,
  ReplacementItem,
  StatusHistory,
  TicketStatus,
} from "../model/types";
import TicketPriorityBadge from "./TicketPriorityBadge";
import TicketStatusBadge from "./TicketStatusBadge";
import { formatDateTime } from "../utils/format";
import {
  getTicket,
  updateTicketStatus,
  addReplacementItem,
} from "../api/tickets";
import type { UpdateStatusInput, AddItemInput } from "../model/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";

import UpdateStatusModal from "./UpdateStatusModal";
import AddItemModal from "./AddItemModal";

// Hapus impor inventory
// import { listParts, type Part } from "@/features/inventory/api/parts";
import { getStaffList } from "@/features/staff/api/staff";
import type { Staff } from "@/features/staff/model/types";

export default function TicketDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = String(params?.id ?? "");

  const [ticket, setTicket] = useState<Ticket | null>(null);
  // Hapus state inventory
  // const [inventoryParts, setInventoryParts] = useState<Part[]>([]);
  const [users, setUsers] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [itemModalOpen, setItemModalOpen] = useState(false);

  const closeDetail = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/views/tickets/list");
    }
  };

  const reloadTicket = async () => {
    try {
      const ticketData = await getTicket(id);
      setTicket(ticketData);
      queryClient.setQueryData(["tickets", id, "detailForNote"], ticketData);
    } catch (e: any) {
      notifications.show({
        color: "red",
        title: "Gagal memuat ulang data",
        message: e.message,
      });
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        // Hapus 'listParts' dari Promise.all
        const [ticketData, usersData] = await Promise.all([
          getTicket(id),
          getStaffList(),
        ]);

        if (active) {
          setTicket(ticketData);
          // setInventoryParts(partsData); // Hapus
          setUsers(usersData);
        }
      } catch (e: any) {
        if (active) {
          setTicket(null);
          notifications.show({
            color: "red",
            title: "Gagal memuat data",
            message: e.message,
          });
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id, queryClient]);

  const userNameMap = useMemo(
    () => new Map(users.map((u) => [u.id, u.nama])),
    [users]
  );

  const statusMutation = useMutation({
    mutationFn: (data: UpdateStatusInput) =>
      updateTicketStatus(id, data.status, data.catatan),
    onSuccess: () => {
      notifications.show({
        color: "green",
        title: "Status Diperbarui",
        message: "Timeline telah diperbarui.",
      });
      reloadTicket();
      queryClient.invalidateQueries({ queryKey: ["tickets", "list"] });
    },
    onError: (e: any) => {
      notifications.show({
        color: "red",
        title: "Gagal Menyimpan",
        message: e.message,
      });
    },
  });

  const itemMutation = useMutation({
    mutationFn: (data: AddItemInput) => addReplacementItem(id, data),
    onSuccess: () => {
      notifications.show({
        color: "green",
        title: "Item Ditambahkan",
        message: "Daftar item pengganti telah diperbarui.",
      });
      reloadTicket();
    },
    onError: (e: any) => {
      notifications.show({
        color: "red",
        title: "Gagal Menyimpan",
        message: e.message,
      });
    },
  });

  const timelineEvents = useMemo(() => {
    if (!ticket) return [];
    const history = (ticket.statusHistory || []).map((h: StatusHistory) => ({
      type: "status" as const,
      timestamp: h.waktu,
      status: h.statusBaru,
      note: h.catatan,
    }));
    return history.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [ticket]);

  const hasResolution = useMemo(
    () => ticket?.status === "Selesai" || ticket?.status === "Dibatalkan",
    [ticket?.status]
  );

  const partLines = useMemo(
    () =>
      ticket?.replacementItems?.map((p: ReplacementItem) => ({
        name: p.namaKomponen,
        qty: p.qty,
        keterangan: p.keterangan,
      })) ?? [],
    [ticket?.replacementItems]
  );

  if (loading) {
    return (
      <Paper withBorder p="lg" radius="md">
        <LoadingOverlay visible />
        <Text>Memuat...</Text>
      </Paper>
    );
  }

  if (!ticket) {
    return (
      <Paper withBorder p="lg" radius="md">
        <Alert color="red" title="Error">
          Ticket tidak ditemukan.
        </Alert>
      </Paper>
    );
  }

  const {
    nomorTiket,
    keluhanAwal,
    customerId,
    teknisiId,
    priority,
    status,
    tanggalMasuk,
    diperbaruiPada,
  } = ticket;

  const isFinalStatus = status === "Selesai" || status === "Dibatalkan";

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Stack gap={4}>
          <Group gap="xs" wrap="wrap">
            <Title order={3} style={{ lineHeight: 1.15 }}>
              {nomorTiket}
            </Title>
            <TicketStatusBadge status={status} />
            <TicketPriorityBadge priority={priority} />
          </Group>
          <Text c="dimmed">{keluhanAwal}</Text>
        </Stack>

        <Tooltip label="Tutup detail">
          <ActionIcon
            variant="light"
            radius="xl"
            onClick={closeDetail}
            aria-label="Tutup"
          >
            <IconX size={18} />
          </ActionIcon>
        </Tooltip>
      </Group>

      <Paper withBorder radius="md" p="sm">
        <Group>
          <Button
            leftSection={<IconHistory size={16} />}
            variant="outline"
            onClick={() => setStatusModalOpen(true)}
            disabled={isFinalStatus || statusMutation.isPending}
          >
            Ubah Status
          </Button>
          <Button
            leftSection={<IconPlus size={16} />}
            variant="outline"
            onClick={() => setItemModalOpen(true)}
            disabled={isFinalStatus || itemMutation.isPending}
          >
            Tambah Item
          </Button>
          <Button
            component={Link}
            href={`/views/tickets/${encodeURIComponent(id)}/note`}
            leftSection={<IconFileText size={16} />}
            variant="light"
            target="_blank"
            rel="noopener noreferrer"
            disabled={!ticket}
          >
            Lihat Nota
          </Button>
        </Group>
      </Paper>

      <Paper withBorder radius="md" p="md">
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Stack gap={4}>
            <Text size="sm" c="dimmed">
              Pemohon
            </Text>
            <Text fw={600}>{customerId?.nama ?? "N/A"}</Text>
          </Stack>
          <Stack gap={4}>
            <Text size="sm" c="dimmed">
              Assignee
            </Text>
            <Text fw={600}>{teknisiId?.nama ?? "-"}</Text>
          </Stack>

          <Stack gap={4}>
            <Text size="sm" c="dimmed">
              Dibuat
            </Text>
            <Text fw={600}>{formatDateTime(tanggalMasuk)}</Text>
          </Stack>
          <Stack gap={4}>
            <Text size="sm" c="dimmed">
              Diperbarui
            </Text>
            <Text fw={600}>{formatDateTime(diperbaruiPada)}</Text>
          </Stack>
        </SimpleGrid>

        <Divider my="md" />
        <Stack gap={6}>
          <Text fw={600}>Deskripsi Keluhan Awal</Text>
          <Text c="dimmed" style={{ whiteSpace: "pre-wrap" }}>
            {keluhanAwal}
          </Text>
        </Stack>
      </Paper>

      <Paper withBorder radius="md" p="md">
        <Title order={4} mb="md">
          Timeline Pengerjaan
        </Title>
        {timelineEvents.length > 0 ? (
          <Timeline
            active={timelineEvents.length}
            bulletSize={18}
            lineWidth={2}
          >
            {timelineEvents.map((event, index) => (
              <Timeline.Item
                key={index}
                title={event.status}
                bullet={
                  <ThemeIcon size={18} variant="light" radius="xl" color="gray">
                    <IconHistory size={12} />
                  </ThemeIcon>
                }
              >
                <Stack gap="xs" pt={4}>
                  <Text c="dimmed" size="sm" style={{ whiteSpace: "pre-wrap" }}>
                    {event.note}
                  </Text>
                  <Text size="xs" c="dimmed" mt="xs">
                    {formatDateTime(event.timestamp)}
                  </Text>
                </Stack>
              </Timeline.Item>
            ))}
          </Timeline>
        ) : (
          <Text c="dimmed" ta="center" py="md">
            Belum ada riwayat status yang dicatat.
          </Text>
        )}
      </Paper>

      {hasResolution ? (
        <Paper withBorder radius="md" p="md">
          <Group justify="space-between" mb="xs">
            <Text fw={700}>Ringkasan Penyelesaian</Text>
            {ticket.tanggalSelesai && (
              <Badge
                variant="light"
                color={ticket.status === "Selesai" ? "green" : "red"}
              >
                {ticket.status} {formatDateTime(String(ticket.tanggalSelesai))}
              </Badge>
            )}
          </Group>

          {partLines.length > 0 && (
            <>
              <Text size="sm" fw={500} mt="md">
                Suku Cadang Digunakan:
              </Text>
              <Table striped mt="xs">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Nama Komponen</Table.Th>
                    <Table.Th>Qty</Table.Th>
                    <Table.Th>Keterangan</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {partLines.map((p, i) => (
                    <Table.Tr key={i}>
                      <Table.Td>{p.name}</Table.Td>
                      <Table.Td>{p.qty}</Table.Td>
                      <Table.Td>{p.keterangan ?? "-"}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </>
          )}
        </Paper>
      ) : (
        <Paper withBorder radius="md" p="md">
          <Text c="dimmed">Ticket belum diselesaikan.</Text>
        </Paper>
      )}

      <UpdateStatusModal
        opened={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        currentStatus={status as TicketStatus}
        onSubmit={async (data) => {
          await statusMutation.mutateAsync(data);
        }}
      />

      <AddItemModal
        opened={itemModalOpen}
        onClose={() => setItemModalOpen(false)}
        onSubmit={async (data) => {
          await itemMutation.mutateAsync(data);
        }}
      />
    </Stack>
  );
}
