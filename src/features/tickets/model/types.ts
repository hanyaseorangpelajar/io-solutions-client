type UserRef = {
  _id: string;
  fullName: string;
};

export type TicketPriority = "low" | "medium" | "high" | "urgent";

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

export type TicketCustomer = {
  name: string;
  phone?: string;
};

export type TicketDeviceInfo = {
  type?: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
};

export type Diagnostic = {
  symptom: string;
  diagnosis: string;
  timestamp: string;
};

export type Action = {
  actionTaken: string;
  partsUsed: {
    part: string;
    quantity: number;
  }[];
  timestamp: string;
};

export type TicketResolution = {
  notes?: string;
  solution: string;

  resolvedBy: string | UserRef;
  resolvedAt: string;

  knowledgeEntry?: string;
  knowledgeEntryId?: string;
};

export type Ticket = {
  id: string;
  code: string;
  status: TicketStatus;
  priority: TicketPriority;

  customer: TicketCustomer;
  deviceInfo: TicketDeviceInfo;
  initialComplaint: string;

  diagnostics?: Diagnostic[];
  actions?: Action[];

  assignedTo: string | UserRef | null;
  assignedToId?: string;

  createdBy: string | UserRef;
  createdById?: string;

  resolution: TicketResolution | null;

  createdAt: string;
  updatedAt: string;
};

export const TICKET_PRIORITIES: TicketPriority[] = [
  "low",
  "medium",
  "high",
  "urgent",
];
export const TICKET_STATUSES: TicketStatus[] = [
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
