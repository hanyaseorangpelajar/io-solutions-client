"use client";

import { Badge } from "@mantine/core";
import { TicketStatus } from "../model/types";

export default function TicketStatusBadge({ status }: { status?: string }) {
  const map: Record<string, { color: string; label: string }> = {
    DIAGNOSIS: { color: "blue", label: "Diagnosis" },
    IN_PROGRESS: { color: "yellow", label: "Dalam Proses" },
    WAITING_PART: { color: "orange", label: "Menunggu Sparepart" },
    RESOLVED: { color: "green", label: "Selesai" },
    CANCELLED: { color: "red", label: "Dibatalkan" },
    ARCHIVED: { color: "gray", label: "Diarsipkan" },
  };

  const key = status || "DIAGNOSIS";
  const v = map[key] ?? { color: "gray", label: key };

  return (
    <Badge color={v.color} variant="light" radius="sm">
      {v.label}
    </Badge>
  );
}
