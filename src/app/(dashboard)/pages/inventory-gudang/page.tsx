"use client";

import PriceDeltaBadge from "@/components/atoms/PriceDeltaBadge";
import FormModal from "@/components/molecules/FormModal";
import Pagination from "@/components/molecules/Pagination";
import InventoryItemForm, {
  type InventoryItemFormProps,
  type InventoryItemShape,
} from "@/components/organisms/InventoryItemForm";
import Table, { type TableColumn } from "@/components/organisms/Table";
import TableToolbar from "@/components/organisms/TableToolbar";
import {
  EyeIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import * as React from "react";

type InventoryRow = {
  id: string;
  name: string;
  sku?: string;
  category?: string;
  unit?: string;
  stock?: number;
  storePrice?: number;
  marketPrice?: number;
  marketSource?: string;
  marketCheckedAt?: string;
};

const columns: TableColumn[] = [
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
  if (store == null || market == null || market === 0) return null;
  return ((store - market) / market) * 100;
}

const data: InventoryRow[] = [
  {
    id: "INV-001",
    name: "RAM DDR4 16GB 3200",
    sku: "RAM16-3200",
    category: "ram",
    unit: "pcs",
    stock: 24,
    storePrice: 650_000,
    marketPrice: 599_000,
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
    storePrice: 1_350_000,
    marketPrice: 1_399_000,
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
    storePrice: 799_000,
    marketPrice: 0,
  },
];

function toFormShape(row: InventoryRow): InventoryItemShape {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    unit: row.unit ?? "pcs",
    stockQty: row.stock,
    cost: row.storePrice,
    lastUpdated: row.marketCheckedAt,
  };
}

export default function InventoryGudangPage() {
  const renderRow = (item: InventoryRow) => {
    const d = delta(item.storePrice, item.marketPrice);

    return (
      <tr key={item.id} className="group/row text-sm row-hover">
        {/* Item */}
        <td className="p-4">
          <div className="flex flex-col">
            <span className="font-medium">{item.name}</span>
            <span className="text-xs text-[var(--mono-muted)]">
              {item.sku ?? "-"}
            </span>
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
          {item.marketPrice && item.marketPrice > 0 ? (
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
              component={(props: Omit<InventoryItemFormProps, "data">) => (
                <InventoryItemForm {...props} data={toFormShape(item)} />
              )}
              data={toFormShape(item)}
              variant="ghost"
              invertOnRowHover
              triggerClassName="w-8 h-8"
              icon={<EyeIcon className="w-4 h-4" aria-hidden="true" />}
            />
            {/* UPDATE */}
            <FormModal
              type="update"
              entityTitle="Item"
              component={(props: Omit<InventoryItemFormProps, "data">) => (
                <InventoryItemForm {...props} data={toFormShape(item)} />
              )}
              data={toFormShape(item)}
              variant="ghost"
              invertOnRowHover
              triggerClassName="w-8 h-8"
              icon={<PencilSquareIcon className="w-4 h-4" aria-hidden="true" />}
            />
            {/* DELETE */}
            <FormModal
              type="delete"
              entityTitle="Item"
              id={item.id}
              variant="ghost"
              invertOnRowHover
              triggerClassName="w-8 h-8"
              icon={<TrashIcon className="w-4 h-4" aria-hidden="true" />}
            />
          </div>
        </td>
      </tr>
    );
  };

  return (
    <section className="section space-y-4">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-sm font-semibold uppercase tracking-wider">
          Inventory Gudang
        </h1>

        <TableToolbar
          searchPlaceholder="Cari barang…"
          createButton={
            <FormModal
              type="create"
              entityTitle="Item"
              component={InventoryItemForm}
              variant="solid"
              triggerClassName="w-8 h-8"
              icon={<PlusIcon className="w-4 h-4" aria-hidden="true" />}
            />
          }
        />
      </div>

      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/* PAGINATION */}
      <Pagination />
    </section>
  );
}
