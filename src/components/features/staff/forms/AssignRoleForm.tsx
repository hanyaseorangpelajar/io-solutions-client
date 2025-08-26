// src/components/features/staff/forms/AssignRoleForm.tsx
"use client";

import * as React from "react";
import InputLabelField from "@/components/ui/fields/InputLabelField";
import SelectLabelField from "@/components/ui/fields/SelectLabelField";

export type RoleBrief = { id: string; name: string };
export type UserItem = {
  id: string;
  name: string;
  email: string;
  roleId?: string;
};

type Mode = "create" | "read" | "update";

type Props = {
  type: Mode; // dipakai read / update
  data?: UserItem & { roleName?: string };
  roles?: RoleBrief[]; // optional agar kompatibel dgn FormModal typing
  onClose: () => void;
};

export default function AssignRoleForm({
  type,
  data,
  roles = [],
  onClose,
}: Props) {
  const isRead = type === "read";
  const [roleId, setRoleId] = React.useState<string>(
    data?.roleId ?? roles[0]?.id ?? ""
  );

  // sinkron jika data/roles berubah (mis. buka modal user lain)
  React.useEffect(() => {
    setRoleId((prev) => {
      if (data?.roleId) return data.roleId;
      if (!prev && roles[0]?.id) return roles[0].id;
      return prev;
    });
  }, [data?.roleId, roles]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <InputLabelField
        id="assign-user"
        label="Pengguna"
        value={`${data?.name ?? ""} — ${data?.email ?? ""}`}
        onChange={() => {}}
        disabled
      />

      <SelectLabelField
        id="assign-role"
        label="Peran"
        value={roleId}
        onChange={(e) => setRoleId(e.target.value)}
        options={roles.map((r) => ({ value: r.id, label: r.name }))}
        disabled={isRead || roles.length === 0}
      />

      <div className="mt-2 flex items-center justify-end gap-2">
        <button type="button" onClick={onClose} className="btn btn--ghost">
          Tutup
        </button>
        {!isRead && (
          <button type="submit" className="btn btn--solid">
            Simpan Perubahan
          </button>
        )}
      </div>
    </form>
  );
}
