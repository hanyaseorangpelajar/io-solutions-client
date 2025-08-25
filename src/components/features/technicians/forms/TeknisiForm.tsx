"use client";

import * as React from "react";
import InputLabelField from "@/components/form/fields/InputLabelField";
import SelectLabelField from "@/components/form/fields/SelectLabelField";
import FormRow from "@/components/form/FormRow";
import FormActions from "@/components/form/FormActions";

// harus sama dengan halaman
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
export type TeknisiFormProps = {
  type: Mode;
  data?: Technician;
  id?: number | string;
  onClose: () => void;
};

export default function TeknisiForm({ type, data, onClose }: TeknisiFormProps) {
  const isRead = type === "read";

  const [form, setForm] = React.useState<Technician>({
    name: data?.name ?? "",
    email: data?.email ?? "",
    phone: data?.phone ?? "",
    skills: data?.skills ?? [],
    activeSince: data?.activeSince ?? "",
    status: data?.status ?? "ACTIVE",
  });

  // sinkron saat data berubah (buka item lain)
  React.useEffect(() => {
    setForm({
      name: data?.name ?? "",
      email: data?.email ?? "",
      phone: data?.phone ?? "",
      skills: data?.skills ?? [],
      activeSince: data?.activeSince ?? "",
      status: data?.status ?? "ACTIVE",
    });
  }, [data]);

  const set =
    <K extends keyof Technician>(k: K) =>
    (v: Technician[K]) =>
      setForm((s) => ({ ...s, [k]: v }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrasi submit ke backend
    onClose();
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      {/* ID (hanya tampil kalau ada) */}
      {data?.id && (
        <InputLabelField
          id="tech-id"
          label="ID Teknisi"
          value={data.id}
          onChange={() => {}}
          disabled
          controlClassName="bg-black/5"
        />
      )}

      <InputLabelField
        id="name"
        label="Nama"
        value={form.name}
        onChange={(e) => set("name")(e.target.value)}
        placeholder="Nama teknisi"
        disabled={isRead}
        required
      />

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

      <FormActions
        mode={type}
        onCancel={onClose}
        cancelText="Close"
        submitText={type === "create" ? "Save" : "Save Changes"}
      />
    </form>
  );
}
