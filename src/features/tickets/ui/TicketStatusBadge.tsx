"use client";

import { Badge } from "@mantine/core";

export default function TicketStatusBadge({ status }: { status?: string }) {
  const map: Record<string, { color: string; label: string }> = {
    Diagnosis: { color: "blue", label: "Diagnosis" },
    DalamProses: { color: "yellow", label: "Dalam Proses" },
    MenungguSparepart: { color: "orange", label: "Menunggu Sparepart" },
    Selesai: { color: "green", label: "Selesai" },
    Dibatalkan: { color: "red", label: "Dibatalkan" },

    open: { color: "blue", label: "Open" },
    in_progress: { color: "yellow", label: "In progress" },
    resolved: { color: "green", label: "Resolved" },
    closed: { color: "gray", label: "Closed" },
  };

  const key = status || "Diagnosis";

  const v = map[key] ?? { color: "gray", label: key };

  return (
    <Badge color={v.color} variant="light" radius="sm">
      {v.label}
    </Badge>
  );
}
