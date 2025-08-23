// src/components/forms/TicketForm.tsx
"use client";

import * as React from "react";
import InputLabelField from "@/components/InputLabelField";
import SelectLabelField from "@/components/SelectLabelField";
import FormRow from "@/components/FormRow";
import FormActions from "@/components/FormActions";

export type Tiket = {
  id?: number | string;
  title?: string;
  class?: string;
  date?: string; // YYYY-MM-DD
};

type Mode = "create" | "read" | "update";

type TiketFormProps = {
  type: Mode;
  data?: Tiket;
  onClose: () => void;
};

export default function TiketForm({ type, data, onClose }: TiketFormProps) {
  const isRead = type === "read";

  const [form, setForm] = React.useState<Tiket>({
    title: data?.title ?? "",
    class: data?.class ?? "",
    date: data?.date ?? "",
  });

  React.useEffect(() => {
    setForm({
      title: data?.title ?? "",
      class: data?.class ?? "",
      date: data?.date ?? "",
    });
  }, [data]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call API create/update
    onClose();
  };

  return (
    <form onSubmit={onSubmit} className="mt-2 flex flex-col gap-3">
      {/* Judul */}
      <InputLabelField
        id="ticket-title"
        label="Judul"
        value={form.title ?? ""}
        onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
        placeholder="Contoh: Laptop tidak menyala"
        autoComplete="off"
        disabled={isRead}
        required
      />

      {/* Kelas & Tanggal */}
      <FormRow>
        {/* Versi SELECT (disarankan) */}
        <SelectLabelField
          id="ticket-class"
          label="Kelas"
          value={form.class ?? ""}
          onChange={(e) => setForm((s) => ({ ...s, class: e.target.value }))}
          options={[
            { value: "VIP", label: "VIP" },
            { value: "Regular", label: "Regular" },
            { value: "Urgent", label: "Urgent" },
          ]}
          disabled={isRead}
          // kalau tetap mau input bebas, ganti ke InputLabelField seperti sebelumnya
        />

        <InputLabelField
          id="ticket-date"
          label="Tanggal"
          type="date"
          value={form.date ?? ""}
          onChange={(e) => setForm((s) => ({ ...s, date: e.target.value }))}
          autoComplete="off"
          disabled={isRead}
          required
        />
      </FormRow>

      {/* Actions (seragam di semua form) */}
      <FormActions mode={type} onCancel={onClose} />
    </form>
  );
}
