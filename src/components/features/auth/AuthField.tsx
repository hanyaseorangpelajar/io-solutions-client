// src/components/auth/AuthField.tsx
"use client";

import * as React from "react";
import type { ComponentType, SVGProps } from "react";

type AuthFieldProps = {
  id: string;
  label: React.ReactNode;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  name?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  disabled?: boolean;
  required?: boolean;

  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  rightSlot?: React.ReactNode; // misal tombol show/hide password

  // styling overrides (opsional)
  className?: string; // wrapper <label>
  labelClassName?: string; // teks label
  inputClassName?: string; // elemen <input>
  rightSlotClassName?: string;
  note?: React.ReactNode; // teks kecil di bawah input
  error?: string; // pesan error singkat
};

const baseInput =
  "w-full h-9 rounded-none border outline-none " +
  "border-[var(--mono-border)] bg-[var(--mono-bg)] text-[var(--mono-fg)] " +
  "placeholder-[color:var(--mono-ph)] " +
  "focus:ring-2 focus:ring-[var(--mono-fg)] focus:ring-offset-2 focus:ring-offset-[var(--mono-bg)] " +
  "disabled:opacity-70 disabled:cursor-not-allowed";

export default function AuthField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  defaultValue,
  onChange,
  onBlur,
  autoComplete,
  name,
  inputMode,
  disabled,
  required = true, // auth biasanya required
  icon: Icon,
  rightSlot,
  className,
  labelClassName,
  inputClassName,
  rightSlotClassName,
  note,
  error,
}: AuthFieldProps) {
  // padding dinamis tergantung keberadaan icon/rightSlot
  const pl = Icon ? "pl-8" : "pl-3";
  const pr = rightSlot ? "pr-10" : "pr-3";

  const describedBy = error ? `${id}-error` : note ? `${id}-note` : undefined;

  return (
    <label className={["text-sm w-full", className].filter(Boolean).join(" ")}>
      <span
        className={["mb-1 block text-[var(--mono-label)]", labelClassName]
          .filter(Boolean)
          .join(" ")}
      >
        {label}
      </span>

      <div className="relative">
        {Icon && (
          <span className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon
              className="w-4 h-4 text-[var(--mono-muted)]"
              aria-hidden="true"
            />
          </span>
        )}

        <input
          id={id}
          name={name ?? id}
          type={type}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete={autoComplete}
          inputMode={inputMode}
          disabled={disabled}
          required={required}
          aria-invalid={!!error || undefined}
          aria-describedby={describedBy}
          className={[
            baseInput,
            pl,
            pr,
            error ? "ring-2 ring-offset-2 ring-[var(--mono-fg)]" : "",
            inputClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        />

        {rightSlot && (
          <span
            className={[
              "absolute right-2 top-1/2 -translate-y-1/2",
              rightSlotClassName,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {rightSlot}
          </span>
        )}
      </div>

      {note && !error && (
        <p
          id={`${id}-note`}
          className="text-[10px] text-[var(--mono-muted)] mt-1"
        >
          {note}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-[10px] mt-1">
          {error}
        </p>
      )}
    </label>
  );
}
