import apiClient from "@/lib/apiClient";
import type { StockMovement, StockMoveType } from "../model/types";
import type { Paginated } from "@/features/tickets/api/tickets";

type ServerPaginatedResponse<T> = {
  results: T[];
  page: number;
  limit: number;
  totalResults: number;
  totalPages: number;
};

type CreateStockMovementInput = {
  partId: string;
  type: StockMoveType;
  quantity: number;
  reference?: string;
  notes?: string;
};

/**
 * Membuat record pergerakan stok baru.
 * Memanggil POST /stock-movements
 */
export async function createStockMovement(
  data: CreateStockMovementInput
): Promise<StockMovement> {
  const endpoint = "/stock-movements";
  const response = await apiClient.post<StockMovement>(endpoint, data);
  return response.data;
}

/**
 * Mengambil daftar riwayat pergerakan stok (paginasi).
 * Memanggil GET /stock-movements
 */
export async function listStockMovements(
  params: Record<string, any>
): Promise<Paginated<StockMovement>> {
  const qs = (params: Record<string, any>): string => {
    const q = Object.entries(params)
      .filter(
        ([, v]) => v !== undefined && v !== null && v !== "" && v !== "all"
      )
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join("&");
    return q ? `?${q}` : "";
  };

  const endpoint = `/stock-movements${qs(params)}`;

  const response = await apiClient.get<ServerPaginatedResponse<StockMovement>>(
    endpoint
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
