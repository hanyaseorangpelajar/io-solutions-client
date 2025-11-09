"use client";

import { useState, useEffect } from "react";
import {
  Group,
  Stack,
  Title,
  LoadingOverlay,
  Text,
  Pagination,
  ActionIcon,
  Tooltip,
  Anchor,
} from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import TextField from "@/shared/ui/inputs/TextField";
import { SimpleTable, type Column } from "@/shared/ui/table/SimpleTable";
import { formatDateTime } from "@/features/tickets/utils/format";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listCustomers,
  updateCustomer,
  type Paginated,
} from "../api/customers";
import type { Customer } from "../model/types";
import { notifications } from "@mantine/notifications";
import CustomerEditModal from "./CustomerEditModal";
import type { CustomerFormInput } from "../model/schema";
import CustomerDetailModal from "./CustomerDetailModal";

type Row = Customer;

const safeFormatDateTime = (dateString?: string) => {
  if (!dateString) return "-";
  try {
    return formatDateTime(dateString);
  } catch (e) {
    return dateString;
  }
};

export default function CustomerListPage() {
  const queryClient = useQueryClient();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_LIMIT = 10;

  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    setPage(1);
  }, [q]);

  const { data, isLoading, error } = useQuery<Paginated<Customer>>({
    queryKey: ["customers", "list", { q, page, PAGE_LIMIT }],
    queryFn: () =>
      listCustomers({
        q: q || undefined,
        page: page,
        limit: PAGE_LIMIT,
      }),
    placeholderData: (prev) => prev,
  });

  useEffect(() => {
    if (error) {
      notifications.show({
        color: "red",
        title: "Gagal memuat pelanggan",
        message: (error as Error).message,
      });
    }
  }, [error]);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CustomerFormInput }) =>
      updateCustomer(id, data),
    onSuccess: (updatedData) => {
      notifications.show({
        title: "Sukses",
        message: `Data pelanggan '${updatedData.nama}' berhasil diperbarui.`,
        color: "green",
      });
      setEditingCustomer(null);
      queryClient.invalidateQueries({ queryKey: ["customers", "list"] });
    },
    onError: (err: any) => {
      notifications.show({
        title: "Gagal Update",
        message: err.response?.data?.message || err.message,
        color: "red",
      });
    },
  });

  const rows: Row[] = data?.results ?? [];
  const totalResults = data?.totalResults ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const columns: Column<Row>[] = [
    {
      key: "nama",
      header: "Nama",
      cell: (r) => (
        <Anchor
          component="button"
          size="sm"
          onClick={() => setViewingCustomer(r)}
        >
          {r.nama}
        </Anchor>
      ),
    },
    {
      key: "noHp",
      header: "Nomor HP",
      width: 180,
      cell: (r) => r.noHp,
    },
    {
      key: "dibuatPada",
      header: "Dibuat",
      width: 190,
      cell: (r) => safeFormatDateTime(r.dibuatPada),
    },
    {
      key: "diperbaruiPada",
      header: "Diperbarui",
      width: 190,
      cell: (r) => safeFormatDateTime(r.diperbaruiPada),
    },
    {
      key: "actions",
      header: "",
      width: 60,
      align: "right",
      cell: (r) => (
        <Tooltip label="Edit Pelanggan">
          <ActionIcon
            variant="subtle"
            color="blue"
            onClick={() => setEditingCustomer(r)}
            disabled={updateMutation.isPending}
          >
            <IconPencil size={16} />
          </ActionIcon>
        </Tooltip>
      ),
    },
  ];

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={3}>Daftar Pelanggan</Title>
      </Group>

      <Group align="end" wrap="wrap" gap="sm">
        <TextField
          label="Cari Pelanggan"
          placeholder="Nama atau Nomor HP..."
          value={q}
          onChange={(e) => setQ(e.currentTarget.value)}
          style={{ minWidth: 260 }}
        />
      </Group>

      <div style={{ position: "relative" }}>
        <LoadingOverlay visible={isLoading || updateMutation.isPending} />
        <SimpleTable<Row>
          dense="sm"
          zebra
          stickyHeader
          maxHeight={520}
          columns={columns}
          data={rows}
          emptyText="Belum ada data pelanggan"
        />
      </div>

      <Group justify="space-between" align="center" mt="md">
        <Text size="sm" c="dimmed">
          Menampilkan {rows.length} dari {totalResults} pelanggan
        </Text>
        <Pagination
          total={totalPages}
          value={page}
          onChange={setPage}
          disabled={totalPages <= 1}
        />
      </Group>

      <CustomerEditModal
        opened={!!editingCustomer}
        onClose={() => setEditingCustomer(null)}
        customer={editingCustomer}
        isSubmitting={updateMutation.isPending}
        onSubmit={async (data) => {
          if (editingCustomer) {
            updateMutation.mutate({ id: editingCustomer.id, data });
          }
        }}
      />

      <CustomerDetailModal
        opened={!!viewingCustomer}
        onClose={() => setViewingCustomer(null)}
        data={viewingCustomer}
      />
    </Stack>
  );
}
