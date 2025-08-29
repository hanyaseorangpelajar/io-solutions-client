import type { ReactNode } from "react";

export type NavItem = {
  label: string;
  href?: string;
  icon?: ReactNode;
  children?: NavItem[];
  group?: boolean;
};

export const defaultNav: NavItem[] = [
  { label: "SysAdmin", href: "/sysadmin" },
  {
    label: "Tickets",
    group: true,
    children: [
      { label: "Works", href: "/views/tickets/my" },
      { label: "Tickets List", href: "/views/tickets" },
      { label: "Tickets History", href: "/views/tickets/history" },
    ],
  },

  {
    label: "Audit",
    group: true,
    children: [
      { label: "Ticket Audit Quality", href: "/views/audit/quality" },
      { label: "Repository", href: "/views/audit/repository" },
    ],
  },

  {
    label: "Inventory",
    group: true,
    children: [
      { label: "Items", href: "/views/inventory/items" },
      { label: "Stock Movements", href: "/views/inventory/movements" },
    ],
  },

  // Nanti: SystemSolution (PC/Server/IoT build templates) — akan dibuat sebagai group baru di sini.
];
