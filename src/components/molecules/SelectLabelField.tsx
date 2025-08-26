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
  /** applied to the underlying <select> */
  selectClassName?: string;

  /** pass-through extra select attrs */
  controlProps?: Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    "id" | "value" | "onChange" | "className" | "name" | "required" | "disabled"
  >;
};

/** Reuse global atoms: `.label`, `.input`, `.field-note` from globals.css */
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
  const noteId = note ? `${id}-note` : undefined;

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className={["label", labelClassName].filter(Boolean).join(" ")}
      >
        {label}
      </label>

      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        aria-describedby={noteId}
        className={[
          "input",
          "transition duration-200 focus-visible:ring-1 focus-visible:ring-[var(--mono-fg)]",
          disabled ? "opacity-70 cursor-not-allowed" : "",
          selectClassName,
        ]
          .filter(Boolean)
          .join(" ")}
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
        <p id={noteId} className="field-note">
          {note}
        </p>
      ) : null}
    </div>
  );
}
