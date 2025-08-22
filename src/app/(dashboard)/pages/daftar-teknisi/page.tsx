// src/app/(dashboard)/pages/daftar-teknisi/page.tsx
"use client";

import FormModal from "@/components/FormModal";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Pagination from "@/components/Pagination";
import {
  PlusIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";
import TeknisiForm from "@/components/forms/TeknisiForm";

type TechnicianStatus = "ACTIVE" | "INACTIVE" | "ON_LEAVE";

type Technician = {
  id: string; // e.g. TCN-2025-0001
  name: string;
  email: string;
  phone: string;
  skills: string[]; // e.g. ["Hardware", "Windows", "MacOS"]
  activeSince: string; // YYYY-MM-DD
  status: TechnicianStatus;
};

const columns = [
  { header: "Name", accessor: "name" },
  { header: "Skills", accessor: "skills", className: "hidden md:table-cell" },
  { header: "Phone", accessor: "phone", className: "hidden md:table-cell" },
  { header: "Email", accessor: "email", className: "hidden lg:table-cell" },
  {
    header: "Active Since",
    accessor: "activeSince",
    className: "hidden lg:table-cell",
  },
  { header: "Status", accessor: "status", className: "hidden md:table-cell" },
  { header: "Actions", accessor: "action" },
];

// Demo data — ganti ke data asli saat integrasi backend
const technicians: Technician[] = [
  {
    id: "TCN-2025-0001",
    name: "Rudi Hartono",
    email: "rudi@acme.id",
    phone: "0812-3456-7890",
    skills: ["Hardware", "Windows", "Laptop"],
    activeSince: "2023-02-10",
    status: "ACTIVE",
  },
  {
    id: "TCN-2025-0002",
    name: "Sari Puspita",
    email: "sari@acme.id",
    phone: "0813-1111-2222",
    skills: ["iOS", "MacOS", "Board-level"],
    activeSince: "2022-08-01",
    status: "ON_LEAVE",
  },
  {
    id: "TCN-2025-0003",
    name: "Dimas Saputra",
    email: "dimas@acme.id",
    phone: "0819-7777-3333",
    skills: ["Networking", "Linux", "Printer"],
    activeSince: "2021-11-19",
    status: "ACTIVE",
  },
];

export default function DaftarTeknisiPage() {
  const renderRow = (item: Technician) => (
    <tr key={item.id} className="text-sm hover:bg-black hover:text-white">
      <td className="p-4">
        <div className="flex flex-col">
          <span className="font-medium">{item.name}</span>
          <span className="text-xs">{item.id}</span>
        </div>
      </td>

      <td className="hidden md:table-cell">{item.skills.join(", ")}</td>

      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden lg:table-cell">{item.email}</td>
      <td className="hidden lg:table-cell">{item.activeSince}</td>
      <td className="hidden md:table-cell">{item.status}</td>

      <td>
        <div className="flex items-center gap-2">
          {/* CREATE — per row (mengikuti pola sebelumnya) */}
          <FormModal
            type="create"
            entityTitle="Teknisi"
            component={TeknisiForm}
            icon={
              <PlusIcon className="w-4 h-4 text-white group-hover:text-black" />
            }
          />
          {/* READ — modal */}
          <FormModal
            type="read"
            entityTitle="Teknisi"
            component={TeknisiForm}
            data={item}
            icon={
              <EyeIcon className="w-4 h-4 text-white group-hover:text-black" />
            }
          />
          {/* UPDATE — modal */}
          <FormModal
            type="update"
            entityTitle="Teknisi"
            component={TeknisiForm}
            data={item}
            icon={
              <PencilSquareIcon className="w-4 h-4 text-white group-hover:text-black" />
            }
          />
          {/* DELETE — confirm bawaan */}
          <FormModal
            type="delete"
            entityTitle="Teknisi"
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
        <h1 className="hidden md:block text-lg font-semibold">
          Daftar Teknisi
        </h1>
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
            {/* Tidak ada Create di header (mengikuti pola sebelumnya) */}
          </div>
        </div>
      </div>

      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={technicians} />

      {/* PAGINATION */}
      <Pagination />
    </div>
  );
}
