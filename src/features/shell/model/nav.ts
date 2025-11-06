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
  { label: "Dashboard", href: "/sysadmin", roles: ["SysAdmin"] },
  { label: "Dashboard", href: "/admin", roles: ["Admin"] },
  { label: "Dashboard", href: "/teknisi", roles: ["Teknisi"] },

  { label: "Staff", href: "/views/access/staff", roles: ["Admin"] },
  {
    label: "Daftar Ticket",
    href: "/views/tickets/list",
    roles: ["Admin"],
  },
  {
    label: "Review Ticket Quality",
    href: "/views/audit/quality",
    roles: ["Admin"],
  },
  {
    label: "Pekerjaan Saya",
    href: "/views/tickets/works",
    roles: ["Teknisi"],
  },
  {
    label: "Pustaka Solusi Ticket",
    href: "/views/audit/repository",
    roles: ["Admin", "Teknisi"],
  },
  {
    label: "Log Aktivitas Ticket",
    href: "/views/tickets/history",
    roles: ["Admin", "Teknisi"],
  },
  {
    label: "Profile",
    href: "/views/settings/account",
    roles: ["Teknisi", "Admin"],
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
