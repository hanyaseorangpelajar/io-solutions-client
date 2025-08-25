"use client";

import * as React from "react";

type CrudType = "create" | "read" | "update" | "delete";
type NonDeleteType = Exclude<CrudType, "delete">;

type FormComponentProps = {
  type: NonDeleteType; // form hanya untuk create/read/update
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
  triggerClassName?: string; // kontrol ukuran/shape tombol
};

const triggerBase =
  "group inline-flex items-center justify-center rounded-none " +
  "border border-black bg-black text-white transition " +
  // hover tombol sendiri
  "hover:bg-white hover:text-black " +
  // saat baris tabel (parent) di-hover
  "group-hover/row:bg-white group-hover/row:text-black " +
  // paksa semua anak (ikon/teks di dalam tombol) ikut warna tombol
  "[&_*]:!text-white hover:[&_*]:!text-black group-hover/row:[&_*]:!text-black";

export default function FormModal({
  type,
  title,
  entityTitle,
  component: Comp,
  data,
  id,
  icon,
  triggerClassName,
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
      // Built-in delete confirmation — komponen form tidak dipakai
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

    // create/read/update → panggil komponen form
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
        className={`${triggerBase} ${
          triggerClassName || (type === "create" ? "w-8 h-8" : "w-7 h-7")
        }`}
        aria-label={modalTitle}
        title={modalTitle}
      >
        {icon || <span className="text-xs capitalize">{type}</span>}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
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
