// src/components/features/rbac/forms/RoleForm.tsx
"use client";

import * as React from "react";
import InputLabelField from "@/components/ui/fields/InputLabelField";
import TagInput from "@/components/ui/fields/TagInput";

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
    onClose();
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
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
          className="text-xs uppercase tracking-widest text-label"
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
        <p id="role-perms-note" className="text-[10px] text-muted mt-1">
          Contoh: <code>ticket.read</code>, <code>ticket.write</code>,{" "}
          <code>inventory.read</code>.
        </p>
      </div>

      <div className="mt-2 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-black bg-white hover:bg-black hover:text-white transition"
        >
          Close
        </button>
        {type !== "read" && (
          <button
            type="submit"
            className="px-4 py-2 border border-black bg-black text-white hover:bg-white hover:text-black transition"
          >
            {type === "create" ? "Save" : "Save Changes"}
          </button>
        )}
      </div>
    </form>
  );
}
