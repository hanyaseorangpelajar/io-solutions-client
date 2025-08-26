"use client";

import { RoleItem } from "@/components/features/rbac/forms/RoleForm";
import UserTable from "@/components/features/staff/UserTable";
import { UserItem } from "@/components/features/staff/forms/AssignRoleForm";
import * as React from "react";

// Data demo users (roleId WAJIB ada)
const DEMO_USERS: UserItem[] = [
  {
    id: "u-001",
    name: "Rudi Hartono",
    email: "rudi@acme.id",
    roleId: "role-tech",
  },
  {
    id: "u-002",
    name: "Sari Puspita",
    email: "sari@acme.id",
    roleId: "role-admin",
  },
  {
    id: "u-003",
    name: "Dimas Saputra",
    email: "dimas@acme.id",
    roleId: "role-tech",
  },
  {
    id: "u-004",
    name: "Ayu Wulandari",
    email: "ayu@acme.id",
    roleId: "role-viewer",
  },
];

// Data demo roles (cek struktur via `satisfies` TANPA jadi readonly)
const DEMO_ROLES = [
  {
    id: "role-admin",
    name: "Admin",
    permissions: [
      "tickets.read",
      "tickets.write",
      "inventory.read",
      "inventory.write",
      "rbac.manage",
    ],
  },
  {
    id: "role-tech",
    name: "Technician",
    permissions: ["tickets.read", "tickets.write", "inventory.read"],
  },
  {
    id: "role-viewer",
    name: "Viewer",
    permissions: ["tickets.read", "inventory.read"],
  },
] satisfies RoleItem[];

// Kalau mau mutable dengan state (opsional)
export default function StaffPage() {
  const [users] = React.useState<UserItem[]>(DEMO_USERS);
  const [roles] = React.useState<RoleItem[]>(DEMO_ROLES);

  return (
    <div className="p-4 rounded-none border flex-1 m-4 mt-6 bg-[var(--mono-bg)] text-[var(--mono-fg)] border-[var(--mono-border)]">
      <UserTable users={users} roles={roles} title="Staff & Role Assignment" />
    </div>
  );
}
