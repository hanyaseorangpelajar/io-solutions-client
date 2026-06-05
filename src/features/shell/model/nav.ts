import type { AuthRole } from "@/features/auth/model/types";

export type UserRole = AuthRole;

export type NavItem = {
  label: string;
  href?: string;
  group?: boolean;
  children?: NavItem[];
  roles?: UserRole[];
  id?: string;
};

export function isGroup(
  item: NavItem,
): item is NavItem & { group: true; children: NavItem[] } {
  return !!item.group && Array.isArray(item.children);
}

export const MASTER_NAV: NavItem[] = [
  { label: "Dashboard", href: "/sysadmin", roles: ["SYSADMIN"] },
  { label: "Dashboard", href: "/admin", roles: ["ADMIN"] },
  { label: "Dashboard", href: "/teknisi", roles: ["TEKNISI"] },
  {
    group: true,
    label: "Pusat Akun",
    roles: ["ADMIN"],
    children: [
      { label: "Daftar Staff", href: "/views/access/staff", roles: ["ADMIN"] },
    ],
  },
  {
    group: true,
    label: "Pusat Tiket",
    roles: ["ADMIN", "TEKNISI"],
    children: [
      {
        label: "Daftar Tiket",
        href: "/views/tickets/list",
        roles: ["ADMIN"],
      },
      {
        label: "Pekerjaan Saya",
        href: "/views/tickets/works",
        roles: ["TEKNISI"],
      },
      {
        label: "Log Ticket",
        href: "/views/tickets/history",
        roles: ["ADMIN", "TEKNISI"],
      },
    ],
  },
  {
    group: true,
    label: "Pusat Pustaka",
    roles: ["ADMIN", "TEKNISI"],
    children: [
      {
        label: "Pustaka Solusi Ticket",
        href: "/views/audit/repository",
        roles: ["ADMIN", "TEKNISI"],
      },
      {
        label: "Daftar Pelanggan",
        href: "/views/customers/list",
        roles: ["ADMIN", "TEKNISI"],
      },
    ],
  },
  {
    group: true,
    label: "Pengaturan Akun",
    roles: ["ADMIN", "TEKNISI"],
    children: [
      {
        label: "Profile",
        href: "/views/settings/account",
        roles: ["TEKNISI", "ADMIN"],
      },
      {
        label: "Logout",
        id: "logout",
        roles: ["TEKNISI", "ADMIN", "SYSADMIN"],
      },
    ],
  },
];

export function filterNavItemsByRole(
  items: NavItem[],
  userRole: UserRole,
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
