"use client";

import * as React from "react";
import SelectLabelField from "./fields/SelectLabelField";
import InputLabelField from "./fields/InputLabelField";

type Mode = "create" | "read" | "update";

export type AdjustStockFormProps = {
  type: Mode; // gunakan "update" dari FormModal
  data?: { id?: string; name?: string; unit?: string; stockQty?: number };
  onClose: () => void;
};

type AdjType = "IN" | "OUT" | "CORRECTION";

export default function AdjustStockForm({
  type,
  data,
  onClose,
}: AdjustStockFormProps) {
  const readOnly = type === "read";
  const [form, setForm] = React.useState({
    adjType: "IN" as AdjType,
    quantity: "",
    reason: "",
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: kirim ke backend
    onClose();
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      {/* Context item (readonly info) */}
      {data?.id && (
        <div className="border border-black p-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-medium">{data.name ?? "-"}</span>
            <span className="opacity-70">ID: {data.id}</span>
          </div>
          <div className="mt-1 opacity-70">
            Stok saat ini: {data.stockQty ?? 0} {data.unit ?? "pcs"}
          </div>
        </div>
      )}

      <SelectLabelField
        id="adjType"
        label="Jenis Penyesuaian"
        value={form.adjType}
        onChange={(e) =>
          setForm((s) => ({ ...s, adjType: e.target.value as AdjType }))
        }
        options={[
          { value: "IN", label: "Masuk (IN)" },
          { value: "OUT", label: "Keluar (OUT)" },
          { value: "CORRECTION", label: "Koreksi" },
        ]}
        disabled={readOnly}
      />

      <InputLabelField
        id="quantity"
        label="Jumlah"
        type="number"
        value={form.quantity}
        onChange={(e) => setForm((s) => ({ ...s, quantity: e.target.value }))}
        placeholder="0"
        required
        disabled={readOnly}
      />

      <InputLabelField
        id="reason"
        label="Alasan"
        value={form.reason}
        onChange={(e) => setForm((s) => ({ ...s, reason: e.target.value }))}
        placeholder="Contoh: penerimaan barang, pemakaian servis, koreksi stok…"
        disabled={readOnly}
      />

      <div className="mt-2 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-black bg-white hover:bg-black hover:text-white transition"
        >
          Batal
        </button>
        {type !== "read" && (
          <button
            type="submit"
            className="px-4 py-2 border border-black bg-black text-white hover:bg-white hover:text-black transition"
          >
            Simpan
          </button>
        )}
      </div>
    </form>
  );
}
