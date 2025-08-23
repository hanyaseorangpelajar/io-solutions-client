// src/components/FormActions.tsx
"use client";

import * as React from "react";

type Mode = "create" | "read" | "update";

type Props = {
  // Opsi B (utama):
  mode?: Mode;
  // Back-compat (kalau masih ada yang pakai `type`, tidak error):
  /** @deprecated gunakan `mode` */
  type?: Mode;

  onCancel: () => void;

  submitText?: string; // override teks submit
  cancelText?: string; // override teks cancel
  disabledSubmit?: boolean;
  className?: string; // wrapper <div>
};

const btnPrimary =
  "px-4 py-2 border border-black bg-black text-white hover:bg-white hover:text-black transition";
const btnGhost =
  "px-4 py-2 border border-black bg-white hover:bg-black hover:text-white transition";

export default function FormActions({
  mode,
  type,
  onCancel,
  submitText,
  cancelText,
  disabledSubmit,
  className = "mt-2 flex items-center justify-end gap-2",
}: Props) {
  // pakai `mode` kalau ada, kalau tidak ada pakai `type`
  const eff: Mode = (mode ?? type ?? "create") as Mode;

  // default label
  const defaultSubmit =
    eff === "create" ? "Simpan" : eff === "update" ? "Simpan Perubahan" : "";
  const defaultCancel = eff === "read" ? "Tutup" : "Batal";

  const showSubmit = eff !== "read";

  return (
    <div className={className}>
      <button type="button" onClick={onCancel} className={btnGhost}>
        {cancelText ?? defaultCancel}
      </button>

      {showSubmit && (
        <button
          type="submit"
          disabled={disabledSubmit}
          className={
            btnPrimary +
            (disabledSubmit ? " opacity-60 cursor-not-allowed" : "")
          }
        >
          {submitText ?? defaultSubmit}
        </button>
      )}
    </div>
  );
}
