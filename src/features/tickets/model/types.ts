type UserRef = {
  _id: string;
  fullName: string;
};

export type TicketPriority = "low" | "medium" | "high" | "urgent";

export type TicketStatus =
  | "Diagnosis"
  | "DalamProses"
  | "MenungguSparepart"
  | "Selesai"
  | "Dibatalkan";

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
  _id: string;

  nomorTiket: string;
  status: string;
  keluhanAwal: string;
  tanggalMasuk: string;
  diperbaruiPada: string;
  tanggalSelesai?: string;

  customerId: {
    id: string;
    _id: string;
    nama: string;
    noHp?: string;
  };
  deviceId: {
    id: string;
    _id: string;
    brand?: string;
    model?: string;
    serialNumber?: string;
    tipe?: string;
  };
  teknisiId?: {
    id: string;
    _id: string;
    nama: string;
  } | null;

  code?: string;
  priority?: TicketPriority;
  customer?: TicketCustomer;
  deviceInfo?: TicketDeviceInfo;
  initialComplaint?: string;
  assignedTo?: string | UserRef | null;
  createdAt?: string;
  updatedAt?: string;
  resolution: TicketResolution | null;
  diagnostics?: Diagnostic[];
  actions?: Action[];
};

export const TICKET_PRIORITIES: TicketPriority[] = [
  "low",
  "medium",
  "high",
  "urgent",
];
export const TICKET_STATUSES: TicketStatus[] = [
  "Diagnosis",
  "DalamProses",
  "MenungguSparepart",
  "Selesai",
  "Dibatalkan",
];

export type PartUsage = {
  partId: string;
  name: string;
  qty: number;
};
