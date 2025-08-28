"use client";

import { Button, type ButtonProps } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useCallback } from "react";
import type {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  MouseEventHandler,
} from "react";

/** Native props untuk <button> */
type NativeButtonProps = Omit<
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
  "ref"
>;

type ConfirmOptions = {
  title?: string;
  message?: string;
  labels?: { confirm?: string; cancel?: string };
  /**
   * Props tombol "Confirm" pada modal.
   * Catatan: hilangkan `style` dari ButtonProps Mantine untuk menghindari konflik tipe
   * dengan CSSProperties milik native <button>.
   */
  confirmProps?: Omit<ButtonProps, "style"> & NativeButtonProps;
};

export type ActionButtonProps = Omit<ButtonProps, "style"> &
  NativeButtonProps & {
    /** Jika diisi, klik akan membuka modal konfirmasi dulu */
    confirm?: ConfirmOptions | boolean;
    /** Jika false, tombol disable dengan alasan (opsional) */
    canPerform?: boolean;
    disabledReason?: string;
    /** Dipanggil setelah konfirmasi sukses (jika ada confirm) */
    onConfirm?: () => void | Promise<void>;
    /** Pastikan onClick tersedia eksplisit pada tipe */
    onClick?: MouseEventHandler<HTMLButtonElement>;
  };

export default function ActionButton({
  confirm,
  canPerform = true,
  disabledReason,
  onClick,
  onConfirm,
  children,
  ...rest
}: ActionButtonProps) {
  const handle = useCallback(() => {
    if (!canPerform) return;

    const run = async () => {
      if (onConfirm) await onConfirm();
      onClick?.(new MouseEvent("click") as unknown as any);
    };

    if (confirm) {
      const c: ConfirmOptions =
        typeof confirm === "boolean" ? {} : (confirm as ConfirmOptions);

      modals.openConfirmModal({
        title: c.title ?? "Konfirmasi",
        children: c.message ? <div>{c.message}</div> : undefined,
        labels: {
          confirm: c.labels?.confirm ?? "Lanjut",
          cancel: c.labels?.cancel ?? "Batal",
        },
        confirmProps: { color: "red", ...(c.confirmProps ?? {}) },
        onConfirm: run,
      });
    } else {
      void run();
    }
  }, [canPerform, confirm, onClick, onConfirm]);

  const finalTitle =
    !canPerform && disabledReason ? disabledReason : rest.title;

  return (
    <Button
      onClick={handle}
      disabled={!canPerform || rest.disabled}
      title={finalTitle}
      {...rest}
    >
      {children}
    </Button>
  );
}
