export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent";

export type Ticket = {
  id: string; // UUID or code
  code: string; // e.g., TCK-2025-000123
  subject: string;
  requester: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
  assignee?: string;
  description?: string;

  resolution?: TicketResolution; // terisi saat status "resolved/closed"
};

export type Part = {
  id: string;
  name: string;
  sku?: string;
  unit?: string; // pcs, set, dll
  stock?: number;
};

export type PartUsage = {
  partId: string;
  name: string;
  qty: number;
};

export type TicketResolution = {
  rootCause: string;
  solution: string;
  parts: PartUsage[];
  photos: string[]; // UI-only: pakai Object URLs untuk preview
  tags: string[]; // hashtag/label
  resolvedBy: string; // teknisi
  resolvedAt: string; // ISO datetime
};
