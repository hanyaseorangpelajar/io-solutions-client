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
  _id: string; // <-- UBAH DARI 'id'
  type: RmaActionType;
  note?: string;
  by: string; // user/operator
  at: string; // ISO datetime
  payload?: Record<string, unknown>;
};

export type RmaRecord = {
  _id: string; // <-- UBAH DARI 'id'
  code: string; // RMA-YYYY-XXXX
  title: string;
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
