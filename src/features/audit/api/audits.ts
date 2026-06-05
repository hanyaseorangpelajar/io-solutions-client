import apiClient from "@/lib/apiClient";
import type { Paginated } from "@/features/tickets/api/tickets";
import type { KBEntryDto } from "../model/types";
import type { KBFormInput } from "../model/schema";

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
    .map(
      ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
    )
    .join("&");
  return q ? `?${q}` : "";
}

export async function listKBSolutions(
  params: Record<string, any>,
): Promise<Paginated<KBEntryDto>> {
  const endpoint = `/kb-entry${qs(params)}`;

  const response =
    await apiClient.get<ServerPaginatedResponse<KBEntryDto>>(endpoint);

  const serverData = response.data;
  const results = serverData.results ?? [];
  const total = serverData.totalResults ?? results.length;

  return {
    data: results,
    meta: {
      page: serverData.page || 1,
      limit: serverData.limit || total,
      total: total,
      totalPages: serverData.totalPages || 1,
    },
  };
}

export type KBEntryUpdateInput = KBFormInput;

export async function updateKBEntry(
  id: string,
  payload: KBEntryUpdateInput,
): Promise<KBEntryDto> {
  const response = await apiClient.patch<KBEntryDto>(
    `/kb-entry/${id}`,
    payload,
  );
  return response.data;
}

export async function deleteKBEntry(id: string): Promise<void> {
  await apiClient.delete(`/kb-entry/${id}`);
}

export async function getKBEntry(id: string): Promise<KBEntryDto> {
  const response = await apiClient.get<KBEntryDto>(`/kb-entry/${id}`);
  return response.data;
}
