"use client";
import * as React from "react";

export type CheckboxWithLabelProps = {
  id: string;
  label: React.ReactNode;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  disabled?: boolean;
  indeterminate?: boolean;
  labelPosition?: "left" | "right";
  className?: string;
  labelClassName?: string;
  controlClassName?: string;
};

export default function CheckboxWithLabel({
  id,
  label,
  checked,
  onChange,
  name,
  disabled,
  indeterminate = false,
  labelPosition = "right",
  className = "inline-flex select-none items-center gap-2 cursor-pointer",
  labelClassName = "text-sm text-[var(--mono-fg)]",
  controlClassName = "",
}: CheckboxWithLabelProps) {
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = !!indeterminate && !checked;
    }
  }, [indeterminate, checked]);

  const wrapperCls = [
    className,
    disabled
      ? "opacity-60 cursor-not-allowed"
      : "hover:opacity-90 transition duration-200",
  ]
    .filter(Boolean)
    .join(" ");

  const controlCls = [
    "h-4 w-4 rounded-[2px] border border-[var(--mono-border)] bg-mono-bg",
    "accent-[var(--mono-fg)]",
    "transition duration-200 hover:ring-1 hover:ring-[var(--mono-fg)]",
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--mono-fg)]",
    "active:scale-95",
    disabled ? "pointer-events-none" : "",
    controlClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const Text = <span className={labelClassName}>{label}</span>;
  const Box = (
    <input
      ref={ref}
      id={id}
      name={name}
      type="checkbox"
      className={controlCls}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      aria-checked={indeterminate ? "mixed" : checked}
      aria-labelledby={`${id}-label`}
    />
  );

  return (
    <label htmlFor={id} className={wrapperCls}>
      {labelPosition === "left" ? (
        <>
          <span id={`${id}-label`} className={labelClassName}>
            {label}
          </span>
          {Box}
        </>
      ) : (
        <>
          {Box}
          <span id={`${id}-label`} className={labelClassName}>
            {label}
          </span>
        </>
      )}
    </label>
  );
}
