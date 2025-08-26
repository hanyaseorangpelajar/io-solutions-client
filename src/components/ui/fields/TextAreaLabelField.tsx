"use client";

import * as React from "react";

export type TextAreaLabelFieldProps = {
  id: string;
  label: React.ReactNode;

  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;

  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  name?: string;
  maxLength?: number;

  note?: React.ReactNode;

  /** styling hooks */
  className?: string; // wrapper <div>
  labelClassName?: string; // <label>
  textareaClassName?: string; // <textarea>
};

const baseLabel = "text-xs uppercase tracking-widest text-[var(--mono-label)]";

const baseArea =
  "w-full border border-[var(--mono-border)] bg-[var(--mono-bg)] text-[var(--mono-fg)] " +
  "px-3 py-2 rounded-none outline-none";

const disabledCls = "opacity-70 cursor-not-allowed";

export default function TextAreaLabelField({
  id,
  label,
  value,
  onChange,
  placeholder,
  disabled,
  required,
  rows = 4,
  name,
  maxLength,
  note,
  className = "flex flex-col gap-1",
  labelClassName,
  textareaClassName,
}: TextAreaLabelFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className={`${baseLabel} ${labelClassName || ""}`}>
        {label}
      </label>

      <textarea
        id={id}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        className={`${baseArea} ${disabled ? disabledCls : ""} ${
          textareaClassName || ""
        }`}
      />

      {note ? (
        <p className="text-[10px] text-[var(--mono-muted)] mt-1">{note}</p>
      ) : null}
    </div>
  );
}
