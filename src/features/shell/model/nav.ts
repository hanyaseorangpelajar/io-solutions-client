export type UserRole = "Teknisi" | "Admin" | "SysAdmin";

export type NavItem = {
  label: string;
  href?: string;
  group?: boolean;
  children?: NavItem[];
  roles?: UserRole[];
};

export function isGroup(
  item: NavItem
): item is NavItem & { group: true; children: NavItem[] } {
  return !!item.group && Array.isArray(item.children);
}

export const MASTER_NAV: NavItem[] = [
  { label: "Dashboard", href: "/sysadmin", roles: ["Admin", "SysAdmin"] },

  {
    group: true,
    label: "Access Control",
    roles: ["SysAdmin"],
    children: [
      { label: "Staff", href: "/views/access/staff", roles: ["SysAdmin"] },
      {
        label: "Roles & Permissions",
        href: "/views/access/rbac",
        roles: ["SysAdmin"],
      },
    ],
  },

  {
    group: true,
    label: "Audit",
    roles: ["Admin", "SysAdmin"],
    children: [
      {
        label: "Repository",
        href: "/views/audit/repository",
        roles: ["Admin", "SysAdmin"],
      },
      {
        label: "Ticket Audit Quality",
        href: "/views/audit/quality",
        roles: ["Admin", "SysAdmin"],
      },
    ],
  },

  {
    group: true,
    label: "Inventory",
    roles: ["Teknisi", "Admin", "SysAdmin"],
    children: [
      {
        label: "Inventory Items",
        href: "/views/inventory/items",
        roles: ["Teknisi", "Admin", "SysAdmin"],
      },
      {
        label: "Stock Movements",
        href: "/views/inventory/movements",
        roles: ["Admin", "SysAdmin"],
      },
    ],
  },

  {
    group: true,
    label: "Laporan",
    roles: ["Admin", "SysAdmin"],
    children: [
      {
        label: "Inventory",
        href: "/views/reports/inventory",
        roles: ["Admin", "SysAdmin"],
      },
      {
        label: "Ringkasan",
        href: "/views/reports/overview",
        roles: ["Admin", "SysAdmin"],
      },
      {
        label: "RMA & Warranty",
        href: "/views/reports/rma",
        roles: ["Admin", "SysAdmin"],
      },
      {
        label: "Tickets",
        href: "/views/reports/tickets",
        roles: ["Admin", "SysAdmin"],
      },
    ],
  },

  {
    group: true,
    label: "Tickets",
    roles: ["Teknisi", "Admin", "SysAdmin"],
    children: [
      {
        label: "Tickets List",
        href: "/views/tickets/list",
        roles: ["Teknisi", "Admin", "SysAdmin"],
      },
      {
        label: "Audit Log",
        href: "/views/tickets/history",
        roles: ["Admin", "SysAdmin"],
      },
      {
        label: "My Work",
        href: "/views/tickets/works",
        roles: ["Teknisi", "Admin"],
      },
    ],
  },

  {
    group: true,
    label: "Miscellaneous",
    roles: ["Teknisi", "Admin", "SysAdmin"],
    children: [
      {
        label: "RMA & Warranty",
        href: "/views/misc/rma",
        roles: ["Teknisi", "Admin", "SysAdmin"],
      },
      {
        label: "System Builder",
        href: "/views/misc/system-builder",
        roles: ["Admin", "SysAdmin"],
      },
    ],
  },

  {
    group: true,
    label: "Pengaturan",
    roles: ["Teknisi", "Admin", "SysAdmin"],
    children: [
      {
        label: "Akun",
        href: "/views/settings/account",
        roles: ["Teknisi", "Admin", "SysAdmin"],
      },
      {
        label: "Dukungan Pengguna",
        href: "/views/settings/support",
        roles: ["Teknisi", "Admin", "SysAdmin"],
      },
    ],
  },
];

/**
 * Helper rekursif untuk memfilter item navigasi berdasarkan peran pengguna.
 */
export function filterNavItemsByRole(
  items: NavItem[],
  userRole: UserRole
): NavItem[] {
  if (!Array.isArray(items)) return [];

  return items.reduce((acc: NavItem[], item) => {
    const isAllowed = !item.roles || item.roles.includes(userRole);

    if (isAllowed) {
      if (item.group && item.children) {
        const filteredChildren = filterNavItemsByRole(item.children, userRole);
        if (filteredChildren.length > 0) {
          acc.push({ ...item, children: filteredChildren });
        }
      } else {
        acc.push(item);
      }
    }
    return acc;
  }, []);
}
