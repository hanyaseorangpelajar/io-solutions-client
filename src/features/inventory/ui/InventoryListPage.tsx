"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Badge,
  Button,
  Checkbox,
  Group,
  Select,
  Stack,
  Title,
  LoadingOverlay,
  Text,
  Alert,
  Menu,
  ActionIcon,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  IconPencil,
  IconPlus,
  IconTrash,
  IconUpload,
  IconDownload,
  IconArrowDown,
  IconArrowUp,
  IconLink,
  IconInfoCircle,
  IconDots,
} from "@tabler/icons-react";
import TextField from "@/shared/ui/inputs/TextField";
import { SimpleTable, type Column } from "@/shared/ui/table/SimpleTable";
import PartFormModal from "./PartFormModal";
import StockMoveModal from "./StockMoveModal";
import PartStatusBadge from "./PartStatusBadge";
import type { Part } from "../model/types";
import type { PartFormInput, StockMoveInput } from "../model/schema";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listParts, createPart, updatePart, deletePart } from "../api/parts";
import { createStockMovement } from "../api/stockMovements";
import { notifications } from "@mantine/notifications";

import { downloadCSV } from "@/shared/utils/csv";
import StockOutFromTicketModal, {
  type StockOutFromTicketPayload,
} from "./StockOutFromTicketModal";

const MOCK_CURRENT_USER_ID = "USER_ID_DARI_AUTH";
const nextId = (prefix: string) => `${prefix}-${Date.now()}`;

