// Nav TANPA ikon

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
  // route group () tidak muncul di URL
  { label: "Dashboard", href: "/sysadmin" },

  {
    group: true,
    label: "Tickets",
    children: [
      { label: "Tickets List", href: "/views/tickets" },
      { label: "Tickets History", href: "/views/tickets/history" },
      { label: "Works", href: "/views/tickets/works" },
    ],
  },

  {
    group: true,
    label: "Audit",
    children: [
      { label: "Ticket Audit Quality", href: "/views/audit/quality" },
      { label: "Repository", href: "/views/audit/repository" },
    ],
  },

  {
    group: true,
    label: "Inventory",
    children: [
      { label: "Inventory Items", href: "/inventory" },
      { label: "Stock Movements", href: "/views/inventory/movements" },
    ],
  },

  // Access Control
  {
    group: true,
    label: "Access Control",
    children: [
      { label: "RBAC (Roles & Permissions)", href: "/views/access/rbac" },
      { label: "Staff", href: "/views/access/staff" },
    ],
  },

  // 🆕 Pengaturan
  {
    group: true,
    label: "Pengaturan",
    children: [
      { label: "Akun", href: "/views/settings/account" },
      { label: "Dukungan Pengguna", href: "/views/settings/support" },
    ],
  },

  {
    group: true,
    label: "Miscellaneous",
    children: [
      { label: "System Builder", href: "/views/misc/system-builder" },
      { label: "RMA & Warranty", href: "/views/misc/rma" },
    ],
  },
];
