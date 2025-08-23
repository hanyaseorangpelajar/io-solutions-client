"use client";

import * as React from "react";

export type CheckboxLabelProps = {
  id?: string;
  label: React.ReactNode;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
};

export default function CheckboxLabel({
  id,
  label,
  checked,
  onChange,
  disabled,
  className = "",
}: CheckboxLabelProps) {
  return (
    <label className={`inline-flex items-center gap-2 ${className}`}>
      <input
        id={id}
        type="checkbox"
        className="appearance-none size-4 border border-black checked:bg-black disabled:opacity-60"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <span className="text-sm">{label}</span>
    </label>
  );
}
