// src/app/(dashboard)/pages/repository/page.tsx
"use client";

import * as React from "react";
import FormModal from "@/components/overlays/FormModal";
import TableToolbar from "@/components/data-display/table/TableToolbar";
import Pagination from "@/components/data-display/table/Pagination";
import PublishKBForm from "@/components/features/knowledge-base/forms/PublishKBForm";
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

type Visibility = "internal" | "public";
type Category = "hardware" | "software" | "network" | "printer" | "other";

type Article = {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  category: Category;
  visibility: Visibility;
  updatedAt: string; // YYYY-MM-DD
  author?: string;
};

// NOTE: unikkan id agar tidak bentrok (React key warning)
const demoArticles: Article[] = [
  {
    id: "KB-2025-0001",
    title: "ASUS X455L mati total — short MOSFET 3V/5V",
    summary:
      "Unit tidak menyala. Ditemukan short pada rail 3V/5V, ganti MOSFET AO4407, verifikasi dengan burn-in 2 jam.",
    tags: ["asus", "x455l", "short", "mosfet", "3v5v", "mati-total"],
    category: "hardware",
    visibility: "internal",
    updatedAt: "2025-08-01",
    author: "Rudi H.",
  },
  {
    id: "KB-2025-0002",
    title: "Windows tidak bisa update — perbaikan komponen WU",
    summary:
      "Memperbaiki layanan Windows Update (WU) yang korup, reset komponen WU, clear cache, re-register DLL.",
    tags: ["windows", "update", "wu", "software"],
    category: "software",
    visibility: "public",
    updatedAt: "2025-08-02",
    author: "Sari P.",
  },
  {
    id: "KB-2025-0003",
    title: "Printer tidak terdeteksi — fix port & driver",
    summary:
      "Reinstall driver, pastikan service spooler aktif, ganti port USB, uji test page & share via network.",
    tags: ["printer", "driver", "spooler"],
    category: "printer",
    visibility: "internal",
    updatedAt: "2025-07-29",
    author: "Dimas S.",
  },
  {
    id: "KB-2025-0004",
    title: "Optimasi jaringan kantor — segmentasi VLAN dasar",
    summary:
      "Membagi jaringan kantor ke beberapa VLAN untuk isolasi traffic, menurunkan broadcast storm dan menaikkan keamanan.",
    tags: ["network", "vlan", "switch"],
    category: "network",
    visibility: "internal",
    updatedAt: "2025-07-28",
    author: "Rudi H.",
  },
  {
    id: "KB-2025-0005",
    title: "BSOD acak — analisis dump & update driver chipset",
    summary:
      "Analisa minidump menunjuk pada driver chipset lama. Update driver + verifikasi stress test 4 jam.",
    tags: ["windows", "bsod", "driver"],
    category: "software",
    visibility: "public",
    updatedAt: "2025-08-03",
    author: "Sari P.",
  },
  {
    id: "KB-2025-0006",
    title: "Thermal throttling — re-paste & pembersihan heatsink",
    summary:
      "Temperatur CPU/GPU tinggi. Lakukan re-paste, bersihkan heatsink & kipas, ganti thermal pad VRM.",
    tags: ["hardware", "thermal", "heatsink"],
    category: "hardware",
    visibility: "internal",
    updatedAt: "2025-08-01",
    author: "Dimas S.",
  },
  {
    id: "KB-2025-0007",
    title: "Scan to Network Folder (SMB) — setting printer MFP",
    summary:
      "Aktifkan SMBv2, buat user khusus, mapping folder share dengan permission terbatas, uji dari MFP.",
    tags: ["printer", "smb", "scan"],
    category: "printer",
    visibility: "public",
    updatedAt: "2025-07-27",
    author: "Rudi H.",
  },
  {
    id: "KB-2025-0008",
    title: "WLAN lemot — channel overlap & band steering",
    summary:
      "Survey kanal, pindah ke channel non-overlap, aktifkan band steering 2.4/5 GHz, optimalkan tx power.",
    tags: ["network", "wifi", "channel"],
    category: "network",
    visibility: "public",
    updatedAt: "2025-07-26",
    author: "Sari P.",
  },
  {
    id: "KB-2025-0009",
    title: "Dual boot Windows/Linux — perbaiki GRUB hilang",
    summary:
      "Restore GRUB via live USB, update fstab & grub.cfg, pastikan boot order UEFI benar.",
    tags: ["linux", "grub", "dual-boot"],
    category: "other",
    visibility: "internal",
    updatedAt: "2025-07-25",
    author: "Dimas S.",
  },
];

const cardCls =
  "relative flex flex-col border border-[var(--mono-border)] bg-[var(--mono-bg)] text-[var(--mono-fg)]";

const metaItem =
  "px-2 py-1 border border-[var(--mono-border)] text-[10px] uppercase tracking-widest";
const tagChip =
  "px-2 py-0.5 text-[10px] border border-[var(--mono-border)] bg-[var(--mono-bg)] text-[var(--mono-fg)]";

export default function RepositoryPage() {
  return (
    <div className="bg-[var(--mono-bg)] text-[var(--mono-fg)] p-4 rounded-none border border-[var(--mono-border)] flex-1 m-4 mt-6">
      {/* TOP */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="hidden md:block text-lg font-semibold">
          Repository Pengetahuan
        </h1>
        <TableToolbar searchPlaceholder="Cari artikel…" />
      </div>

      {/* GRID: 1 / 2 / 3 kolom (maks 3 per baris), tanpa hover warna kartu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {demoArticles.map((a) => (
          <article key={a.id} className={cardCls}>
            {/* Header */}
            <div className="p-3 border-b border-[var(--mono-border)]">
              <h2 className="text-sm font-semibold leading-snug line-clamp-2">
                {a.title}
              </h2>
              <div className="m-2 flex flex-wrap gap-1">
                {a.tags.map((t) => (
                  <span key={t} className={tagChip}>
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="p-3">
              <p className="text-sm leading-relaxed opacity-90">{a.summary}</p>
            </div>

            {/* Meta */}
            <div className="px-3 pb-3">
              <div className="flex flex-wrap gap-1">
                <span className={metaItem}>#{a.category}</span>
                <span className={metaItem}>{a.visibility}</span>
                <span className={metaItem}>Updated {a.updatedAt}</span>
                {a.author && <span className={metaItem}>By {a.author}</span>}
              </div>
            </div>

            {/* Actions (pakai variant ghost; ikon mengikuti warna currentColor) */}
            <div className="mt-auto px-3 py-2 border-t border-[var(--mono-border)] flex items-center justify-end gap-2">
              <FormModal
                type="read"
                entityTitle="Artikel"
                component={PublishKBForm as any}
                data={a}
                variant="ghost"
                triggerClassName="w-8 h-8"
                icon={<EyeIcon className="w-4 h-4" />}
              />
              <FormModal
                type="update"
                entityTitle="Artikel"
                component={PublishKBForm as any}
                data={a}
                variant="ghost"
                triggerClassName="w-8 h-8"
                icon={<PencilSquareIcon className="w-4 h-4" />}
              />
              <FormModal
                type="delete"
                entityTitle="Artikel"
                id={a.id}
                variant="ghost"
                triggerClassName="w-8 h-8"
                icon={<TrashIcon className="w-4 h-4" />}
              />
            </div>
          </article>
        ))}
      </div>

      {/* PAGINATION */}
      <Pagination />
    </div>
  );
}
