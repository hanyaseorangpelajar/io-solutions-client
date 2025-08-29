"use client";

import { useMemo, useState } from "react";
import { Group, Stack, Title } from "@mantine/core";
import { IconCircleCheck, IconEye } from "@tabler/icons-react";
import { SimpleTable, type Column } from "@/shared/ui/table/SimpleTable";
import TextField from "@/shared/ui/inputs/TextField";
import TicketPriorityBadge from "./TicketPriorityBadge";
import TicketStatusBadge from "./TicketStatusBadge";
import ResolveTicketModal from "./ResolveTicketModal";
import type { Ticket } from "../model/types";
import type { TicketResolutionInput } from "../model/schema";
import { MOCK_TICKETS } from "../model/mock";
import { formatDateTime } from "../utils/format";
import { ActionsDropdown } from "@/shared/ui/menus";

// ⚠️ Placeholder “user aktif”. Nanti ganti dari auth/session.
const CURRENT_TECH = "tech02";

export default function TicketsMyWorkPage() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<Ticket[]>(MOCK_TICKETS);
  const [resolveFor, setResolveFor] = useState<null | Ticket>(null);

  // Ticket yang dikerjakan oleh teknisi aktif: status in_progress + assignee = CURRENT_TECH
  const myTickets = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows
      .filter(
        (t) =>
          t.status === "in_progress" &&
          t.assignee === CURRENT_TECH &&
          (term.length === 0 ||
            t.code.toLowerCase().includes(term) ||
            t.subject.toLowerCase().includes(term) ||
            t.requester.toLowerCase().includes(term))
      )
      .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
  }, [rows, q]);

  const applyResolved = (id: string, payload: TicketResolutionInput) => {
    const now = new Date().toISOString();
    setRows((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: "resolved",
              updatedAt: now,
              resolution: {
                ...payload,
                resolvedAt: now,
                resolvedBy: t.assignee ?? CURRENT_TECH,
              },
            }
          : t
      )
    );
  };

  const columns: Column<Ticket>[] = [
    { key: "code", header: "Kode", width: 160, cell: (r) => r.code },
    { key: "subject", header: "Subjek", width: "30%", cell: (r) => r.subject },
    { key: "requester", header: "Pemohon", cell: (r) => r.requester },
    {
      key: "priority",
      header: "Prioritas",
      align: "center",
      cell: (r) => <TicketPriorityBadge priority={r.priority} />,
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      cell: (r) => <TicketStatusBadge status={r.status} />,
    },
    {
      key: "updatedAt",
      header: "Diperbarui",
      width: 180,
      cell: (r) => formatDateTime(r.updatedAt),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      width: 160,
      cell: (r) => (
        <ActionsDropdown
          items={[
            {
              label: "Lihat detail",
              icon: <IconEye size={16} />,
              href: `/views/tickets/${encodeURIComponent(r.id)}`,
            },
            {
              label: "Tandai selesai",
              icon: <IconCircleCheck size={16} />,
              onClick: () => setResolveFor(r),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={3}>Works</Title>
        <TextField
          label="Cari"
          placeholder="Kode / Subjek / Pemohon"
          value={q}
          onChange={(e) => setQ(e.currentTarget.value)}
          style={{ minWidth: 260 }}
        />
      </Group>

      <SimpleTable<Ticket>
        dense="sm"
        zebra
        stickyHeader
        maxHeight={520}
        columns={columns}
        data={myTickets}
        emptyText="Belum ada tiket yang sedang kamu tangani."
      />

      {/* Modal Resolve */}
      <ResolveTicketModal
        opened={!!resolveFor}
        onClose={() => setResolveFor(null)}
        assignee={CURRENT_TECH}
        onSubmit={(payload) => {
          if (!resolveFor) return;
          applyResolved(resolveFor.id, payload);
          setResolveFor(null);
        }}
        title="Tandai selesai"
      />
    </Stack>
  );
}
