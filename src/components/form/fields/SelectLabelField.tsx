"use client";

import * as React from "react";

type Option = { value: string; label: string };

type SelectLabelFieldProps = {
  id: string;
  label: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  disabled?: boolean;
  required?: boolean;
  placeholderOption?: string; // opsional, mis. "Pilih kategori…"
  className?: string; // wrapper <div>
  labelClassName?: string;
  selectClassName?: string;
};

const baseLabel = "text-xs uppercase tracking-widest text-black/70";
const baseSelect =
  "w-full border border-black bg-white px-3 py-2 rounded-none outline-none";

export default function SelectLabelField({
  id,
  label,
  value,
  onChange,
  options,
  disabled,
  required,
  placeholderOption,
  className = "flex flex-col gap-1",
  labelClassName,
  selectClassName,
}: SelectLabelFieldProps) {
  const disabledCls = disabled ? "opacity-70 cursor-not-allowed" : "";

  return (
    <div className={className}>
      <label htmlFor={id} className={`${baseLabel} ${labelClassName || ""}`}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`${baseSelect} ${disabledCls} ${selectClassName || ""}`}
      >
        {placeholderOption ? (
          <option value="" disabled>
            {placeholderOption}
          </option>
        ) : null}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
