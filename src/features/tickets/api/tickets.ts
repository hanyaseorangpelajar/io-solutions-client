// src/features/tickets/api/tickets.ts
import { http } from "./http";
import type { Ticket } from "../model/types";
import type { TicketFormInput, TicketResolutionInput } from "../model/schema";

export type Paginated<T> = {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

function qs(params: Record<string, any>): string {
  const q = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "" && v !== "all")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
  return q ? `?${q}` : "";
}

// ---- Tickets
export async function listTickets(params: {
  q?: string;
  status?: string;         // open | in_progress | resolved | closed | all
  priority?: string;       // low | medium | high | urgent | all
  assignee?: string | "unassigned" | "all";
  from?: string;           // ISO date
  to?: string;             // ISO date
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt" | "priority" | "status" | "subject";
  order?: "asc" | "desc";
}): Promise<Paginated<Ticket>> {
  const p: any = { ...params };
  if (p.assignee === "unassigned") {
    // backend filter 'assignee' kosong → kita ambil semua lalu filter client-side,
    // atau gunakan konvensi: kirim assignee="" dan backend treat sebagai empty.
    p.assignee = ""; // backend kita treat: string kosong artinya unassigned
  }
  return http<Paginated<Ticket>>(`/api/v1/tickets${qs(p)}`);
}

export async function getTicket(id: string): Promise<Ticket> {
  return http<Ticket>(`/api/v1/tickets/${encodeURIComponent(id)}`);
}

export async function createTicket(input: TicketFormInput): Promise<Ticket> {
  // Backend menerima subject, requester, priority, status, assignee, description
  return http<Ticket>("/api/v1/tickets", { method: "POST", body: input });
}

export async function updateTicket(id: string, patch: Partial<TicketFormInput>): Promise<Ticket> {
  return http<Ticket>(`/api/v1/tickets/${encodeURIComponent(id)}`, { method: "PUT", body: patch });
}

export async function updateTicketStatus(id: string, status: "open"|"in_progress"|"resolved"|"closed"): Promise<Ticket> {
  return http<Ticket>(`/api/v1/tickets/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export async function resolveTicket(id: string, payload: TicketResolutionInput): Promise<Ticket> {
  // FE punya: { rootCause, solution, parts[], photos[], tags[], extraCosts[], ... }
  // BE kita saat ini menerima apa pun dan menyimpan yang dikenalnya; ke depan model BE sudah kita siapkan untuk diperluas.
  return http<Ticket>(`/api/v1/tickets/${encodeURIComponent(id)}/resolve`, {
    method: "PATCH",
    body: payload,
  });
}

export async function deleteTicket(id: string): Promise<{ message: string; id: string }> {
  return http<{ message: string; id: string }>(`/api/v1/tickets/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

// ---- History (per-ticket)
export type TicketEvent = {
  id: string;
  ticketId: string;
  type: "created" | "updated" | "status_changed" | "resolved" | "deleted";
  payload: Record<string, unknown>;
  actor: string | null;
  createdAt: string;
};

export async function getTicketHistory(id: string): Promise<TicketEvent[]> {
  return http<TicketEvent[]>(`/api/v1/tickets/${encodeURIComponent(id)}/history`);
}
