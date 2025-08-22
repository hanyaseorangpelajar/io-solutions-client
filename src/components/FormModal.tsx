"use client";
import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

type CrudType = "create" | "read" | "update" | "delete";
type Variant = "mono" | "brand";

type InjectedFormProps = {
  type: Exclude<CrudType, "delete">;
  data?: any;
  onClose: () => void;
};

type FormModalProps = {
  /** Judul di header modal (opsional, akan fallback: "Create/Read/Update <title>") */
  title?: string;
  /** Title entity, contoh: "Tiket" ⇒ dipakai untuk fallback judul */
  entityTitle?: string;
  /** Mode CRUD */
  type: CrudType;
  /** Komponen form yang akan di-render (untuk create/read/update) */
  component?: React.ComponentType<InjectedFormProps>;
  /** Data yang diteruskan ke component */
  data?: any;
  /** ID untuk delete confirm */
  id?: number | string;
  /** Konten kustom untuk delete confirm, kalau ingin override */
  renderDeleteBody?: (close: () => void) => React.ReactNode;
  /** Kontrol tampilan trigger */
  icon?: React.ReactNode;
  triggerAriaLabel?: string;
  triggerClassName?: string;
  /** Variant style (default mono/hitam-putih) */
  variant?: Variant;
  /** (opsional) kontrol eksternal open state */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const baseTriggerMono =
  "group flex items-center justify-center w-7 h-7 rounded-none border border-black bg-black hover:bg-white transition";
const baseTriggerBrand =
  "group flex items-center justify-center w-7 h-7 rounded-full bg-black";

const FormModal = ({
  title,
  entityTitle,
  type,
  component: FormComponent,
  data,
  id,
  renderDeleteBody,
  icon,
  triggerAriaLabel,
  triggerClassName,
  variant = "mono",
  open: openControlled,
  onOpenChange,
}: FormModalProps) => {
  const isControlled = typeof openControlled === "boolean";
  const [openUncontrolled, setOpenUncontrolled] = useState(false);
  const open = isControlled ? (openControlled as boolean) : openUncontrolled;

  const setOpen = (v: boolean) => {
    if (isControlled) onOpenChange?.(v);
    else setOpenUncontrolled(v);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const computedTitle =
    title ||
    `${
      type === "create"
        ? "Create"
        : type === "read"
        ? "Read"
        : type === "update"
        ? "Update"
        : "Delete"
    }${entityTitle ? ` ${entityTitle}` : ""}`;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) setOpen(false);
  };

  const TriggerButton = (
    <button
      type="button"
      aria-label={triggerAriaLabel || computedTitle}
      className={[
        variant === "mono" ? baseTriggerMono : baseTriggerBrand,
        triggerClassName || "",
      ].join(" ")}
      onClick={() => setOpen(true)}
    >
      {icon || (
        <span className="block w-1.5 h-1.5 bg-white group-hover:bg-black" />
      )}
    </button>
  );

  const DeleteDefault = () => (
    <form className="p-4 flex flex-col gap-4">
      <span className="text-center font-medium">
        All data will be lost. Are you sure you want to delete
        {entityTitle ? ` ${entityTitle}` : " this item"}
        {id !== undefined ? ` (${id})` : ""}?
      </span>
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-4 py-2 border border-black bg-white hover:bg-black hover:text-white transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-black bg-black text-white hover:bg-red-600 hover:text-white transition"
        >
          Delete
        </button>
      </div>
    </form>
  );

  const Body = () => {
    if (type === "delete") {
      if (renderDeleteBody)
        return <>{renderDeleteBody(() => setOpen(false))}</>;
      return <DeleteDefault />;
    }
    if (!FormComponent) {
      return (
        <div className="p-4">
          <p className="mb-2 font-semibold">Form not provided</p>
          <p className="text-sm">
            Berikan prop <code>component</code> ke FormModal untuk{" "}
            {computedTitle}.
          </p>
        </div>
      );
    }
    return (
      <FormComponent type={type} data={data} onClose={() => setOpen(false)} />
    );
  };

  return (
    <>
      {TriggerButton}

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onMouseDown={handleBackdropClick}
        >
          <div className="relative bg-white text-black p-4 rounded-none border border-black w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">{computedTitle}</h2>
              <button
                type="button"
                aria-label="Close"
                className="p-1 border border-black bg-white hover:bg-black hover:text-white transition"
                onClick={() => setOpen(false)}
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
            <Body />
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
