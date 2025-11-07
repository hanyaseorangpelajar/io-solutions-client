import apiClient from "@/lib/apiClient";
import type { Paginated } from "@/features/tickets/api/tickets";
import type { KBEntry } from "@/features/kb/model/types";

export type KBEntryBackend = {
  id: string;
  gejala: string;
  modelPerangkat: string;
  diagnosis: string;
  solusi: string;
  sourceTicketId: {
    _id: string;
    nomorTiket: string;
  };
  tags: {
    id: string;
    nama: string;
  }[];
  dibuatPada: string;
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
    .map(
      ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`
    )
    .join("&");
  return q ? `?${q}` : "";
}

/**
 * Mengambil daftar SOP (Knowledge Base).
 * Memanggil GET /api/v1/kb-entry
 */
export async function listKBSolutions(
  params: Record<string, any>
): Promise<Paginated<KBEntryBackend>> {
  const endpoint = `/kb-entry${qs(params)}`;

  const response = await apiClient.get<ServerPaginatedResponse<KBEntryBackend>>(
    endpoint
  );
  const serverData = response.data;
  const results = serverData.results ?? [];
  const total = serverData.totalResults ?? results.length;

  return {
    data: results,
    meta: {
      page: 1,
      limit: total,
      total: total,
      totalPages: 1,
    },
  };
}
