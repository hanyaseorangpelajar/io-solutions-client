"use client";

import { useMemo } from "react";
import {
  Paper,
  Stack,
  Group,
  Title,
  Text,
  Button,
  SimpleGrid,
  ScrollArea,
  Table,
  Badge,
} from "@mantine/core";
import { downloadCsv, toCsv } from "../model/derive";
// Pakai mock dari fitur inventory (sesuaikan dengan barrel kamu)
import { INVENTORY_ITEMS, STOCK_MOVES } from "@/features/inventory";

/** Helper kecil: ambil string aman */
const s = (v: any, fb = "") => (v == null ? fb : String(v));
/** Helper kecil: ambil number aman */
const n = (v: any, fb = 0) => {
  const x = Number(v);
  return Number.isFinite(x) ? x : fb;
};

export default function InventoryReportPage() {
  const items = (INVENTORY_ITEMS ?? []) as any[];
  const moves = (STOCK_MOVES ?? []) as any[];

  // Lookup untuk nama part dari id (membantu tabel movements)
  const partLookup = useMemo(() => {
    const m = new Map<string, any>();
    for (const it of items) {
      const id = s(it.id ?? it.partId ?? it.code ?? it.sku);
      if (id) m.set(id, it);
    }
    return m;
  }, [items]);

  // --- Tabel: Stok per Kategori
  const byCategory = useMemo(() => {
    const agg = new Map<
      string,
      { category: string; totalItems: number; totalStock: number }
    >();
    for (const it of items) {
      const cat = s(it.category ?? it.type ?? "Uncategorized");
      const stock = n(it.stock ?? it.qty ?? 0);
      if (!agg.has(cat))
        agg.set(cat, { category: cat, totalItems: 0, totalStock: 0 });
      const row = agg.get(cat)!;
      row.totalItems += 1;
      row.totalStock += stock;
    }
    return Array.from(agg.values()).sort((a, b) =>
      a.category.localeCompare(b.category)
    );
  }, [items]);

  // --- Tabel: Daftar Item
  const itemRows = useMemo(() => {
    return items
      .map((it) => {
        const id = s(it.id ?? it.partId ?? it.code ?? it.sku);
        const name = s(it.name ?? it.title ?? "");
        const category = s(it.category ?? it.type ?? "Uncategorized");
        const stock = n(it.stock ?? it.qty ?? 0);
        const minStock = n(it.minStock ?? it.reorderPoint ?? 0);
        const unitPrice = n(it.unitPrice ?? it.price ?? it.cost ?? 0);
        const status =
          stock <= 0
            ? "Out of stock"
            : minStock > 0 && stock <= minStock
            ? "Low"
            : "OK";
        return { id, name, category, stock, minStock, unitPrice, status };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);

  // --- Tabel: Pergerakan Stok
  const movementRows = useMemo(() => {
    return (
      moves
        .map((m) => {
          const dateRaw = m.date ?? m.movedAt ?? m.createdAt ?? Date.now();
          const date = new Date(dateRaw);
          const type = s(m.type ?? m.direction ?? "");
          const partId = s(m.partId ?? m.itemId ?? "");
          const part =
            m.part?.name ??
            partLookup.get(partId)?.name ??
            partLookup.get(partId)?.title ??
            "";
          const qty = n(m.quantity ?? m.qty ?? 0);
          const note = s(m.note ?? m.reason ?? "");
          const reference = s(
            m.reference ?? m.ref ?? m.ticketId ?? m.documentNo ?? ""
          );
          return {
            dateISO: date.toISOString(),
            dateText: date.toLocaleString(),
            type,
            partId,
            part,
            qty,
            note,
            reference,
          };
        })
        // paling baru di atas
        .sort((a, b) => b.dateISO.localeCompare(a.dateISO))
    );
  }, [moves, partLookup]);

  // --- Exporters
  const exportByCategoryCsv = () => {
    const csv = toCsv(byCategory, ["category", "totalItems", "totalStock"]);
    downloadCsv("inventory-by-category.csv", csv);
  };

  const exportItemsCsv = () => {
    const csv = toCsv(itemRows, [
      "id",
      "name",
      "category",
      "stock",
      "minStock",
      "unitPrice",
      "status",
    ]);
    downloadCsv("inventory-items.csv", csv);
  };

  const exportMovementsCsv = () => {
    const csv = toCsv(movementRows, [
      "dateISO",
      "type",
      "partId",
      "part",
      "qty",
      "note",
      "reference",
    ]);
    downloadCsv("inventory-movements.csv", csv);
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center">
        <div>
          <Title order={3}>Laporan Inventory</Title>
          <Text c="dimmed">
            Ringkasan stok, item, dan pergerakan gudang dalam bentuk tabel.
          </Text>
        </div>
      </Group>

      <SimpleGrid cols={{ base: 1, md: 2 }}>
        {/* --- Stok per Kategori --- */}
        <Paper withBorder radius="md" p="md">
          <Group justify="space-between" mb="xs">
            <Text fw={600}>Stok per Kategori</Text>
            <Button variant="light" size="xs" onClick={exportByCategoryCsv}>
              Export CSV
            </Button>
          </Group>
          <ScrollArea h={300}>
            <Table
              striped
              highlightOnHover
              withTableBorder
              withColumnBorders
              stickyHeader
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Category</Table.Th>
                  <Table.Th style={{ textAlign: "right" }}>
                    Total Items
                  </Table.Th>
                  <Table.Th style={{ textAlign: "right" }}>
                    Total Stock
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {byCategory.map((r) => (
                  <Table.Tr key={r.category}>
                    <Table.Td>{r.category}</Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>
                      {r.totalItems}
                    </Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>
                      {r.totalStock}
                    </Table.Td>
                  </Table.Tr>
                ))}
                {byCategory.length === 0 && (
                  <Table.Tr>
                    <Table.Td colSpan={3}>
                      <Text c="dimmed" ta="center">
                        Tidak ada data.
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </Paper>

        {/* --- Pergerakan Stok (ringkas) --- */}
        <Paper withBorder radius="md" p="md">
          <Group justify="space-between" mb="xs">
            <Text fw={600}>Pergerakan Stok</Text>
            <Button variant="light" size="xs" onClick={exportMovementsCsv}>
              Export CSV
            </Button>
          </Group>
          <ScrollArea h={300}>
            <Table
              striped
              highlightOnHover
              withTableBorder
              withColumnBorders
              stickyHeader
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Tanggal</Table.Th>
                  <Table.Th>Tipe</Table.Th>
                  <Table.Th>Part</Table.Th>
                  <Table.Th style={{ textAlign: "right" }}>Qty</Table.Th>
                  <Table.Th>Referensi</Table.Th>
                  <Table.Th>Catatan</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {movementRows.map((m, idx) => (
                  <Table.Tr key={`${m.dateISO}-${idx}`}>
                    <Table.Td>{m.dateText}</Table.Td>
                    <Table.Td>
                      <Badge
                        color={
                          m.type === "IN"
                            ? "indigo"
                            : m.type === "OUT"
                            ? "red"
                            : "gray"
                        }
                      >
                        {m.type || "-"}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text fw={500}>{m.part || "-"}</Text>
                      <Text size="xs" c="dimmed">
                        {m.partId}
                      </Text>
                    </Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>{m.qty}</Table.Td>
                    <Table.Td>{m.reference || "-"}</Table.Td>
                    <Table.Td>{m.note || "-"}</Table.Td>
                  </Table.Tr>
                ))}
                {movementRows.length === 0 && (
                  <Table.Tr>
                    <Table.Td colSpan={6}>
                      <Text c="dimmed" ta="center">
                        Tidak ada aktivitas pergerakan.
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </Paper>
      </SimpleGrid>

      {/* --- Daftar Item --- */}
      <Paper withBorder radius="md" p="md">
        <Group justify="space-between" mb="xs">
          <Text fw={600}>Daftar Item</Text>
          <Button variant="light" size="xs" onClick={exportItemsCsv}>
            Export CSV
          </Button>
        </Group>
        <ScrollArea h={420}>
          <Table
            striped
            highlightOnHover
            withTableBorder
            withColumnBorders
            stickyHeader
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Nama</Table.Th>
                <Table.Th>Kategori</Table.Th>
                <Table.Th style={{ textAlign: "right" }}>Stok</Table.Th>
                <Table.Th style={{ textAlign: "right" }}>Min Stok</Table.Th>
                <Table.Th style={{ textAlign: "right" }}>Harga/Unit</Table.Th>
                <Table.Th>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {itemRows.map((r) => (
                <Table.Tr key={r.id || r.name}>
                  <Table.Td>{r.id || "-"}</Table.Td>
                  <Table.Td>{r.name || "-"}</Table.Td>
                  <Table.Td>{r.category}</Table.Td>
                  <Table.Td style={{ textAlign: "right" }}>{r.stock}</Table.Td>
                  <Table.Td style={{ textAlign: "right" }}>
                    {r.minStock}
                  </Table.Td>
                  <Table.Td style={{ textAlign: "right" }}>
                    {r.unitPrice ? r.unitPrice.toLocaleString() : "-"}
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={
                        r.status === "Out of stock"
                          ? "red"
                          : r.status === "Low"
                          ? "yellow"
                          : "teal"
                      }
                    >
                      {r.status}
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              ))}
              {itemRows.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={7}>
                    <Text c="dimmed" ta="center">
                      Tidak ada item di inventory.
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Paper>
    </Stack>
  );
}
