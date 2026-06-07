import apiClient from "@/lib/apiClient";
import type { StaffDto } from "../model/types";
import type { StaffFormInput } from "../ui/StaffFormModal";

const ENDPOINT = "/users";

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

export async function getStaffList(
  params: Record<string, any> = {},
): Promise<Paginated<StaffDto>> {
  const response = await apiClient.get<Paginated<StaffDto>>(
    `${ENDPOINT}${qs(params)}`,
  );
  return response.data;
}

export async function createStaff(data: StaffFormInput): Promise<StaffDto> {
  const response = await apiClient.post<StaffDto>(ENDPOINT, data);
  return response.data;
}

export async function updateStaff(
  id: string,
  data: StaffFormInput,
): Promise<StaffDto> {
  const response = await apiClient.patch<StaffDto>(`${ENDPOINT}/${id}`, data);
  return response.data;
}

export async function updateStaffStatus(
  id: string,
  isActive: boolean,
): Promise<StaffDto> {
  const response = await apiClient.patch<StaffDto>(`${ENDPOINT}/${id}`, {
    isActive,
  });
  return response.data;
}

export interface StaffDto {
  id: string;
  nama: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  password: string;
  confirmPassword: string;
  token: string;
  refreshToken: string;
}
