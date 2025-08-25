"use client";

import * as React from "react";
import Table from "@/components/data-display/table/Table";
import TableToolbar from "@/components/data-display/table/TableToolbar";
import Pagination from "@/components/data-display/table/Pagination";
import FormModal from "@/components/overlays/FormModal";
import AssignRoleForm, {
  UserItem,
} from "@/components/features/staff/forms/AssignRoleForm";
import { RoleItem } from "@/components/features/rbac/forms/RoleForm";
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const COLUMNS = [
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
      <tr
        key={item.id}
        className="group/row text-sm hover:bg-black hover:text-white"
      >
        <td className="p-4">
          <div className="flex flex-col">
            <span className="font-medium">{item.name}</span>
            <span className="text-xs">{item.id}</span>
          </div>
        </td>
        <td className="hidden md:table-cell">{item.email}</td>
        <td className="hidden md:table-cell">{roleName}</td>
        <td>
          <div className="flex items-center gap-2">
            <FormModal
              type="read"
              entityTitle="User"
              component={AssignRoleForm as any}
              data={{ ...item, roleName }}
              triggerClassName="w-8 h-8"
              icon={<EyeIcon className="w-4 h-4" />}
            />
            <FormModal
              type="update"
              entityTitle="User"
              component={(props) =>
                (
                  <AssignRoleForm
                    {...(props as any)}
                    roles={roles.map((r) => ({ id: r.id, name: r.name }))}
                  />
                ) as any
              }
              data={{ ...item, roleName }}
              triggerClassName="w-8 h-8"
              icon={<PencilSquareIcon className="w-4 h-4" />}
            />
            <FormModal
              type="delete"
              entityTitle="User"
              id={item.id}
              triggerClassName="w-8 h-8"
              icon={<TrashIcon className="w-4 h-4" />}
            />
          </div>
        </td>
      </tr>
    );
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <TableToolbar
          searchPlaceholder="Cari user…"
          showFilter={false}
          showSort={false}
        />
      </div>

      <Table columns={COLUMNS} renderRow={renderRow} data={users} />
      <Pagination />
    </section>
  );
}
