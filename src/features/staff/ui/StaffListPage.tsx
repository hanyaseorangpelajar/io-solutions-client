"use client";

import { useMemo, useState } from "react";
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Menu,
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
import { MOCK_STAFF } from "../model/mock";
import { MOCK_ROLES } from "@/features/rbac/model/mock";
import StaffFormModal from "./StaffFormModal";

export default function StaffListPage() {
  const [rows, setRows] = useState<Staff[]>(() => [...MOCK_STAFF]);
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | "all">("all");
  const [onlyActive, setOnlyActive] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);

  const roles = MOCK_ROLES;
  const roleMap = useMemo(
    () => Object.fromEntries(roles.map((r) => [r.id, r.name])),
    [roles]
  );

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return rows.filter((s) => {
      const okQ =
        qq.length === 0 ||
        s.name.toLowerCase().includes(qq) ||
        s.email.toLowerCase().includes(qq) ||
        (s.phone ?? "").toLowerCase().includes(qq);
      const okRole =
        roleFilter === "all" ? true : s.roleIds.includes(roleFilter);
      const okActive = onlyActive ? s.active : true;
      return okQ && okRole && okActive;
    });
  }, [rows, q, roleFilter, onlyActive]);

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
            placeholder="Cari staff..."
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

      <Paper withBorder radius="md" p="sm">
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nama</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Telepon</Table.Th>
              <Table.Th>Roles</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th w={56} />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filtered.map((s) => (
              <Table.Tr key={s.id}>
                <Table.Td>
                  <Text fw={600}>{s.name}</Text>
                </Table.Td>
                <Table.Td>{s.email}</Table.Td>
                <Table.Td>{s.phone ?? <Text c="dimmed">—</Text>}</Table.Td>
                <Table.Td>
                  <Group gap={6} wrap="wrap">
                    {s.roleIds.map((rid) => (
                      <Badge key={rid} variant="light">
                        {roleMap[rid] ?? rid}
                      </Badge>
                    ))}
                  </Group>
                </Table.Td>
                <Table.Td>
                  {s.active ? (
                    <Badge color="green" variant="light">
                      Aktif
                    </Badge>
                  ) : (
                    <Badge color="gray" variant="outline">
                      Nonaktif
                    </Badge>
                  )}
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
                          onClick={() => {
                            setRows((prev) =>
                              prev.map((x) =>
                                x.id === s.id ? { ...x, active: false } : x
                              )
                            );
                          }}
                        >
                          Nonaktifkan
                        </Menu.Item>
                      ) : (
                        <Menu.Item
                          leftSection={<IconUserCheck size={16} />}
                          onClick={() => {
                            setRows((prev) =>
                              prev.map((x) =>
                                x.id === s.id ? { ...x, active: true } : x
                              )
                            );
                          }}
                        >
                          Aktifkan
                        </Menu.Item>
                      )}
                      <Menu.Item
                        leftSection={<IconTrash size={16} />}
                        color="red"
                        onClick={() => {
                          if (confirm(`Hapus staff "${s.name}"?`)) {
                            setRows((prev) =>
                              prev.filter((x) => x.id !== s.id)
                            );
                          }
                        }}
                      >
                        Hapus
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>

      <StaffFormModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit Staff — ${editing.name}` : "Tambah Staff"}
        initial={editing ?? undefined}
        roles={roles}
        onSubmit={(v) => {
          if (editing) {
            setRows((prev) =>
              prev.map((x) => (x.id === editing.id ? { ...x, ...v } : x))
            );
          } else {
            setRows((prev) => [
              ...prev,
              {
                id: `u-${Date.now()}`,
                name: v.name,
                email: v.email,
                phone: v.phone,
                active: v.active,
                roleIds: v.roleIds,
              },
            ]);
          }
        }}
      />
    </Stack>
  );
}
