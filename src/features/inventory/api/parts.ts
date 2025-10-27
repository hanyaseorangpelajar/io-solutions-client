// src/features/inventory/api/parts.ts
// PERBAIKAN: Impor apiClient yang benar
import apiClient from "@/lib/apiClient";

// Tipe data Part berdasarkan part.model.js
export type Part = {
  id: string;
  name: string;
  stock: number;
  sku?: string;
  category?: string;
  vendor?: string;
  unit?: string;
  minStock?: number;
  location?: string;
  price?: number;
  status: "active" | "inactive" | "discontinued";
};

// Fungsi untuk mengambil daftar semua part
export async function listParts(): Promise<Part[]> {
  // TODO: Pastikan endpoint ini benar sesuai router utama Anda
  const endpoint = "/api/v1/parts";

  // PERBAIKAN: Gunakan apiClient dan asumsikan struktur { results: Part[] }
  // seperti 'getStaffList'
  const response = await apiClient.get<Part[]>(endpoint);
  return response.data; // response.data sekarang adalah array Part[]
}
