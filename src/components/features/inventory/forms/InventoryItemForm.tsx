"use client";

import * as React from "react";
import InputLabelField from "@/components/ui/fields/InputLabelField";
import SelectLabelField from "@/components/ui/fields/SelectLabelField";
import PriceDeltaBadge from "@/components/ui/badges/PriceDeltaBadge";

export type InventoryItem = {
  id?: string | number;
  name: string;
  sku?: string;
  category?: string;
  unit?: string; // pcs, set, unit, dll.
  stock?: number;
  storePrice: number;
  marketPrice?: number;
  marketSource?: string;
  marketCheckedAt?: string; // YYYY-MM-DD
};

type Mode = "create" | "read" | "update";

type Props = {
  type: Mode;
  data?: InventoryItem;
  onClose: () => void;
};

function toNumber(val: string): number | undefined {
  if (val === "" || val === undefined || val === null) return undefined;
  const n = Number(val);
  return Number.isNaN(n) ? undefined : n;
}

function delta(store?: number, market?: number) {
  if (!store || !market) return null;
  if (market === 0) return null;
  return ((store - market) / market) * 100;
}

export default function InventoryItemForm({ type, data, onClose }: Props) {
  const readOnly = type === "read";

  const [form, setForm] = React.useState<InventoryItem>({
    name: data?.name ?? "",
    sku: data?.sku ?? "",
    category: data?.category ?? "other",
    unit: data?.unit ?? "pcs",
    stock: data?.stock ?? 0,
    storePrice: data?.storePrice ?? 0,
    marketPrice: data?.marketPrice,
    marketSource: data?.marketSource ?? "",
    marketCheckedAt: data?.marketCheckedAt ?? "",
  });

  const set = <K extends keyof InventoryItem>(k: K, v: InventoryItem[K]) =>
    setForm((s) => ({ ...s, [k]: v }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: simpan ke backend
    onClose();
  };

  const d = delta(form.storePrice, form.marketPrice);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      {/* Identitas */}
      <InputLabelField
        id="inv-name"
        label="Nama Barang"
        value={form.name}
        onChange={(e) => set("name", e.target.value)}
        placeholder="Contoh: RAM DDR4 16GB"
        disabled={readOnly}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <InputLabelField
          id="inv-sku"
          label="SKU"
          value={form.sku ?? ""}
          onChange={(e) => set("sku", e.target.value)}
          placeholder="SKU internal (opsional)"
          disabled={readOnly}
        />
        <SelectLabelField
          id="inv-category"
          label="Kategori"
          value={form.category ?? "other"}
          onChange={(e) => set("category", e.target.value)}
          disabled={readOnly}
          options={[
            { value: "cpu", label: "CPU" },
            { value: "gpu", label: "GPU" },
            { value: "motherboard", label: "Motherboard" },
            { value: "ram", label: "RAM" },
            { value: "storage", label: "Storage" },
            { value: "psu", label: "PSU" },
            { value: "case", label: "Case" },
            { value: "cooler", label: "Cooler" },
            { value: "peripheral", label: "Peripheral" },
            { value: "other", label: "Lainnya" },
          ]}
        />
        <SelectLabelField
          id="inv-unit"
          label="Satuan"
          value={form.unit ?? "pcs"}
          onChange={(e) => set("unit", e.target.value)}
          disabled={readOnly}
          options={[
            { value: "pcs", label: "pcs" },
            { value: "set", label: "set" },
            { value: "unit", label: "unit" },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <InputLabelField
          id="inv-stock"
          label="Stok"
          type="number"
          value={String(form.stock ?? "")}
          onChange={(e) => set("stock", toNumber(e.target.value) ?? 0)}
          placeholder="0"
          disabled={readOnly}
        />
        <InputLabelField
          id="inv-store-price"
          label="Harga Toko"
          type="number"
          value={String(form.storePrice ?? "")}
          onChange={(e) => set("storePrice", toNumber(e.target.value) ?? 0)}
          placeholder="0"
          disabled={readOnly}
        />
        <InputLabelField
          id="inv-market-price"
          label={
            <span className="inline-flex items-center gap-2">
              Harga Market
              <PriceDeltaBadge delta={d ?? undefined} />
            </span>
          }
          type="number"
          value={String(form.marketPrice ?? "")}
          onChange={(e) => set("marketPrice", toNumber(e.target.value))}
          placeholder="0 (opsional)"
          disabled={readOnly}
          note={
            form.marketPrice
              ? `Δ ≈ ${
                  d !== null ? (d! > 0 ? "+" : "") + d!.toFixed(1) + "%" : "—"
                }`
              : undefined
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <InputLabelField
          id="inv-market-src"
          label="Sumber Market"
          value={form.marketSource ?? ""}
          onChange={(e) => set("marketSource", e.target.value)}
          placeholder="Tokopedia / Shopee / BL / dll."
          disabled={readOnly}
        />
        <InputLabelField
          id="inv-market-checked"
          label="Tanggal Cek Market"
          type="date"
          value={form.marketCheckedAt ?? ""}
          onChange={(e) => set("marketCheckedAt", e.target.value)}
          disabled={readOnly}
        />
      </div>

      {/* Actions */}
      <div className="mt-2 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-black bg-white hover:bg-black hover:text-white transition"
        >
          Close
        </button>
        {type !== "read" && (
          <button
            type="submit"
            className="px-4 py-2 border border-black bg-black text-white hover:bg-white hover:text-black transition"
          >
            {type === "create" ? "Save" : "Save Changes"}
          </button>
        )}
      </div>
    </form>
  );
}
