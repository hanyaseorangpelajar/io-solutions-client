// File: features/tickets/api/tickets.ts

import apiClient from "@/lib/apiClient";
import type { Ticket } from "../model/types";
import type {
  TicketFormInput,
  TicketResolutionInput,
  PartUsageInput,
} from "../model/schema";

// Tipe ini (Paginated) adalah standar internal frontend kita.
// Ini yang DIHARAPKAN oleh komponen UI.
export type Paginated<T> = {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

// [BARU] Tipe ini adalah apa yang DIKIRIM oleh server.
type ServerPaginatedResponse<T> = {
  results: T[];
  page: number;
  limit: number;
  totalResults: number;
  totalPages: number;
};

function qs(params: Record<string, any>): string {
  const q = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "" && v !== "all")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
  return q ? `?${q}` : "";
}

// [PERBAIKAN PADA FUNGSI INI]
export async function listTickets(
  params: Record<string, any> // Lebih baik gunakan Record<string, any> daripada {}
): Promise<Paginated<Ticket>> {
  const p: any = { ...params };
  if (p.assignee === "unassigned") {
    p.assignee = "";
  }

  // 1. Beri tahu Axios tipe data yang BENAR-BENAR dikirim server
  const response = await apiClient.get<ServerPaginatedResponse<Ticket>>(
    `/tickets${qs(p)}`
  );

  const serverData = response.data;

  // 2. Terjemahkan/Mapelkan respons server ke tipe data internal frontend
  return {
    data: serverData.results, // <-- Map 'results' ke 'data'
    meta: {
      page: serverData.page,
      limit: serverData.limit,
      total: serverData.totalResults,
      totalPages: serverData.totalPages,
    },
  };
}
// [AKHIR PERBAIKAN]

export async function getTicket(id: string): Promise<Ticket> {
  const response = await apiClient.get<Ticket>(
    `/tickets/${encodeURIComponent(id)}`
  );
  return response.data;
}

export async function createTicket(input: TicketFormInput): Promise<Ticket> {
  const response = await apiClient.post<Ticket>("/tickets", input);
  return response.data;
}

export async function assignTicket(
  id: string,
  userId: string | null
): Promise<Ticket> {
  const response = await apiClient.put<Ticket>(
    `/tickets/${encodeURIComponent(id)}/assign`,
    { userId: userId || null }
  );
  return response.data;
}

export async function updateTicketStatus(
  id: string,
  status: string
): Promise<Ticket> {
  const response = await apiClient.patch<Ticket>( // <-- GANTI MENJADI .patch
    `/tickets/${encodeURIComponent(id)}/status`,
    { status }
  );
  return response.data;
}

export async function resolveTicket(
  id: string,
  payload: TicketResolutionInput
): Promise<Ticket> {
  const response = await apiClient.put<Ticket>(
    `/tickets/${encodeURIComponent(id)}/resolve`,
    payload
  );
  return response.data;
}

export async function addDiagnosis(
  id: string,
  payload: { symptom: string; diagnosis: string }
): Promise<Ticket> {
  const response = await apiClient.put<Ticket>(
    `/tickets/${encodeURIComponent(id)}/diagnose`,
    payload
  );
  return response.data;
}

export async function addAction(
  id: string,
  payload: { actionTaken: string; partsUsed: PartUsageInput[] }
): Promise<Ticket> {
  const response = await apiClient.put<Ticket>(
    `/tickets/${encodeURIComponent(id)}/action`,
    payload
  );
  return response.data;
}

export type AuditLogEvent = {
  id: string;
  at: string;
  who: string;
  ticketId: string;
  ticketCode: string;
  action: "draft" | "approved" | "rejected";
  description: string;
};

export async function getTicketHistory(id: string): Promise<AuditLogEvent[]> {
  const response = await apiClient.get<AuditLogEvent[]>(
    `/tickets/${encodeURIComponent(id)}/history`
  );
  return response.data;
}

export async function getGlobalAuditLog(
  params: Record<string, any>
): Promise<Paginated<AuditLogEvent>> {
  // 3. Terapkan perbaikan yang sama di sini untuk global audit log
  const response = await apiClient.get<ServerPaginatedResponse<AuditLogEvent>>(
    `/audits${qs(params)}`
  );

  const serverData = response.data;
  return {
    data: serverData.results, // Map 'results' ke 'data'
    meta: {
      page: serverData.page,
      limit: serverData.limit,
      total: serverData.totalResults,
      totalPages: serverData.totalPages,
    },
  };
}
