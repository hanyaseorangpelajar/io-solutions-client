"use client";

import { useMemo, useState } from "react";
import { Group, Stack, Title, LoadingOverlay, Text } from "@mantine/core";
import { IconCircleCheck, IconEye } from "@tabler/icons-react";
import { SimpleTable, type Column } from "@/shared/ui/table/SimpleTable";
import TextField from "@/shared/ui/inputs/TextField";
import TicketPriorityBadge from "./TicketPriorityBadge";
import TicketStatusBadge from "./TicketStatusBadge";
import ResolveTicketModal from "./ResolveTicketModal";
import type { Ticket } from "../model/types";
import type { TicketResolutionInput } from "../model/schema";
// PERBAIKAN: Hapus Mock Data
// import { MOCK_TICKETS } from "../model/mock";
import { formatDateTime } from "../utils/format";
import { ActionsDropdown } from "@/shared/ui/menus";

// PERBAIKAN: Impor API dan hooks
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listTickets, resolveTicket } from "../api/tickets";
import { notifications } from "@mantine/notifications";

// TODO: Ganti ini dengan data user dari Auth Context/Session Anda
const MOCK_CURRENT_USER_ID = "ID_TEKNISI_YANG_SEDANG_LOGIN";

export default function TicketsMyWorkPage() {
  const queryClient = useQueryClient();
  const [q, setQ] = useState("");
  const [resolveFor, setResolveFor] = useState<null | Ticket>(null);

  // PERBAIKAN: Ganti 'currentTech' dengan ID user asli
  const currentTechId = MOCK_CURRENT_USER_ID;

  // PERBAIKAN: Gunakan useQuery untuk mengambil data
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["tickets", "list", { assignee: currentTechId, q }],
    queryFn: async () => {
      const res = await listTickets({
        q: q || undefined,
        assignee: currentTechId, // Filter tiket untuk user ini
        // Hanya tampilkan yang sedang dikerjakan
        status: "in_progress", // atau "open" dan "in_progress"
        limit: 100,
      });
      return res.data;
    },
    // Filter "myTickets" sekarang dilakukan di sisi server
    // Kita hanya ambil yang statusnya 'open' atau 'in_progress'
    select: (data) =>
      data.filter((t) => t.status === "open" || t.status === "in_progress"),
  });

  // PERBAIKAN: Gunakan useMutation untuk resolve ticket
  const resolveMutation = useMutation({
    mutationFn: (vars: { id: string; payload: TicketResolutionInput }) =>
      resolveTicket(vars.id, vars.payload),
    onSuccess: (updatedTicket) => {
      notifications.show({
        title: "Ticket Resolved",
        message: `Tiket #${updatedTicket.code} telah diselesaikan.`,
      });
      setResolveFor(null);
      // Refresh query "My Work"
      queryClient.invalidateQueries({
        queryKey: ["tickets", "list", { assignee: currentTechId }],
      });
      // Refresh query "All Tickets" jika ada
      queryClient.invalidateQueries({
        queryKey: ["tickets", "list"],
      });
    },
    onError: (e: any) => {
      notifications.show({
        color: "red",
        title: "Gagal Resolve",
        message: e.message,
      });
    },
  });

  // PERBAIKAN: Hapus fungsi 'applyResolved' lokal

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
              disabled: resolveMutation.isPending, // PERBAIKAN: Disable saat mutasi
            },
          ]}
        />
      ),
    },
  ];

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={3}>My Work</Title>
        <TextField
          label="Cari"
          placeholder="Kode / Subjek / Pemohon"
          value={q}
          onChange={(e) => setQ(e.currentTarget.value)}
          style={{ minWidth: 260 }}
        />
      </Group>

      {/* PERBAIKAN: Tambahkan LoadingOverlay */}
      <div style={{ position: "relative" }}>
        <LoadingOverlay visible={isLoading || resolveMutation.isPending} />
        <SimpleTable<Ticket>
          dense="sm"
          zebra
          stickyHeader
          maxHeight={520}
          columns={columns}
          data={rows} // Data dari useQuery
          emptyText="Belum ada tiket yang sedang kamu tangani."
        />
      </div>

      {/* Modal Resolve */}
      <ResolveTicketModal
        opened={!!resolveFor}
        onClose={() => setResolveFor(null)}
        // PERBAIKAN: Hapus prop 'assignee'
        // PERBAIKAN: Tambahkan prop 'ticket'
        ticket={resolveFor}
        onSubmit={async (payload) => {
          if (!resolveFor) return;
          // PERBAIKAN: Panggil mutasi
          await resolveMutation.mutateAsync({ id: resolveFor.id, payload });
        }}
        // title="Tandai selesai" // (Dihapus, modal sudah punya title default)
      />
    </Stack>
  );
}
