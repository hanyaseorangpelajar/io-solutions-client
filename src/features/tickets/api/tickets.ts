import apiClient from "@/lib/apiClient";
import type { Ticket, TicketStatus } from "../model/types";
import type {
  TicketFormInput,
  TicketResolutionInput,
  PartUsageInput,
} from "../model/schema";

export type Paginated<T> = {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

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

export async function listTickets(
  params: Record<string, any>
): Promise<Paginated<Ticket>> {
  const p: any = { ...params };
  if (p.assignee === "unassigned") {
    p.assignee = "";
  }
  if (p.status === "open") p.status = "Diagnosis";
  if (p.status === "in_progress") p.status = "DalamProses";

  const response = await apiClient.get<ServerPaginatedResponse<Ticket>>(
    `/tickets${qs(p)}`
  );

  const serverData = response.data;

  return {
    data: serverData.results,
    meta: {
      page: serverData.page,
      limit: serverData.limit,
      total: serverData.totalResults,
      totalPages: serverData.totalPages,
    },
  };
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
  const response = await apiClient.patch<Ticket>(
    `/tickets/${encodeURIComponent(id)}/assign`,
    { teknisiId: userId || null }
  );
  return response.data;
}

export async function updateTicketStatus(
  id: string,
  status: TicketStatus,
  catatan?: string
): Promise<Ticket> {
  const response = await apiClient.patch<Ticket>(
    `/tickets/${encodeURIComponent(id)}/status`,
    { status, catatan }
  );
  return response.data;
}

export type AddItemInput = {
  namaKomponen: string;
  qty: number;
  keterangan?: string;
};
export async function addReplacementItem(
  id: string,
  payload: AddItemInput
): Promise<Ticket> {
  const response = await apiClient.post<Ticket>(
    `/tickets/${encodeURIComponent(id)}/items`,
    payload
  );
  return response.data;
}

export type TeknisiCompleteInput = {
  diagnosis: string;
  solusi: string;
};

export async function completeTicketByTeknisi(
  id: string,
  payload: TeknisiCompleteInput
): Promise<Ticket> {
  const response = await apiClient.post<Ticket>(
    `/tickets/${encodeURIComponent(id)}/complete-teknisi`,
    payload
  );
  return response.data;
}

export type CompleteTicketInput = {
  diagnosis: string;
  solusi: string;
  tags?: string[];
};

export async function completeTicketAndCreateKB(
  id: string,
  payload: CompleteTicketInput
): Promise<{ ticket: Ticket; kbEntry: any }> {
  const response = await apiClient.post<{ ticket: Ticket; kbEntry: any }>(
    `/tickets/${encodeURIComponent(id)}/complete`,
    payload
  );
  return response.data;
}

export type TicketHistoryEvent = {
  _id: string;
  at: string;
  note: string;
  newStatus: TicketStatus;
  ticketCode: string;
  ticketId: string;
  teknisiName: string | null;
  customer: string | null;
};

export async function getGlobalTicketHistory(
  params: Record<string, any>
): Promise<Paginated<TicketHistoryEvent>> {
  const response = await apiClient.get<
    ServerPaginatedResponse<TicketHistoryEvent>
  >(`/tickets/history${qs(params)}`);

  const serverData = response.data;
  return {
    data: serverData.results,
    meta: {
      page: serverData.page,
      limit: serverData.limit,
      total: serverData.totalResults,
      totalPages: serverData.totalPages,
    },
  };
}
