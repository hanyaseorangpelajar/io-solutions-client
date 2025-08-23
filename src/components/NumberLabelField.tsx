// src/components/NumberLabelField.tsx
"use client";

import * as React from "react";
import { mono } from "./uiTokens";

export type NumberLabelFieldProps = {
  id: string;
  label: string;
  value: number | "" | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  note?: React.ReactNode;
  containerClassName?: string;
};

export default function NumberLabelField({
  id,
  label,
  value,
  onChange,
  placeholder,
  disabled,
  min,
  max,
  step,
  note,
  containerClassName = "",
}: NumberLabelFieldProps) {
  return (
    <div className={containerClassName}>
      <label htmlFor={id} className={mono.label}>
        {label}
      </label>
      <input
        id={id}
        type="number"
        className={mono.control}
        value={value === undefined ? "" : value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
      />
      {note ? <p className={mono.note}>{note}</p> : null}
    </div>
  );
}
