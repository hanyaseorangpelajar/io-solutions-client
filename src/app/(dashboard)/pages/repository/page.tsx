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
];

const cardCls =
  "relative flex flex-col border border-black bg-white text-black";

const metaItem =
  "px-2 py-1 border border-black text-[10px] uppercase tracking-widest";
const tagChip = "px-2 py-0.5 text-[10px] border border-black bg-white";

const actionIcon = "w-4 h-4 text-white group-hover:text-black transition";

export default function RepositoryPage() {
  return (
    <div className="bg-white text-black p-4 rounded-none border border-black flex-1 m-4 mt-6">
      {/* TOP */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="hidden md:block text-lg font-semibold">
          Repository Pengetahuan
        </h1>
        <TableToolbar searchPlaceholder="Cari artikel…" />
      </div>

      {/* GRID: 1 / 2 / 3 kolom (maks 3 per baris) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {demoArticles.map((a) => (
          <article key={a.id} className={cardCls}>
            {/* Header */}
            <div className="p-3 border-b border-black">
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

            {/* Actions */}
            <div className="mt-auto px-3 py-2 border-t border-black flex items-center justify-end gap-2">
              <FormModal
                type="read"
                entityTitle="Artikel"
                component={PublishKBForm as any}
                data={a}
                triggerClassName="w-8 h-8"
                icon={<EyeIcon className={actionIcon} />}
              />
              <FormModal
                type="update"
                entityTitle="Artikel"
                component={PublishKBForm as any}
                data={a}
                triggerClassName="w-8 h-8"
                icon={<PencilSquareIcon className={actionIcon} />}
              />
              <FormModal
                type="delete"
                entityTitle="Artikel"
                id={a.id}
                triggerClassName="w-8 h-8"
                icon={<TrashIcon className={actionIcon} />}
              />
            </div>
          </article>
        ))}
      </div>

      {/* PAGINATION (UI-only, konsisten dengan halaman lain) */}
      <Pagination />
    </div>
  );
}
