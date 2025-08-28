"use client";

import { Badge } from "@mantine/core";
import type { TicketPriority } from "../model/types";

export default function TicketPriorityBadge({
  priority,
}: {
  priority: TicketPriority;
}) {
  const map: Record<TicketPriority, { color: string; label: string }> = {
    low: { color: "gray", label: "Low" },
    medium: { color: "blue", label: "Medium" },
    high: { color: "orange", label: "High" },
    urgent: { color: "red", label: "Urgent" },
  };
  const v = map[priority];
  return (
    <Badge color={v.color} variant="light" radius="sm">
      {v.label}
    </Badge>
  );
}
