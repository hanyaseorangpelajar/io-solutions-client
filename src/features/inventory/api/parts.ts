import apiClient from "@/lib/apiClient";
import type { PartFormInput } from "../model/schema";

export type Part = {
  id: string;
  name: string;
  stock: number;
  sku?: string;
  category?: string;
  vendor?: string;
  unit: string;
  minStock?: number;
  location?: string;
  price?: number;
  status: "active" | "inactive" | "discontinued";
};

export async function listParts(): Promise<Part[]> {
  const endpoint = "/parts";
  const response = await apiClient.get<Part[]>(endpoint);
  return response.data;
}

export async function createPart(data: PartFormInput): Promise<Part> {
  const endpoint = "/parts";
  const response = await apiClient.post<Part>(endpoint, data);
  return response.data;
}

export async function updatePart(
  id: string,
  data: PartFormInput
): Promise<Part> {
  const endpoint = `/parts/${encodeURIComponent(id)}`;
  const response = await apiClient.put<Part>(endpoint, data);
  return response.data;
}

export async function deletePart(id: string): Promise<void> {
  const endpoint = `/parts/${encodeURIComponent(id)}`;
  await apiClient.delete<void>(endpoint);
}
