"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth, type UserDto } from "@/features/auth";
import type { StaffDto } from "@/features/staff/model/types";
import {
  Group,
  Stack,
  Title,
  LoadingOverlay,
  Text,
  Button,
  Menu,
  ActionIcon,
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import {
  IconCircleCheck,
  IconEye,
  IconPlus,
  IconDots,
} from "@tabler/icons-react";
import { SimpleTable, type Column } from "@/shared/ui/table/SimpleTable";
import TextField from "@/shared/ui/inputs/TextField";
import TicketPriorityBadge from "./TicketPriorityBadge";
import TicketStatusBadge from "./TicketStatusBadge";
import TicketFormModal from "./TicketFormModal";
import type { ServiceTicketDto, TicketCustomer } from "../model/types";
import { formatDateTime } from "../utils/format";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listTickets,
  createTicket,
  completeTicketByTeknisi,
  type TechnicianCompleteInput,
} from "../api/tickets";
import { notifications } from "@mantine/notifications";
import { getStaffList } from "@/features/staff/api/staff";
import TeknisiCompleteModal from "./TeknisiCompleteModal";

export default function TicketsMyWorkPage() {
  const queryClient = useQueryClient();
  const modals = useModals();
  const [q, setQ] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [users, setUsers] = useState<StaffDto[]>([]);
  const [completingTicket, setCompletingTicket] =
    useState<ServiceTicketDto | null>(null);

  const { user } = useAuth();
  const currentTechId = (user as UserDto & { id: string })?.id;

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["tickets", "list", { assignee: currentTechId, q }],
    queryFn: async () => {
      if (!currentTechId) return [];
      const res = await listTickets({
        q: q || undefined,
        assignee: currentTechId,
        limit: 100,
      });
      return res.data;
    },
    select: (data) =>
      data.filter(
        (t) =>
          t.status === "DIAGNOSIS" ||
          t.status === "IN_PROGRESS" ||
          t.status === "WAITING_PART",
      ),
    enabled: !!currentTechId,
  });

  useEffect(() => {
    getStaffList()
      .then((staffData) => {
        setUsers(staffData?.results ?? []);
      })
      .catch((e) => {
        console.error("Gagal mengambil daftar staff:", e.message);
        notifications.show({
          color: "red",
          title: "Gagal memuat data staff",
          message: e.message,
        });
      });
  }, []);

  const createMutation = useMutation({
    mutationFn: createTicket,
    onSuccess: (newTicket) => {
      notifications.show({
        title: "Tiket dibuat",
        message: `Tiket #${newTicket.ticketNumber} telah dibuat.`,
        color: "green",
      });
      setFormOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["tickets", "list", { assignee: currentTechId }],
      });
    },
    onError: (e: any) => {
      notifications.show({
        color: "red",
        title: "Gagal membuat tiket",
        message: e.message,
      });
    },
  });

  const teknisiCompleteMutation = useMutation({
    mutationFn: (vars: { id: string; payload: TechnicianCompleteInput }) =>
      completeTicketByTeknisi(vars.id, vars.payload),
    onSuccess: (updatedTicket) => {
      notifications.show({
        title: "Tiket Selesai",
        message: `Tiket #${updatedTicket.ticketNumber} telah ditandai selesai.`,
        color: "green",
      });
      setCompletingTicket(null);
      queryClient.invalidateQueries({
        queryKey: ["tickets", "list", { assignee: currentTechId }],
      });
      queryClient.invalidateQueries({ queryKey: ["tickets", "list"] });
    },
    onError: (e: any) => {
      notifications.show({
        color: "red",
        title: "Gagal Menyelesaikan",
        message: e.message,
      });
    },
  });

  const openCompleteConfirmModal = (ticket: ServiceTicketDto) => {
    modals.openConfirmModal({
      title: "Konfirmasi Selesaikan Tiket",
      centered: true,
      children: (
        <Text size="sm">
          Anda akan menandai tiket ini sebagai 'Selesai' dan mengirimkannya
          untuk di-review Admin.
          <br />
          <br />
          <strong>
            Anda tidak dapat mengubah status tiket ini lagi setelahnya.
          </strong>{" "}
          Lanjutkan?
        </Text>
      ),
      labels: { confirm: "Ya, Tandai Selesai", cancel: "Batal" },
      confirmProps: { color: "green" },
      onConfirm: () => setCompletingTicket(ticket),
    });
  };

  const columns: Column<ServiceTicketDto>[] = [
    { key: "code", header: "Kode", width: 160, cell: (r) => r.ticketNumber },
    {
      key: "subject",
      header: "Keluhan",
      width: "30%",
      cell: (r) => r.initialComplaint,
    },
    {
      key: "requester",
      header: "Pelanggan",
      cell: (r) => (r.customer as TicketCustomer)?.name ?? "-",
    },
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
              href={`/views/tickets/${encodeURIComponent(r.ticketId)}`}
            >
              Lihat detail
            </Menu.Item>

            <Menu.Item
              leftSection={<IconCircleCheck size={16} />}
              color="green"
              onClick={() => openCompleteConfirmModal(r)}
              disabled={
                teknisiCompleteMutation.isPending || r.status === "RESOLVED"
              }
            >
              Tandai Selesai
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={3}>My Work</Title>
        <Group>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setFormOpen(true)}
            loading={createMutation.isPending}
          >
            Buat Tiket
          </Button>
          <TextField
            label="Cari"
            placeholder="Kode / Keluhan / Pelanggan"
            value={q}
            onChange={(e) => setQ(e.currentTarget.value)}
            style={{ minWidth: 260 }}
          />
        </Group>
      </Group>

      <div style={{ position: "relative" }}>
        <LoadingOverlay
          visible={
            isLoading ||
            createMutation.isPending ||
            teknisiCompleteMutation.isPending
          }
        />
        <SimpleTable<ServiceTicketDto>
          dense="sm"
          zebra
          stickyHeader
          maxHeight={520}
          columns={columns}
          data={rows}
          emptyText="Belum ada tiket yang sedang kamu tangani."
        />
      </div>

      <TicketFormModal
        opened={formOpen}
        onClose={() => setFormOpen(false)}
        users={users}
        onSubmit={async (v) => {
          await createMutation.mutateAsync(v as any);
        }}
        defaultAssigneeId={currentTechId}
        userRole={user?.role}
      />

      <TeknisiCompleteModal
        opened={!!completingTicket}
        onClose={() => setCompletingTicket(null)}
        ticket={completingTicket}
        onSubmit={async (payload) => {
          if (!completingTicket) return;
          await teknisiCompleteMutation.mutateAsync({
            id: completingTicket.ticketId,
            payload,
          });
        }}
      />
    </Stack>
  );
}
