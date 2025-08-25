"use client";

import * as React from "react";
import InputLabelField from "@/components/form/fields/InputLabelField";
import PriceDeltaBadge from "@/components/ui/badges/PriceDeltaBadge";

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
  type: Mode; // pakai "read"
  data?: InventoryHistory;
  onClose: () => void;
};

function pctDelta(before?: number, after?: number) {
  if (before === undefined || after === undefined || before === 0) return null;
  return ((after - before) / before) * 100;
}

const chip =
  "inline-flex items-center gap-1 border border-black px-1.5 py-0.5 text-[10px] uppercase tracking-widest";

export default function InventoryHistoryDetailForm({
  data,
  onClose,
}: InventoryHistoryDetailFormProps) {
  const d = pctDelta(data?.priceBefore, data?.priceAfter);

  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-3">
      {/* header mini */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={chip}>{data?.change ?? "UPDATE"}</span>
          <span className="text-xs border border-black px-2 py-1 rounded-none">
            {data?.date ?? "-"}
          </span>
        </div>
        <div className="text-xs max-w-[60%] truncate text-right">
          {data?.itemName ?? "-"}
        </div>
      </div>

      {/* identitas */}
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

      {/* before/after ringkas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="border border-black p-3">
          <div className="text-xs uppercase tracking-widest text-black/70 mb-2">
            Stok
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Before:</span>
            <span className="font-medium">{data?.stockBefore ?? "-"}</span>
            <span className="mx-1 text-xs">→</span>
            <span className="text-sm">After:</span>
            <span className="font-medium">{data?.stockAfter ?? "-"}</span>
          </div>
        </div>

        <div className="border border-black p-3">
          <div className="text-xs uppercase tracking-widest text-black/70 mb-2">
            Harga
          </div>
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
        </div>
      </div>

      {data?.note ? (
        <div className="border border-black p-3">
          <div className="text-xs uppercase tracking-widest text-black/70 mb-1">
            Catatan
          </div>
          <p className="text-sm whitespace-pre-wrap">{data.note}</p>
        </div>
      ) : null}

      {/* actions */}
      <div className="mt-2 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-black bg-white hover:bg-black hover:text-white transition"
        >
          Tutup
        </button>
      </div>
    </form>
  );
}
