// src/components/form/TeknisiForm.tsx
"use client";

import { useMemo, useState } from "react";

export type TechnicianStatus = "ACTIVE" | "INACTIVE" | "ON_LEAVE";

export type Technician = {
  id?: string | number; // e.g. TCN-2025-0001
  name?: string;
  email?: string;
  phone?: string;
  skills?: string[]; // e.g. ["Hardware", "Windows", "MacOS"]
  activeSince?: string; // YYYY-MM-DD
  status?: TechnicianStatus;
};

type TeknisiFormProps = {
  type: "create" | "read" | "update";
  data?: Technician;
  onClose: () => void;
};

const statusOptions: TechnicianStatus[] = ["ACTIVE", "INACTIVE", "ON_LEAVE"];

const TeknisiForm = ({ type, data, onClose }: TeknisiFormProps) => {
  const readOnly = type === "read";

  const initial = useMemo(
    () => ({
      name: data?.name ?? "",
      email: data?.email ?? "",
      phone: data?.phone ?? "",
      skillsText: (data?.skills ?? []).join(", "),
      activeSince: data?.activeSince ?? "",
      status: (data?.status as TechnicianStatus) ?? "ACTIVE",
    }),
    [data]
  );

  const [form, setForm] = useState(initial);

  const onChange =
    (key: keyof typeof initial) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((s) => ({ ...s, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Transformasi skillsText -> string[]
    const payload: Technician = {
      ...data,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      skills: form.skillsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      activeSince: form.activeSince,
      status: form.status as TechnicianStatus,
    };

    // TODO: Integrasi API di sini (create/update)
    // console.log({ type, payload });

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-3">
      {/* Optional: tampilkan ID bila ada */}
      {data?.id && (
        <div className="text-xs border border-black px-2 py-1 rounded-none self-start">
          ID: {String(data.id)}
        </div>
      )}

      <label className="text-sm">
        <div className="mb-1">Name</div>
        <input
          value={form.name}
          onChange={onChange("name")}
          className="w-full border border-black px-3 py-2 rounded-none bg-white disabled:bg-white/60"
          placeholder="Nama teknisi..."
          disabled={readOnly}
        />
      </label>

      <label className="text-sm">
        <div className="mb-1">Email</div>
        <input
          type="email"
          value={form.email}
          onChange={onChange("email")}
          className="w-full border border-black px-3 py-2 rounded-none bg-white disabled:bg-white/60"
          placeholder="email@domain.com"
          disabled={readOnly}
        />
      </label>

      <label className="text-sm">
        <div className="mb-1">Phone</div>
        <input
          value={form.phone}
          onChange={onChange("phone")}
          className="w-full border border-black px-3 py-2 rounded-none bg-white disabled:bg-white/60"
          placeholder="08xx-xxxx-xxxx"
          disabled={readOnly}
        />
      </label>

      <label className="text-sm">
        <div className="mb-1">Skills (comma separated)</div>
        <input
          value={form.skillsText}
          onChange={onChange("skillsText")}
          className="w-full border border-black px-3 py-2 rounded-none bg-white disabled:bg-white/60"
          placeholder="Hardware, Windows, MacOS"
          disabled={readOnly}
        />
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="text-sm">
          <div className="mb-1">Active Since</div>
          <input
            type="date"
            value={form.activeSince}
            onChange={onChange("activeSince")}
            className="w-full border border-black px-3 py-2 rounded-none bg-white disabled:bg-white/60"
            disabled={readOnly}
          />
        </label>

        <label className="text-sm">
          <div className="mb-1">Status</div>
          <select
            value={form.status}
            onChange={onChange("status")}
            className="w-full border border-black px-3 py-2 rounded-none bg-white disabled:bg-white/60"
            disabled={readOnly}
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-black bg-white hover:bg-black hover:text-white transition"
        >
          {readOnly ? "Close" : "Cancel"}
        </button>
        {!readOnly && (
          <button
            type="submit"
            className="px-4 py-2 border border-black bg-black text-white hover:bg-white hover:text-black transition"
          >
            {type === "create" ? "Create" : "Update"}
          </button>
        )}
      </div>
    </form>
  );
};

export default TeknisiForm;
