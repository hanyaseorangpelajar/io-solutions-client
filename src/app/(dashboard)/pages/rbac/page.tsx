// src/app/(dashboard)/pages/rbac/page.tsx
"use client";
import * as React from "react";
import RoleTable from "@/components/features/rbac/forms/RoleTable";

const DEMO_ROLES = [
  {
    id: "role-admin",
    name: "Admin",
    description: "Full access to manage tickets, inventory, and users.",
    permissions: [
      "ticket.read",
      "ticket.write",
      "inventory.read",
      "inventory.write",
      "user.manage",
    ],
    members: 2,
  },
  {
    id: "role-tech",
    name: "Technician",
    description: "Work on tickets and update progress.",
    permissions: ["ticket.read", "ticket.write", "inventory.read"],
    members: 5,
  },
  {
    id: "role-viewer",
    name: "Viewer",
    description: "Read-only access to tickets and KB.",
    permissions: ["ticket.read", "kb.read"],
    members: 3,
  },
];

export default function RBACPage() {
  return (
    <div className=" p-4 rounded-none border flex-1 m-4 mt-6 space-y-8 bg-[var(--mono-bg)] text-[var(--mono-fg)] border-[var(--mono-border)]">
      <RoleTable roles={DEMO_ROLES} />
    </div>
  );
}
