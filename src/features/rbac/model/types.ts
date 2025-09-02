export type PermissionId = string; // fleksibel: "tickets.read", "inventory.write", dst.

export type Role = {
  id: string;
  name: string;
  description?: string;
  permissions: PermissionId[];
  system?: boolean; // true jika role bawaan (tidak boleh dihapus)
};
