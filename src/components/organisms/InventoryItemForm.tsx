// src/components/forms/InventoryItemForm.tsx
"use client";

import * as React from "react";
import InputLabelField from "@/components/molecules/InputLabelField";
import SelectLabelField from "@/components/molecules/SelectLabelField";
import FormRow from "@/components/molecules/FormRow";
import FormActions from "@/components/molecules/FormActions";

type Mode = "create" | "read" | "update";

export type InventoryItemShape = {
  id?: string;
  name?: string;
  category?: string;
  location?: string;
  unit?: string; // pcs/box/unit
  stockQty?: number;
  minStock?: number;
  cost?: number;
  supplier?: string;
  lastUpdated?: string; // YYYY-MM-DD
};

export type InventoryItemFormProps = {
  type: Mode;
  data?: InventoryItemShape;
  onClose: () => void;
};

export default function InventoryItemForm({
  type,
  data,
  onClose,
}: InventoryItemFormProps) {
  const readOnly = type === "read";

  // keep numerics as string for controlled inputs
  const [form, setForm] = React.useState({
    id: data?.id ?? "",
    name: data?.name ?? "",
    category: data?.category ?? "Sparepart",
    location: data?.location ?? "",
    unit: data?.unit ?? "pcs",
    stockQty: data?.stockQty != null ? String(data.stockQty) : "",
    minStock: data?.minStock != null ? String(data.minStock) : "",
    cost: data?.cost != null ? String(data.cost) : "",
    supplier: data?.supplier ?? "",
    lastUpdated: data?.lastUpdated ?? "",
  });

  React.useEffect(() => {
    setForm({
      id: data?.id ?? "",
      name: data?.name ?? "",
      category: data?.category ?? "Sparepart",
      location: data?.location ?? "",
      unit: data?.unit ?? "pcs",
      stockQty: data?.stockQty != null ? String(data.stockQty) : "",
      minStock: data?.minStock != null ? String(data.minStock) : "",
      cost: data?.cost != null ? String(data.cost) : "",
      supplier: data?.supplier ?? "",
      lastUpdated: data?.lastUpdated ?? "",
    });
  }, [data]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: submit ke backend — parse numeric strings bila diperlukan
    onClose();
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <InputLabelField
        id="inv-id"
        label="Kode / SKU"
        value={form.id}
        onChange={(e) => setForm((s) => ({ ...s, id: e.target.value }))}
        placeholder="Contoh: SKU-ACM-0001"
        disabled={readOnly}
        required
      />

      <InputLabelField
        id="inv-name"
        label="Nama Item"
        value={form.name}
        onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
        placeholder="Nama barang…"
        disabled={readOnly}
        required
      />

      <FormRow>
        <SelectLabelField
          id="inv-category"
          label="Kategori"
          value={form.category}
          onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
          options={[
            { value: "Sparepart", label: "Sparepart" },
            { value: "Consumable", label: "Consumable" },
            { value: "Storage", label: "Storage" },
            { value: "Peripheral", label: "Peripheral" },
            { value: "Lainnya", label: "Lainnya" },
          ]}
          disabled={readOnly}
        />
        <InputLabelField
          id="inv-location"
          label="Lokasi"
          value={form.location}
          onChange={(e) => setForm((s) => ({ ...s, location: e.target.value }))}
          placeholder="Mis. R1-A3 / Rak 2"
          disabled={readOnly}
        />
      </FormRow>

      <FormRow cols={3}>
        <InputLabelField
          id="inv-stock"
          label="Stok"
          type="number"
          value={form.stockQty}
          onChange={(e) => setForm((s) => ({ ...s, stockQty: e.target.value }))}
          placeholder="0"
          disabled={readOnly}
        />
        <InputLabelField
          id="inv-min"
          label="Minimum Stok"
          type="number"
          value={form.minStock}
          onChange={(e) => setForm((s) => ({ ...s, minStock: e.target.value }))}
          placeholder="0"
          disabled={readOnly}
        />
        <SelectLabelField
          id="inv-unit"
          label="Satuan"
          value={form.unit}
          onChange={(e) => setForm((s) => ({ ...s, unit: e.target.value }))}
          options={[
            { value: "pcs", label: "pcs" },
            { value: "unit", label: "unit" },
            { value: "box", label: "box" },
          ]}
          disabled={readOnly}
        />
      </FormRow>

      <FormRow cols={3}>
        <InputLabelField
          id="inv-cost"
          label="Harga Pokok (ops.)"
          type="number"
          value={form.cost}
          onChange={(e) => setForm((s) => ({ ...s, cost: e.target.value }))}
          placeholder="0"
          disabled={readOnly}
        />
        <InputLabelField
          id="inv-supplier"
          label="Pemasok (ops.)"
          value={form.supplier}
          onChange={(e) => setForm((s) => ({ ...s, supplier: e.target.value }))}
          placeholder="Nama pemasok"
          disabled={readOnly}
        />
        <InputLabelField
          id="inv-updated"
          label="Tanggal Update"
          type="date"
          value={form.lastUpdated}
          onChange={(e) =>
            setForm((s) => ({ ...s, lastUpdated: e.target.value }))
          }
          disabled={readOnly}
        />
      </FormRow>

      <FormActions mode={type} onCancel={onClose} />
    </form>
  );
}
