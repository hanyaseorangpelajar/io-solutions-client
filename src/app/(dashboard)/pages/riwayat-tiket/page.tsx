// app/dashboard/pages/riwayat-tiket/page.tsx
"use client";

import FormModal from "@/components/FormModal";
import TiketForm from "@/components/forms/TicketForm";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import {
  PlusIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";

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

const columns = [
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

// Demo data — ganti dengan data asli dari backend
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
    <tr key={item.id} className="text-sm hover:bg-black hover:text-white">
      {/* Ticket (gabung title + id) */}
      <td className="p-4">
        <div className="flex flex-col">
          <span className="font-medium">{item.title}</span>
          <span className="text-xs">{item.id}</span>
        </div>
      </td>

      {/* Status */}
      <td className="hidden md:table-cell">{item.status}</td>

      {/* Priority */}
      <td className="hidden md:table-cell">{item.priority}</td>

      {/* Technician */}
      <td className="hidden lg:table-cell">{item.assignedTo ?? "-"}</td>

      {/* Closed */}
      <td className="hidden md:table-cell">{item.closedAt ?? "-"}</td>

      {/* Actions */}
      <td>
        <div className="flex items-center gap-2">
          {/* CREATE — per row */}
          <FormModal
            type="create"
            entityTitle="Tiket"
            component={TiketForm}
            icon={
              <PlusIcon className="w-4 h-4 text-white group-hover:text-black" />
            }
          />
          {/* READ — modal */}
          <FormModal
            type="read"
            entityTitle="Tiket"
            component={TiketForm}
            data={item}
            icon={
              <EyeIcon className="w-4 h-4 text-white group-hover:text-black" />
            }
          />
          {/* UPDATE — modal */}
          <FormModal
            type="update"
            entityTitle="Tiket"
            component={TiketForm}
            data={item}
            icon={
              <PencilSquareIcon className="w-4 h-4 text-white group-hover:text-black" />
            }
          />
          {/* DELETE — confirm bawaan */}
          <FormModal
            type="delete"
            entityTitle="Tiket"
            id={item.id}
            icon={
              <TrashIcon className="w-4 h-4 text-white group-hover:text-black" />
            }
          />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white text-black p-4 rounded-none border border-black flex-1 m-4 mt-6">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Riwayat Tiket</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button
              className="group w-8 h-8 flex items-center justify-center rounded-none border border-black bg-black hover:bg-white transition"
              aria-label="Filter"
            >
              <FunnelIcon className="w-4 h-4 text-white group-hover:text-black" />
            </button>
            <button
              className="group w-8 h-8 flex items-center justify-center rounded-none border border-black bg-black hover:bg-white transition"
              aria-label="Sort"
            >
              <ArrowsUpDownIcon className="w-4 h-4 text-white group-hover:text-black" />
            </button>
          </div>
        </div>
      </div>

      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={historyData} />

      {/* PAGINATION */}
      <Pagination />
    </div>
  );
}
