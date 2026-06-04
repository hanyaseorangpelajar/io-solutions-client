export const TICKET_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;
export type TicketPriority = (typeof TICKET_PRIORITIES)[number];

export const TICKET_STATUSES = [
  "DIAGNOSIS",
  "IN_PROGRESS",
  "WAITING_PART",
  "RESOLVED",
  "CANCELLED",
  "ARCHIVED",
] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export interface StatusHistory {
  timestamp: string;
  newStatus: TicketStatus;
  note: string;
}

export interface ReplacementItem {
  componentName: string;
  quantity: number;
  note: string | null;
}

export interface TicketCustomer {
  customerId: string;
  name: string;
  phone: string | null;
}

export interface TicketDevice {
  deviceId: string;
  type: string | null;
  brand: string | null;
  model: string | null;
  serialNumber: string | null;
}

export interface TicketTechnician {
  technicianId: string;
  name: string | null;
}

export interface ServiceTicketDto {
  ticketId: string;
  ticketNumber: string;
  status: TicketStatus;
  priority: TicketPriority;
  initialComplaint: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;

  technicianDiagnosis: string | null;
  technicianSolution: string | null;

  customer: TicketCustomer | string;
  device: TicketDevice | string;
  technician: TicketTechnician | string | null;

  statusHistory: StatusHistory[];
  replacementItems: ReplacementItem[];
}

export interface PartUsage {
  partId: string;
  name: string;
  qty: number;
}
