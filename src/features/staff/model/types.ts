export type Staff = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  active: boolean;
  roleIds: string[]; // refer ke Role.id
};
