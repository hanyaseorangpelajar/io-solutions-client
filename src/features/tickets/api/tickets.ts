import apiClient from "@/lib/apiClient";
import type { ServiceTicketDto, TicketStatus } from "../model/types";
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
  params: Record<string, any>,
): Promise<Paginated<ServiceTicketDto>> {
  const p: any = { ...params };

  if (p.assignee) {
    p.technicianId = p.assignee;
  }
  delete p.assignee;

  if (p.status === "open") p.status = "DIAGNOSIS";
  if (p.status === "in_progress") p.status = "IN_PROGRESS";

  const response = await apiClient.get<
    ServerPaginatedResponse<ServiceTicketDto>
  >(`/tickets${qs(p)}`);

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

export async function getTicket(id: string): Promise<ServiceTicketDto> {
  const response = await apiClient.get<ServiceTicketDto>(
    `/tickets/${encodeURIComponent(id)}`,
  );
  return response.data;
}

export async function createTicket(
  input: TicketFormInput,
): Promise<ServiceTicketDto> {
  const response = await apiClient.post<ServiceTicketDto>("/tickets", input);
  return response.data;
}

export async function assignTicket(
  id: string,
  userId: string | null,
): Promise<ServiceTicketDto> {
  const response = await apiClient.patch<ServiceTicketDto>(
    `/tickets/${encodeURIComponent(id)}/assign`,
    { technicianId: userId || null },
  );
  return response.data;
}

export async function updateTicketStatus(
  id: string,
  status: TicketStatus,
  note?: string,
): Promise<ServiceTicketDto> {
  const response = await apiClient.patch<ServiceTicketDto>(
    `/tickets/${encodeURIComponent(id)}/status`,
    { status, note },
  );
  return response.data;
}

export type AddItemInput = {
  componentName: string;
  quantity: number;
  note?: string;
};

export async function addReplacementItem(
  id: string,
  payload: AddItemInput,
): Promise<ServiceTicketDto> {
  const response = await apiClient.post<ServiceTicketDto>(
    `/tickets/${encodeURIComponent(id)}/items`,
    payload,
  );
  return response.data;
}

export type TechnicianCompleteInput = {
  diagnosis: string;
  solution: string;
};

export async function completeTicketByTeknisi(
  id: string,
  payload: TechnicianCompleteInput,
): Promise<ServiceTicketDto> {
  const response = await apiClient.post<ServiceTicketDto>(
    `/tickets/${encodeURIComponent(id)}/complete-teknisi`,
    payload,
  );
  return response.data;
}

export type CompleteTicketInput = {
  diagnosis: string;
  solution: string;
  tags?: string[];
};

export async function completeTicketAndCreateKB(
  id: string,
  payload: CompleteTicketInput,
): Promise<{ ticket: ServiceTicketDto; kbEntry: any }> {
  const response = await apiClient.post<{
    ticket: ServiceTicketDto;
    kbEntry: any;
  }>(`/tickets/${encodeURIComponent(id)}/complete`, payload);
  return response.data;
}

export type TicketHistoryEvent = {
  _id: string;
  timestamp: string;
  note: string;
  newStatus: TicketStatus;
  ticketNumber: string;
  ticketId: string;
  technicianName: string | null;
  customerName: string | null;
};

export async function getGlobalTicketHistory(
  params: Record<string, any>,
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
