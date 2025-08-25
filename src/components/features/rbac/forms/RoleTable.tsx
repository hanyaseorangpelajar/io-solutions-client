"use client";

import * as React from "react";
import Table from "@/components/data-display/table/Table";
import TableToolbar from "@/components/data-display/table/TableToolbar";
import Pagination from "@/components/data-display/table/Pagination";
import FormModal from "@/components/overlays/FormModal";
import SafetyChip from "@/components/data-display/chips/SafetyChip";
import RoleForm, { RoleItem } from "@/components/features/rbac/forms/RoleForm";
import {
  PlusIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const COLUMNS = [
  { header: "Role", accessor: "role" },
  {
    header: "Permissions",
    accessor: "permissions",
    className: "hidden md:table-cell",
  },
  {
    header: "Members",
    accessor: "members",
    className: "hidden md:table-cell w-[100px]",
  },
  { header: "Actions", accessor: "action", className: "w-[160px]" },
];

type Props = {
  roles: RoleItem[];
  title?: string;
};

export default function RoleTable({
  roles,
  title = "Roles & Permissions",
}: Props) {
  const renderRow = (item: RoleItem) => (
    <tr key={item.id} className="group text-sm hover:bg-black hover:text-white">
      <td className="p-4">
        <div className="flex flex-col">
          <span className="font-medium">{item.name}</span>
          {item.description && (
            <span className="text-xs">{item.description}</span>
          )}
        </div>
      </td>
      <td className="hidden md:table-cell">
        <div className="flex flex-wrap gap-1">
          {item.permissions.map((p) => (
            <SafetyChip key={p} prefix="#">
              {p}
            </SafetyChip>
          ))}
        </div>
      </td>
      <td className="hidden md:table-cell">{item.members}</td>
      <td>
        <div className="flex items-center gap-2">
          <FormModal
            type="read"
            entityTitle="Role"
            component={RoleForm}
            data={item}
            triggerClassName="w-8 h-8"
            icon={
              <EyeIcon className="w-4 h-4 text-white group-hover:text-black" />
            }
          />
          <FormModal
            type="update"
            entityTitle="Role"
            component={RoleForm}
            data={item}
            triggerClassName="w-8 h-8"
            icon={
              <PencilSquareIcon className="w-4 h-4 text-white group-hover:text-black" />
            }
          />
          <FormModal
            type="delete"
            entityTitle="Role"
            id={item.id}
            triggerClassName="w-8 h-8"
            icon={
              <TrashIcon className="w-4 h-4 text-white group-hover:text-black" />
            }
          />
        </div>
      </td>
    </tr>
  );

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <TableToolbar
          searchPlaceholder="Cari role…"
          createButton={
            <FormModal
              type="create"
              entityTitle="Role"
              component={RoleForm}
              triggerClassName="w-8 h-8"
              icon={
                <PlusIcon className="w-4 h-4 text-white group-hover:text-black" />
              }
            />
          }
        />
      </div>

      <Table columns={COLUMNS} renderRow={renderRow} data={roles} />
      <Pagination />
    </section>
  );
}
