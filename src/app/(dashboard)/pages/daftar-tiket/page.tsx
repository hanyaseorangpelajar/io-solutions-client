"use client";

import FormModal from "@/components/FormModal";
import TiketForm from "@/components/forms/TicketForm";
import TutupTiketForm from "@/components/forms/TutupTiketForm";
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

const TicketPage = () => {
  const renderRow = (item: DaftarTicket) => (
    <tr key={item.id} className="text-sm hover:bg-black hover:text-white">
      <td className="p-4">{item.title}</td>
      <td className="hidden md:table-cell">{item.class}</td>
      <td className="hidden md:table-cell">{item.date}</td>
      <td>
        <div className="flex items-center gap-2">
          <FormModal
            type="create"
            entityTitle="Tiket"
            component={TiketForm}
            icon={
              <PlusIcon className="w-4 h-4 text-white group-hover:text-black" />
            }
          />
          <FormModal
            type="read"
            entityTitle="Tiket"
            component={TiketForm}
            data={item}
            icon={
              <EyeIcon className="w-4 h-4 text-white group-hover:text-black" />
            }
          />
          <FormModal
            type="update"
            entityTitle="Tiket"
            component={TiketForm}
            data={item}
            icon={
              <PencilSquareIcon className="w-4 h-4 text-white group-hover:text-black" />
            }
          />
          <FormModal
            type="update"
            title="Tutup Tiket"
            entityTitle="Tiket"
            component={TutupTiketForm}
            data={item}
            icon={
              <CheckCircleIcon className="w-4 h-4 text-white group-hover:text-black" />
            }
          />
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
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Daftar Tiket</h1>
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

      <Table columns={columns} renderRow={renderRow} data={daftarTiketData} />

      <Pagination />
    </div>
  );
};

export default TicketPage;
