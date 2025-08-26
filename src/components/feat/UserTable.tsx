"use client";

import FormModal from "@/components/molecules/FormModal";
import Pagination from "@/components/molecules/Pagination";
import * as React from "react";
import AssignRoleForm, { type UserItem } from "../organisms/AssignRoleForm";
import { RoleItem } from "../organisms/RoleForm";
import Table, { type TableColumn } from "../organisms/Table";
import TableToolbar from "../organisms/TableToolbar";

import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const COLUMNS: TableColumn[] = [
  { header: "User", accessor: "user" },
  { header: "Email", accessor: "email", className: "hidden md:table-cell" },
  { header: "Role", accessor: "role", className: "hidden md:table-cell" },
  { header: "Actions", accessor: "action", className: "w-[120px]" },
];

type Props = {
  users: UserItem[];
  roles: RoleItem[];
  title?: string;
};

export default function UserTable({
  users,
  roles,
  title = "Users & Role Assignment",
}: Props) {
  const renderRow = (item: UserItem) => {
    const roleName = roles.find((r) => r.id === item.roleId)?.name ?? "-";

    return (
      <tr key={item.id} className="group/row text-sm row-hover">
        <td className="p-4">
          <div className="flex flex-col">
            <span className="font-medium">{item.name}</span>
            <span className="text-xs text-[var(--mono-muted)]">{item.id}</span>
          </div>
        </td>

        <td className="hidden md:table-cell">{item.email}</td>
        <td className="hidden md:table-cell">{roleName}</td>

        <td>
          <div className="flex items-center gap-2">
            {/* READ */}
            <FormModal
              type="read"
              entityTitle="User"
              component={AssignRoleForm}
              data={{ ...item, roleName }}
              triggerClassName="w-8 h-8"
              variant="ghost"
              invertOnRowHover
              icon={<EyeIcon className="w-4 h-4" aria-hidden="true" />}
              iconColor="currentColor"
            />

            {/* UPDATE (inject roles prop) */}
            <FormModal
              type="update"
              entityTitle="User"
              component={(props) => (
                <AssignRoleForm
                  {...props}
                  roles={roles.map((r) => ({ id: r.id, name: r.name }))}
                />
              )}
              data={{ ...item, roleName }}
              triggerClassName="w-8 h-8"
              variant="ghost"
              invertOnRowHover
              icon={<PencilSquareIcon className="w-4 h-4" aria-hidden="true" />}
              iconColor="currentColor"
            />

            {/* DELETE */}
            <FormModal
              type="delete"
              entityTitle="User"
              id={item.id}
              triggerClassName="w-8 h-8"
              variant="ghost"
              invertOnRowHover
              icon={<TrashIcon className="w-4 h-4" aria-hidden="true" />}
              iconColor="currentColor"
            />
          </div>
        </td>
      </tr>
    );
  };

  return (
    <section className="section space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider">
          {title}
        </h2>
        <TableToolbar
          searchPlaceholder="Cari user…"
          showFilter={false}
          showSort={false}
        />
      </div>

      <Table columns={COLUMNS} data={users} renderRow={renderRow} />
      <Pagination />
    </section>
  );
}
