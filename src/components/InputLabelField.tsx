// src/components/InputLabelField.tsx
"use client";

import * as React from "react";

type CommonProps = {
  id: string;
  label: React.ReactNode;

  value: string | number; // <-- izinkan number
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;

  onBlur?: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  name?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];

  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  note?: React.ReactNode;

  className?: string; // wrapper <div>
  labelClassName?: string; // label
  controlClassName?: string; // input/textarea
};

// Semua atribut native <input> yang boleh ikut (min, max, step, pattern, dsb)
type NativeInputExtras = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  | "id"
  | "name"
  | "value"
  | "onChange"
  | "onBlur"
  | "disabled"
  | "required"
  | "placeholder"
  | "className"
  | "type"
>;

type InputOnly = {
  type?: React.HTMLInputTypeAttribute; // default "text"
  multiline?: false;
  rows?: never;
} & NativeInputExtras;

type TextareaOnly = {
  type?: never;
  multiline: true;
  rows?: number; // default 4
  // (kalau perlu, bisa ditambah textarea props lain)
};

export type InputLabelFieldProps = CommonProps & (InputOnly | TextareaOnly);

const baseLabel = "text-xs uppercase tracking-widest text-black/70";
const baseControl =
  "w-full border border-black bg-white px-3 py-2 rounded-none outline-none placeholder:text-black/40";

export default function InputLabelField(props: InputLabelFieldProps) {
  const {
    id,
    label,
    value,
    onChange,
    onBlur,
    name,
    autoComplete,
    inputMode,
    placeholder,
    disabled,
    required,
    note,
    className = "flex flex-col gap-1",
    labelClassName,
    controlClassName,
    ...rest
  } = props as any;

  const isTextarea = (rest as TextareaOnly)?.multiline === true;
  const disabledCls = disabled ? "opacity-70 cursor-not-allowed" : "";

  return (
    <div className={className}>
      <label htmlFor={id} className={`${baseLabel} ${labelClassName || ""}`}>
        {label}
      </label>

      {isTextarea ? (
        <textarea
          id={id}
          name={name}
          value={String(value ?? "")}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={(rest as TextareaOnly).rows ?? 4}
          className={`${baseControl} ${disabledCls} ${controlClassName || ""}`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={(rest as InputOnly).type ?? "text"}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          inputMode={inputMode}
          // Penting: hanya spread saat mode input agar prop textarea (multiline/rows) tak ikut
          {...(rest as InputOnly)}
          className={`${baseControl} ${disabledCls} ${controlClassName || ""}`}
        />
      )}

      {note ? <p className="text-[10px] text-black/60 mt-1">{note}</p> : null}
    </div>
  );
}
