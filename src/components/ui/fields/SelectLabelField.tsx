// src/components/ui/fields/SelectLabelField.tsx
"use client";

import * as React from "react";

export type SelectOption = {
  value: string | number;
  label: React.ReactNode;
  disabled?: boolean;
};

export type SelectLabelFieldProps = {
  id: string;
  label: React.ReactNode;

  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;

  options: SelectOption[];

  placeholder?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  note?: React.ReactNode;

  /** wrapper <div> */
  className?: string;
  /** label <label> */
  labelClassName?: string;
  /** will be applied to the underlying <select> */
  selectClassName?: string;

  /** pass-through extra select attrs */
  controlProps?: Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    "id" | "value" | "onChange" | "className" | "name" | "required" | "disabled"
  >;
};

const baseLabel = "text-xs uppercase tracking-widest text-[var(--mono-label)]";
const baseControl =
  "w-full border border-[var(--mono-border)] bg-[var(--mono-bg)] text-[var(--mono-fg)] " +
  "px-3 py-2 rounded-none outline-none placeholder:text-[var(--mono-ph)]";

export default function SelectLabelField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  name,
  required,
  disabled,
  note,
  className = "flex flex-col gap-1",
  labelClassName,
  selectClassName,
  controlProps,
}: SelectLabelFieldProps) {
  const disabledCls = disabled ? "opacity-70 cursor-not-allowed" : "";

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
        required={required}
        disabled={disabled}
        className={`${baseControl} ${disabledCls} ${selectClassName || ""}`}
        {...controlProps}
      >
        {placeholder !== undefined && (
          <option value="" disabled={!!required}>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option
            key={String(opt.value)}
            value={opt.value}
            disabled={opt.disabled}
          >
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
