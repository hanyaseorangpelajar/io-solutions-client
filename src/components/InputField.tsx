// src/components/InputField.tsx
"use client";

import type {
  FieldError,
  UseFormRegister,
  RegisterOptions,
} from "react-hook-form";
import type { ComponentType, SVGProps } from "react";

type IconComp = ComponentType<SVGProps<SVGSVGElement>>;

type CommonProps = {
  name: string;
  id?: string; // optional override untuk htmlFor/id
  label?: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  defaultValue?: string | number;
  helperText?: string;
  autoComplete?: string; // <-- DITAMBAHKAN
  containerClassName?: string;
  inputClassName?: string;
  leftIcon?: IconComp;
  rightSlot?: React.ReactNode; // tombol/ikon kanan (mis. toggle password)
  as?: "input" | "textarea";
  rows?: number;
  required?: boolean;
  disabled?: boolean;
};

type RHFWithRegister = {
  register: UseFormRegister<any>;
  rules?: RegisterOptions;
  error?: FieldError;
  value?: never;
  onChange?: never;
};

type RHFControlled = {
  register?: never;
  rules?: never;
  error?: FieldError;
  value?: string | number;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
};

type InputFieldProps = CommonProps & (RHFWithRegister | RHFControlled);

const baseInput =
  "w-full h-9 rounded-none border border-black bg-white px-8 pr-10 outline-none placeholder:text-black/40 " +
  "disabled:opacity-60 disabled:cursor-not-allowed";
const baseTextarea =
  "w-full rounded-none border border-black bg-white px-8 pr-10 py-2 outline-none placeholder:text-black/40 " +
  "disabled:opacity-60 disabled:cursor-not-allowed";

export default function InputField({
  name,
  id,
  label,
  placeholder,
  type = "text",
  defaultValue,
  helperText,
  autoComplete, // <-- dipakai ke input
  containerClassName,
  inputClassName,
  leftIcon: LeftIcon,
  rightSlot,
  as = "input",
  rows = 4,
  required,
  disabled,
  // RHF / controlled
  register,
  rules,
  error,
  value,
  onChange,
}: InputFieldProps) {
  const isTextarea = as === "textarea";
  const hasError = !!error?.message;
  const htmlId = id ?? name;

  const Comp: any = isTextarea ? "textarea" : "input";

  // Props untuk RHF vs controlled
  const fieldProps = register
    ? { ...register(name, rules) }
    : { name, value, onChange, defaultValue };

  return (
    <div
      className={["flex flex-col gap-1 w-full", containerClassName].join(" ")}
    >
      {label && (
        <label
          htmlFor={htmlId}
          className="text-xs uppercase tracking-widest text-black/70"
        >
          {label} {required ? <span className="text-red-600">*</span> : null}
        </label>
      )}

      <div className="relative">
        {/* Left icon */}
        {LeftIcon && (
          <span className="absolute left-2 top-1/2 -translate-y-1/2">
            <LeftIcon className="w-4 h-4 text-black/60" aria-hidden="true" />
          </span>
        )}

        <Comp
          id={htmlId}
          aria-invalid={hasError ? "true" : "false"}
          placeholder={placeholder}
          type={isTextarea ? undefined : type}
          rows={isTextarea ? rows : undefined}
          autoComplete={autoComplete} // <-- disalurkan ke input
          className={[
            isTextarea ? baseTextarea : baseInput,
            hasError ? "border-red-600" : "",
            inputClassName || "",
            isTextarea ? "min-h-[2.5rem]" : "h-9",
          ].join(" ")}
          required={required}
          disabled={disabled}
          {...fieldProps}
        />

        {/* Right slot */}
        {rightSlot && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2">
            {rightSlot}
          </span>
        )}
      </div>

      {/* Helper & Error */}
      {helperText && !hasError && (
        <p className="text-[10px] text-black/60">{helperText}</p>
      )}
      {hasError && (
        <p role="alert" className="text-[11px] text-red-600">
          {String(error?.message)}
        </p>
      )}
    </div>
  );
}
