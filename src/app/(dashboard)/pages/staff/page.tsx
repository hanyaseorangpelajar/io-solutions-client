"use client";

import UserTable from "@/components/feat/UserTable";
import type { UserItem } from "@/components/organisms/AssignRoleForm";
import type { RoleItem } from "@/components/organisms/RoleForm";
import * as React from "react";

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

export default function StaffPage() {
  const [users] = React.useState<UserItem[]>(DEMO_USERS);
  const [roles] = React.useState<RoleItem[]>(DEMO_ROLES);

  return (
    <section className="section">
      <UserTable users={users} roles={roles} title="Staff & Role Assignment" />
    </section>
  );
}
