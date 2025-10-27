"use client";

import TextField from "@/shared/ui/inputs/TextField";
import { SimpleTable, type Column } from "@/shared/ui/table/SimpleTable";
import {
  Button,
  Checkbox,
  Group,
  Select,
  Stack,
  Text,
  Title,
  LoadingOverlay,
  Menu, // Impor Menu
  ActionIcon, // Impor ActionIcon
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import {
  IconCircleCheck,
  IconEye,
  IconPlus,
  IconUser,
  IconChevronRight,
  IconArrowsExchange,
  IconDots, // Impor IconDots
} from "@tabler/icons-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { TicketResolutionInput } from "../model/schema";
import type { Ticket, TicketPriority, TicketStatus } from "../model/types";
import { formatDateTime } from "../utils/format";
import ResolveTicketModal from "./ResolveTicketModal";
import TicketFormModal from "./TicketFormModal";
import TicketPriorityBadge from "./TicketPriorityBadge";
import TicketStatusBadge from "./TicketStatusBadge";
// Kita tidak akan gunakan ActionsDropdown lagi untuk sel ini
// import { ActionsDropdown } from "@/shared/ui/menus";

import {
  createTicket,
  listTickets,
  resolveTicket,
  assignTicket,
  updateTicketStatus,
} from "../api/tickets";

import { getStaffList } from "@/features/staff/api/staff";
import type { Staff } from "@/features/staff/model/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type RangeValue = [Date | null, Date | null];

const STATUS_OPTIONS = [
  { value: "all", label: "Semua" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];
const PRIORITY_OPTIONS = [
  { value: "all", label: "Semua" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

// Map helper untuk nama status
const statusLabelMap = new Map(STATUS_OPTIONS.map((s) => [s.value, s.label]));

export function TicketsListPage() {
  const queryClient = useQueryClient();

  // filters
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<TicketStatus | "all">("all");
  const [priority, setPriority] = useState<TicketPriority | "all">("all");
  const [assignee, setAssignee] = useState<string | "all" | "unassigned">(
    "all"
  );
  const [range, setRange] = useState<RangeValue>([null, null]);

  // data
  const [rows, setRows] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [resolveFor, setResolveFor] = useState<null | "bulk" | Ticket>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // fetch helper
  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      const [from, to] = range;
      const res = await listTickets({
        q: q || undefined,
        status: status === "all" ? undefined : status,
        priority: priority === "all" ? undefined : priority,
        assignee: assignee,
        from: from ? from.toISOString() : undefined,
        to: to ? to.toISOString() : undefined,
        sortBy: "updatedAt",
        order: "desc",
        page: 1,
        limit: 100,
      });
      const data = res.data ?? []; // Pastikan array
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
        const usersData = userRes ?? []; // Pastikan array
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

  // Opsi assignee dari 'users' state
  const assigneeOptions = useMemo(() => {
    return [
      { value: "all", label: "Semua teknisi" },
      { value: "unassigned", label: "Tidak ditetapkan" },
      ...users
        .filter((u) => u.role === "Teknisi" || u.role === "Admin")
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((u) => ({ value: u.id, label: u.name })),
    ];
  }, [users]);

  // Map untuk lookup nama teknisi
  const userNameMap = useMemo(
    () => new Map(users.map((u) => [u.id, u.name])),
    [users]
  );

  // selection helpers
  const filteredIds = rows.map((r) => r.id);
  const allSelectedInFiltered =
    filteredIds.length > 0 && filteredIds.every((id) => selected.has(id));
  const someSelectedInFiltered =
    filteredIds.some((id) => selected.has(id)) && !allSelectedInFiltered;

  const toggleRow = (id: string, checked: boolean) => {
    setSelected((prev) => {
      const s = new Set(prev);
      if (checked) s.add(id);
      else s.delete(id);
      return s;
    });
  };
  const toggleSelectedFiltered = (checked: boolean) => {
    setSelected((prev) => {
      const s = new Set(prev);
      if (checked) filteredIds.forEach((id) => s.add(id));
      else filteredIds.forEach((id) => s.delete(id));
      return s;
    });
  };

  // ---- Mutasi (useMutation) ----

  const createMutation = useMutation({
    mutationFn: createTicket,
    onSuccess: (newTicket) => {
      notifications.show({ title: "Tiket dibuat", message: newTicket.subject });
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

  const resolveMutation = useMutation({
    mutationFn: (vars: { id: string; payload: TicketResolutionInput }) =>
      resolveTicket(vars.id, vars.payload),
    onSuccess: () => {
      notifications.show({
        title: "Ticket resolved",
        message: "Perubahan tersimpan",
      });
      setSelected(new Set());
      closeResolve();
      fetchRows();
    },
    onError: (e: any) => {
      notifications.show({
        color: "red",
        title: "Gagal resolve",
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
        message: `Tiket #${updatedTicket.code} ditugaskan.`,
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
        message: `Tiket #${updatedTicket.code} menjadi ${statusLabelMap.get(
          updatedTicket.status
        )}.`,
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
  // ------------------------------------

  // columns
  const columns: Column<Ticket>[] = [
    {
      key: "select",
      header: (
        <Checkbox
          aria-label="Pilih semua"
          checked={allSelectedInFiltered}
          indeterminate={someSelectedInFiltered}
          onChange={(e) => toggleSelectedFiltered(e.currentTarget.checked)}
        />
      ),
      cell: (r) => (
        <Checkbox
          aria-label={`Pilih ${r.code}`}
          checked={selected.has(r.id)}
          onChange={(e) => toggleRow(r.id, e.currentTarget.checked)}
        />
      ),
      width: 40,
      align: "center",
    },
    { key: "code", header: "Kode", cell: (r) => r.code, width: 140 },
    { key: "subject", header: "Subjek", cell: (r) => r.subject, width: "26%" },
    { key: "requester", header: "Pemohon", cell: (r) => r.requester },
    {
      key: "assignee",
      header: "Teknisi",
      // PERBAIKAN: Cek null/undefined sebelum 'get'
      cell: (r) => (r.assignee ? userNameMap.get(r.assignee) : null) ?? "-",
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
      cell: (r) => formatDateTime(r.createdAt),
      width: 180,
    },
    {
      key: "actions",
      header: "",
      width: 56, // Perkecil lebar
      align: "right",
      // PERBAIKAN: Gunakan <Menu> standar Mantine, bukan ActionsDropdown
      cell: (r) => (
        <Menu withinPortal position="bottom-end" shadow="sm">
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray">
              <IconDots size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEye size={14} />}
              component="a" // Asumsi Anda pakai Next.js Link atau <a>
              href={`/views/tickets/${encodeURIComponent(r.id)}`} // Sesuaikan path
            >
              Lihat detail
            </Menu.Item>

            {/* Submenu Assign */}
            <Menu position="right-start" withArrow shadow="sm">
              <Menu.Target>
                <Menu.Item
                  leftSection={<IconUser size={14} />}
                  rightSection={<IconChevronRight size={14} />}
                >
                  Tugaskan Teknisi
                </Menu.Item>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  onClick={() =>
                    assignMutation.mutate({ ticketId: r.id, userId: null })
                  }
                  disabled={assignMutation.isPending}
                >
                  Unassigned
                </Menu.Item>
                <Menu.Divider />
                {users
                  .filter((u) => u.role === "Teknisi" || u.role === "Admin")
                  .map((user) => (
                    <Menu.Item
                      key={user.id}
                      onClick={() =>
                        assignMutation.mutate({
                          ticketId: r.id,
                          userId: user.id,
                        })
                      }
                      disabled={
                        assignMutation.isPending || r.assignee === user.id
                      }
                    >
                      {user.name}
                    </Menu.Item>
                  ))}
              </Menu.Dropdown>
            </Menu>

            {/* Submenu Status */}
            <Menu position="right-start" withArrow shadow="sm">
              <Menu.Target>
                <Menu.Item
                  leftSection={<IconArrowsExchange size={14} />}
                  rightSection={<IconChevronRight size={14} />} // PERBAIKAN: Typo 1LED -> 14
                >
                  Ubah Status
                </Menu.Item>
              </Menu.Target>
              <Menu.Dropdown>
                {STATUS_OPTIONS.filter((s) => s.value !== "all").map((opt) => (
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

            <Menu.Divider />

            {/* Tombol Resolve */}
            <Menu.Item
              leftSection={<IconCircleCheck size={14} />}
              onClick={() => setResolveFor(r)}
              disabled={
                r.status === "resolved" ||
                r.status === "closed" ||
                resolveMutation.isPending
              }
            >
              Tandai selesai
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];

  // ---- Resolve modal wiring ----
  const resolveOpen = resolveFor !== null;
  const closeResolve = () => setResolveFor(null);

  const handleResolveSubmit = async (payload: TicketResolutionInput) => {
    if (!resolveFor) return;
    try {
      if (resolveFor === "bulk") {
        await Promise.all(
          Array.from(selected).map((id) =>
            resolveMutation.mutateAsync({ id, payload })
          )
        );
      } else {
        await resolveMutation.mutateAsync({ id: resolveFor.id, payload });
      }
    } catch (e) {
      // Error dihandle oleh mutasi
    }
  };

  const isMutating =
    createMutation.isPending ||
    resolveMutation.isPending ||
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

      {/* Toolbar filter */}
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
      </Group>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            {selected.size} tiket dipilih
          </Text>
          <Group gap="xs">
            <Button
              leftSection={<IconCircleCheck size={16} />}
              onClick={() => setResolveFor("bulk")}
            >
              Tandai selesai
            </Button>
            <Button variant="subtle" onClick={() => setSelected(new Set())}>
              Batalkan pilihan
            </Button>
          </Group>
        </Group>
      )}

      {/* Tabel + overlay loading */}
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

      {/* Modal Create */}
      <TicketFormModal
        opened={formOpen}
        onClose={() => setFormOpen(false)}
        users={users}
        onSubmit={async (v) => {
          await createMutation.mutateAsync(v);
        }}
      />

      {/* Modal Resolve (single / bulk) */}
      <ResolveTicketModal
        opened={resolveOpen}
        onClose={closeResolve}
        onSubmit={handleResolveSubmit}
        ticket={resolveFor === "bulk" ? null : resolveFor}
      />
    </Stack>
  );
}
