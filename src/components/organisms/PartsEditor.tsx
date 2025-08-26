"use client";

import * as React from "react";
import InputLabelField from "@/components/molecules/InputLabelField";
import MonoButton from "@/components/atoms/MonoButton";

export type Part = { name: string; qty: number; unitCost?: number };

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
      } as Part;
      onChange(next);
    };

  const add = () => onChange([...(parts || []), { name: "", qty: 1 }]);
  const remove = (idx: number) => onChange(parts.filter((_, i) => i !== idx));

  return (
    <div className={`flex flex-col gap-3 ${className ?? ""}`}>
      {parts.map((p, idx) => (
        <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-2">
          <InputLabelField
            id={`part-name-${idx}`}
            label="Nama Suku Cadang"
            value={p.name ?? ""}
            onChange={update(idx, "name")}
            placeholder="Mis. Keyboard ASUS K456"
            disabled={disabled}
            className="md:col-span-3"
          />

          <InputLabelField
            id={`part-qty-${idx}`}
            label="Jumlah"
            value={p.qty === undefined ? "" : String(p.qty)}
            onChange={update(idx, "qty")}
            placeholder="Qty"
            disabled={disabled}
            type="number"
            min={1}
          />

          <div className="flex gap-2">
            <InputLabelField
              id={`part-cost-${idx}`}
              label="Biaya/Unit"
              value={p.unitCost === undefined ? "" : String(p.unitCost)}
              onChange={update(idx, "unitCost")}
              placeholder="0"
              disabled={disabled}
              className="flex-1"
              type="number"
              min={0}
              step={0.01}
            />
            <MonoButton
              type="button"
              onClick={() => remove(idx)}
              variant="ghost"
              size="sm"
              aria-label="Hapus suku cadang"
              disabled={disabled}
              className="px-3 py-1.5"
            >
              −
            </MonoButton>
          </div>
        </div>
      ))}

      <MonoButton
        type="button"
        onClick={add}
        variant="solid"
        size="md"
        disabled={disabled}
        className="w-fit"
      >
        + Tambah Suku Cadang
      </MonoButton>
    </div>
  );
}
