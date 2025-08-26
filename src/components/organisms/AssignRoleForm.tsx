"use client";

import * as React from "react";
import InputLabelField from "@/components/molecules/InputLabelField";
import SelectLabelField from "@/components/molecules/SelectLabelField";
import FormActions from "@/components/molecules/FormActions";

export type RoleBrief = { id: string; name: string };
export type UserItem = {
  id: string;
  name: string;
  email: string;
  roleId?: string;
};

type Mode = "create" | "read" | "update";

type Props = {
  type: Mode;
  data?: UserItem & { roleName?: string };
  roles?: RoleBrief[];
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

  // Sync when data/roles change; keep value if still valid
  React.useEffect(() => {
    setRoleId((prev) => {
      if (data?.roleId) return data.roleId;
      if (prev && roles.some((r) => r.id === prev)) return prev;
      return roles[0]?.id ?? "";
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
        placeholder={roles.length === 0 ? "Tidak ada peran" : undefined}
      />

      <FormActions
        mode={type}
        onCancel={onClose}
        className="mt-2 flex items-center justify-end gap-2"
      />
    </form>
  );
}
