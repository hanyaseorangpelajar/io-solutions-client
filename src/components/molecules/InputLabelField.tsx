"use client";

import * as React from "react";

type BaseProps = {
  id: string;
  label: React.ReactNode;

  /** string atau number */
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

/** Reuse atoms/util classes dari globals.css: .label, .input, .field-note */
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

  const noteId = note ? `${id}-note` : undefined;

  const baseControl =
    "input transition duration-200 focus-visible:ring-1 focus-visible:ring-[var(--mono-fg)] disabled:opacity-70 disabled:cursor-not-allowed";

  const isTextarea = (props as TextareaOnlyProps).multiline === true;

  if (isTextarea) {
    const { rows = 4, controlProps } = props as TextareaOnlyProps;

    return (
      <div className={className}>
        <label
          htmlFor={id}
          className={["label", labelClassName].filter(Boolean).join(" ")}
        >
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
          aria-describedby={noteId}
          className={[baseControl, controlClassName].filter(Boolean).join(" ")}
          {...controlProps}
        />
        {note ? (
          <p id={noteId} className="field-note">
            {note}
          </p>
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
      <label
        htmlFor={id}
        className={["label", labelClassName].filter(Boolean).join(" ")}
      >
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
        aria-describedby={noteId}
        className={[baseControl, controlClassName].filter(Boolean).join(" ")}
        {...controlProps}
      />
      {note ? (
        <p id={noteId} className="field-note">
          {note}
        </p>
      ) : null}
    </div>
  );
}
