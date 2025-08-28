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
import Link from "next/link";
import { useMemo, useState } from "react";
import { MOCK_TICKETS } from "../model/mock";
import type { TicketResolutionInput } from "../model/schema";
import type { Ticket, TicketPriority, TicketStatus } from "../model/types";
import { formatDateTime } from "../utils/format";
import ResolveTicketModal from "./ResolveTicketModal";
import TicketFormModal from "./TicketFormModal";
import TicketPriorityBadge from "./TicketPriorityBadge";
import TicketRowActionsMenu from "./TicketRowActionsMenu";
import TicketStatusBadge from "./TicketStatusBadge";
import { ActionsDropdown } from "@/shared/ui/menus";

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
  const [rows, setRows] = useState<Ticket[]>(MOCK_TICKETS);
  const [formOpen, setFormOpen] = useState(false);
  const [editOpen, setEditOpen] = useState<null | Ticket>(null);

  // resolve modal (single/bulk)
  const [resolveFor, setResolveFor] = useState<null | "bulk" | Ticket>(null);

  // selection for bulk actions
  const [selected, setSelected] = useState<Set<string>>(new Set());

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

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const [start, end] = range;
    const startMs = start ? new Date(start).setHours(0, 0, 0, 0) : null;
    const endMs = end ? new Date(end).setHours(23, 59, 59, 999) : null;

    return rows.filter((r) => {
      const matchQ =
        term.length === 0 ||
        r.code.toLowerCase().includes(term) ||
        r.subject.toLowerCase().includes(term) ||
        r.requester.toLowerCase().includes(term);

      const matchS = status === "all" ? true : r.status === status;
      const matchP = priority === "all" ? true : r.priority === priority;

      const matchA =
        assignee === "all"
          ? true
          : assignee === "unassigned"
          ? !r.assignee
          : r.assignee === assignee;

      const createdMs = Date.parse(r.createdAt);
      const matchD =
        (startMs === null || createdMs >= startMs) &&
        (endMs === null || createdMs <= endMs);

      return matchQ && matchS && matchP && matchA && matchD;
    });
  }, [rows, q, status, priority, assignee, range]);

  // selection helpers
  const filteredIds = filtered.map((r) => r.id);
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

  /** Terapkan resolusi ke 1..n tiket. `resolvedBy` opsional:
   * - Jika tidak diberikan, fallback ke assignee tiket atau "tech01".
   */
  const applyResolution = (
    ids: string[],
    payload: TicketResolutionInput,
    resolvedBy?: string
  ) => {
    const now = new Date().toISOString();
    setRows((prev) =>
      prev.map((t) =>
        ids.includes(t.id)
          ? {
              ...t,
              status: "resolved",
              updatedAt: now,
              resolution: {
                ...payload,
                resolvedAt: now,
                resolvedBy: resolvedBy ?? t.assignee ?? "tech01",
              },
            }
          : t
      )
    );
    notifications.show({
      title: "Ticket resolved",
      message: `${ids.length} tiket ditandai selesai`,
    });
  };

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
              onClick: () => setResolveFor(r), // buka ResolveTicketModal (isi akar masalah, solusi, parts, foto, tag)
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
              onClick: () => {
                setRows((prev) => prev.filter((x) => x.id !== r.id));
                setSelected((prev) => {
                  const s = new Set(prev);
                  s.delete(r.id);
                  return s;
                });
              },
            },
          ]}
        />
      ),
    },
  ];

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

      <SimpleTable<Ticket>
        dense="sm"
        zebra
        stickyHeader
        maxHeight={520}
        columns={columns}
        data={filtered}
        emptyText="Tidak ada tiket"
      />

      {/* Modal Create */}
      <TicketFormModal
        opened={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={(v) => {
          const now = new Date().toISOString();
          const id = (Math.random() * 1e9).toFixed(0);
          setRows((prev) => [
            {
              id,
              code: `TCK-${new Date().getFullYear()}-${id}`,
              subject: v.subject,
              requester: v.requester,
              priority: v.priority,
              status: v.status,
              assignee: v.assignee || undefined,
              description: v.description || undefined,
              createdAt: now,
              updatedAt: now,
            },
            ...prev,
          ]);
        }}
      />

      {/* Modal Edit */}
      <TicketFormModal
        opened={!!editOpen}
        onClose={() => setEditOpen(null)}
        mode="edit"
        initial={editOpen ?? undefined}
        onSubmit={(v) => {
          const now = new Date().toISOString();
          setRows((prev) =>
            prev.map((t) =>
              t.id === editOpen?.id
                ? {
                    ...t,
                    ...v,
                    assignee: v.assignee || undefined,
                    description: v.description || undefined,
                    updatedAt: now,
                  }
                : t
            )
          );
        }}
      />

      {/* Modal Resolve (single / bulk) */}
      <ResolveTicketModal
        opened={!!resolveFor}
        onClose={() => setResolveFor(null)}
        title={
          resolveFor === "bulk"
            ? `Tandai selesai (${selected.size} tiket)`
            : "Tandai tiket selesai"
        }
        assignee={
          resolveFor !== "bulk" && resolveFor ? resolveFor.assignee : undefined
        }
        onSubmit={(payload) => {
          const ids =
            resolveFor === "bulk"
              ? Array.from(selected)
              : resolveFor
              ? [resolveFor.id]
              : [];
          const resolvedBy =
            resolveFor !== "bulk" && resolveFor?.assignee
              ? resolveFor.assignee
              : undefined; // fallback ke assignee tiket masing2 di applyResolution
          applyResolution(ids, payload as TicketResolutionInput, resolvedBy);
          if (resolveFor === "bulk") setSelected(new Set());
          setResolveFor(null);
        }}
      />
    </Stack>
  );
}
