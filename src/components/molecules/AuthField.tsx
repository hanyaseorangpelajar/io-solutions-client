"use client";

import * as React from "react";
import type { ComponentType, SVGProps } from "react";

export type AuthFieldProps = {
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

  /** Optional left icon component (e.g. Heroicons) */
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  /** Optional right element (e.g. show/hide password button) */
  rightSlot?: React.ReactNode;

  /** Styling overrides */
  className?: string; // wrapper
  labelClassName?: string;
  inputClassName?: string;
  rightSlotClassName?: string;

  /** Helper / error text (only one shown; error has priority) */
  note?: string;
  error?: string;
};

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
  required = true,

  icon: Icon,
  rightSlot,

  className,
  labelClassName,
  inputClassName,
  rightSlotClassName,

  note,
  error,
}: AuthFieldProps) {
  // dynamic padding depending on left icon / right slot
  const pl = Icon ? "pl-8" : "pl-3";
  const pr = rightSlot ? "pr-10" : "pr-3";

  const describedBy = error ? `${id}-error` : note ? `${id}-note` : undefined;

  return (
    <label
      htmlFor={id}
      className={["block w-full text-sm", className].filter(Boolean).join(" ")}
    >
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
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={[
            // base input util dari globals.css + tinggi auth
            "input h-9",
            // focus & motion
            "transition duration-200 focus-visible:ring-1 focus-visible:ring-[var(--mono-fg)]",
            // dynamic paddings
            pl,
            pr,
            // error state: tonjolkan ring
            error ? "ring-1 ring-[var(--mono-fg)]" : "",
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

      {error ? (
        <p id={`${id}-error`} className="text-[10px] mt-1">
          {error}
        </p>
      ) : note ? (
        <p id={`${id}-note`} className="field-note">
          {note}
        </p>
      ) : null}
    </label>
  );
}
