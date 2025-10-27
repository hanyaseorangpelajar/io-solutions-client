import apiClient from "@/lib/apiClient";
import type { Staff } from "../model/types";
import type { StaffFormInput } from "../model/schema";

const ENDPOINT = "/users";

/**
 * Mengambil daftar semua user (staff)
 */
export async function getStaffList(): Promise<Staff[]> {
  const response = await apiClient.get<{ results: Staff[] }>(ENDPOINT);
  return response.data.results;
}

/**
 * Membuat user (staff) baru
 */
export async function createStaff(data: StaffFormInput): Promise<Staff> {
  const response = await apiClient.post<Staff>(ENDPOINT, data);
  return response.data;
}

/**
 * Mengupdate user (staff)
 */
export async function updateStaff(
  id: string,
  data: StaffFormInput
): Promise<Staff> {
  // const response = await apiClient.put<Staff>(`${ENDPOINT}/${id}`, data); // <-- Ganti ini
  const response = await apiClient.patch<Staff>(`${ENDPOINT}/${id}`, data); // <-- Menjadi ini
  return response.data;
}

/**
 * Mengubah status aktif/nonaktif user
 */
export async function updateStaffStatus(
  id: string,
  active: boolean
): Promise<Staff> {
  const response = await apiClient.patch<Staff>(`${ENDPOINT}/${id}/status`, {
    active,
  });
  return response.data;
}

/**
 * Menghapus user (staff)
 */
export async function deleteStaff(id: string): Promise<void> {
  await apiClient.delete<void>(`${ENDPOINT}/${id}`);
}
