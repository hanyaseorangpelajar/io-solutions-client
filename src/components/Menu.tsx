"use client";

import { role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

type Role = "sysadmin" | "admin" | "teknisi";
type MenuItem = { icon: string; label: string; href: string; visible: Role[] };
type MenuGroup = { title: string; items: MenuItem[] };

const MENU_RAW: MenuGroup[] = [
  {
    title: "MENU",
    items: [
      { icon: "/home.png", label: "Beranda", href: "/", visible: ["sysadmin", "admin", "teknisi"] },
      { icon: "/notifications.png", label: "Notifikasi", href: "/notifications", visible: ["sysadmin", "admin", "teknisi"] },
      { icon: "/dot.png", label: "Logout", href: "/", visible: ["sysadmin", "admin", "teknisi"] },
    ],
  },
  {
    title: "INVENTORI",
    items: [
      { icon: "/products.png", label: "Gudang", href: "/inventory/products", visible: ["sysadmin", "admin"] },
      { icon: "/dot.png", label: "", href: "/", visible: ["sysadmin", "admin", "teknisi"] },
      { icon: "/dot.png", label: "", href: "/", visible: ["sysadmin", "admin", "teknisi"] },

    ],
  },
  {
    title: "SERVIS",
    items: [
      { icon: "/repairs.png", label: "Antrian Servis", href: "/service/queue", visible: ["sysadmin", "teknisi", "admin"] },
      { icon: "/diagnostics.png", label: "Diagnostik", href: "/service/diagnostics", visible: ["sysadmin", "teknisi"] },
      { icon: "/workorder.png", label: "Work Orders", href: "/service/work-orders", visible: ["sysadmin", "teknisi", "admin"] },
      { icon: "/spareparts.png", label: "Spare Part", href: "/service/spare-parts", visible: ["sysadmin", "teknisi", "admin"] },
      { icon: "/warranty.png", label: "Garansi / RMA", href: "/service/warranty", visible: ["sysadmin", "teknisi", "admin"] },
    ],
  },
  {
    title: "TRANSAKSI",
    items: [
      { icon: "/invoices.png", label: "Invoice", href: "/sales/invoices", visible: ["sysadmin", "admin"] },
      { icon: "/returns.png", label: "Retur", href: "/sales/returns", visible: ["sysadmin", "admin"] },
      { icon: "/discounts.png", label: "Diskon & Promo", href: "/sales/discounts", visible: ["sysadmin", "admin"] },
    ],
  },
  {
    title: "PENGGUNA & AKSES",
    items: [
      { icon: "/users.png", label: "Pengguna", href: "/admin/users", visible: ["sysadmin", "admin"] },
      { icon: "/role.png", label: "Roles & Permissions", href: "/admin/roles", visible: ["sysadmin"] },
      { icon: "/audit.png", label: "Audit Log", href: "/admin/audit-log", visible: ["sysadmin"] },
    ],
  },
  {
    title: "LAPORAN",
    items: [
      { icon: "/reports.png", label: "Laporan Penjualan", href: "/reports/sales", visible: ["sysadmin", "admin"] },
      { icon: "/reports.png", label: "Laporan Servis", href: "/reports/service", visible: ["sysadmin", "admin", "teknisi"] },
      { icon: "/reports.png", label: "Laporan Stok", href: "/reports/stock", visible: ["sysadmin", "admin"] },
      { icon: "/reports.png", label: "Laporan Keuangan", href: "/reports/finance", visible: ["sysadmin", "admin"] },
    ],
  },
  {
    title: "PENGATURAN",
    items: [
      { icon: "/settings.png", label: "Pengaturan Sistem", href: "/settings", visible: ["sysadmin"] },
      { icon: "/integrations.png", label: "Integrasi", href: "/settings/integrations", visible: ["sysadmin"] },
      { icon: "/log.png", label: "Log Aktivitas", href: "/settings/activity-log", visible: ["sysadmin"] },
    ],
  },
];

const LS_KEY = "menu-collapsed-state";

const Menu: React.FC = () => {
  // Filter sesuai role; sembunyikan section tanpa item
  const groups = React.useMemo(
    () =>
      MENU_RAW.map(g => ({ ...g, items: g.items.filter(it => it.visible.includes(role as Role)) }))
        .filter(g => g.items.length > 0),
    []
  );

  // Default SSR: semua section terbuka (hindari hydration mismatch)
  const defaultOpen = React.useMemo(
    () => Object.fromEntries(groups.map(g => [g.title, true])) as Record<string, boolean>,
    [groups]
  );

  const [openMap, setOpenMap] = React.useState<Record<string, boolean>>(defaultOpen);

  // Setelah mount, merge preferensi dari localStorage
  React.useEffect(() => {
    setOpenMap(defaultOpen);
    try {
      const saved = JSON.parse(localStorage.getItem(LS_KEY) || "{}") as Record<string, boolean>;
      setOpenMap(prev => ({ ...prev, ...saved }));
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultOpen]);

  const toggle = (title: string) =>
    setOpenMap(prev => {
      const next = { ...prev, [title]: !(prev[title] ?? true) };
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });

  return (
    <nav className="mt-4 text-sm bg-white text-black p-2 rounded-md">
      {groups.map(g => {
        const isOpen = openMap[g.title] ?? true;
        return (
          <section key={g.title} className="flex flex-col">
            {/* Header / Toggle */}
            <button
              type="button"
              onClick={() => toggle(g.title)}
              aria-expanded={isOpen}
              aria-controls={`panel-${g.title}`}
              className="flex items-center justify-between px-1 py-2 bg-white text-black hover:bg-black hover:text-white transition-colors"
            >
              <span className="font-light">{g.title}</span>
              <svg
                viewBox="0 0 24 24"
                className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {/* Items */}
            {isOpen && (
              <div id={`panel-${g.title}`} className="flex flex-col gap-1">
                {g.items.map(item => (
                  <Link
                    href={item.href}
                    key={item.label}
                    className="flex items-center justify-center lg:justify-start gap-3 py-2 md:px-2
                               text-black bg-white transition-colors hover:invert"
                  >
                    <Image
                      src={item.icon}
                      alt=""
                      width={18}
                      height={18}
                      className="dark-invert"
                      
                    />
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
