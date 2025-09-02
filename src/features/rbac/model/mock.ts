import type { Role } from "./types";

export const PERMISSIONS: string[] = [
  // Tickets
  "tickets.read",
  "tickets.create",
  "tickets.update",
  "tickets.resolve",
  "tickets.audit",
  "tickets.repository",
  // Inventory
  "inventory.read",
  "inventory.write",
  "inventory.stockmove",
  // Misc
  "system.builder",
  "rma.read",
  "rma.write",
  // Access
  "rbac.manage",
  "staff.manage",
];

export const MOCK_ROLES: Role[] = [
  {
    id: "role-admin",
    name: "Administrator",
    description: "Akses penuh sistem",
    permissions: [...PERMISSIONS],
    system: true,
  },
  {
    id: "role-technician",
    name: "Technician",
    description: "Fokus pengerjaan & resolusi tiket",
    permissions: [
      "tickets.read",
      "tickets.update",
      "tickets.resolve",
      "inventory.read",
      "inventory.stockmove",
      "repository.read",
    ].filter(Boolean) as string[],
  },
  {
    id: "role-viewer",
    name: "Viewer",
    description: "Hanya baca",
    permissions: ["tickets.read", "inventory.read", "rma.read"],
  },
];

export function getRoleById(id: string) {
  return MOCK_ROLES.find((r) => r.id === id);
}
