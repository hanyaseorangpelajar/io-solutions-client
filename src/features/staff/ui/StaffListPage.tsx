"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
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
  Switch,
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
        ...old,
        newStaff,
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

  const rows = useMemo(() => staffData ?? [], [staffData]);
  const roles = useMemo(() => STATIC_ROLES, []);

  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | "all">("all");
  const [onlyActive, setOnlyActive] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);

  const roleMap = useMemo(
    () => Object.fromEntries(roles.map((r) => [r.id, r.name])),
    [roles]
  );

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return Array.isArray(rows)
      ? rows.filter((s: Staff) => {
          const okQ =
            qq.length === 0 ||
            s.name.toLowerCase().includes(qq) ||
            s.email.toLowerCase().includes(qq) ||
            s.username.toLowerCase().includes(qq);

          const okRole = roleFilter === "all" || s.role === roleFilter;
          const okActive = onlyActive ? s.active : true;
          return okQ && okRole && okActive;
        })
      : [];
  }, [rows, q, roleFilter, onlyActive]);

  const openDeleteModal = (staff: Staff) => {
    modals.openConfirmModal({
      title: "Konfirmasi Hapus Staff",
      children: (
        <Text size="sm">
          Apakah Anda yakin ingin menghapus staff <strong>{staff.name}</strong>?
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
          <Switch
            label="Hanya aktif"
            checked={onlyActive}
            onChange={(e) => setOnlyActive(e.currentTarget.checked)}
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
                <Table.Th>Email</Table.Th>
                <Table.Th>Role</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Dibuat Pada</Table.Th>
                <Table.Th>Diperbarui Pada</Table.Th>
                <Table.Th w={56} />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filtered.length > 0 ? (
                filtered.map((s) => (
                  <Table.Tr key={s.id}>
                    <Table.Td>
                      <Text fw={600}>{s.name}</Text>
                    </Table.Td>

                    <Table.Td>
                      <Text c="dimmed">{s.username}</Text>
                    </Table.Td>

                    <Table.Td>{s.email}</Table.Td>

                    <Table.Td>
                      <Badge variant="light">{roleMap[s.role] ?? s.role}</Badge>
                    </Table.Td>

                    <Table.Td>
                      <Badge
                        color={s.active ? "green" : "gray"}
                        variant="light"
                      >
                        {s.active ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </Table.Td>

                    <Table.Td>
                      {new Date(s.createdAt).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </Table.Td>

                    <Table.Td>
                      {new Date(s.updatedAt).toLocaleDateString("id-ID", {
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

                          {s.active ? (
                            <Menu.Item
                              leftSection={<IconUserOff size={16} />}
                              onClick={() =>
                                updateMutation.mutate({
                                  id: s.id,
                                  data: { active: false },
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
                                  data: { active: true },
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

      <StaffFormModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit Staff — ${editing.name}` : "Tambah Staff"}
        initial={
          editing
            ? {
                ...editing,
                fullName: editing.name,
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
