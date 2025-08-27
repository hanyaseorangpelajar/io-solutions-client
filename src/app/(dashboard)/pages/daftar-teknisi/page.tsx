"use client";
import FormModal from "@/components/molecules/FormModal";
import Pagination from "@/components/molecules/Pagination";
import Table, { type TableColumn } from "@/components/organisms/Table";
import TableToolbar from "@/components/organisms/TableToolbar";
import TechnicianForm from "@/components/organisms/TeknisiForm";
import {
  EyeIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import * as React from "react";

type TechnicianStatus = "ACTIVE" | "INACTIVE" | "ON_LEAVE";

type Technician = {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  activeSince: string;
  status: TechnicianStatus;
};

const columns: TableColumn[] = [
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
    <tr key={item.id} className="group/row text-sm row-hover">
      <td className="p-4">
        <div className="flex flex-col">
          <span className="font-medium">{item.name}</span>
          <span className="text-xs text-[var(--mono-muted)]">{item.id}</span>
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
            component={TechnicianForm}
            data={item}
            variant="ghost"
            invertOnRowHover
            triggerClassName="w-8 h-8"
            icon={<EyeIcon className="w-4 h-4" aria-hidden="true" />}
          />
          {/* UPDATE */}
          <FormModal
            type="update"
            entityTitle="Teknisi"
            component={TechnicianForm}
            data={item}
            variant="ghost"
            invertOnRowHover
            triggerClassName="w-8 h-8"
            icon={<PencilSquareIcon className="w-4 h-4" aria-hidden="true" />}
          />
          {/* DELETE */}
          <FormModal
            type="delete"
            entityTitle="Teknisi"
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
          Daftar Teknisi
        </h1>

        <TableToolbar
          searchPlaceholder="Cari teknisi…"
          createButton={
            <FormModal
              type="create"
              entityTitle="Teknisi"
              component={TechnicianForm}
              triggerClassName="w-8 h-8"
              icon={<PlusIcon className="w-4 h-4" aria-hidden="true" />}
            />
          }
        />
      </div>

      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={technicians} />

      {/* PAGINATION */}
      <Pagination />
    </section>
  );
}
