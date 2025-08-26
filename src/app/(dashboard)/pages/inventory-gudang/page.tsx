// src/app/(dashboard)/pages/inventory-gudang/page.tsx
"use client";

import * as React from "react";
import Table from "@/components/data-display/table/Table";
import TableToolbar from "@/components/data-display/table/TableToolbar";
import FormModal from "@/components/overlays/FormModal";
import PriceDeltaBadge from "@/components/ui/badges/PriceDeltaBadge";
import Pagination from "@/components/data-display/table/Pagination";
import InventoryItemForm, {
  InventoryItem,
} from "@/components/features/inventory/forms/InventoryItemForm";
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

const columns = [
  { header: "Item", accessor: "item" },
  {
    header: "Kategori",
    accessor: "category",
    className: "hidden md:table-cell",
  },
  { header: "Stok", accessor: "stock", className: "hidden md:table-cell" },
  {
    header: "Harga Toko",
    accessor: "store",
    className: "hidden md:table-cell",
  },
  { header: "Market", accessor: "market", className: "hidden lg:table-cell" },
  { header: "Δ", accessor: "delta", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "action" },
];

function delta(store?: number, market?: number) {
  if (!store || !market) return null;
  if (market === 0) return null;
  return ((store - market) / market) * 100;
}

const data: InventoryItem[] = [
  {
    id: "INV-001",
    name: "RAM DDR4 16GB 3200",
    sku: "RAM16-3200",
    category: "ram",
    unit: "pcs",
    stock: 24,
    storePrice: 650000,
    marketPrice: 599000,
    marketSource: "Tokopedia",
    marketCheckedAt: "2025-08-01",
  },
  {
    id: "INV-002",
    name: "SSD NVMe 1TB Gen4",
    sku: "SSD1TB-G4",
    category: "storage",
    unit: "pcs",
    stock: 12,
    storePrice: 1350000,
    marketPrice: 1399000,
    marketSource: "Shopee",
    marketCheckedAt: "2025-08-02",
  },
  {
    id: "INV-003",
    name: "PSU 650W 80+ Bronze",
    sku: "PSU650B",
    category: "psu",
    unit: "pcs",
    stock: 8,
    storePrice: 799000,
    marketPrice: 0, // tidak ada data
    marketSource: "",
    marketCheckedAt: "",
  },
];

export default function InventoryGudangPage() {
  const renderRow = (item: InventoryItem) => {
    const d = delta(item.storePrice, item.marketPrice);

    return (
      <tr
        key={String(item.id ?? item.sku)}
        className="group/row text-sm hover:bg-[var(--mono-fg)] hover:text-[var(--mono-bg)]"
      >
        {/* Item */}
        <td className="p-4">
          <div className="flex flex-col">
            <span className="font-medium">{item.name}</span>
            <span className="text-xs">{item.sku ?? "-"}</span>
          </div>
        </td>

        {/* Kategori */}
        <td className="hidden md:table-cell">{item.category ?? "-"}</td>

        {/* Stok */}
        <td className="hidden md:table-cell">
          {item.stock ?? 0} {item.unit ?? "pcs"}
        </td>

        {/* Harga Toko */}
        <td className="hidden md:table-cell">
          Rp{(item.storePrice ?? 0).toLocaleString("id-ID")}
        </td>

        {/* Market */}
        <td className="hidden lg:table-cell">
          {item.marketPrice ? (
            <>
              Rp{item.marketPrice.toLocaleString("id-ID")}{" "}
              <span className="text-[10px] ml-1 opacity-70">
                ({item.marketSource || "market"})
              </span>
            </>
          ) : (
            <span className="opacity-70">—</span>
          )}
        </td>

        {/* Δ */}
        <td className="hidden lg:table-cell">
          <PriceDeltaBadge delta={d ?? undefined} />
        </td>

        {/* Actions */}
        <td>
          <div className="flex items-center gap-2">
            {/* READ */}
            <FormModal
              type="read"
              entityTitle="Item"
              component={InventoryItemForm as any}
              data={item}
              variant="ghost"
              hoverInvertFromRow
              triggerClassName="w-8 h-8"
              icon={<EyeIcon className="w-4 h-4" />}
            />
            {/* UPDATE */}
            <FormModal
              type="update"
              entityTitle="Item"
              component={InventoryItemForm as any}
              data={item}
              variant="ghost"
              hoverInvertFromRow
              triggerClassName="w-8 h-8"
              icon={<PencilSquareIcon className="w-4 h-4" />}
            />
            {/* DELETE (konfirmasi bawaan) */}
            <FormModal
              type="delete"
              entityTitle="Item"
              id={item.id ?? item.sku ?? ""}
              variant="ghost"
              hoverInvertFromRow
              triggerClassName="w-8 h-8"
              icon={<TrashIcon className="w-4 h-4" />}
            />
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-[var(--mono-bg)] text-[var(--mono-fg)] p-4 rounded-none border border-[var(--mono-border)] flex-1 m-4 mt-6">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          Inventory Gudang
        </h1>

        <TableToolbar
          searchPlaceholder="Cari barang…"
          createButton={
            <FormModal
              type="create"
              entityTitle="Item"
              component={InventoryItemForm as any}
              variant="solid"
              triggerClassName="w-8 h-8"
              icon={<PlusIcon className="w-4 h-4" />}
            />
          }
        />
      </div>

      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/* PAGINATION */}
      <Pagination />
    </div>
  );
}
