"use client";

import { Badge } from "@mantine/core";
import type { PartStatus } from "../model/types";

export default function PartStatusBadge({ status }: { status: PartStatus }) {
  const color =
    status === "active" ? "green" : status === "inactive" ? "gray" : "red";
  return (
    <Badge color={color} variant="light">
      {status.toUpperCase()}
    </Badge>
  );
}
