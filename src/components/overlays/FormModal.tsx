// src/components/overlays/FormModal.tsx
"use client";

import * as React from "react";

type CrudType = "create" | "read" | "update" | "delete";
type NonDeleteType = Exclude<CrudType, "delete">;

type FormComponentProps = {
  type: NonDeleteType;
  data?: any;
  id?: number | string;
  onClose: () => void;
};
type FormComponent = (props: FormComponentProps) => JSX.Element;

type Props = {
  type: CrudType;
  title?: string;
  entityTitle?: string;

  component?: FormComponent; // tidak dipakai saat type === "delete"
  data?: any;
  id?: number | string;

  icon?: React.ReactNode;
  triggerClassName?: string;

  /** Style tombol pemicu */
  variant?: "solid" | "ghost"; // default: "solid"
  /** Paksa ikon mengikuti warna tombol; contoh: "black", "white", "red", atau nilai CSS "#000" */
  iconColor?: string;
  /** Saat baris tabel (tr) di-hover, tombol ikut invert agar kontras */
  invertOnRowHover?: boolean; // default: true
};

const cls = (...v: Array<string | false | null | undefined>) =>
  v.filter(Boolean).join(" ");

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
  invertOnRowHover = true,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const overlayRef = React.useRef<HTMLDivElement | null>(null);

  const modalTitle =
    title ??
    (type === "delete"
      ? `Hapus ${entityTitle ?? "Item"}`
      : type === "create"
      ? `Buat ${entityTitle ?? "Item"}`
      : type === "update"
      ? `Ubah ${entityTitle ?? "Item"}`
      : `Detail ${entityTitle ?? "Item"}`);

  // Tutup dengan ESC
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  // Klik di luar dialog → tutup
  const onOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) setOpen(false);
  };

  // ====== Trigger Button Styles ======
  const triggerBase =
    "group/btn inline-flex items-center justify-center rounded-none " +
    "border border-[var(--mono-border)] transition select-none " +
    "focus:outline-none focus:ring-0";

  const triggerVariant =
    variant === "ghost"
      ? // ghost: putih → hover hitam
        "bg-[var(--mono-bg)] text-[var(--mono-fg)] " +
        "hover:bg-[var(--mono-fg)] hover:text-[var(--mono-bg)]"
      : // solid (default): hitam → hover putih
        "bg-[var(--mono-fg)] text-[var(--mono-bg)] " +
        "hover:bg-[var(--mono-bg)] hover:text-[var(--mono-fg)]";

  const triggerInvertOnRow =
    invertOnRowHover &&
    // saat <tr class="group/row ... hover:..."> di-hover, tombol ikut jadi putih
    "group-hover/row:bg-[var(--mono-bg)] group-hover/row:text-[var(--mono-fg)]";

  const triggerIconColor =
    iconColor &&
    // paksa semua anak (ikon) mengikuti warna yang sama
    `[&_*]:!text-[${iconColor}]`;

  // kalau tidak diset, paksa ikon ikut warna tombol (solid/ghost + hover + row-hover)
  const triggerIconFollowBtn =
    !iconColor &&
    "[&_*]:!text-inherit [&_*]:transition-colors " +
      // saat hover tombol
      "hover:[&_*]:!text-inherit " +
      // saat baris di-hover
      (invertOnRowHover ? "group-hover/row:[&_*]:!text-inherit " : "");

  const triggerSize = triggerClassName || "w-8 h-8";

  // ====== Modal Body (delete vs form) ======
  const renderBody = () => {
    if (type === "delete") {
      return (
        <form className="p-4 md:p-5 flex flex-col gap-4">
          <p className="text-center text-[var(--mono-fg)]">
            Semua data akan dihapus. Yakin menghapus {entityTitle ?? "item"}
            {id !== undefined ? ` (${id})` : ""}?
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={close}
              className="px-4 py-2 border border-[var(--mono-border)] bg-[var(--mono-bg)] text-[var(--mono-fg)] hover:bg-[var(--mono-fg)] hover:text-[var(--mono-bg)] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-[var(--mono-border)] bg-[var(--mono-fg)] text-[var(--mono-bg)] hover:bg-[var(--mono-bg)] hover:text-[var(--mono-fg)] transition"
            >
              Delete
            </button>
          </div>
        </form>
      );
    }

    if (Comp) {
      return (
        <div className="p-4 md:p-5">
          <Comp
            type={type as NonDeleteType}
            data={data}
            id={id}
            onClose={close}
          />
        </div>
      );
    }

    return <div className="p-4 md:p-5">Form not found.</div>;
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={modalTitle}
        title={modalTitle}
        className={cls(
          triggerBase,
          triggerVariant,
          triggerInvertOnRow,
          triggerIconColor,
          triggerIconFollowBtn,
          triggerSize
        )}
      >
        {icon || <span className="text-xs capitalize">{type}</span>}
      </button>

      {open && (
        <div
          ref={overlayRef}
          onMouseDown={onOverlayClick}
          className="fixed inset-0 z-50 grid place-items-center bg-[var(--mono-overlay)]"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="form-modal-title"
            className="relative w-[92%] md:w-[76%] lg:w-[64%] xl:w-[54%] 2xl:w-[44%] 
                       bg-[var(--mono-bg)] text-[var(--mono-fg)] 
                       border border-[var(--mono-border)] shadow-none"
          >
            {/* Header (konsisten padding & border) */}
            <div className="flex items-center justify-between px-4 md:px-5 py-3 border-b border-[var(--mono-border)]">
              <h2
                id="form-modal-title"
                className="text-sm font-semibold uppercase tracking-wider"
              >
                {modalTitle}
              </h2>
              <button
                type="button"
                onClick={close}
                className="px-2 py-1 border border-[var(--mono-border)] bg-[var(--mono-bg)] text-[var(--mono-fg)] hover:bg-[var(--mono-fg)] hover:text-[var(--mono-bg)] transition"
                aria-label="Tutup modal"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            {renderBody()}
          </div>
        </div>
      )}
    </>
  );
}
