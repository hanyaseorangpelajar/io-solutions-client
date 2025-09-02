import type { Ticket } from "./types";

// Mock data UI-only. Beberapa ticket resolved berisi parts agar bisa dipakai
// fitur "Stock Out dari Ticket", Audit/Repository, dll.
export const MOCK_TICKETS: Ticket[] = [
  {
    id: "1",
    code: "TCK-2025-000121",
    subject: "Keyboard tidak berfungsi sebagian",
    requester: "Andi",
    priority: "medium",
    status: "open",
    assignee: "tech-01",
    description: "Beberapa tombol huruf tidak responsif.",
    createdAt: "2025-08-25T03:10:00Z",
    updatedAt: "2025-08-25T03:10:00Z",
  },
  {
    id: "2",
    code: "TCK-2025-000122",
    subject: 'Monitor kedip-kedip (24")',
    requester: "Sari",
    priority: "high",
    status: "in_progress",
    assignee: "tech-02",
    description: "Gambar flicker di brightness rendah.",
    createdAt: "2025-08-26T02:00:00Z",
    updatedAt: "2025-08-27T07:20:00Z",
  },
  {
    id: "3",
    code: "TCK-2025-000123",
    subject: "Jaringan lantai 2 sering putus",
    requester: "Bagas",
    priority: "urgent",
    status: "resolved",
    assignee: "tech-02",
    createdAt: "2025-08-24T01:00:00Z",
    updatedAt: "2025-08-28T08:30:00Z",
    resolution: {
      rootCause: "Crimping RJ45 buruk; 2 pin tidak terkunci.",
      solution:
        "Ganti konektor RJ45, test T568B pass, dan rapihkan jalur kabel. Monitoring 24 jam.",
      parts: [{ partId: "p-4", name: "RJ45 Connector Cat6", qty: 8 }],
      photos: [
        "https://picsum.photos/seed/net01/800/600",
        "https://picsum.photos/seed/net02/800/600",
      ],
      tags: ["network", "rj45", "hardware", "SOP"],
      extraCosts: [
        { label: "Biaya kunjungan", amount: 50000 },
        { label: "Jasa servis", amount: 150000 },
      ],
      resolvedBy: "tech-02",
      resolvedAt: "2025-08-28T08:25:00Z",
    },
  },
  {
    id: "4",
    code: "TCK-2025-000124",
    subject: "Thermal throttling pada PC akuntansi",
    requester: "Rina",
    priority: "high",
    status: "resolved",
    assignee: "tech-01",
    createdAt: "2025-08-23T05:00:00Z",
    updatedAt: "2025-08-27T11:10:00Z",
    resolution: {
      rootCause: "Thermal paste kering; heatsink berdebu.",
      solution:
        "Bersihkan heatsink & fan, ganti thermal paste, cek temperatur (idle 42°C, load 72°C).",
      parts: [{ partId: "p-3", name: "Thermal Paste 1g", qty: 1 }],
      photos: ["https://picsum.photos/seed/cooling01/800/600"],
      tags: ["hardware", "cooling", "SOP"],
      extraCosts: [{ label: "Jasa servis", amount: 125000 }],
      resolvedBy: "tech-01",
      resolvedAt: "2025-08-27T10:40:00Z",
    },
  },
  {
    id: "5",
    code: "TCK-2025-000125",
    subject: "Beberapa tombol keyboard tidak responsif",
    requester: "Dewi",
    priority: "low",
    status: "resolved",
    assignee: "tech-03",
    createdAt: "2025-08-22T04:30:00Z",
    updatedAt: "2025-08-27T03:40:00Z",
    resolution: {
      rootCause: "Membrane aus; tidak bisa diperbaiki per tombol.",
      solution: "Ganti unit keyboard baru, test semua key OK.",
      parts: [{ partId: "p-1", name: "Keyboard Membrane 104-key", qty: 1 }],
      photos: ["https://picsum.photos/seed/kb01/800/600"],
      tags: ["hardware", "keyboard", "SOP", "laptop"],
      extraCosts: [],
      resolvedBy: "tech-03",
      resolvedAt: "2025-08-27T03:30:00Z",
    },
  },
];

// Helper untuk detail page
export function getMockTicketById(id: string) {
  return MOCK_TICKETS.find((t) => t.id === id);
}
