// src/components/PartsEditor.tsx
"use client";
import * as React from "react";
import InputLabelField from "@/components/ui/fields/InputLabelField";

export type Part = { name: string; qty: number; unitCost?: number };

// Izinkan dua bentuk props: {parts,...} ATAU {value,...}
type PropsValue = {
  value: Part[];
  onChange: (parts: Part[]) => void;
  disabled?: boolean;
  className?: string;
};
type PropsParts = {
  parts: Part[];
  onChange: (parts: Part[]) => void;
  disabled?: boolean;
  className?: string;
};
type Props = PropsValue | PropsParts;

export default function PartsEditor(props: Props) {
  const parts = "parts" in props ? props.parts : props.value;
  const { onChange, disabled, className } = props;

  const update =
    (idx: number, key: keyof Part) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const raw = e.target.value;
      const next = [...parts];
      next[idx] = {
        ...next[idx],
        [key]: key === "name" ? raw : raw === "" ? undefined : Number(raw),
      };
      onChange(next);
    };

  const add = () => onChange([...(parts || []), { name: "", qty: 1 }]);
  const remove = (idx: number) => onChange(parts.filter((_, i) => i !== idx));

  return (
    <div className={className}>
      {parts.map((p, idx) => (
        <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-2">
          <InputLabelField
            id={`part-name-${idx}`}
            label="Nama Suku Cadang"
            value={p.name}
            onChange={update(idx, "name")}
            placeholder="Mis. Keyboard ASUS K456"
            disabled={disabled}
            className="md:col-span-3"
          />
          <InputLabelField
            id={`part-qty-${idx}`}
            label="Jumlah"
            type="number"
            min={1}
            value={p.qty}
            onChange={update(idx, "qty")}
            placeholder="Qty"
            disabled={disabled}
          />
          <div className="flex gap-2">
            <InputLabelField
              id={`part-cost-${idx}`}
              label="Biaya/Unit"
              type="number"
              min={0}
              step={0.01}
              value={p.unitCost ?? ""}
              onChange={update(idx, "unitCost")}
              placeholder="0"
              disabled={disabled}
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => remove(idx)}
              className="px-3 py-2 border border-black bg-white hover:bg-black hover:text-white transition"
              aria-label="Hapus suku cadang"
              disabled={disabled}
            >
              −
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="px-3 py-2 border border-black bg-white hover:bg-black hover:text-white transition"
        disabled={disabled}
      >
        + Tambah Suku Cadang
      </button>
    </div>
  );
}
