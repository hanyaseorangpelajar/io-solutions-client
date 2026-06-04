"use client";

import { Badge } from "@mantine/core";
import type { TicketPriority } from "../model/types";

export default function TicketPriorityBadge({
  priority,
}: {
  priority?: TicketPriority | string;
}) {
  const map: Record<string, { color: string; label: string }> = {
    LOW: { color: "gray", label: "Low" },
    MEDIUM: { color: "blue", label: "Medium" },
    HIGH: { color: "orange", label: "High" },
    URGENT: { color: "red", label: "Urgent" },
  };

  const key = priority || "LOW";
  const v = map[key] ?? map.LOW;

  return (
    <Badge color={v.color} variant="light" radius="sm">
      {v.label}
    </Badge>
  );
}
