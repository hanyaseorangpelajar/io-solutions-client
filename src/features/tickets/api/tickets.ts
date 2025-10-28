import apiClient from "@/lib/apiClient";
import type { Ticket } from "../model/types";
import type {
  TicketFormInput,
  TicketResolutionInput,
  PartUsageInput,
} from "../model/schema";

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

export async function listTickets(params: {}): Promise<Paginated<Ticket>> {
  const p: any = { ...params };
  if (p.assignee === "unassigned") {
    p.assignee = "";
  }
  const response = await apiClient.get<Paginated<Ticket>>(`/tickets${qs(p)}`);
  return response.data;
}

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
  status: "open" | "in_progress" | "resolved" | "closed"
): Promise<Ticket> {
  const response = await apiClient.put<Ticket>(
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

/**
 * Mengambil riwayat untuk SATU tiket
 */
export async function getTicketHistory(id: string): Promise<AuditLogEvent[]> {
  const response = await apiClient.get<AuditLogEvent[]>(
    `/tickets/${encodeURIComponent(id)}/history`
  );
  return response.data;
}

/**
 * PERBAIKAN: Fungsi ini sekarang memanggil endpoint /audits
 * dan mengharapkan data paginasi
 */
export async function getGlobalAuditLog(
  params: Record<string, any>
): Promise<Paginated<AuditLogEvent>> {
  const response = await apiClient.get<Paginated<AuditLogEvent>>(
    `/audits${qs(params)}`
  );
  return response.data;
}
