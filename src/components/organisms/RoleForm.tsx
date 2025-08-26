// src/components/features/rbac/forms/RoleForm.tsx
"use client";

import * as React from "react";
import InputLabelField from "@/components/molecules/InputLabelField";
import TagInput from "@/components/molecules/TagInput";
import FormActions from "@/components/molecules/FormActions";

export type RoleItem = {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  members?: number;
};

type Mode = "create" | "read" | "update";

type Props = {
  type: Mode;
  data?: RoleItem;
  onClose: () => void;
};

export default function RoleForm({ type, data, onClose }: Props) {
  const isRead = type === "read";

  const [name, setName] = React.useState<string>(data?.name ?? "");
  const [desc, setDesc] = React.useState<string>(data?.description ?? "");
  const [perms, setPerms] = React.useState<string[]>(data?.permissions ?? []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: submit to backend
    onClose();
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <InputLabelField
        id="role-name"
        label="Nama Role"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Mis. Admin / Technician / Viewer"
        disabled={isRead}
        required
      />

      <InputLabelField
        id="role-desc"
        label="Deskripsi"
        multiline
        rows={3}
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Ringkasan hak akses/tujuan role…"
        disabled={isRead}
      />

      <div>
        <label
          htmlFor="role-perms"
          className="text-xs uppercase tracking-widest text-[var(--mono-label)]"
        >
          Permissions
        </label>
        <TagInput
          id="role-perms"
          value={perms}
          onChange={setPerms}
          disabled={isRead}
          placeholder="Tambah permission lalu Enter (mis. ticket.read)…"
          aria-describedby="role-perms-note"
        />
        <p
          id="role-perms-note"
          className="text-[10px] text-[var(--mono-muted)] mt-1"
        >
          Contoh: <code>ticket.read</code>, <code>ticket.write</code>,{" "}
          <code>inventory.read</code>.
        </p>
      </div>

      <FormActions
        mode={type}
        onCancel={onClose}
        cancelText="Close"
        submitText={type === "create" ? "Save" : "Save Changes"}
      />
    </form>
  );
}
