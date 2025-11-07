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
  TextInput,
} from "@mantine/core";
import {
  IconDots,
  IconPencil,
  IconPlus,
  IconUserOff,
  IconUserCheck,
  IconTrash,
} from "@tabler/icons-react";
import type { Staff } from "../model/types";
import type { Role } from "@/features/rbac/model/types";
import StaffFormModal from "./StaffFormModal";
import {
  getStaffList,
  createStaff,
  updateStaff,
  deleteStaff,
} from "@/features/staff/api/staff";
import { useModals } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";

const STATIC_ROLES: Role[] = [
  { id: "SysAdmin", name: "SysAdmin", permissions: [] },
  { id: "Admin", name: "Admin", permissions: [] },
  { id: "Teknisi", name: "Teknisi", permissions: [] },
];

export default function StaffListPage() {
  const queryClient = useQueryClient();
  const modals = useModals();

  const { data: staffData, isLoading: isLoadingStaff } = useQuery<Staff[]>({
    queryKey: ["staff"],
    queryFn: getStaffList,
  });

  const createMutation = useMutation({
    mutationFn: createStaff,
    onSuccess: (newStaff) => {
      Notifications.show({
        title: "Sukses",
        message: "Staff baru berhasil ditambahkan.",
        color: "green",
      });
      queryClient.setQueryData<Staff[]>(["staff"], (old = []) => [
        newStaff,
        ...old,
      ]);
      setModalOpen(false);
    },
    onError: (error) => {
      Notifications.show({
        title: "Gagal",
        message: `Gagal menambahkan staff: ${error.message}`,
        color: "red",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateStaff(id, data),
    onSuccess: (updatedStaff) => {
      Notifications.show({
        title: "Sukses",
        message: "Data staff berhasil diperbarui.",
        color: "blue",
      });
      queryClient.setQueryData<Staff[]>(["staff"], (old = []) =>
        old.map((s) => (s.id === updatedStaff.id ? updatedStaff : s))
      );
      setModalOpen(false);
    },
    onError: (error) => {
      Notifications.show({
        title: "Gagal",
        message: `Gagal memperbarui staff: ${error.message}`,
        color: "red",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStaff,
    onSuccess: (_, staffId) => {
      Notifications.show({
        title: "Sukses",
        message: `Staff berhasil dihapus.`,
        color: "green",
      });
      queryClient.setQueryData<Staff[]>(["staff"], (old = []) =>
        old.filter((s) => s.id !== staffId)
      );
    },
    onError: (error) => {
      Notifications.show({
        title: "Gagal",
        message: `Gagal menghapus staff: ${error.message}`,
        color: "red",
      });
    },
  });

  const rows = useMemo(() => {
    if (!staffData) return [];
    // Salin array (...) agar tidak mengubah cache react-query
    // lalu urutkan berdasarkan 'nama' menggunakan localeCompare
    return [...staffData].sort((a, b) => a.nama.localeCompare(b.nama));
  }, [staffData]);
  const roles = useMemo(() => STATIC_ROLES, []);

  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | "all">("all");
  type StatusFilter = "all" | "active" | "inactive";
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);

  const [page, setPage] = useState(1);
  const PAGE_LIMIT = 5;

  const roleMap = useMemo(
    () => Object.fromEntries(roles.map((r) => [r.id, r.name])),
    [roles]
  );

  useEffect(() => {
    setPage(1);
  }, [q, roleFilter, statusFilter]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return Array.isArray(rows)
      ? rows.filter((s: Staff) => {
          const okQ =
            qq.length === 0 ||
            s.nama.toLowerCase().includes(qq) ||
            s.username.toLowerCase().includes(qq);

          const okRole = roleFilter === "all" || s.role === roleFilter;

          const okActive =
            statusFilter === "all"
              ? true
              : statusFilter === "active"
              ? s.statusAktif
              : !s.statusAktif;

          return okQ && okRole && okActive;
        })
      : [];
  }, [rows, q, roleFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_LIMIT);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * PAGE_LIMIT;
    const end = start + PAGE_LIMIT;
    return filtered.slice(start, end);
  }, [filtered, page, PAGE_LIMIT]);

  const openDeleteModal = (staff: Staff) => {
    modals.openConfirmModal({
      title: "Konfirmasi Hapus Staff",
      children: (
        <Text size="sm">
          Apakah Anda yakin ingin menghapus staff <strong>{staff.nama}</strong>?
          Tindakan ini akan menonaktifkan user.
        </Text>
      ),
      labels: { confirm: "Hapus", cancel: "Batal" },
      confirmProps: { color: "red", loading: deleteMutation.isPending },
      onConfirm: () => deleteMutation.mutate(staff.id),
    });
  };

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Stack gap={2}>
          <Text fw={700} fz="lg">
            Staff Management
          </Text>
          <Text c="dimmed" fz="sm">
            Tambah staff dan assign role.
          </Text>
        </Stack>
        <Group wrap="wrap">
          <TextInput
            placeholder="Cari (nama, email, username)..."
            value={q}
            onChange={(e) => setQ(e.currentTarget.value)}
          />
          <Select
            data={[
              { value: "all", label: "Semua role" },
              ...roles.map((r) => ({ value: r.id, label: r.name })),
            ]}
            value={roleFilter}
            onChange={(v) => setRoleFilter((v as any) ?? "all")}
          />
          <SegmentedControl
            value={statusFilter}
            onChange={(value) => setStatusFilter(value as StatusFilter)}
            data={[
              { label: "Nonaktif", value: "inactive" },
              { label: "Semua", value: "all" },
              { label: "Aktif", value: "active" },
            ]}
          />
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
      </Group>

      <Paper withBorder radius="md" style={{ position: "relative" }}>
        <LoadingOverlay visible={isLoadingStaff || isMutating} />
        <Table.ScrollContainer minWidth={900}>
          <Table verticalSpacing="sm" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nama Lengkap</Table.Th>
                <Table.Th>Username</Table.Th>
                <Table.Th>Role</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Dibuat Pada</Table.Th>
                <Table.Th>Diperbarui Pada</Table.Th>
                <Table.Th w={56} />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((s) => (
                  <Table.Tr key={s.id}>
                    <Table.Td>
                      <Text fw={600}>{s.nama}</Text>
                    </Table.Td>

                    <Table.Td>
                      <Text c="dimmed">{s.username}</Text>
                    </Table.Td>

                    <Table.Td>
                      <Badge variant="light">{roleMap[s.role] ?? s.role}</Badge>
                    </Table.Td>

                    <Table.Td>
                      <Badge
                        color={s.statusAktif ? "green" : "gray"}
                        variant="light"
                      >
                        {s.statusAktif ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </Table.Td>

                    <Table.Td>
                      {new Date(s.dibuatPada).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </Table.Td>

                    <Table.Td>
                      {new Date(s.diperbaruiPada).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </Table.Td>

                    <Table.Td>
                      <Menu>
                        <Menu.Target>
                          <ActionIcon variant="subtle" aria-label="aksi">
                            <IconDots size={18} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            leftSection={<IconPencil size={16} />}
                            onClick={() => {
                              setEditing(s);
                              setModalOpen(true);
                            }}
                          >
                            Edit
                          </Menu.Item>

                          {s.statusAktif ? (
                            <Menu.Item
                              leftSection={<IconUserOff size={16} />}
                              onClick={() =>
                                updateMutation.mutate({
                                  id: s.id,
                                  data: { statusAktif: false },
                                })
                              }
                              disabled={updateMutation.isPending}
                            >
                              Nonaktifkan
                            </Menu.Item>
                          ) : (
                            <Menu.Item
                              leftSection={<IconUserCheck size={16} />}
                              onClick={() =>
                                updateMutation.mutate({
                                  id: s.id,
                                  data: { statusAktif: true },
                                })
                              }
                              disabled={updateMutation.isPending}
                            >
                              Aktifkan
                            </Menu.Item>
                          )}
                          <Menu.Item
                            leftSection={<IconTrash size={16} />}
                            color="red"
                            onClick={() => openDeleteModal(s)}
                            disabled={deleteMutation.isPending}
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
                  <Table.Td colSpan={8}>
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
        title={editing ? `Edit Staff — ${editing.nama}` : "Tambah Staff"}
        initial={
          editing
            ? {
                ...editing,
                fullName: editing.nama,
              }
            : undefined
        }
        roles={roles}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={async (v) => {
          if (editing) {
            updateMutation.mutate({ id: editing.id, data: v });
          } else {
            createMutation.mutate(v);
          }
        }}
      />
    </Stack>
  );
}
