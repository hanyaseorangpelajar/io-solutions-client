"use client";

import * as React from "react";

type Mode = "create" | "read" | "update";

type FormActionsProps = {
  /** Preferred prop */
  mode?: Mode;
  /** @deprecated use `mode` instead */
  type?: Mode;

  onCancel: () => void;

  submitText?: string;
  cancelText?: string;
  disabledSubmit?: boolean;
  className?: string; // wrapper <div>
};

export default function FormActions({
  mode,
  type,
  onCancel,
  submitText,
  cancelText,
  disabledSubmit,
  className = "mt-2 flex items-center justify-end gap-2",
}: FormActionsProps) {
  // Backward-compat: fall back to `type` if provided
  const eff: Mode = (mode ?? type ?? "create") as Mode;

  const showSubmit = eff !== "read";

  // Default labels (UI text kept Indonesian; component/file names in English)
  const defaultSubmit =
    eff === "create" ? "Simpan" : eff === "update" ? "Simpan Perubahan" : "";
  const defaultCancel = eff === "read" ? "Tutup" : "Batal";

  return (
    <div className={className} data-mode={eff}>
      <button
        type="button"
        onClick={onCancel}
        className={[
          "btn-ghost",
          "transition duration-200 active:scale-95",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--mono-fg)]",
        ].join(" ")}
      >
        {cancelText ?? defaultCancel}
      </button>

      {showSubmit && (
        <button
          type="submit"
          disabled={disabledSubmit}
          className={[
            "btn",
            "transition duration-200 active:scale-95",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--mono-fg)]",
          ].join(" ")}
        >
          {submitText ?? defaultSubmit}
        </button>
      )}
    </div>
  );
}
