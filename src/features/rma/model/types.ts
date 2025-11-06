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

export type RmaAction = {
  id: string;
  type: RmaActionType;
  note?: string;
  by: { id: string; name?: string; username?: string } | string;
  at: string;
  payload?: Record<string, unknown>;
};

export type RmaRecord = {
  id: string;
  code: string;
  title: string;
  customerName: string;
  contact?: string;
  productName: string;
  productSku?: string;
  ticketId?: string;
  ticket?: { id: string; code: string; subject?: string };

  warranty: WarrantyInfo;

  status: RmaStatus;
  createdAt: string;
  updatedAt: string;

  actions: RmaAction[];
};
