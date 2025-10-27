"use client";

import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Group,
  Menu,
  ActionIcon,
  Paper,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { IconDots, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import type { Role } from "../model/types";
import RoleFormModal from "./RoleFormModal";

export default function RbacListPage() {
  const [rows, setRows] = useState<Role[]>([]);
  const [q, setQ] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Role | null>(null);

  // TODO: fetch permissions from server
  const [permissions] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return rows.filter((r) => {
      const hay = (
        r.name +
        (r.description ?? "") +
        r.permissions.join(",")
      ).toLowerCase();
      return qq.length === 0 || hay.includes(qq);
    });
  }, [rows, q]);

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Stack gap={2}>
          <Text fw={700} fz="lg">
            RBAC — Roles & Permissions
          </Text>
          <Text c="dimmed" fz="sm">
            Kelola role dan permission akses sistem.
          </Text>
        </Stack>
        <Group>
          <TextInput
            placeholder="Cari role..."
            value={q}
            onChange={(e) => setQ(e.currentTarget.value)}
          />
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
            Buat Role
          </Button>
        </Group>
      </Group>

      <Paper withBorder radius="md" p="sm">
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nama</Table.Th>
              <Table.Th>Deskripsi</Table.Th>
              <Table.Th>Permissions</Table.Th>
              <Table.Th w={56} />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filtered.map((r) => (
              <Table.Tr key={r.id}>
                <Table.Td>
                  <Group gap="xs">
                    <Text fw={600}>{r.name}</Text>
                    {r.system ? <Badge variant="light">system</Badge> : null}
                  </Group>
                </Table.Td>
                <Table.Td>
                  {r.description ? (
                    <Text>{r.description}</Text>
                  ) : (
                    <Text c="dimmed">—</Text>
                  )}
                </Table.Td>
                <Table.Td>
                  <Group gap={6} wrap="wrap">
                    {r.permissions.slice(0, 6).map((p) => (
                      <Badge key={p} variant="outline">
                        {p}
                      </Badge>
                    ))}
                    {r.permissions.length > 6 ? (
                      <Badge variant="light">+{r.permissions.length - 6}</Badge>
                    ) : null}
                  </Group>
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
                          setEditing(r);
                          setModalOpen(true);
                        }}
                      >
                        Edit
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconTrash size={16} />}
                        color="red"
                        disabled={r.system}
                        onClick={() => {
                          if (r.system) return;
                          if (confirm(`Hapus role "${r.name}"?`)) {
                            setRows((prev) =>
                              prev.filter((x) => x.id !== r.id)
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

      {/* Modal create/edit */}
      <RoleFormModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit Role — ${editing.name}` : "Buat Role"}
        initial={editing ?? undefined}
        permissions={permissions}
        onSubmit={(v) => {
          if (editing) {
            setRows((prev) =>
              prev.map((x) => (x.id === editing.id ? { ...x, ...v } : x))
            );
          } else {
            setRows((prev) => [
              ...prev,
              {
                id: `role-${Date.now()}`,
                name: v.name,
                description: v.description,
                permissions: v.permissions,
              },
            ]);
          }
        }}
      />
    </Stack>
  );
}
