"use client";

import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Checkbox,
  Group,
  Select,
  Stack,
  Title,
} from "@mantine/core";
import {
  IconPencil,
  IconPlus,
  IconTrash,
  IconUpload,
  IconDownload,
  IconArrowDown,
  IconArrowUp,
  IconLink,
} from "@tabler/icons-react";
import TextField from "@/shared/ui/inputs/TextField";
import { SimpleTable, type Column } from "@/shared/ui/table/SimpleTable";
import { ActionsDropdown } from "@/shared/ui/menus";
import PartFormModal from "./PartFormModal";
import StockMoveModal from "./StockMoveModal";
import PartStatusBadge from "./PartStatusBadge";
import type { Part } from "../model/types";
import type { PartFormInput, StockMoveInput } from "../model/schema";
import {
  INVENTORY_ITEMS,
  STOCK_MOVES,
  upsertItem,
  removeItem,
  nextId,
  pushMove,
  adjustStock,
  setStock,
} from "../model/mock";
import { downloadCSV } from "@/shared/utils/csv";
import StockOutFromTicketModal, {
  type StockOutFromTicketPayload,
} from "./StockOutFromTicketModal";

const CURRENT_USER = "sysadmin";

export default function InventoryListPage() {
  const [items, setItems] = useState<Part[]>(INVENTORY_ITEMS);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string | "all">("all");
  const [status, setStatus] = useState<"all" | Part["status"]>("all");
  const [lowOnly, setLowOnly] = useState(false);

  // modals
  const [editing, setEditing] = useState<null | Part>(null);
  const [creating, setCreating] = useState(false);
  const [moving, setMoving] = useState<null | {
    part: Part;
    type: "in" | "out" | "adjust";
  }>(null);
  const [stockOutTicket, setStockOutTicket] = useState(false);

  const categories = useMemo(() => {
    const s = new Set<string>();
    items.forEach((i) => i.category && s.add(i.category));
    return [
      { value: "all", label: "Semua kategori" },
      ...Array.from(s).map((v) => ({ value: v, label: v })),
    ];
  }, [items]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
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

  const exportCSV = () => {
    const headers = [
      "Nama",
      "SKU",
      "Kategori",
      "Vendor",
      "Unit",
      "Stok",
      "Min",
      "Lokasi",
      "Status",
      "Harga",
    ];
    const rows = filtered.map((i) => [
      i.name,
      i.sku ?? "",
      i.category ?? "",
      i.vendor ?? "",
      i.unit,
      i.stock,
      i.minStock ?? 0,
      i.location ?? "",
      i.status,
      i.price ?? "",
    ]);
    downloadCSV("inventory-items.csv", headers, rows);
  };

  const doCreate = (v: PartFormInput) => {
    const p: Part = {
      id: nextId("p"),
      name: v.name,
      sku: v.sku || undefined,
      category: v.category || undefined,
      vendor: v.vendor || undefined,
      unit: v.unit,
      stock: v.stock ?? 0,
      minStock: v.minStock ?? 0,
      location: v.location || undefined,
      status: v.status,
      price: v.price,
    };
    upsertItem(p);
    setItems([...INVENTORY_ITEMS]);
  };

  const doUpdate = (id: string, v: PartFormInput) => {
    const prev = items.find((x) => x.id === id);
    if (!prev) return;
    const p: Part = { ...prev, ...v };
    upsertItem(p);
    setItems([...INVENTORY_ITEMS]);
  };

  const doDelete = (id: string) => {
    removeItem(id);
    setItems([...INVENTORY_ITEMS]);
  };

  const doMove = (part: Part, v: StockMoveInput) => {
    const now = new Date().toISOString();
    if (v.type === "adjust") {
      const from = part.stock;
      const to = Math.max(0, v.qty);
      setStock(part.id, to);
      pushMove({
        id: nextId("m"),
        partId: part.id,
        partName: part.name,
        type: "adjust",
        qty: Math.abs(to - from),
        ref: v.ref,
        note: `Adjust ${from} → ${to}${v.note ? ` (${v.note})` : ""}`,
        by: CURRENT_USER,
        at: now,
      });
    } else {
      adjustStock(part.id, v.type, v.qty);
      pushMove({
        id: nextId("m"),
        partId: part.id,
        partName: part.name,
        type: v.type,
        qty: v.qty,
        ref: v.ref,
        note: v.note,
        by: CURRENT_USER,
        at: now,
      });
    }
    setItems([...INVENTORY_ITEMS]);
  };

  const doStockOutFromTicket = (payload: StockOutFromTicketPayload) => {
    const now = new Date().toISOString();
    for (const line of payload.lines) {
      // kurangi stok & buat mutasi out
      adjustStock(line.itemId, "out", line.qty);
      const item = INVENTORY_ITEMS.find((x) => x.id === line.itemId);
      pushMove({
        id: nextId("m"),
        partId: line.itemId,
        partName: item?.name ?? line.partName,
        type: "out",
        qty: line.qty,
        ref: payload.ticketCode,
        note: `Stock out dari ticket ${payload.ticketCode} (${line.partName})`,
        by: CURRENT_USER,
        at: now,
      });
    }
    setItems([...INVENTORY_ITEMS]);
  };

  type Row = Part;
  const columns: Column<Row>[] = [
    {
      key: "name",
      header: "Nama Part",
      width: "28%",
      cell: (r) => (
        <Group gap={8}>
          <div style={{ fontWeight: 600 }}>{r.name}</div>
          {r.minStock && r.stock <= r.minStock ? (
            <Badge color="red" variant="light">
              LOW
            </Badge>
          ) : null}
        </Group>
      ),
    },
    { key: "sku", header: "SKU", width: 140, cell: (r) => r.sku ?? "-" },
    {
      key: "category",
      header: "Kategori",
      width: 140,
      cell: (r) => r.category ?? "-",
    },
    {
      key: "vendor",
      header: "Vendor",
      width: 140,
      cell: (r) => r.vendor ?? "-",
    },
    {
      key: "unit",
      header: "Unit",
      width: 80,
      align: "center",
      cell: (r) => r.unit,
    },
    {
      key: "stock",
      header: "Stok",
      width: 100,
      align: "right",
      cell: (r) => r.stock.toString(),
    },
    {
      key: "minStock",
      header: "Min",
      width: 80,
      align: "right",
      cell: (r) => (r.minStock ?? 0).toString(),
    },
    {
      key: "status",
      header: "Status",
      width: 120,
      align: "center",
      cell: (r) => <PartStatusBadge status={r.status} />,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      width: 200,
      cell: (r) => (
        <ActionsDropdown
          items={[
            {
              label: "Edit",
              icon: <IconPencil size={16} />,
              onClick: () => setEditing(r),
            },
            {
              label: "Stock In",
              icon: <IconArrowDown size={16} />,
              onClick: () => setMoving({ part: r, type: "in" }),
            },
            {
              label: "Stock Out",
              icon: <IconArrowUp size={16} />,
              onClick: () => setMoving({ part: r, type: "out" }),
            },
            {
              label: "Adjust",
              icon: <IconUpload size={16} />,
              onClick: () => setMoving({ part: r, type: "adjust" }),
            },
            { type: "divider" },
            {
              label: "Hapus",
              icon: <IconTrash size={16} />,
              color: "red",
              confirm: {
                title: "Hapus part?",
                message: r.name,
                labels: { confirm: "Hapus", cancel: "Batal" },
              },
              onClick: () => doDelete(r.id),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={3}>Inventory Items</Title>
        <Group gap="xs">
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setCreating(true)}
          >
            Tambah Part
          </Button>
          <Button
            variant="light"
            leftSection={<IconLink size={16} />}
            onClick={() => setStockOutTicket(true)}
            title="Buat Stock Out berdasarkan parts di ticket"
          >
            Stock Out dari Ticket
          </Button>
          <Button
            variant="light"
            leftSection={<IconDownload size={16} />}
            onClick={exportCSV}
          >
            Export CSV
          </Button>
          <Button
            variant="default"
            leftSection={<IconUpload size={16} />}
            disabled
          >
            Import CSV (soon)
          </Button>
        </Group>
      </Group>

      {/* Toolbar */}
      <Group align="end" wrap="wrap" gap="sm">
        <TextField
          label="Cari"
          placeholder="Nama / SKU / Vendor / Kategori"
          value={q}
          onChange={(e) => setQ(e.currentTarget.value)}
          style={{ minWidth: 280 }}
        />
        <Select
          label="Kategori"
          data={categories}
          value={category}
          onChange={(v) => setCategory((v as any) ?? "all")}
          style={{ minWidth: 200 }}
          searchable
        />
        <Select
          label="Status"
          data={[
            { value: "all", label: "Semua" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
            { value: "discontinued", label: "Discontinued" },
          ]}
          value={status}
          onChange={(v) => setStatus((v as any) ?? "all")}
          style={{ minWidth: 180 }}
        />
        <Checkbox
          label="Hanya low stock"
          checked={lowOnly}
          onChange={(e) => setLowOnly(e.currentTarget.checked)}
        />
      </Group>

      <SimpleTable<Row>
        dense="sm"
        zebra
        stickyHeader
        maxHeight={540}
        columns={columns}
        data={filtered}
        emptyText="Belum ada part"
      />

      {/* Create */}
      <PartFormModal
        opened={creating}
        onClose={() => setCreating(false)}
        onSubmit={(v) => doCreate(v)}
        title="Tambah Part"
      />

      {/* Edit */}
      <PartFormModal
        opened={!!editing}
        onClose={() => setEditing(null)}
        onSubmit={(v) => editing && doUpdate(editing.id, v)}
        title="Edit Part"
        initial={
          editing
            ? {
                name: editing.name,
                sku: editing.sku,
                category: editing.category,
                vendor: editing.vendor,
                unit: editing.unit,
                stock: editing.stock,
                minStock: editing.minStock ?? 0,
                location: editing.location,
                price: editing.price,
                status: editing.status,
              }
            : undefined
        }
      />

      {/* Stock move */}
      <StockMoveModal
        opened={!!moving}
        onClose={() => setMoving(null)}
        initialType={moving?.type}
        onSubmit={(v) => {
          if (!moving) return;
          doMove(moving.part, v);
          setMoving(null);
        }}
      />

      {/* Stock out dari ticket */}
      <StockOutFromTicketModal
        opened={stockOutTicket}
        onClose={() => setStockOutTicket(false)}
        onSubmit={(payload) => doStockOutFromTicket(payload)}
      />
    </Stack>
  );
}
