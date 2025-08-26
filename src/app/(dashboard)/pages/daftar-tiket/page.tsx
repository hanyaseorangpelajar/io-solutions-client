"use client";
import FormModal from "@/components/molecules/FormModal";
import Pagination from "@/components/molecules/Pagination";
import CloseTicketForm from "@/components/organisms/CloseTicketForm";
import Table, { type TableColumn } from "@/components/organisms/Table";
import TableToolbar from "@/components/organisms/TableToolbar";
import TicketForm from "@/components/organisms/TicketForm";
import {
  CheckCircleIcon,
  EyeIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import * as React from "react";

type TicketRow = {
  id: number | string;
  title: string;
  class: string;
  date: string;
};

const columns: TableColumn[] = [
  { header: "Title", accessor: "title" },
  { header: "Class", accessor: "class", className: "hidden md:table-cell" },
  { header: "Date", accessor: "date", className: "hidden md:table-cell" },
  { header: "Actions", accessor: "action" },
];

const rows: TicketRow[] = [
  { id: 1, title: "Laptop tidak menyala", class: "VIP", date: "2025-08-01" },
  { id: 2, title: "Install ulang OS", class: "Regular", date: "2025-08-03" },
  { id: 3, title: "Ganti keyboard", class: "Urgent", date: "2025-08-05" },
];

export default function TicketPage() {
  const renderRow = (item: TicketRow) => (
    <tr key={item.id} className="group/row text-sm row-hover">
      <td className="p-4">{item.title}</td>
      <td className="hidden md:table-cell">{item.class}</td>
      <td className="hidden md:table-cell">{item.date}</td>
      <td>
        <div className="flex items-center gap-2">
          {/* READ */}
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
          {/* UPDATE */}
          <FormModal
            type="update"
            entityTitle="Tiket"
            component={TicketForm}
            data={item}
            variant="ghost"
            invertOnRowHover
            triggerClassName="w-8 h-8"
            icon={<PencilSquareIcon className="w-4 h-4" aria-hidden="true" />}
          />
          {/* CLOSE (Tutup Tiket) */}
          <FormModal
            type="update"
            title="Tutup Tiket"
            entityTitle="Tiket"
            component={CloseTicketForm}
            data={item}
            variant="ghost"
            invertOnRowHover
            triggerClassName="w-8 h-8"
            icon={<CheckCircleIcon className="w-4 h-4" aria-hidden="true" />}
          />
          {/* DELETE */}
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
          Daftar Tiket
        </h1>

        <TableToolbar
          searchPlaceholder="Cari tiket…"
          createButton={
            <FormModal
              type="create"
              entityTitle="Tiket"
              component={TicketForm}
              variant="solid"
              triggerClassName="w-8 h-8"
              icon={<PlusIcon className="w-4 h-4" aria-hidden="true" />}
            />
          }
        />
      </div>

      {/* LIST */}
      <Table columns={columns} data={rows} renderRow={renderRow} />

      {/* PAGINATION */}
      <Pagination />
    </section>
  );
}
