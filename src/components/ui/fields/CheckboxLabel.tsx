"use client";
import * as React from "react";

type Props = {
  id: string;
  label: React.ReactNode;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string; // wrapper
  labelClassName?: string; // text
  controlClassName?: string; // input
};

export default function CheckboxLabel({
  id,
  label,
  checked,
  onChange,
  disabled,
  className = "flex items-center gap-2",
  labelClassName = "text-sm text-[var(--mono-fg)]",
  controlClassName = "",
}: Props) {
  return (
    <label
      htmlFor={id}
      className={`${className} ${
        disabled ? "opacity-70 cursor-not-allowed" : ""
      }`}
    >
      <input
        id={id}
        type="checkbox"
        className={`appearance-none w-4 h-4 border border-[var(--mono-border)] bg-[var(--mono-bg)] checked:bg-[var(--mono-fg)] ${controlClassName}`}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <span className={labelClassName}>{label}</span>
    </label>
  );
}
