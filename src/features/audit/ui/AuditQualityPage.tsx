"use client";

import { useMemo, useState } from "react";
import { Badge, Button, Group, Select, Stack, Title } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { SimpleTable, type Column } from "@/shared/ui/table/SimpleTable";
import { ActionsDropdown } from "@/shared/ui/menus";
import {
  IconCheck,
  IconEye,
  IconPencil,
  IconPlayerPlay,
  IconTools,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { downloadCSV } from "@/shared/utils/csv";
import { MOCK_TICKETS } from "@/features/tickets/model/mock";
import type { Ticket } from "@/features/tickets/model/types";
import type { TicketResolutionInput } from "@/features/tickets/model/schema";
import { formatDateTime } from "@/features/tickets/utils/format";
import AuditFormModal from "./AuditFormModal";
import AuditResolveEditorModal from "./AuditResolveEditorModal";
import type { AuditRecord, AuditStatus } from "../model/types";
import { AUDITS, upsertAudit, removeAudit } from "../model/mock";

type RangeValue = [Date | null, Date | null];

type Row = {
  ticketId: string;
  code: string;
  resolvedAt: string;
  resolvedBy: string;
  // audit info (optional)
  audit?: AuditRecord;
  // heuristic score recommendation
  recommendedScore: number;
  // original resolution (for prefill editing)
  resolution: Ticket["resolution"];
};

const CURRENT_REVIEWER = "qa01";

export default function AuditQualityPage() {
  // filters
  const [status, setStatus] = useState<AuditStatus | "all">("all");
  const [tech, setTech] = useState<string | "all">("all");
  const [range, setRange] = useState<RangeValue>([null, null]);

  // local stores
  const [audits, setAudits] = useState<AuditRecord[]>(AUDITS);
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);

  // modals
  const [editingAudit, setEditingAudit] = useState<null | {
    mode: "create" | "edit";
    row: Row;
  }>(null);
  const [editingResolution, setEditingResolution] = useState<null | Row>(null);

  // derive rows from local tickets
  const rows: Row[] = useMemo(() => {
    const resolved = tickets.filter(
      (t) => t.status === "resolved" && t.resolution
    );
    return resolved.map((t) => {
      const rec = audits.find((a) => a.ticketId === t.id);
      const recommended =
        Math.min(
          100,
          (t.resolution!.solution?.length ?? 0) / 5 +
            (t.resolution!.photos?.length ?? 0) * 10 +
            (t.resolution!.parts?.length ?? 0) * 10
        ) | 0;
      return {
        ticketId: t.id,
        code: t.code,
        resolvedAt: t.resolution!.resolvedAt,
        resolvedBy: t.resolution!.resolvedBy,
        audit: rec,
        recommendedScore: recommended,
        resolution: t.resolution,
      };
    });
  }, [tickets, audits]);

  const techOptions = useMemo(() => {
    const s = new Set(rows.map((r) => r.resolvedBy));
    return [
      { value: "all", label: "Semua teknisi" },
      ...Array.from(s).map((x) => ({ value: x, label: x })),
    ];
  }, [rows]);

  const filtered = useMemo(() => {
    const [start, end] = range;
    const startMs = start ? new Date(start).setHours(0, 0, 0, 0) : null;
    const endMs = end ? new Date(end).setHours(23, 59, 59, 999) : null;
    return rows.filter((r) => {
      const byTech = tech === "all" ? true : r.resolvedBy === tech;
      const byDate = (() => {
        const t = Date.parse(r.resolvedAt);
        return (
          (startMs === null || t >= startMs) && (endMs === null || t <= endMs)
        );
      })();
      const byStatus =
        status === "all"
          ? true
          : (r.audit?.status ?? "draft") === status ||
            (!r.audit && status === "draft");
      return byTech && byDate && byStatus;
    });
  }, [rows, tech, range, status]);

  const exportCSV = () => {
    const headers = [
      "Kode",
      "ResolvedAt",
      "Teknisi",
      "AuditStatus",
      "Score",
      "Tags",
    ];
    const data = filtered.map((r) => [
      r.code,
      formatDateTime(r.resolvedAt),
      r.resolvedBy,
      r.audit?.status ?? "draft",
      r.audit?.score ?? Math.round(r.recommendedScore),
      (r.audit?.tags ?? []).map((t) => `#${t}`).join(" "),
    ]);
    downloadCSV("audit-quality.csv", headers, data);
  };

  // ---- CRUD audit ----
  const createAudit = (
    row: Row,
    v: { score: number; tags: string[]; notes?: string }
  ) => {
    const a: AuditRecord = {
      id: crypto.randomUUID(),
      ticketId: row.ticketId,
      ticketCode: row.code,
      reviewer: CURRENT_REVIEWER,
      reviewedAt: new Date().toISOString(),
      status: "draft",
      score: v.score,
      tags: v.tags,
      notes: v.notes,
      publish: false,
    };
    upsertAudit(a);
    setAudits([...AUDITS]);
  };

  const updateAudit = (
    row: Row,
    v: { score: number; tags: string[]; notes?: string }
  ) => {
    if (!row.audit) return;
    const next: AuditRecord = {
      ...row.audit,
      score: v.score,
      tags: v.tags,
      notes: v.notes,
      reviewedAt: new Date().toISOString(),
      reviewer: CURRENT_REVIEWER,
    };
    upsertAudit(next);
    setAudits([...AUDITS]);
  };

  const setStatusFor = (row: Row, newStatus: AuditStatus, publish: boolean) => {
    const base = row.audit;
    if (!base) return;
    upsertAudit({
      ...base,
      status: newStatus,
      publish,
      reviewedAt: new Date().toISOString(),
      reviewer: CURRENT_REVIEWER,
    });
    setAudits([...AUDITS]);
  };

  const deleteAudit = (row: Row) => {
    if (!row.audit) return;
    removeAudit(row.audit.id);
    setAudits([...AUDITS]);
  };

  // ---- Update konten resolusi ----
  const updateResolution = (row: Row, v: TicketResolutionInput) => {
    const now = new Date().toISOString();
    setTickets((prev) =>
      prev.map((t) =>
        t.id === row.ticketId && t.resolution
          ? {
              ...t,
              resolution: {
                ...t.resolution,
                rootCause: v.rootCause,
                solution: v.solution,
                parts: v.parts,
                photos: v.photos,
                tags: v.tags,
                // keep resolvedBy/At
                resolvedBy: t.resolution.resolvedBy,
                resolvedAt: t.resolution.resolvedAt,
              },
              updatedAt: now,
            }
          : t
      )
    );
  };

  const columns: Column<Row>[] = [
    { key: "code", header: "Kode Ticket", width: 170, cell: (r) => r.code },
    {
      key: "resolvedAt",
      header: "Resolved At",
      width: 180,
      cell: (r) => formatDateTime(r.resolvedAt),
    },
    {
      key: "resolvedBy",
      header: "Teknisi",
      width: 140,
      cell: (r) => r.resolvedBy,
    },
    {
      key: "status",
      header: "Audit",
      width: 180,
      cell: (r) => {
        const s = r.audit?.status ?? "draft";
        const color =
          s === "approved" ? "green" : s === "rejected" ? "red" : "gray";
        return (
          <Badge color={color} variant="light">
            {s.toUpperCase()}
          </Badge>
        );
      },
      align: "center",
    },
    {
      key: "score",
      header: "Score",
      width: 120,
      align: "center",
      cell: (r) =>
        (r.audit?.score ?? Math.round(r.recommendedScore)).toString(),
    },
    {
      key: "tags",
      header: "Tags",
      width: "28%",
      cell: (r) => (
        <Group gap={6}>
          {(r.audit?.tags ?? []).map((t) => (
            <Badge key={t} variant="light">
              {t}
            </Badge>
          ))}
        </Group>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      width: 240,
      cell: (r) => {
        const has = !!r.audit;
        const items = has
          ? [
              {
                label: "Lihat ticket",
                icon: <IconEye size={16} />,
                href: `/views/tickets/${r.ticketId}`,
              },
              {
                label: "Edit audit",
                icon: <IconPencil size={16} />,
                onClick: () => setEditingAudit({ mode: "edit", row: r }),
              },
              {
                label: "Edit konten resolusi",
                icon: <IconTools size={16} />,
                onClick: () => setEditingResolution(r),
              },
              {
                label: "Approve & Publish",
                icon: <IconCheck size={16} />,
                onClick: () => setStatusFor(r, "approved", true),
              },
              {
                label: "Reject",
                icon: <IconX size={16} />,
                onClick: () => setStatusFor(r, "rejected", false),
              },
              { type: "divider" as const },
              {
                label: "Hapus audit",
                icon: <IconTrash size={16} />,
                color: "red",
                onClick: () => deleteAudit(r),
              },
            ]
          : [
              {
                label: "Lihat ticket",
                icon: <IconEye size={16} />,
                href: `/views/tickets/${r.ticketId}`,
              },
              {
                label: "Mulai audit",
                icon: <IconPlayerPlay size={16} />,
                onClick: () => setEditingAudit({ mode: "create", row: r }),
              },
              {
                label: "Edit konten resolusi",
                icon: <IconTools size={16} />,
                onClick: () => setEditingResolution(r),
              },
            ];
        return <ActionsDropdown items={items as any} />;
      },
    },
  ];

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Title order={3}>Ticket Audit Quality</Title>
        <Button variant="light" onClick={exportCSV}>
          Export CSV
        </Button>
      </Group>

      <Group align="end" gap="sm" wrap="wrap">
        <Select
          label="Status audit"
          data={[
            { value: "all", label: "Semua" },
            { value: "draft", label: "Draft" },
            { value: "approved", label: "Approved" },
            { value: "rejected", label: "Rejected" },
          ]}
          value={status}
          onChange={(v) => setStatus((v as any) ?? "all")}
        />
        <Select
          label="Teknisi"
          data={techOptions}
          value={tech}
          onChange={(v) => setTech((v as any) ?? "all")}
          style={{ minWidth: 200 }}
          searchable
        />
        <DatePickerInput
          type="range"
          label="Rentang waktu (resolved)"
          value={range}
          onChange={(v) => setRange(v as RangeValue)}
          style={{ minWidth: 260 }}
          popoverProps={{ withinPortal: true }}
        />
      </Group>

      <SimpleTable<Row>
        dense="sm"
        zebra
        stickyHeader
        maxHeight={520}
        columns={columns}
        data={filtered}
        emptyText="Belum ada ticket yang perlu diaudit"
      />

      {/* Modal create/edit audit */}
      <AuditFormModal
        opened={!!editingAudit}
        onClose={() => setEditingAudit(null)}
        title={editingAudit?.mode === "edit" ? "Edit Audit" : "Audit Ticket"}
        initial={
          editingAudit?.row.audit
            ? {
                score: editingAudit.row.audit.score,
                tags: editingAudit.row.audit.tags,
                notes: editingAudit.row.audit.notes,
              }
            : {
                score: Math.round(editingAudit?.row.recommendedScore ?? 60),
                tags: [],
              }
        }
        recommendedScore={editingAudit?.row.recommendedScore}
        onEditResolution={
          editingAudit
            ? () => setEditingResolution(editingAudit.row)
            : undefined
        }
        onSubmit={(v) =>
          editingAudit
            ? editingAudit.mode === "edit"
              ? updateAudit(editingAudit.row, v)
              : createAudit(editingAudit.row, v)
            : undefined
        }
      />

      {/* Modal edit konten resolusi */}
      <AuditResolveEditorModal
        opened={!!editingResolution}
        onClose={() => setEditingResolution(null)}
        initial={editingResolution?.resolution ?? undefined}
        onSubmit={(v) => {
          if (!editingResolution) return;
          updateResolution(editingResolution, v as TicketResolutionInput);
          setEditingResolution(null);
        }}
      />
    </Stack>
  );
}
