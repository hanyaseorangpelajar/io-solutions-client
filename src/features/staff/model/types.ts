export const ROLES = ["Teknisi", "Admin", "SysAdmin"] as const;
export type StaffRole = (typeof ROLES)[number];

export type Staff = {
  id: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  active: boolean;
  role: StaffRole;
  department?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
};
