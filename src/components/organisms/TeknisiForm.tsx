// src/components/features/technicians/forms/TeknisiForm.tsx
"use client";

import * as React from "react";
import InputLabelField from "@/components/molecules/InputLabelField";
import SelectLabelField from "@/components/molecules/SelectLabelField";
import TagInput from "@/components/molecules/TagInput";
import FormRow from "@/components/molecules/FormRow";
import FormActions from "@/components/molecules/FormActions";

/** Must match page-level usage */
type TechnicianStatus = "ACTIVE" | "INACTIVE" | "ON_LEAVE";

type Technician = {
  id?: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  activeSince?: string; // YYYY-MM-DD
  status: TechnicianStatus;
};

type Mode = "create" | "read" | "update";

export type TechnicianFormProps = {
  type: Mode;
  data?: Technician;
  id?: number | string;
  onClose: () => void;
};

function useSyncedState<T>(value: T) {
  const [state, setState] = React.useState(value);
  React.useEffect(() => setState(value), [value]);
  return [state, setState] as const;
}

export default function TechnicianForm({
  type,
  data,
  onClose,
}: TechnicianFormProps) {
  const isRead = type === "read";

  const [form, setForm] = useSyncedState<Technician>({
    name: data?.name ?? "",
    email: data?.email ?? "",
    phone: data?.phone ?? "",
    skills: data?.skills ?? [],
    activeSince: data?.activeSince ?? "",
    status: data?.status ?? "ACTIVE",
  });

  const set =
    <K extends keyof Technician>(k: K) =>
    (v: Technician[K]) =>
      setForm((s) => ({ ...s, [k]: v }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: submit to backend with `form`
    onClose();
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {/* ID (read-only, only if present) */}
      {data?.id && (
        <InputLabelField
          id="tech-id"
          label="ID Teknisi"
          value={data.id}
          onChange={() => {}}
          disabled
        />
      )}

      {/* Name */}
      <InputLabelField
        id="name"
        label="Nama"
        value={form.name}
        onChange={(e) => set("name")(e.target.value)}
        placeholder="Nama teknisi"
        disabled={isRead}
        required
      />

      {/* Email / Phone */}
      <FormRow>
        <InputLabelField
          id="email"
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => set("email")(e.target.value)}
          placeholder="nama@domain.com"
          autoComplete="email"
          disabled={isRead}
          required
        />
        <InputLabelField
          id="phone"
          label="Telepon"
          value={form.phone}
          onChange={(e) => set("phone")(e.target.value)}
          placeholder="08xx-xxxx-xxxx"
          inputMode="tel"
          autoComplete="tel"
          disabled={isRead}
          required
        />
      </FormRow>

      {/* Skills */}
      <div className="flex flex-col gap-1">
        <label htmlFor="skills" className="label">
          Skills
        </label>
        <TagInput
          id="skills"
          value={form.skills}
          onChange={set("skills")}
          disabled={isRead}
          placeholder="Tambah skill lalu tekan Enter…"
        />
        <p className="field-note">
          Contoh: Hardware, Windows, MacOS, Networking, Printer
        </p>
      </div>

      {/* Active Since / Status */}
      <FormRow>
        <InputLabelField
          id="activeSince"
          label="Aktif Sejak"
          type="date"
          value={form.activeSince ?? ""}
          onChange={(e) => set("activeSince")(e.target.value)}
          disabled={isRead}
        />
        <SelectLabelField
          id="status"
          label="Status"
          value={form.status}
          onChange={(e) => set("status")(e.target.value as TechnicianStatus)}
          options={[
            { value: "ACTIVE", label: "ACTIVE" },
            { value: "INACTIVE", label: "INACTIVE" },
            { value: "ON_LEAVE", label: "ON_LEAVE" },
          ]}
          disabled={isRead}
        />
      </FormRow>

      {/* Actions (DRY) */}
      <FormActions mode={type} onCancel={onClose} />
    </form>
  );
}

/** Backward-compat exports with original Indonesian names (safe to keep or remove later) */
export type TeknisiFormProps = TechnicianFormProps;
export const TeknisiForm = TechnicianForm;
