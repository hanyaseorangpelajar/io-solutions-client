"use client";

import { Badge } from "@mantine/core";
import type { TicketStatus } from "../model/types";

export default function TicketStatusBadge({
  status,
}: {
  status: TicketStatus;
}) {
  const map: Record<TicketStatus, { color: string; label: string }> = {
    open: { color: "blue", label: "Open" },
    in_progress: { color: "yellow", label: "In progress" },
    resolved: { color: "green", label: "Resolved" },
    closed: { color: "gray", label: "Closed" },
  };
  const v = map[status];
  return (
    <Badge color={v.color} variant="light" radius="sm">
      {v.label}
    </Badge>
  );
}
