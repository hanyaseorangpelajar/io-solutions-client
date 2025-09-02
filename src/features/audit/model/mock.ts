import type { AuditRecord } from "./types";

// In-memory store (UI-only). Navigasi antar-halaman akan berbagi satu modul ini.
export let AUDITS: AuditRecord[] = [
  {
    id: "a-3",
    ticketId: "3",
    ticketCode: "TCK-2025-000125",
    reviewer: "qa01",
    reviewedAt: "2025-08-28T09:10:00Z",
    status: "approved",
    score: 82,
    notes: "Informasi cukup lengkap, tanpa sparepart.",
    tags: ["provisioning", "software"],
    publish: true,
  },
];

// helpers kecil
export function upsertAudit(a: AuditRecord) {
  const i = AUDITS.findIndex((x) => x.id === a.id);
  if (i >= 0) AUDITS[i] = a;
  else AUDITS.push(a);
}
export function removeAudit(id: string) {
  AUDITS = AUDITS.filter((x) => x.id !== id);
}
