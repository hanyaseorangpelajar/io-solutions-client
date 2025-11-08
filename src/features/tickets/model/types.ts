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

export type StatusHistory = {
  waktu: string;
  statusBaru: TicketStatus;
  catatan: string;
};

export type ReplacementItem = {
  namaKomponen: string;
  qty: number;
  keterangan?: string;
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

  statusHistory: StatusHistory[];
  replacementItems: ReplacementItem[];
};

export const TICKET_PRIORITIES = ["low", "medium", "high", "urgent"] as const;

export const TICKET_STATUSES = [
  "Diagnosis",
  "DalamProses",
  "MenungguSparepart",
  "Selesai",
  "Dibatalkan",
] as const;

export type PartUsage = {
  partId: string;
  name: string;
  qty: number;
};
