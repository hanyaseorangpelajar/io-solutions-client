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
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import {
  IconCircleCheck,
  IconEye,
  IconPencil,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { TicketResolutionInput } from "../model/schema";
import type { Ticket, TicketPriority, TicketStatus } from "../model/types";
import { formatDateTime } from "../utils/format";
import ResolveTicketModal from "./ResolveTicketModal";
import TicketFormModal from "./TicketFormModal";
import TicketPriorityBadge from "./TicketPriorityBadge";
import TicketStatusBadge from "./TicketStatusBadge";
import { ActionsDropdown } from "@/shared/ui/menus";
import {
  createTicket,
  deleteTicket,
  listTickets,
  resolveTicket,
  updateTicket,
} from "../api/tickets";

type RangeValue = [Date | null, Date | null];

export function TicketsListPage() {
  // filters
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<TicketStatus | "all">("all");
  const [priority, setPriority] = useState<TicketPriority | "all">("all");
  const [assignee, setAssignee] = useState<string | "all" | "unassigned">(
    "all"
  );
  const [range, setRange] = useState<RangeValue>([null, null]); // createdAt range

  // data
  const [rows, setRows] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editOpen, setEditOpen] = useState<null | Ticket>(null);

  // resolve modal (single/bulk)
  const [resolveFor, setResolveFor] = useState<null | "bulk" | Ticket>(null);

  // selection for bulk actions
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
      setRows(res.data);
    } catch (e: any) {
      notifications.show({
        color: "red",
        title: "Gagal memuat",
        message: e.message,
      });
    } finally {
      setLoading(false);
    }
  }, [q, status, priority, assignee, range]);

  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // initial load

  // refetch saat filter berubah (opsional: debounce)
  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  // dynamic options: assignee list (from current rows)
  const assigneeOptions = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => r.assignee && set.add(r.assignee));
    return [
      { value: "all", label: "Semua teknisi" },
      { value: "unassigned", label: "Tidak ditetapkan" },
      ...Array.from(set)
        .sort()
        .map((a) => ({ value: a, label: a })),
    ];
  }, [rows]);

  // selection helpers
  const filteredIds = rows.map((r) => r.id); // karena server-side filter sudah diterapkan
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
    { key: "code", header: "Kode", cell: (r) => r.code },
    { key: "subject", header: "Subjek", cell: (r) => r.subject, width: "26%" },
    { key: "requester", header: "Pemohon", cell: (r) => r.requester },
    {
      key: "assignee",
      header: "Teknisi",
      cell: (r) => r.assignee ?? "-",
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
      width: 160,
      align: "right",
      cell: (r) => (
        <ActionsDropdown
          items={[
            {
              label: "Lihat detail",
              icon: <IconEye size={16} />,
              href: `/views/tickets/${encodeURIComponent(r.id)}`,
            },
            {
              label: "Ubah",
              icon: <IconPencil size={16} />,
              onClick: () => setEditOpen(r),
            },
            {
              label: "Tandai selesai",
              icon: <IconCircleCheck size={16} />,
              onClick: () => setResolveFor(r),
              disabled: r.status === "resolved" || r.status === "closed",
            },
            { type: "divider" },
            {
              label: "Hapus",
              icon: <IconTrash size={16} />,
              color: "red",
              confirm: {
                title: "Hapus ticket?",
                message: r.code,
                labels: { confirm: "Hapus", cancel: "Batal" },
              },
              onClick: async () => {
                try {
                  await deleteTicket(r.id);
                  notifications.show({ title: "Terhapus", message: r.code });
                  fetchRows();
                } catch (e: any) {
                  notifications.show({
                    color: "red",
                    title: "Gagal hapus",
                    message: e.message,
                  });
                }
              },
            },
          ]}
        />
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
          Array.from(selected).map((id) => resolveTicket(id, payload))
        );
      } else {
        await resolveTicket(resolveFor.id, payload);
      }
      notifications.show({
        title: "Ticket resolved",
        message: "Perubahan tersimpan",
      });
      setSelected(new Set());
      closeResolve();
      fetchRows();
    } catch (e: any) {
      notifications.show({
        color: "red",
        title: "Gagal resolve",
        message: e.message,
      });
    }
  };

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
          data={[
            { value: "all", label: "Semua" },
            { value: "open", label: "Open" },
            { value: "in_progress", label: "In progress" },
            { value: "resolved", label: "Resolved" },
            { value: "closed", label: "Closed" },
          ]}
          value={status}
          onChange={(v) => setStatus((v as any) ?? "all")}
        />

        <Select
          label="Prioritas"
          data={[
            { value: "all", label: "Semua" },
            { value: "low", label: "Low" },
            { value: "medium", label: "Medium" },
            { value: "high", label: "High" },
            { value: "urgent", label: "Urgent" },
          ]}
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
        <LoadingOverlay visible={loading} />
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
        onSubmit={async (v) => {
          try {
            await createTicket(v);
            notifications.show({ title: "Tiket dibuat", message: v.subject });
            setFormOpen(false);
            fetchRows();
          } catch (e: any) {
            notifications.show({
              color: "red",
              title: "Gagal membuat",
              message: e.message,
            });
          }
        }}
      />

      {/* Modal Edit */}
      <TicketFormModal
        opened={!!editOpen}
        onClose={() => setEditOpen(null)}
        mode="edit"
        initial={editOpen ?? undefined}
        onSubmit={async (v) => {
          try {
            if (!editOpen) return;
            await updateTicket(editOpen.id, v);
            notifications.show({ title: "Tiket diubah", message: v.subject });
            setEditOpen(null);
            fetchRows();
          } catch (e: any) {
            notifications.show({
              color: "red",
              title: "Gagal mengubah",
              message: e.message,
            });
          }
        }}
      />

      {/* Modal Resolve (single / bulk) */}
      <ResolveTicketModal
        opened={resolveOpen}
        onClose={closeResolve}
        onSubmit={handleResolveSubmit}
      />
    </Stack>
  );
}
