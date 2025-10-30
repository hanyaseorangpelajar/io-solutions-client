// File: features/rma/model/types.ts

export type RmaStatus =
  | "new"
  | "received"
  | "sent_to_vendor"
  | "in_vendor"
  | "replaced"
  | "repaired"
  | "returned"
  | "rejected"
  | "cancelled";

export type WarrantyInfo = {
  purchaseDate?: string;
  warrantyMonths?: number;
  serial?: string;
  vendor?: string;
  invoiceNo?: string;
};

export type RmaActionType =
  | "receive_unit"
  | "send_to_vendor"
  | "vendor_update"
  | "replace"
  | "repair"
  | "return_to_customer"
  | "reject"
  | "cancel";

// [PERBAIKAN 1]
export type RmaAction = {
  id: string; // <-- Ganti dari '_id'
  type: RmaActionType;
  note?: string;
  // Ubah 'by' menjadi object User sederhana jika backend mengirimkannya
  // Jika backend hanya kirim ID string, biarkan 'string'
  by: { id: string; name?: string; username?: string } | string;
  at: string; // ISO datetime
  payload?: Record<string, unknown>;
};

// [PERBAIKAN 2]
export type RmaRecord = {
  id: string; // <-- Ganti dari '_id'
  code: string;
  title: string;
  customerName: string;
  contact?: string;
  productName: string;
  productSku?: string;
  ticketId?: string; // ID tiket terkait
  // Tambahkan detail tiket jika backend mengirimkannya setelah populate
  ticket?: { id: string; code: string; subject?: string };

  warranty: WarrantyInfo;

  status: RmaStatus;
  createdAt: string; // ISO
  updatedAt: string; // ISO

  actions: RmaAction[]; // timeline
};
