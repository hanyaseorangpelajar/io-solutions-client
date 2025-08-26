// src/components/features/tickets/forms/TutupTiketForm.tsx
"use client";

import * as React from "react";
import CostSummary from "@/components/widgets/CostSummary";
import PartsEditor from "@/components/features/tickets/components/PartsEditor";
import { Part } from "@/components/features/tickets/components/PartsEditor";
import FormActions from "@/components/ui/form/FormActions";
import InputLabelField from "@/components/ui/fields/InputLabelField";
import SelectLabelField from "@/components/ui/fields/SelectLabelField";
import TextAreaLabelField from "@/components/ui/fields/TextAreaLabelField";
import CheckboxLabel from "@/components/ui/fields/CheckboxLabel";

type TicketStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "WAITING_PARTS"
  | "COMPLETED"
  | "CANCELED";

export type TutupTiketPayload = {
  ringkasanSolusi: string;
  akarMasalah?: string;
  pengujian?: string;
  parts?: Part[];
  laborHours?: number;
  laborCost?: number;
  warrantyDays?: number;
  customerName?: string;
  acknowledged?: boolean;
  followUpDate?: string;
  finalStatus: Extract<TicketStatus, "COMPLETED" | "CANCELED">;
  cancelReason?: string;
};

export type TicketLite = {
  id?: string | number;
  title?: string;
};

type Props = {
  type: "create" | "read" | "update";
  data?: TicketLite;
  onClose: () => void;
  onSubmit?: (payload: TutupTiketPayload) => Promise<void> | void;
};

// tokenized chip
const chip =
  "inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] uppercase tracking-widest " +
  "border border-[var(--mono-border)] bg-[var(--mono-bg)] text-[var(--mono-fg)]";

export default function TutupTiketForm({
  type,
  data,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = React.useState<TutupTiketPayload>({
    ringkasanSolusi: "",
    akarMasalah: "",
    pengujian: "",
    parts: [],
    laborHours: undefined,
    laborCost: undefined,
    warrantyDays: 30,
    customerName: "",
    acknowledged: false,
    followUpDate: "",
    finalStatus: "COMPLETED",
    cancelReason: "",
  });

  const set = <K extends keyof TutupTiketPayload>(
    k: K,
    v: TutupTiketPayload[K]
  ) => setForm((s) => ({ ...s, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.ringkasanSolusi.trim()) {
      alert("Ringkasan solusi wajib diisi.");
      return;
    }
    if (form.finalStatus === "CANCELED" && !form.cancelReason?.trim()) {
      alert("Alasan pembatalan wajib diisi untuk status DIBATALKAN.");
      return;
    }
    try {
      await onSubmit?.(form);
    } finally {
      onClose();
    }
  };

  return (
    // HAPUS mt-2 → padding sudah dari FormModal body
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Header kecil */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={chip}>Tutup Tiket</span>
          {data?.id && (
            <span className="text-xs px-2 py-1 rounded-none border border-[var(--mono-border)]">
              ID: {String(data.id)}
            </span>
          )}
        </div>
        {data?.title && (
          <div className="text-xs max-w-[60%] truncate text-right">
            {data.title}
          </div>
        )}
      </div>

      {/* Ringkasan Solusi */}
      <TextAreaLabelField
        id="ringkasanSolusi"
        label="Ringkasan Solusi *"
        rows={4}
        value={form.ringkasanSolusi}
        onChange={(e) => set("ringkasanSolusi", e.target.value)}
        placeholder="Jelaskan solusi yang dilakukan, langkah perbaikan, hasil akhir…"
        required
      />

      {/* Akar Masalah / Pengujian */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <TextAreaLabelField
          id="akarMasalah"
          label="Akar Masalah"
          rows={3}
          value={form.akarMasalah ?? ""}
          onChange={(e) => set("akarMasalah", e.target.value)}
          placeholder="Penyebab utama/komponen rusak…"
        />
        <TextAreaLabelField
          id="pengujian"
          label="Pengujian yang Dilakukan"
          rows={3}
          value={form.pengujian ?? ""}
          onChange={(e) => set("pengujian", e.target.value)}
          placeholder="Contoh: power-on test, stress test, I/O test, burn-in 2 jam…"
        />
      </div>

      {/* Suku Cadang */}
      <PartsEditor
        parts={form.parts || []}
        onChange={(parts) => set("parts", parts)}
      />

      {/* Biaya & Garansi */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <InputLabelField
          id="laborHours"
          label="Jam Kerja (jam)"
          type="number"
          min={0}
          step={0.25}
          value={`${form.laborHours ?? ""}`}
          onChange={(e) =>
            set(
              "laborHours",
              e.target.value === "" ? undefined : Number(e.target.value)
            )
          }
          placeholder="Contoh: 1.5"
        />
        <InputLabelField
          id="laborCost"
          label="Biaya Jasa"
          type="number"
          min={0}
          step={0.01}
          value={`${form.laborCost ?? ""}`}
          onChange={(e) =>
            set(
              "laborCost",
              e.target.value === "" ? undefined : Number(e.target.value)
            )
          }
          placeholder="Contoh: 150000"
        />
        <InputLabelField
          id="warrantyDays"
          label="Garansi (hari)"
          type="number"
          min={0}
          value={`${form.warrantyDays ?? ""}`}
          onChange={(e) =>
            set(
              "warrantyDays",
              e.target.value === "" ? undefined : Number(e.target.value)
            )
          }
          placeholder="Contoh: 30"
        />
      </div>

      {/* Pelanggan & Tindak Lanjut */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <InputLabelField
            id="customerName"
            label="Nama Pelanggan"
            value={form.customerName ?? ""}
            onChange={(e) => set("customerName", e.target.value)}
            placeholder="Nama pelanggan"
          />
          <CheckboxLabel
            id="acknowledged"
            label="Pelanggan mengakui (setuju/ambil unit)"
            checked={!!form.acknowledged}
            onChange={(e) => set("acknowledged", e.target.checked)}
          />
        </div>

        <InputLabelField
          id="followUpDate"
          label="Tanggal Tindak Lanjut"
          type="date"
          value={form.followUpDate ?? ""}
          onChange={(e) => set("followUpDate", e.target.value)}
        />
      </div>

      {/* Status Akhir & Alasan Pembatalan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <SelectLabelField
          id="finalStatus"
          label="Status Akhir"
          value={form.finalStatus}
          onChange={(e) =>
            set(
              "finalStatus",
              e.target.value as TutupTiketPayload["finalStatus"]
            )
          }
          options={[
            { value: "COMPLETED", label: "SELESAI (COMPLETED)" },
            { value: "CANCELED", label: "DIBATALKAN (CANCELED)" },
          ]}
        />

        {form.finalStatus === "CANCELED" && (
          <InputLabelField
            id="cancelReason"
            label="Alasan Pembatalan"
            value={form.cancelReason ?? ""}
            onChange={(e) => set("cancelReason", e.target.value)}
            placeholder="Alasan pembatalan…"
            className="md:col-span-2"
          />
        )}
      </div>

      {/* Ringkasan Biaya */}
      <CostSummary parts={form.parts} laborCost={form.laborCost} />

      {/* Aksi */}
      <FormActions mode={type} onCancel={onClose} submitText="Simpan & Tutup" />
    </form>
  );
}
