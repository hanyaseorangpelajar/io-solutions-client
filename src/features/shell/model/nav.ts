export type NavItem = {
  label: string;
  href?: string;
  group?: boolean;
  children?: NavItem[];
};

export function isGroup(
  item: NavItem
): item is NavItem & { group: true; children: NavItem[] } {
  return !!item.group && Array.isArray(item.children);
}

export const SYSADMIN_NAV: NavItem[] = [
  { label: "Dashboard", href: "/sysadmin" },
  {
    group: true,
    label: "Access Control",
    children: [
      { label: "Staff", href: "/views/access/staff" },
      { label: "Roles & Permissions", href: "/views/access/rbac" },
    ],
  },

  {
    group: true,
    label: "Audit",
    children: [
      { label: "Repository", href: "/views/audit/repository" },
      { label: "Ticket Audit Quality", href: "/views/audit/quality" },
    ],
  },

  {
    group: true,
    label: "Inventory",
    children: [
      { label: "Inventory Items", href: "/views/inventory/items" },
      { label: "Stock Movements", href: "/views/inventory/movements" },
    ],
  },

  {
    group: true,
    label: "Laporan",
    children: [
      { label: "Inventory", href: "/views/reports/inventory" },
      { label: "Ringkasan", href: "/views/reports/overview" },
      { label: "RMA & Warranty", href: "/views/reports/rma" },
      { label: "Tickets", href: "/views/reports/tickets" },
    ],
  },

  {
    group: true,
    label: "Tickets",
    children: [
      { label: "Tickets List", href: "/views/tickets/list" },
      { label: "Tickets History", href: "/views/tickets/history" },
      { label: "Works", href: "/views/tickets/works" },
    ],
  },

  {
    group: true,
    label: "Miscellaneous",
    children: [
      { label: "RMA & Warranty", href: "/views/misc/rma" },
      { label: "System Builder", href: "/views/misc/system-builder" },
    ],
  },
  {
    group: true,
    label: "Pengaturan",
    children: [
      { label: "Akun", href: "/views/settings/account" },
      { label: "Dukungan Pengguna", href: "/views/settings/support" },
    ],
  },
];
