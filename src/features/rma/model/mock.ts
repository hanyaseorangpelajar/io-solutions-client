import type { RmaRecord } from "./types";

export const MOCK_RMAS: RmaRecord[] = [
  {
    id: "1",
    code: "RMA-2025-0001",
    title: "Keyboard K120 double typing",
    customerName: "Budi",
    contact: "0812xxxxxxx",
    productName: "Logitech K120",
    productSku: "LG-K120",
    ticketId: "TCK-1023",
    issueDesc: "Double typing pada huruf A, garansi 1 tahun.",
    warranty: {
      purchaseDate: "2025-01-15T00:00:00.000Z",
      warrantyMonths: 12,
      serial: "L120-XYZ-123",
      vendor: "Distributor A",
      invoiceNo: "INV-101010",
    },
    status: "received",
    createdAt: "2025-08-01T07:12:00.000Z",
    updatedAt: "2025-08-05T08:40:00.000Z",
    actions: [
      {
        id: "act-1",
        type: "receive_unit",
        note: "Unit diterima lengkap beserta dus",
        by: "sysadmin",
        at: "2025-08-01T07:12:00.000Z",
      },
      {
        id: "act-2",
        type: "send_to_vendor",
        note: "Kirim ke Distributor A, no resi 12345",
        by: "sysadmin",
        at: "2025-08-02T03:00:00.000Z",
        payload: { awb: "12345" },
      },
    ],
  },
  {
    id: "rma-2",
    code: "RMA-2025-0002",
    title: "SSD 1TB bad sector",
    customerName: "Sari",
    contact: "sari@example.com",
    productName: "NVMe 1TB Gen3",
    productSku: "NV1T-GEN3",
    ticketId: undefined,
    issueDesc: "SMART menunjukkan reallocated sectors meningkat.",
    warranty: {
      purchaseDate: "2024-12-02T00:00:00.000Z",
      warrantyMonths: 36,
      serial: "NV1T-ABC-789",
      vendor: "Vendor B",
    },
    status: "in_vendor",
    createdAt: "2025-08-10T02:30:00.000Z",
    updatedAt: "2025-08-20T10:00:00.000Z",
    actions: [
      {
        id: "act-3",
        type: "receive_unit",
        by: "admin",
        at: "2025-08-10T02:30:00.000Z",
        note: "Tanpa dus, hanya drive",
      },
      {
        id: "act-4",
        type: "send_to_vendor",
        by: "admin",
        at: "2025-08-11T01:00:00.000Z",
        note: "Dikirim vendor B",
      },
      {
        id: "act-5",
        type: "vendor_update",
        by: "admin",
        at: "2025-08-20T10:00:00.000Z",
        note: "Vendor terima, estimasi 7 hari",
      },
    ],
  },
];

export function getMockRmaById(id: string) {
  return MOCK_RMAS.find((r) => r.id === id);
}
