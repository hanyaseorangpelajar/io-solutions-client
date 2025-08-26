// src/components/overlays/FormModal.tsx
"use client";

import * as React from "react";

type CrudType = "create" | "read" | "update" | "delete";
type NonDeleteType = Exclude<CrudType, "delete">;

// Props yang harus dipenuhi oleh form anak
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

  // tidak dipakai saat type === "delete"
  component?: FormComponent;

  data?: any;
  id?: number | string;

  // trigger button
  icon?: React.ReactNode;
  triggerClassName?: string;

  // styling
  variant?: "solid" | "ghost"; // default: "solid"
  iconColor?: string; // jika mau paksa warna ikon
  invertOnRowHover?: boolean; // sinkron dengan .group/row pada <tr>
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
}: Props) {
  const [open, setOpen] = React.useState(false);

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

  // --- Trigger button classes -------------------------------------------------
  const base =
    "group inline-flex items-center justify-center rounded-none transition " +
    "focus:outline-none focus:ring-0";

  const solid =
    // tombol hitam → hover jadi putih
    "border border-black bg-black text-white " +
    "hover:bg-white hover:text-black " +
    // paksa isi (ikon/teks) ikut warna tombol
    "[&_*]:!text-white hover:[&_*]:!text-black";

  const ghost =
    // tombol putih → hover jadi hitam
    "border border-black bg-white text-black " +
    "hover:bg-black hover:text-white " +
    "[&_*]:!text-black hover:[&_*]:!text-white";

  // sinkron saat row di-hover (tr punya class 'group/row')
  const rowSync = invertOnRowHover
    ? "group-hover/row:bg-white group-hover/row:text-black group-hover/row:[&_*]:!text-black"
    : "";

  const triggerVariantCls = `${variant === "ghost" ? ghost : solid}`;
  const triggerSize =
    triggerClassName || (type === "create" ? "w-8 h-8" : "w-7 h-7");
  const triggerCls = `${base} ${triggerVariantCls} ${rowSync} ${triggerSize}`;

  // --- Modal body -------------------------------------------------------------
  const renderBody = () => {
    if (type === "delete") {
      return (
        <form className="p-4 flex flex-col gap-4">
          <p className="text-center">
            Semua data akan dihapus. Yakin menghapus {entityTitle ?? "item"}
            {id !== undefined ? ` (${id})` : ""}?
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={close}
              className="px-4 py-2 border border-black bg-white hover:bg-black hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-black bg-black text-white hover:bg-white hover:text-black transition"
            >
              Delete
            </button>
          </div>
        </form>
      );
    }

    if (Comp) {
      return (
        <Comp
          type={type as NonDeleteType}
          data={data}
          id={id}
          onClose={close}
        />
      );
    }

    return <div className="p-4">Form not found.</div>;
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={triggerCls}
        aria-label={modalTitle}
        title={modalTitle}
      >
        {/* Bila butuh paksa warna ikon */}
        <span className={iconColor ? `[&_*]:!text-[${iconColor}]` : ""}>
          {icon || <span className="text-xs capitalize">{type}</span>}
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[var(--overlay)]">
          <div className="relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] bg-white border border-black">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-black">
              <h2 className="text-sm font-semibold uppercase tracking-wider">
                {modalTitle}
              </h2>
              <button
                type="button"
                onClick={close}
                className="px-2 py-1 border border-black bg-white hover:bg-black hover:text-white transition"
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
