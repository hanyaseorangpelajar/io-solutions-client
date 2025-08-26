"use client";

import FormModal from "@/components/overlays/FormModal";
import TiketForm from "@/components/features/tickets/forms/TicketForm";
import TutupTiketForm from "@/components/features/tickets/forms/TutupTiketForm";
import Pagination from "@/components/data-display/table/Pagination";
import Table from "@/components/data-display/table/Table";
import TableToolbar from "@/components/data-display/table/TableToolbar";
import {
  PlusIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

type DaftarTicket = {
  id: number;
  title: string;
  class: string;
  date: string;
};

const columns = [
  { header: "Title", accessor: "title" },
  { header: "Class", accessor: "class", className: "hidden md:table-cell" },
  { header: "Date", accessor: "date", className: "hidden md:table-cell" },
  { header: "Actions", accessor: "action" },
];

const daftarTiketData: DaftarTicket[] = [
  { id: 1, title: "Laptop tidak menyala", class: "VIP", date: "2025-08-01" },
  { id: 2, title: "Install ulang OS", class: "Regular", date: "2025-08-03" },
  { id: 3, title: "Ganti keyboard", class: "Urgent", date: "2025-08-05" },
];

export default function TicketPage() {
  const renderRow = (item: DaftarTicket) => (
    <tr
      key={item.id}
      className="group/row text-sm hover:bg-[var(--mono-fg)] hover:text-[var(--mono-bg)]"
    >
      <td className="p-4">{item.title}</td>
      <td className="hidden md:table-cell">{item.class}</td>
      <td className="hidden md:table-cell">{item.date}</td>
      <td>
        <div className="flex items-center gap-2">
          {/* READ */}
          <FormModal
            type="read"
            entityTitle="Tiket"
            component={TiketForm}
            data={item}
            variant="ghost"
            hoverInvertFromRow
            triggerClassName="w-8 h-8"
            icon={<EyeIcon className="w-4 h-4" />}
          />
          {/* UPDATE */}
          <FormModal
            type="update"
            entityTitle="Tiket"
            component={TiketForm}
            data={item}
            variant="ghost"
            hoverInvertFromRow
            triggerClassName="w-8 h-8"
            icon={<PencilSquareIcon className="w-4 h-4" />}
          />
          {/* CLOSE (Tutup Tiket) */}
          <FormModal
            type="update"
            title="Tutup Tiket"
            entityTitle="Tiket"
            component={TutupTiketForm}
            data={item}
            variant="ghost"
            hoverInvertFromRow
            triggerClassName="w-8 h-8"
            icon={<CheckCircleIcon className="w-4 h-4" />}
          />
          {/* DELETE */}
          <FormModal
            type="delete"
            entityTitle="Tiket"
            id={item.id}
            variant="ghost"
            hoverInvertFromRow
            triggerClassName="w-8 h-8"
            icon={<TrashIcon className="w-4 h-4" />}
          />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-[var(--mono-bg)] text-[var(--mono-fg)] p-4 rounded-none border border-[var(--mono-border)] flex-1 m-4 mt-6">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Daftar Tiket</h1>

        <TableToolbar
          searchPlaceholder="Cari tiket…"
          createButton={
            <FormModal
              type="create"
              entityTitle="Tiket"
              component={TiketForm}
              variant="solid" // tombol header solid (hitam)
              triggerClassName="w-8 h-8"
              icon={<PlusIcon className="w-4 h-4" />}
            />
          }
        />
      </div>

      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={daftarTiketData} />

      {/* PAGINATION */}
      <Pagination />
    </div>
  );
}
