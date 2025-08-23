"use client";

import { role } from "@/lib/data";
import Link from "next/link";
import * as React from "react";
import type { SVGProps, ComponentType } from "react";

import {
  CpuChipIcon,
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
type MenuItem = { icon: string; label: string; href: string; visible: Role[] };
type MenuGroup = { title: string; items: MenuItem[] };

const MENU_RAW: MenuGroup[] = [
  {
    title: "Servis Tiket",
    items: [
      {
        icon: "/icons/ticket.png",
        label: "Daftar Tiket",
        href: "/pages/daftar-tiket",
        visible: ["sysadmin", "admin", "teknisi"],
      },
      {
        icon: "/icons/history.png",
        label: "Riwayat Tiket",
        href: "/pages/riwayat-tiket",
        visible: ["sysadmin", "admin", "teknisi"],
      },
      {
        icon: "/icons/person.png",
        label: "Daftar Teknisi",
        href: "/pages/daftar-teknisi",
        visible: ["sysadmin", "admin", "teknisi"],
      },
    ],
  },
  {
    title: "Pustaka",
    items: [
      {
        icon: "/icons/audit.png",
        label: "Audit Tiket",
        href: "/pages/audit-pengetahuan",
        visible: ["sysadmin", "admin", "teknisi"],
      },
      {
        icon: "/icons/knowledge.png",
        label: "Repository",
        href: "/",
        visible: ["sysadmin", "admin", "teknisi"],
      },
    ],
  },
  {
    title: "Katalog",
    items: [
      {
        icon: "/icons/gudang.png",
        label: "Gudang",
        href: "/",
        visible: ["sysadmin", "admin", "teknisi"],
      },
      {
        icon: "/icons/market.png",
        label: "Market",
        href: "/",
        visible: ["sysadmin", "admin", "teknisi"],
      },
    ],
  },
  {
    title: "Laporan",
    items: [
      {
        icon: "/icons/report.png",
        label: "Inventory",
        href: "/",
        visible: ["sysadmin", "admin", "teknisi"],
      },
      {
        icon: "/icons/report.png",
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
        icon: "/icons/member.png",
        label: "Staff",
        href: "/",
        visible: ["sysadmin", "admin", "teknisi"],
      },
      {
        icon: "/icons/access.png",
        label: "Kontrol Pengguna",
        href: "/",
        visible: ["sysadmin", "admin", "teknisi"],
      },
    ],
  },
  {
    title: "Lain-Lain",
    items: [
      {
        icon: "/icons/settings.png",
        label: "Pengaturan",
        href: "/",
        visible: ["sysadmin", "admin", "teknisi"],
      },
      {
        icon: "/icons/logout.png",
        label: "Logout",
        href: "/",
        visible: ["sysadmin", "admin", "teknisi"],
      },
    ],
  },
];

const LS_KEY = "menu-active-title";

type IconComp = ComponentType<SVGProps<SVGSVGElement>>;

const iconMap: Record<string, IconComp> = {
  ticket: CpuChipIcon,
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
};

function renderIcon(src: string) {
  const key = src.split("/").pop()?.split(".")[0] || "";
  const Icon = iconMap[key] ?? Squares2X2Icon;
  return (
    <Icon
      className="w-5 h-5 text-neutral-300 group-hover:text-white transition-colors"
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
                    {renderIcon(item.icon)}
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
