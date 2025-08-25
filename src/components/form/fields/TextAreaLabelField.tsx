"use client";

import * as React from "react";

export type TextAreaLabelFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  note?: React.ReactNode;
  className?: string; // wrapper
  labelClassName?: string;
  textareaClassName?: string;
};

const baseLabel = "text-xs uppercase tracking-widest text-black/70";
const baseArea =
  "w-full border border-black bg-white px-3 py-2 rounded-none outline-none placeholder:text-black/40";

export default function TextAreaLabelField({
  id,
  label,
  value,
  onChange,
  placeholder,
  disabled,
  required,
  rows = 3,
  note,
  className = "",
  labelClassName = "",
  textareaClassName = "",
}: TextAreaLabelFieldProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={id} className={`${baseLabel} ${labelClassName}`}>
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        className={`${baseArea} ${textareaClassName}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
      />
      {note ? <div className="text-[10px] text-black/60">{note}</div> : null}
    </div>
  );
}
