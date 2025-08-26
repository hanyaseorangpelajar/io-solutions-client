// src/components/forms/TicketForm.tsx
"use client";

import * as React from "react";
import InputLabelField from "@/components/molecules/InputLabelField";
import SelectLabelField from "@/components/molecules/SelectLabelField";
import FormRow from "@/components/molecules/FormRow";
import FormActions from "@/components/molecules/FormActions";

export type Ticket = {
  id?: number | string;
  title?: string;
  /** Prefer `priority`; `class` kept for backward compatibility */
  priority?: "VIP" | "Regular" | "Urgent" | string;
  class?: "VIP" | "Regular" | "Urgent" | string; // deprecated
  date?: string; // YYYY-MM-DD
};

type Mode = "create" | "read" | "update";

type TicketFormProps = {
  type: Mode;
  data?: Ticket;
  onClose: () => void;
};

export default function TicketForm({ type, data, onClose }: TicketFormProps) {
  const isRead = type === "read";

  const [form, setForm] = React.useState<
    Required<Pick<Ticket, "title" | "priority" | "date">>
  >({
    title: data?.title ?? "",
    priority: data?.priority ?? data?.class ?? "",
    date: data?.date ?? "",
  });

  React.useEffect(() => {
    setForm({
      title: data?.title ?? "",
      priority: data?.priority ?? data?.class ?? "",
      date: data?.date ?? "",
    });
  }, [data?.title, data?.priority, data?.class, data?.date]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call API create/update with { ...form }
    onClose();
  };

  return (
    <form onSubmit={onSubmit} className="mt-2 flex flex-col gap-3">
      <InputLabelField
        id="ticket-title"
        label="Judul"
        value={form.title}
        onChange={(e) =>
          setForm((s) => ({ ...s, title: String(e.target.value) }))
        }
        placeholder="Contoh: Laptop tidak menyala"
        autoComplete="off"
        disabled={isRead}
        required
      />

      <FormRow>
        <SelectLabelField
          id="ticket-priority"
          label="Prioritas"
          value={form.priority}
          onChange={(e) => setForm((s) => ({ ...s, priority: e.target.value }))}
          options={[
            { value: "VIP", label: "VIP" },
            { value: "Regular", label: "Regular" },
            { value: "Urgent", label: "Urgent" },
          ]}
          disabled={isRead}
        />

        <InputLabelField
          id="ticket-date"
          label="Tanggal"
          type="date"
          value={form.date}
          onChange={(e) => setForm((s) => ({ ...s, date: e.target.value }))}
          autoComplete="off"
          disabled={isRead}
          required
        />
      </FormRow>

      <FormActions mode={type} onCancel={onClose} />
    </form>
  );
}
