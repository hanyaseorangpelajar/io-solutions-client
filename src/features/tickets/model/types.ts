export type Priority = "low" | "medium" | "high" | "urgent";
export type TicketPriority = Priority;

export type Status = "open" | "in_progress" | "resolved" | "closed";
export type TicketStatus = Status;

export type CustomCost = {
  label: string;
  amount: number;
};

export type TicketResolution = {
  rootCause: string;
  solution: string;
  parts?: PartUsage[];
  photos?: string[];
  tags?: string[];
  extraCosts?: CustomCost[];
  resolvedBy: string;
  resolvedAt: string;
};

export type Ticket = {
  id: string;
  code: string;
  subject: string;
  requester: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignee: string | null;
  description: string;
  resolution: TicketResolution | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  diagnostics?: Diagnostic[];
  actions?: Action[];
};

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

export type PartUsage = {
  partId: string;
  name: string;
  qty: number;
};

export type Diagnostic = {
  symptom: string;
  diagnosis: string;
  timestamp: string;
};

export type Action = {
  actionTaken: string;
  partsUsed: PartUsage[];
  timestamp: string;
};
