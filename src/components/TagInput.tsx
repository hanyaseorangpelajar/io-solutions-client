"use client";

import * as React from "react";

type TagInputProps = {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
};

const base =
  "w-full min-h-[2.25rem] border border-black bg-white rounded-none " +
  "px-2 py-1 flex flex-wrap items-center gap-1";

export default function TagInput({
  value,
  onChange,
  placeholder = "Tambah tag…",
  id,
  disabled,
  className = "",
}: TagInputProps) {
  const [text, setText] = React.useState("");

  const add = (t: string) => {
    const tag = t.trim().toLowerCase();
    if (!tag) return;
    if (value.includes(tag)) return;
    onChange([...value, tag]);
    setText("");
  };

  const remove = (t: string) => {
    onChange(value.filter((v) => v !== t));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(text);
    } else if (e.key === "Backspace" && !text) {
      // hapus terakhir
      remove(value[value.length - 1]);
    }
  };

  return (
    <div className={`${base} ${className}`} aria-disabled={disabled}>
      {value.map((t) => (
        <span
          key={t}
          className="inline-flex items-center gap-1 border border-black bg-white px-2 py-0.5 text-[10px]"
        >
          #{t}
          {!disabled && (
            <button
              type="button"
              className="leading-none px-1 border border-black bg-white hover:bg-black hover:text-white transition"
              onClick={() => remove(t)}
              aria-label={`Hapus ${t}`}
            >
              ×
            </button>
          )}
        </span>
      ))}
      <input
        id={id}
        disabled={disabled}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="flex-1 min-w-[120px] bg-transparent outline-none text-sm placeholder:text-black/40 px-1 py-1"
      />
    </div>
  );
}
