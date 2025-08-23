"use client";

import * as React from "react";
import TagInput from "@/components/TagInput";

export type TagsLabelFieldProps = {
  id: string;
  label: string;
  value: string[];
  onChange: (vals: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  note?: React.ReactNode;
  className?: string; // wrapper
  labelClassName?: string;
  inputClassName?: string; // jika butuh custom style TagInput
};

const baseLabel = "text-xs uppercase tracking-widest text-black/70";

export default function TagsLabelField({
  id,
  label,
  value,
  onChange,
  placeholder,
  disabled,
  note,
  className = "",
  labelClassName = "",
  inputClassName = "",
}: TagsLabelFieldProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={id} className={`${baseLabel} ${labelClassName}`}>
        {label}
      </label>
      <TagInput
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={inputClassName}
      />
      {note ? <p className="text-[10px] text-black/60 mt-1">{note}</p> : null}
    </div>
  );
}
