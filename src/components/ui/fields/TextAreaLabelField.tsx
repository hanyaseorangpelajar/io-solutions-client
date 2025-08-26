// src/components/ui/fields/TextAreaLabelField.tsx
"use client";

import * as React from "react";
import InputLabelField from "@/components/ui/fields/InputLabelField";

export type TextAreaLabelFieldProps = {
  id: string;
  label: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;

  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  note?: React.ReactNode;

  /** wrapper <div> */
  className?: string;
  /** label <label> */
  labelClassName?: string;
  /** will be applied to underlying <textarea> */
  textareaClassName?: string;

  /** pass-through extra textarea attrs (optional) */
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
    | "rows"
  >;
};

export default function TextAreaLabelField({
  id,
  label,
  value,
  onChange,
  placeholder,
  disabled,
  required,
  rows = 4,
  note,
  className,
  labelClassName,
  textareaClassName,
  controlProps,
}: TextAreaLabelFieldProps) {
  return (
    <InputLabelField
      id={id}
      label={label}
      value={value}
      onChange={onChange as any} // safe: underlying accepts textarea/input union
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      multiline
      rows={rows}
      note={note}
      className={className}
      labelClassName={labelClassName}
      controlClassName={textareaClassName}
      controlProps={controlProps}
    />
  );
}
