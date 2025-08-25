"use client";

import { role } from "@/lib/data";
import Link from "next/link";
import * as React from "react";
import type { SVGProps, ComponentType } from "react";

import {
  TicketIcon,
  ClockIcon,
  UserIcon,
  DocumentMagnifyingGlassIcon,
  BookOpenIcon,
  BuildingStorefrontIcon,
  ShoppingBagIcon,
  DocumentChartBarIcon,
  UserGroupIcon,
  KeyIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

type Role = "sysadmin" | "admin" | "teknisi";

// 1) Peta ikon (DRY & type-safe)
type IconComp = ComponentType<SVGProps<SVGSVGElement>>;
const icons = {
  ticket: TicketIcon,
  history: ClockIcon,
  person: UserIcon,

  audit: DocumentMagnifyingGlassIcon,
  knowledge: BookOpenIcon,

  gudang: BuildingStorefrontIcon,
  market: ShoppingBagIcon,

  report: DocumentChartBarIcon,

  member: UserGroupIcon,
  access: KeyIcon,

  settings: Cog6ToothIcon,
  logout: ArrowRightOnRectangleIcon,

  default: Squares2X2Icon,
} as const;

type IconKey = keyof typeof icons;

// 2) Data menu kini pakai key ikon, bukan path PNG
type MenuItem = { icon: IconKey; label: string; href: string; visible: Role[] };
type MenuGroup = { title: string; items: MenuItem[] };

const MENU_RAW: MenuGroup[] = [
  {
    title: "Servis Tiket",
    items: [
      {
        icon: "ticket",
        label: "Daftar Tiket",
        href: "/pages/daftar-tiket",
        visible: ["sysadmin", "admin", "teknisi"],
      },
      {
        icon: "history",
        label: "Riwayat Tiket",
        href: "/pages/riwayat-tiket",
        visible: ["sysadmin", "admin", "teknisi"],
      },
      {
        icon: "person",
        label: "Daftar Teknisi",
        href: "/pages/daftar-teknisi",
        visible: ["sysadmin", "admin", "teknisi"],
      },
    ],
  },
  {
    title: "Katalog",
    items: [
      {
        icon: "gudang",
        label: "Gudang",
        href: "/pages/inventory-gudang",
        visible: ["sysadmin", "admin", "teknisi"],
      },
      {
        icon: "history",
        label: "Riwayat Inventory",
        href: "/pages/riwayat-inventory",
        visible: ["sysadmin", "admin", "teknisi"],
      },
    ],
  },
  {
    title: "Pustaka",
    items: [
      {
        icon: "audit",
        label: "Audit Tiket",
        href: "/pages/audit-pengetahuan",
        visible: ["sysadmin", "admin", "teknisi"],
      },
      {
        icon: "knowledge",
        label: "Repository",
        href: "/pages/repository",
        visible: ["sysadmin", "admin", "teknisi"],
      },
    ],
  },
  {
    title: "Laporan",
    items: [
      {
        icon: "report",
        label: "Inventory",
        href: "/",
        visible: ["sysadmin", "admin", "teknisi"],
      },
      {
        icon: "report",
        label: "Layanan",
        href: "/",
        visible: ["sysadmin", "admin", "teknisi"],
      },
    ],
  },
  {
    title: "RBAC",
    items: [
      {
        icon: "member",
        label: "Staff",
        href: "/pages/staff",
        visible: ["sysadmin", "admin", "teknisi"],
      },
      {
        icon: "access",
        label: "Kontrol Pengguna",
        href: "/pages/rbac",
        visible: ["sysadmin", "admin", "teknisi"],
      },
    ],
  },
  {
    title: "Lain-Lain",
    items: [
      {
        icon: "settings",
        label: "Pengaturan",
        href: "/",
        visible: ["sysadmin", "admin", "teknisi"],
      },
      {
        icon: "logout",
        label: "Logout",
        href: "/",
        visible: ["sysadmin", "admin", "teknisi"],
      },
    ],
  },
];

const LS_KEY = "menu-active-title";

// 3) Komponen Icon kecil biar DRY
function Icon({ name, className }: { name: IconKey; className?: string }) {
  const Cmp = icons[name] ?? icons.default;
  return (
    <Cmp
      className={`w-5 h-5 text-neutral-300 group-hover:text-white transition-colors ${
        className ?? ""
      }`}
      aria-hidden="true"
    />
  );
}

const Menu: React.FC = () => {
  const groups = React.useMemo(
    () =>
      MENU_RAW.map((g) => ({
        ...g,
        items: g.items.filter((it) => it.visible.includes(role as Role)),
      })).filter((g) => g.items.length > 0),
    []
  );

  const defaultActive = React.useMemo(() => groups[0]?.title ?? "", [groups]);
  const [active, setActive] = React.useState<string>(defaultActive);

  React.useEffect(() => {
    setActive(defaultActive);
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved && groups.some((g) => g.title === saved)) setActive(saved);
    } catch {}
  }, [defaultActive, groups]);

  const toggle = (title: string) => {
    setActive((prev) => {
      const next = prev === title ? "" : title;
      try {
        localStorage.setItem(LS_KEY, next);
      } catch {}
      return next;
    });
  };

  return (
    <nav className="mt-4 text-sm bg-black text-white">
      {groups.map((g) => {
        const isOpen = active === g.title;
        return (
          <section key={g.title} className="flex flex-col">
            <button
              type="button"
              onClick={() => toggle(g.title)}
              aria-expanded={isOpen}
              aria-controls={`panel-${g.title}`}
              className="flex items-center justify-between px-1 py-2 text-white hover:bg-black transition-colors"
            >
              <span className="font-light">{g.title}</span>
              <svg
                viewBox="0 0 24 24"
                className={`h-4 w-4 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {isOpen && (
              <div id={`panel-${g.title}`} className="flex flex-col gap-1">
                {g.items.map((item) => (
                  <Link
                    href={item.href}
                    key={item.label}
                    className="group flex items-center justify-center lg:justify-start gap-3 py-2 md:px-2
                               text-neutral-200 hover:text-white hover:bg-neutral-900 transition-colors"
                  >
                    <Icon name={item.icon} />
                    <span className="hidden lg:block">{item.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        );
      })}
    </nav>
  );
};

export default Menu;
