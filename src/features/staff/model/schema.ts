import { z } from "zod";

export const StaffFormSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  phone: z.string().optional(),
  roleIds: z.array(z.string()).min(1, "Pilih minimal 1 role"),
  active: z.boolean().default(true),
});
export type StaffFormInput = z.infer<typeof StaffFormSchema>;
