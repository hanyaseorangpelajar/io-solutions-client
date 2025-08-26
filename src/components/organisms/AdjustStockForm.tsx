"use client";

import * as React from "react";
import SelectLabelField from "@/components/molecules/SelectLabelField";
import InputLabelField from "@/components/molecules/InputLabelField";
import FormRow from "@/components/molecules/FormRow";
import FormActions from "@/components/molecules/FormActions";

type Mode = "create" | "read" | "update";

export type AdjustStockFormProps = {
  type: Mode;
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
    onClose();
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      {/* Info konteks item */}
      {data?.id && (
        <div className="card p-3 text-xs transition duration-200">
          <div className="flex items-center justify-between">
            <span className="font-medium">{data.name ?? "-"}</span>
            <span className="text-[var(--mono-muted)]">ID: {data.id}</span>
          </div>
          <div className="mt-1 text-[var(--mono-muted)]">
            Stok saat ini: {data.stockQty ?? 0} {data.unit ?? "pcs"}
          </div>
        </div>
      )}

      {/* Fields */}
      <FormRow cols={2}>
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
      </FormRow>

      <InputLabelField
        id="reason"
        label="Alasan"
        value={form.reason}
        onChange={(e) => setForm((s) => ({ ...s, reason: e.target.value }))}
        placeholder="Contoh: penerimaan barang, pemakaian servis, koreksi stok…"
        disabled={readOnly}
        note="Jelaskan ringkas alasan penyesuaian."
      />

      {/* Actions */}
      <FormActions
        mode={type}
        onCancel={onClose}
        className="mt-2 flex items-center justify-end gap-2"
      />
    </form>
  );
}
