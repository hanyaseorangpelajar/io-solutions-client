export const ROLES = ["TEKNISI", "ADMIN", "SYSADMIN"] as const;
export type StaffRole = (typeof ROLES)[number];

export interface StaffDto {
  userId: string;
  name: string;
  username: string;
  isActive: boolean;
  role: StaffRole;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  password: string;
  confirmPassword: string;
  token: string;
  refreshToken: string;
  id: string;
}
