import type { Part, Ticket } from "./types";

export const MOCK_TICKETS: Ticket[] = [
  {
    id: "1",
    code: "TCK-2025-000123",
    subject: "Keyboard laptop tidak berfungsi",
    requester: "Andi",
    priority: "medium",
    status: "open",
    createdAt: "2025-08-26T09:12:00Z",
    updatedAt: "2025-08-26T09:12:00Z",
    assignee: "tech01",
    description: "Keyboard tidak merespon beberapa tombol.",
  },
  {
    id: "2",
    code: "TCK-2025-000124",
    subject: "PC sering restart sendiri",
    requester: "Budi",
    priority: "high",
    status: "in_progress",
    createdAt: "2025-08-26T10:05:00Z",
    updatedAt: "2025-08-27T08:01:00Z",
    assignee: "tech02",
  },
  {
    id: "3",
    code: "TCK-2025-000125",
    subject: "Permintaan instalasi software desain",
    requester: "Citra",
    priority: "low",
    status: "resolved",
    createdAt: "2025-08-25T14:20:00Z",
    updatedAt: "2025-08-27T10:33:00Z",
    assignee: "tech03",
    resolution: {
      rootCause: "Tidak ada—permintaan layanan.",
      solution: "Instal software sesuai lisensi.",
      parts: [],
      photos: [],
      tags: ["provisioning"],
      resolvedBy: "tech03",
      resolvedAt: "2025-08-27T10:30:00Z",
    },
  },
  {
    id: "4",
    code: "TCK-2025-000126",
    subject: "Monitor berkedip",
    requester: "Dewi",
    priority: "urgent",
    status: "open",
    createdAt: "2025-08-27T16:47:00Z",
    updatedAt: "2025-08-27T16:47:00Z",
  },
];

export const PARTS: Part[] = [
  {
    id: "p-101",
    name: 'Keyboard Laptop 14"',
    sku: "KB14-BLK",
    unit: "pcs",
    stock: 12,
  },
  {
    id: "p-102",
    name: "Thermal Paste",
    sku: "TP-STD",
    unit: "tube",
    stock: 25,
  },
  {
    id: "p-103",
    name: "SSD 512GB NVMe",
    sku: "SSD-512-NV",
    unit: "pcs",
    stock: 8,
  },
  {
    id: "p-104",
    name: "Kabel HDMI 1.5m",
    sku: "HDMI-1.5",
    unit: "pcs",
    stock: 30,
  },
  { id: "p-105", name: 'LCD Monitor 24"', sku: "LCD24", unit: "pcs", stock: 3 },
];

export function getMockTicketById(id: string) {
  return MOCK_TICKETS.find((t) => t.id === id || t.code === id);
}
