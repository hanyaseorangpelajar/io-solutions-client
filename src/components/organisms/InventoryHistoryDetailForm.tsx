// src/components/features/inventory/forms/InventoryHistoryDetailForm.tsx
"use client";

import * as React from "react";
import PriceDeltaBadge from "@/components/atoms/PriceDeltaBadge";
import InputLabelField from "@/components/molecules/InputLabelField";
import MonoBadge from "@/components/atoms/MonoBadge";
import MonoCard from "@/components/molecules/MonoCard";

type Mode = "create" | "read" | "update";

export type InventoryChangeType =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "STOCK_ADJUST"
  | "PRICE_UPDATE"
  | "TRANSFER_IN"
  | "TRANSFER_OUT";

export type InventoryHistory = {
  id: string;
  itemName: string;
  sku?: string;
  change: InventoryChangeType;
  qtyChange?: number; // +/-
  stockBefore?: number;
  stockAfter?: number;
  priceBefore?: number;
  priceAfter?: number;
  location?: string;
  actor: string;
  date: string; // YYYY-MM-DD
  note?: string;
};

export type InventoryHistoryDetailFormProps = {
  type: Mode; // dipakai "read"
  data?: InventoryHistory;
  onClose: () => void;
};

function pctDelta(before?: number, after?: number) {
  if (before === undefined || after === undefined || before === 0) return null;
  return ((after - before) / before) * 100;
}

export default function InventoryHistoryDetailForm({
  data,
  onClose,
}: InventoryHistoryDetailFormProps) {
  const d = pctDelta(data?.priceBefore, data?.priceAfter);

  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MonoBadge ghost={false} className="px-2 py-0.5 text-[10px]">
            {data?.change ?? "UPDATE"}
          </MonoBadge>
          <MonoBadge className="px-2 py-0.5 text-[10px]">
            {data?.date ?? "-"}
          </MonoBadge>
        </div>
        <div className="text-xs max-w-[60%] truncate text-right">
          {data?.itemName ?? "-"}
        </div>
      </div>

      {/* Identitas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <InputLabelField
          id="ih-name"
          label="Nama Item"
          value={data?.itemName ?? ""}
          onChange={() => {}}
          disabled
        />
        <InputLabelField
          id="ih-sku"
          label="SKU"
          value={data?.sku ?? ""}
          onChange={() => {}}
          disabled
        />
        <InputLabelField
          id="ih-location"
          label="Lokasi"
          value={data?.location ?? ""}
          onChange={() => {}}
          disabled
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <InputLabelField
          id="ih-actor"
          label="Pelaksana"
          value={data?.actor ?? ""}
          onChange={() => {}}
          disabled
        />
        <InputLabelField
          id="ih-change"
          label="Jenis Perubahan"
          value={data?.change ?? ""}
          onChange={() => {}}
          disabled
        />
        <InputLabelField
          id="ih-qtydelta"
          label="Perubahan Qty"
          value={
            data?.qtyChange === undefined
              ? ""
              : data.qtyChange > 0
              ? `+${data.qtyChange}`
              : String(data.qtyChange)
          }
          onChange={() => {}}
          disabled
        />
      </div>

      {/* Before / After */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <MonoCard
          padding
          header={
            <div className="text-xs uppercase tracking-widest text-[var(--mono-label)]">
              Stok
            </div>
          }
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">Before:</span>
            <span className="font-medium">{data?.stockBefore ?? "-"}</span>
            <span className="mx-1 text-xs">→</span>
            <span className="text-sm">After:</span>
            <span className="font-medium">{data?.stockAfter ?? "-"}</span>
          </div>
        </MonoCard>

        <MonoCard
          padding
          header={
            <div className="text-xs uppercase tracking-widest text-[var(--mono-label)]">
              Harga
            </div>
          }
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">Before:</span>
            <span className="font-medium">
              {data?.priceBefore !== undefined
                ? `Rp${data.priceBefore.toLocaleString("id-ID")}`
                : "-"}
            </span>
            <span className="mx-1 text-xs">→</span>
            <span className="text-sm">After:</span>
            <span className="font-medium">
              {data?.priceAfter !== undefined
                ? `Rp${data.priceAfter.toLocaleString("id-ID")}`
                : "-"}
            </span>
            <PriceDeltaBadge delta={d ?? undefined} className="ml-2" />
          </div>
        </MonoCard>
      </div>

      {data?.note ? (
        <MonoCard
          padding
          header={
            <div className="text-xs uppercase tracking-widest text-[var(--mono-label)]">
              Catatan
            </div>
          }
        >
          <p className="text-sm whitespace-pre-wrap">{data.note}</p>
        </MonoCard>
      ) : null}

      {/* Actions */}
      <div className="mt-2 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="btn-ghost active:scale-95 transition duration-200"
        >
          Tutup
        </button>
      </div>
    </form>
  );
}
