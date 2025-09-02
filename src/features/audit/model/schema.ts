import { z } from "zod";

export const AuditFormSchema = z.object({
  score: z.number().min(0).max(100),
  tags: z.array(z.string().min(1)).min(1, "Minimal 1 tag"),
  notes: z.string().optional(),
});
export type AuditFormInput = z.infer<typeof AuditFormSchema>;
