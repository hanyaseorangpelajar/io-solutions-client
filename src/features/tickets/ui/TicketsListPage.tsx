"use client";

import Link from "next/link";
import TextField from "@/shared/ui/inputs/TextField";
import { SimpleTable, type Column } from "@/shared/ui/table/SimpleTable";
import {
  Button,
  Group,
  Select,
  Stack,
  Text,
  Title,
  LoadingOverlay,
  Menu,
  ActionIcon,
  Modal,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import {
  IconArchive,
  IconEye,
  IconPlus,
  IconUser,
  IconChevronRight,
  IconArrowsExchange,
  IconDots,
} from "@tabler/icons-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { TicketCompleteInput } from "../model/schema";
import type { Ticket, TicketPriority, TicketStatus } from "../model/types";
import { formatDateTime } from "../utils/format";
import ReviewTicketModal from "./ReviewTicketModal";
import TicketFormModal from "./TicketFormModal";
import TicketPriorityBadge from "./TicketPriorityBadge";
import TicketStatusBadge from "./TicketStatusBadge";
import {
  createTicket,
  listTickets,
  completeTicketAndCreateKB,
  assignTicket,
  updateTicketStatus,
} from "../api/tickets";
import { useAuth } from "@/features/auth";
import { getStaffList } from "@/features/staff/api/staff";
import type { Staff } from "@/features/staff";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type RangeValue = [Date | null, Date | null];

const STATUS_OPTIONS = [
  { value: "all", label: "Semua" },
  { value: "Diagnosis", label: "Diagnosis" },
  { value: "DalamProses", label: "Dalam Proses" },
  { value: "MenungguSparepart", label: "Menunggu Sparepart" },
  { value: "Selesai", label: "Selesai (Menunggu Review)" },
  { value: "Diarsipkan", label: "Diarsipkan" },
  { value: "Dibatalkan", label: "Dibatalkan" },
];

const PRIORITY_OPTIONS = [
  { value: "all", label: "Semua" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

const statusLabelMap = new Map(STATUS_OPTIONS.map((s) => [s.value, s.label]));

export function TicketsListPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userRole = user?.role;
  const currentUserId = user?.id;
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<TicketStatus | "all">("all");
  const [priority, setPriority] = useState<TicketPriority | "all">("all");
  const [assignee, setAssignee] = useState<string | "all" | "unassigned">(
    "all"
  );
  const [range, setRange] = useState<RangeValue>([null, null]);

  const [rows, setRows] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [reviewFor, setReviewFor] = useState<null | Ticket>(null);
  const [assignFor, setAssignFor] = useState<Ticket | null>(null);
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<string | null>(
    null
  );

  const clearFilters = () => {
    setQ("");
    setStatus("all");
    setPriority("all");
    setAssignee("all");
    setRange([null, null]);
  };

  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      const [from, to] = range;
      const fromISO = from ? new Date(from).toISOString() : undefined;
      const toISO = to ? new Date(to).toISOString() : undefined;
      const res = await listTickets({
        q: q || undefined,
        status: status === "all" ? undefined : status,
        priority: priority === "all" ? undefined : priority,
        assignee: assignee,
        from: fromISO,
        to: toISO,
        sortBy: "diperbaruiPada",
        order: "desc",
        page: 1,
        limit: 100,
      });
      const data = res.data ?? [];
      setRows(data);
      queryClient.setQueryData(["tickets", "list"], data);
    } catch (e: any) {
      notifications.show({
        color: "red",
        title: "Gagal memuat tiket",
        message: e.message,
      });
    } finally {
      setLoading(false);
    }
  }, [q, status, priority, assignee, range, queryClient]);

  useEffect(() => {
    async function fetchInitialData() {
      setLoading(true);
      try {
        const userRes = await getStaffList();
        const usersData = userRes ?? [];
        setUsers(usersData);
        queryClient.setQueryData(["staff", "list"], usersData);
        await fetchRows();
      } catch (e: any) {
        notifications.show({
          color: "red",
          title: "Gagal memuat data",
          message: e.message,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchInitialData();
  }, [fetchRows, queryClient]);

  const assigneeOptions = useMemo(() => {
    return [
      { value: "all", label: "Semua teknisi" },
      { value: "unassigned", label: "Tidak ditetapkan" },
      ...users
        .filter((u) => u.role === "Teknisi" || u.role === "Admin")
        .sort((a, b) => a.nama.localeCompare(b.nama))
        .map((u) => ({ value: u.id, label: u.nama })),
    ];
  }, [users]);

  const userNameMap = useMemo(
    () => new Map(users.map((u) => [u.id, u.nama])),
    [users]
  );

  const createMutation = useMutation({
    mutationFn: createTicket,
    onSuccess: (newTicket) => {
      notifications.show({
        title: "Tiket dibuat",
        message: newTicket.nomorTiket,
      });
      setFormOpen(false);
      fetchRows();
    },
    onError: (e: any) => {
      notifications.show({
        color: "red",
        title: "Gagal membuat",
        message: e.message,
      });
    },
  });

  const reviewMutation = useMutation({
    mutationFn: (vars: { id: string; payload: TicketCompleteInput }) =>
      completeTicketAndCreateKB(vars.id, vars.payload),
    onSuccess: () => {
      notifications.show({
        title: "Tiket Diarsipkan",
        message: "Tiket telah di-review dan KB Entry dibuat.",
      });
      closeReview();
      fetchRows();
    },
    onError: (e: any) => {
      notifications.show({
        color: "red",
        title: "Gagal Review Tiket",
        message: e.message,
      });
    },
  });

  const assignMutation = useMutation({
    mutationFn: (vars: { ticketId: string; userId: string | null }) =>
      assignTicket(vars.ticketId, vars.userId),
    onSuccess: (updatedTicket) => {
      notifications.show({
        title: "Teknisi diubah",
        message: `Tiket #${updatedTicket.nomorTiket} ditugaskan.`,
      });
      setRows((prevRows) =>
        prevRows.map((t) => (t.id === updatedTicket.id ? updatedTicket : t))
      );
      queryClient.setQueryData(["tickets", "list"], (old: Ticket[] = []) =>
        old.map((t) => (t.id === updatedTicket.id ? updatedTicket : t))
      );
    },
    onError: (e: any) => {
      notifications.show({
        color: "red",
        title: "Gagal assign",
        message: e.message,
      });
    },
  });

  const statusMutation = useMutation({
    mutationFn: (vars: { ticketId: string; status: TicketStatus }) =>
      updateTicketStatus(vars.ticketId, vars.status),
    onSuccess: (updatedTicket) => {
      notifications.show({
        title: "Status diubah",
        message: `Tiket #${
          updatedTicket.nomorTiket
        } menjadi ${statusLabelMap.get(updatedTicket.status)}.`,
      });
      setRows((prevRows) =>
        prevRows.map((t) => (t.id === updatedTicket.id ? updatedTicket : t))
      );
      queryClient.setQueryData(["tickets", "list"], (old: Ticket[] = []) =>
        old.map((t) => (t.id === updatedTicket.id ? updatedTicket : t))
      );
    },
    onError: (e: any) => {
      notifications.show({
        color: "red",
        title: "Gagal ubah status",
        message: e.message,
      });
    },
  });

  const columns: Column<Ticket>[] = useMemo(
    () => [
      {
        key: "code",
        header: "Kode",
        cell: (r) => r.nomorTiket,
        width: 140,
      },
      {
        key: "requester",
        header: "Pemohon",
        cell: (r) => r.customerId?.nama ?? "-",
      },
      {
        key: "assignee",
        header: "Teknisi",
        cell: (r) => r.teknisiId?.nama ?? "-",
        align: "center",
      },
      {
        key: "priority",
        header: "Prioritas",
        cell: (r) => <TicketPriorityBadge priority={r.priority} />,
        align: "center",
      },
      {
        key: "status",
        header: "Status",
        cell: (r) => <TicketStatusBadge status={r.status} />,
        align: "center",
      },
      {
        key: "createdAt",
        header: "Dibuat",
        cell: (r) => formatDateTime(r.tanggalMasuk),
        width: 180,
      },
      {
        key: "actions",
        header: "",
        width: 56,
        align: "right",
        cell: (r) => {
          const hasAssignee = !!r.teknisiId;
          const isAssignedToMe = currentUserId === r.teknisiId?.id;
          const isAdmin = userRole === "Admin" || userRole === "SysAdmin";

          const isTechnician = userRole === "Teknisi";
          const isReviewable =
            isAdmin && (r.status === "Selesai" || r.status === "Dibatalkan");
          const isFinal =
            r.status === "Diarsipkan" ||
            (isTechnician &&
              (r.status === "Selesai" || r.status === "Dibatalkan"));

          return (
            <Menu withinPortal position="bottom-end" shadow="sm">
              <Menu.Target>
                <ActionIcon variant="subtle" color="gray">
                  <IconDots size={16} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconEye size={14} />}
                  component={Link}
                  href={`/views/tickets/${encodeURIComponent(r.id)}`}
                >
                  Lihat detail
                </Menu.Item>

                <Menu
                  withinPortal
                  position="left-start"
                  withArrow
                  shadow="sm"
                  trigger="hover"
                >
                  <Menu.Target>
                    <Menu.Item
                      leftSection={<IconUser size={14} />}
                      onClick={() => {
                        setAssignFor(r);
                        setSelectedAssigneeId(r.teknisiId?.id ?? null);
                      }}
                    >
                      {hasAssignee ? "Ubah Penugasan" : "Tugaskan Teknisi"}
                    </Menu.Item>
                  </Menu.Target>
                </Menu>

                {isTechnician && isAssignedToMe && (
                  <Menu
                    withinPortal
                    position="left-start"
                    withArrow
                    shadow="sm"
                    trigger="hover"
                  >
                    <Menu.Target>
                      <Menu.Item
                        leftSection={<IconArrowsExchange size={14} />}
                        rightSection={<IconChevronRight size={14} />}
                        disabled={isFinal}
                      >
                        Ubah Status
                      </Menu.Item>
                    </Menu.Target>
                    <Menu.Dropdown>
                      {STATUS_OPTIONS.filter(
                        (s) => s.value !== "all" && s.value !== "Diarsipkan"
                      ).map((opt) => (
                        <Menu.Item
                          key={opt.value}
                          onClick={() =>
                            statusMutation.mutate({
                              ticketId: r.id,
                              status: opt.value as TicketStatus,
                            })
                          }
                          disabled={
                            statusMutation.isPending || r.status === opt.value
                          }
                        >
                          {opt.label}
                        </Menu.Item>
                      ))}
                    </Menu.Dropdown>
                  </Menu>
                )}

                <Menu.Divider />

                <Menu.Item
                  leftSection={<IconArchive size={14} />}
                  onClick={() => setReviewFor(r)}
                  disabled={!isReviewable || reviewMutation.isPending}
                  hidden={!isAdmin}
                >
                  Review & Arsipkan
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          );
        },
      },
    ],
    [
      userNameMap,
      users,
      assignMutation,
      statusMutation,
      reviewMutation,
      userRole,
      currentUserId,
    ]
  );

  const closeReview = () => setReviewFor(null);

  const handleReviewSubmit = async (payload: TicketCompleteInput) => {
    if (!reviewFor) return;
    try {
      await reviewMutation.mutateAsync({ id: reviewFor.id, payload });
    } catch (e) {}
  };

  const isMutating =
    createMutation.isPending ||
    reviewMutation.isPending ||
    assignMutation.isPending ||
    statusMutation.isPending;

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={3}>Tickets</Title>
        <Group gap="xs" wrap="nowrap">
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setFormOpen(true)}
          >
            Buat Ticket
          </Button>
        </Group>
      </Group>

      <Group align="end" wrap="wrap" gap="sm">
        <TextField
          label="Cari"
          placeholder="Kode / Subjek / Pemohon"
          value={q}
          onChange={(e) => setQ(e.currentTarget.value)}
          style={{ minWidth: 260 }}
        />
        <Select
          label="Status"
          data={STATUS_OPTIONS}
          value={status}
          onChange={(v) => setStatus((v as any) ?? "all")}
        />
        <Select
          label="Prioritas"
          data={PRIORITY_OPTIONS}
          value={priority}
          onChange={(v) => setPriority((v as any) ?? "all")}
        />
        <Select
          searchable
          clearable={false}
          label="Teknisi"
          data={assigneeOptions}
          value={assignee}
          onChange={(v) => setAssignee((v as any) ?? "all")}
          style={{ minWidth: 200 }}
        />
        <DatePickerInput
          type="range"
          label="Rentang tanggal (dibuat)"
          placeholder="Pilih tanggal"
          value={range}
          onChange={(v) => setRange(v as RangeValue)}
          style={{ minWidth: 260 }}
          popoverProps={{ withinPortal: true }}
        />
        <Button variant="light" onClick={clearFilters}>
          Bersihkan Filter
        </Button>
      </Group>

      <div style={{ position: "relative" }}>
        <LoadingOverlay visible={loading || isMutating} />
        <SimpleTable<Ticket>
          dense="sm"
          zebra
          stickyHeader
          maxHeight={520}
          columns={columns}
          data={rows}
          emptyText="Tidak ada tiket"
        />
      </div>

      <TicketFormModal
        opened={formOpen}
        onClose={() => setFormOpen(false)}
        users={users}
        onSubmit={async (v) => {
          await createMutation.mutateAsync(v);
        }}
        userRole={userRole}
      />

      <ReviewTicketModal
        opened={!!reviewFor}
        onClose={closeReview}
        onSubmit={handleReviewSubmit}
        ticket={reviewFor}
      />

      <Modal
        opened={!!assignFor}
        onClose={() => setAssignFor(null)}
        title={
          assignFor
            ? `Tentukan teknisi untuk #${assignFor.nomorTiket}`
            : "Tentukan teknisi"
        }
        withinPortal
      >
        <Stack gap="sm">
          <Select
            searchable
            clearable
            label="Teknisi"
            placeholder="Ketik untuk mencari…"
            data={users
              .filter((u) => (u.role ?? "").toLowerCase() === "teknisi")
              .sort((a, b) => a.nama.localeCompare(b.nama))
              .map((u) => ({ value: u.id, label: u.nama }))}
            value={selectedAssigneeId}
            onChange={(v) => setSelectedAssigneeId(v)}
            nothingFoundMessage="Tidak ditemukan"
            maxDropdownHeight={300}
            withCheckIcon={false}
          />
          <Group justify="space-between">
            <Button variant="subtle" onClick={() => setAssignFor(null)}>
              Batal
            </Button>
            <Button
              loading={assignMutation.isPending}
              onClick={() => {
                if (!assignFor) return;
                assignMutation.mutate({
                  ticketId: assignFor.id,
                  userId: selectedAssigneeId ?? null,
                });
                setAssignFor(null);
              }}
            >
              Simpan
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
