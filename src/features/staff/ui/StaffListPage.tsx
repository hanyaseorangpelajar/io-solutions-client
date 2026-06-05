"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, useEffect } from "react";
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Menu,
  LoadingOverlay,
  Paper,
  Select,
  Stack,
  SegmentedControl,
  Pagination,
  Table,
  Text,
} from "@mantine/core";
import {
  IconDots,
  IconPencil,
  IconPlus,
  IconUserOff,
  IconUserCheck,
  IconTrash,
} from "@tabler/icons-react";
import type { StaffDto } from "../model/types";
import StaffFormModal from "./StaffFormModal";
import {
  getStaffList,
  createStaff,
  updateStaff,
  updateStaffStatus,
} from "@/features/staff/api/staff";
import { useModals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import TextField from "@/shared/ui/inputs/TextField";
import { formatDateTime } from "@/features/tickets/utils/format";

// Standarisasi UPPERCASE sesuai DTO Role Backend
const STATIC_ROLES = [
  { id: "ADMIN", name: "Admin", permissions: [] },
  { id: "TEKNISI", name: "Teknisi", permissions: [] },
  { id: "SYSADMIN", name: "SysAdmin", permissions: [] },
];

export default function StaffListPage() {
  const queryClient = useQueryClient();
  const modals = useModals();

  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("Semua");
  const [activeFilter, setActiveFilter] = useState<string>("Semua");

  const [page, setPage] = useState(1);
  const limit = 10;

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<StaffDto | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["staff", "list"],
    queryFn: () => getStaffList(),
  });

  const staffData = Array.isArray(data) ? data : (data?.results ?? []);

  useEffect(() => {
    if (error) {
      notifications.show({
        color: "red",
        title: "Gagal memuat staff",
        message: (error as Error).message,
      });
    }
  }, [error]);

  const filtered = useMemo(() => {
    return staffData.filter((r) => {
      if (roleFilter !== "Semua" && r.role !== roleFilter) return false;
      if (activeFilter === "Aktif" && !r.isActive) return false;
      if (activeFilter === "Nonaktif" && r.isActive) return false;
      if (q) {
        const qLower = q.toLowerCase();
        return (
          r.name.toLowerCase().includes(qLower) ||
          r.username.toLowerCase().includes(qLower)
        );
      }
      return true;
    });
  }, [staffData, q, roleFilter, activeFilter]);

  const totalPages = Math.ceil(filtered.length / limit) || 1;
  const paginatedData = useMemo(() => {
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, page]);

  useEffect(() => {
    setPage(1);
  }, [q, roleFilter, activeFilter]);

  const createMutation = useMutation({
    mutationFn: createStaff,
    onSuccess: () => {
      notifications.show({
        color: "green",
        title: "Sukses",
        message: "Staff ditambahkan.",
      });
      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["staff", "list"] });
    },
    onError: (e: any) => {
      notifications.show({ color: "red", title: "Gagal", message: e.message });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (vars: { id: string; payload: any }) =>
      updateStaff(vars.id, vars.payload),
    onSuccess: () => {
      notifications.show({
        color: "green",
        title: "Sukses",
        message: "Data staff diubah.",
      });
      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["staff", "list"] });
    },
    onError: (e: any) => {
      notifications.show({ color: "red", title: "Gagal", message: e.message });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (vars: { id: string; isActive: boolean }) =>
      updateStaffStatus(vars.id, vars.isActive),
    onSuccess: () => {
      notifications.show({
        color: "green",
        title: "Sukses",
        message: "Status staff diubah.",
      });
      queryClient.invalidateQueries({ queryKey: ["staff", "list"] });
    },
  });

  const confirmDelete = (staff: StaffDto) => {
    // Implement delete if needed or hide it and prefer soft delete (isActive)
    modals.openConfirmModal({
      title: "Konfirmasi Penghapusan",
      children: (
        <Text size="sm">Apakah Anda yakin ingin menghapus {staff.name}?</Text>
      ),
      labels: { confirm: "Hapus", cancel: "Batal" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        // execute delete mutation
      },
    });
  };

  const roles = STATIC_ROLES;
  const roleOptions = ["Semua", ...roles.map((r) => r.id)];

  return (
    <Stack gap="md" pos="relative">
      <LoadingOverlay visible={isLoading || updateStatusMutation.isPending} />
      <Group justify="space-between" align="center">
        <Text fw={600} size="xl">
          Manajemen Staff
        </Text>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          Tambah Staff
        </Button>
      </Group>

      <Group justify="space-between" align="end" wrap="wrap">
        <Group align="center">
          <TextField
            label="Cari Staff"
            placeholder="Ketik nama / username..."
            value={q}
            onChange={(e) => setQ(e.currentTarget.value)}
          />
          <Select
            label="Role"
            data={roleOptions}
            value={roleFilter}
            onChange={(v) => setRoleFilter(v || "Semua")}
            allowDeselect={false}
          />
        </Group>
        <Stack gap={4}>
          <Text size="sm" fw={500}>
            Status
          </Text>
          <SegmentedControl
            data={["Semua", "Aktif", "Nonaktif"]}
            value={activeFilter}
            onChange={setActiveFilter}
          />
        </Stack>
      </Group>

      <Paper withBorder radius="md">
        <Table.ScrollContainer minWidth={800}>
          <Table verticalSpacing="sm" striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nama Lengkap</Table.Th>
                <Table.Th>Username</Table.Th>
                <Table.Th>Role</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Dibuat</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((r) => (
                  <Table.Tr key={r.userId}>
                    <Table.Td fw={500}>{r.name}</Table.Td>
                    <Table.Td>{r.username}</Table.Td>
                    <Table.Td>
                      <Badge color="blue" variant="light">
                        {r.role}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={r.isActive ? "green" : "red"} variant="dot">
                        {r.isActive ? "Aktif" : "Non-Aktif"}
                      </Badge>
                    </Table.Td>
                    <Table.Td>{formatDateTime(r.createdAt)}</Table.Td>
                    <Table.Td align="right">
                      <Menu withinPortal position="bottom-end" shadow="sm">
                        <Menu.Target>
                          <ActionIcon variant="subtle" color="gray">
                            <IconDots size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            leftSection={<IconPencil size={14} />}
                            onClick={() => {
                              setEditing(r);
                              setModalOpen(true);
                            }}
                          >
                            Edit Data
                          </Menu.Item>
                          <Menu.Item
                            leftSection={
                              r.isActive ? (
                                <IconUserOff size={14} />
                              ) : (
                                <IconUserCheck size={14} />
                              )
                            }
                            onClick={() =>
                              updateStatusMutation.mutate({
                                id: r.userId,
                                isActive: !r.isActive,
                              })
                            }
                          >
                            {r.isActive ? "Nonaktifkan Akun" : "Aktifkan Akun"}
                          </Menu.Item>
                          <Menu.Divider />
                          <Menu.Item
                            leftSection={<IconTrash size={14} />}
                            color="red"
                            onClick={() => confirmDelete(r)}
                          >
                            Hapus
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={6}>
                    <Text ta="center" c="dimmed" py="md">
                      Tidak ada data staff.
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Paper>

      <Group justify="space-between" align="center" mt="md">
        <Text size="sm" c="dimmed">
          Menampilkan {paginatedData.length} dari {filtered.length} staff
        </Text>
        <Pagination
          total={totalPages}
          value={page}
          onChange={setPage}
          disabled={totalPages <= 1}
        />
      </Group>

      <StaffFormModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit Staff — ${editing.name}` : "Tambah Staff"}
        initial={editing ?? undefined}
        roles={roles}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={async (v) => {
          if (editing) {
            await updateMutation.mutateAsync({
              id: editing.userId,
              payload: v,
            });
          } else {
            await createMutation.mutateAsync(v);
          }
        }}
      />
    </Stack>
  );
}
