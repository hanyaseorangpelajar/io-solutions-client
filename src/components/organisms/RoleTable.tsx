"use client";
import * as React from "react";
import Table from "@/components/organisms/Table";
import TableToolbar from "@/components/organisms/TableToolbar";
import Pagination from "@/components/molecules/Pagination";
import FormModal from "@/components/molecules/FormModal";
import SafetyChip from "@/components/atoms/SafetyChip";
import RoleForm, { RoleItem } from "./RoleForm";
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

type Props = { roles: RoleItem[]; title?: string };
const MAX_PERMS = 8;

export default function RoleTable({
  roles,
  title = "Roles & Permissions",
}: Props) {
  const renderRow = (item: RoleItem) => {
    const visiblePerms = item.permissions.slice(0, MAX_PERMS);
    const moreCount = item.permissions.length - visiblePerms.length;

    return (
      <tr key={item.id} className="group/row text-sm row-hover">
        <td className="p-4">
          <div className="flex flex-col">
            <span className="font-medium">{item.name}</span>
            {item.description && (
              <span className="text-xs text-[var(--mono-muted)]">
                {item.description}
              </span>
            )}
          </div>
        </td>

        <td className="hidden md:table-cell">
          <div className="flex flex-wrap gap-1">
            {visiblePerms.map((p) => (
              <SafetyChip key={p} prefix="#" lockOnRowHover>
                {p}
              </SafetyChip>
            ))}
            {moreCount > 0 && (
              <SafetyChip lockOnRowHover>+{moreCount}</SafetyChip>
            )}
          </div>
        </td>

        <td className="hidden md:table-cell w-[100px]">{item.members ?? 0}</td>

        <td className="w-[160px]">
          <div className="flex items-center gap-2">
            <FormModal
              type="read"
              title={`Detail Role: ${item.name}`}
              entityTitle="Role"
              component={RoleForm}
              data={item}
              variant="ghost"
              invertOnRowHover
              triggerClassName="w-8 h-8"
              icon={<EyeIcon className="w-4 h-4" aria-hidden="true" />}
            />
            <FormModal
              type="update"
              title={`Ubah Role: ${item.name}`}
              entityTitle="Role"
              component={RoleForm}
              data={item}
              variant="ghost"
              invertOnRowHover
              triggerClassName="w-8 h-8"
              icon={<PencilSquareIcon className="w-4 h-4" aria-hidden="true" />}
            />
            <FormModal
              type="delete"
              title={`Hapus Role: ${item.name}`}
              entityTitle="Role"
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
  };

  return (
    <section className="section">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider">
          {title}
        </h2>
        <TableToolbar
          searchPlaceholder="Cari role…"
          createButton={
            <FormModal
              type="create"
              title="Buat Role Baru"
              entityTitle="Role"
              component={RoleForm}
              variant="solid"
              triggerClassName="w-8 h-8"
              icon={<PlusIcon className="w-4 h-4" aria-hidden="true" />}
            />
          }
        />
      </div>

      <Table columns={COLUMNS} renderRow={renderRow} data={roles} />
      <Pagination />
    </section>
  );
}
