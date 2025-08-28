import type { ReactNode } from "react";

export type NavItem = {
  label: string;
  href?: string; // kosong untuk node "group" (section header)
  icon?: ReactNode;
  children?: NavItem[];
  group?: boolean; // jika true → header group (non-clickable)
};

/** Struktur default sidebar (kelompok/section) */
export const defaultNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "SysAdmin", href: "/sysadmin" },

  {
    label: "Tickets",
    group: true,
    children: [
      { label: "My Work", href: "/views/tickets/my" },
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
];
