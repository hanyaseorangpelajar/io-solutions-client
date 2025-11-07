import type { Ticket } from "@/features/tickets";

/**
 * Mengambil nama assignee dari objek tiket.
 * @param t - Objek tiket.
 * @returns Nama assignee atau "Unassigned".
 */
export function getAssigneeName(t: Partial<Ticket>): string {
  const a = t?.assignee;
  if (!a) return "Unassigned";
  if (typeof a === "string") return a || "Unassigned";
  if (typeof a === "object" && "name" in a && (a as any).name) {
    return String((a as any).name);
  }
  return "Unassigned";
}

/**
 * Menentukan warna badge berdasarkan prioritas tiket.
 */
export function priorityColor(p?: string): string {
  const v = (p ?? "").toLowerCase();
  if (v.includes("urgent") || v.includes("critical")) return "red";
  if (v.includes("high")) return "orange";
  if (v.includes("medium")) return "yellow";
  if (v.includes("low")) return "green";
  return "gray";
}

/**
 * Menentukan warna badge berdasarkan status.
 */
export function statusColor(s?: string): string {
  const v = (s ?? "").toLowerCase();

  if (v.includes("diagnosis")) return "blue";
  if (v.includes("dalamproses")) return "indigo";
  if (v.includes("menunggusparepart")) return "yellow";
  if (v.includes("selesai")) return "green";
  if (v.includes("dibatalkan")) return "red";

  if (v.includes("new") || v.includes("open")) return "blue";
  if (v.includes("progress") || v.includes("work")) return "indigo";
  if (v.includes("hold") || v.includes("pending")) return "yellow";
  if (v.includes("resolved")) return "green";
  if (v.includes("closed") || v.includes("done")) return "gray";
  if (v.includes("cancel")) return "red";

  return "gray";
}
