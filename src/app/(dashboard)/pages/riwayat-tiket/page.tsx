// src/app/(dashboard)/pages/riwayat-tiket/page.tsx
"use client";

import FormModal from "@/components/molecules/FormModal";
import Pagination from "@/components/molecules/Pagination";
import Table, { type TableColumn } from "@/components/organisms/Table";
import TableToolbar from "@/components/organisms/TableToolbar";
import TicketForm from "@/components/organisms/TicketForm";
import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import * as React from "react";

type TicketStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "WAITING_PARTS"
  | "COMPLETED"
  | "CANCELED";
type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
type TicketChannel = "WALK_IN" | "PHONE" | "WHATSAPP" | "ONLINE";

type TicketHistory = {
  id: string; // TCK-2025-000123
  title: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignedTo?: string;
  channel: TicketChannel;
  storeLocation?: string;
  createdAt: string; // YYYY-MM-DD
  closedAt?: string; // YYYY-MM-DD
};

const columns: TableColumn[] = [
  { header: "Ticket", accessor: "ticket" },
  { header: "Status", accessor: "status", className: "hidden md:table-cell" },
  {
    header: "Priority",
    accessor: "priority",
    className: "hidden md:table-cell",
  },
  {
    header: "Technician",
    accessor: "assignedTo",
    className: "hidden lg:table-cell",
  },
  { header: "Closed", accessor: "closedAt", className: "hidden md:table-cell" },
  { header: "Actions", accessor: "action" },
];

// Demo data — ganti dengan data backend saat integrasi
const historyData: TicketHistory[] = [
  {
    id: "TCK-2025-000123",
    title: "Laptop tidak menyala",
    status: "COMPLETED",
    priority: "HIGH",
    assignedTo: "Rudi",
    channel: "WALK_IN",
    storeLocation: "Cabang A",
    createdAt: "2025-07-28",
    closedAt: "2025-07-30",
  },
  {
    id: "TCK-2025-000124",
    title: "Install ulang OS",
    status: "COMPLETED",
    priority: "MEDIUM",
    assignedTo: "Sari",
    channel: "ONLINE",
    storeLocation: "Cabang B",
    createdAt: "2025-07-29",
    closedAt: "2025-07-31",
  },
  {
    id: "TCK-2025-000125",
    title: "Ganti keyboard",
    status: "CANCELED",
    priority: "LOW",
    assignedTo: "Dimas",
    channel: "WHATSAPP",
    storeLocation: "Cabang A",
    createdAt: "2025-08-01",
    closedAt: "2025-08-02",
  },
];

export default function TicketHistoryPage() {
  const renderRow = (item: TicketHistory) => (
    <tr key={item.id} className="group/row text-sm row-hover">
      {/* Ticket (gabung title + id) */}
      <td className="p-4">
        <div className="flex flex-col">
          <span className="font-medium">{item.title}</span>
          <span className="text-xs text-[var(--mono-muted)] group-hover/row:text-[var(--mono-bg)]">
            {item.id}
          </span>
        </div>
      </td>

      <td className="hidden md:table-cell">{item.status}</td>
      <td className="hidden md:table-cell">{item.priority}</td>
      <td className="hidden lg:table-cell">{item.assignedTo ?? "-"}</td>
      <td className="hidden md:table-cell">{item.closedAt ?? "-"}</td>

      {/* Actions: READ & DELETE */}
      <td>
        <div className="flex items-center gap-2">
          <FormModal
            type="read"
            entityTitle="Tiket"
            component={TicketForm}
            data={item}
            variant="ghost"
            invertOnRowHover
            triggerClassName="w-8 h-8"
            icon={<EyeIcon className="w-4 h-4" aria-hidden="true" />}
          />
          <FormModal
            type="delete"
            entityTitle="Tiket"
            id={item.id}
            variant="ghost"
            invertOnRowHover
            triggerClassName="w-8 h-8"
            icon={<TrashIcon className="w-4 h-4" aria-hidden="true" />}
          />
        </div>
      </td>
    </tr>
  );

  return (
    <section className="section space-y-4">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-sm font-semibold uppercase tracking-wider">
          Riwayat Tiket
        </h1>
        <TableToolbar searchPlaceholder="Cari riwayat…" />
      </div>

      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={historyData} />

      {/* PAGINATION */}
      <Pagination />
    </section>
  );
}
