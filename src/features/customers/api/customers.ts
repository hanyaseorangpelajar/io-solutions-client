import apiClient from "@/lib/apiClient";
import type { CustomerDto } from "../model/types";
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
      ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
    )
    .join("&");
  return q ? `?${q}` : "";
}

export async function listCustomers(
  params: Record<string, any>,
): Promise<Paginated<CustomerDto>> {
  const response = await apiClient.get<Paginated<CustomerDto>>(
    `/customers${qs(params)}`,
  );
  return response.data;
}

export async function getCustomerById(id: string): Promise<CustomerDto> {
  const response = await apiClient.get<CustomerDto>(`/customers/${id}`);
  return response.data;
}

export async function updateCustomer(
  id: string,
  payload: CustomerFormInput,
): Promise<CustomerDto> {
  const response = await apiClient.patch<CustomerDto>(
    `/customers/${id}`,
    payload,
  );
  return response.data;
}
