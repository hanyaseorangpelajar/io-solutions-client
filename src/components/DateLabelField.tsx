// src/components/DateLabelField.tsx
"use client";

import * as React from "react";
import { mono } from "./uiTokens";

export type DateLabelFieldProps = {
  id: string;
  label: string;
  value: string; // YYYY-MM-DD
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  note?: React.ReactNode;
  containerClassName?: string;
};

export default function DateLabelField({
  id,
  label,
  value,
  onChange,
  disabled,
  note,
  containerClassName = "",
}: DateLabelFieldProps) {
  return (
    <div className={containerClassName}>
      <label htmlFor={id} className={mono.label}>
        {label}
      </label>
      <input
        id={id}
        type="date"
        className={mono.control}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      {note ? <p className={mono.note}>{note}</p> : null}
    </div>
  );
}
