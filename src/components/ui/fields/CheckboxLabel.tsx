"use client";

import * as React from "react";

export type CheckboxLabelProps = {
  id: string;
  label: React.ReactNode;

  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  disabled?: boolean;
  required?: boolean;
  name?: string;

  note?: React.ReactNode;

  /** styling hooks */
  className?: string; // wrapper
  labelClassName?: string; // text label
  checkboxClassName?: string; // <input type="checkbox">
};

const baseLabel = "text-xs uppercase tracking-widest text-[var(--mono-label)]";

const baseCheckbox =
  "w-4 h-4 shrink-0 border border-[var(--mono-border)] rounded-none " +
  "bg-[var(--mono-bg)] text-[var(--mono-fg)] outline-none " +
  "appearance-none grid place-items-center " +
  "data-[checked=true]:bg-[var(--mono-fg)] data-[checked=true]:text-[var(--mono-bg)]";

const disabledCls = "opacity-70 cursor-not-allowed";

export default function CheckboxLabel({
  id,
  label,
  checked,
  onChange,
  disabled,
  required,
  name,
  note,
  className = "flex flex-col gap-1",
  labelClassName,
  checkboxClassName,
}: CheckboxLabelProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="flex items-center gap-2">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          required={required}
          aria-required={required}
          data-checked={checked ? "true" : "false"}
          className={`${baseCheckbox} ${disabled ? disabledCls : ""} ${
            checkboxClassName || ""
          }`}
        />
        <span className={`${baseLabel} ${labelClassName || ""}`}>{label}</span>
      </label>

      {note ? (
        <p className="text-[10px] text-[var(--mono-muted)] mt-1">{note}</p>
      ) : null}
    </div>
  );
}
