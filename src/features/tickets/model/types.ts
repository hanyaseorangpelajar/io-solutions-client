// ==== Tickets domain types (UI layer) ====

// Prioritas tiket
export type Priority = "low" | "medium" | "high" | "urgent";
// Alias kompatibilitas
export type TicketPriority = Priority;

// Status tiket
export type Status = "open" | "in_progress" | "resolved" | "closed";
// Alias kompatibilitas
export type TicketStatus = Status;

// Part yang dipakai saat perbaikan (refer ke Inventory by id)
export type PartUsage = {
  partId: string; // id dari Inventory
  name: string;
  qty: number;
};

// Biaya tambahan kustom (servis, konsultasi, kunjungan, dll.)
export type CustomCost = {
  label: string;
  amount: number; // IDR, >= 0
};

// Data resolusi tiket
export type TicketResolution = {
  rootCause: string;
  solution: string;
  parts?: PartUsage[];
  photos?: string[];
  tags?: string[];
  extraCosts?: CustomCost[];
  // metadata penyelesaian
  resolvedBy: string; // user id / name
  resolvedAt: string; // ISO datetime
};

// Entitas Ticket
export type Ticket = {
  id: string;
  code: string;
  subject: string;
  requester: string;
  priority: Priority;
  status: Status;
  assignee?: string | null; // user id / name
  description?: string; // <— dipakai di detail & form
  createdAt: string; // ISO
  updatedAt: string; // ISO
  resolution?: TicketResolution;
};

// Kumpulan konstanta (opsional berguna untuk filter UI)
export const TICKET_PRIORITIES: Priority[] = [
  "low",
  "medium",
  "high",
  "urgent",
];
export const TICKET_STATUSES: Status[] = [
  "open",
  "in_progress",
  "resolved",
  "closed",
];
