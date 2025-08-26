"use client";

import * as React from "react";

export type SelectOption = { value: string; label: React.ReactNode };

export type SelectLabelFieldProps = {
  id: string;
  label: React.ReactNode;

  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;

  options: SelectOption[];

  placeholder?: string; // ditampilkan sebagai opsi pertama (non-selectable jika required)
  disabled?: boolean;
  required?: boolean;
  name?: string;

  note?: React.ReactNode;

  /** styling hooks */
  className?: string; // wrapper <div>
  labelClassName?: string; // <label>
  selectClassName?: string; // <select>
};

const baseLabel = "text-xs uppercase tracking-widest text-[var(--mono-label)]";

const baseSelect =
  "w-full border border-[var(--mono-border)] bg-[var(--mono-bg)] text-[var(--mono-fg)] " +
  "px-3 py-2 rounded-none outline-none appearance-none";

const disabledCls = "opacity-70 cursor-not-allowed";

// optional: caret sederhana via background SVG (monochrome-friendly)
const caret =
  "bg-[right_0.5rem_center] bg-no-repeat pr-8 " +
  "[background-image:linear-gradient(45deg,transparent_50%,currentColor_50%)," +
  "linear-gradient(135deg,currentColor_50%,transparent_50%)," +
  "linear-gradient(to_right,transparent,transparent)] " +
  "bg-[length:6px_6px,6px_6px,1px_100%] " +
  "bg-[position:calc(100%-18px)_center,calc(100%-12px)_center,calc(100%-1.5rem)_center]";

export default function SelectLabelField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled,
  required,
  name,
  note,
  className = "flex flex-col gap-1",
  labelClassName,
  selectClassName,
}: SelectLabelFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className={`${baseLabel} ${labelClassName || ""}`}>
        {label}
      </label>

      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`${baseSelect} ${caret} ${disabled ? disabledCls : ""} ${
          selectClassName || ""
        }`}
      >
        {placeholder !== undefined && (
          <option value="" disabled={!!required} hidden={!!required}>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={String(opt.value)} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {note ? (
        <p className="text-[10px] text-[var(--mono-muted)] mt-1">{note}</p>
      ) : null}
    </div>
  );
}
