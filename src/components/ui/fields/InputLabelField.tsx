"use client";

import * as React from "react";

/** ====== PROPS ====== */
type CommonProps = {
  id: string;
  label: React.ReactNode;

  /** IZINKAN string | number agar aman untuk input number/date */
  value: string | number;
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

  /** Wrapper & element classes */
  className?: string; // wrapper <div>
  labelClassName?: string; // <label>
  controlClassName?: string; // <input>/<textarea>
};

type InputOnly = {
  type?: React.HTMLInputTypeAttribute; // default: "text"
  multiline?: false;
  rows?: never;

  /** Tambahkan agar tidak error saat pakai number input */
  min?: number;
  max?: number;
  step?: number;
};

type TextareaOnly = {
  type?: never;
  multiline: true;
  rows?: number; // default: 4
};

export type InputLabelFieldProps = CommonProps & (InputOnly | TextareaOnly);

/** ====== STYLES (monochrome tokens) ====== */
const baseLabel = "text-xs uppercase tracking-widest text-[var(--mono-label)]";
const baseControl =
  "w-full border border-[var(--mono-border)] bg-[var(--mono-bg)] text-[var(--mono-fg)] " +
  "px-3 py-2 rounded-none outline-none placeholder:text-[var(--mono-ph)]";
const disabledCls = "opacity-70 cursor-not-allowed";

/** ====== COMPONENT ====== */
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
  } = props as InputLabelFieldProps;

  const isTextarea = (rest as TextareaOnly).multiline === true;

  return (
    <div className={className}>
      <label htmlFor={id} className={`${baseLabel} ${labelClassName || ""}`}>
        {label}
      </label>

      {isTextarea ? (
        <textarea
          id={id}
          name={name}
          value={value as string}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={(rest as TextareaOnly).rows ?? 4}
          className={`${baseControl} ${disabled ? disabledCls : ""} ${
            controlClassName || ""
          }`}
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
          /** number helpers (aman walau type bukan number) */
          min={(rest as InputOnly).min}
          max={(rest as InputOnly).max}
          step={(rest as InputOnly).step}
          className={`${baseControl} ${disabled ? disabledCls : ""} ${
            controlClassName || ""
          }`}
        />
      )}

      {note ? (
        <p className="text-[10px] text-[var(--mono-muted)] mt-1">{note}</p>
      ) : null}
    </div>
  );
}
