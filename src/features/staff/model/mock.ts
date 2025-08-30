import type { Staff } from "./types";

export const MOCK_STAFF: Staff[] = [
  {
    id: "u-1",
    name: "Sysadmin",
    email: "sysadmin@example.com",
    active: true,
    roleIds: ["role-admin"],
  },
  {
    id: "u-2",
    name: "Teknisi A",
    email: "tech.a@example.com",
    phone: "0812-0000-1111",
    active: true,
    roleIds: ["role-technician"],
  },
  {
    id: "u-3",
    name: "Viewer",
    email: "viewer@example.com",
    active: false,
    roleIds: ["role-viewer"],
  },
];
