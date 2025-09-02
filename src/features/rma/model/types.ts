// RMA & Warranty — domain types

export type RmaStatus =
  | "new" // baru dibuat, menunggu unit diterima
  | "received" // unit diterima dari pelanggan
  | "sent_to_vendor" // dikirim ke vendor
  | "in_vendor" // dalam proses vendor
  | "replaced" // diganti unit baru oleh vendor
  | "repaired" // diperbaiki oleh vendor
  | "returned" // dikembalikan ke pelanggan
  | "rejected" // klaim ditolak vendor
  | "cancelled"; // dibatalkan

export type WarrantyInfo = {
  purchaseDate?: string; // ISO
  warrantyMonths?: number; // durasi garansi, bulan
  serial?: string;
  vendor?: string; // nama vendor/RMA center
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

export type RmaAction = {
  id: string;
  type: RmaActionType;
  note?: string;
  by: string; // user/operator
  at: string; // ISO datetime
  payload?: Record<string, unknown>; // bebas (resi, biaya, dst.)
};

export type RmaRecord = {
  id: string;
  code: string; // RMA-YYYY-XXXX
  title: string; // ringkas: "Keyboard XYZ double typing"
  customerName: string;
  contact?: string; // telp/email
  productName: string;
  productSku?: string;
  ticketId?: string; // jika berasal dari tiket
  issueDesc?: string;

  warranty: WarrantyInfo;

  status: RmaStatus;
  createdAt: string; // ISO
  updatedAt: string; // ISO

  actions: RmaAction[]; // timeline
};
