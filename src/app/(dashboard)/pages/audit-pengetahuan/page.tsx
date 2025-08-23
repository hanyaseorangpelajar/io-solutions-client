// src/app/(dashboard)/pages/audit-pengetahuan/page.tsx
"use client";

import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableToolbar from "@/components/TableToolbar";
import AuditPengetahuanForm from "@/components/forms/AuditPengetahuanForm";
import PublishKBForm from "@/components/forms/PublishKBForm";
import {
  EyeIcon,
  PencilSquareIcon,
  BookOpenIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
type AuditStatus = "PENDING" | "READY" | "PUBLISHED";

type AuditItem = {
  id: string;
  ticketId: string;
  title: string;
  priority: TicketPriority;
  technician?: string;
  closedAt: string;
  tags: string[];
  auditStatus: AuditStatus;
};

const columns = [
  { header: "Ticket", accessor: "ticket" },
  {
    header: "Priority",
    accessor: "priority",
    className: "hidden md:table-cell",
  },
  {
    header: "Technician",
    accessor: "technician",
    className: "hidden lg:table-cell",
  },
  { header: "Tags", accessor: "tags", className: "hidden md:table-cell" },
  {
    header: "Status",
    accessor: "auditStatus",
    className: "hidden md:table-cell",
  },
  { header: "Closed", accessor: "closedAt", className: "hidden md:table-cell" },
  { header: "Actions", accessor: "action" },
];

// Demo data
const rows: AuditItem[] = [
  {
    id: "AUD-001",
    ticketId: "TCK-2025-000123",
    title: "Laptop tidak menyala (ASUS X455L)",
    priority: "HIGH",
    technician: "Rudi",
    closedAt: "2025-07-30",
    tags: ["power", "mainboard", "asus"],
    auditStatus: "PENDING",
  },
  {
    id: "AUD-002",
    ticketId: "TCK-2025-000124",
    title: "Install ulang OS (Windows 11)",
    priority: "MEDIUM",
    technician: "Sari",
    closedAt: "2025-07-31",
    tags: ["windows", "install", "driver"],
    auditStatus: "READY",
  },
  {
    id: "AUD-003",
    ticketId: "TCK-2025-000125",
    title: "Ganti keyboard (Lenovo)",
    priority: "LOW",
    technician: "Dimas",
    closedAt: "2025-08-02",
    tags: ["keyboard", "lenovo", "sparepart"],
    auditStatus: "PUBLISHED",
  },
];

export default function AuditPengetahuanPage() {
  const renderRow = (item: AuditItem) => {
    const shownTags = item.tags.slice(0, 2);
    const more = item.tags.length - shownTags.length;

    return (
      <tr
        key={item.id}
        className="group text-sm hover:bg-black hover:text-white"
      >
        {/* Ticket */}
        <td className="p-4">
          <div className="flex flex-col">
            <span className="font-medium">{item.title}</span>
            <span className="text-xs">{item.ticketId}</span>
          </div>
        </td>

        <td className="hidden md:table-cell">{item.priority}</td>
        <td className="hidden lg:table-cell">{item.technician ?? "-"}</td>

        {/* Tags: chip tetap putih+hitam saat row hover */}
        <td className="hidden md:table-cell">
          <div className="flex flex-wrap gap-1">
            {shownTags.map((t) => (
              <span
                key={t}
                className="
                  px-2 py-0.5 text-[10px] border border-black
                  bg-white text-black
                  group-hover:bg-white group-hover:text-black
                "
              >
                #{t}
              </span>
            ))}
            {more > 0 && (
              <span
                className="
                  px-2 py-0.5 text-[10px] border border-black
                  bg-white text-black
                  group-hover:bg-white group-hover:text-black
                "
              >
                +{more}
              </span>
            )}
          </div>
        </td>

        <td className="hidden md:table-cell">{item.auditStatus}</td>
        <td className="hidden md:table-cell">{item.closedAt}</td>

        {/* Actions: tombol ikut invert saat row hover */}
        <td>
          <div className="flex items-center gap-2">
            <FormModal
              type="read"
              entityTitle="Audit"
              component={AuditPengetahuanForm}
              data={item}
              triggerClassName="w-8 h-8 group-hover:bg-white group-hover:text-black"
              icon={
                <EyeIcon className="w-4 h-4 text-white group-hover:text-black" />
              }
            />
            <FormModal
              type="update"
              entityTitle="Audit"
              component={AuditPengetahuanForm}
              data={item}
              triggerClassName="w-8 h-8 group-hover:bg-white group-hover:text-black"
              icon={
                <PencilSquareIcon className="w-4 h-4 text-white group-hover:text-black" />
              }
            />
            <FormModal
              type="create"
              title="Publish ke Basis Pengetahuan"
              entityTitle="Artikel"
              component={PublishKBForm}
              data={item}
              triggerClassName="w-8 h-8 group-hover:bg-white group-hover:text-black"
              icon={
                <BookOpenIcon className="w-4 h-4 text-white group-hover:text-black" />
              }
            />
            <FormModal
              type="delete"
              entityTitle="Audit"
              id={item.id}
              triggerClassName="w-8 h-8 group-hover:bg-white group-hover:text-black"
              icon={
                <TrashIcon className="w-4 h-4 text-white group-hover:text-black" />
              }
            />
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white text-black p-4 rounded-none border border-black flex-1 m-4 mt-6">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          Audit Pengetahuan
        </h1>
        <TableToolbar searchPlaceholder="Cari tiket tertutup…" />
      </div>

      <Table columns={columns} renderRow={renderRow} data={rows} />

      <Pagination />
    </div>
  );
}
