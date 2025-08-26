"use client";

import * as React from "react";

type Crud = "create" | "read" | "update" | "delete";
type NonDelete = Exclude<Crud, "delete">;

/** Komponen form yang ditanam di dalam modal */
type FormComponentProps = {
  type: NonDelete;
  data?: any; // longgar agar kompatibel ke semua form
  id?: number | string;
  onClose: () => void;
};
type FormComponent = (props: FormComponentProps) => JSX.Element;

type Props = {
  type: Crud;
  title?: string;
  entityTitle?: string;

  component?: FormComponent;

  data?: any;
  id?: number | string;

  icon?: React.ReactNode;
  triggerClassName?: string;

  variant?: "solid" | "ghost";
  iconColor?: string;
  invertOnRowHover?: boolean;

  /** Kelas tambahan untuk body konten (di luar header/footer). Default: "p-4". */
  contentClassName?: string;
};

export default function FormModal({
  type,
  title,
  entityTitle,
  component: Comp,
  data,
  id,
  icon,
  triggerClassName,
  variant = "solid",
  iconColor,
  invertOnRowHover = false,
  contentClassName = "p-4",
}: Props) {
  const [open, setOpen] = React.useState(false);
  const titleId = React.useId();

  const modalTitle =
    title ??
    (type === "delete"
      ? `Hapus ${entityTitle ?? "Item"}`
      : type === "create"
      ? `Buat ${entityTitle ?? "Item"}`
      : type === "update"
      ? `Ubah ${entityTitle ?? "Item"}`
      : `Detail ${entityTitle ?? "Item"}`);

  const close = () => setOpen(false);

  // ESC to close
  React.useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open]);

  // Trigger button styling
  const base =
    "inline-flex items-center justify-center rounded-none transition duration-200 " +
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--mono-fg)] " +
    "active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

  const solid = "border bg-mono-fg text-mono-bg hover:opacity-90";
  const ghost =
    "border bg-mono-bg text-mono-fg hover:bg-mono-fg hover:text-mono-bg";

  const rowSync = invertOnRowHover
    ? "group-hover/row:bg-mono-fg group-hover/row:text-mono-bg"
    : "";

  const variantCls = variant === "ghost" ? ghost : solid;

  // Default square sizes for icon triggers; allow override
  const triggerSize =
    triggerClassName || (type === "create" ? "w-8 h-8" : "w-7 h-7");

  const triggerCls = [base, variantCls, rowSync, triggerSize].join(" ");

  // Modal body (tanpa padding di child; padding disediakan di wrapper ini)
  const renderBody = () => {
    if (type === "delete") {
      return (
        <form className="flex flex-col gap-4">
          <p className="text-center">
            Semua data akan dihapus. Yakin menghapus {entityTitle ?? "item"}
            {id !== undefined ? ` (${id})` : ""}?
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={close}
              className="btn-ghost active:scale-95 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn active:scale-95 transition duration-200"
            >
              Delete
            </button>
          </div>
        </form>
      );
    }

    if (Comp) {
      return (
        <Comp type={type as NonDelete} data={data} id={id} onClose={close} />
      );
    }

    return <div>Form not found.</div>;
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={triggerCls}
        aria-label={modalTitle}
        title={modalTitle}
        style={iconColor ? { color: iconColor } : undefined} // icons inherit currentColor
      >
        {icon || <span className="text-xs capitalize">{type}</span>}
      </button>

      {open && (
        <div className="modal-overlay" onClick={close} aria-hidden="true">
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header (padding biasanya diatur via CSS .modal-header; biar aman, biarkan seperti semula) */}
            <div className="modal-header">
              <h2 id={titleId} className="modal-title">
                {modalTitle}
              </h2>
              <button
                type="button"
                onClick={close}
                className="btn-ghost px-2 py-1 active:scale-95 transition duration-200"
                aria-label="Tutup modal"
                title="Tutup modal"
              >
                ✕
              </button>
            </div>

            {/* Body dengan padding default */}
            <div
              className={["modal-body", contentClassName]
                .filter(Boolean)
                .join(" ")}
            >
              {renderBody()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