const STATUS_OPTIONS = [
  { value: "all", label: "Semua Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "discontinued", label: "Discontinued" },
];

export default function InventoryListPage() {
  const queryClient = useQueryClient();

  const {
    data: items = [],
    isLoading,
    error,
  } = useQuery<Part[]>({
    queryKey: ["parts", "list"],
    queryFn: listParts,
  });

  useEffect(() => {
    if (error) {
      notifications.show({
        color: "red",
        title: "Gagal memuat inventory",
        message: (error as Error).message,
      });
    }
  }, [error]);

  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string | "all">("all");
  const [status, setStatus] = useState<"all" | Part["status"]>("all");
  const [lowOnly, setLowOnly] = useState(false);

  const [editing, setEditing] = useState<null | Part>(null);
  const [creating, setCreating] = useState(false);
  const [moving, setMoving] = useState<null | {
    part: Part;
    type: "in" | "out" | "adjust";
  }>(null);
  const [stockOutTicket, setStockOutTicket] = useState(false);
  const [loadingStockOut, setLoadingStockOut] = useState(false);

  const categories = useMemo(() => {
    if (!Array.isArray(items)) return [];
    const cats = new Set(
      items.map((i) => i.category).filter(Boolean) as string[]
    );
    return [
      { value: "all", label: "Semua Kategori" },
      ...Array.from(cats)
        .sort()
        .map((c) => ({ value: c, label: c })),
    ];
  }, [items]);

  const filtered: Part[] = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!Array.isArray(items)) return [];
    return items.filter((i) => {
      const matchQ =
        term.length === 0 ||
        i.name.toLowerCase().includes(term) ||
        (i.sku ?? "").toLowerCase().includes(term) ||
        (i.category ?? "").toLowerCase().includes(term) ||
        (i.vendor ?? "").toLowerCase().includes(term);
      const matchC = category === "all" ? true : i.category === category;
      const matchS = status === "all" ? true : i.status === status;
      const matchL =
        !lowOnly || ((i.minStock ?? 0) > 0 && i.stock <= (i.minStock ?? 0));
      return matchQ && matchC && matchS && matchL;
    });
  }, [items, q, category, status, lowOnly]);

  const exportCSV = () => {};

  const invalidatePartsList = () => {
    queryClient.invalidateQueries({ queryKey: ["parts", "list"] });
  };

  const createMutation = useMutation({
    mutationFn: createPart,
    onSuccess: (newPart) => {
      notifications.show({
        color: "green",
        title: "Part Ditambahkan",
        message: newPart.name,
      });
      setCreating(false);
      invalidatePartsList();
    },
    onError: (e: any) => {
      notifications.show({
        color: "red",
        title: "Gagal Menambahkan",
        message: e.message,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (vars: { id: string; data: PartFormInput }) =>
      updatePart(vars.id, vars.data),
    onSuccess: (updatedPart) => {
      notifications.show({
        color: "green",
        title: "Part Diperbarui",
        message: updatedPart.name,
      });
      setEditing(null);
      invalidatePartsList();
    },
    onError: (e: any) => {
      notifications.show({
        color: "red",
        title: "Gagal Memperbarui",
        message: e.message,
      });
    },
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: deletePart,
    onSuccess: (_, deletedId) => {
      notifications.show({
        color: "green",
        title: "Part Dihapus",
        message: `Part berhasil dihapus.`,
      });
      queryClient.setQueryData(["parts", "list"], (old: Part[] = []) =>
        old.filter((p) => p.id !== deletedId)
      );
    },
    onError: (e: any) => {
      notifications.show({
        color: "red",
        title: "Gagal Menghapus",
        message: e.message,
      });
    },
  });

  const stockMoveMutation = useMutation({
    mutationFn: createStockMovement,
    onSuccess: (newMovement) => {
      notifications.show({
        color: "green",
        title: "Mutasi Stok Berhasil",
        message: `Stok untuk part terkait telah diperbarui.`,
      });
      invalidatePartsList();
    },
    onError: (e: any) => {
      notifications.show({
        color: "red",
        title: "Mutasi Gagal",
        message: e.message || "Gagal menyimpan mutasi stok.",
      });
    },
  });

  const handleStockMove = async (part: Part, v: StockMoveInput) => {
    await stockMoveMutation.mutateAsync({
      partId: part.id,
      type: v.type,
      quantity: v.qty,
      reference: v.ref,
      notes: v.note,
    });
    setMoving(null);
  };

  const handleStockOutFromTicket = async (
    payload: StockOutFromTicketPayload
  ) => {
    console.warn("Memulai stock out dari tiket:", payload.ticketCode);
    try {
      setLoadingStockOut(true);
      for (const line of payload.lines) {
        await stockMoveMutation.mutateAsync({
          partId: line.itemId,
          type: "out",
          quantity: line.qty,
          reference: payload.ticketCode,
          notes: `Otomatis dari tiket ${payload.ticketCode} (${line.partName})`,
        });
      }
      notifications.show({
        color: "green",
        title: "Stock Out Berhasil",
        message: `Semua item dari tiket ${payload.ticketCode} telah dikeluarkan.`,
      });
      setStockOutTicket(false);
    } catch (e: any) {
      notifications.show({
        color: "red",
        title: "Gagal Stock Out",
        message: e.message,
      });
    } finally {
      setLoadingStockOut(false);
    }
  };

  const handleDeletePart = (partToDelete: Part) => {
    modals.openConfirmModal({
      title: "Hapus part?",
      children: (
        <Text size="sm">
          Yakin ingin menghapus <strong>{partToDelete.name}</strong>?
        </Text>
      ),
      labels: { confirm: "Hapus", cancel: "Batal" },
      confirmProps: { color: "red", loading: deleteMutation.isPending },
      onConfirm: () => deleteMutation.mutate(partToDelete.id),
    });
  };

  type Row = Part;
  const columns: Column<Row>[] = [
    {
      key: "name",
      header: "Nama Part",
      width: "35%",
      cell: (r) => (
        <Stack gap={0}>
          <Text fw={600} size="sm">
            {r.name}
          </Text>
          {r.sku && (
            <Text c="dimmed" size="xs">
              SKU: {r.sku}
            </Text>
          )}
        </Stack>
      ),
    },
    {
      key: "stock",
      header: "Stok",
      align: "right",
      width: 100,
      cell: (r) => (
        <Text
          fw={(r.minStock ?? 0) > 0 && r.stock <= (r.minStock ?? 0) ? 700 : 500}
          c={
            (r.minStock ?? 0) > 0 && r.stock <= (r.minStock ?? 0)
              ? "red"
              : undefined
          }
        >
          {r.stock} {r.unit}
        </Text>
      ),
    },
    {
      key: "category",
      header: "Kategori",
      width: 150,
      cell: (r) => r.category ?? "-",
    },
    {
      key: "vendor",
      header: "Vendor",
      width: 150,
      cell: (r) => r.vendor ?? "-",
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      width: 120,
      cell: (r) => <PartStatusBadge status={r.status} />,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      width: 100,
      cell: (r) => (
        <Group gap="xs" justify="flex-end" wrap="nowrap">
          <Menu withinPortal position="bottom-end" shadow="sm">
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown miw={160}>
              <Menu.Item
                leftSection={<IconPencil size={14} />}
                onClick={() => setEditing(r)}
                disabled={updateMutation.isPending || deleteMutation.isPending}
              >
                Edit
              </Menu.Item>
              <Menu.Divider />
              <Menu.Label>Stock Movement</Menu.Label>
              <Menu.Item
                leftSection={<IconArrowDown size={14} />}
                onClick={() => setMoving({ part: r, type: "in" })}
                disabled={stockMoveMutation.isPending}
              >
                Stock In
              </Menu.Item>
              <Menu.Item
                leftSection={<IconArrowUp size={14} />}
                onClick={() => setMoving({ part: r, type: "out" })}
                disabled={stockMoveMutation.isPending}
              >
                Stock Out
              </Menu.Item>
              <Menu.Item
                leftSection={<IconUpload size={14} />}
                onClick={() => setMoving({ part: r, type: "adjust" })}
                disabled={stockMoveMutation.isPending}
              >
                Adjust Stock
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                color="red"
                leftSection={<IconTrash size={14} />}
                onClick={() => handleDeletePart(r)}
                disabled={deleteMutation.isPending || updateMutation.isPending}
              >
                Hapus Part
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      ),
    },
  ];

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    stockMoveMutation.isPending ||
    loadingStockOut;

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={3}>Inventory Items</Title>
        <Group>
          <Button
            variant="light"
            leftSection={<IconLink size={16} />}
            onClick={() => setStockOutTicket(true)}
          >
            Stock Out (Tiket)
          </Button>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setCreating(true)}
            disabled={createMutation.isPending}
          >
            Tambah Part
          </Button>
        </Group>
      </Group>

      <Group align="end" wrap="wrap" gap="sm">
        <TextField
          label="Cari Part"
          placeholder="Nama / SKU / Vendor..."
          value={q}
          onChange={(e) => setQ(e.currentTarget.value)}
          style={{ minWidth: 260, flexGrow: 1 }}
        />
        <Select
          label="Kategori"
          data={categories}
          value={category}
          onChange={(v) => setCategory(v ?? "all")}
          searchable
          style={{ minWidth: 180 }}
        />
        <Select
          label="Status"
          data={STATUS_OPTIONS}
          value={status}
          onChange={(v) => setStatus((v as any) ?? "all")}
          style={{ minWidth: 160 }}
        />
        <Checkbox
          label="Stok menipis"
          checked={lowOnly}
          onChange={(e) => setLowOnly(e.currentTarget.checked)}
          style={{ alignSelf: "flex-end", paddingBottom: 5 }}
        />
      </Group>

      <div style={{ position: "relative" }}>
        <LoadingOverlay visible={isLoading || isMutating} />
        <SimpleTable<Row>
          dense="sm"
          zebra
          stickyHeader
          maxHeight={540}
          columns={columns}
          data={filtered}
          emptyText="Belum ada part"
        />
      </div>

      <PartFormModal
        opened={creating}
        onClose={() => setCreating(false)}
        onSubmit={async (v) => {
          try {
            await createMutation.mutateAsync(v);
          } catch (e) {}
        }}
        title="Tambah Part"
        isSubmitting={createMutation.isPending}
      />

      <PartFormModal
        opened={!!editing}
        onClose={() => setEditing(null)}
        onSubmit={async (v) => {
          if (editing) {
            try {
              await updateMutation.mutateAsync({ id: editing.id, data: v });
            } catch (e) {}
          }
        }}
        title={`Edit Part: ${editing?.name ?? ""}`}
        initial={
          editing
            ? {
                name: editing.name,
                sku: editing.sku,
                category: editing.category,
                vendor: editing.vendor,
                unit: editing.unit,
                stock: editing.stock,
                minStock: editing.minStock,
                location: editing.location,
                price: editing.price,
                status: editing.status,
              }
            : undefined
        }
        isSubmitting={updateMutation.isPending}
      />

      <StockMoveModal
        opened={!!moving}
        onClose={() => setMoving(null)}
        initialType={moving?.type}
        onSubmit={async (v) => {
          if (moving) {
            await handleStockMove(moving.part, v);
          }
        }}
        isSubmitting={stockMoveMutation.isPending}
      />

      <StockOutFromTicketModal
        opened={stockOutTicket}
        onClose={() => setStockOutTicket(false)}
        onSubmit={handleStockOutFromTicket}
        isSubmitting={loadingStockOut}
      />
    </Stack>
  );
}
