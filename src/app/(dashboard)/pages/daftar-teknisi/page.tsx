// src/app/(dashboard)/pages/daftar-teknisi/page.tsx
"use client";

import FormModal from "@/components/overlays/FormModal";
import Table from "@/components/data-display/table/Table";
import TableToolbar from "@/components/data-display/table/TableToolbar";
import Pagination from "@/components/data-display/table/Pagination";
import {
  PlusIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import TeknisiForm from "@/components/features/technicians/forms/TeknisiForm";

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
    // pakai group/row agar tombol aksi bisa ikut invert saat hover
    <tr
      key={item.id}
      className="group/row text-sm hover:bg-[var(--mono-fg)] hover:text-[var(--mono-bg)]"
    >
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
          {/* READ */}
          <FormModal
            type="read"
            entityTitle="Teknisi"
            component={TeknisiForm}
            data={item}
            variant="ghost"
            hoverInvertFromRow
            triggerClassName="w-8 h-8"
            icon={<EyeIcon className="w-4 h-4" />}
          />
          {/* UPDATE */}
          <FormModal
            type="update"
            entityTitle="Teknisi"
            component={TeknisiForm}
            data={item}
            variant="ghost"
            hoverInvertFromRow
            triggerClassName="w-8 h-8"
            icon={<PencilSquareIcon className="w-4 h-4" />}
          />
          {/* DELETE */}
          <FormModal
            type="delete"
            entityTitle="Teknisi"
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
        <h1 className="hidden md:block text-lg font-semibold">
          Daftar Teknisi
        </h1>

        <TableToolbar
          searchPlaceholder="Cari teknisi…"
          createButton={
            <FormModal
              type="create"
              entityTitle="Teknisi"
              component={TeknisiForm}
              triggerClassName="w-8 h-8"
              icon={<PlusIcon className="w-4 h-4" />}
            />
          }
        />
      </div>

      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={technicians} />

      {/* PAGINATION */}
      <Pagination />
    </div>
  );
}
