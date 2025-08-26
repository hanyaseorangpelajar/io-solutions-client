"use client";

import PriceDeltaBadge from "@/components/atoms/PriceDeltaBadge";
import FormModal from "@/components/molecules/FormModal";
import Pagination from "@/components/molecules/Pagination";
import InventoryHistoryDetailForm, {
  type InventoryHistory,
} from "@/components/organisms/InventoryHistoryDetailForm";
import Table, { type TableColumn } from "@/components/organisms/Table";
import TableToolbar from "@/components/organisms/TableToolbar";
import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import * as React from "react";

const columns: TableColumn[] = [
  { header: "Item", accessor: "item" },
  { header: "Change", accessor: "change", className: "hidden md:table-cell" },
  { header: "Qty Δ", accessor: "qty", className: "hidden md:table-cell" },
  { header: "Stock", accessor: "stock", className: "hidden lg:table-cell" },
  { header: "Price", accessor: "price", className: "hidden lg:table-cell" },
  { header: "By", accessor: "actor", className: "hidden md:table-cell" },
  { header: "Date", accessor: "date", className: "hidden md:table-cell" },
  { header: "Actions", accessor: "action" },
];

function priceDelta(before?: number, after?: number) {
  if (before === undefined || after === undefined || before === 0) return null;
  return ((after - before) / before) * 100;
}

const history: InventoryHistory[] = [
  {
    id: "INVH-2025-0001",
    itemName: "RAM DDR4 16GB 3200",
    sku: "RAM16-3200",
    change: "STOCK_ADJUST",
    qtyChange: +10,
    stockBefore: 14,
    stockAfter: 24,
    priceBefore: 650000,
    priceAfter: 650000,
    actor: "Rudi",
    location: "Gudang A",
    date: "2025-08-02",
    note: "Penambahan stok dari PO #PO-123",
  },
  {
    id: "INVH-2025-0002",
    itemName: "SSD NVMe 1TB Gen4",
    sku: "SSD1TB-G4",
    change: "PRICE_UPDATE",
    qtyChange: 0,
    stockBefore: 12,
    stockAfter: 12,
    priceBefore: 1299000,
    priceAfter: 1350000,
    actor: "Sari",
    location: "Gudang B",
    date: "2025-08-03",
    note: "Penyesuaian mengikuti market terakhir",
  },
  {
    id: "INVH-2025-0003",
    itemName: "PSU 650W 80+ Bronze",
    sku: "PSU650B",
    change: "TRANSFER_OUT",
    qtyChange: -3,
    stockBefore: 11,
    stockAfter: 8,
    priceBefore: 799000,
    priceAfter: 799000,
    actor: "Dimas",
    location: "Ke Toko Cabang C",
    date: "2025-08-04",
    note: "Mutasi stok ke cabang",
  },
];

export default function RiwayatInventoryPage() {
  const renderRow = (item: InventoryHistory) => {
    const d = priceDelta(item.priceBefore, item.priceAfter);

    return (
      <tr key={item.id} className="group/row text-sm row-hover">
        {/* Item */}
        <td className="p-4">
          <div className="flex flex-col">
            <span className="font-medium">{item.itemName}</span>
            <span className="text-xs text-[var(--mono-muted)]">
              {item.sku ?? "-"}
            </span>
          </div>
        </td>

        {/* Change */}
        <td className="hidden md:table-cell">{item.change}</td>

        {/* Qty Δ */}
        <td className="hidden md:table-cell">
          {item.qtyChange === undefined
            ? "-"
            : item.qtyChange > 0
            ? `+${item.qtyChange}`
            : item.qtyChange}
        </td>

        {/* Stock before→after */}
        <td className="hidden lg:table-cell">
          {item.stockBefore ?? "-"} <span className="mx-1 text-xs">→</span>{" "}
          {item.stockAfter ?? "-"}
        </td>

        {/* Price before→after + badge */}
        <td className="hidden lg:table-cell">
          {item.priceBefore !== undefined
            ? `Rp${item.priceBefore.toLocaleString("id-ID")}`
            : "-"}
          <span className="mx-1 text-xs">→</span>
          {item.priceAfter !== undefined
            ? `Rp${item.priceAfter.toLocaleString("id-ID")}`
            : "-"}
          <PriceDeltaBadge delta={d ?? undefined} className="ml-2" />
        </td>

        {/* Actor */}
        <td className="hidden md:table-cell">{item.actor}</td>

        {/* Date */}
        <td className="hidden md:table-cell">{item.date}</td>

        {/* Actions */}
        <td>
          <div className="flex items-center gap-2">
            <FormModal
              type="read"
              entityTitle="Riwayat"
              component={InventoryHistoryDetailForm}
              data={item}
              variant="ghost"
              invertOnRowHover
              triggerClassName="w-8 h-8"
              icon={<EyeIcon className="w-4 h-4" aria-hidden="true" />}
            />
            <FormModal
              type="delete"
              entityTitle="Riwayat"
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
          Riwayat Inventory
        </h1>

        <TableToolbar searchPlaceholder="Cari riwayat…" />
      </div>

      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={history} />

      {/* PAGINATION */}
      <Pagination />
    </section>
  );
}
