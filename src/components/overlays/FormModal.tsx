// src/components/FormModal.tsx
"use client";

import * as React from "react";

type CrudType = "create" | "read" | "update" | "delete";
type NonDeleteType = Exclude<CrudType, "delete">;

type FormComponentProps = {
  type: NonDeleteType; // komponen form hanya menerima create/read/update
  data?: any;
  id?: number | string;
  onClose: () => void;
};
type FormComponent = (props: FormComponentProps) => JSX.Element;

type Props = {
  type: CrudType;
  title?: string;
  entityTitle?: string;
  component?: FormComponent; // tidak dipanggil saat type === "delete"
  data?: any;
  id?: number | string;
  icon?: React.ReactNode;
  triggerClassName?: string; // kontrol ukuran/shape tombol trigger
  contentClassName?: string; // kelas tambahan untuk body wrapper (opsional)
};

const triggerBase =
  "group inline-flex items-center justify-center rounded-none " +
  "border border-black bg-black hover:bg-white transition";

export default function FormModal({
  type,
  title,
  entityTitle,
  component: Comp,
  data,
  id,
  icon,
  triggerClassName,
  contentClassName,
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

  const renderBody = () => {
    if (type === "delete") {
      // Built-in delete confirmation
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
      // create/read/update → panggil komponen form
      return (
        <Comp
          type={type as NonDeleteType}
          data={data}
          id={id}
          onClose={close}
        />
      );
    }

    return <div>Form not found.</div>;
  };

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${triggerBase} ${
          triggerClassName || (type === "create" ? "w-8 h-8" : "w-7 h-7")
        }`}
        aria-label={modalTitle}
        title={modalTitle}
      >
        {icon || (
          <span className="text-xs text-white group-hover:text-black capitalize">
            {type}
          </span>
        )}
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="relative w-full max-w-3xl bg-white text-black border border-black">
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

            {/* Body wrapper: padding + scroll agar form rapi */}
            <div
              className={`px-4 py-3 max-h-[75vh] overflow-y-auto ${
                contentClassName || ""
              }`}
            >
              {renderBody()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
