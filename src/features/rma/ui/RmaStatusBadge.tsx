"use client";

import { Badge } from "@mantine/core";
import type { RmaStatus } from "../model/types";

const map: Record<
  RmaStatus,
  { label: string; color: string; variant?: "light" | "filled" | "outline" }
> = {
  new: { label: "Baru", color: "gray" },
  received: { label: "Diterima", color: "blue" },
  sent_to_vendor: { label: "Dikirim ke Vendor", color: "yellow" },
  in_vendor: { label: "Proses Vendor", color: "violet" },
  replaced: { label: "Diganti", color: "green" },
  repaired: { label: "Diperbaiki", color: "green" },
  returned: { label: "Dikembalikan", color: "teal" },
  rejected: { label: "Ditolak", color: "red" },
  cancelled: { label: "Batal", color: "gray", variant: "outline" },
};

export default function RmaStatusBadge({ status }: { status: RmaStatus }) {
  const s = map[status];
  return (
    <Badge color={s.color} variant={s.variant ?? "light"}>
      {s.label}
    </Badge>
  );
}
