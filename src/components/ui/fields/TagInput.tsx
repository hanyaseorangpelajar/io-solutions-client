"use client";

import * as React from "react";

export type TagInputProps = {
  id: string;
  value: string[];
  onChange: (tags: string[]) => void;

  placeholder?: string;
  disabled?: boolean;

  /** Styling hooks */
  className?: string; // wrapper
  inputClassName?: string; // input
  chipClassName?: string; // chip

  /** Behavior */
  addOnBlur?: boolean; // default: true (tambahkan jika blur & ada teks)
  separators?: string[]; // default: [","] — Enter selalu menambahkan
};

const baseWrapper =
  "w-full border border-[var(--mono-border)] bg-[var(--mono-bg)] rounded-none px-2 py-2 " +
  "flex flex-wrap gap-1 items-center";

const baseInput =
  "flex-1 min-w-[120px] bg-transparent outline-none px-1 py-1 " +
  "placeholder:text-[var(--mono-ph)] text-[var(--mono-fg)]";

const baseChip =
  "inline-flex items-center gap-1 px-2 py-0.5 text-[10px] " +
  "border border-[var(--mono-border)] bg-[var(--mono-bg)] text-[var(--mono-fg)]";

const removeBtn =
  "ml-1 grid place-items-center w-4 h-4 border border-[var(--mono-border)] " +
  "bg-[var(--mono-bg)] text-[var(--mono-fg)] hover:bg-[var(--mono-fg)] hover:text-[var(--mono-bg)] transition";

export default function TagInput({
  id,
  value,
  onChange,
  placeholder = "Tambah tag lalu Enter…",
  disabled,
  className,
  inputClassName,
  chipClassName,
  addOnBlur = true,
  separators = [","],
}: TagInputProps) {
  const [text, setText] = React.useState("");

  const commit = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    // pecah berdasarkan separators jika ada di string
    const pattern = new RegExp(`[${separators.map(escapeForRegex).join("")}]`);
    const pieces = trimmed
      .split(pattern)
      .map((s) => s.trim())
      .filter(Boolean);

    if (pieces.length === 0) return;

    // de-duplicate (case-sensitive tetap, cocokkan exact string)
    const set = new Set(value);
    let changed = false;
    for (const p of pieces) {
      if (!set.has(p)) {
        set.add(p);
        changed = true;
      }
    }
    if (changed) onChange(Array.from(set));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    const isEnter = e.key === "Enter";
    const isSep = separators.includes(e.key);

    if (isEnter || isSep) {
      e.preventDefault();
      if (text.trim()) {
        commit(text);
        setText("");
      }
    } else if (e.key === "Backspace" && !text && value.length > 0) {
      // backspace saat input kosong → hapus tag terakhir (UX umum)
      onChange(value.slice(0, -1));
    }
  };

  const onBlur = () => {
    if (disabled) return;
    if (addOnBlur && text.trim()) {
      commit(text);
      setText("");
    }
  };

  const removeAt = (idx: number) => {
    if (disabled) return;
    onChange(value.filter((_, i) => i !== idx));
  };

  return (
    <div className={`flex flex-col gap-1 ${className || ""}`}>
      <div
        className={`${baseWrapper} ${
          disabled ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {/* chips */}
        {value.map((t, idx) => (
          <span
            key={`${t}-${idx}`}
            className={`${baseChip} ${chipClassName || ""}`}
          >
            #{t}
            <button
              type="button"
              aria-label={`Hapus tag ${t}`}
              onClick={() => removeAt(idx)}
              disabled={disabled}
              className={removeBtn}
            >
              ×
            </button>
          </span>
        ))}

        {/* input */}
        <input
          id={id}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`${baseInput} ${inputClassName || ""}`}
          aria-disabled={disabled}
          aria-describedby={value.length ? `${id}-tags-count` : undefined}
        />
      </div>

      {/* helper kecil opsional (count) */}
      {value.length > 0 && (
        <p
          id={`${id}-tags-count`}
          className="text-[10px] text-[var(--mono-muted)]"
        >
          {value.length} tag
        </p>
      )}
    </div>
  );
}

function escapeForRegex(s: string) {
  // escape char untuk regex char-class
  return s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}
