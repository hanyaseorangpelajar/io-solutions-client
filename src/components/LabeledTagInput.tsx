"use client";
import * as React from "react";
import TagInput from "@/components/TagInput";

type Props = {
  id: string;
  label: string;
  value: string[];
  onChange: (vals: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  note?: React.ReactNode;
  className?: string;
  labelClassName?: string;
};

const labelCls = "text-xs uppercase tracking-widest text-black/70";

export default function LabeledTagInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  disabled,
  note,
  className = "",
  labelClassName = "",
}: Props) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={id} className={`${labelCls} ${labelClassName}`}>
        {label}
      </label>
      <TagInput
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
      />
      {note ? <p className="text-[10px] text-black/60 mt-1">{note}</p> : null}
    </div>
  );
}
