"use client";

import * as React from "react";
import InputLabelField from "@/components/form/fields/InputLabelField";
import SelectLabelField from "@/components/form/fields/SelectLabelField";

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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <InputLabelField
        id="assign-user"
        label="User"
        value={`${data?.name ?? ""} — ${data?.email ?? ""}`}
        onChange={() => {}}
        disabled
        controlClassName="bg-black/5"
      />

      <SelectLabelField
        id="assign-role"
        label="Role"
        value={roleId}
        onChange={(e) => setRoleId(e.target.value)}
        options={roles.map((r) => ({ value: r.id, label: r.name }))}
        disabled={isRead || roles.length === 0}
      />

      <div className="mt-2 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-black bg-white hover:bg-black hover:text-white transition"
        >
          Close
        </button>
        {!isRead && (
          <button
            type="submit"
            className="px-4 py-2 border border-black bg-black text-white hover:bg-white hover:text-black transition"
          >
            Save Changes
          </button>
        )}
      </div>
    </form>
  );
}
