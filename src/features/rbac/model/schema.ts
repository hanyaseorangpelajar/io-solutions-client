import { z } from "zod";

export const RoleFormSchema = z.object({
  name: z.string().min(2, "Nama role minimal 2 karakter"),
  description: z.string().optional(),
  permissions: z.array(z.string()).min(1, "Pilih minimal 1 permission"),
});
export type RoleFormInput = z.infer<typeof RoleFormSchema>;
