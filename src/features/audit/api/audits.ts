import apiClient from "@/lib/apiClient";
import type { Paginated } from "@/features/tickets/api/tickets";
import type { AuditRecord, AuditStatus, AuditLogItem } from "../model/types";

function qs(params: Record<string, any>): string {
  const q = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "" && v !== "all")
    .map(
      ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`
    )
    .join("&");
  return q ? `?${q}` : "";
}

type UpdateAuditInput = {
  status?: AuditStatus;
  score?: number;
  notes?: string;
  tags?: string[];
  publish?: boolean;
};

/**
 * Mengambil daftar audit records (paginasi).
 * Memanggil GET /api/v1/audits
 */
export async function listAudits(
  params: Record<string, any>
  // PERBAIKAN: Gunakan tipe AuditLogItem
): Promise<Paginated<AuditLogItem>> {
  const endpoint = `/audits${qs(params)}`;
  // PERBAIKAN: Harapkan tipe AuditLogItem
  const response = await apiClient.get<Paginated<AuditLogItem>>(endpoint);
  return response.data;
}

/**
 * Memperbarui audit record.
 */
export async function updateAudit(
  id: string,
  data: UpdateAuditInput
  // PERBAIKAN: Gunakan tipe AuditLogItem
): Promise<AuditLogItem> {
  const endpoint = `/audits/${encodeURIComponent(id)}`;
  // PERBAIKAN: Harapkan tipe AuditLogItem
  const response = await apiClient.patch<AuditLogItem>(endpoint, data);
  return response.data;
}

/**
 * Menghapus audit record.
 */
export async function deleteAudit(id: string): Promise<void> {
  const endpoint = `/audits/${encodeURIComponent(id)}`;
  await apiClient.delete<void>(endpoint);
}
