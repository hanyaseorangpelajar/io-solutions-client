export const ROLES = ["Teknisi", "Admin", "SysAdmin"] as const;
export type StaffRole = (typeof ROLES)[number];

export type Staff = {
  id: string;
  nama: string;
  username: string;
  statusAktif: boolean;
  role: StaffRole;
  dibuatPada: string;
  diperbaruiPada: string;
};
