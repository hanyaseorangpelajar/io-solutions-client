// src/components/auth/AuthField.tsx
"use client";

import type { ComponentType, SVGProps } from "react";

type AuthFieldProps = {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  rightSlot?: React.ReactNode; // misal tombol show/hide password
};

const inputCls =
  "w-full h-9 rounded-none border border-black bg-white px-8 pr-10 outline-none placeholder:text-black/40";

export default function AuthField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  autoComplete,
  icon: Icon,
  rightSlot,
}: AuthFieldProps) {
  return (
    <label className="text-sm w-full">
      <span className="mb-1 block">{label}</span>
      <div className="relative">
        {Icon && (
          <span className="absolute left-2 top-1/2 -translate-y-1/2">
            <Icon className="w-4 h-4 text-black/60" />
          </span>
        )}
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className={inputCls}
          required
        />
        {rightSlot && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2">
            {rightSlot}
          </span>
        )}
      </div>
    </label>
  );
}
