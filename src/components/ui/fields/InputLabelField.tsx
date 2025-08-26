// src/components/ui/fields/InputLabelField.tsx
"use client";

import * as React from "react";

type BaseProps = {
  id: string;
  label: React.ReactNode;

  /** Boleh string atau number */
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

  /** wrapper <div> */
  className?: string;
  /** label <label> */
  labelClassName?: string;
  /** control <input>/<textarea> */
  controlClassName?: string;
};

type InputOnlyProps = {
  multiline?: false;
  type?: React.HTMLInputTypeAttribute; // default: "text"
  min?: number;
  max?: number;
  step?: number;
  rows?: never;

  /** atribut tambahan untuk <input> */
  controlProps?: Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    | "id"
    | "value"
    | "onChange"
    | "onBlur"
    | "className"
    | "type"
    | "min"
    | "max"
    | "step"
    | "name"
    | "placeholder"
    | "disabled"
    | "required"
    | "autoComplete"
    | "inputMode"
  >;
};

type TextareaOnlyProps = {
  multiline: true;
  rows?: number; // default 4
  type?: never;
  min?: never;
  max?: never;
  step?: never;

  /** atribut tambahan untuk <textarea> */
  controlProps?: Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    | "id"
    | "value"
    | "onChange"
    | "onBlur"
    | "className"
    | "name"
    | "placeholder"
    | "disabled"
    | "required"
  >;
};

export type InputLabelFieldProps = BaseProps &
  (InputOnlyProps | TextareaOnlyProps);

// tokens-based classes
const baseLabel = "text-xs uppercase tracking-widest text-[var(--mono-label)]";
const baseControl =
  "w-full border border-[var(--mono-border)] bg-[var(--mono-bg)] text-[var(--mono-fg)] " +
  "px-3 py-2 rounded-none outline-none placeholder:text-[var(--mono-ph)]";
const disabledCls = "opacity-70 cursor-not-allowed";

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
  } = props;

  const isTextarea = (props as TextareaOnlyProps).multiline === true;

  if (isTextarea) {
    const { rows = 4, controlProps } = props as TextareaOnlyProps;

    return (
      <div className={className}>
        <label htmlFor={id} className={`${baseLabel} ${labelClassName || ""}`}>
          {label}
        </label>
        <textarea
          id={id}
          name={name}
          value={value as string | number}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={rows}
          className={`${baseControl} ${disabled ? disabledCls : ""} ${
            controlClassName || ""
          }`}
          {...controlProps}
        />
        {note ? (
          <p className="text-[10px] text-[var(--mono-muted)] mt-1">{note}</p>
        ) : null}
      </div>
    );
  }

  // input mode
  const {
    type = "text",
    min,
    max,
    step,
    controlProps,
  } = props as InputOnlyProps;

  return (
    <div className={className}>
      <label htmlFor={id} className={`${baseLabel} ${labelClassName || ""}`}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        min={min}
        max={max}
        step={step}
        className={`${baseControl} ${disabled ? disabledCls : ""} ${
          controlClassName || ""
        }`}
        {...controlProps}
      />
      {note ? (
        <p className="text-[10px] text-[var(--mono-muted)] mt-1">{note}</p>
      ) : null}
    </div>
  );
}
