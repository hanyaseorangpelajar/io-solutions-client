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
} from "@mantine/core";
import { IconX, IconNotes, IconTool, IconFileText } from "@tabler/icons-react";
import { useParams, useRouter } from "next/navigation";
import type { Ticket, Diagnostic, Action, PartUsage } from "../model/types";
import TicketPriorityBadge from "./TicketPriorityBadge";
import TicketStatusBadge from "./TicketStatusBadge";
import { formatDateTime } from "../utils/format";
import { getTicket, addDiagnosis, addAction } from "../api/tickets";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";

import AddDiagnosisModal from "./AddDiagnosisModal";
import AddActionModal from "./AddActionModal";

// Impor API dan Tipe Data Parts
import { listParts, type Part } from "@/features/inventory/api/parts";
// PERBAIKAN: Impor API dan Tipe Data Staff
import { getStaffList } from "@/features/staff/api/staff";
import type { Staff } from "@/features/staff/model/types";

export default function TicketDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = String(params?.id ?? "");

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [inventoryParts, setInventoryParts] = useState<Part[]>([]);
  const [users, setUsers] = useState<Staff[]>([]); // PERBAIKAN: State untuk staff/users
  const [loading, setLoading] = useState(true);

  const [diagModalOpen, setDiagModalOpen] = useState(false);
  const [actionModalOpen, setActionModalOpen] = useState(false);

  const closeDetail = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/views/tickets");
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        // Ambil semua data sekaligus
        const [ticketData, partsData, usersData] = await Promise.all([
          getTicket(id),
          listParts(),
          getStaffList(),
        ]);

        if (active) {
          setTicket(ticketData);
          setInventoryParts(partsData);
          setUsers(usersData); // Simpan data staff
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
  }, [id]);

  // PERBAIKAN: Buat Map untuk nama user
  const userNameMap = useMemo(
    () => new Map(users.map((u) => [u.id, u.name])),
    [users]
  );

  // Mutasi untuk Diagnosis
  const diagnosisMutation = useMutation({
    mutationFn: (vars: {
      id: string;
      payload: { symptom: string; diagnosis: string };
    }) => addDiagnosis(vars.id, vars.payload),
    onSuccess: (updatedTicket) => {
      setTicket(updatedTicket);
      queryClient.invalidateQueries({ queryKey: ["tickets", id] });
      notifications.show({
        color: "green",
        title: "Diagnosis disimpan",
        message: "Timeline telah diperbarui.",
      });
    },
    onError: (e: any) => {
      notifications.show({
        color: "red",
        title: "Gagal menyimpan",
        message: e.message,
      });
    },
  });

  // Mutasi untuk Tindakan
  const actionMutation = useMutation({
    mutationFn: (vars: {
      id: string;
      payload: { actionTaken: string; partsUsed: PartUsage[] };
    }) => addAction(vars.id, vars.payload),
    onSuccess: (updatedTicket) => {
      setTicket(updatedTicket);
      queryClient.invalidateQueries({ queryKey: ["tickets", id] });
      notifications.show({
        color: "green",
        title: "Tindakan disimpan",
        message: "Timeline telah diperbarui.",
      });
    },
    onError: (e: any) => {
      notifications.show({
        color: "red",
        title: "Gagal menyimpan",
        message: e.message,
      });
    },
  });

  if (loading) {
    return (
      <Paper withBorder p="lg" radius="md">
        <Text>Memuat...</Text>
      </Paper>
    );
  }

  if (!ticket) {
    return (
      <Paper withBorder p="lg" radius="md">
        <Text>Ticket tidak ditemukan.</Text>
      </Paper>
    );
  }

  const {
    code,
    subject,
    requester,
    assignee, // Ini ID
    priority,
    status,
    createdAt,
    updatedAt,
    description,
    resolution,
    diagnostics,
    actions,
  } = ticket;

  const timelineEvents = useMemo(() => {
    const diags = (diagnostics || []).map((d: Diagnostic) => ({
      ...d,
      type: "diagnosis" as const,
      timestamp: d.timestamp || createdAt,
    }));
    const acts = (actions || []).map((a: Action) => ({
      ...a,
      type: "action" as const,
      timestamp: a.timestamp || createdAt,
    }));

    return [...diags, ...acts].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [diagnostics, actions, createdAt]);

  const hasResolution = !!resolution;

  const partLines = useMemo(
    () =>
      resolution?.parts?.map((p: PartUsage) => ({
        name: p.name,
        qty: p.qty,
      })) ?? [],
    [resolution]
  );

  return (
    <Stack gap="md">
      {/* Header */}
      <Group justify="space-between" align="center">
        <Stack gap={4}>
          <Group gap="xs" wrap="wrap">
            <Title order={3} style={{ lineHeight: 1.15 }}>
              {code}
            </Title>
            <TicketStatusBadge status={status} />
            <TicketPriorityBadge priority={priority} />
          </Group>
          <Text c="dimmed">{subject}</Text>
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

      {/* Tombol Aksi Utama */}
      <Paper withBorder radius="md" p="sm">
        <Group>
          <Button
            leftSection={<IconNotes size={16} />}
            variant="outline"
            onClick={() => setDiagModalOpen(true)}
            disabled={status === "resolved" || status === "closed"}
          >
            Tambah Diagnosis
          </Button>
          <Button
            leftSection={<IconTool size={16} />}
            variant="outline"
            onClick={() => setActionModalOpen(true)}
            disabled={status === "resolved" || status === "closed"}
          >
            Tambah Tindakan
          </Button>
          <Button
            component={Link} // Use Next.js Link
            href={`/views/tickets/${encodeURIComponent(id)}/note`} // Link to the new page
            leftSection={<IconFileText size={16} />}
            variant="light"
            target="_blank" // Open in new tab (optional, good for printing)
            rel="noopener noreferrer" // Security for target="_blank"
            disabled={!ticket} // Disable if ticket data isn't loaded
          >
            Lihat Nota
          </Button>
        </Group>
      </Paper>

      {/* Info Detail Tiket */}
      <Paper withBorder radius="md" p="md">
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Stack gap={4}>
            <Text size="sm" c="dimmed">
              Pemohon
            </Text>
            <Text fw={600}>{requester}</Text>
          </Stack>
          <Stack gap={4}>
            <Text size="sm" c="dimmed">
              Assignee
            </Text>
            {/* PERBAIKAN: Tampilkan nama, bukan ID */}
            <Text fw={600}>
              {(assignee ? userNameMap.get(assignee) : null) ?? "-"}
            </Text>
          </Stack>

          <Stack gap={4}>
            <Text size="sm" c="dimmed">
              Dibuat
            </Text>
            <Text fw={600}>{formatDateTime(createdAt)}</Text>
          </Stack>
          <Stack gap={4}>
            <Text size="sm" c="dimmed">
              Diperbarui
            </Text>
            <Text fw={600}>{formatDateTime(updatedAt)}</Text>
          </Stack>
        </SimpleGrid>

        {description && (
          <>
            <Divider my="md" />
            <Stack gap={6}>
              <Text fw={600}>Deskripsi</Text>
              <Text c="dimmed" style={{ whiteSpace: "pre-wrap" }}>
                {description}
              </Text>
            </Stack>
          </>
        )}
      </Paper>

      {/* Timeline */}
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
                title={
                  event.type === "diagnosis" ? "Diagnosis" : "Tindakan Diambil"
                }
                bullet={
                  event.type === "diagnosis" ? (
                    <ThemeIcon
                      size={18}
                      variant="light"
                      radius="xl"
                      color="blue"
                    >
                      <IconNotes size={12} />
                    </ThemeIcon>
                  ) : (
                    <ThemeIcon
                      size={18}
                      variant="light"
                      radius="xl"
                      color="orange"
                    >
                      <IconTool size={12} />
                    </ThemeIcon>
                  )
                }
              >
                <Stack gap="xs" pt={4}>
                  {event.type === "diagnosis" && (
                    <>
                      <Text fw={500} size="sm">
                        Gejala:
                      </Text>
                      <Text
                        c="dimmed"
                        size="sm"
                        style={{ whiteSpace: "pre-wrap" }}
                      >
                        {event.symptom}
                      </Text>
                      <Text fw={500} size="sm" mt="xs">
                        Diagnosis:
                      </Text>
                      <Text
                        c="dimmed"
                        size="sm"
                        style={{ whiteSpace: "pre-wrap" }}
                      >
                        {event.diagnosis}
                      </Text>
                    </>
                  )}
                  {event.type === "action" && (
                    <>
                      <Text fw={500} size="sm">
                        Tindakan:
                      </Text>
                      <Text
                        c="dimmed"
                        size="sm"
                        style={{ whiteSpace: "pre-wrap" }}
                      >
                        {event.actionTaken}
                      </Text>
                      {event.partsUsed && event.partsUsed.length > 0 && (
                        <>
                          <Text fw={500} size="sm" mt="xs">
                            Parts Digunakan:
                          </Text>
                          <ul style={{ margin: 0, paddingLeft: 20 }}>
                            {event.partsUsed.map((p: PartUsage, i: number) => (
                              <li key={i}>
                                <Text c="dimmed" size="sm">
                                  {p.name} (Qty: {p.qty})
                                </Text>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </>
                  )}
                  <Text size="xs" c="dimmed" mt="xs">
                    {formatDateTime(event.timestamp)}
                  </Text>
                </Stack>
              </Timeline.Item>
            ))}
          </Timeline>
        ) : (
          <Text c="dimmed" ta="center" py="md">
            Belum ada diagnosis atau tindakan yang dicatat.
          </Text>
        )}
      </Paper>

      {/* Resolution */}
      {hasResolution ? (
        <Paper withBorder radius="md" p="md">
          {/* ... (Tampilan Resolusi sama) ... */}
          <Group justify="space-between" mb="xs">
            <Text fw={700}>Ringkasan Penyelesaian</Text>
            {resolution?.resolvedAt && (
              <Badge variant="light" color="green">
                Selesai {formatDateTime(String(resolution.resolvedAt))}
              </Badge>
            )}
          </Group>
          {/* ... (Sisa tampilan resolusi) ... */}
        </Paper>
      ) : (
        <Paper withBorder radius="md" p="md">
          <Text c="dimmed">Ticket belum diselesaikan.</Text>
        </Paper>
      )}

      {/* --- MODALS --- */}

      <AddDiagnosisModal
        opened={diagModalOpen}
        onClose={() => setDiagModalOpen(false)}
        onSubmit={async (data) => {
          await diagnosisMutation.mutateAsync({ id, payload: data });
        }}
      />

      <AddActionModal
        opened={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
        inventoryParts={inventoryParts}
        onSubmit={async (data) => {
          await actionMutation.mutateAsync({ id, payload: data });
        }}
      />
    </Stack>
  );
}
