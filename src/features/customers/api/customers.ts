import apiClient from "@/lib/apiClient";
import type { Customer } from "../model/types";
import type { CustomerFormInput } from "../model/schema";

export type Paginated<T> = {
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

export async function listCustomers(
  params: Record<string, any>
): Promise<Paginated<Customer>> {
  const response = await apiClient.get<Paginated<Customer>>(
    `/customers${qs(params)}`
  );
  return response.data;
}

/**
 * Mengambil satu data pelanggan
 * (Meskipun data sudah ada di list, ini memastikan kita mengedit data terbaru)
 */
export async function getCustomerById(id: string): Promise<Customer> {
  const response = await apiClient.get<Customer>(`/customers/${id}`);
  return response.data;
}

/**
 * Mengupdate data pelanggan
 */
export async function updateCustomer(
  id: string,
  data: CustomerFormInput
): Promise<Customer> {
  const response = await apiClient.patch<Customer>(`/customers/${id}`, data);
  return response.data;
}
