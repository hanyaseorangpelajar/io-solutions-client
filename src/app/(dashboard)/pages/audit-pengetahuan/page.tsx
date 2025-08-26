"use client";

import SafetyChip from "@/components/atoms/SafetyChip";
import FormModal from "@/components/molecules/FormModal";
import Pagination from "@/components/molecules/Pagination";
import KnowledgeAuditForm from "@/components/organisms/KnowledgeAuditForm";
import PublishKBForm from "@/components/organisms/PublishKBForm";
import Table, { type TableColumn } from "@/components/organisms/Table";
import TableToolbar from "@/components/organisms/TableToolbar";
import {
  BookOpenIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import * as React from "react";

type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
type AuditStatus = "PENDING" | "READY" | "PUBLISHED";

type AuditItem = {
  id: string;
  ticketId: string;
  title: string;
  priority: TicketPriority;
  technician?: string;
  closedAt: string;
  tags: string[];
  auditStatus: AuditStatus;
};

const columns: TableColumn[] = [
  { header: "Ticket", accessor: "ticket" },
  {
    header: "Priority",
    accessor: "priority",
    className: "hidden md:table-cell",
  },
  {
    header: "Technician",
    accessor: "technician",
    className: "hidden lg:table-cell",
  },
  { header: "Tags", accessor: "tags", className: "hidden md:table-cell" },
  {
    header: "Status",
    accessor: "auditStatus",
    className: "hidden md:table-cell",
  },
  { header: "Closed", accessor: "closedAt", className: "hidden md:table-cell" },
  { header: "Actions", accessor: "action" },
];

const rows: AuditItem[] = [
  {
    id: "AUD-001",
    ticketId: "TCK-2025-000123",
    title: "Laptop tidak menyala (ASUS X455L)",
    priority: "HIGH",
    technician: "Rudi",
    closedAt: "2025-07-30",
    tags: ["power", "mainboard", "asus"],
    auditStatus: "PENDING",
  },
  {
    id: "AUD-002",
    ticketId: "TCK-2025-000124",
    title: "Install ulang OS (Windows 11)",
    priority: "MEDIUM",
    technician: "Sari",
    closedAt: "2025-07-31",
    tags: ["windows", "install", "driver"],
    auditStatus: "READY",
  },
  {
    id: "AUD-003",
    ticketId: "TCK-2025-000125",
    title: "Ganti keyboard (Lenovo)",
    priority: "LOW",
    technician: "Dimas",
    closedAt: "2025-08-02",
    tags: ["keyboard", "lenovo", "sparepart"],
    auditStatus: "PUBLISHED",
  },
];

export default function AuditKnowledgePage() {
  const renderRow = (item: AuditItem) => {
    const shownTags = item.tags.slice(0, 2);
    const more = item.tags.length - shownTags.length;

    return (
      <tr key={item.id} className="group/row text-sm row-hover">
        {/* Ticket */}
        <td className="p-4">
          <div className="flex flex-col">
            <span className="font-medium">{item.title}</span>
            <span className="text-xs text-[var(--mono-muted)]">
              {item.ticketId}
            </span>
          </div>
        </td>

        <td className="hidden md:table-cell">{item.priority}</td>
        <td className="hidden lg:table-cell">{item.technician ?? "-"}</td>

        {/* Tags (lock style on row hover) */}
        <td className="hidden md:table-cell">
          <div className="flex flex-wrap gap-1">
            {shownTags.map((t) => (
              <SafetyChip key={t} prefix="#" lockOnRowHover>
                {t}
              </SafetyChip>
            ))}
            {more > 0 && <SafetyChip lockOnRowHover>+{more}</SafetyChip>}
          </div>
        </td>

        <td className="hidden md:table-cell">{item.auditStatus}</td>
        <td className="hidden md:table-cell">{item.closedAt}</td>

        {/* Actions */}
        <td>
          <div className="flex items-center gap-2">
            <FormModal
              type="read"
              entityTitle="Audit"
              component={KnowledgeAuditForm}
              data={item}
              variant="ghost"
              invertOnRowHover
              triggerClassName="w-8 h-8"
              icon={<EyeIcon className="w-4 h-4" aria-hidden="true" />}
            />
            <FormModal
              type="update"
              entityTitle="Audit"
              component={KnowledgeAuditForm}
              data={item}
              variant="ghost"
              invertOnRowHover
              triggerClassName="w-8 h-8"
              icon={<PencilSquareIcon className="w-4 h-4" aria-hidden="true" />}
            />
            <FormModal
              type="create"
              title="Publish ke Basis Pengetahuan"
              entityTitle="Artikel"
              component={PublishKBForm}
              data={item}
              variant="ghost"
              invertOnRowHover
              triggerClassName="w-8 h-8"
              icon={<BookOpenIcon className="w-4 h-4" aria-hidden="true" />}
            />
            <FormModal
              type="delete"
              entityTitle="Audit"
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
    <section className="section space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-sm font-semibold uppercase tracking-wider">
          Audit Pengetahuan
        </h1>
        <TableToolbar searchPlaceholder="Cari tiket tertutup…" />
      </div>

      <Table columns={columns} data={rows} renderRow={renderRow} />

      <Pagination />
    </section>
  );
}
